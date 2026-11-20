// CP-84 evidence: stills of each untouched puzzle (412x915, 360x640) and bot-played clips with real touch input.
// Usage: node tools/capture.cjs [stills|swat-clip|cafe-clip|playtest]   (needs the local server on 8795)
const { open, sleep } = require('./cdp.cjs');
const fs = require('fs'), path = require('path');
const solver = require('./cafe-solver.cjs');
const BASE = 'http://127.0.0.1:8795/work/cp84-puzzles/';
const OUT = path.resolve(__dirname, '../../../tickets/CP-84-evidence');
fs.mkdirSync(OUT, { recursive: true });
const mode = process.argv[2] || 'stills';

async function swatBotShot(p) {
  const best = await p.eval(`(()=>{const B=__cp84;let best=null;
    for(let a=-Math.PI+0.17;a<=-0.17;a+=0.03){const r=B.evalShot(a);
      const sc=r.n>=3?100+r.n+r.drop*1.5:r.n*10-r.row;
      if(!best||sc>best.sc)best={a,sc,n:r.n,drop:r.drop};}
    const sp=B.shooterPos();return {a:best.a,n:best.n,drop:best.drop,x:sp.x,y:sp.y-B.S.r*1.2};})()`);
  const W = await p.eval('innerWidth');
  const reach = a => { let d = 260; const c = Math.cos(a); if (c < 0) d = Math.min(d, (best.x - 6) / -c); if (c > 0) d = Math.min(d, (W - 6 - best.x) / c); return d; };
  const d = reach(best.a), tx = best.x + Math.cos(best.a) * d, ty = best.y + Math.sin(best.a) * d;
  const sx = best.x + Math.cos(best.a) * d * 0.6, sy = best.y + Math.sin(best.a) * d * 0.6 + 12;
  await p.drag([[sx, sy], [(sx + tx) / 2, (sy + ty) / 2], [tx, ty], [tx, ty]], 90);
  return best;
}
async function waitSt(p, sts, ms = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { const st = await p.eval('__cp84.S.st'); if (sts.includes(st)) return st; await sleep(80); }
  return await p.eval('__cp84.S.st');
}
async function swatPlay(p, lv, maxShots = 60, log) {
  await p.eval(`__cp84.startLevel(${lv})`); await sleep(500);
  for (let i = 0; i < maxShots; i++) {
    const st = await waitSt(p, ['aim', 'won', 'lost']);
    if (st !== 'aim') return { st, shots: i };
    const b = await swatBotShot(p);
    if (log && b.n >= 3) log.push(b.n + b.drop);
    await sleep(250);
  }
  return { st: await waitSt(p, ['won', 'lost', 'aim']), shots: maxShots };
}
async function cafeTapColour(p, col) {
  const i = await p.eval(`__cp84.S.seats.findIndex(s=>s&&s.col===${col})`);
  const g = await p.eval(`JSON.stringify(__cp84.seatGeom(${i}))`).then(JSON.parse);
  await p.tap(g.x, g.headY + g.headW * 0.4);
}
async function cafePlay(p, lv, pauseMs = 900) {
  await p.eval(`__cp84.startLevel(${lv})`); await sleep(700);
  const L = await p.eval(`JSON.stringify(__cp84.LEVELS[${lv}])`).then(JSON.parse);
  const line = solver.winLine(L.rows, L.queue.split(''));
  const KEY = { R: 0, B: 1, G: 2, Y: 3, P: 4, O: 5 };
  for (const k of line) {
    await waitSt(p, ['play']); await sleep(pauseMs);
    await cafeTapColour(p, KEY[k]);
    await sleep(300);
  }
  return { st: await waitSt(p, ['won', 'lost'], 10000), line: line.join('') };
}

(async () => {
  if (mode === 'stills') {
    for (const [w, h, tag] of [[412, 915, ''], [360, 640, '-360x640']]) {
      for (const game of ['paw-swat', 'cat-cafe']) {
        const p = await open(BASE + game + '.html', { width: w, height: h });
        await p.shot(path.join(OUT, `${game}-menu${tag}.png`));
        const n = await p.eval('__cp84.LEVELS.length');
        for (let i = 0; i < n; i++) { await p.eval(`__cp84.startLevel(${i})`); await sleep(500); await p.shot(path.join(OUT, `${game}-puzzle${i + 1}${tag}.png`)); }
        if (p.logs.length) console.log(game, tag, p.logs.join('\n'));
        await p.close();
      }
    }
  } else if (mode === 'swat-clip') {
    const p = await open(BASE + 'paw-swat.html');
    const pays = [];
    let res;
    const lv = +(process.argv[3] || 1), name = lv === 1 ? 'paw-swat-clip.mp4' : `paw-swat-clip-puzzle${lv + 1}.mp4`;
    const n = await p.clip(path.join(OUT, name), async () => { await sleep(600); res = await swatPlay(p, lv, 40, pays); await sleep(2200); }, { scale: 0.5 });
    console.log('swat clip frames', n, res, 'payoffs', pays.join(','), p.logs.join('\n'));
    await p.close();
  } else if (mode === 'cafe-clip') {
    const p = await open(BASE + 'cat-cafe.html');
    let res;
    const n = await p.clip(path.join(OUT, 'cat-cafe-clip.mp4'), async () => { await sleep(600); res = await cafePlay(p, 1); await sleep(2200); }, { scale: 0.5 });
    console.log('cafe clip frames', n, res, p.logs.join('\n'));
    await p.close();
  } else if (mode === 'playtest') {
    // bot plays every puzzle; reports result and the chain payoffs seen
    const p = await open(BASE + 'paw-swat.html', { width: 360, height: 640 });
    for (let lv = 0; lv < 4; lv++) { const pays = []; const r = await swatPlay(p, lv, 70, pays); console.log('swat', lv + 1, r.st, 'shots', await p.eval('__cp84.S.shots'), 'descents', await p.eval('__cp84.S.desc'), 'payoffs', pays.join(',')); }
    if (p.logs.length) console.log(p.logs.join('\n'));
    await p.close();
    const q = await open(BASE + 'cat-cafe.html', { width: 360, height: 640 });
    for (let lv = 0; lv < 5; lv++) { const r = await cafePlay(q, lv, 150); console.log('cafe', lv + 1, r.st, r.line, 'best bowl', await q.eval('__cp84.S.best')); }
    if (q.logs.length) console.log(q.logs.join('\n'));
    await q.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
