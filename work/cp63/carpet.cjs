// PM question: starting coins per level now, and if every level had the full 9-row carpet (53) with its towers on top.
const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),seed:5});g.ticks(150);g.tap(200,700);g.ticks(30);
 for(let n=1;n<=10;n++){g.run(`PG.lv.passed=9;PG.lv.sel=${n};wildReset();`);g.ticks(3);
  const r=JSON.parse(g.run(`JSON.stringify((()=>{const L=pglLevel();const st=bodies.filter(b=>!b.dead&&b.kind==='stack');const towerCoins=st.reduce((s,b)=>s+(b.n||b.count||0),0);
   return {n:${n},name:L.name,carpet:bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')).length,stacks:st.length,towerCoins,stackKeys:st[0]?Object.keys(st[0]).filter(k=>typeof st[0][k]==='number').join(','):'' ,rain:bodies.filter(b=>!b.dead&&RAIN[b.kind]).length,quake:bodies.some(b=>!b.dead&&b.kind==='quake'),prizes:bodies.filter(b=>!b.dead&&b.kind==='item').length,bank:S.coins}})())`));console.log(JSON.stringify(r));}})();
