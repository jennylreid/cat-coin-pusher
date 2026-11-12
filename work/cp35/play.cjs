// Scripted Wild board runs (real runtime). node play.cjs <seed> <strategy> [shots-dir]
// strategies: spam (hold centre, 5/s), sweep (hold, sliding left-right), aim (hold toward the nearest prize lane), taps (one every 0.4 s)
const make=require('../cp33/runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
module.exports=async function run({seed=1,strategy='sweep',shots=null,render=false,src='release.html',log=false}={}){
 const g=await make({sourceFile:path.resolve(__dirname,src),render:render||!!shots,height:888.889,seed});
 if(render||shots){g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();}
 const a=g.c.__game,run=s=>vm.runInContext(s,g.c);
 a.wildEnter();a.wildStartCountdown();
 const snap=name=>{if(!shots)return;g.c.draw();fs.writeFileSync(path.join(shots,name+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
 let t=0,last=-9,f=0,phys=0,maxBodies=0;const {performance}=require('perf_hooks');const marks=[];
 while(a.WILD.phase!=='end'&&t<130){
  const W=a.WILD;
  if(W.phase==='play'&&a.board.status==='playing'){
   let x=200;
   if(strategy==='sweep')x=200+70*Math.sin(t*1.3);
   else if(strategy==='aim'){const items=run("bodies.filter(b=>!b.dead&&((b.kind==='item'&&!WILD.have[b.id])||RAIN[b.kind])).map(b=>({x:b.rb.translation().x/M,z:b.rb.translation().z/M}))");items.sort((p,q)=>q.z-p.z);x=items.length?200+(items[0].x-200)*.6:200;}
   if(a.board.earnedQuakes>0&&run('catquakeTime===0&&sweepTime===0'))run('useEarnedQuake()'); // a player taps the Quake button when it has one
   const gap=strategy==='taps'?.4:.2;
   if(t-last>=gap-1e-9){a.tryDrop({x,y:run('DROP_Y')});last=t;}
  }
  const t0=performance.now();g.tick();phys+=performance.now()-t0;f++;t+=1/60;
  maxBodies=Math.max(maxBodies,a.bodies?a.bodies.length:run('bodies.length'));
  if(shots){if(f===Math.round(60*14))snap('mid');}
  if(log&&f%300===0)marks.push({t:+t.toFixed(1),left:+a.WILD.left.toFixed(1),got:a.WILD.got,coins:run('S.coins'),bodies:run('bodies.length')});
 }
 const W=a.WILD,res={seed,strategy,win:W.win,reason:W.reason,got:W.got,left:+W.left.toFixed(1),coins:run('S.coins'),rained:W.rained,toppled:W.toppled,bonus:W.bonusN,earnedQuakes:a.board.earnedQuakes,maxBodies,physMsPerTick:+(phys/f).toFixed(2),marks};
 g.close();return res;
};
if(require.main===module){(async()=>{const [seed,strategy,shots]=process.argv.slice(2);console.log(JSON.stringify(await module.exports({seed:+seed||1,strategy:strategy||'sweep',shots,log:true}),null,0));})().catch(e=>{console.error(e);process.exitCode=1;});}
