const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||path.join(__dirname,'..','cp52','release.html'));
(async()=>{for(const seed of [3,5]){const g=await game({src,seed,render:true});strictAudio(g);g.run('S.muted=false;S.dev=true');const errs=[];
 g.run(`globalThis.__log=[];globalThis.__dr={};const q=queueTreatAward;queueTreatAward=function(id,x,b,p,k){const f=q(id,x,b,p,k);__log.push({id,k:k||'item',pop:f.pop,ms:+f.ms.toFixed(2),s0:+f.s0.toFixed(2),pw:Math.round(prizeWidth(id,f.ms)),mx:Math.round(f.mx),my:Math.round(f.my),x0:Math.round(f.x0),y0:Math.round(f.y0),wild:WILD_PRIZES.includes(id)});return f;};
 const df=drawFlight;drawFlight=function(f){__dr[f.id]=(__dr[f.id]||0)+1;return df(f);};`);
 for(let i=0;i<20;i++){g.tick();g.c.draw();}g.tap(200,400);for(let i=0;i<40;i++){g.tick();g.c.draw();}
 g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);
 for(let s=0;s<70&&g.run("WILD.phase==='play'");s++){g.run(`S.coins=Math.max(S.coins,40);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);frames(g,60,errs);}
 console.log(seed,g.run('JSON.stringify(__log)'),g.run('JSON.stringify(__dr)'),errs.slice(0,2));g.close();}})();
