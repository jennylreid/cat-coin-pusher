const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('proto48.html'),seed:2});g.run('S.dev=true');
 g.run(`globalThis.__log=[];const pos=()=>bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id+':'+Math.round(b.rb.translation().x/M)+','+Math.round(b.rb.translation().y/M)+'#'+b.uid).join(' ');
 const __p=wildPrefill;wildPrefill=function(){__p();__log.push('after prefill '+pos());};
 const __r=wildReset;wildReset=function(){const r=__r();__log.push('after reset '+pos());return r;};`);
 g.run(`wildModeEnter('towers')`);console.log(g.run('__log.join(String.fromCharCode(10))'));})();
