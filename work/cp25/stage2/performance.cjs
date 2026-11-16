const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),{performance}=require('perf_hooks');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{
 const games=[];
 for(const sourceFile of ['work/cp25/release.html','work/cp25/stage2/draft.html']){
  const g=await make({sourceFile:path.resolve(sourceFile),render:true,height:888.889});g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();for(let i=0;i<5;i++)g.c.draw();games.push(g);
 }
 const samples=[[],[]];for(let f=0;f<24;f++)for(let i=0;i<2;i++){const t=performance.now();games[i].c.draw();samples[i].push(performance.now()-t);}
 const result=games.map((g,i)=>({source:i?'Stage 2':'Stage 1',bodies:g.c.__game.bodies.length,medianDrawMs:samples[i].sort((a,b)=>a-b)[12]}));fs.writeFileSync('tickets/CP-25-evidence/stage2/draw-performance.json',JSON.stringify(result,null,2));console.log(result);games.forEach(g=>g.close());
})().catch(e=>{console.error(e);process.exitCode=1});
