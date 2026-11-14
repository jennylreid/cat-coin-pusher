const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','tickets','CP-45-evidence','uat58');
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:3,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);g.run('S.dev=false');
 let t=0;for(const s of [1.0,1.6]){while(t<s){g.tick();t+=1/60;}g.c.draw();const cv=g.c.document.getElementById('cv');fs.writeFileSync(path.join(OUT,`pupils-title-${s}s.png`),cv.toBuffer('image/png'));}
 console.log(g.run('PGU.title.t'));g.close();})();
