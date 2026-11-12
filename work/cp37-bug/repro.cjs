// CP-37 repro: hold to drop on Board 3 / Wild, snapshots. node repro.cjs <src> <tag>
const {game}=require('../cp37/harness.cjs'),fs=require('fs'),path=require('path');
const src=path.resolve(process.argv[2]||'uat37.html'),tag=process.argv[3]||'before';
const O=path.resolve(__dirname,'out',tag);fs.mkdirSync(O,{recursive:true});
(async()=>{
 for(const board of ['b3','wild']){
  const g=await game({seed:4,render:true,src}),a=g.c.__game;
  if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');
  for(let s=0;s<60;s++){
   g.run(`S.coins=Math.max(S.coins,50);holding=true;holdPos={x:${200}+70*Math.sin(${s}*0.9),y:DROP_Y};`);
   g.ticks(60);
   if(s%10===9){g.c.draw();fs.writeFileSync(path.join(O,`${board}-${s+1}s.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}
  }
  console.log(board,g.run('bodies.filter(b=>!b.dead).length'));g.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
