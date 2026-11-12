// CP-43 Pet the cat: a scripted player and evidence frames (real runtime, sound ON through a strict fake Web Audio,
// @napi-rs/canvas at DPR 1.35, H 888.9; desktop, not phone evidence).
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
eval(fs.readFileSync(path.join(__dirname,'strict-audio.part'),'utf8'));
const O=path.resolve(__dirname,process.env.PET_OUT||'../../tickets/CP-43-evidence');fs.mkdirSync(O,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
// plan: 'peak' (lift when the peak chime plays, after a reaction delay), 'early' (lift at L), 'over' (keep going: hiss),
// 'ears' (ear taps only), 'none', 'done' (tap DONE at L), 'time' (slow strokes until the time runs out)
async function run({seed=5,plan='peak',react=.3,liftAt=.6,speed=320,frames=false,label=plan,src}={}){
 const g=await game({seed,render:frames,src:src?path.resolve(src):undefined});const st=strictAudio(g),errs=[];g.run('S.muted=false');
 const step=()=>{try{g.tick();}catch(e){errs.push(String(e.message).slice(0,160));}};
 const D=()=>JSON.parse(g.run("JSON.stringify(WILD.petGame?{phase:WILD.petGame.phase,t:WILD.petGame.t,L:WILD.petGame.L,over:WILD.petGame.over,peaked:WILD.petGame.peaked,flat:WILD.petGame.flat,res:WILD.petGame.result,endT:WILD.petGame.endT}:null)"));
 const hs=(hx,hy)=>JSON.parse(g.run(`JSON.stringify(headToScreen(${hx},${hy}))`));
 g.run('petStartNow()');let k=0;while(!g.run('!!WILD.petGame')&&k<900){step();k++;}
 const startLeft=g.run('WILD.left');
 if(frames)shot(g,'01-intro');
 while(g.run("WILD.petGame&&WILD.petGame.phase==='intro'"))step();
 const a=hs(110,40),b=hs(290,40),earL=hs(53,29),earR=hs(347,29);let t=0,down=false,dir=1,x=a.x,shots={},peakAt=null,earsDone=0;
 const fr=(n,cond)=>{if(frames&&!shots[n]&&cond){shot(g,n);shots[n]=1;}};
 while(g.run('!!WILD.petGame')&&t<30){
  const s=D();if(!s)break;
  if(s.phase==='play'){
   if(plan==='ears'){if(Math.round(t*60)%27===0&&earsDone<14){const e=earsDone%2?earR:earL;g.tap(e.x,e.y);earsDone++;if(earsDone===3)fr('03-ear-flick',1);} }
   else if(plan==='none'){}
   else{
    if(!down){g.pointer('pointerdown',x,a.y);down=true;}
    else{x+=dir*speed/60;if(x>b.x){x=b.x;dir=-1;}if(x<a.x){x=a.x;dir=1;}g.pointer('pointermove',x,a.y+8*Math.sin(t*9));}
    if(frames&&s.L>.45&&!shots['02-stroking']){
     // one ear tap mid-stroke for the frame of the flick
     shot(g,'02-stroking');shots['02-stroking']=1;}
    if(s.peaked&&peakAt==null)peakAt=t;
    fr('04-peak',s.peaked&&t-peakAt>.05);
    if(plan==='peak'&&peakAt!=null&&t-peakAt>=react&&down){g.pointer('pointerup',x,a.y);down=false;plan='lifted';}
    if(plan==='early'&&s.L>=liftAt&&down){g.pointer('pointerup',x,a.y);down=false;plan='lifted';}
    if(plan==='done'&&s.L>=liftAt){g.pointer('pointerup',x,a.y);down=false;const r=JSON.parse(g.run('JSON.stringify(petDoneRect())'));g.tap(r.x+r.w/2,r.y+r.h/2);plan='lifted';}
    if(plan==='lifted')down=true; // stay off the cat
    fr('05-grumpy-ears',s.flat>.7&&!s.res);
   }
  }
  if(s.phase==='end'){if(down&&plan!=='lifted'){g.pointer('pointerup',x,a.y);down=false;}fr('06-result-'+s.res.kind,s.endT>.3);fr('07-payoff-'+s.res.kind,s.endT>1.4);}
  if(frames&&s.res&&s.res.kind==='hiss')fr('05b-hiss',s.endT>.15);
  step();t+=1/60;}
 for(let i=0;i<120;i++)step();
 const L=g.run('JSON.stringify(PET_LOG[PET_LOG.length-1])'),log=L?JSON.parse(L):null;
 const r={label,errs,result:log&&log.result,peakT:log&&log.peakT,dur:+t.toFixed(2),timerLeftBefore:startLeft,timerLeftAfter:g.run('WILD.left'),purrNodes:g.run('!!sfx.__purr'),liveAudio:st.live(),nodes:st.created,sky:g.run('SKY.length'),phase:g.run('WILD.phase')};
 g.close();return r;}
module.exports={run,strictAudio};
if(require.main===module)(async()=>{
 const src=process.argv[2];
 if(process.argv[3]==='frames'){console.log(JSON.stringify(await run({src,frames:true,plan:'peak'})));console.log(JSON.stringify(await run({src,frames:true,plan:'over',seed:6})));console.log(JSON.stringify(await run({src,frames:true,plan:'ears',seed:7})));return;}
 for(const [plan,o] of [['peak',{react:.25}],['peak',{react:.6}],['early',{liftAt:.6}],['early',{liftAt:.9}],['over',{}],['ears',{}],['none',{}],['done',{liftAt:.8}],['peak',{react:.25,speed:160}]])
  console.log(JSON.stringify(await run({src,plan,...o,label:plan+' '+JSON.stringify(o)})));
})().catch(e=>{console.error(e);process.exitCode=1;});
