// Frames of A and B: fresh save and a mid-progress save (badges), Developer off; plus the end card and a tap through.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','tickets','CP-45-evidence','uat55');
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{for(const ab of ['A','B'])for(const save of ['fresh','mid']){const g=await game({src:path.join(__dirname,'release.html'),seed:3,render:true,storage:{'catpusher.uat.homelayout.v1':ab,'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);const errs=[];
 g.run('S.muted=false;S.dev=false');for(let i=0;i<130;i++){g.tick();}g.tap(200,400);
 if(save==='mid')g.run("PG.level=4;for(const c of ['tuxedo','orange','ragdoll'])PG.open[c]=1;PG.newBoard='ragdoll';PG.newPhoto=1;PG.items.notes=2;PG.items.milk=2;PG.items.biscuit=2;PG.recipes.tunadish=1;PG.seen['r:tunadish']=0;PG.coins=180;PG.catnip=4;PG.xp=40");
 for(let i=0;i<50;i++){try{g.tick();g.c.draw();}catch(e){errs.push(e.message);break;}}
 shot(g,`${ab}-${save}`);console.log(ab,save,g.run('PGU.screen'),g.run('WILD.phase'),errs.slice(0,2));g.close();}})();
