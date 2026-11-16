const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('proto48.html'),seed:2});g.run('S.dev=true');
 g.run(`globalThis.__log=[];const __r=wildReset;wildReset=function(){__log.push('reset star before='+WILD.star+' mode='+WILD.mode+' v2='+WILD.v2);const r=__r();__log.push('reset done star='+WILD.star+' top='+bodies.filter(b=>b.twTop).map(b=>b.id).join(','));return r;};`);
 g.run(`wildModeEnter('towers')`);console.log(g.run('JSON.stringify(__log,null,1)'),g.run('WILD.star'));})();
