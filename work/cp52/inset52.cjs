// The top bar under phone status bars of 0, 24, 32 and 48 px (Developer on and off): it must stay clear of the cat's ears.
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'..','..','tickets','CP-45-evidence','uat52');fs.mkdirSync(OUT,{recursive:true});
(async()=>{for(const [top,dev] of [[0,true],[24,false],[32,true],[32,false],[48,true]]){const g=await game({src:path.join(__dirname,'release.html'),seed:2,render:true});strictAudio(g);const errs=[];
 g.run(`androidSafeArea.top=${top};androidSafeArea.bottom=24;androidSafeArea.width=innerWidth`);frames(g,5,errs);g.run(`S.dev=${dev};PG.level=2;pgUnlocks(2);PGU.toasts=[];pgTitleDone()`);frames(g,40,errs);g.run('PGU.toasts=[]');
 g.c.draw();fs.writeFileSync(path.join(OUT,`bar-inset${top}-${dev?'dev':'player'}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));console.log(top,dev,g.run('JSON.stringify({b:pgDock().bottom,c:!!pgDock().compact})'),errs);g.close&&g.close();}})();
