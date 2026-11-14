const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),render:false,seed:5});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
const snap=()=>JSON.parse(g.run("JSON.stringify(bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),+(p.x/M).toFixed(1),+(p.y/M).toFixed(1),+(p.z/M).toFixed(1)]}))"));
for(const n of [5,7]){g.run(`PG.lv.sel=${n};PG.lv.passed=9;wildReset()`);const a=snap();for(let k=0;k<3;k++){g.run('wildReset()');const b=snap();
 const d=a.map((x,i)=>[x[0],x.slice(1).join(','),b[i].slice(1).join(','),Math.hypot(x[1]-b[i][1],x[2]-b[i][2],x[3]-b[i][3])]).filter(r=>r[3]>1);console.log(n,k,JSON.stringify(d));}}
})();
