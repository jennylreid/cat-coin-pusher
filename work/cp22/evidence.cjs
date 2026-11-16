const fs=require('fs'),path=require('path'),vm=require('vm'),{performance}=require('perf_hooks');
const make=require('./runtime.cjs');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const src=path.resolve(process.argv[2]||'work/cp22/draft.html'),out=path.resolve('tickets/CP-22-evidence');
(async()=>{
 const g=await make({sourceFile:src,render:true,height:888.889}),a=g.c.__game;g.c.Path2D=native.Path2D;
 g.c.devicePixelRatio=1.35;g.c.resize();a.selectBoard(0);
 const before=a.board.used;let accepted=0;
 for(let f=0;f<60;f++){if(f%3===0)accepted+=a.tryDrop({x:200})?1:0;g.tick();}
 const rate={attempts:20,accepted,charged:a.board.used-before,feedback:vm.runInContext('floats.filter(f=>f.text===\'Easy taps\').length',g.c)};
 for(let f=0;f<60;f++)g.tick();rate.afterNoMoreTaps=a.board.used-before;
 a.selectBoard(0);let settledFrames=0,maxRestTiltDelta=0,unearnedFlips=0,restSamples=0,prev=new Map(),maxLandedHeight=0;
 const frames=path.resolve('work/cp22/frames');fs.mkdirSync(frames,{recursive:true});
 for(let f=0;f<60*16;f++){
  if(f>60&&f%3===0)a.tryDrop({x:200+50*Math.sin(f*.035)});
  g.tick();
  for(const b of a.bodies){if(!['coin','silver','quake'].includes(b.kind))continue;
   const q=b.rb.rotation(),ny=1-2*(q.x*q.x+q.z*q.z),tilt=Math.acos(Math.max(-1,Math.min(1,ny))),t=b.rb.translation(),v=b.rb.linvel();
   if(ny<0&&!b.contactFlip)unearnedFlips++;
   if(!b.fresh)maxLandedHeight=Math.max(maxLandedHeight,t.y*100);
   const rest=Math.hypot(v.x,v.y,v.z)<.005&&t.y*100<6;
   const old=prev.get(b.uid);if(rest&&old?.rest){maxRestTiltDelta=Math.max(maxRestTiltDelta,Math.abs(tilt-old.tilt));restSamples++;}
   prev.set(b.uid,{tilt,rest});
  }
  if(f%3===0)g.snapshot(path.join(frames,String(f/3).padStart(4,'0')+'.png'));
 }
 g.snapshot(path.join(out,'rapid-pile-final.png'));
 const evidence={rate,restSamples,maxRestTiltDeltaDegrees:maxRestTiltDelta*180/Math.PI,unearnedFlipFrames:unearnedFlips,maxLandedHeight};
 fs.writeFileSync(path.join(out,'motion.json'),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
