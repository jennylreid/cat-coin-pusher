const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:3,render:true});for(let i=0;i<20;i++)g.tick();g.tap(200,400);for(let i=0;i<40;i++)g.tick();
console.log(g.run(`(()=>{const f=queueTreatAward('cheese',150,null,false);const a=[f.x0,f.y0,f.mx,f.my,f.tr,f.tm];const p=pickupPoint(f,f.tr+f.tm*.5);return JSON.stringify([a,p.x,p.y,p.s,f.s0,f.ms]);})()`));g.close();})();
