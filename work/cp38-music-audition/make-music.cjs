// CP-38 music audition (files only; no build, no game change). Six loopable background tracks in different styles,
// generated in code with the Web Audio calls the game already uses (oscillators, gain envelopes, biquad filters, looped
// noise), rendered through an offline stand-in for Web Audio like the CP-33 sound audition. Each track goes through a
// music bus into the game's master gain (0.55), so the levels below are what the game would play at Music volume 100%.
// Coin sounds for comparison come from the shipped sfx code in work/cp38/release.html (UAT 38), read only.
const fs = require('fs'), path = require('path'), vm = require('vm');
const SR = 44100, OUT = path.resolve(__dirname, '../../tickets/CP-38-evidence/music-audition');
fs.mkdirSync(OUT, { recursive: true });

// ---------- offline Web Audio stand-in ----------
class Param {
  constructor(v) { this.v = v; this.ev = []; }
  set value(x) { this.v = x; } get value() { return this.v; }
  setValueAtTime(x, t) { this.ev.push({ k: 'set', x, t }); }
  exponentialRampToValueAtTime(x, t) { this.ev.push({ k: 'exp', x, t }); }
  linearRampToValueAtTime(x, t) { this.ev.push({ k: 'lin', x, t }); }
  cancelScheduledValues(t) { this.ev = this.ev.filter(e => e.t < t); }
  at(t) {
    let v = this.v, t0 = 0;
    for (const e of this.ev) {
      if (e.k === 'set') { if (t < e.t) return v; v = e.x; t0 = e.t; }
      else { if (t < e.t) { const u = (t - t0) / (e.t - t0); return e.k === 'exp' ? v * Math.pow(e.x / v, u) : v + (e.x - v) * u; } v = e.x; t0 = e.t; }
    }
    return v;
  }
}
function makeAC() {
  const voices = [];
  class Node { constructor() { this.out = null; } connect(n) { this.out = n; } }
  const ac = {
    currentTime: 0, sampleRate: SR, state: 'running', resume() {}, destination: new Node(), stem: '',
    createGain() { const n = new Node(); n.gain = new Param(1); return n; },
    createOscillator() { const n = new Node(); n.frequency = new Param(440); n.type = 'sine'; n.start = t => { n.t0 = t; n.stem = ac.stem; voices.push(n); }; n.stop = t => { n.t1 = t; }; return n; },
    createBuffer(ch, len) { const d = new Float32Array(len); return { getChannelData: () => d, length: len }; },
    createBufferSource() { const n = new Node(); n.start = (t, off) => { n.t0 = t; n.off = off || 0; n.stem = ac.stem; voices.push(n); }; n.stop = t => { n.t1 = t; }; return n; },
    createBiquadFilter() { const n = new Node(); n.type = 'lowpass'; n.frequency = new Param(350); n.Q = new Param(1); return n; },
  };
  ac.voices = voices; return ac;
}
// RBJ biquads as Web Audio defines them (lowpass/highpass Q in dB, bandpass Q linear).
function coeffs(fl) {
  const w = 2 * Math.PI * fl.frequency.v / SR, cw = Math.cos(w), sw = Math.sin(w);
  const Q = fl.type === 'bandpass' ? fl.Q.v : Math.pow(10, fl.Q.v / 20), al = sw / (2 * Q), a0 = 1 + al;
  let b0, b1, b2;
  if (fl.type === 'bandpass') { b0 = al; b1 = 0; b2 = -al; }
  else if (fl.type === 'highpass') { b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = (1 + cw) / 2; }
  else { b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = (1 - cw) / 2; }
  return [b0 / a0, b1 / a0, b2 / a0, -2 * cw / a0, (1 - al) / a0];
}
function render(ac, dur, stem) {
  const out = new Float32Array(Math.ceil(dur * SR));
  for (const n of ac.voices) {
    if (stem && n.stem !== stem) continue;
    const chain = []; let x = n.out; while (x && x !== ac.destination) { chain.push(x); x = x.out; }
    const gains = chain.filter(c => c.gain), fl = chain.find(c => c.Q);
    const C = fl ? coeffs(fl) : null; let ph = 0, pos = Math.round((n.off || 0) * SR), x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    const s0 = Math.max(0, Math.ceil(n.t0 * SR)), s1 = Math.min(out.length, Math.ceil(n.t1 * SR));
    if (n.t0 < 0) pos += Math.round(-n.t0 * SR);
    for (let s = s0; s < s1; s++) {
      const t = Math.max(s / SR, n.t0); let y; // never before the voice starts (float rounding)
      if (n.frequency) {
        ph += n.frequency.at(t) / SR; ph -= Math.floor(ph);
        y = n.type === 'sine' ? Math.sin(2 * Math.PI * ph) : n.type === 'square' ? (ph < .5 ? 1 : -1) : n.type === 'sawtooth' ? 2 * ph - 1 : 1 - 4 * Math.abs(ph - .5);
      } else { const d = n.buffer.getChannelData(); y = d[pos++ % d.length]; }
      if (C) { const z = C[0] * y + C[1] * x1 + C[2] * x2 - C[3] * y1 - C[4] * y2; x2 = x1; x1 = y; y2 = y1; y1 = z; y = z; }
      for (const g of gains) y *= g.gain.at(t);
      out[s] += y;
    }
  }
  return out;
}
function wav(file, a) {
  const b = Buffer.alloc(44 + a.length * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + a.length * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(a.length * 2, 40);
  for (let k = 0; k < a.length; k++) b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(a[k] * 32767))), 44 + k * 2);
  fs.writeFileSync(file, b);
}
function phoneBand(a) {
  const C = coeffs({ type: 'highpass', frequency: { v: 250 }, Q: { v: 0 } }); let x = a;
  for (let p = 0; p < 2; p++) { const y = new Float32Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let s = 0; s < x.length; s++) { const z = C[0] * x[s] + C[1] * x1 + C[2] * x2 - C[3] * y1 - C[4] * y2; x2 = x1; x1 = x[s]; y2 = y1; y1 = z; y[s] = z; } x = y; }
  return x;
}
const peak = a => a.reduce((m, x) => Math.max(m, Math.abs(x)), 0), rms = a => Math.sqrt(a.reduce((m, x) => m + x * x, 0) / a.length);
const r3 = x => +x.toFixed(3), r4 = x => +x.toFixed(4), dB = x => +(20 * Math.log10(x)).toFixed(1);
function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// ---------- music kit: only Web Audio calls the game already makes ----------
function kit(ac, dest, rand) {
  const nb = ac.createBuffer(1, SR, SR), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rand() * 2 - 1;
  function env(g, t, dur, vol, o) {
    const a = o.a || .005; g.gain.setValueAtTime(.0001, t);
    if (o.lin) g.gain.linearRampToValueAtTime(vol, t + a); else g.gain.exponentialRampToValueAtTime(vol, t + a);
    if (o.hold) g.gain.exponentialRampToValueAtTime(vol * (o.sus ?? 1), t + Math.max(a + .001, o.hold));
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  }
  function filt(src, o) {
    if (!(o.lp || o.hp || o.bp)) return src;
    const f = ac.createBiquadFilter(); f.type = o.lp ? 'lowpass' : o.hp ? 'highpass' : 'bandpass';
    f.frequency.value = o.lp || o.hp || o.bp; f.Q.value = o.q ?? (o.bp ? 1 : 0); src.connect(f); return f;
  }
  const K = {
    rand,
    set stem(s) { ac.stem = s; },
    tone(f, t, dur, type, vol, o = {}) {
      if (!(vol > 0)) return; const n = ac.createOscillator(), g = ac.createGain();
      n.type = type; n.frequency.setValueAtTime(f, t); if (o.fEnd) n.frequency.exponentialRampToValueAtTime(o.fEnd, t + (o.glide || dur));
      env(g, t, dur, vol, o); filt(n, o).connect(g); g.connect(dest); n.start(t); n.stop(t + dur + .03);
    },
    noise(t, dur, vol, o = {}) {
      const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = nb; s.loop = true;
      env(g, t, dur, vol, o); filt(s, o).connect(g); g.connect(dest); s.start(t, rand() * .9); s.stop(t + dur + .02);
    },
  };
  // shared drums
  K.kick = (t, v = 1) => { K.tone(150, t, .24, 'sine', .3 * v, { fEnd: 48, glide: .12 }); K.tone(320, t, .04, 'triangle', .12 * v, { fEnd: 120 }); K.noise(t, .008, .12 * v, { bp: 3000, q: .7 }); };
  K.snare = (t, v = 1, lp) => { K.noise(t, .17, .22 * v, { bp: lp ? 1400 : 1900, q: .6 }); K.noise(t, .06, (lp ? .04 : .1) * v, { bp: 5200, q: .8 }); K.tone(200, t, .08, 'triangle', .14 * v, { fEnd: 160 }); };
  K.clap = (t, v = 1) => { for (let k = 0; k < 3; k++) K.noise(t + k * .011, .02, .2 * v, { bp: 1500, q: 1.1 }); K.noise(t + .033, .15, .16 * v, { bp: 1350, q: .9 }); };
  K.hat = (t, v = 1, open) => K.noise(t, open ? .17 : .035, .075 * v, { bp: 9000, q: .8 });
  K.shaker = (t, v = 1) => K.noise(t, .055, .05 * v, { bp: 6800, q: 1, a: .014, lin: true });
  return K;
}
const NN = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = s => { const m = /^([A-G])([#b]?)(\d)$/.exec(s); if (!m) throw new Error('note ' + s); return 12 * (+m[3] + 1) + NN[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); };
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
// bars of "Name:beats" tokens ('r' = rest) -> [{b,m,d}], each bar must fill beatsPerBar
function seq(bars, bpb = 4, start = 0) {
  const out = []; bars.forEach((bar, i) => {
    let b = start + i * bpb; for (const tok of bar.trim().split(/\s+/)) { const [n, d] = tok.split(':'); if (n !== 'r') out.push({ b, m: midi(n), d: +d }); b += +d; }
    if (Math.abs(b - start - (i + 1) * bpb) > 1e-9) throw new Error('bar ' + i + ' has ' + (b - start - i * bpb) + ' beats: ' + bar);
  }); return out;
}
const swing = (b, sw) => { const i = Math.floor(b + 1e-9), f = b - i; return Math.abs(f - .5) < 1e-9 ? i + sw : b; };
const meow = (K, t, f, v) => { K.tone(f, t, .28, 'triangle', .07 * v, { fEnd: f * 1.5, a: .02 }); K.tone(f * 1.5, t + .14, .32, 'triangle', .05 * v, { fEnd: f * .9, a: .02 }); };

// ---------- the six tracks ----------
const TRACKS = [];

// 1. Lo-fi cat café: 78 BPM swung, Fmaj7 Em7 Dm9 G7 three times, warm electric piano, soft muffled beat, vinyl hiss.
TRACKS.push({ file: 'music-1-lofi.wav', title: 'Lo-fi cat café', bpm: 78, bars: 12, play(K, t0, len) {
  const B = 60 / 78, sw = .6, T = b => t0 + swing(b, sw) * B;
  const CH = [{ r: 41, v: [57, 64, 67, 72] }, { r: 40, v: [55, 59, 62, 67] }, { r: 38, v: [53, 60, 64, 69] }, { r: 43, v: [53, 59, 64, 69] }];
  const ep = (f, t, dur, v) => { K.tone(f, t, dur, 'sine', v, { a: .012 }); K.tone(f * 2, t, dur * .35, 'sine', v * .3); K.tone(f * 1.003, t, dur, 'triangle', v * .4, { a: .012, lp: 1800 }); };
  const bass = (m, t, dur, v = 1) => { const f = hz(m); K.tone(f, t, dur, 'sine', .16 * v, { a: .012, hold: dur * .6, sus: .7 }); K.tone(f * 2, t, dur * .7, 'triangle', .1 * v, { a: .012, lp: 900 }); };
  const lead = (m, t, dur) => { const f = hz(m); K.tone(f, t, dur, 'sine', .11, { a: .035, hold: dur * .7, sus: .8 }); K.tone(f, t, dur, 'triangle', .04, { a: .035, lp: 2200, hold: dur * .7, sus: .8 }); K.tone(f * 2, t, dur * .4, 'sine', .015, { a: .02 }); };
  for (let i = 0; i < 12; i++) {
    const c = CH[i % 4], b0 = i * 4;
    K.stem = 'keys'; c.v.forEach((m, k) => { ep(hz(m), T(b0) + k * .014, 2.6, .05); ep(hz(m), T(b0 + 2.5) + k * .01, 1.4, .034); });
    K.stem = 'bass'; bass(c.r, T(b0), 1.3 * B); bass(c.r, T(b0 + 1.5), .4 * B, .7); bass(c.r + 7, T(b0 + 2), 1.1 * B); bass(c.r + 12, T(b0 + 3.5), .4 * B, .7);
    K.stem = 'drums'; K.kick(T(b0), .9); K.kick(T(b0 + 2.5), .65); K.snare(T(b0 + 1), 1.1, true); K.snare(T(b0 + 3), 1.1, true);
    for (let e = 0; e < 8; e++) K.noise(T(b0 + e / 2), .04, (e & 1 ? .06 : .09), { bp: 6000, q: .7 });
  }
  K.stem = 'lead';
  const mel = seq(['C5:1.5 A4:.5 G4:1 E4:1', 'G4:1.5 B4:.5 D5:2', 'C5:1 A4:.5 G4:.5 F4:2', 'G4:1 B4:1 A4:2',
    'E5:1 D5:.5 C5:1.5 r:1', 'D5:1 B4:1 G4:2', 'A4:1.5 C5:.5 F5:1.5 E5:.5', 'D5:2 B4:1 D5:1',
    'C5:1.5 A4:.5 G4:1 E4:1', 'G4:1.5 B4:.5 D5:1 E5:1', 'F5:1 E5:.5 D5:.5 C5:1 A4:1', 'G4:2 r:2']);
  for (const n of mel) lead(n.m, T(n.b), (swing(n.b + n.d, sw) - swing(n.b, sw)) * B * .95);
  meow(K, T(46.5), 659.25, .8);
  K.stem = 'vinyl'; K.noise(t0 - .25, len + .5, .012, { lp: 3200, a: .5, lin: true, hold: len }); // crossfades into the next loop
  for (let k = 0; k < len * 3; k++) K.noise(t0 + K.rand() * len, .004, .05 + K.rand() * .05, { bp: 2500 + K.rand() * 3000, q: .6 });
} });

// 2. Bouncy arcade / chiptune: 150 BPM, square-wave lead with a short echo, 16th arpeggios, triangle bass, noise drums.
TRACKS.push({ file: 'music-2-chiptune.wav', title: 'Bouncy arcade chiptune', bpm: 150, bars: 20, play(K, t0) {
  const B = .4, T = b => t0 + b * B;
  const PROG = 'C G Am F C G F G Am F C G Am F D G F G Am G'.split(' ');
  const CH = { C: [60, 64, 67], G: [59, 62, 67], Am: [57, 60, 64], F: [57, 60, 65], D: [57, 62, 66] }, ROOT = { C: 48, G: 43, Am: 45, F: 41, D: 38 };
  const sq = (m, t, dur, v) => K.tone(hz(m), t, dur, 'square', v, { a: .003, hold: dur * .8, sus: .75 });
  PROG.forEach((c, i) => {
    const b0 = i * 4;
    K.stem = 'arp'; for (let s = 0; s < 16; s++) { const ch = CH[c]; sq([ch[0], ch[1], ch[2], ch[1] + 12][s % 4] + 12, T(b0 + s / 4), .07, .014); }
    K.stem = 'bass'; for (let e = 0; e < 8; e++) { const m = ROOT[c] + (e & 1 ? 12 : 0), f = hz(m); K.tone(f, T(b0 + e / 2), B * .45, 'triangle', .18, { a: .003, hold: B * .35, sus: .8 }); K.tone(f * 2, T(b0 + e / 2), B * .3, 'sine', .06); }
    K.stem = 'drums';
    const ck = (t, v) => { K.tone(190, t, .12, 'triangle', .45 * v, { fEnd: 50 }); K.noise(t, .01, .12 * v, { bp: 2500, q: .7 }); };
    ck(T(b0), 1); ck(T(b0 + 2), 1); ck(T(b0 + 2.5), .6);
    const cs = (t, v) => K.noise(t, .12, .2 * v, { bp: 3500, q: .4 });
    if (i % 8 === 7 || i === 19) { cs(T(b0 + 1), 1); for (let e = 4; e < 8; e++) cs(T(b0 + e / 2), .55 + e * .08); }
    else { cs(T(b0 + 1), 1); cs(T(b0 + 3), 1); }
    for (let e = 0; e < 8; e++) K.noise(T(b0 + e / 2), .02, e & 1 ? .04 : .06, { bp: 9500, q: 1 });
  });
  K.stem = 'lead';
  const mel = seq([
    'E5:.5 G5:.5 C6:.5 G5:.5 E5:.5 G5:.5 C6:1', 'B5:.5 A5:.5 G5:.5 D5:.5 G5:1 r:1', 'A5:.5 C6:.5 E6:.5 C6:.5 A5:.5 G5:.5 E5:1', 'F5:.5 A5:.5 C6:1 A5:.5 G5:.5 F5:1',
    'E5:.5 G5:.5 C6:.5 D6:.5 E6:1 D6:.5 C6:.5', 'B5:1 G5:.5 B5:.5 D6:1 r:1', 'C6:.5 A5:.5 F5:.5 A5:.5 C6:.5 D6:.5 C6:.5 A5:.5', 'G5:1.5 A5:.5 B5:1 D6:1',
    'E6:1 D6:.5 C6:.5 B5:.5 C6:.5 A5:1', 'A5:.5 C6:.5 F6:1 E6:.5 D6:.5 C6:1', 'G5:.5 C6:.5 E6:.5 G6:.5 E6:1 C6:1', 'D6:1.5 B5:.5 G5:1 r:1',
    'E6:.5 E6:.5 r:.5 E6:.5 D6:.5 C6:.5 B5:.5 A5:.5', 'A5:.5 F5:.5 A5:.5 C6:.5 F6:1 E6:1', 'F#5:.5 A5:.5 D6:.5 F#6:.5 E6:1 D6:1', 'B5:.5 D6:.5 G6:1 F6:1 D6:1',
    'C6:.5 D6:.5 C6:.5 A5:.5 F5:1 A5:1', 'B5:.5 C6:.5 D6:.5 B5:.5 G5:2', 'C6:.5 B5:.5 A5:.5 E5:.5 A5:1 C6:1', 'D6:.5 C6:.5 B5:.5 A5:.5 G5:.5 A5:.5 B5:.5 D6:.5']);
  for (const n of mel) { const dur = n.d * B * .9; sq(n.m - 12, T(n.b), dur, .06); sq(n.m - 12, T(n.b + .75), dur * .8, .018); }
} });

// 3. Funky disco: 116 BPM, four on the floor, claps, open hats, octave bass, string pads and stabs, scratchy guitar.
TRACKS.push({ file: 'music-3-disco.wav', title: 'Funky disco', bpm: 116, bars: 16, play(K, t0) {
  const B = 60 / 116, T = b => t0 + b * B;
  const PROG = ['Am7', 'D9', 'Am7', 'D9', 'Am7', 'D9', 'Am7', 'D9', 'Fmaj7', 'Fmaj7', 'Em7', 'Em7', 'Dm7', 'Dm7', 'E7', 'E7'];
  const V = { Am7: [64, 67, 69, 72], D9: [66, 69, 72, 76], Fmaj7: [65, 69, 72, 76], Em7: [64, 67, 71, 74], Dm7: [62, 65, 69, 72], E7: [64, 68, 71, 74] };
  const R = { Am7: 45, D9: 38, Fmaj7: 41, Em7: 40, Dm7: 38, E7: 40 }, SEV = { Am7: 10, D9: 10, Fmaj7: 11, Em7: 10, Dm7: 10, E7: 10 };
  const str = (m, t, dur, v, a = .3) => { for (const det of [1, 1.004]) K.tone(hz(m) * det, t, dur, 'sawtooth', v, { a, lin: true, lp: 2800, hold: Math.max(a + .01, dur - .15), sus: .9 }); };
  PROG.forEach((c, i) => {
    const b0 = i * 4, r = R[c];
    K.stem = 'drums'; for (let q = 0; q < 4; q++) K.kick(T(b0 + q), 1); K.clap(T(b0 + 1), 1.5); K.clap(T(b0 + 3), 1.5);
    for (let q = 0; q < 4; q++) { K.hat(T(b0 + q + .5), 1.6, true); K.hat(T(b0 + q), .7); }
    K.stem = 'bass'; [0, 12, 0, 12, 0, 12, SEV[c], 12].forEach((iv, e) => { const f = hz(r + iv), t = T(b0 + e / 2); K.tone(f, t, B * .42, 'sawtooth', .1, { lp: 1000, q: 6, hold: B * .3, sus: .6 }); K.tone(f, t, B * .42, 'sine', .08, { hold: B * .3, sus: .6 }); });
    K.stem = 'strings'; for (const m of V[c]) str(m, T(b0), 4 * B + .1, i < 8 ? .006 : .009);
    if (i < 8) for (const sb of (c === 'Am7' ? [1.5, 3] : [.5, 1.5, 2.5])) for (const m of V[c]) str(m + 12, T(b0 + sb), .28, .016, .01);
    if (i === 7 || i === 15) for (const det of [1, 1.006]) K.tone(300 * det, T(b0 + 3), B, 'sawtooth', .02, { fEnd: 1300, a: .1, lin: true, lp: 3500, hold: B * .8 });
    K.stem = 'guitar'; for (let s = 0; s < 16; s++) if (s & 1) K.noise(T(b0 + s / 4), .025, .055, { bp: 2800, q: 3 });
    for (const sb of [.5, 1.5, 2.5, 3.5]) for (const m of V[c].slice(1)) K.tone(hz(m), T(b0 + sb), .07, 'square', .009, { lp: 2200 });
  });
  K.stem = 'lead';
  const mel = seq(['A5:2 G5:1 A5:1', 'C6:3 r:1', 'B5:2 A5:1 G5:1', 'E5:3 r:1', 'F5:2 E5:1 D5:1', 'A5:3 r:1', 'G#5:2 B5:1 D6:1', 'E6:2 D6:1 B5:1'], 4, 32);
  for (const n of mel) str(n.m, T(n.b), n.d * B * .95, .035, .05);
} });

// 4. Kawaii J-pop: 144 BPM, D major (D A Bm G verse, G A F#m Bm chorus), bell-topped square lead, bubbly plucks.
TRACKS.push({ file: 'music-4-kawaii-pop.wav', title: 'Kawaii bubbly pop', bpm: 144, bars: 20, play(K, t0) {
  const B = 60 / 144, T = b => t0 + b * B;
  const PROG = 'D A Bm G D A Bm G G A F#m Bm G A D D G A D A'.split(' ');
  const V = { D: [62, 66, 69], A: [61, 64, 69], Bm: [62, 66, 71], G: [62, 67, 71], 'F#m': [61, 66, 69] }, R = { D: 38, A: 45, Bm: 47, G: 43, 'F#m': 42 };
  PROG.forEach((c, i) => {
    const b0 = i * 4, chorus = i >= 8 && i < 16;
    K.stem = 'drums'; K.kick(T(b0), 1); K.kick(T(b0 + 2), .9); if (chorus) K.kick(T(b0 + 2.5), .6);
    K.snare(T(b0 + 1), .9); K.clap(T(b0 + 1), .8); K.snare(T(b0 + 3), .9); K.clap(T(b0 + 3), .8);
    for (let e = 0; e < 8; e++) K.hat(T(b0 + e / 2), e & 1 ? .5 : .8);
    if (chorus) for (let s = 0; s < 16; s++) K.shaker(T(b0 + s / 4), s % 4 === 2 ? 1 : .6);
    K.stem = 'plucks'; for (let e = 1; e < 8; e += 2) for (const m of V[c]) { K.tone(hz(m + 12), T(b0 + e / 2), .18, 'triangle', .03); K.tone(hz(m + 12), T(b0 + e / 2), .09, 'square', .007, { lp: 3000 }); }
    if (chorus) { K.stem = 'sparkle'; for (let s = 0; s < 16; s++) { const f = hz(V[c][s % 3] + 24); K.tone(f, T(b0 + s / 4), .15, 'sine', .022); } }
    K.stem = 'bass'; [0, 0, 12, 0, 0, 7, 12, 7].forEach((iv, e) => { const f = hz(R[c] + iv), t = T(b0 + e / 2); K.tone(f, t, B * .45, 'sine', .1, { hold: B * .3, sus: .7 }); K.tone(f, t, B * .4, 'square', .03, { lp: 700 }); K.tone(f * 2, t, B * .3, 'sine', .05); });
  });
  K.stem = 'lead';
  const mel = seq([
    'F#5:.5 A5:.5 B5:.5 A5:.5 F#5:1 D5:1', 'E5:.5 F#5:.5 A5:.5 C#6:.5 B5:1 A5:1', 'B5:.5 D6:.5 C#6:.5 B5:.5 A5:.5 F#5:.5 D5:1', 'E5:.5 F#5:.5 G5:.5 A5:.5 B5:1 A5:1',
    'F#5:.5 A5:.5 D6:.5 A5:.5 F#6:1 E6:1', 'C#6:.5 E6:.5 A5:.5 C#6:.5 E6:1 D6:.5 C#6:.5', 'D6:.5 B5:.5 F#5:.5 B5:.5 D6:.5 E6:.5 F#6:1', 'G6:.5 F#6:.5 E6:.5 D6:.5 E6:1 A5:1',
    'B5:1 D6:1 G6:1 F#6:.5 E6:.5', 'E6:1.5 F#6:.5 E6:1 C#6:1', 'C#6:1 F#6:1 A6:1 F#6:.5 E6:.5', 'D6:1.5 C#6:.5 B5:1 A5:1',
    'B5:.5 B5:.5 D6:.5 E6:.5 G6:1 F#6:.5 G6:.5', 'A6:1 G6:.5 F#6:.5 E6:1 C#6:1', 'D6:.5 F#6:.5 A6:.5 F#6:.5 D6:1 A5:1', 'D6:2 r:2',
    'G5:.5 B5:.5 D6:.5 G6:.5 F#6:1 E6:1', 'E6:.5 C#6:.5 A5:.5 C#6:.5 E6:1 A6:1', 'F#6:1 E6:.5 D6:.5 A5:2', 'C#6:.5 D6:.5 E6:.5 F#6:.5 E6:.5 D6:.5 C#6:.5 A5:.5']);
  for (const n of mel) {
    const f = hz(n.m - 12), t = T(n.b), dur = n.d * B * .92;
    K.tone(f, t, dur, 'square', .035, { a: .004, lp: 4000, hold: dur * .7, sus: .6 }); K.tone(f, t, dur, 'triangle', .06, { hold: dur * .7, sus: .6 });
    K.tone(f * 2, t, .3, 'sine', .035); K.tone(f * 4, t, .12, 'sine', .012);
  }
  meow(K, T(62), 739.99, .9);
} });

// 5. Swing jazz: 150 BPM swung, two choruses of an F blues, walking bass, piano comping and melody, brushes and ride.
TRACKS.push({ file: 'music-5-swing-jazz.wav', title: 'Swing jazz', bpm: 150, bars: 24, play(K, t0) {
  const B = .4, sw = .64, T = b => t0 + swing(b, sw) * B;
  const BL = ['F7', 'Bb7', 'F7', 'F7', 'Bb7', 'Bb7', 'F7', 'D7', 'Gm7', 'C7', 'F7', 'C7'], PROG = BL.concat(BL);
  const V = { F7: [57, 63, 67], Bb7: [56, 62, 67], D7: [54, 60, 64], Gm7: [53, 58, 62], C7: [52, 58, 62] };
  const ROOT = { F7: 41, Bb7: 46, D7: 38, Gm7: 43, C7: 48 }, IV = { F7: [0, 4, 7, 10], Bb7: [0, 4, 7, 10], D7: [0, 4, 7, 10], Gm7: [0, 3, 7, 10], C7: [0, 4, 7, 10] };
  const piano = (m, t, dur, v) => { const f = hz(m); K.tone(f, t, dur, 'sine', v, { a: .004 }); K.tone(f * 2, t, dur * .6, 'sine', v * .35, { a: .003 }); K.tone(f * 3, t, dur * .3, 'sine', v * .12); K.tone(f * 1.001, t, dur, 'triangle', v * .25, { lp: 2500 }); };
  const COMP = [[[0, .45], [1.5, .6]], [[1.5, .45], [3.5, .5]], [[0, .4], [2.5, .7]], [[.5, .4], [2, .4], [3.5, .45]]];
  let prev = 41;
  PROG.forEach((c, i) => {
    const b0 = i * 4, nextC = PROG[(i + 1) % PROG.length];
    K.stem = 'piano'; for (const [cb, cd] of COMP[i % 4]) V[c].forEach((m, k) => piano(m, T(b0 + cb) + k * .006, cd * B * 2.2, .04));
    // walking bass: root, chord tone, fifth, chromatic approach into the next root
    K.stem = 'bass';
    let r = ROOT[c]; while (r - prev > 6) r -= 12; while (prev - r > 6) r += 12; if (r < 36) r += 12; if (r > 50) r -= 12;
    let nr = ROOT[nextC]; while (nr - r > 6) nr -= 12; while (r - nr > 6) nr += 12;
    const up = i % 2 === 0, iv = IV[c], line = up ? [r, r + iv[1], r + iv[2], nr - 1] : [r, r + iv[3] - 12, r + iv[2] - 12, nr + 1];
    line.forEach((m, q) => { const f = hz(m), t = T(b0 + q); K.tone(f, t, B * 1.05, 'triangle', .2, { a: .008, hold: B * .5, sus: .6 }); K.tone(f, t, B * 1.05, 'sine', .1, { a: .008, hold: B * .5, sus: .6 }); K.tone(f * 2, t, .1, 'sine', .07); });
    prev = line[3];
    K.stem = 'drums';
    const ride = (t, v) => { K.noise(t, .3, .045 * v, { bp: 8000, q: 3 }); for (const [f, a] of [[3150, 1], [4720, .7], [6010, .5]]) K.tone(f, t, .35, 'sine', .012 * v * a); };
    for (const q of [0, 1, 1.5, 2, 3, 3.5]) ride(T(b0 + q), q % 1 ? .6 : (q & 1 ? 1 : .8));
    for (const q of [1, 3]) { K.noise(T(b0 + q), .03, .05, { bp: 6000, q: 2 }); K.noise(T(b0 + q), .14, .13, { bp: 2600, q: .6 }); }
    for (let q = 0; q < 4; q++) { K.noise(T(b0 + q), B * .95, .035, { bp: 3600, q: .5, a: B * .6, lin: true }); K.tone(70, T(b0 + q), .1, 'sine', .08); }
  });
  K.stem = 'melody';
  const head1 = ['C5:.5 D5:.5 F5:.5 Ab5:.5 A5:1 F5:1', 'Ab5:.5 F5:.5 D5:.5 F5:.5 Ab5:1 r:1', 'C5:.5 D5:.5 F5:.5 Ab5:.5 A5:.5 C6:.5 A5:1', 'r:2 Eb5:.5 E5:.5 F5:1',
    'D6:1 C6:.5 Bb5:.5 Ab5:1 F5:1', 'D5:.5 F5:.5 Ab5:.5 Bb5:.5 D6:1 r:1', 'C6:.5 A5:.5 F5:.5 C5:.5 Eb5:.5 E5:.5 F5:1', 'F#5:1 A5:.5 C6:.5 D6:1 r:1',
    'Bb5:.5 A5:.5 G5:.5 F5:.5 D5:1 F5:1', 'E5:.5 G5:.5 Bb5:.5 C6:.5 D6:1 C6:1', 'A5:1 F5:.5 C5:.5 D5:.5 F5:.5 r:1', 'G5:.5 Bb5:.5 E5:.5 G5:.5 C5:1 r:1'];
  const head2 = ['r:1 A5:.5 C6:.5 Eb6:.5 D6:.5 C6:1', 'D6:.5 C6:.5 Ab5:.5 F5:.5 G5:1 F5:1', 'r:1 F5:.5 A5:.5 C6:.5 Eb6:.5 F6:1', 'Eb6:.5 D6:.5 C6:.5 A5:.5 Ab5:.5 F5:.5 Eb5:1',
    'D5:.5 F5:.5 Ab5:.5 C6:.5 D6:2', 'r:1 F6:.5 D6:.5 Ab5:1 F5:1', 'A5:.5 C6:.5 A5:.5 F5:.5 C6:2', 'C6:.5 A5:.5 F#5:.5 D5:.5 Eb5:.5 F#5:.5 A5:1',
    'G5:1 Bb5:1 D6:1 F6:1', 'E6:.5 D6:.5 C6:.5 Bb5:.5 G5:2', 'A5:1.5 F5:.5 r:2', 'G5:.5 A5:.5 Bb5:.5 B5:.5 C6:.5 r:1.5'];
  for (const n of seq(head1.concat(head2))) piano(n.m, T(n.b), Math.max(.18, (swing(n.b + n.d, sw) - swing(n.b, sw)) * B * 1.3), .085);
} });

// 6. Tropical calypso: 120 BPM, C major, steel-drum lead (rolled on long notes), shaker, congas, clave, strummed offbeats.
TRACKS.push({ file: 'music-6-tropical.wav', title: 'Tropical calypso', bpm: 120, bars: 18, play(K, t0) {
  const B = .5, T = b => t0 + b * B;
  const PROG = 'C C F G7 C C G7 C C C F G7 C C G7 C F G7'.split(' ');
  const V = { C: [60, 64, 67], F: [60, 65, 69], G7: [59, 62, 65, 67] }, R = { C: 48, F: 41, G7: 43 };
  const pan = (m, t, v) => { const f = hz(m); K.tone(f, t, .7, 'sine', v, { a: .003 }); K.tone(f * 2, t, .45, 'sine', v * .5); K.tone(f * 3, t, .2, 'sine', v * .18); K.noise(t, .01, v * .4, { bp: 4000, q: 1 }); };
  PROG.forEach((c, i) => {
    const b0 = i * 4, r = R[c];
    K.stem = 'percussion';
    for (let s = 0; s < 16; s++) K.shaker(T(b0 + s / 4), [.6, .35, 1, .35][s % 4]);
    K.kick(T(b0), .7); K.kick(T(b0 + 2), .6);
    const conga = (t, f, v) => K.tone(f, t, .16, 'sine', .16 * v, { fEnd: f * .9 });
    conga(T(b0 + 2.5), 330, .8); conga(T(b0 + 3), 220, 1); conga(T(b0 + 3.5), 220, .9);
    K.noise(T(b0 + 1), .03, .1, { bp: 1500, q: 1 }); K.tone(400, T(b0 + 1), .05, 'sine', .08);
    for (const q of (i % 2 ? [1, 2] : [0, 1.5, 3])) { K.tone(2400, T(b0 + q), .045, 'sine', .07); K.tone(1600, T(b0 + q), .04, 'sine', .04); }
    K.stem = 'bass'; [[0, 0, 1.5], [1.5, 7, .5], [2, 0, 1], [3, 7, .5], [3.5, 12, .5]].forEach(([q, iv, d]) => { const f = hz(r + iv), t = T(b0 + q); K.tone(f, t, d * B * .95, 'triangle', .2, { hold: d * B * .6, sus: .7 }); K.tone(f * 2, t, d * B * .7, 'sine', .07); });
    K.stem = 'strum'; for (let e = 1; e < 8; e += 2) V[c].forEach((m, k) => { const t = T(b0 + e / 2) + k * .008; K.tone(hz(m), t, .15, 'triangle', .035); K.tone(hz(m), t, .1, 'square', .01, { lp: 2500 }); });
  });
  K.stem = 'lead';
  const mel = seq([
    'E5:.5 G5:.5 C6:.5 E6:1 D6:.5 C6:1', 'G5:.5 A5:.5 G5:.5 E5:.5 G5:2', 'A5:.5 C6:.5 F6:.5 A6:1 G6:.5 F6:1', 'D6:.5 F6:.5 E6:.5 D6:.5 B5:2',
    'E5:.5 G5:.5 C6:.5 E6:1 G6:.5 E6:1', 'C6:.5 D6:.5 E6:.5 C6:.5 A5:1 G5:1', 'F5:.5 G5:.5 B5:.5 D6:.5 F6:1 D6:1', 'C6:3 r:1',
    'G6:1 E6:.5 G6:.5 r:.5 E6:.5 C6:1', 'D6:.5 E6:.5 D6:.5 C6:.5 A5:1 G5:1', 'F5:.5 A5:.5 C6:.5 F6:.5 r:.5 F6:.5 E6:.5 F6:.5', 'G6:1.5 F6:.5 D6:1 B5:1',
    'C6:.5 E6:.5 G6:.5 E6:.5 C6:.5 E6:.5 G6:1', 'A6:1 G6:.5 E6:.5 C6:1 D6:1', 'B5:.5 D6:.5 F6:.5 E6:.5 D6:1 B5:1', 'C6:2 G5:1 E5:1',
    'A5:.5 C6:.5 F6:1 E6:.5 D6:.5 C6:1', 'B5:.5 D6:.5 G6:.5 F6:.5 D6:.5 B5:.5 G5:1']);
  for (const n of mel) {
    pan(n.m - 12, T(n.b), .11);
    if (n.d >= 1.5) for (let t = .125; t < n.d * B - .1; t += .125) pan(n.m - 12, T(n.b) + t, .07); // steel-pan roll on long notes
  }
} });

// ---------- render ----------
function sfxContext(seed) {
  const src = fs.readFileSync(path.resolve(__dirname, '../cp38/release.html'), 'utf8');
  const i = src.indexOf('const sfx = (() => {'), j = src.indexOf('})();', i) + 5;
  const ac = makeAC(), c = { S: { muted: false }, inBackground: false, document: { hidden: false }, Math: Object.create(Math), pickupFx: { volume: 1 } };
  c.Math.random = seeded(seed); c.window = { AudioContext: function () { return ac; } };
  vm.createContext(c); vm.runInContext(src.slice(i, j) + ';globalThis.sfx=sfx;', c); return { sfx: c.sfx, ac };
}
// Coin sounds from the shipped code, for comparison.
function coin(kind) { const { sfx, ac } = sfxContext(7); ac.currentTime = .1; sfx[kind](); const a = render(ac, .8), w = a.slice(Math.round(SR * .1), Math.round(SR * .2)); return { peak: r3(peak(a)), rms100ms: r4(rms(w)), phoneBandRms100ms: r4(rms(phoneBand(a).slice(Math.round(SR * .1), Math.round(SR * .2)))) }; }
const coins = { land: coin('land'), clink: coin('clink') };
// The UAT 38 background track as it plays now (Music volume 50%), from the shipped bgm code, for comparison.
function uat38() {
  const { sfx, ac } = sfxContext(11); sfx.unlock(); sfx.bgmBus(.5, .001);
  const STEP = 60 / 112 / 2, N = 64, L = STEP * N;
  const BASS = [87.31, 73.42, 116.54, 130.81, 87.31, 110, 116.54, 130.81];
  const PAD = [[349.23, 440, 523.25], [293.66, 349.23, 440], [293.66, 349.23, 466.16], [329.63, 392, 523.25], [349.23, 440, 523.25], [329.63, 440, 523.25], [293.66, 349.23, 466.16], [329.63, 392, 466.16]];
  const SCALE = [349.23, 392, 440, 523.25, 587.33, 698.46, 783.99];
  const MEL = [[5, -1, 4, -1, 3, 4, -1, 2, 3, -1, -1, 1, 2, -1, -1, -1], [2, -1, 3, -1, 4, -1, 5, 4, 3, -1, 2, -1, 1, -1, -1, -1], [5, -1, 4, -1, 3, 4, 5, -1, 4, -1, 3, -1, 2, -1, -1, -1], [0, 1, 2, -1, 3, -1, 4, -1, 5, -1, 6, -1, 5, -1, -1, -1]];
  for (let k = 0; k < 2 * N; k++) {
    const i = k % N, d = .01 + k * STEP, bar = i >> 3, s = i & 7;
    if (s === 0 || s === 4) sfx.bgm('kick', d); if (s === 2 || s === 6) sfx.bgm('rim', d); if (s & 1) sfx.bgm('shaker', d);
    if (s === 0) sfx.bgm('pad', d, PAD[bar]);
    const r = BASS[bar]; if (s === 0) sfx.bgm('bass', d, r); else if (s === 3) sfx.bgm('bass', d, r * 1.5); else if (s === 4) sfx.bgm('bass', d, r * 2); else if (s === 6) sfx.bgm('bass', d, r * 1.5);
    const m = MEL[bar >> 1][(bar & 1) * 8 + s]; if (m >= 0) sfx.bgm('mar', d, SCALE[m]); if (i === N - 2) sfx.bgm('meow', d, 698.46);
  }
  const a = render(ac, 2 * L + 1).slice(Math.round(L * SR), Math.round(2 * L * SR)); return { lengthSec: r3(L), peak: r3(peak(a)), rms: r4(rms(a)), phoneBandRms: r4(rms(phoneBand(a))) };
}
const ref = uat38();

// Every track is mixed to the same loudness where a phone speaker plays (above 250 Hz): TARGET_DB over one coin
// landing's phone-band RMS, at Music volume 100% (through master 0.55).
const TARGET_DB = +(process.env.TARGET_DB || 6), TARGET = coins.land.phoneBandRms100ms * Math.pow(10, TARGET_DB / 20);
const results = [];
for (const tr of TRACKS) {
  const L = tr.bars * 4 * 60 / tr.bpm, ac = makeAC(), master = ac.createGain(), bus = ac.createGain();
  master.gain.value = .55; master.connect(ac.destination); bus.gain.value = 1; bus.connect(master);
  for (const lp of [0, 1]) { const K = kit(ac, bus, seeded(1234)); tr.play(K, lp * L, L); }
  // loop 2 of 2: it starts with the tails of loop 1, so the file loops seamlessly
  const cut = a => a.slice(Math.round(L * SR), Math.round(2 * L * SR));
  const raw = cut(render(ac, 2 * L + 1)), gain = TARGET / rms(phoneBand(raw));
  const a = raw.map(x => x * gain);
  wav(path.join(OUT, tr.file), a);
  const stems = {}; for (const s of [...new Set(ac.voices.map(v => v.stem))]) stems[s] = r4(rms(phoneBand(cut(render(ac, 2 * L + 1, s)))) * gain);
  const seam = Math.abs(a[a.length - 1] - a[0]);
  // loudness over time: quietest and loudest half-second
  const pb = phoneBand(a), w = Math.round(SR / 2), win = []; for (let k = 0; k + w <= a.length; k += w) win.push(rms(pb.subarray(k, k + w)));
  results.push({ file: tr.file, style: tr.title, bpm: tr.bpm, bars: tr.bars, lengthSec: r3(L), mixGain: r3(gain), peak: r3(peak(a)), rms: r4(rms(a)), phoneBandRms: r4(rms(phoneBand(a))),
    phoneBandHalfSecondMin: r4(Math.min(...win)), phoneBandHalfSecondMax: r4(Math.max(...win)), phoneBandVsCoinLandingDb: dB(rms(phoneBand(a)) / coins.land.phoneBandRms100ms), phoneBandVsUat38Db: dB(rms(phoneBand(a)) / ref.phoneBandRms), seamStep: r4(seam), stemsRms: stems });
  console.log(tr.file, JSON.stringify(results[results.length - 1]));
}
fs.writeFileSync(path.join(OUT, 'levels.json'), JSON.stringify({
  render: 'offline stand-in for Web Audio (oscillators, gain envelopes, biquad filters, looped noise), 44.1 kHz mono 16-bit; music bus into master gain 0.55 as in the game; levels at Music volume 100%',
  coinSoundsFromShippedCode: { ...coins, note: 'UAT 38 sfx.land() and sfx.clink(); RMS over the first 100 ms (the sound itself)' },
  uat38TrackAtMusicVolume50: ref, targetPhoneBandRms: r4(TARGET), targetDbOverCoinLanding: TARGET_DB, phoneBand: 'RMS after a 4th-order 250 Hz highpass, roughly what a phone speaker can play',
  note: 'mixGain is the factor applied to the raw mix to reach the target (in the game it would be baked into the note volumes); stemsRms are phone-band; each file loops seamlessly (it is the second of two rendered loops)',
  tracks: results }, null, 1));
console.log('coins', JSON.stringify(coins), 'uat38', JSON.stringify(ref));
