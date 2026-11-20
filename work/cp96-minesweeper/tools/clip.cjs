// CP-96: short clip of the first-tap cascade, a hold-to-paw, a second cascade and the win (real touch input).
const { open, sleep } = require('../../cp84-puzzles/tools/cdp.cjs');
const path = require('path');
const URL = 'file:///' + path.resolve(__dirname, '../sleepy-coins.html').split(path.sep).join('/');
const OUT = path.resolve(__dirname, '../../../tickets/CP-96-evidence/cascade-clip.mp4');
(async () => {
  const p = await open(URL, { width: 412, height: 915 }); await sleep(500);
  const xy = async i => JSON.parse(await p.eval(`(()=>{const r=__cp96.tiles[${i}].getBoundingClientRect();return JSON.stringify([r.left+r.width/2,r.top+r.height/2])})()`));
  const n = await p.clip(OUT, async () => {
    await sleep(500); let [x, y] = await xy(27); await p.tap(x, y); await sleep(1400);
    const cats = JSON.parse(await p.eval('JSON.stringify(__cp96.S.cat.map((c,i)=>c?i:-1).filter(i=>i>=0))'));
    [x, y] = await xy(cats[0]); await p.touch('touchStart', x, y); await sleep(480); await p.touch('touchEnd', x, y); await sleep(600);
    for (let i = 63; i >= 0; i--) {
      const s = await p.eval(`[__cp96.S.st,__cp96.S.open[${i}],__cp96.S.cat[${i}]].join()`); if (s.startsWith('won')) break;
      const [, o, c] = s.split(','); if (o === '1' || c === '1') continue;
      [x, y] = await xy(i); await p.tap(x, y); await sleep(380);
    }
    await sleep(3200);
  }, { scale: 0.75 });
  console.log('frames', n, p.logs.filter(l => /error|EXC/i.test(l)));
  await p.close();
})();
