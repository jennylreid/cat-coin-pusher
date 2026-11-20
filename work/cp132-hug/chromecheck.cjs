// CP-74 Hug rescue (UAT 131) real-Chrome check (phone emulation) on a runtime folder: boots to Home with the right build name,
// plays the Ragdoll's Hug on Level 3 with both side edges crowded, checks pieces were moved in, nothing errors, the Hug ends.
// Usage: node chromecheck.cjs <runtime folder under work/> <evidence dir>   (needs the review server on 8795)
const { open, sleep } = require('../cp84-puzzles/tools/cdp.cjs');
const fs = require('fs'), path = require('path');
const dir = process.argv[2], OUT = path.resolve(__dirname, process.argv[3]);fs.mkdirSync(OUT, { recursive: true });
const results = []; let fails = 0;
const check = (name, ok, info) => { results.push({ name, ok: !!ok, info }); if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? ' ' + JSON.stringify(info) : '')); };
async function toHome(p) {
  for (let i = 0; i < 60; i++) { const s = await p.eval("typeof PGU!=='undefined'&&PGU?PGU.screen:'none'"); if (s === 'main') return true; if (s === 'title') { const v = await p.eval('[innerWidth,innerHeight]'); await p.tap(v[0] / 2, v[1] * 0.93); } await sleep(500); }
  return false;
}
(async () => {
  for (const [w, h] of [[412, 915], [360, 640]]) {
    const tag = `${w}x${h}`;const p = await open(`http://127.0.0.1:${process.env.PORT||8795}/work/${dir}/index.html`, { width: w, height: h });await sleep(5000);
    check(`${tag} reaches Home`, await toHome(p));
    const bn = await p.eval('BUILD');check(`${tag} build name`, !process.env.EXPECT_BUILD || bn === process.env.EXPECT_BUILD, bn);
    check(`${tag} rescue block present`, await p.eval("typeof Z74R==='object'&&typeof z74RescueTick==='function'"));
    await p.eval(`(()=>{if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.current='ragdoll';{const L=pglLv();L.passed=Math.max(L.passed,2);L.sel=3;}
      try{pgPlay('ragdoll');}catch(e){}if(WILD.phase==='end')wildReset();wildStartCountdown();return 1;})()`);
    for (let k = 0; k < 40 && (await p.eval('WILD.phase')) !== 'play'; k++) await sleep(250);
    await p.eval("WILD.nextBonus=999;if(typeof WILD.nextToss==='number')WILD.nextToss=999;WILD.left=60;1");await sleep(1500);
    await p.eval("for(let i=0;i<16;i++){const s=i%2?1:-1;addCoin('coin',null,200+s*rand(120,142),40+i*3,rand(460,730),yawTurn(rand(0,6)));}addCoin('item','yarn',58,50,560,yawTurn(0));addCoin('item','duck',342,50,640,yawTurn(0));1");
    await sleep(1500);
    const tapped = await p.eval("(()=>{PG.powers=PG.powers||{};PG.powers[pgpCat()]=Math.max(1,pgpCount());if(board.status==='ready')board.status='playing';const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});return !!PGPX;})()");
    check(`${tag} Hug starts`, tapped);
    await sleep(5000);await p.shot(path.join(OUT, `chrome-hug-${tag}.png`));
    const mid = await p.eval("({walls:!!(PGPX&&PGPX.cols),moved:Z74R.stats.moved,err:Z74.err||null})");
    check(`${tag} during the hold: walls up, edge pieces moved in, no Hug error`, mid.walls && mid.moved > 0 && !mid.err, mid);
    await sleep(7000);
    const end = await p.eval("({px:PGPX===null,err:Z74.err||null})");check(`${tag} Hug ends cleanly`, end.px && !end.err, end);
    const ex = p.logs.filter(l => l.startsWith('EXCEPTION'));check(`${tag} no exceptions`, !ex.length, ex.slice(0, 3));
    await p.close();
  }
  const res = { build: dir, passed: !fails, failed: results.filter(r => !r.ok).map(r => r.name), results };
  fs.writeFileSync(path.join(OUT, 'chromecheck.json'), JSON.stringify(res, null, 1));console.log(fails ? 'FAILED' : 'ALL PASS');process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
