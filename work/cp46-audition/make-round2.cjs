// CP-46 audition round 2 (files only; no build): whoosh-only pusher options, alone and mixed under the current music.
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
    createWaveShaper() { const n = new Node(); n.curve = null; return n; }, // the music bus limiter: passes through (it only bends signals far above these levels)
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
// Round 2 (Jenny, Nov 14): the pusher is only a whoosh, one per stroke (forward, then a softer return), no drums,
// clicks, ticks or thumps; the whoosh itself carries the board's rhythm and speeds up with Turbo. Each whoosh is band-
// passed noise with slow linear attacks (no hard onsets). The filter can't sweep in the game's sfx helpers, so a moving
// whoosh is made of overlapping bands that fade into each other.
// ======================================================================================================================
const W = (K, t, dur, vol, bp, q, attack, peakAt = .5) => K.noise(t, dur, vol, { bp, q, a: Math.max(.06, dur * attack), lin: true, hold: Math.max(.07, dur * attack) + dur * Math.max(.05, peakAt - attack), sus: .7 });
const WHOOSHES = [
  { file: 'pusher-w1-soft-whoosh.wav', title: 'Soft whoosh: one smooth, mid-toned whoosh per stroke; the return is softer and a touch lower', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.2 : 1, k = back ? .55 : 1; W(K, t, dur, .06 * k, (back ? 620 : 720) * p, .7, .4); W(K, t, dur, .02 * k, (back ? 1500 : 1700) * p, .6, .45); } },
  { file: 'pusher-w2-airy-whoosh.wav', title: 'Airy whoosh: lighter and brighter, more "air" than body, a slightly longer tail', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.2 : 1, k = back ? .55 : 1; W(K, t, dur + .25, .035 * k, (back ? 1100 : 1300) * p, .5, .35); W(K, t, dur + .3, .03 * k, (back ? 2800 : 3300) * p, .5, .4); } },
  { file: 'pusher-w3-sweeping-whoosh.wav', title: 'Sweeping whoosh: rises as the pusher goes forward ("whooo-sh"), falls on the way back', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.2 : 1, k = back ? .55 : 1, bands = back ? [1900, 1100, 600] : [550, 1000, 1800];
    bands.forEach((f, i) => W(K, t + i * dur * .28, dur * .55, (.05 - i * .008) * k, f * p, .9, .45)); } },
  { file: 'pusher-w4-quick-whoosh.wav', title: 'Quick whoosh: a shorter "fwoosh" at the start of each stroke, so the beat is crisper; return softer', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.15 : 1, k = back ? .5 : 1, d = Math.min(dur, turbo ? .45 : .7); W(K, t, d, .07 * k, (back ? 800 : 950) * p, .8, .3, .35); W(K, t, d, .025 * k, (back ? 2200 : 2600) * p, .7, .3, .35); } },
  { file: 'pusher-w5-warm-whoosh.wav', title: 'Warm whoosh: rounder and darker (still above phone-speaker bass); the return is only a faint breath', stroke(K, t, dur, back, turbo) {
    const p = turbo ? 1.2 : 1, k = back ? .35 : 1; W(K, t, dur, .075 * k, 420 * p, .8, .45); W(K, t, dur, .035 * k, 900 * p, .7, .45); } },
];

// The game's own sound code (UAT 54, read only) for the current pusher and the current music (Classic, the default).
function gameSfx(seed) {
  const src = fs.readFileSync(path.resolve(__dirname, '../cp54/release.html'), 'utf8');
  const i = src.indexOf('const sfx = (() => {'), j = src.indexOf('})();', i) + 5;
  const ac = makeAC(), c = { S: { muted: false }, inBackground: false, document: { hidden: false }, Math: Object.create(Math), pickupFx: { volume: 1 }, console };
  c.Math.random = seeded(seed); c.window = { AudioContext: function () { return ac; } };
  vm.createContext(c); vm.runInContext(src.slice(i, j) + ';globalThis.sfx=sfx;', c); c.sfx.unlock(); return { sfx: c.sfx, ac };
}
const CYCLES = [3.2, 3.2, 3.2, 1.5, 1.5, 1.5, 1.5, 3.2], DEMO_LEN = .05 + CYCLES.reduce((a, b) => a + b, 0) + .3;
function demo(strokeAt) { let t = .05; for (const P of CYCLES) { const turbo = P < 2; strokeAt(t + .08 * P, .45 * P, false, turbo); strokeAt(t + .61 * P, .39 * P, true, turbo); t += P; } }
function currentPusher() { const { sfx, ac } = gameSfx(5); demo((t, dur, back, turbo) => { ac.currentTime = t; sfx.slide(.5, dur, back, turbo); }); return render(ac, DEMO_LEN); }
function classic() { // Music volume 100%: the bus runs at 1.72 (CLASSIC_GAIN); the game's bgmStep, 64 eighth-note steps
  const { sfx, ac } = gameSfx(11); sfx.bgmBus(1.72, .001);
  const STEP = 60 / 112 / 2, BASS = [87.31, 73.42, 116.54, 130.81, 87.31, 110, 116.54, 130.81];
  const PAD = [[349.23, 440, 523.25], [293.66, 349.23, 440], [293.66, 349.23, 466.16], [329.63, 392, 523.25], [349.23, 440, 523.25], [329.63, 440, 523.25], [293.66, 349.23, 466.16], [329.63, 392, 466.16]];
  const SCALE = [349.23, 392, 440, 523.25, 587.33, 698.46, 783.99], MEL = [[5, -1, 4, -1, 3, 4, -1, 2, 3, -1, -1, 1, 2, -1, -1, -1], [2, -1, 3, -1, 4, -1, 5, 4, 3, -1, 2, -1, 1, -1, -1, -1], [5, -1, 4, -1, 3, 4, 5, -1, 4, -1, 3, -1, 2, -1, -1, -1], [0, 1, 2, -1, 3, -1, 4, -1, 5, -1, 6, -1, 5, -1, -1, -1]];
  for (let k = 0; k * STEP < DEMO_LEN; k++) {
    const i = k % 64, d = .05 + k * STEP, bar = i >> 3, s = i & 7;
    if (s === 0 || s === 4) sfx.bgm('kick', d); if (s === 2 || s === 6) sfx.bgm('rim', d); if (s & 1) sfx.bgm('shaker', d); if (s === 0) sfx.bgm('pad', d, PAD[bar]);
    const r = BASS[bar]; if (s === 0) sfx.bgm('bass', d, r); else if (s === 3) sfx.bgm('bass', d, r * 1.5); else if (s === 4) sfx.bgm('bass', d, r * 2); else if (s === 6) sfx.bgm('bass', d, r * 1.5);
    const m = MEL[bar >> 1][(bar & 1) * 8 + s]; if (m >= 0) sfx.bgm('mar', d, SCALE[m]); if (i === 62) sfx.bgm('meow', d, 698.46);
  }
  return render(ac, DEMO_LEN);
}
const steepest = a => { const e = []; for (let k = 0; k + 441 <= a.length; k += 441) e.push(rms(a.subarray(k, k + 441))); let r = 0; for (let k = 1; k < e.length; k++) r = Math.max(r, e[k] - e[k - 1]); return r3(r / Math.max(...e)); };

const cur = currentPusher(), music = classic(), refPush = rms(phoneBand(cur));
const REL_DB = +(process.env.REL_DB || -10); // Jenny wants the whoosh loud enough to set the board's beat: 10 dB under the music (phone band), about 13 dB over the current pusher
const out = { note: 'Round 2. Whoosh-only pusher options at the game timing (3 normal strokes, 4 Turbo, 1 normal); each scaled to ' + REL_DB + ' dB against the music (phone band, averaged over the whole file); the current pusher is left as the game plays it at its 50% default. Mixes: the same file over the current music (Classic, Music volume 100%), both rendered from the game code (UAT 54). steepest10msRise: the biggest jump of the loudness envelope in 10 ms, as a share of its peak; a drum, click or thump shows as a big jump.', musicPhoneBandRms: r4(rms(phoneBand(music))), currentPusherPhoneBandRms: r4(refPush), options: [] };
const save = (name, a, extra) => { const mix = a.map((v, i) => v + (music[i] || 0));
  wav(path.join(OUT, name + '.wav'), a); wav(path.join(OUT, name + '-under-music.wav'), mix);
  out.options.push({ file: name + '.wav', mix: name + '-under-music.wav', peak: r3(peak(a)), mixPeak: r3(peak(mix)), pusherVsMusicDb: dB(rms(phoneBand(a)) / rms(phoneBand(music))), steepest10msRise: steepest(a), ...extra }); };
save('pusher-r2-0-current-for-comparison', cur, { what: 'the current pusher (a slide plus a beat layer), 50% default' });
for (const w of WHOOSHES) {
  const ac = makeAC(), master = ac.createGain(); master.gain.value = .55; master.connect(ac.destination); const K = kit(ac, master, seeded(5));
  demo((t, dur, back, turbo) => w.stroke(K, t, dur, back, turbo)); const raw = render(ac, DEMO_LEN), g = rms(phoneBand(music)) * Math.pow(10, REL_DB / 20) / rms(phoneBand(raw));
  save(w.file.replace('.wav', ''), raw.map(v => v * g), { what: w.title, gain: r3(g), vsCurrentPusherDb: dB(rms(phoneBand(raw)) * g / refPush) });
}
fs.writeFileSync(path.join(OUT, 'levels-round2.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
