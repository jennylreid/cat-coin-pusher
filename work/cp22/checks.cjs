const make=require('./runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),{performance}=require('perf_hooks');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const dir=path.resolve('tickets/CP-22-evidence');
(async()=>{
 const src=path.resolve('work/cp22/draft.html'),g=await make({sourceFile:src}),a=g.c.__game;
 const initial=new Map(a.bodies.map(b=>[b.uid,{...b.rb.translation()}]));
 for(let f=0;f<600;f++)g.tick();
 let idleMove=0;for(const b of a.bodies){const p=initial.get(b.uid),q=b.rb.translation();idleMove=Math.max(idleMove,Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z)*100);}
 a.useCatquake();let moving=0;
 for(let f=0;f<600;f++){g.tick();if(f<180)for(const b of a.bodies){const v=b.rb.linvel();moving=Math.max(moving,Math.hypot(v.x,v.y,v.z));}}
 let maxSettledTilt=0;for(const b of a.bodies)if(['coin','silver','quake'].includes(b.kind)&&b.rb.translation().y<.07){const q=b.rb.rotation();maxSettledTilt=Math.max(maxSettledTilt,Math.acos(Math.min(1,Math.max(-1,1-2*(q.x*q.x+q.z*q.z))))*180/Math.PI);}
 const result={idleMaxDisplacement:idleMove,quakeMaxSpeed:moving,quakeSettledGroundMaxTiltDegrees:maxSettledTilt};g.close();
 const games=[];
 for(const file of ['baseline.html','draft.html']){
  const r=await make({sourceFile:path.resolve('work/cp22',file),render:true,height:888.889});r.c.Path2D=native.Path2D;r.c.devicePixelRatio=2.7;r.c.resize();
  for(let f=0;f<240;f++){if(f%24===0)r.c.__game.tryDrop({x:200});r.tick();}
  for(let i=0;i<5;i++)r.c.draw();games.push(r);
 }
 const samples=[[],[]];for(let f=0;f<24;f++)for(let i=0;i<2;i++){const start=performance.now();games[i].c.draw();samples[i].push(performance.now()-start);}
 result.draw=games.map((r,i)=>({file:i?'draft.html':'baseline.html',medianMs:samples[i].sort((a,b)=>a-b)[12],bodies:r.c.__game.bodies.length}));games.forEach(r=>r.close());
 fs.writeFileSync(path.join(dir,'checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1});
