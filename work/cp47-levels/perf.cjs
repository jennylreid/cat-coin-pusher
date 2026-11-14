// desktop cost per game tick (physics + logic, no drawing) during a round with steady drops; and the most bodies at once
const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const n=+process.env.LV;const g=await game({src:path.resolve('release.html'),render:false,seed:3});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
g.run(`PG.lv.passed=9;PG.lv.sel=${n};wildReset();PGU.screen='board';pgStartRound();`);g.until("WILD.phase==='play'",900);let t=[],mx=0;
for(let s=0;s<90&&g.run("WILD.phase==='play'");s++){g.run(`tryDrop({x:${Math.round(200+120*Math.sin(s*.8))},y:DROP_Y})`);for(let i=0;i<27;i++){const a=process.hrtime.bigint();g.tick();t.push(Number(process.hrtime.bigint()-a)/1e6);}mx=Math.max(mx,+g.run('bodies.filter(b=>!b.dead).length'));}
t.sort((a,b)=>a-b);const avg=t.reduce((a,b)=>a+b,0)/t.length;console.log(JSON.stringify({level:n,ticks:t.length,avgMs:+avg.toFixed(2),p95:+t[Math.floor(t.length*.95)].toFixed(2),maxBodies:mx}));})();
