const make=require('./runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{
 const g=await make({sourceFile:path.resolve(process.argv[2]),render:true,height:888.889}),a=g.c.__game;g.c.Path2D=native.Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 const out=path.resolve('work/cp22/prize12-frames');fs.mkdirSync(out,{recursive:true});
 let maxPlatePen=0,deepPlate=0,forwardInputs=0,quietMaxDelta=0,previous=new Map(),frame=0;
 for(let f=0;f<60*20;f++){
  if(f>=60&&f<60*13&&f%3===0)a.tryDrop({x:(a.bodies.find(b=>b.boardTarget)?.rb.translation().x||2)*100});
  g.tick();a.world.propagateModifiedBodyPositionsToColliders();
  const tray=vm.runInContext('tongueContact',g.c);
  for(const b of a.bodies.filter(b=>b.input)){
   const hit=b.rb.collider(0).contactCollider(tray,0);if(hit){maxPlatePen=Math.max(maxPlatePen,-hit.distance*100);if(hit.distance<-.005)deepPlate++;}
   if(b.rb.translation().z>3.3)forwardInputs++;
  }
  if(f%3===0)g.snapshot(path.join(out,String(frame++).padStart(4,'0')+'.png'));
 }
 g.snapshot('tickets/CP-22-evidence/uat12-final.png');
 const result={maxPlatePenetration:maxPlatePen,plateSamplesOverHalfUnit:deepPlate,inputCoinFramesPast330:forwardInputs,seconds:20,rapidTapSeconds:12,pauseSeconds:7};
 fs.writeFileSync('tickets/CP-22-evidence/uat12-uat12-pusher.json',JSON.stringify(result,null,2));console.log(result);g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
