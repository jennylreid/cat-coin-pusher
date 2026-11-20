// CP-96 (UAT 129; from CP-87's work/cp107/homecheck.cjs) real-Chrome check (phone emulation, touch input only) of Home > Daily puzzles on a runtime folder.
// Usage: node homecheck.cjs <runtime folder under work/> <evidence dir>   e.g. node homecheck.cjs cp107/bootdev ../../tickets/CP-87-evidence/dev
// Prints PASS/FAIL lines and writes homecheck.json + screenshots to the evidence dir. Needs the review server on 8795.
const { open, sleep } = require('../cp84-puzzles/tools/cdp.cjs');
const fs = require('fs'), path = require('path');
const dir = process.argv[2], OUT = path.resolve(__dirname, process.argv[3]);
fs.mkdirSync(OUT, { recursive: true });
const results = []; let fails = 0;
const check = (name, ok, info) => { results.push({ name, ok: !!ok, info }); if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? ' ' + JSON.stringify(info) : '')); };
const PZ = ['sleepy-coins', 'paw-swat', 'cat-cafe'];

async function toHome(p) {
  for (let i = 0; i < 60; i++) { const s = await p.eval("typeof PGU!=='undefined'&&PGU?PGU.screen:'none'"); if (s === 'main') return true; if (s === 'title') { const v = await p.eval('[innerWidth,innerHeight]'); await p.tap(v[0] / 2, v[1] * 0.93); } await sleep(500); }
  return false;
}
async function domTap(p, sel) {
  const r = await p.eval(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
  if (!r) return false; await p.tap(r.x, r.y); return true;
}
(async () => {
  for (const [w, h] of [[412, 915], [360, 640]]) {
    const tag = `${w}x${h}`;
    const p = await open(`http://127.0.0.1:8795/work/${dir}/index.html`, { width: w, height: h });
    await sleep(5000);
    check(`${tag} reaches Home`, await toHome(p));
    { const bn = await p.eval('BUILD'); results.push({ name: `${tag} build name`, ok: !process.env.EXPECT_BUILD || bn === process.env.EXPECT_BUILD, info: bn }); if (process.env.EXPECT_BUILD && bn !== process.env.EXPECT_BUILD) { fails++; console.log('FAIL build name ' + bn); } }
    await sleep(800);
    await p.shot(path.join(OUT, `home-${tag}.png`));
    // UAT 129: since UAT 127 (CP-100) Daily puzzles is a round button under Cats on the right (cp100DailyBtn); the centre button is gone
    const b = await p.eval("(()=>{const d=cp100DailyBtn(),r=cv.getBoundingClientRect();return {old:cp87Btn(),x:r.left+d.x*scale,y:r.top+d.y*scale,left:r.left+(d.x-d.r)*scale,right:r.left+(d.x+d.r)*scale,top:r.top+(d.y-d.r)*scale,bot:r.top+(d.y+d.r)*scale,innerW:innerWidth,innerH:innerHeight}})()");
    check(`${tag} the round Daily puzzles button (under Cats) is on screen; the old centre button is gone`, b.old === null && b.left >= 0 && b.right <= b.innerW && b.top >= 0 && b.bot <= b.innerH, b);
    const t0 = await p.eval('PGU.T');
    await p.tap(b.x, b.y); await sleep(700);
    check(`${tag} the opening tap doesn't also open a puzzle`, await p.eval('CP87.cur===null&&!document.querySelector("#cp87 iframe")'));
    check(`${tag} tapping it opens the menu`, await p.eval("CP87.open&&getComputedStyle(document.getElementById('cp87')).display==='flex'&&PGU.screen==='main'"));
    const tA = await p.eval('PGU.T'); await sleep(1000); const tB = await p.eval('PGU.T');
    check(`${tag} the game is paused while the menu is open`, tB === tA, { tA, tB });
    check(`${tag} menu lists the three puzzles in order`, await p.eval("[...document.querySelectorAll('#cp87 .pz')].map(e=>e.dataset.p).join()") === PZ.join());
    await p.shot(path.join(OUT, `menu-${tag}.png`));
    for (const id of PZ) {
      await domTap(p, `#cp87 .pz[data-p="${id}"]`); await sleep(1800);
      const st = await p.eval(`(()=>{const f=document.querySelector('#cp87 iframe');if(!f)return null;const d=f.contentDocument,r=f.getBoundingClientRect();return {cur:CP87.cur,shim:typeof f.contentWindow.__cp87setVol==='function',top:r.top,h:r.height,w:r.width,bodyH:d.body.scrollHeight,title:d.title}})()`);
      check(`${tag} ${id} opens full width under the bar`, st && st.cur === id && st.shim && st.w === w && st.top >= 50 && st.h >= h - 60, st);
      // play: one tap inside the page (sound starts after a tap), then make sure the page is alive
      const fr = await p.eval("(()=>{const r=document.querySelector('#cp87 iframe').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}})()");
      if (id === 'sleepy-coins') {
        for (let k = 0; k < 50 && !(await p.eval("!!document.querySelector('#cp87 iframe').contentWindow.__cp96.ready")); k++) await sleep(100);
        const art = await p.eval("(()=>{const w=document.querySelector('#cp87 iframe').contentWindow;return {blob:Object.values(w.IMGS).every(u=>String(u).startsWith('blob:')),ok:[...w.document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0)}})()");
        check(`${tag} sleepy-coins draws the game's own coin and faces`, art.blob && art.ok, art);
        // CP-96 pupils fix: every face has its pupils (Sweet, Sharp Grin, Calm) or its closed-eye layer (sleeping); no blank eye yellow
        const fc = JSON.parse(await p.eval(fs.readFileSync(path.join(__dirname, '../cp96-minesweeper/tools/facecheck.js'), 'utf8').replace(/^\/\/.*$/gm, '') + "(document.querySelector('#cp87 iframe').contentWindow)"));
        check(`${tag} sleepy-coins: no face without its pupils or closed-eye layer`, fc.ok, fc.faces);
        const fit = await p.eval(`(()=>{const w=document.querySelector('#cp87 iframe').contentWindow,d=w.document;const c=d.getElementById('controls').getBoundingClientRect(),b=d.getElementById('boardFrame').getBoundingClientRect(),t=w.__cp96.tiles[0].getBoundingClientRect();return {fits:c.bottom<=w.innerHeight+0.5&&b.bottom<=c.top&&d.documentElement.scrollWidth<=w.innerWidth,tile:Math.round(t.width),daily:d.getElementById('daylabel').textContent}})()`);
        check(`${tag} sleepy-coins fits the frame (board, buttons, no sideways scroll)`, fit.fits, fit);
        const bb = await p.eval(`(()=>{const w=document.querySelector('#cp87 iframe').contentWindow;const b=w.__cp96.tiles[49].getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
        await p.tap(fr.x + bb.x, fr.y + bb.y); await sleep(1500);
        const s2 = await p.eval("(()=>{const S=document.querySelector('#cp87 iframe').contentWindow.__cp96.S;return {st:S.st,opened:S.opened,fair:S.fair}})()");
        check(`${tag} sleepy-coins first tap opens an area`, s2.st === 'play' && s2.opened > 1 && s2.fair, s2);
        const snd = await p.eval("(()=>{const D=document.querySelector('#cp87 iframe').contentWindow.__cp96.SND;return Object.keys(D).sort().map(k=>k+':'+D[k].buf.duration.toFixed(2)+'@'+D[k].off+'+'+D[k].dur)})()");
        check(`${tag} sleepy-coins plays the game's own coin-drop, coin-land and coin-spill takes`, snd.length === 3 && snd[0].startsWith('land:') && snd[1].startsWith('spill:4.') && snd[2].startsWith('tick:'), snd);
      } else if (id === 'paw-swat' || id === 'cat-cafe') {
        const bb = await p.eval(`(()=>{const f=document.querySelector('#cp87 iframe'),e=f.contentDocument.querySelector('[data-l="1"]');const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
        await p.tap(fr.x + bb.x, fr.y + bb.y); await sleep(1200);
        const s2 = await p.eval("document.querySelector('#cp87 iframe').contentWindow.__cp84.S.st");
        check(`${tag} ${id} puzzle 2 starts from a tap`, s2 === 'aim' || s2 === 'play', s2);
      } else {
        const bb = await p.eval(`(()=>{const d=document.querySelector('#cp87 iframe').contentDocument;const e=d.querySelector('button.shot:not([disabled])')||[...d.querySelectorAll('main button:not(.small):not([disabled])')][0];if(!e)return null;e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2,t:e.textContent.trim().slice(0,20)}})()`);
        if (bb) { await p.tap(fr.x + bb.x, fr.y + bb.y); await sleep(1200); }
        check(`${tag} ${id} a control was tapped`, !!bb, bb);
      }
      const au = await p.eval("(()=>{const w=document.querySelector('#cp87 iframe').contentWindow;return {n:(w.__cp87ac||[]).length,vol:w.__cp87vol,states:(w.__cp87ac||[]).map(x=>x.c.state),gains:(w.__cp87ac||[]).map(x=>x.g.gain.value)}})()");
      check(`${tag} ${id} sound runs through the app's volume after a tap`, au.n >= 1 && au.vol === 1 && au.gains.every(g => g === 1), au);
      await p.shot(path.join(OUT, `${id}-${tag}.png`));
      await domTap(p, '#cp87 [data-a="back"]'); await sleep(500);
      check(`${tag} ${id} back returns to the menu and closes the page`, await p.eval("!document.querySelector('#cp87 iframe')&&CP87.cur===null&&document.querySelector('#cp87 .menu').style.display==='flex'"));
    }
    // app sound off -> puzzles silent
    await p.eval('S.muted=true'); await domTap(p, '#cp87 .pz[data-p="paw-swat"]'); await sleep(1500);
    const fr2 = await p.eval("(()=>{const r=document.querySelector('#cp87 iframe').getBoundingClientRect();return {x:r.left,y:r.top}})()");
    const bb2 = await p.eval(`(()=>{const e=document.querySelector('#cp87 iframe').contentDocument.querySelector('[data-l="0"]');const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
    await p.tap(fr2.x + bb2.x, fr2.y + bb2.y); await sleep(800);
    const mu = await p.eval("(()=>{const w=document.querySelector('#cp87 iframe').contentWindow;return {vol:w.__cp87vol,gains:(w.__cp87ac||[]).map(x=>x.g.gain.value)}})()");
    check(`${tag} with the app's sound off the puzzle is silent`, mu.vol === 0 && mu.gains.length && mu.gains.every(g => g === 0), mu);
    // background: the puzzle's sound is held, then resumes
    await p.eval('appPaused(true)'); await sleep(300);
    const bg = await p.eval("document.querySelector('#cp87 iframe').contentWindow.__cp87ac.map(x=>x.c.state)");
    await p.eval('appPaused(false)'); await sleep(300);
    const fg = await p.eval("document.querySelector('#cp87 iframe').contentWindow.__cp87ac.map(x=>x.c.state)");
    check(`${tag} app in background holds the puzzle's sound; back in front it resumes`, bg.every(s => s === 'suspended') && fg.every(s => s === 'running'), { bg, fg });
    await p.eval('S.muted=false');
    // Home from inside a puzzle
    await domTap(p, '#cp87 [data-a="home"]'); await sleep(800);
    const t1 = await p.eval('PGU.T'); await sleep(700); const t2 = await p.eval('PGU.T');
    check(`${tag} Home closes the puzzles and Home runs again`, await p.eval("!CP87.open&&getComputedStyle(document.getElementById('cp87')).display==='none'&&!document.querySelector('#cp87 iframe')&&PGU.screen==='main'") && t2 > t1, { t1, t2 });
    await p.shot(path.join(OUT, `home-after-${tag}.png`));
    // PLAY still starts a round
    const pl = await p.eval("(()=>{const L=PGA.L.play,r=cv.getBoundingClientRect();return {x:r.left+(L.x+L.w/2)*scale,y:r.top+(L.y+L.h/2)*scale}})()");
    await p.tap(pl.x, pl.y); await sleep(2500);
    check(`${tag} PLAY still starts a round`, await p.eval("PGU.screen==='board'"));
    const errs = p.logs.filter(l => /EXCEPTION|error/i.test(l));
    check(`${tag} no errors`, errs.length === 0, errs.slice(0, 5));
    await p.close();
  }
  fs.writeFileSync(path.join(OUT, 'homecheck.json'), JSON.stringify({ build: dir, passed: fails === 0, failed: results.filter(r => !r.ok).map(r => r.name), results }, null, 1));
  console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exitCode = fails ? 1 : 0;
})().catch(e => { console.error(e); process.exit(1); });
