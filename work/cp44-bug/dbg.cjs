const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm');
(async()=>{const g=await make({sourceFile:path.resolve('v-a.html'),seed:4}),run=s=>vm.runInContext(s,g.c);
 run(`selectBoard(0);for(const b of bodies.slice())removeCoin(b);reconcileBoardTargets=function(){};board.status="playing";globalThis.__p=addCoin('item','tuna',T.R+10,halfOf('item')+5,600,yawTurn(0));__p.rb.enableCcd(false);`);
 for(let i=0;i<6;i++)g.tick();
 console.log(run(`(()=>{const c=__p.rb.collider(0),out=[];world.contactPairsWith(c,o=>{const p=o.parent();out.push({fixed:p&&p.isFixed(),kin:p&&p.isKinematic(),groups:o.collisionGroups().toString(16),t:o.translation(),sensor:o.isSensor()})});let sc=0;world.contactPairsWith(c,o=>world.contactPair(c,o,m=>{sc+=m.numSolverContacts()}));return JSON.stringify({sc,ver:RAPIER.version?.(),sleep:__p.rb.isSleeping(),groups:c.collisionGroups().toString(16),bt:__p.rb.bodyType(),enabled:__p.rb.isEnabled(),locked:__p.rotLocked,out,dom:__p.rb.dominanceGroup?.(),lin:__p.rb.linvel(),grav:__p.rb.gravityScale()})})()`));
})();
