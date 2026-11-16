// ---------- UAT 41: background music "Kawaii bubbly pop" (Jenny's pick from the CP-38 music audition, track 4) ----------
// 144 BPM, D major, 20 bars (33.3 s), looping. The notes come from the audition's own code (work/cp38-music-audition/
// make-music.cjs, track 4, copied unchanged below). It runs once at start-up into a recorder (no sound), which gives the
// list of notes; bgmTick then plays them a little ahead on the audio clock, round and round, through the music bus.
// The audition's mix gain (0.884) is baked into every note, so Music volume 100% is the level Jenny heard.
const KAWAII=(()=>{
 const MIX=.884,ev=[];let seedS=1234>>>0;const rand=()=>{seedS=(seedS*1664525+1013904223)>>>0;return seedS/4294967296;};
 const K={rand,set stem(s){},tone(f,t,dur,type,vol,o={}){if(vol>0)ev.push({t,k:0,f,dur,type,vol:vol*MIX,o});},noise(t,dur,vol,o={}){if(vol>0)ev.push({t,k:1,dur,vol:vol*MIX,o,off:rand()*.4});}};
  K.kick = (t, v = 1) => { K.tone(150, t, .24, 'sine', .3 * v, { fEnd: 48, glide: .12 }); K.tone(320, t, .04, 'triangle', .12 * v, { fEnd: 120 }); K.noise(t, .008, .12 * v, { bp: 3000, q: .7 }); };
  K.snare = (t, v = 1, lp) => { K.noise(t, .17, .22 * v, { bp: lp ? 1400 : 1900, q: .6 }); K.noise(t, .06, (lp ? .04 : .1) * v, { bp: 5200, q: .8 }); K.tone(200, t, .08, 'triangle', .14 * v, { fEnd: 160 }); };
  K.clap = (t, v = 1) => { for (let k = 0; k < 3; k++) K.noise(t + k * .011, .02, .2 * v, { bp: 1500, q: 1.1 }); K.noise(t + .033, .15, .16 * v, { bp: 1350, q: .9 }); };
  K.hat = (t, v = 1, open) => K.noise(t, open ? .17 : .035, .075 * v, { bp: 9000, q: .8 });
  K.shaker = (t, v = 1) => K.noise(t, .055, .05 * v, { bp: 6800, q: 1, a: .014, lin: true });
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
const meow = (K, t, f, v) => { K.tone(f, t, .28, 'triangle', .07 * v, { fEnd: f * 1.5, a: .02 }); K.tone(f * 1.5, t + .14, .32, 'triangle', .05 * v, { fEnd: f * .9, a: .02 }); };

 const t0=0;
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

 ev.sort((a,b)=>a.t-b.t);return {ev,len:20*4*60/144};
})();
