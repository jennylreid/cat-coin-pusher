const make=require('./runtime.cjs'),path=require('path'),vm=require('vm'),fs=require('fs'),{performance}=require('perf_hooks');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{
 const state=await make({sourceFile:path.resolve('work/cp22/draft.html')});for(let f=0;f<60*12;f++){if(f%21===0)state.c.__game.tryDrop({x:200+60*Math.sin(f*.37)});state.tick();}
 const snap=vm.runInContext(`({time,pusherY,lastDrop,bodies:bodies.map(b=>({props:Object.fromEntries(Object.entries(b).filter(([k])=>k!=='rb')),p:{...b.rb.translation()},q:{...b.rb.rotation()}}))})`,state.c);state.close();
 const games=[];
 for(const file of ['uat12/release.html','draft.html']){
  const g=await make({sourceFile:path.resolve('work/cp22',file),render:true,height:888.889});g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();g.c.__snap=snap;
  vm.runInContext(`for(const b of bodies.slice())removeCoin(b);for(const s of __snap.bodies){const b=addCoin(s.props.kind,s.props.id,s.p.x/M,s.p.y/M,s.p.z/M,s.q);Object.assign(b,s.props);}time=__snap.time;pusherY=tongueDrawY=__snap.pusherY;lastDrop=__snap.lastDrop;`,g.c);
  for(let i=0;i<5;i++)g.c.draw();games.push(g);
 }
 const samples=[[],[]];for(let f=0;f<30;f++)for(let i=0;i<2;i++){const t=performance.now();games[i].c.draw();samples[i].push(performance.now()-t);}
 const out=games.map((g,i)=>({source:i?'corrected':'UAT 12',bodies:g.c.__game.bodies.length,medianMs:samples[i].sort((a,b)=>a-b)[15]}));console.log(out);fs.writeFileSync('tickets/CP-22-evidence/uat13-paint-performance.json',JSON.stringify(out,null,2));games.forEach(g=>g.close());
})();
