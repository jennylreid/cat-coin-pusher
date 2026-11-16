const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),{performance}=require('perf_hooks');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{const results=[];
for(const [label,file] of [['UAT10','pickup-modal/release.html'],['UAT11','paw-ui/release.html'],...(process.argv.includes('--fixed')?[['candidate','loop-repair/draft.html']]:[])]){
 const g=await make({sourceFile:path.resolve('work/cp25/'+file),render:true,height:888.889}),a=g.c.__game;g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();
 for(const board of [0,2]){a.selectBoard(board);a.tryDrop({x:200});for(let i=0;i<12;i++){g.tick();a.draw();}
 const draw=[],simulation=[];for(let i=0;i<45;i++){let t=performance.now();g.tick();simulation.push(performance.now()-t);t=performance.now();a.draw();draw.push(performance.now()-t);}
 const stats=xs=>({meanMs:xs.reduce((a,b)=>a+b,0)/xs.length,p95Ms:xs.slice().sort((a,b)=>a-b)[Math.floor(xs.length*.95)]});results.push({label,board:board+1,draw:stats(draw),simulation:stats(simulation),bodies:a.bodies.length});}
 const components={};for(const name of ['drawCollectionsTile','drawPowerButtons','drawBoardHUD']){if(typeof g.c[name]!=='function')continue;let t=performance.now();for(let i=0;i<60;i++)g.c[name]();components[name]=(performance.now()-t)/60;}results.push({label,componentsMeanMs:components});g.close();
}
fs.writeFileSync('tickets/CP-25-evidence/loop-repair/'+(process.argv.includes('--fixed')?'profile-after.json':'profile-before.json'),JSON.stringify({platform:'Desktop native Canvas,1080x2400; relative cost only, not device FPS',results},null,2));console.log(JSON.stringify(results,null,2));})().catch(e=>{console.error(e);process.exitCode=1});
