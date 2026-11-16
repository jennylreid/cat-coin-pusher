const make=require('C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs');
const path=require('path');
(async()=>{const g=await make({sourceFile:path.resolve('work/cp22/draft.html')});const a=g.c.__game;a.selectBoard(0);
console.log('params',a.world.integrationParameters,Object.getOwnPropertyNames(Object.getPrototypeOf(a.world.integrationParameters)));
console.log('shape',a.bodies[0].rb.collider(0).shape);a.tryDrop({x:200});console.log('delivery',a.bodies.at(-1).deliveryStartHeight,a.bodies.at(-1).rb.gravityScale());
for(let f=0;f<500;f++){if(f%21===0)a.tryDrop({x:200+60*Math.sin(f*.37)});g.tick();
let cs=a.bodies.filter(b=>b.kind==='coin'||b.kind==='silver');
for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){let b=cs[i],c=cs[j],p=b.rb.translation(),q=c.rb.translation();if(Math.hypot(p.x-q.x,p.z-q.z)<.46&&Math.abs(p.y-q.y)<.03){console.log('overlap',f,b.uid,c.uid,p,q,b.rb.rotation(),c.rb.rotation(),'shapes',b.rb.collider(0).shape,c.rb.collider(0).shape);g.close();return;}}
}g.close();})();
