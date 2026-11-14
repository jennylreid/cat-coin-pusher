// Before/after title frames (UAT 53 vs UAT 54) at the same moments; then UAT 54 a while later, still on the title.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','tickets','CP-45-evidence','uat54','title');
(async()=>{for(const [tag,src] of [['uat53','../cp53/release.html'],['uat54','release.html']]){const g=await game({src:path.join(__dirname,src),seed:3,render:true});strictAudio(g);g.run('S.muted=false');
 const at=[.5,1,1.6,2.2,4,8];let t=0;for(const s of at){while(t<s){g.tick();t+=1/60;}g.c.draw();fs.writeFileSync(path.join(OUT,`${tag}-${s.toFixed(1)}s.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}
 console.log(tag,g.run('PGU.screen'));g.close();}})();
