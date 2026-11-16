const {game}=require('../cp43/harness.cjs'),path=require('path');
const pzJ="bodies.filter(b=>!b.dead&&b.kind!=='stack'&&b.kind!=='coin'&&b.kind!=='silver').map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),Math.round(p.x/M),Math.round(p.z/M),Math.round(p.y/M)]}).sort()";
(async()=>{const gs=[];for(const s of ['release.html','../cp47-levels/release.html']){const g=await game({src:path.resolve(s),seed:5});g.ticks(150);g.tap(200,700);g.ticks(30);gs.push(g);}
 for(const n of [4,6]){const R=gs.map(g=>{g.run(`PG.lv.passed=9;PG.lv.sel=${n};wildReset();`);g.ticks(2);return JSON.parse(g.run('JSON.stringify('+pzJ+')'));});
  const r2=(()=>{const g=gs[0];g.run(`wildReset();`);g.ticks(2);return JSON.parse(g.run('JSON.stringify('+pzJ+')'));})();
  R[0].forEach((x,i)=>{const y=R[1][i],z=r2[i];if(Math.hypot(x[1]-y[1],x[2]-y[2])>3||JSON.stringify(x)!==JSON.stringify(z))console.log('L'+n,'63',x,'62',y,'replay',z);});}})();
