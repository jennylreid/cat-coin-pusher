// Which part of draw() grows memory? node leak.cjs <src> <board> [dance]
const {game}=require('../cp39/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]),board=process.argv[3];
(async()=>{const g=await game({seed:4,render:true,src}),a=g.c.__game;const c=g.c;
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else if(board==='wild2'){g.run('wild2Enter();wildStartCountdown()');g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');
 for(let s=0;s<10;s++){g.run(`S.coins=Math.max(S.coins,50);holding=true;holdPos={x:200+70*Math.sin(${s}*0.9),y:DROP_Y};`);g.ticks(60);}g.run('holding=false');
 const cv=c.document.getElementById('cv'),ctx=cv.getContext('2d');let sv=0,rs=0;const S=ctx.save.bind(ctx),R=ctx.restore.bind(ctx);ctx.save=()=>{sv++;S();};ctx.restore=()=>{rs++;R();};
 const grow=(label,fn)=>{global.gc&&global.gc();const m0=process.memoryUsage();sv=rs=0;for(let i=0;i<60;i++){g.tick();fn();}global.gc&&global.gc();const m1=process.memoryUsage();
  console.log(label.padEnd(26),'rss +'+((m1.rss-m0.rss)/1e6).toFixed(0)+'MB','heap +'+((m1.heapUsed-m0.heapUsed)/1e6).toFixed(0)+'MB','ext +'+((m1.external-m0.external)/1e6).toFixed(0)+'MB','save-restore/frame',((sv-rs)/60).toFixed(2));};
 for(let r=0;r<2;r++){
 grow('full draw',()=>c.draw());
 grow('draw, no drawMachine',()=>{const k=c.drawMachine;c.drawMachine=()=>{};c.draw();c.drawMachine=k;});
 grow('draw, no drawArmrests',()=>{const k=c.drawArmrests;c.drawArmrests=()=>{};c.draw();c.drawArmrests=k;});
 grow('draw, no drawTongue',()=>{const k=c.drawTongue;c.drawTongue=()=>{};c.draw();c.drawTongue=k;});
 grow('draw, no table image',()=>{const k=g.run('ART.table');c.__t=k;g.run('ART.table=document.createElement("canvas")');c.draw();g.run('ART.table=__t');});
 grow('only 1000 gradients',()=>{for(let i=0;i<1000;i++){const q=ctx.createLinearGradient(0,0,0,10);q.addColorStop(0,'#fff');q.addColorStop(1,'#000');}});
 grow('only table clip+image',()=>{g.run('ctx.save();ctx.beginPath();ctx.rect(0,__WARP_Y0,400,__NF-__WARP_Y0);ctx.clip();ctx.clip(__cachedBoardPath());ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();');});
 grow('only table image (no clip)',()=>{g.run('ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);');});
 grow('only clip(Path2D)',()=>{g.run('ctx.save();ctx.clip(__cachedBoardPath());ctx.fillRect(0,0,10,10);ctx.restore();');});
 }
 g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
