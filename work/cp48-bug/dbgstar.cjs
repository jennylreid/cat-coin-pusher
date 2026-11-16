const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('proto48.html'),seed:2});g.run('S.dev=true');g.run(`wildModeEnter('towers')`);
 console.log(g.run(`JSON.stringify({star:WILD.star,items:bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>[b.id,b.twTop||false,Math.round(b.rb.translation().x/M),Math.round(b.rb.translation().y/M),Math.round(b.rb.translation().z/M)])})`));
 g.ticks(30);console.log(g.run(`JSON.stringify({star:WILD.star,items:bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>[b.id,b.twTop||false,Math.round(b.rb.translation().x/M),Math.round(b.rb.translation().y/M),Math.round(b.rb.translation().z/M)])})`));})();
