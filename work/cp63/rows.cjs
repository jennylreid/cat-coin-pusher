// Row structure of a level's opening board: coins grouped by z.
const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||'../cp47-levels/release.html'),LV=+(process.env.LV||1);
(async()=>{const g=await game({src,render:false});g.ticks(150);g.tap(200,700);g.ticks(40);
 g.run(`PG.lv.passed=Math.max(PG.lv.passed,${LV-1});PG.lv.sel=${LV};wildReset();`);g.ticks(5);
 console.log(g.run(`JSON.stringify({lvl:pglLevel()&&pglLevel().name,PUSH_MAX,COIN_R,FRONT:T.FRONT})`));
 const r=JSON.parse(g.run(`JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id||'',Math.round(b.rb.translation().x/M),Math.round(b.rb.translation().z/M),Math.round(b.rb.translation().y/M)]))`));
 const rows={};for(const [k,id,x,z,y] of r){if(k==='coin'||k==='silver'){(rows[z]=rows[z]||[]).push(x);}else console.log('piece',k,id,x,z,y);}
 for(const z of Object.keys(rows).sort((a,b)=>a-b))console.log('row z',z,rows[z].length);
 console.log('coins',Object.values(rows).flat().length);
})();
