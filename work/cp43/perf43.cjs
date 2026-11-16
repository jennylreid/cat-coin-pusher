// UAT 43 phone-like frame cost and Wild 2 balance, UAT 42 vs UAT 43 (desktop; physics time per frame is the measure,
// since the phone was physics-bound: 3 steps a frame at about 12 FPS). Writes tickets/CP-38-evidence/uat43/perf.json.
// Usage: node perf43.cjs [frames|balance]
const {game,tapAtBeat}=require('./harness.cjs'),PH=require('./harness-phone.cjs'),fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'../../tickets/CP-38-evidence/uat43');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,'release.html'),OLD=path.resolve(__dirname,'../cp42/release.html');
const mode=process.argv[2]||'frames';
const stat=xs=>{xs=[...xs].sort((a,b)=>a-b);return {avg:+(xs.reduce((s,x)=>s+x,0)/xs.length).toFixed(1),p95:+xs[Math.floor(xs.length*.95)].toFixed(1),max:+xs[xs.length-1].toFixed(1)};};
// A busy Wild 2 round, the same for both builds: drops every 0.25 s (sweeping), a rain 10 and a rain 25 collected,
// a dance break with a 16-coin pour, and two bonus rain pours of 20, at phone-like frames (3 physics steps, one update).
async function busy(src,seed){
 const g=await PH.game({src,seed,render:true}),rt=g.realNow;g.phone=true;g.run('wild2Enter();wildStartCountdown()');g.ticks(60);g.run('S.coins=999;WILD.left=170');
 // time the physics: each phone frame runs 3 steps (the cap) and one update of dt 0.05, and draws every 10th frame
 const phys=[],coins=[];let acc=0;{const step=g.c.step;g.c.step=()=>{const t0=rt();step();acc+=rt()-t0;};}
 const frame=()=>{acc=0;g.frame();phys.push(acc);if(phys.length%12===0)coins.push(g.run('bodies.filter(b=>!b.dead).length'));};
 const ev=[[4,'wildStartRain(10)'],[10,'wildStartRain(25)'],[18,'w2Rain(20,.05)'],[26,'WILD.happy=DANCE.notches;WILD.dancePending={f:null,wait:9}'],[44,'w2Rain(20,.05)']];let t=0,last=-9;
 while(t<60){
  for(const e of ev)if(!e.done&&t>=e[0]){e.done=true;g.run(e[1]);}
  if(g.run('!!WILD.dance&&WILD.dance.phase==="dance"')){const D=JSON.parse(g.run('JSON.stringify({p0:WILD.dance.p0,beat:WILD.dance.beat,n:WILD.dance.n})'));
   for(let k=Math.max(0,Math.ceil((g.ms()/1000-D.p0)/D.beat));k<D.n;k++){const tt=D.p0+k*D.beat+.08;while(g.ms()/1000<tt-1/24){frame();t+=1/12;}g.tap();}}
  else if(t-last>=.25&&!g.run('!!WILD.dance')){g.c.__game.tryDrop({x:200+110*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}
  frame();t+=1/12;}
 const r={physicsMsPerFrame:stat(phys),bodies:{avg:Math.round(coins.reduce((s,x)=>s+x,0)/coins.length),max:Math.max(...coins)},plainCoinsEnd:g.run("bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')).length"),gold5:g.run("bodies.filter(b=>!b.dead&&b.kind==='gold5').length"),frames:phys.length};g.close();return r;}
// A scripted Wild 2 round: hold-sweep drops every 0.25 s, the Quake used when earned, dance breaks tapped on the beat.
async function round(src,seed){
 const g=await game({src,seed});g.run('wild2Enter();wildStartCountdown()');g.ticks(200);let t=0,last=-9;
 while(g.run("WILD.phase==='play'")&&t<75){
  if(g.run('!!WILD.dance&&WILD.dance.phase!=="finale"')){const D=JSON.parse(g.run('JSON.stringify({p0:WILD.dance.p0,beat:WILD.dance.beat,n:WILD.dance.n,lat:WILD.dance.latency})'));
   for(let k=0;k<D.n;k++){const tt=D.p0+k*D.beat+D.lat;while(g.ms()/1000<tt-1/120){g.tick();t+=1/60;}g.tap();}continue;}
  if(t-last>=.25&&!g.run('!!WILD.dance')){g.c.__game.tryDrop({x:200+110*Math.sin(t*1.1+seed),y:g.run('DROP_Y')});last=t;}
  if(g.run('board.earnedQuakes>0&&catquakeTime===0&&!WILD.dance'))g.run('useEarnedQuake()');
  g.tick();t+=1/60;}
 g.ticks(30);const r=g.run("JSON.stringify({win:WILD.win,reason:WILD.reason,got:WILD.got,left:+WILD.left.toFixed(1),dances:WILD.dances,gold5:WILD.gold5||0})");g.close();return JSON.parse(r);}
(async()=>{
 const file=path.join(OUT,'perf.json'),out=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
 if(mode==='frames'){out.frames={uat42:await busy(OLD,4),uat43:await busy(NEW,4)};console.log(JSON.stringify(out.frames));}
 if(mode==='balance'){const seeds=[3,5,7,9,11,13];out.balance={};for(const [k,src] of [['uat42',OLD],['uat43',NEW]]){const rs=[];for(const s of seeds)rs.push(await round(src,s));
  out.balance[k]={wins:rs.filter(r=>r.win).length+'/'+rs.length,avgGot:+(rs.reduce((s,r)=>s+r.got,0)/rs.length).toFixed(1),runs:rs};console.log(k,JSON.stringify(out.balance[k]));}}
 fs.writeFileSync(file,JSON.stringify(out,null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
