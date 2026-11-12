const {game}=require('../cp39/harness.cjs'),path=require('path');
const SRC={uat38:path.resolve(__dirname,'../cp38/release.html'),order:path.resolve(__dirname,'uat38-orderonly.html'),wall:path.resolve(__dirname,'wallonly.html'),mem:path.resolve(__dirname,'v-mem.html'),tow:path.resolve(__dirname,'v-tow.html'),A:path.resolve(__dirname,'v-A.html'),B:path.resolve(__dirname,'v-B.html'),uat39:path.resolve(__dirname,'../cp39/release.html')};
const which=process.argv[2],seed=+process.argv[3];
(async()=>{const g=await game({seed,render:true,src:SRC[which]}),a=g.c.__game,rt=g.realNow;a.wildEnter();a.wildStartCountdown();g.ticks(240);g.run('finishBoard=()=>{}');
 for(let s=0;s<30;s++){g.run(`S.coins=Math.max(S.coins,50);WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);holding=true;holdPos={x:200+70*Math.sin(${s}*0.9+${seed}),y:DROP_Y};`);g.ticks(60);}
 const orig=g.c.coinPaintOrder;let ot=0;g.c.coinPaintOrder=function(l){const t=rt();const r=orig(l);ot+=rt()-t;return r;};
 let D=0,masks=0,cyc=0,maskPolys=0;g.run('globalThis.__coinOrderAudit={}');
 for(let i=0;i<120;i++){if(i%60===0)g.run(`holding=true;holdPos={x:200+70*Math.sin(${30+i/60}*0.9+${seed}),y:DROP_Y};`);g.tick();const t=rt();g.c.draw();D+=rt()-t;masks+=g.run('__coinPaintMasks.size');maskPolys+=g.run('[...__coinPaintMasks.values()].reduce((n,l)=>n+l.length,0)');}
 const au=g.run('__coinOrderAudit');
 console.log(which,seed,JSON.stringify({bodies:g.run('bodies.filter(b=>!b.dead).length'),drawMs:+(D/120).toFixed(1),orderMs:+(ot/120).toFixed(1),maskedCoinsPerFrame:+(masks/120).toFixed(1),maskPolysPerFrame:+(maskPolys/120).toFixed(1),cycleFallbacks:au.cycleFallbacks||0,orderRecomputes:au.frames}));g.close();})();
