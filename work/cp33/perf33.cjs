// UAT 33 frame cost: UAT 32 vs UAT 33 (spin), same scripted run, a pickup every 1.2 s. Desktop CPU renderer, not phone evidence.
// on screen most of the time (one every 1.2 s, so the UAT 30 backdrop is up about 80% of frames). Desktop CPU renderer
// (@napi-rs/canvas), not phone evidence; phone FPS comes from the Send performance log.
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),{performance}=require('perf_hooks');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
async function measure(src,label){
 const g=await make({sourceFile:path.resolve(__dirname,src),render:true,height:888.889,seed:11});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 const run=s=>vm.runInContext(s,g.c),a=g.c.__game;run('selectBoard(2);S.coins=400;board.status="playing";');
 const up=[],idle=[];let pickups=0;
 for(let f=0;f<60*24;f++){
  if(f%13===0&&a.board.status==='playing')a.tryDrop({x:150+(f%7)*15});
  if(f%72===10){a.queueTreatAward(['cheese','shrimp','tuna'][pickups%3],120+(pickups%3)*80,null,true);pickups++;}
  g.tick();const busy=a.treatAwards.some(x=>!x.arrived);const t0=performance.now();g.c.draw();const d=performance.now()-t0;(busy?up:idle).push(d);
 }
 g.close();const st=v=>{const s=[...v].sort((x,y)=>x-y);return {frames:v.length,drawMsAvg:+(v.reduce((x,y)=>x+y,0)/v.length).toFixed(3),drawMsP95:+s[Math.floor(s.length*.95)].toFixed(3)};};
 return {label,pickups,withPickupUp:st(up),noPickup:st(idle)};
}
(async()=>{const out=[];for(let rep=0;rep<3;rep++){out.push(await measure('release32.html','UAT32'));out.push(await measure('release.html','UAT33'));}
 const mean=(l,k,m)=>+(out.filter(r=>r.label===l).reduce((s,r)=>s+r[k][m],0)/3).toFixed(3);
 const summary={};for(const l of ['UAT32','UAT33'])summary[l]={withPickupUpAvg:mean(l,'withPickupUp','drawMsAvg'),withPickupUpP95:mean(l,'withPickupUp','drawMsP95'),noPickupAvg:mean(l,'noPickup','drawMsAvg')};
 console.log(JSON.stringify(summary,null,1));
 fs.writeFileSync(path.resolve(__dirname,'../../tickets/CP-33-evidence/uat33/desktop-draw-times.json'),JSON.stringify({note:'Desktop node + @napi-rs/canvas CPU renderer, same seed and script, 3 alternating runs each; draw time per frame split by whether a pickup is on screen. Not phone evidence.',summary,runs:out},null,1));})();
