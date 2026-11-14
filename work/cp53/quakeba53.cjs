// Before/after: the Quake coin's pickup in UAT 52 (striped box) and UAT 53 (the hop), same board, same moments.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','tickets','CP-45-evidence','uat53','pickup');fs.mkdirSync(OUT,{recursive:true});
(async()=>{for(const [tag,src] of [['uat52','../cp52/release.html'],['uat53','release.html']]){const g=await game({src:path.join(__dirname,src),seed:3,render:true});strictAudio(g);g.run('S.muted=false');
 for(let i=0;i<20;i++)g.tick();g.tap(200,400);for(let i=0;i<40;i++)g.tick();g.run('wildStartCountdown()');for(let i=0;i<260;i++)g.tick();
 for(const [id,k] of [['quake','quake'],['cheese','item'],['tuna','item']]){g.run(`treatAwards.length=0;queueTreatAward('${id}',150,null,false,'${k}')`);
 for(let i=1;i<=90;i++){g.tick();if([3,8,14,22,30,40,50].includes(i)){g.c.draw();fs.writeFileSync(path.join(OUT,`${tag}-${id}-${String(i).padStart(2,'0')}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}}}
 g.close();}})();
