// Desktop ms per game tick over the first 5 s after GO, heaviest levels, UAT 63 vs UAT 62 (sequential, no other load).
const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const out={};for(const [k,s] of [['uat64','release.html'],['uat62','../cp47-levels/release.html']]){const g=await game({src:path.resolve(s),seed:5});g.ticks(150);g.tap(200,700);g.ticks(30);
 for(const n of [1,5,6,9,10]){g.run(`PG.lv.passed=9;PG.lv.sel=${n};wildReset();PGU.screen='board';pgStartRound();`);g.until("WILD.phase==='play'",900);
  let ms=0,mx=0;for(let i=0;i<300;i++){const a=g.realNow();g.tick();const d=g.realNow()-a;ms+=d;mx=Math.max(mx,d);}
  (out['L'+n]=out['L'+n]||{})[k]={msPerTick:+(ms/300).toFixed(2),maxTick:+mx.toFixed(1),bodies:+g.run('bodies.length')};}}
 console.log(JSON.stringify(out,null,0));require('fs').writeFileSync('../../tickets/CP-48-evidence/uat64/start-frame-cost.json',JSON.stringify(out,null,1));})();
