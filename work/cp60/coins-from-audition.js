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
