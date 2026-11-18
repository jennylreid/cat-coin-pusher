// Sleep probe: Level 3, no input; sleeping share of coin pieces every 2 s, with the pusher moving and with it held still.
const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),seed:3});g.run('S.muted=true;S.dev=false');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);g.run('WILD.nextBonus=999');
 const S="(()=>{let p=0,s=0,band={};for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5')){p++;if(b.rb.isSleeping())s++;}return JSON.stringify({pieces:p,sleeping:s,islandsAwake:world.bodies?undefined:0});})()";
 for(let i=0;i<5;i++){g.ticks(120);console.log('pusher moving',g.run(S));}
 g.run("globalThis.__pz=null;");const keys=g.run("Object.keys(globalThis).filter(k=>/push/i.test(k)).join(',')");console.log('pusher globals:',keys.slice(0,300));
})().catch(e=>{console.error(e);process.exit(1)});
