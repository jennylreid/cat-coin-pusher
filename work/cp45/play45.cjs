// CP-41 Treat toss: a scripted player and evidence frames (real runtime, sound ON through a strict fake Web Audio,
// @napi-rs/canvas at DPR 1.35, H 888.9; desktop, not phone evidence).
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
eval(fs.readFileSync(path.join(__dirname,'strict-audio.part'),'utf8'));
const O=path.resolve(__dirname,'../../tickets/CP-41-evidence');fs.mkdirSync(O,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
// skill: chance to go for a treat each 0.2 s; aim error in px
async function run({seed=3,skill=.8,err=14,gap=.3,lag=.15,frames=false,label=''}={}){
 const g=await game({seed,render:frames});const st=strictAudio(g),errs=[];g.run('S.muted=false');
 const step=()=>{try{g.tick();}catch(e){errs.push(String(e.message).slice(0,120));}};
 g.run('tossStartNow()');let k=0;while(!g.run('!!WILD.toss')&&k<600){step();k++;}
 let shotStart=false,shotMid=false,shotEnd=false,t=0,lastTap=-9,missDone=false;const pend=[];
 while(g.run('!!WILD.toss')&&t<30){
  g.run('var LEAD='+(lag*.7));const D=JSON.parse(g.run("JSON.stringify(WILD.toss?{phase:WILD.toss.phase,t:WILD.toss.t,air:WILD.toss.air.filter(o=>o.state==='air'&&o.t>.15).map(o=>{const q=tossPos(o),f=tossPos({...o,t:o.t+LEAD});return [q.x,q.y,o.t,o.T,f.x,f.y];}),caught:WILD.toss.caught,fx:WILD.toss.fx.filter(f=>f.cross).length,endT:WILD.toss.endT}:null)"));
  if(!D)break;
  if(frames&&!shotStart&&D.phase==='intro'&&D.t>-.5){shot(g,'1-start');shotStart=true;}
  while(pend.length&&pend[0][0]<=t){const [,x,y]=pend.shift();g.tap(x,y);}
  if(D.phase==='play'&&t-lastTap>=gap&&D.air.length){
   // go for the treat closest to falling out (highest y while descending)
   const o=D.air.sort((a,b)=>b[1]-a[1])[0];
   if(frames&&!missDone&&D.caught>=3){g.tap(60,250);missDone=true;}
   else if(Math.random()<skill)pend.push([t+lag,o[4]+(Math.random()*2-1)*err,o[5]+(Math.random()*2-1)*err]); // she leads the treat, tracking 70% of its motion
   lastTap=t;}
  if(frames&&!shotMid&&missDone&&D.fx>0&&D.caught>=4){shot(g,'2-mid-toss-catch-and-miss');shotMid=true;}
  if(frames&&!shotEnd&&D.phase==='end'&&D.endT>.5){shot(g,'3-end-plus-treats');shotEnd=true;}
  step();t+=1/60;}
 for(let i=0;i<120;i++)step();
 const L=g.run('JSON.stringify(TOSS_LOG[TOSS_LOG.length-1])'),log=L?JSON.parse(L):null,ev=log?log.events:[];
 const r={label,errs,caught:ev.filter(e=>e[1]==='catch').length,whiffs:ev.filter(e=>e[1]==='whiff').length,drops:ev.filter(e=>e[1]==='drop').length,flips:ev.filter(e=>e[1]==='flip').length,end:ev.find(e=>e[1]==='end'),
  dur:+t.toFixed(2),timerLeft:g.run('WILD.left'),liveAudio:st.live(),nodes:st.created,got:g.run('WILD.got'),pantry:g.run('JSON.stringify(PANTRY)')};
 g.close();return r;}
module.exports={run,strictAudio};
if(require.main===module)(async()=>{
 console.log(JSON.stringify(await run({frames:true,label:'frames'})));
 for(const [skill,err,gap,lag,label] of [[1,8,.25,.12,'sharp'],[.85,14,.32,.16,'good'],[.6,20,.42,.2,'casual']])for(const seed of [11,12,13])console.log(JSON.stringify(await run({seed,skill,err,gap,lag,label})));
})().catch(e=>{console.error(e);process.exitCode=1;});
