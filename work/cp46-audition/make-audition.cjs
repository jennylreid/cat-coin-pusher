// CP-46 audition (files only; no build, no game change). Six new background-music loops, varied coin sounds and pusher
// sound options, generated in code with the Web Audio calls the game already uses (oscillators, gain envelopes, biquad
// filters, looped noise), rendered through the offline Web Audio stand-in copied from work/cp38-music-audition/make-music.cjs.
// Everything goes through the game's master gain (0.55). Run: node work/cp46-audition/make-audition.cjs
const fs = require('fs'), path = require('path'), vm = require('vm');
const SR = 44100, OUT = path.resolve(__dirname, '../../tickets/CP-46-evidence/audition');
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


// ======================================================================================================================
// MUSIC: six new loops. Styles chosen to differ from the CP-38 round (lo-fi, chiptune, disco, kawaii pop, swing jazz,
// tropical) except track 6, a new take in the Kawaii direction Jenny liked best. Every track has a tappable pulse on
// every beat and keeps its bass an octave up with a strong 2nd harmonic so it carries on a phone speaker.
// ======================================================================================================================
const TRACKS = [];
const pizz = (K, m, t, v, bright = 1) => { const f = hz(m); K.tone(f, t, .32, 'sine', v); K.tone(f, t, .2, 'triangle', v * .6, { lp: 1600 * bright }); K.tone(f * 2, t, .09, 'sine', v * .3); K.noise(t, .008, v * .35, { bp: 2400, q: .8 }); };
const woodblock = (K, t, hi, v = 1) => { const f = hi ? 1250 : 940; K.tone(f, t, .05, 'sine', .09 * v, { fEnd: f * .94 }); K.noise(t, .012, .06 * v, { bp: f * 2, q: 3 }); };
const snap = (K, t, v = 1) => { K.noise(t, .025, .2 * v, { bp: 2600, q: 1.4 }); K.noise(t, .06, .06 * v, { bp: 1300, q: 1 }); };

// 1. Pizzicato caper: 132 BPM, D minor, tiptoeing plucked strings, staccato bassoon, woodblock tick-tock on every beat.
TRACKS.push({ file: 'music-A-pizzicato-caper.wav', title: 'Pizzicato caper', bpm: 132, bars: 16, play(K, t0) {
  const B = 60 / 132, T = b => t0 + b * B;
  const PROG = 'Dm Dm Gm A7 Dm Dm Bb A7 F C Dm A7 Bb Gm A7 Dm'.split(' ');
  const V = { Dm: [62, 65, 69], Gm: [62, 67, 70], A7: [61, 64, 67], Bb: [62, 65, 70], F: [60, 65, 69], C: [60, 64, 67] };
  const R = { Dm: 50, Gm: 43, A7: 45, Bb: 46, F: 41, C: 48 };
  PROG.forEach((c, i) => {
    const b0 = i * 4, r = R[c];
    K.stem = 'beat'; for (let q = 0; q < 4; q++) woodblock(K, T(b0 + q), q % 2 === 0, q === 0 ? 1.1 : .8);
    K.kick(T(b0), .7); K.kick(T(b0 + 2), .6); snap(K, T(b0 + 1)); snap(K, T(b0 + 3));
    K.stem = 'pizz'; pizz(K, r, T(b0), .16); pizz(K, r + 7, T(b0 + 2), .14);
    for (const q of [1, 3]) V[c].forEach((m, k) => pizz(K, m, T(b0 + q) + k * .006, .045));
    if (i % 2) V[c].forEach((m, k) => pizz(K, m, T(b0 + 3.5) + k * .006, .03));
  });
  K.stem = 'bassoon';
  const bsn = (m, t, dur, v) => { const f = hz(m); K.tone(f, t, dur, 'sawtooth', v, { a: .012, lp: 1300, q: 3, hold: dur * .6, sus: .7 }); K.tone(f, t, dur, 'triangle', v * 1.2, { a: .012, hold: dur * .6, sus: .7 }); K.tone(f * 2, t, dur * .5, 'sine', v * .5, { a: .01 }); };
  for (const n of seq(['D4:.5 r:.5 F4:.5 r:.5 A4:.5 G4:.5 F4:.5 E4:.5', 'D4:.5 r:.5 A3:.5 r:.5 D4:1 r:1', 'G4:.5 r:.5 Bb4:.5 r:.5 D5:.5 C5:.5 Bb4:.5 A4:.5', 'G4:.5 r:.5 E4:.5 r:.5 C#4:1 A3:1',
    'D4:.5 E4:.5 F4:.5 G4:.5 A4:.5 r:.5 A4:.5 r:.5', 'Bb4:.5 A4:.5 G4:.5 F4:.5 E4:1 r:1', 'F4:.5 r:.5 D4:.5 r:.5 Bb3:.5 D4:.5 F4:.5 Bb4:.5', 'A4:1 r:.5 E4:.5 A3:1 r:1'])) bsn(n.m, T(n.b), Math.min(n.d, .5) * B * .8, .05);
  for (const n of seq(['F4:2 C4:2', 'E4:2 G4:2', 'F4:2 A4:2', 'E4:2 C#4:2', 'D4:2 F4:2', 'D4:2 Bb3:2', 'C#4:2 E4:2', 'D4:2 r:2'], 4, 32)) bsn(n.m, T(n.b), n.d * B * .9, .025);
  K.stem = 'violin';
  for (const n of seq(['A5:.5 C6:.5 A5:.5 F5:.5 C5:1 F5:1', 'G5:.5 E5:.5 C5:.5 E5:.5 G5:1 r:1', 'F5:.5 A5:.5 D6:.5 A5:.5 F5:.5 D5:.5 A4:1', 'C#5:.5 E5:.5 G5:.5 E5:.5 A5:2',
    'D6:.5 Bb5:.5 F5:.5 Bb5:.5 D6:1 C6:1', 'Bb5:.5 G5:.5 D5:.5 G5:.5 Bb5:1 A5:1', 'G5:.5 F5:.5 E5:.5 C#5:.5 E5:.5 G5:.5 A5:1', 'D6:.5 r:.5 A5:.5 r:.5 D5:.5 r:1.5'], 4, 32)) pizz(K, n.m, T(n.b), .1, 1.6);
} });

// 2. Sunny ukulele and marimba: 112 BPM, C major, strummed uke (down-down-up-up-down-up), marimba tune, whistle on the
// last four bars, claps on 2 and 4, shaker.
TRACKS.push({ file: 'music-B-sunny-ukulele.wav', title: 'Sunny ukulele and marimba', bpm: 112, bars: 12, play(K, t0) {
  const B = 60 / 112, T = b => t0 + b * B;
  const PROG = [['C'], ['Em'], ['F'], ['G'], ['C'], ['Em'], ['F', 'G'], ['C'], ['F'], ['G'], ['Am'], ['G']];
  const V = { C: [67, 60, 64, 72], Em: [67, 59, 64, 71], F: [69, 60, 65, 72], G: [67, 62, 71, 74], Am: [69, 60, 64, 72] }, R = { C: 48, Em: 40, F: 41, G: 43, Am: 45 };
  const string = (m, t, v) => { const f = hz(m); K.tone(f, t, .28, 'triangle', v); K.tone(f, t, .12, 'sawtooth', v * .25, { lp: 2600 }); K.tone(f * 2, t, .06, 'sine', v * .25); };
  const STRUM = [[0, 1, 1], [1, 1, .8], [1.5, -1, .55], [2.5, -1, .6], [3, 1, .85], [3.5, -1, .55]];
  PROG.forEach((cs, i) => {
    const b0 = i * 4;
    K.stem = 'drums'; K.kick(T(b0), .9); K.kick(T(b0 + 2), .8); if (i % 2) K.kick(T(b0 + 2.5), .5); K.clap(T(b0 + 1), 1.1); K.clap(T(b0 + 3), 1.1);
    for (let s = 0; s < 16; s++) K.shaker(T(b0 + s / 4), [.8, .35, .6, .35][s % 4]);
    K.stem = 'uke'; for (const [q, dir, v] of STRUM) { const c = cs.length > 1 && q >= 2 ? cs[1] : cs[0], ns = dir > 0 ? V[c] : [...V[c]].reverse(); ns.forEach((m, k) => string(m, T(b0 + q) + k * .011, .034 * v)); }
    K.stem = 'bass'; cs.forEach((c, h) => { const r = R[c], hb = b0 + h * 2, steps = cs.length > 1 ? [[0, 0, 1], [1, 7, .5], [1.5, 12, .5]] : [[0, 0, 1.5], [1.5, 7, .5], [2, 12, 1], [3, 7, .5], [3.5, 0, .5]];
      for (const [q, iv, d] of steps) { const f = hz(r + iv), t = T(hb + q); K.tone(f, t, d * B * .9, 'triangle', .17, { hold: d * B * .5, sus: .7 }); K.tone(f * 2, t, d * B * .6, 'sine', .07); } });
  });
  K.stem = 'marimba';
  const mar = (m, t, v) => { const f = hz(m); K.tone(f, t, .45, 'sine', v); K.tone(f * 3.93, t, .06, 'sine', v * .35); K.tone(f * 2, t, .1, 'sine', v * .2); K.noise(t, .006, v * .3, { bp: 3000, q: 1 }); };
  const mel = seq(['E5:.5 G5:.5 C6:.5 G5:.5 A5:.5 G5:.5 E5:1', 'D5:.5 E5:.5 G5:.5 B5:.5 G5:1 r:1', 'C6:.5 A5:.5 F5:.5 A5:.5 C6:.5 D6:.5 C6:1', 'B5:.5 G5:.5 D5:.5 G5:.5 B5:1 D6:1',
    'E6:1 D6:.5 C6:.5 G5:1 E5:1', 'G5:.5 B5:.5 E6:.5 D6:.5 B5:1 G5:1', 'A5:.5 C6:.5 F6:.5 E6:.5 D6:.5 B5:.5 G5:1', 'C6:1.5 G5:.5 E5:1 r:1',
    'F5:.5 A5:.5 C6:.5 F6:.5 E6:1 C6:1', 'D6:.5 B5:.5 G5:.5 B5:.5 D6:1 G6:1', 'E6:.5 C6:.5 A5:.5 C6:.5 E6:.5 G6:.5 E6:1', 'D6:.5 E6:.5 D6:.5 B5:.5 G5:1 r:1']);
  for (const n of mel) { mar(n.m - 12, T(n.b), .12); if (n.d >= 1) mar(n.m - 12, T(n.b + .5), .05); }
  K.stem = 'whistle'; for (const n of mel.filter(n => n.b >= 32)) { const f = hz(n.m), d = n.d * B * .9; K.tone(f * .97, T(n.b), d, 'sine', .07, { fEnd: f, glide: .05, a: .03, hold: d * .7, sus: .8 }); }
} });

// 3. Bossa café: 132 BPM bossa nova in F, nylon-guitar comping with a thumb bass, rim clave, shaker, a soft pulse on
// every beat, breathy flute tune.
TRACKS.push({ file: 'music-C-bossa-cafe.wav', title: 'Bossa café', bpm: 132, bars: 16, play(K, t0) {
  const B = 60 / 132, T = b => t0 + b * B;
  const PROG = 'Fmaj7 Fmaj7 Gm7 C7 Am7 D7 Gm7 C7 Fmaj7 F7 Bbmaj7 Eb7 Am7 D7 Gm7 C7'.split(' ');
  const V = { Fmaj7: [57, 60, 64], Gm7: [58, 62, 65], C7: [58, 64, 67], Am7: [55, 60, 64], D7: [54, 60, 66], F7: [57, 63, 65], Bbmaj7: [57, 62, 65], Eb7: [55, 61, 63] };
  const R = { Fmaj7: 41, Gm7: 43, C7: 48, Am7: 45, D7: 50, F7: 41, Bbmaj7: 46, Eb7: 51 };
  const nylon = (m, t, dur, v) => { const f = hz(m); K.tone(f, t, dur, 'sine', v, { a: .004 }); K.tone(f, t, dur * .5, 'triangle', v * .5, { lp: 1800 }); K.tone(f * 2, t, dur * .3, 'sine', v * .25); };
  PROG.forEach((c, i) => {
    const b0 = i * 4, r = R[c];
    K.stem = 'guitar'; for (const q of (i % 2 ? [1, 2.5] : [0, 1.5, 3])) V[c].forEach((m, k) => nylon(m, T(b0 + q) + k * .009, .5, .045));
    for (const [q, iv, d] of [[0, 0, 1.5], [1.5, 7, .5], [2, 7, 2]]) { const f = hz(r + iv), t = T(b0 + q); K.tone(f, t, d * B, 'triangle', .15, { a: .006, hold: d * B * .4, sus: .6 }); K.tone(f * 2, t, d * B * .5, 'sine', .08); }
    K.stem = 'perc';
    for (const q of (i % 2 ? [1, 2.5] : [0, 1.5, 3])) { K.noise(T(b0 + q), .03, .09, { bp: 1700, q: 2 }); K.tone(1050, T(b0 + q), .035, 'sine', .05); }
    for (let e = 0; e < 8; e++) K.shaker(T(b0 + e / 2), e % 2 ? .55 : 1);
    for (let q = 0; q < 4; q++) { K.kick(T(b0 + q), q % 2 ? .6 : .85); K.noise(T(b0 + q), .03, .09, { bp: 7000, q: 1 }); K.tone(1500, T(b0 + q), .02, 'sine', .03); }
  });
  K.stem = 'flute';
  const mel = seq(['A5:1.5 G5:.5 F5:1 E5:1', 'F5:.5 G5:1 A5:2.5', 'Bb5:1.5 A5:.5 G5:1 F5:1', 'E5:.5 F5:.5 G5:2 r:1',
    'C6:1.5 G5:.5 E5:1 A5:1', 'F#5:1 A5:1 C6:1.5 r:.5', 'Bb5:1.5 A5:.5 G5:.5 F5:.5 D5:1', 'E5:1 G5:1 Bb5:1 r:1',
    'A5:1.5 C6:.5 E6:1 C6:1', 'Eb6:1.5 C6:.5 A5:1 F5:1', 'D6:1.5 C6:.5 A5:1 F5:1', 'G5:1 Bb5:1 Db6:1.5 r:.5',
    'C6:1.5 B5:.5 A5:1 G5:1', 'F#5:1.5 E5:.5 D5:1 C6:1', 'Bb5:1.5 A5:.5 G5:1 D6:1', 'C6:1 Bb5:.5 G5:.5 E5:1 r:1']);
  for (const n of mel) { const f = hz(n.m - 12), t = T(n.b), d = n.d * B * .92;
    K.tone(f, t, d, 'sine', .1, { a: .05, lin: true, hold: d * .75, sus: .85 }); K.tone(f * 2, t, d, 'triangle', .012, { a: .05, lin: true, lp: 3000, hold: d * .7 });
    K.noise(t, Math.min(d, .25), .025, { bp: f * 2, q: 4, a: .03, lin: true }); }
} });

// 4. Toy-box pop: 128 BPM, G major, a music-box tune, toy-piano offbeats, glockenspiel sparkle in the second half,
// four-on-the-floor kick, claps, a meow at the end.
TRACKS.push({ file: 'music-D-toy-box-pop.wav', title: 'Toy-box pop', bpm: 128, bars: 16, play(K, t0) {
  const B = 60 / 128, T = b => t0 + b * B;
  const PROG = 'G D Em C G D C D Em C G D C D G G'.split(' ');
  const V = { G: [67, 71, 74], D: [66, 69, 74], Em: [67, 71, 76], C: [67, 72, 76] }, R = { G: 43, D: 50, Em: 52, C: 48 };
  PROG.forEach((c, i) => {
    const b0 = i * 4, second = i >= 8;
    K.stem = 'drums'; for (let q = 0; q < 4; q++) K.kick(T(b0 + q), .8); K.clap(T(b0 + 1), 1); K.clap(T(b0 + 3), 1);
    for (let e = 0; e < 8; e++) K.hat(T(b0 + e / 2), e % 2 ? .9 : .4);
    K.stem = 'toypiano'; for (const e of [1, 3, 5, 7]) V[c].forEach(m => { const f = hz(m); K.tone(f, T(b0 + e / 2), .2, 'triangle', .026); K.tone(f * 3.01, T(b0 + e / 2), .06, 'sine', .01); K.tone(f, T(b0 + e / 2), .08, 'square', .006, { lp: 2500 }); });
    if (second) { K.stem = 'glock'; for (let s = 0; s < 8; s++) { const f = hz(V[c][s % 3] + 24); K.tone(f, T(b0 + s / 2 + .25), .25, 'sine', .016); K.tone(f * 2.76, T(b0 + s / 2 + .25), .06, 'sine', .005); } }
    K.stem = 'bass'; [0, 12, 0, 12, 0, 12, 7, 12].forEach((iv, e) => { const f = hz(R[c] + iv), t = T(b0 + e / 2); K.tone(f, t, B * .42, 'sine', .11, { hold: B * .25, sus: .6 }); K.tone(f, t, B * .35, 'square', .025, { lp: 900 }); K.tone(f * 2, t, B * .25, 'sine', .05); });
  });
  K.stem = 'musicbox';
  const mel = seq(['D6:.5 B5:.5 G5:.5 B5:.5 D6:1 G6:1', 'F#6:.5 E6:.5 D6:.5 A5:.5 D6:2', 'E6:.5 G6:.5 B6:.5 G6:.5 E6:1 B5:1', 'C6:.5 E6:.5 G6:.5 E6:.5 D6:1 C6:1',
    'B5:.5 D6:.5 G6:.5 D6:.5 B6:1 A6:.5 G6:.5', 'A6:1 F#6:.5 D6:.5 E6:1 F#6:1', 'G6:.5 E6:.5 C6:.5 E6:.5 G6:1 E6:1', 'D6:1 A5:.5 B5:.5 C6:.5 D6:.5 F#6:1',
    'G6:1 B6:1 A6:.5 G6:.5 E6:1', 'E6:1 G6:1 F#6:.5 E6:.5 C6:1', 'D6:.5 G6:.5 B6:.5 G6:.5 D7:1 B6:1', 'A6:1.5 B6:.5 A6:1 F#6:1',
    'E6:.5 G6:.5 C7:.5 B6:.5 A6:1 G6:1', 'F#6:.5 A6:.5 D7:.5 C7:.5 B6:1 A6:1', 'G6:.5 B6:.5 A6:.5 G6:.5 D6:1 B5:1', 'G6:2 r:2']);
  for (const n of mel) { const f = hz(n.m - 12), t = T(n.b); K.tone(f, t, .9, 'sine', .085, { a: .003 }); K.tone(f * 2, t, .45, 'sine', .03); K.tone(f * 3, t, .15, 'sine', .012); K.tone(f * 5.4, t, .05, 'sine', .006); }
  meow(K, T(62), 783.99, .9);
} });

// 5. Funky strut: 100 BPM, E minor groove, clavinet, slap-style octave bass, horn stabs and a horn line, tight drums,
// tambourine.
TRACKS.push({ file: 'music-E-funky-strut.wav', title: 'Funky strut', bpm: 100, bars: 12, play(K, t0) {
  const B = .6, T = b => t0 + b * B;
  const PROG = 'Em7 A7 Em7 A7 Em7 A7 Em7 A7 C7 B7 Em7 A7'.split(' ');
  const V = { Em7: [62, 67, 71], A7: [61, 67, 69], C7: [58, 64, 67], B7: [57, 63, 66] }, R = { Em7: 40, A7: 45, C7: 48, B7: 47 }, SEV = { Em7: 10, A7: 10, C7: 10, B7: 10 };
  const horn = (m, t, dur, v) => { for (const det of [1, 1.005]) K.tone(hz(m) * det, t, dur, 'sawtooth', v, { a: .02, lp: 2400, hold: Math.max(.03, dur * .7), sus: .8 }); };
  PROG.forEach((c, i) => {
    const b0 = i * 4, r = R[c];
    K.stem = 'drums'; K.kick(T(b0), 1.1); K.kick(T(b0 + 1.5), .7); K.kick(T(b0 + 2), 1); K.kick(T(b0 + 2.75), .5);
    K.snare(T(b0 + 1), 1.2); K.snare(T(b0 + 3), 1.2); K.snare(T(b0 + 3.75), .3);
    for (let s = 0; s < 16; s++) K.hat(T(b0 + s / 4), s % 4 === 2 ? 1 : s % 2 ? .35 : .6);
    for (let q = 0; q < 4; q++) K.noise(T(b0 + q), .07, .05, { bp: 7500, q: 1.5 });
    K.stem = 'clav'; for (const [q, d] of [[0, .2], [.75, .1], [1.5, .2], [2.25, .1], [2.5, .2], [3.25, .1], [3.5, .15]]) V[c].forEach(m => K.tone(hz(m), T(b0 + q), d * B * 1.4, 'square', .012, { bp: 1500, q: 1.2 }));
    K.stem = 'bass'; for (const [q, iv, d] of [[0, 0, .4], [.75, 12, .15], [1.5, 0, .3], [2, SEV[c], .2], [2.5, 0, .3], [3, 12, .15], [3.5, 7, .3]]) {
      const f = hz(r + iv), t = T(q + b0); K.tone(f, t, d * B * 1.6, 'sawtooth', .07, { lp: 1100, q: 5, hold: d * B, sus: .6 }); K.tone(f, t, d * B * 1.6, 'sine', .1, { hold: d * B, sus: .6 }); K.tone(f * 2, t, .06, 'triangle', iv === 12 ? .08 : .04); }
    K.stem = 'horns'; if (i < 4 && i % 2) for (const q of [2.5, 3.5]) V[c].forEach(m => horn(m + 12, T(b0 + q), .16, .014));
  });
  K.stem = 'horns';
  for (const n of seq(['r:1 B4:.5 D5:.5 E5:.5 r:.5 G5:.5 E5:.5', 'A5:.5 r:.5 G5:.5 E5:.5 C#5:.5 E5:.5 r:1', 'r:1 B4:.5 D5:.5 E5:.5 G5:.5 A5:.5 B5:.5', 'D6:.5 B5:.5 A5:.5 G5:.5 E5:1 r:1',
    'E5:.5 G5:.5 Bb5:.5 C6:.5 r:1 Bb5:.5 G5:.5', 'A5:.5 F#5:.5 D#5:.5 F#5:.5 B5:1 r:1', 'E6:.5 D6:.5 B5:.5 A5:.5 G5:.5 E5:.5 D5:.5 E5:.5', 'r:.5 E5:.5 G5:.5 A5:.5 C#6:1 r:1'], 4, 16)) {
    const d = n.d * B * .85; horn(n.m, T(n.b), d, .03); horn(n.m - 12, T(n.b), d, .016);
  }
} });

// 6. Candy pop (the Kawaii direction, new tune): 136 BPM, A major, pumping detuned chords, pluck arpeggios, a bell
// lead, "meow" chops in the gaps, four-on-the-floor kick.
TRACKS.push({ file: 'music-F-candy-pop.wav', title: 'Candy pop', bpm: 136, bars: 16, play(K, t0) {
  const B = 60 / 136, T = b => t0 + b * B;
  const PROG = 'A E F#m D A E D E D E C#m F#m Bm D E E'.split(' ');
  const V = { A: [61, 64, 69], E: [59, 64, 68], 'F#m': [61, 66, 69], D: [62, 66, 69], 'C#m': [61, 64, 68], Bm: [62, 66, 71] }, R = { A: 45, E: 40, 'F#m': 42, D: 38, 'C#m': 49, Bm: 47 };
  PROG.forEach((c, i) => {
    const b0 = i * 4, second = i >= 8;
    K.stem = 'drums'; for (let q = 0; q < 4; q++) K.kick(T(b0 + q), 1); K.clap(T(b0 + 1), 1.1); K.clap(T(b0 + 3), 1.1);
    for (let q = 0; q < 4; q++) K.hat(T(b0 + q + .5), 1, true);
    if (i === 7 || i === 15) for (let s = 12; s < 16; s++) K.snare(T(b0 + s / 4), .4 + (s - 12) * .15);
    K.stem = 'pads'; for (let q = 0; q < 4; q++) for (const m of V[c]) for (const det of [1, 1.006]) K.tone(hz(m) * det, T(b0 + q) + .02, B * .92, 'sawtooth', second ? .0065 : .005, { a: B * .4, lin: true, lp: 2400 });
    K.stem = 'plucks'; for (let e = 0; e < 8; e++) { const m = [V[c][0], V[c][1], V[c][2], V[c][1]][e % 4] + 12; K.tone(hz(m), T(b0 + e / 2), .14, 'square', .011, { lp: 2800 }); K.tone(hz(m), T(b0 + e / 2), .18, 'triangle', .02); }
    K.stem = 'bass'; for (let e = 0; e < 8; e++) { const f = hz(R[c] + (e % 2 ? 12 : 0)), t = T(b0 + e / 2); K.tone(f, t, B * .42, 'sine', .1, { hold: B * .25, sus: .6 }); K.tone(f, t, B * .35, 'sawtooth', .025, { lp: 800 }); K.tone(f * 2, t, B * .25, 'sine', .05); }
  });
  K.stem = 'lead';
  const mel = seq(['C#6:.5 E6:.5 A6:.5 E6:.5 C#6:1 B5:1', 'B5:.5 E6:.5 G#6:.5 E6:.5 B5:1 r:1', 'A5:.5 C#6:.5 F#6:.5 E6:.5 C#6:1 A5:1', 'F#6:1 E6:.5 D6:.5 E6:2',
    'C#6:.5 E6:.5 A6:.5 B6:.5 C#7:1 B6:1', 'G#6:.5 B6:.5 E6:.5 G#6:.5 B6:1 r:1', 'A6:.5 F#6:.5 D6:.5 F#6:.5 A6:1 B6:1', 'G#6:1 E6:1 r:2',
    'F#6:1 A6:1 D7:1 C#7:.5 B6:.5', 'B6:1.5 G#6:.5 E6:1 B5:1', 'C#6:.5 E6:.5 G#6:.5 E6:.5 C#7:1 B6:1', 'A6:1.5 G#6:.5 F#6:1 C#6:1',
    'D6:.5 F#6:.5 B6:.5 F#6:.5 D7:1 C#7:1', 'B6:.5 A6:.5 F#6:.5 A6:.5 B6:1 D7:1', 'C#7:1 B6:1 G#6:1 E6:1', 'B6:2 r:2']);
  for (const n of mel) { const f = hz(n.m - 12), t = T(n.b), d = n.d * B * .9;
    K.tone(f, t, d, 'triangle', .06, { hold: d * .7, sus: .6 }); K.tone(f, t, d, 'square', .018, { lp: 3500, hold: d * .7, sus: .6 }); K.tone(f * 2, t, .35, 'sine', .035); K.tone(f * 2.76, t, .12, 'sine', .01); }
  K.stem = 'meows'; for (const [b, m] of [[30, 76], [31, 81], [62.5, 76], [63, 78], [63.5, 81]]) meow(K, T(b), hz(m), 1.1);
} });

// ======================================================================================================================
// COINS. One struck coin = a quick strike noise plus inharmonic sine partials (the game's steelAt recipe), with pitch,
// damping and decay varied per variant. "pile" coins are damped (lying on other coins); "tray" coins land in the metal
// tray under the front edge, which adds a short tray ring.
// ======================================================================================================================
const PARTIALS = [[1350, .9, .09], [2870, .6, .07], [4230, .5, .05], [5960, .35, .04], [7810, .22, .03]];
function coinKit(K) {
  const C = {};
  C.strike = (t, v, p = 1, ring = 1, bright = 1) => {
    K.noise(t, .01, .4 * v * bright, { bp: 6000, q: .6 }); K.noise(t, .025, .12 * v, { bp: 2500 * p, q: 1.5 });
    for (const [f, a, d] of PARTIALS) K.tone(f * p, t, d * ring / Math.sqrt(p), 'sine', .09 * v * a);
  };
  C.settle = (t, v, p, n, gap = .055) => { let a = .45; for (let i = 0; i < n; i++) { t += gap; gap *= .66; a *= .72; K.noise(t, .008, .3 * v * a, { bp: 5500, q: .8 }); K.tone(2870 * p, t, .05, 'sine', .05 * v * a); K.tone(4230 * p, t, .035, 'sine', .04 * v * a); } };
  C.thud = (t, v, f = 190) => { K.tone(f, t, .09, 'sine', .3 * v, { fEnd: f * .55 }); K.noise(t, .05, .14 * v, { bp: 750, q: .9 }); };
  C.tray = (t, v, p = 1) => { C.strike(t, v * .8, p, 1.3); K.tone(610, t, .2, 'sine', .05 * v, { fEnd: 600 }); K.tone(1580, t, .12, 'sine', .03 * v); K.tone(160, t, .07, 'sine', .14 * v, { fEnd: 90 }); };
  C.gold = (t, v, p = .8) => { C.strike(t, v * 1.1, p, 2.2); K.tone(330, t, .1, 'sine', .14 * v, { fEnd: 220 });
    [[2093, .05, .9], [2637, .04, .7], [3136, .03, .55]].forEach(([f, a, d], k) => { K.tone(f, t + .03 + k * .05, d, 'sine', a * v); K.tone(f * 2.76, t + .03 + k * .05, d * .4, 'sine', a * .3 * v); }); };
  return C;
}
const COINS = [
  // coin on coin: a coin knocks another on the pile (short, damped, sometimes a double tap)
  ...[[1.15, 0, .7], [1.3, .028, .6], [1.0, 0, .9], [1.45, .018, .5]].map(([p, dbl, ring], k) => ({ group: 'clink', file: `coin-1${'abcd'[k]}-clink.wav`, len: .5, play(K, C) {
    C.strike(.02, .7, p, ring); if (dbl) C.strike(.02 + dbl, .35, p * 1.07, ring * .8); if (k === 2) C.settle(.02, .5, p, 2, .04); } })),
  // a coin drops onto the pile: dull hit, its ring, neighbours chiming, a little wobble to rest
  ...[[1.0, 3, [.06, .11]], [.9, 4, [.05]], [1.1, 2, [.07, .1, .16]], [.95, 5, []]].map(([p, n, nb], k) => ({ group: 'pile', file: `coin-2${'abcd'[k]}-drop-on-pile.wav`, len: .8, play(K, C) {
    C.thud(.02, .8, 170 + k * 15); C.strike(.025, .8, p, .9); nb.forEach((d, j) => C.strike(.025 + d, .3 - j * .06, p * (1.15 + j * .12), .6)); C.settle(.03, .9, p, n); } })),
  // several coins go over the edge into the tray (3 to 6 coins)
  ...[[3, .085, 0], [4, .07, 1], [5, .06, 2], [6, .05, 3]].map(([n, gap, seed], k) => ({ group: 'spill', file: `coin-3${'abcd'[k]}-spill-${n}-coins.wav`, len: 1.2, play(K, C) {
    const r = seeded(50 + seed); K.noise(.02, .09, .06, { bp: 3200, q: .8 });
    for (let i = 0; i < n; i++) { const t = .06 + i * gap + r() * gap * .5, p = .9 + r() * .4; C.tray(t, .75 + r() * .3, p); if (r() < .5) C.settle(t, .5, p, 2, .04); } } })),
  // a big cascade: a whole front row pours over (about 25 to 40 coins)
  ...[[26, 1.4, 1], [34, 1.8, 2], [42, 2.2, 3]].map(([n, span, seed], k) => ({ group: 'cascade', file: `coin-4${'abc'[k]}-big-cascade.wav`, len: span + 1, play(K, C) {
    const r = seeded(90 + seed); K.noise(.02, span + .3, .05, { bp: 1800, q: .5, a: .15, lin: true, hold: span * .5, sus: .6 }); K.noise(.02, span, .03, { bp: 5000, q: .6, a: .1, lin: true, hold: span * .4, sus: .5 });
    for (let i = 0; i < 6; i++) C.thud(.03 + i * span / 8 + r() * .05, .5, 140 + r() * 60);
    for (let i = 0; i < n; i++) { const u = Math.pow(r(), 1.6), t = .04 + u * span, p = .85 + r() * .5, v = (.5 + r() * .5) * (1 - u * .5); r() < .6 ? C.tray(t, v, p) : C.strike(t, v * .8, p, .8); }
    for (let i = 0; i < 3; i++) C.tray(.04 + span + .1 + i * .13 + r() * .05, .4 - i * .1, 1 + r() * .3); } })),
  // gold coin: heavier, longer ring with a bright shimmer
  { group: 'gold', file: 'coin-5a-gold-drop.wav', len: 1.4, play(K, C) { C.thud(.02, 1, 160); C.gold(.025, .9, .78); C.settle(.03, .9, .78, 4, .07); } },
  { group: 'gold', file: 'coin-5b-gold-over-edge.wav', len: 1.6, play(K, C) { K.noise(.02, .1, .06, { bp: 3200, q: .8 }); C.gold(.09, .9, .82); K.tone(610, .09, .3, 'sine', .06); for (let i = 0; i < 5; i++) K.tone(hz(84 + [0, 4, 7, 12, 16][i]), .35 + i * .06, .5, 'sine', .022); } },
  { group: 'gold', file: 'coin-5c-gold-clink.wav', len: 1.2, play(K, C) { C.gold(.02, .75, .9); C.strike(.06, .35, 1.2, .7); } },
];

// ======================================================================================================================
// PUSHER. Each option is a stroke(t, dur, back, turbo) like the game's sfx.slide; the demo plays the game's timing:
// 3 strokes at the normal 3.2 s period, 4 at the Turbo period (1.5 s), then 1 normal. Forward starts at 8% of the cycle
// and lasts 45%; back starts at 61% and lasts 39% (pusherSoundTick in the game).
// ======================================================================================================================
const PUSHERS = [
  { file: 'pusher-0-current-for-comparison.wav', title: 'Current pusher (UAT 41 onward), for comparison', stroke(K, t, dur, back, turbo) { // port of sfx.slide at the 50% default
    const v = .5 * (turbo ? 1.35 : 1), k = back ? .6 : 1, p = turbo ? 1.26 : 1;
    K.tone(back ? 78 * p : 96 * p, t, .16, 'sine', .42 * v * k, { fEnd: 40 * p }); K.noise(t, .045, .22 * v * k, { bp: (back ? 900 : 1200) * p, q: 1.4 }); K.tone((back ? 520 : 660) * p, t + .004, .05, 'square', .05 * v * k, { fEnd: (back ? 300 : 380) * p });
    K.noise(t + .03, dur - .06, .022 * v * k, { bp: (back ? 560 : 760) * p, q: .8, a: .12, lin: true, hold: dur - .31 });
    const n = Math.max(2, Math.round(dur / .16)); for (let i = 1; i < n; i++) K.noise(t + i * dur / n, .018, .035 * v * k, { bp: 2600 * p, q: 3 });
    K.tone(back ? 110 * p : 130 * p, t + dur - .03, .08, 'sine', .16 * v * k, { fEnd: 60 * p }); K.noise(t + dur - .03, .03, .08 * v * k, { bp: 700 * p, q: 1.4 });
  } },
  { file: 'pusher-1-soft-glide.wav', title: 'Soft glide: a felt-smooth swish and a soft wooden "tok" at the end', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.25 : 1, k = back ? .6 : 1;
    K.noise(t, dur, .05 * k, { bp: 420 * p, q: 1, a: dur * .35, lin: true, hold: dur * .6, sus: .8 }); K.noise(t, dur, .02 * k, { bp: 1100 * p, q: .8, a: dur * .4, lin: true, hold: dur * .5, sus: .6 });
    const e = t + dur - .02; K.tone(620 * p, e, .06, 'sine', .1 * k, { fEnd: 560 * p }); K.noise(e, .02, .06 * k, { bp: 1500 * p, q: 2 }); K.tone(180 * p, e, .08, 'sine', .12 * k, { fEnd: 110 * p });
  } },
  { file: 'pusher-2-ratchet.wav', title: 'Ratchet: a light clicking gear under the travel, a small clunk at the end', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.2 : 1, k = back ? .6 : 1, rate = turbo ? 26 : 16, n = Math.max(3, Math.round(dur * rate));
    K.tone(150 * p, t, .08, 'sine', .14 * k, { fEnd: 90 * p }); K.noise(t, .03, .08 * k, { bp: 1300 * p, q: 1.5 });
    for (let i = 1; i < n; i++) { const ti = t + i * dur / n; K.noise(ti, .012, (i % 2 ? .05 : .07) * k, { bp: 3300 * p, q: 4 }); K.tone(2100 * p, ti, .012, 'square', .006 * k); }
    const e = t + dur - .02; K.tone(240 * p, e, .1, 'sine', .2 * k, { fEnd: 120 * p }); K.noise(e, .035, .1 * k, { bp: 900 * p, q: 1.4 }); K.tone(1200 * p, e, .03, 'square', .012 * k);
  } },
  { file: 'pusher-3-air-glide.wav', title: 'Air glide: a soft pneumatic "fsshh" that rises then settles, a gentle "pff-thk" at the end', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.3 : 1, k = back ? .6 : 1, lo = (back ? 1900 : 1100) * p, hi = (back ? 1100 : 1900) * p;
    K.noise(t, dur * .6, .045 * k, { bp: lo, q: 1.2, a: .08, lin: true, hold: dur * .3, sus: .7 }); K.noise(t + dur * .3, dur * .7, .04 * k, { bp: hi, q: 1.2, a: dur * .3, lin: true, hold: dur * .5, sus: .7 });
    const e = t + dur - .03; K.noise(e, .14, .06 * k, { bp: 800 * p, q: .8 }); K.tone(300 * p, e + .02, .07, 'sine', .14 * k, { fEnd: 160 * p });
  } },
  { file: 'pusher-4-wooden-drawer.wav', title: 'Wooden drawer: a grainy wooden slide and a hollow "tock"', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.2 : 1, k = back ? .6 : 1, r = seeded(Math.round(t * 1000));
    K.noise(t, dur, .035 * k, { bp: 480 * p, q: .9, a: .06, lin: true, hold: dur * .8, sus: .8 });
    const n = Math.round(dur * (turbo ? 90 : 60)); for (let i = 0; i < n; i++) K.noise(t + r() * dur, .006, (.03 + r() * .03) * k, { bp: (600 + r() * 600) * p, q: 2 });
    const e = t + dur - .02; K.tone(560 * p, e, .07, 'sine', .14 * k, { fEnd: 520 * p }); K.tone(1180 * p, e, .04, 'sine', .05 * k); K.noise(e, .015, .08 * k, { bp: 1800 * p, q: 2.5 }); K.tone(200 * p, e, .07, 'sine', .1 * k, { fEnd: 120 * p });
  } },
  { file: 'pusher-5-tick-tock.wav', title: 'Tick-tock: a soft tuned "dum" as it sets off and a woodblock "tik" where it stops; Turbo goes up a 4th', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 4 / 3 : 1, k = back ? .65 : 1, f = (back ? 146.83 : 196) * p;
    K.tone(f, t, .2, 'triangle', .2 * k, { fEnd: f * .94 }); K.tone(f * 2, t, .1, 'sine', .08 * k); K.noise(t, .02, .05 * k, { bp: 1200, q: 1.5 });
    K.noise(t + .04, dur - .08, .012 * k, { bp: 6500, q: 1, a: dur * .4, lin: true, hold: dur * .5 });
    const e = t + dur - .02, w = (back ? 880 : 1046.5) * p; K.tone(w, e, .05, 'sine', .1 * k, { fEnd: w * .95 }); K.noise(e, .012, .06 * k, { bp: w * 2, q: 3 });
  } },
];

// ======================================================================================================================
// RENDER
// ======================================================================================================================
const win100 = a => { const pb = phoneBand(a), w = Math.round(SR * .1); let m = 0; for (let k = 0; k + w <= pb.length; k += Math.round(w / 4)) m = Math.max(m, rms(pb.subarray(k, k + w))); return m; };
// The game's current coin sounds (UAT 54 sfx.land / sfx.clink, read only) as the level reference.
function current(kind) {
  const src = fs.readFileSync(path.resolve(__dirname, '../cp54/release.html'), 'utf8');
  const i = src.indexOf('const sfx = (() => {'), j = src.indexOf('})();', i) + 5;
  const ac = makeAC(), c = { S: { muted: false }, inBackground: false, document: { hidden: false }, Math: Object.create(Math), pickupFx: { volume: 1 }, console };
  c.Math.random = seeded(7); c.window = { AudioContext: function () { return ac; } };
  vm.createContext(c); vm.runInContext(src.slice(i, j) + ';globalThis.sfx=sfx;', c); c.sfx.unlock(); ac.currentTime = .1; c.sfx[kind](); return render(ac, .9).slice(Math.round(.08 * SR));
}
let refLand, refClink, refNote = 'UAT 54 sfx.land()/sfx.clink() rendered from work/cp54/release.html';
try { const l = current('land'), k = current('clink'); refLand = win100(l); refClink = win100(k); wav(path.join(OUT, 'coin-0a-current-land-for-comparison.wav'), l); wav(path.join(OUT, 'coin-0b-current-clink-for-comparison.wav'), k); }
catch (e) { refLand = .0113; refClink = .0137; refNote = 'CP-38 levels.json numbers (could not run the UAT 54 sfx code: ' + e.message + ')'; }

const report = { render: 'offline stand-in for Web Audio, 44.1 kHz mono 16-bit, through the game master gain 0.55', reference: { note: refNote, landLoudest100msPhoneBand: r4(refLand), clinkLoudest100msPhoneBand: r4(refClink) }, music: [], coins: [], pushers: [] };

// Music: same loudness as the CP-38 round (6 dB over a coin landing, above 250 Hz), which is the level Classic and
// Kawaii pop play at in the game at Music volume 100% (UAT 43).
const TARGET = .0113 * Math.pow(10, 6 / 20);
const only = process.argv[2];
for (const tr of TRACKS) {
  if (only && !tr.file.includes(only)) continue;
  const L = tr.bars * 4 * 60 / tr.bpm, ac = makeAC(), master = ac.createGain(), bus = ac.createGain();
  master.gain.value = .55; master.connect(ac.destination); bus.connect(master);
  for (const lp of [0, 1]) { const K = kit(ac, bus, seeded(1234)); tr.play(K, lp * L, L); }
  const raw = render(ac, 2 * L + 1).slice(Math.round(L * SR), Math.round(2 * L * SR)), gain = TARGET / rms(phoneBand(raw)), a = raw.map(x => x * gain);
  wav(path.join(OUT, tr.file), a);
  const pb = phoneBand(a), w = Math.round(SR / 2), win = []; for (let k = 0; k + w <= a.length; k += w) win.push(rms(pb.subarray(k, k + w)));
  const res = { file: tr.file, style: tr.title, bpm: tr.bpm, bars: tr.bars, lengthSec: r3(L), mixGain: r3(gain), peak: r3(peak(a)), phoneBandRms: r4(rms(pb)), halfSecondMin: r4(Math.min(...win)), halfSecondMax: r4(Math.max(...win)), seamStep: r4(Math.abs(a[a.length - 1] - a[0])) };
  report.music.push(res); console.log(JSON.stringify(res));
}

// Coins: each set is scaled as a group (variants keep their natural differences) so its average loudest 100 ms sits
// at the set's target over the current coin landing.
const GROUP_DB = { clink: 0, pile: 0, spill: 3, cascade: 6, gold: 2 };
const rendered = COINS.map(c => { const ac = makeAC(), master = ac.createGain(); master.gain.value = .55; master.connect(ac.destination); const K = kit(ac, master, seeded(77)); c.play(K, coinKit(K)); return { c, a: render(ac, c.len) }; });
for (const g of Object.keys(GROUP_DB)) {
  const set = rendered.filter(x => x.c.group === g), avg = set.reduce((s, x) => s + win100(x.a), 0) / set.length, gain = refLand * Math.pow(10, GROUP_DB[g] / 20) / avg;
  for (const x of set) { const a = x.a.map(v => v * gain); wav(path.join(OUT, x.c.file), a); report.coins.push({ file: x.c.file, set: g, lengthSec: x.c.len, peak: r3(peak(a)), loudest100msVsLandDb: dB(win100(a) / refLand) }); }
}

// Pushers: every option is scaled to the same phone-band loudness as the current pusher at its 50% default.
function pusherDemo(p) {
  const ac = makeAC(), master = ac.createGain(); master.gain.value = .55; master.connect(ac.destination); const K = kit(ac, master, seeded(5));
  let t = .05; const cycles = [3.2, 3.2, 3.2, 1.5, 1.5, 1.5, 1.5, 3.2];
  for (const P of cycles) { const turbo = P < 2; p.stroke(K, t + .08 * P, .45 * P, false, turbo); p.stroke(K, t + .61 * P, .39 * P, true, turbo); t += P; }
  return render(ac, t + .3);
}
let refPush = null;
for (const p of PUSHERS) {
  const raw = pusherDemo(p), lv = rms(phoneBand(raw)); if (refPush === null) refPush = lv;
  const a = raw.map(v => v * refPush / lv); wav(path.join(OUT, p.file), a);
  report.pushers.push({ file: p.file, what: p.title, lengthSec: r3(a.length / SR), peak: r3(peak(a)), gainToMatchCurrent: r3(refPush / lv) });
}
fs.writeFileSync(path.join(OUT, 'levels.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report.coins.concat(report.pushers)));
