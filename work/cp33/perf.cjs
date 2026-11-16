// Same scripted run on UAT 24 and UAT 25 (rendered): target-following drops + a pickup every 1.5 s. Desktop only.
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),{performance}=require('perf_hooks');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
async function measure(src,label){
 const g=await make({sourceFile:path.resolve(src),render:true,height:888.889,seed:11});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 const run=s=>vm.runInContext(s,g.c),a=g.c.__game;run('selectBoard(2);S.coins=400;board.status="playing";');
 if(label==='UAT24')run("pickupChoice='ribbon'"); // UAT24's non-pausing style, so both runs keep playing
 const frame=[];let pickups=0;
 for(let f=0;f<60*30;f++){
  if(f%13===0&&a.board.status==='playing'){const ts=a.bodies.filter(b=>b.boardTarget&&!b.dead);a.tryDrop({x:ts.length?ts[f%ts.length].rb.translation().x*100:200});}
  if(f%90===45){a.queueTreatAward(['cheese','shrimp','tuna'][pickups%3],120+(pickups%3)*80);pickups++;}
  const t0=performance.now();g.tick();const t1=performance.now();g.c.draw();const t2=performance.now();frame.push([t1-t0,t2-t1]);
 }
 g.close();const avg=i=>frame.reduce((s,r)=>s+r[i],0)/frame.length,p=(i,q)=>frame.map(r=>r[i]).sort((x,y)=>x-y)[Math.floor(frame.length*q)];
 return {label,frames:frame.length,pickupsFired:pickups,physicsMsAvg:+avg(0).toFixed(3),drawMsAvg:+avg(1).toFixed(3),drawMsP95:+p(1,.95).toFixed(3),drawMsMax:+Math.max(...frame.map(r=>r[1])).toFixed(3),totalMsAvg:+(avg(0)+avg(1)).toFixed(3)};
}
(async()=>{const out=[];for(let rep=0;rep<2;rep++){out.push(await measure('assets/index.html','UAT24'));out.push(await measure('release.html','UAT27'));}
 console.log(out);fs.writeFileSync('../../tickets/CP-33-evidence/uat27/desktop-frame-times.json',JSON.stringify({note:'Desktop node + @napi-rs/canvas CPU renderer; same seed and script; not phone evidence. Phone FPS comes from the Send performance log.',runs:out},null,1));})();
