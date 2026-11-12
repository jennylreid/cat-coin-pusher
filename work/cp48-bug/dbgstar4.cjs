const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('proto48.html'),seed:2});g.run('S.dev=true');
 g.run(`globalThis.__log=[];const __a=addCoin;addCoin=function(k,id,x,h,y,...r){const b=__a(k,id,x,h,y,...r);if(k==='item'){__log.push('add '+id+' '+Math.round(x)+','+Math.round(h)+','+Math.round(y));const p=b.rb;const s=p.setTranslation.bind(p);p.setTranslation=(t,w)=>{__log.push('move '+id+' '+Math.round(t.x/M)+','+Math.round(t.y/M)+','+Math.round(t.z/M));return s(t,w);};}return b;};`);
 g.run(`wildModeEnter('towers')`);console.log(g.run('JSON.stringify(__log.slice(-14),null,1)'),g.run('WILD.star'));
 console.log(g.run(`JSON.stringify(bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>[b.id,Math.round(b.rb.translation().x/M),Math.round(b.rb.translation().y/M),Math.round(b.rb.translation().z/M)]))`));})();
