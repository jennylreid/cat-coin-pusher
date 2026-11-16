// Every string drawn on the canvas that says "wild", across title, boards (all 5 cats), rounds, end cards, picker, screens.
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||path.join(__dirname,'..','cp52','release.html')),dev=process.argv[3]==='dev';
(async()=>{const seen={};const g=await game({src,seed:4,render:true});strictAudio(g);
 g.run(`S.muted=false;globalThis.__w={};for(const k of ['fillText','strokeText']){const P=Object.getPrototypeOf(ctx),o=P[k];P[k]=function(t,...a){if(/wild/i.test(String(t)))__w[String(t)]=(__w[String(t)]||0)+1;return o.call(this,t,...a);};}`);
 const errs=[];const draw=n=>{for(let i=0;i<n;i++){g.tick();try{g.c.draw();}catch(e){errs.push(e.message);}}};
 draw(20);g.tap(200,400);draw(40);g.run(`S.dev=${dev};PG.level=6;for(const c of PG_CATS)PG.open[c]=1`);draw(10);
 for(const cat of (process.env.CATS||'tuxedo,orange,ragdoll,siamese,tortie').split(',')){g.run(`pgSwitchBoard('${cat}')`);draw(60);
  g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)draw(1);
  for(let s=0;s<(+process.env.SECS||70)&&g.run("WILD.phase==='play'");s++){g.run(`S.coins=Math.max(S.coins,40);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);draw(60);}g.run('holding=false');draw(200);}
 g.run('PGU.pick=true');draw(30);g.run('PGU.pick=false');for(const sc of ['kitchen','porch','album','shop']){g.run(`PGU.screen='${sc}'`);draw(20);}
 console.log(dev?'dev':'nodev',g.run('JSON.stringify(__w)'),errs.slice(0,3));g.close();})();
