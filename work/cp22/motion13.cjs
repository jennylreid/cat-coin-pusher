const make=require('./runtime.cjs'),path=require('path'),fs=require('fs');
(async()=>{const g=await make({sourceFile:path.resolve(process.argv[2])}),a=g.c.__game;let old=new Map(),flips=0,unearned=0,maxRestStep=0,restSamples=0;
for(let f=0;f<60*28;f++){
 if(f<60*20&&f%3===0)a.tryDrop({x:200});g.tick();
 for(const b of a.bodies.filter(b=>['coin','silver','quake'].includes(b.kind))){
  const q=b.rb.rotation(),ny=1-2*(q.x*q.x+q.z*q.z),v=b.rb.linvel(),av=b.rb.angvel(),p=b.rb.translation(),tilt=Math.acos(Math.max(-1,Math.min(1,ny)));
  const rest=Math.hypot(v.x,v.y,v.z)<.005&&Math.hypot(av.x,av.y,av.z)<.03,prev=old.get(b.uid);
  if(prev&&prev.ny>=0&&ny<0){flips++;if(!b.contactFlip&&!prev.authorized)unearned++;}
  if(prev?.rest&&rest){maxRestStep=Math.max(maxRestStep,Math.abs(tilt-prev.tilt)*180/Math.PI);restSamples++;}
  old.set(b.uid,{ny,tilt,rest,authorized:!!b.contactFlip});
 }
}
const result={flipCrossings:flips,unearnedFlipCrossings:unearned,consecutiveRestSamples:restSamples,maxRestTiltStepDegrees:maxRestStep};console.log(result);fs.writeFileSync('tickets/CP-22-evidence/uat13-motion.json',JSON.stringify(result,null,2));g.close();})();
