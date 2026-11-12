const {game}=require('../cp37/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]),seed=+process.argv[3],WARM=+process.argv[4];
(async()=>{const g=await game({seed,render:true,src}),a=g.c.__game;a.wildEnter();a.wildStartCountdown();g.ticks(240);g.run('finishBoard=()=>{}');
 const hold=s=>g.run(`S.coins=Math.max(S.coins,50);WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);holding=true;holdPos={x:200+70*Math.sin(${s}*0.9+${seed}),y:DROP_Y};`);
 for(let s=0;s<WARM;s++){hold(s);g.ticks(60);}g.c.draw();
 for(let f=0;f<8;f++){g.tick();g.run('globalThis.__coinOrderAudit={}');const out=g.run('coinPaintOrder(bodies).map(b=>b.uid)');
  const info=g.run(`(()=>{const m=[...__coinPaintMasks.entries()].map(([u,l])=>u+':'+l.length);const au=__coinOrderAudit;
   const k=[...__coinPaintMasks.keys()].map(u=>{const b=bodies.find(x=>x.uid===u),t=b.rb.translation(),v=b.rb.linvel();return [u,b.kind,+(t.x/M).toFixed(1),+(t.z/M).toFixed(1),+(t.y/M).toFixed(1),+(Math.hypot(v.x,v.y,v.z)/M).toFixed(1)]});
   return {masks:m,cyc:au.cycleFallbacks||0,frames:au.frames,k}})()`);
  console.log(JSON.stringify(info));}
 g.close();})();
