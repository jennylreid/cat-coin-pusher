const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||path.join(__dirname,'..','cp52','release.html'));
(async()=>{for(const cat of ['orange','ragdoll','siamese','tortie']){const g=await game({src,seed:4,render:true});strictAudio(g);g.run('S.muted=false;S.dev=true');const errs=[];
 g.run(`globalThis.__log=[];const q=queueTreatAward;queueTreatAward=function(id,x,b,p,k){const f=q(id,x,b,p,k);const tg=pickupTarget();__log.push([id,k||'item',f.pop?'pop':'nopop',Math.round(prizeWidth(id,f.ms)),Math.round(tg.x)]);return f;};`);
 for(let i=0;i<20;i++){g.tick();g.c.draw();}g.tap(200,400);for(let i=0;i<40;i++){g.tick();g.c.draw();}
 g.run(`PG.level=6;for(const c of PG_CATS)PG.open[c]=1;pgSwitchBoard('${cat}')`);for(let i=0;i<60;i++){g.tick();g.c.draw();}
 g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);
 for(let s=0;s<60&&g.run("WILD.phase==='play'");s++){g.run(`S.coins=Math.max(S.coins,40);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);frames(g,60,errs);}
 console.log(cat,g.run('WILD.mode'),g.run('JSON.stringify(__log.filter(l=>l[1]!=="item"||!/^rain|^note/.test(l[0])))'),errs.slice(0,2));g.close();}})();
