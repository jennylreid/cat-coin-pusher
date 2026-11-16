// UAT 56 frames: the 4 title coin rains; the round HUD (Board button, Dance meter, hint) at status bars 0/24/48 and two
// screen heights; layout A and B at 720 and 889 high.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','tickets','CP-45-evidence','uat56');
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const which=process.argv[2]||'all';
(async()=>{
 if(which==='all'||which==='title')for(const v of [1,2,3,4]){const g=await game({src:path.join(__dirname,'release.html'),seed:3,render:true,storage:{'catpusher.uat.titlecoins.v1':String(v)}});strictAudio(g);g.run('S.muted=false');
  let t=0;for(const s of [1.2,3,6]){while(t<s){g.tick();t+=1/60;if(Math.round(t*60)%3===0)g.c.draw();}shot(g,`title${v}-${s}s`);}console.log('title',v,g.run('PGU.title.coins.length'),g.run('PGU.title.pile?PGU.title.pile.length:0'));g.close();}
 if(which==='all'||which==='hud')for(const [height,inset] of [[889,0],[889,48],[720,24],[720,48]]){const g=await game({src:path.join(__dirname,'release.html'),seed:3,render:true,height,storage:{'catpusher.uat.homelayout.v1':'B','catpusher.uat.devdefault.v1':'1'}});strictAudio(g);
  g.run(`androidSafeArea.top=${inset};androidSafeArea.bottom=24;androidSafeArea.width=innerWidth;S.muted=false;S.dev=false`);g.ticks(130);g.tap(200,400);g.ticks(40);g.run('wildStartCountdown()');g.ticks(260);
  g.run('danceFill(1,200)');g.ticks(20);shot(g,`hud-${height}-inset${inset}`);
  console.log('hud',height,inset,g.run("JSON.stringify((()=>{const h=hudLayout(),b=wildButton();return {btn:[b.x,b.y,b.x+b.w,b.y+b.h].map(Math.round),label:Math.round(h.bannerY-13),meterTop:Math.round(h.bannerY-7),hint:!!PGU.dHint}})())"));g.close();}
 if(which==='all'||which==='ab')for(const ab of ['A','B'])for(const height of [720,889]){const g=await game({src:path.join(__dirname,'release.html'),seed:3,render:true,height,storage:{'catpusher.uat.homelayout.v1':ab,'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);
  g.run('S.muted=false;S.dev=false');g.ticks(130);g.tap(200,400);for(let i=0;i<40;i++){g.tick();if(i%4===0)g.c.draw();}g.run("PG.level=4;PG.passed=11;for(const c of ['tuxedo','orange','ragdoll'])PG.open[c]=1;PG.newBoard='ragdoll';PG.newPhoto=1;PG.recipes.tunadish=1;PG.seen['r:tunadish']=0");g.ticks(5);shot(g,`${ab}-${height}`);g.close();}
})();
