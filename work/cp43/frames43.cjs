// UAT 43 evidence frames (desktop, real runtime, @napi-rs/canvas at DPR 1.35). Not phone evidence.
const {game,tapAtBeat}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,'../../tickets/CP-38-evidence/uat43');fs.mkdirSync(O,{recursive:true});
const only=process.argv[2]||'';
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const errs=[];const safe=(g,n)=>{for(let i=0;i<n;i++){try{g.tick();}catch(e){errs.push(String(e.message));return;}}};
(async()=>{
 if(!only||only==='card'){const g=await game({render:true,seed:4});g.ticks(30);g.run('wild2Enter()');g.ticks(30);shot(g,'goal-card-star');
  g.run('wildStartCountdown()');g.ticks(240);shot(g,'star-on-board');console.log('star',g.run('WILD.star'));
  const lose=(id,side,z,tag)=>{g.run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:(${side>0?'T.R+12':'T.L-12'})*M,y:.3,z:${z}*M},true);b.rb.setLinvel({x:${side*2},y:0,z:0},true);})()`);
   let k=0;while(!g.run(`W43_LOST.some(L=>L.id==='${id}')`)&&k<300){safe(g,1);k++;}safe(g,4);shot(g,tag+'-1');safe(g,22);shot(g,tag+'-2');safe(g,60);};
  lose('duck',1,560,'lost-duck');safe(g,90);lose(g.run('WILD.star'),-1,520,'lost-star');
  console.log('star back at',g.run('WILD.starBackAt-time'),'missing now',g.run('JSON.stringify(wildMissing())'));g.close();}
 if(!only||only==='wheel'){for(const [i,tag] of [[2,'r10q'],[5,'jackpot']]){const g=await game({render:true,seed:6});g.ticks(30);g.run('wild2Enter();wildStartCountdown()');g.ticks(240);
  g.run(`w2ForceSlice=${i};w2StartWheelNow()`);safe(g,60*1.2);if(i===2)shot(g,'wheel-0-tap-to-spin');g.tap();safe(g,60*1.2);shot(g,'wheel-'+tag+'-1-spinning');let k=0;while(g.run('WILD.dance&&!(WILD.dance.wheel&&WILD.dance.wheel.result)')&&k<600){safe(g,1);k++;}
  safe(g,4);shot(g,'wheel-'+tag+'-2-result');safe(g,60);shot(g,'wheel-'+tag+'-3-payout');g.close();}}
 if(!only||only==='taps'){const g=await game({render:true,seed:4});g.ticks(30);g.run('wild2Enter();wildStartCountdown()');g.ticks(240);g.run('WILD.left=170;DANCE.auto=0;danceStartNow()');g.until("!!WILD.dance&&WILD.dance.phase==='dance'",400);
  const T=k=>g.run(`WILD.dance.p0+${k}*WILD.dance.beat`);const tapAt=(k,off)=>{const at=T(k)+g.run('WILD.dance.latency')+off;while(g.ms()/1000<at-1/120)safe(g,1);g.tap();};
  tapAt(0,.02);tapAt(1,-.03);tapAt(2,.04);safe(g,3);shot(g,'tap-1-hit');
  tapAt(4,-.21);safe(g,4);shot(g,'tap-2-early-miss');
  tapAt(7,.23);safe(g,4);shot(g,'tap-3-late-miss');g.close();}
 console.log('errors',errs);
})().catch(e=>{console.error(e);process.exitCode=1;});
