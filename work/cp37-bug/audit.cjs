const {game}=require('../cp37/harness.cjs'),path=require('path');
const board=process.argv[2]||'wild',WARM=+(process.argv[3]||30),src=path.resolve(process.argv[4]||'uat37.html');
(async()=>{const g=await game({seed:4,render:true,src}),a=g.c.__game;
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');g.run('finishBoard=()=>{}');
 const hold=s=>g.run(`S.coins=Math.max(S.coins,50);if(globalThis.WILD&&WILD.on){WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);}holding=true;holdPos={x:200+70*Math.sin(${s}*0.9),y:DROP_Y};`);
 for(let s=0;s<WARM;s++){hold(s);g.ticks(60);}
 g.c.draw();g.run('globalThis.__coinOrderAudit={}');
 let maskFrames=0,maskCoins=0;const masked=new Map();let maskToggles=0;
 for(let f=0;f<180;f++){if(f%60===0)hold(WARM+f/60);g.tick();g.run('coinPaintOrder(bodies)');
  const m=g.run('[...__coinPaintMasks.keys()]');if(m.length)maskFrames++;maskCoins+=m.length;const now=new Set(m);
  for(const u of new Set([...masked.keys(),...now])){const was=masked.get(u)||false,is=now.has(u);if(was!==is)maskToggles++;masked.set(u,is);}}
 const au=g.run('__coinOrderAudit');
 console.log(JSON.stringify({board,frames:180,bodies:g.run('bodies.filter(b=>!b.dead).length'),cycleFallbacks:au.cycleFallbacks||0,clippedCycleEdges:au.clippedCycleEdges||0,constraints:au.constraints,maskFrames,avgMaskedCoins:+(maskCoins/180).toFixed(2),maskToggles}));g.close();})();
