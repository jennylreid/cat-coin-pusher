const make=require('./runtime.cjs'),vm=require('vm'),path=require('path');
(async()=>{const g=await make({sourceFile:path.resolve(process.argv[2])}),a=g.c.__game;
vm.runInContext("for(const b of bodies.slice())removeCoin(b);globalThis.low=addCoin('coin',null,200,4.1,450,yawTurn(0));globalThis.high=addCoin('coin',null,205,150,450,yawTurn(.1),{x:0,y:-8,z:0});",g.c);
let maxDepth=0,swapped=0;
for(let f=0;f<300;f++){g.tick();a.world.propagateModifiedBodyPositionsToColliders();const c=g.c.low.rb.collider(0).contactCollider(g.c.high.rb.collider(0),0);if(c)maxDepth=Math.max(maxDepth,-c.distance*100);if(g.c.high.rb.translation().y<g.c.low.rb.translation().y)swapped++;}
console.log({maxDepth,swapped,low:g.c.low.rb.translation(),high:g.c.high.rb.translation()});g.close();})();
