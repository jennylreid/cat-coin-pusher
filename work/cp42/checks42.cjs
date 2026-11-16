// UAT 42 checks (real runtime, desktop): scattered 30% Pop. Writes tickets/CP-33-evidence/uat42/checks.json.
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat42');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,'release.html'),OLD=path.resolve(__dirname,'../cp41/release.html');
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
async function boardTrace(src,bi,pre='',untilWon=false){const g=await game({src,seed:5});const a=g.c.__game;g.run(pre+`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;while(t<25&&!(untilWon&&g.run('board.status')!=='playing'&&t>1)){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,bodies:bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)])})");g.close();return r;}
(async()=>{
 // 1. Boards: Current exactly as UAT 41; Pop the same until a board is won (Pop's placement has its own random stream).
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,'pickupFx.popStyle=0;'),b=await boardTrace(NEW,bi,'pickupFx.popStyle=0;');check('board '+(bi+1)+' (Current) identical to UAT 41 after 25 s',a===b,{chars:a.length});}
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,'',true),b=await boardTrace(NEW,bi,'',true);check('board '+(bi+1)+' (Pop) identical to UAT 41 until the board is won',a===b,{chars:a.length});}
 // 2. Pop flights.
 const g=await game({seed:6});g.ticks(20);
 check('defaults: Pop, peak 30%, time at peak 0.25 s, shrink 0.45 s',g.run('[pickupFx.popStyle,pickupFx.popPeak,pickupFx.popHold,pickupFx.popShrink].join()')==='1,0.3,0.25,0.45');
 const probe=(id,x,kind='item')=>{g.ticks(15);return JSON.parse(g.run(`(()=>{treatAwards.length=0;const snd=[],real=sfx.pickup;sfx.pickup=(k)=>snd.push(k);const f=queueTreatAward('${id}',${x},null,true,'${kind}');
  const cp=q=>({x:q.x,y:q.y,s:q.s,rot:q.rot}),pk=cp(pickupPoint(f,f.tr)),w=prizeWidth(f.id,pk.s),ph=panelHalf(f.id,w,pk.rot,0),lv=f.tr+f.tm,mid=cp(pickupPoint(f,lv+f.td*.5)),end=cp(pickupPoint(f,lv+f.td)),tg=f.kind==='quake'?quakeTarget():pickupTarget();
  let panel=false;for(let i=0;i<Math.ceil((lv+f.td)*60)+2;i++){tickTreatAwards(1/60);if(PANEL.on)panel=true;}const bounce=tileBounceT>=0;sfx.pickup=real;
  return JSON.stringify({pop:!!f.pop,x0:f.x0,y0:f.y0,tr:f.tr,tm:f.tm,td:f.td,peakW:w,peak:pk,box:[pk.x-ph[0],pk.y-ph[1],pk.x+ph[0],pk.y+ph[1]],H,midS:mid.s/f.ms,midRot:mid.rot,endAtBag:Math.hypot(end.x-tg.x,end.y-tg.y),snd,bounce,panel});})()`));};
 const on=q=>q.box[0]>=0&&q.box[2]<=400&&q.box[1]>=0&&q.box[3]<=q.H;
 for(const [id,x] of [['cheese',200],['shrimp',140],['tuna',260],['rain10',200],['yarn',230]]){const q=probe(id,x),tilt=Math.abs(q.peak.rot)*180/Math.PI,up=q.y0-q.peak.y;
  check(`Pop ${id}: 30% of the screen (visible art), near where it fell, tilted, on screen, then into the bag`,
   q.pop&&Math.abs(q.peakW-120)<2&&Math.abs(q.peak.x-q.x0)<=30&&up>=140&&up<=250&&tilt>=4&&tilt<=15.01&&on(q)&&q.midS<.6&&q.endAtBag<1&&Math.abs(q.tr-.2)<1e-9&&Math.abs(q.tm-.25)<1e-9&&Math.abs(q.td-.45)<1e-9,
   {x0:+q.x0.toFixed(1),peakX:+q.peak.x.toFixed(1),up:+up.toFixed(1),tilt:+tilt.toFixed(1),w:+q.peakW.toFixed(1)});
  if(id==='cheese')check('Pop keeps the ledge bell, landing thump and bag bounce; no striped panel',q.snd.includes('bell')&&q.snd.includes('thump')&&q.bounce&&!q.panel,{snd:q.snd,panel:q.panel});}
 {const q=probe('quake',200,'quake');check('Quake coin keeps its own flight and panel (not Pop)',!q.pop&&q.panel,{td:q.td});}
 // Variety and screen edges: 300 single pops at random ledge spots.
 {const r=JSON.parse(g.run(`(()=>{const ids=['cheese','shrimp','tuna','rain25','duck'];let off=0,xs=new Set(),ys=new Set(),rs=new Set();for(let i=0;i<300;i++){treatAwards.length=0;const x=T.L+ITEM_R+Math.random()*(T.R-T.L-2*ITEM_R),f=queueTreatAward(ids[i%5],x,null,true);
   const ph=panelHalf(f.id,prizeWidth(f.id,f.ms),f.rot,0);if(f.mx-ph[0]<0||f.mx+ph[0]>400||f.my-ph[1]<0||f.my+ph[1]>H)off++;xs.add(Math.round(f.mx-f.x0));ys.add(Math.round(f.y0-f.my));rs.add(Math.round(f.rot*180/Math.PI));}treatAwards.length=0;return JSON.stringify({off,xs:xs.size,ys:ys.size,rs:rs.size});})()`));
  check('300 pops at random ledge spots: all fully on screen, each with its own offset, height and tilt',r.off===0&&r.xs>20&&r.ys>40&&r.rs>15,r);}
 // Taking turns / overlapping: three from the same spot never share a peak.
 {const r=JSON.parse(g.run(`(()=>{treatAwards.length=0;const fs=[queueTreatAward('cheese',200,null,true),queueTreatAward('shrimp',200,null,true),queueTreatAward('tuna',200,null,true)];let d=1e9;for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)d=Math.min(d,Math.hypot(fs[i].mx-fs[j].mx,fs[i].my-fs[j].my));const w=pickupFx.popPeak*400;const waits=fs.map(f=>-f.t);treatAwards.length=0;return JSON.stringify({minDist:d,w,waits});})()`));
  check('three prizes from the same spot pop at different places (at least a prize-width apart) and still take turns',r.minDist>=r.w*.9&&r.waits[0]===0&&r.waits[1]>0&&r.waits[2]>r.waits[1],r);}
 // Current is UAT 41's flight.
 {const trace=async(src,pre)=>{const h=await game({src,seed:8});const r=h.run(pre+"(()=>{const out=[];for(const id of ['cheese','tuna','shrimp']){treatAwards.length=0;const f=queueTreatAward(id,180,null,true);for(let t=0;t<=f.tr+f.tm+f.td+.01;t+=.05){const q=pickupPoint(f,t);out.push([q.x,q.y,q.s,q.rot,q.flip].map(v=>+v.toFixed(5)));}}return JSON.stringify(out);})()");h.close();return r;};
  check('Pickup style Current is UAT 41\'s flight, unchanged',(await trace(NEW,'pickupFx.popStyle=0;'))===(await trace(OLD,'pickupFx.popStyle=0;')));}
 // Settings: UI text, saved-settings move to v7.
 {const html=g.run("S.dev=true;(()=>{const stub=()=>({onclick:null,style:{},querySelector:stub,querySelectorAll:()=>[]});panel.querySelector=stub;panel.querySelectorAll=()=>[];openCredits();const h=panel.innerHTML;panel.style.display='none';return h;})()");
  check('Developer > Prize feedback: Pickup style toggle and Pop peak size 30%',/Pickup style: Pop \(tap to switch\)/.test(html)&&/Pop peak size: 30% of screen width/.test(html));}
 g.close();
 {const storage={'catpusher.uat.pickupfx.v6':JSON.stringify({popStyle:0,popPeak:1,popHold:.5,volume:.4,spin:2})};const h=await game({seed:2,storage});
  const r=JSON.parse(h.run('JSON.stringify([pickupFx.popStyle,pickupFx.popPeak,pickupFx.popHold,pickupFx.volume,pickupFx.spin])'));h.close();
  check('a phone with UAT 36-41 settings (Current, 100%) starts on the new Pop at 30% and keeps its other dials',r.join()==='1,0.3,0.5,0.4,2',r);
  const h2=await game({seed:2,storage});h2.run("stepPickupFx('popPeak',1)");h2.close();const h3=await game({seed:2,storage});const kept=h3.run('pickupFx.popPeak');h3.close();
  check('Pop peak changes are saved (v7) and not reset again',kept===.35,{kept});}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({build:'2026.11.12 UAT 42',passed,failed},null,1));
 console.log(passed.length,'passed',failed.length,'failed');if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
