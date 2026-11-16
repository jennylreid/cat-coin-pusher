const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),seed:3,render:true});const errs=[];frames(g,5,errs);
g.run("globalThis.__fo=[];const __f=fallOff;fallOff=function(b,x){try{__fo.push([b.kind,Math.round(x),Math.round(b.rb.translation().z/M),board.status]);}catch(e){}return __f(b,x);}");
g.run("pgPlay('tuxedo');wildStartCountdown()");let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);
for(let s=0;s<40&&g.run("WILD.phase==='play'");s++){g.run(`S.coins=Math.max(S.coins,30);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);frames(g,60,errs);}
const fo=JSON.parse(g.run('JSON.stringify(__fo)'));const by={};for(const f of fo){const key=f[0]+(Math.abs(f[1]-200)>150?' side':' front')+' z'+(f[2]>=g.run('T.FRONT')-30?'F':'B');by[key]=(by[key]||0)+1;}
console.log(JSON.stringify({by,pgCoins:g.run('WILD.pgCoins'),FRONT:g.run('T.FRONT'),sample:fo.slice(0,5),errs}));})();
