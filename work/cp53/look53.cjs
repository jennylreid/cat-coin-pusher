const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'..','cp52','release.html')),OUT=path.join(__dirname,'out',process.argv[3]||'look');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const g=await game({src,seed:3,render:true});strictAudio(g);g.run('S.muted=false;S.dev=true');
 for(let i=0;i<20;i++){g.tick();g.c.draw();}g.tap(200,400);for(let i=0;i<40;i++){g.tick();g.c.draw();}
 g.run('wildStartCountdown()');for(let i=0;i<300&&g.run('WILD.phase')!=='play';i++){g.tick();}
 console.log(g.run('JSON.stringify({pfx:pickupFx,inv:inventoryButton(),tg:pickupTarget()})'));
 for(const id of ['cheese','bowtie','tuna','duck','quake']){g.run(`treatAwards.length=0;queueTreatAward('${id}',150,null,false,'${id}'==='quake'?'quake':'item')`);
  for(let i=1;i<=60;i++){g.tick();if([2,6,12,18,24,30,36,42].includes(i)){g.c.draw();fs.writeFileSync(path.join(OUT,id+'-'+String(i).padStart(2,'0')+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));}}}
 g.close();})();
