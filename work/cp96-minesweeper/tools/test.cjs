// CP-96 checks: stills at 412x915 and 360x640, cascade, win, loss, board generator stats. Real touch input.
// Usage: node tools/test.cjs
const { open, sleep } = require('../../cp84-puzzles/tools/cdp.cjs');
const fs = require('fs'), path = require('path');
const URL = 'file:///' + path.resolve(__dirname, '../sleepy-coins.html').replace(/\\/g, '/');
const OUT = path.resolve(__dirname, '../../../tickets/CP-96-evidence');
fs.mkdirSync(OUT, { recursive: true });

async function tileXY(p, i) { return JSON.parse(await p.eval(`(()=>{const r=__cp96.tiles[${i}].getBoundingClientRect();return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2,w:r.width})})()`)); }
async function tap(p, i) { const t = await tileXY(p, i); await p.tap(t.x, t.y); }
async function hold(p, i) { const t = await tileXY(p, i); await p.touch('touchStart', t.x, t.y); await sleep(480); await p.touch('touchEnd', t.x, t.y); }

(async () => {
  const res = {};
  for (const [w, h, tag] of [[412, 915, ''], [360, 640, '-360x640']]) {
    const p = await open(URL, { width: w, height: h });
    for (let k = 0; k < 40 && !(await p.eval('!!(window.__cp96&&__cp96.ready)')); k++) await sleep(100);
    await sleep(300);
    res['faces' + tag] = JSON.parse(await p.eval(fs.readFileSync(path.join(__dirname, 'facecheck.js'), 'utf8').replace(/^\/\/.*$/gm, '') + '(window)'));
    if (!tag) { await p.eval(`(async()=>{const d=document.createElement('div');d.id='faceSheet';d.style.cssText='position:fixed;inset:0;z-index:99;background:#222;display:flex;flex-wrap:wrap;gap:6px;padding:6px';for(const k of ['sleep','sweet','grin','yawn','calm']){const i=new Image();i.src=__cp96.IMGS[k];i.style.width='196px';d.appendChild(i);}document.body.appendChild(d);await new Promise(r=>setTimeout(r,300));})()`);
      await p.shot(path.join(OUT, 'faces.png')); await p.eval("document.getElementById('faceSheet').remove()"); }
    await p.shot(path.join(OUT, 'start' + tag + '.png'));
    res['tile' + tag] = (await tileXY(p, 0)).w;
    res['fits' + tag] = await p.eval(`(()=>{const c=document.getElementById('controls').getBoundingClientRect();const b=document.getElementById('boardFrame').getBoundingClientRect();return c.bottom<=innerHeight+0.5&&b.bottom<=c.top&&document.documentElement.scrollWidth<=innerWidth})()`);
    // first tap in the middle: always safe, opens an area
    await tap(p, 49);
    await sleep(170); await p.shot(path.join(OUT, 'cascade-mid' + tag + '.png'));
    await sleep(900); await p.shot(path.join(OUT, 'cascade-after' + tag + '.png'));
    res['firstOpen' + tag] = await p.eval('__cp96.S.opened');
    res['fair' + tag] = await p.eval('__cp96.S.fair');
    if (!tag) {
      // hold to paw two cats, then open every remaining safe coin by tapping
      const cats = JSON.parse(await p.eval('JSON.stringify(__cp96.S.cat.map((c,i)=>c?i:-1).filter(i=>i>=0))'));
      await hold(p, cats[0]); await hold(p, cats[1]);
      res.pawsAfterHold = await p.eval('__cp96.S.flag.reduce((a,b)=>a+b,0)');
      await sleep(300); await p.shot(path.join(OUT, 'paws.png'));
      for (let i = 0; i < 108; i++) {
        const st = await p.eval(`[__cp96.S.st,__cp96.S.open[${i}],__cp96.S.cat[${i}]].join()`);
        if (st.startsWith('won')) break;
        const [, o, c] = st.split(','); if (o === '1' || c === '1') continue;
        await tap(p, i); await sleep(140);
      }
      await sleep(500); await p.shot(path.join(OUT, 'win-moment.png'));
      await sleep(1600); await p.shot(path.join(OUT, 'win.png'));
      res.won = await p.eval('__cp96.S.st');
      // loss: tap "Practice board"... instead reset daily and tap a cat after first tap
      await p.eval('__cp96.reset(20261119,true)'); await sleep(300);
      await tap(p, 49); await sleep(900);
      const cat = await p.eval('__cp96.S.cat.findIndex(c=>c)');
      await tap(p, cat); await sleep(500); await p.shot(path.join(OUT, 'lose-yawn.png'));
      await sleep(1500); await p.shot(path.join(OUT, 'lose.png'));
      res.lost = await p.eval('__cp96.S.st');
      // one tap retry
      const btn = JSON.parse(await p.eval(`(()=>{const r=document.querySelector('#card .primary').getBoundingClientRect();return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2})})()`));
      await p.tap(btn.x, btn.y); await sleep(500);
      res.afterRetry = await p.eval('__cp96.S.st+","+__cp96.S.opened');
      // generator stats: every first tap, today's seed and 20 other seeds
      res.gen = JSON.parse(await p.eval(`(()=>{let n=0,fair=0,tries=0,worst=0;const t0=performance.now();
        for(let s=0;s<21;s++)for(let i=0;i<108;i++){const b=__cp96.makeBoard(20261119+s*37,i);n++;fair+=b.fair;tries+=b.tries;worst=Math.max(worst,b.tries);}
        return JSON.stringify({boards:n,fair,avgTries:+(tries/n).toFixed(1),worstTries:worst,avgMs:+((performance.now()-t0)/n).toFixed(1)})})()`));
    }
    res['logs' + tag] = p.logs.filter(l => /error|EXCEPTION/i.test(l));
    await p.close();
  }
  console.log(JSON.stringify(res, null, 1));
})();
