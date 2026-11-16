const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('proto48.html'),seed:2});g.run('S.dev=true');g.run(`wildModeEnter('towers')`);
 const st=()=>g.run(`JSON.stringify(bodies.filter(b=>!b.dead&&(b.kind==='stack'||b.twTop)).map(b=>{const p=b.rb.translation();return [b.kind==='stack'?'T'+b.twSlot+'/'+b.n:b.id,Math.round(p.x/M),Math.round(p.y/M),Math.round(p.z/M),+qrot(b.rb.rotation(),{x:0,y:1,z:0}).y.toFixed(3),b.rb.isSleeping()]}))`);
 console.log(st());g.ticks(60);console.log(st());})();
