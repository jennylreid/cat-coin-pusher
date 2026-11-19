// CP-84 Cat Café: rules model + solver + puzzle search. Same rules as src/cat-cafe.html.
// grid: array of rows (top..bottom) of colour chars or '.'; bottom row is the open edge.
// A cat of colour k takes every k coin connected (4-way, same colour) to a bottom-row k coin; then columns fall.
const SEATS = 3;
function parse(rows) { return rows.map(r => r.split('')); }
function grab(g, k) {
  const R = g.length, C = g[0].length, seen = new Set(), q = [];
  for (let c = 0; c < C; c++) if (g[R - 1][c] === k) { seen.add((R - 1) * C + c); q.push([R - 1, c]); }
  while (q.length) {
    const [r, c] = q.shift();
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const r2 = r + dr, c2 = c + dc;
      if (r2 < 0 || r2 >= R || c2 < 0 || c2 >= C) continue;
      const id = r2 * C + c2;
      if (!seen.has(id) && g[r2][c2] === k) { seen.add(id); q.push([r2, c2]); }
    }
  }
  return [...seen].map(id => [Math.floor(id / C), id % C]);
}
function apply(g, cells) {
  const R = g.length, C = g[0].length, n = g.map(r => r.slice());
  for (const [r, c] of cells) n[r][c] = '.';
  for (let c = 0; c < C; c++) { // gravity
    const col = []; for (let r = R - 1; r >= 0; r--) if (n[r][c] !== '.') col.push(n[r][c]);
    for (let r = R - 1, i = 0; r >= 0; r--, i++) n[r][c] = i < col.length ? col[i] : '.';
  }
  return n;
}
function empty(g) { return g.every(r => r.every(v => v === '.')); }
function key(g, seats, qi) { return g.map(r => r.join('')).join('/') + '|' + seats.slice().sort().join('') + '|' + qi; }

// Count winning move sequences (capped) and the best leftover cats.
function solve(rows, queue, cap = 200000) {
  const memo = new Map(); let nodes = 0;
  function rec(g, seats, qi) {
    if (empty(g)) return { wins: 1, spare: seats.length + (queue.length - qi) };
    if (++nodes > cap) return { wins: 0, spare: -1, cut: true };
    const k = key(g, seats, qi); if (memo.has(k)) return memo.get(k);
    let wins = 0, spare = -1, tried = new Set();
    for (let s = 0; s < seats.length; s++) {
      const col = seats[s]; if (tried.has(col)) continue; tried.add(col);
      const cells = grab(g, col); if (!cells.length) continue;
      const ns = seats.slice(); let nq = qi;
      if (nq < queue.length) ns[s] = queue[nq++]; else ns.splice(s, 1);
      const r = rec(apply(g, cells), ns, nq);
      wins += r.wins; spare = Math.max(spare, r.spare);
    }
    const out = { wins, spare }; memo.set(k, out); return out;
  }
  const seats = queue.slice(0, SEATS);
  const r = rec(parse(rows), seats, SEATS);
  r.nodes = nodes; return r;
}
// Play with a policy; returns {win, pulls:[sizes]}
function play(rows, queue, policy, rnd) {
  let g = parse(rows), seats = queue.slice(0, SEATS), qi = SEATS; const pulls = [];
  while (true) {
    if (empty(g)) return { win: true, pulls, spare: seats.length + queue.length - qi };
    const opts = seats.map((col, s) => ({ s, col, n: grab(g, col).length })).filter(o => o.n > 0);
    if (!opts.length) return { win: false, pulls };
    let o;
    if (policy === 'greedy') o = opts.sort((a, b) => b.n - a.n)[0];
    else o = opts[Math.floor(rnd() * opts.length)];
    pulls.push(o.n);
    g = apply(g, grab(g, o.col));
    if (qi < queue.length) seats[o.s] = queue[qi++]; else seats.splice(o.s, 1);
  }
}
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function report(rows, queue) {
  const s = solve(rows, queue);
  const greedy = play(rows, queue, 'greedy');
  let rw = 0; const r = rng(7); for (let i = 0; i < 400; i++) if (play(rows, queue, 'random', r).win) rw++;
  return { solvable: s.wins > 0, wins: s.wins, bestSpare: s.spare, cut: !!s.cut, greedyWin: greedy.win, greedyPulls: greedy.pulls, randomWinPct: Math.round(rw / 4) };
}
// One winning order (colours served), preferring the biggest pulls first where several work.
function winLine(rows, queue) {
  const memo = new Set();
  function rec(g, seats, qi) {
    if (empty(g)) return [];
    const k = key(g, seats, qi); if (memo.has(k)) return null; memo.add(k);
    const opts = [...new Set(seats)].map(col => ({ col, cells: grab(g, col) })).filter(o => o.cells.length).sort((a, b) => b.cells.length - a.cells.length);
    for (const o of opts) {
      const s = seats.indexOf(o.col); const ns = seats.slice(); let nq = qi;
      if (nq < queue.length) ns[s] = queue[nq++]; else ns.splice(s, 1);
      const r = rec(apply(g, o.cells), ns, nq);
      if (r) return [o.col, ...r];
    }
    return null;
  }
  return rec(parse(rows), queue.slice(0, SEATS), SEATS);
}
module.exports = { winLine, grab, apply, solve, play, report, parse, rng };

// ---- puzzle search: node cafe-solver.cjs search <cols> <rows> <colours> <seed0> <count> <extraCats>
if (require.main === module && process.argv[2] === 'search') {
  const [C, R, NC, seed0, count, extra] = process.argv.slice(3).map(Number);
  const cols = 'RBGYPO'.slice(0, NC);
  for (let sd = seed0; sd < seed0 + count; sd++) {
    const rnd = rng(sd);
    // clumpy fill: random seeds grow into patches
    const g = Array.from({ length: R }, () => Array(C).fill('.'));
    const front = [];
    for (let i = 0; i < Math.round(C * R / 5); i++) { const r = Math.floor(rnd() * R), c = Math.floor(rnd() * C); if (g[r][c] === '.') { g[r][c] = cols[Math.floor(rnd() * NC)]; front.push([r, c]); } }
    while (front.length) {
      const i = Math.floor(rnd() * front.length); const [r, c] = front[i];
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [r + a, c + b]).filter(([a, b]) => a >= 0 && a < R && b >= 0 && b < C && g[a][b] === '.');
      if (!nb.length) { front.splice(i, 1); continue; }
      const [a, b] = nb[Math.floor(rnd() * nb.length)]; g[a][b] = g[r][c]; front.push([a, b]);
    }
    const rows = g.map(r => r.join(''));
    // build a solvable queue from a random sensible playthrough, then shuffle it a little
    let gg = parse(rows); const q = [];
    while (!empty(gg)) {
      const opts = cols.split('').map(k => ({ k, cells: grab(gg, k) })).filter(o => o.cells.length);
      const o = opts[Math.floor(rnd() * opts.length)]; q.push(o.k); gg = apply(gg, o.cells);
    }
    for (let i = 0; i < extra; i++) q.splice(Math.floor(rnd() * q.length), 0, cols[Math.floor(rnd() * NC)]);
    for (let i = 0; i < q.length; i++) { const j = Math.min(q.length - 1, i + Math.floor(rnd() * 4)); [q[i], q[j]] = [q[j], q[i]]; }
    const rep = report(rows, q);
    if (!rep.solvable) continue;
    console.log(JSON.stringify({ seed: sd, rows, queue: q.join(''), cats: q.length, ...rep }));
  }
}
