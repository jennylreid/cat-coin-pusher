// CP-42 Laser chase: scripted player + frames (real runtime, sound ON via strict fake Web Audio; desktop, not phone evidence).
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
eval(fs.readFileSync(path.join(__dirname,'strict-audio.part'),'utf8'));
const O=process.env.OUT||path.resolve(__dirname,'../../tickets/CP-42-evidence');fs.mkdirSync(O,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
// style: 'front' drags the dot along prizes near the front; 'still' never touches; 'wild' scribbles fast
async function run({seed=3,style='front',frames=false,label=''}={}){
 const g=await game({seed,render:frames});const st=strictAudio(g),errs=[];g.run('S.muted=false');
 const step=()=>{try{g.tick();}catch(e){errs.push(String(e.stack||e.message).slice(0,300));}};
 g.run('laserStartNow()');let k=0;while(!g.run('!!WILD.chase')&&k<900){step();k++;}
 if(!g.run('!!WILD.chase'))return {label,errs,noChase:true};
 const left0=g.run('WILD.left');let t=0,down=false,shots={};
 const target=()=>{ // a prize (or anything) in the front half, in screen coordinates
  return JSON.parse(g.run(`(()=>{let best=null,bs=-1e9;for(const b of bodies){if(b.dead||!b.rb)continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M;if(z<480||z>T.FRONT-20||Math.abs(x-200)>tableHalfAt(z)-10)continue;const sc=(b.kind==='item'?200:0)+z*.3-Math.abs(x-200)*.1;if(sc>bs){bs=sc;best={x,z};}}const q=best?laserScreen(best.x,best.z-14,0):{x:200,y:650};return JSON.stringify(q);})()`));};
 let tgt=null,retarget=0;
 while(g.run('!!WILD.chase')&&t<30){
  const ph=g.run('WILD.chase.phase');
  if(ph==='play'&&style!=='still'){
   if(style==='front'){retarget-=1/60;if(!tgt||retarget<=0){tgt=target();retarget=1.0;}
    if(!down){g.pointer('pointerdown',tgt.x,tgt.y);down=true;}else g.pointer('pointermove',tgt.x+Math.sin(t*3)*4,tgt.y);}
   else{const x=200+150*Math.sin(t*5.3),y=600+120*Math.sin(t*3.1);if(!down){g.pointer('pointerdown',x,y);down=true;}else g.pointer('pointermove',x,y);}
  }
  if(ph==='end'&&down){g.pointer('pointerup',0,0);down=false;}
  if(frames){const D=JSON.parse(g.run("JSON.stringify({ph:WILD.chase.phase,t:WILD.chase.t,st:WILD.chase.st,endT:WILD.chase.endT,p:WILD.chase.pounces,fx:WILD.chase.fx.map(f=>f.text||'').join(',')})"));
   if(!shots.a&&D.ph==='intro'&&D.t>-.45){shot(g,'1-intro');shots.a=1;}
   if(!shots.b&&D.ph==='play'&&D.st==='chase'&&D.t>1){shot(g,'2-chasing-the-dot');shots.b=1;}
   if(!shots.c&&D.st==='wind'&&D.p>=1){shot(g,'3-wind-up');shots.c=1;}
   if(!shots.d&&D.st==='hold'&&/SWAT/.test(D.fx)){shot(g,'4-swat-a-prize');shots.d=1;}
   if(!shots.e&&D.st==='hold'&&/BAP/.test(D.fx)){shot(g,'5-bap-coins');shots.e=1;}
   if(!shots.f&&D.ph==='end'&&D.endT>1.5){shot(g,'6-end-knocked-off');shots.f=1;}}
  step();t+=1/60;}
 for(let i=0;i<120;i++)step();
 const L=g.run('JSON.stringify(LASER_LOG[LASER_LOG.length-1])'),log=L?JSON.parse(L):null,ev=log?log.events:[];
 const pounces=ev.filter(e=>e[1]==='pounce');
 const r={label,seed,style,errs:errs.slice(0,3),dur:+t.toFixed(2),pounces:pounces.length,coinHits:pounces.reduce((a,e)=>a+e[4],0),prizeHits:pounces.reduce((a,e)=>a+e[5],0),
  misses:pounces.filter(e=>!e[4]&&!e[5]&&!e[6]).length,end:ev.find(e=>e[1]==='end'),timerFrozen:+(left0-g.run('WILD.left')).toFixed(2),
  live:st.live(),nodes:st.created,got:g.run('WILD.got'),phase:g.run('WILD.phase'),coins:g.run('bodies.filter(b=>!b.dead).length')};
 g.close();return r;}
module.exports={run};
if(require.main===module)(async()=>{
 const a=process.argv.slice(2);
 if(a[0]==='frames'){console.log(JSON.stringify(await run({frames:true,label:'frames',seed:+(a[1]||3)})));return;}
 for(const style of ['front','still','wild'])for(const seed of [11,12,13])console.log(JSON.stringify(await run({seed,style,label:style})));
})().catch(e=>{console.error(e);process.exitCode=1;});
