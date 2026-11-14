// Before/after (UAT 57 vs UAT 58): the main screen (layout A) and the title (rain 2 and rain 1), same moments; plus a close-up.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','tickets','CP-45-evidence','uat58');
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{for(const [tag,src] of [['uat57','../cp57/release.html'],['uat58','release.html']]){
 for(const tc of ['2','1']){const g=await game({src:path.join(__dirname,src),seed:3,render:true,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.titlecoins.v1':tc}});strictAudio(g);g.run('S.dev=false');
  for(let i=0;i<150;i++){g.tick();if(i%3===0)g.c.draw();}shot(g,`${tag}-title${tc}`);
  if(tc==='2'){g.tap(200,400);for(let i=0;i<150;i++){g.tick();if(i%3===0)g.c.draw();}shot(g,`${tag}-main`);}g.close();}}})();
