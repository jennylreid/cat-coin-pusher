const make=require('./runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
(async()=>{const results=[];
for(const hit of [false,true]){
 const g=await make({sourceFile:path.resolve('work/cp22/draft.html')});
 // Controlled propped-coin fixture in the real Rapier world: lower coin,
 // upper coin leaning over its rim, optional descending coin from above.
 vm.runInContext(`for(const b of bodies.slice())removeCoin(b);
 const lower=addCoin('coin',null,200,4.2,430,yawTurn(0));
 const prop=addCoin('coin',null,200,17.5,460,{x:Math.sin(-.35/2),y:0,z:0,w:Math.cos(-.35/2)});
 globalThis.__prop=prop;globalThis.__startLean=qrot(prop.rb.rotation(),{x:0,y:1,z:0}).y;
 ${hit?"addCoin('coin',null,200,65,460,yawTurn(0),{x:0,y:-4,z:0});":''}`,g.c);
 let authorizedFrames=0,maxTilt=0,flips=0;
 for(let f=0;f<180;f++){g.tick();const b=g.c.__prop,q=b.rb.rotation(),ny=1-2*(q.x*q.x+q.z*q.z);maxTilt=Math.max(maxTilt,Math.acos(Math.max(-1,Math.min(1,ny)))*180/Math.PI);if(b.contactFlip)authorizedFrames++;if(ny<0)flips++;}
 results.push({overheadHit:hit,authorizedFrames,maxTilt,flipFrames:flips});g.close();
}fs.writeFileSync('tickets/CP-22-evidence/flip-fixture.json',JSON.stringify(results,null,2));console.log(results);
})();
