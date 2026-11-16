// ---------- CP-43 Pet the cat: the Cozy game mode (UAT 47) ----------
// Cozy is Wild 2 (goal card, timer, rain coins, bonus drops, towers, music, the happy-meter dance, win/lose cards, the
// visitor) with its own featured side game. A heart coin arrives as a bonus drop about once a round; push it off and
// Pet the cat starts: the round timer pauses, you stroke the cat's head (drag across it) and tap its ears, and a purr
// builds that you can hear and see on the purr meter below the chin. Stop (lift your finger and leave the cat be, or
// tap DONE) at the peak purr. Keep petting past the peak and the cat gets grumpy: its ears go flat, the purr turns to a
// growl and then a hiss. Coins pour onto the board by how close to the peak you stopped; a perfect stop gets the
// Dancing pose and a RAIN 10 coin. Only approved cat art, moved in code (ear flicks, whisker twitch, head lean, purr
// shiver, closed eyes from the approved Happy face). Wild, Wild 2 and Boards 1-3 are unchanged.
const PET_DEFAULTS=Object.freeze({len:9,peak:3.5,grace:1.2});
const PET={...PET_DEFAULTS},PET_KEY='catpusher.uat.pet.v1',PET_LOG_KEY='catpusher.uat.petlog.v1';
// [min, max, step, label, unit]
const PET_DIALS={len:[5,15,.5,'Pet length',' s'],peak:[1.5,8,.5,'Peak timing (stroking to peak)',' s'],grace:[.4,3,.1,'Grumpy after (past peak)',' s']};
try{const d=JSON.parse(localStorage.getItem(PET_KEY)||'null');if(d)for(const k in PET_DIALS)if(Number.isFinite(+d[k]))PET[k]=Math.min(PET_DIALS[k][1],Math.max(PET_DIALS[k][0],+d[k]));}catch(e){}
function petSave(){try{localStorage.setItem(PET_KEY,JSON.stringify(PET));}catch(e){}}
let PET_LOG=[];try{PET_LOG=JSON.parse(localStorage.getItem(PET_LOG_KEY)||'[]')||[];}catch(e){PET_LOG=[];}
const PET_INTRO=1.1,PET_END=2.6,PET_HUD_Y=468,PET_STOP_GAP=.75,PET_FULL_SPEED=230,PET_PERFECT_OVER=.45,PET_COINS=20;

// --- the heart coin: same physics as the rain coins; pink with a white heart ---
RAIN.heart={n:0,heart:true,r:33,half:4.4,face:['#ffe3f1','#ff5fa8','#a3195d'],edge:'#7a1046'};
EDGE.heart=RAIN.heart.edge;PRIZE_OPAQUE.heart=.95;PRIZE_ASPECT.heart=1;
function petHeartPath(g,x,y,s){g.beginPath();g.moveTo(x,y+s*.8);g.bezierCurveTo(x-s*1.35,y-s*.15,x-s*.7,y-s*1.25,x,y-s*.5);g.bezierCurveTo(x+s*.7,y-s*1.25,x+s*1.35,y-s*.15,x,y+s*.8);g.closePath();}
const __petRainFace=rainFace;
rainFace=function(g,c,r,kind){
 if(!RAIN[kind]||!RAIN[kind].heart)return __petRainFace(g,c,r,kind);
 const [c1,c2,c3]=RAIN[kind].face;let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,c1);gr.addColorStop(.5,c2);gr.addColorStop(1,c3);
 g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();
 g.lineWidth=r*.1;g.strokeStyle='#ffd23f';g.beginPath();g.arc(c,c,r*.86,0,7);g.stroke();
 g.fillStyle='rgba(255,236,150,.9)';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.arc(c+Math.cos(a)*r*.72,c+Math.sin(a)*r*.72,r*.045,0,7);g.fill();}
 petHeartPath(g,c,c-r*.08,r*.42);g.fillStyle='#fff';g.fill();g.lineWidth=r*.06;g.strokeStyle='#a3195d';g.stroke();
 g.fillStyle='rgba(255,140,200,.9)';g.beginPath();g.ellipse(c-r*.16,c-r*.26,r*.08,r*.05,-.6,0,7);g.fill();
 g.font='bold '+Math.round(r*.2)+'px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff6d0';g.fillText('PET',c,c+r*.6);
};

// --- head geometry (head space = where the head art is drawn: x -10..410, y -25..215, chin at CHIN_Y) ---
// The art is 1536 x 1024; px*420/1536-10, py*240/1024-25. Ear and whisker regions are traced from the approved art.
const PET_HX=420/1536,PET_HY=240/1024,petH=(px,py)=>[-10+px*PET_HX,-25+py*PET_HY];
function petPoly(pts,side){return pts.map(([x,y])=>petH(side>0?1536-x:x,y));}
const PET_EAR=[[70,575],[95,-30],[310,-30],[505,235]],PET_EAR_PIVOT=[285,395];      // left ear, mirrored for the right
const PET_WHISK=[[-30,545],[155,545],[155,880],[-30,880]],PET_WHISK_PIVOT=[155,700]; // outer whiskers and cheek fur
function headToScreen(hx,hy){return {x:200+(hx-200)*VIEW.hz,y:VIEW.y+(CHIN_Y+HEAD_DROP)*VIEW.zy+(hy-CHIN_Y)*VIEW.hzy};}
function screenToHead(p){return {x:200+(p.x-200)/VIEW.hz,y:CHIN_Y+(p.y-VIEW.y-(CHIN_Y+HEAD_DROP)*VIEW.zy)/VIEW.hzy};}
function petEarAt(h){for(const s of [-1,1]){const [ex,ey]=petH(s>0?1536-230:230,250);if(Math.hypot(h.x-ex,(h.y-ey)*1.1)<=48)return s;}return 0;}
function petOnHead(h){return ((h.x-200)/212)**2+((h.y-92)/128)**2<=1;}

// --- state ---
// Modes: with CP-41's mode registry (registerWildMode / MODES picker), Cozy is a registered mode featuring 'pet'.
// Without it (an older base), a COZY button under WILD 2 and WILD.pet do the same job.
const PET_REG=typeof registerWildMode==='function';
function petMode(){return WILD.on&&(PET_REG?WILD.mode==='cozy':!!WILD.pet);}
function petClear(){Object.assign(WILD,{pet:WILD.pet||false,petGame:null,petPending:null,petForce:false,heartN:0,heartAt:null,pets:0,petPerfects:0});}
petClear();
function petActive(){return !!(WILD.on&&WILD.petGame);}
function petLog(D,ev){D.log.push([+D.t.toFixed(3),...ev]);}
// Cozy rounds have no music-note coin and no fish coin: the heart coin is their side game. The happy meter still dances.
function petModeFlags(){if(!petMode())return;WILD.noteN=9;WILD.fishN=9;if(WILD.heartAt==null)WILD.heartAt=1+(Math.random()*2|0);}

function petStart(){
 stopDrops();holding=false;stopTickle();
 const peakT=PET.peak*rand(.88,1.14); // a little different each time, so you listen for it
 WILD.petGame={t:-PET_INTRO,phase:'intro',len:PET.len,peakT,grace:PET.grace,L:0,over:0,peaked:false,grr:false,touching:false,ptr:null,last:null,
  dist:0,brush:0,strokes:0,ears:0,huhs:0,liftAt:null,liftL:0,liftOver:0,lean:0,leanY:0,leanT:0,earL:{t:9,mag:0},earR:{t:9,mag:0},whisk:{t:9,side:0},
  flat:0,hissT:-1,squint:0,fx:[],result:null,endT:0,winWaiting:false,coins:0,log:[],started:time,doneP:0};
 WILD.petPending=null;WILD.pets++;
 sfx.pet('start',1);callout('PET THE CAT!',{color:'#ff8ac8',dur:1});try{navigator.vibrate&&navigator.vibrate(40);}catch(e){}
 try{diagEvent('pet','start len='+PET.len+' peak='+peakT.toFixed(2)+' grace='+PET.grace);}catch(e){}
 petLog(WILD.petGame,['start',PET.len,+peakT.toFixed(2),PET.grace]);
}
function petDoneRect(){return {x:302,y:PET_HUD_Y-19,w:76,h:38};}
// pointer: down on the head starts a stroke, on an ear flicks it, anywhere else the cat glances there
function petDown(e,p){
 const D=WILD.petGame;if(!D||D.phase!=='play')return;
 if(contains(petDoneRect(),p)){petStop(D,'done');return;}
 const h=screenToHead(p),ear=petEarAt(h);
 if(ear||petOnHead(h)){D.touching=true;D.ptr=e.pointerId;D.last={x:p.x,y:p.y};D.liftAt=null;D.fingerX=h.x;D.fingerY=h.y;
  if(ear){D.ears++;petEar(D,ear);}else{D.strokes++;sfx.pet('brush',.7,D.L);petHearts(D,p.x,p.y,1);}
  petLog(D,[ear?'ear':'touch',+p.x.toFixed(0),+p.y.toFixed(0),+D.L.toFixed(3)]);return;}
 // a tap away from the cat: it glances over with a little "mrr?" and a nudge to pet the head
 D.huhs++;pupilAim=p.x;sfx.pet('huh',1);D.fx.push({text:'pet my head!',x:Math.max(70,Math.min(330,p.x)),y:p.y-20,t:0,small:true,color:'#ffd0ea'});
 petLog(D,['huh',+p.x.toFixed(0),+p.y.toFixed(0)]);
}
function petEar(D,side){
 const E=side<0?D.earL:D.earR;E.t=0;E.mag=1;D.whisk={t:0,side};sfx.pet('mrrp',1);
 D.L=Math.min(1,D.L+.06/Math.max(.5,D.peakT/3.5));if(D.L>=1)D.over+=.12;
 const [ex,ey]=petH(side>0?1536-230:230,250),q=headToScreen(ex,ey);petHearts(D,q.x,q.y-10,2);D.fx.push({ring:true,x:q.x,y:q.y,t:0});
 try{navigator.vibrate&&navigator.vibrate(12);}catch(e){}
}
function petHearts(D,x,y,n){for(let i=0;i<n;i++)D.fx.push({heart:true,x:x+rand(-14,14),y:y+rand(-8,8),vx:rand(-30,30),vy:rand(-90,-50),s:rand(6,10),t:0});}
function petPointerMove(e){
 const D=petActive()?WILD.petGame:null;if(!D||D.phase!=='play'||!D.touching||e.pointerId!==D.ptr)return false;
 const p=toGame(e),h=screenToHead(p);
 if(D.last){const d=Math.hypot(p.x-D.last.x,p.y-D.last.y);if(petOnHead(h)||petEarAt(h)){D.dist+=d;D.brush+=d;D.fingerX=h.x;D.fingerY=h.y;
   if(D.brush>=70){D.brush=0;sfx.pet('brush',1,D.L);petHearts(D,p.x,p.y,1);}}}
 D.last={x:p.x,y:p.y};return true;
}
function petPointerUp(e){
 const D=petActive()?WILD.petGame:null;if(!D||!D.touching||e.pointerId!==D.ptr)return;
 D.touching=false;D.ptr=null;D.last=null;if(D.phase==='play'){D.liftAt=D.t;D.liftL=D.L;D.liftOver=D.over;petLog(D,['lift',+D.L.toFixed(3),+D.over.toFixed(2)]);}
}
// the stop: scored at the purr you had when you let go (or at DONE, or when the time runs out)
function petStop(D,why){
 if(D.phase!=='play')return;
 const L=why==='lift'?D.liftL:D.L,over=why==='lift'?D.liftOver:D.over;D.touching=false;
 let score,kind;
 if(why==='hiss'){score=.12;kind='hiss';}
 else if(L<.15&&over<=0){score=0;kind='none';}
 else if(over>0||L>=.97){const u=Math.min(1,over/D.grace);score=1-.6*u;kind=over<=PET_PERFECT_OVER?'perfect':'over';}
 else{score=Math.pow(Math.max(0,(L-.15)/.82),1.3);kind=L>=.85?'close':'early';}
 const coins=kind==='perfect'?PET_COINS+4:Math.round(PET_COINS*score);
 D.result={kind,score,L,over,why,coins,pct:Math.round(Math.min(L,1)*100)};D.phase='end';D.endT=0;D.coins=coins;
 if(kind==='perfect'){WILD.petPerfects++;sfx.wild2('perfect',1);wildConfetti(40);}else if(kind==='hiss'){}else if(coins)sfx.pet('content',1);else sfx.pet('huh',1);
 petLog(D,['end',kind,+L.toFixed(3),+over.toFixed(2),coins,why]);
 try{diagEvent('pet','end '+kind+' L='+L.toFixed(2)+' over='+over.toFixed(2)+' coins='+coins+' why='+why+' strokes='+D.strokes+' ears='+D.ears);}catch(e){}
 PET_LOG.push({at:new Date().toISOString(),dials:{...PET},peakT:+D.peakT.toFixed(2),result:D.result,events:D.log.slice(-160)});while(PET_LOG.length>3)PET_LOG.shift();
 try{localStorage.setItem(PET_LOG_KEY,JSON.stringify(PET_LOG));}catch(e){}
}
function petTick(dt,paused){
 const D=WILD.petGame;if(!D||paused)return;
 WILD.lastPay=time;D.t+=dt;
 for(let i=D.fx.length-1;i>=0;i--){const f=D.fx[i];f.t+=dt;if(f.heart){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=40*dt;}if(f.t>(f.heart?.9:f.ring?.35:1))D.fx.splice(i,1);}
 for(const E of [D.earL,D.earR])E.t+=dt;D.whisk.t+=dt;
 if(D.phase==='intro'){if(D.t>=0)D.phase='play';sfx.purr(0,20);return;}
 if(D.phase==='play'){
  // the purr: steady stroking fills it to the peak in about peakT seconds; it settles slowly when you stop
  const speed=D.dist/Math.max(dt,1/240);D.dist=0;const rate=D.touching?Math.min(1,speed/PET_FULL_SPEED):0;
  if(rate>0){if(D.L<1){D.L=Math.min(1,D.L+rate*dt/D.peakT);}else D.over+=dt*Math.max(.35,rate);}
  else if(!D.touching){D.L=Math.max(0,D.L-.05*dt);}
  if(!D.peaked&&D.L>=.97){D.peaked=true;sfx.pet('peak',1);D.fx.push({text:'PEAK PURR!',x:150,y:PET_HUD_Y-36,t:0,color:'#ffe066'});petLog(D,['peak']);}
  if(!D.grr&&D.over>=D.grace*.45){D.grr=true;sfx.pet('grr',1);D.fx.push({text:'grr…',x:200,y:PET_HUD_Y-36,t:0,color:'#ff9a7a'});}
  D.flat=Math.min(1,D.over/D.grace);
  if(D.over>=D.grace){D.hissT=0;sfx.pet('hiss',1);try{navigator.vibrate&&navigator.vibrate([30,30,60]);}catch(e){}petStop(D,'hiss');}
  else if(!D.touching&&D.liftAt!=null&&D.t-D.liftAt>=PET_STOP_GAP)petStop(D,'lift');
  else if(D.t>=D.len){D.liftAt=null;petStop(D,'time');}
  D.doneP=!D.touching&&D.liftAt!=null&&D.phase==='play'?Math.min(1,(D.t-D.liftAt)/PET_STOP_GAP):0;
 }else D.endT+=dt;
 // the look: eyes close with the purr, open again as it turns grumpy; the head leans into your finger
 const live=D.phase==='play'||(D.phase==='end'&&D.result&&D.result.kind!=='hiss'&&D.endT<PET_END);
 // (a quick snap, not a slow fade: half-closed eyes look muddy)
 const sq=D.phase==='end'?(D.result.kind==='hiss'||D.result.L<.25?0:1):D.L>=.22&&D.flat<.3?1:0;
 D.squint+=(sq-D.squint)*Math.min(1,dt*16);
 const lean=D.touching&&D.fingerX!=null?Math.max(-1,Math.min(1,(D.fingerX-200)/170)):0;D.lean+=(lean-D.lean)*Math.min(1,dt*6);
 D.leanY+=((D.touching?1:0)-D.leanY)*Math.min(1,dt*6);
 if(D.hissT>=0)D.hissT+=dt;
 // sound: louder and faster with the purr; a growl past the peak; silent after a hiss
 if(D.phase==='play')sfx.purr(D.L>0.02?.2+.8*D.L:0,17+11*D.L-6*D.flat,D.flat);
 else if(live&&D.result.kind!=='none')sfx.purr(Math.max(0,(.2+.8*D.result.L)*(1-D.endT/PET_END)),17+11*D.result.L,0);
 else sfx.purr(0,20);
 if(D.phase!=='end')return;
 const R=D.result;
 // the payoff: coins pour onto the board; a perfect stop gets the Dancing pose and a RAIN 10 from the sky
 if(!D.paid&&D.endT>=.55){D.paid=true;
  if(R.coins){w2Rain(R.coins,Math.max(.03,Math.min(.07,1.1/R.coins)));sfx.wild2('whoosh',1);sfx.dance('pour',.7,.5);WILD.rained+=R.coins;}
  if(R.kind==='perfect'){skyDrop('rain10',200+rand(-60,60),rand(560,630),{dur:1,delay:.4});
   if(sweepTime===0&&catquakeTime===0){stopPawDance();pawDanceToken++;pawDance={started:time,silent:true,index:1,switched:true,anchor:0,pet:true};}}}
 if(pawDance&&pawDance.pet&&time-pawDance.started>2.4)stopPawDance();
 if(D.endT>=PET_END){if(pawDance&&pawDance.pet)stopPawDance();WILD.petGame=null;sfx.purr(0,20);
  if(D.winWaiting||(WILD.got>=WILD_GOAL&&board.status==='playing')){board.status='playing';wildFinish(true);}}
}
function petSquint(){const D=WILD.on&&WILD.petGame;return D?Math.max(0,Math.min(1,D.squint)):0;}

// --- drawing the head: the approved art moved in code ---
function petEarAngle(D,side){const E=side<0?D.earL:D.earR,t=E.t;let a=0;
 if(t<.5)a+=.34*Math.exp(-t/.11)*Math.sin(t*Math.PI*2*6.5);          // the flick: out and back, twice
 a+=.42*D.flat;                                                           // grumpy: ears go flat ("airplane ears")
 if(D.hissT>=0)a+=.12*Math.max(0,1-D.hissT/1.2);
 return side<0?-a:a;}
function petWhiskAngle(D,side){const W=D.whisk,t=W.t;let a=t<.6?.07*Math.exp(-t/.16)*Math.sin(t*Math.PI*2*11):0;
 if(D.phase==='play'&&D.L>.4)a+=.012*D.L*Math.sin(time*31+side);           // a faint quiver at high purr
 return side<0?-a:a;}
function petHeadXf(){
 const D=WILD.on&&WILD.petGame;if(!D)return;
 let r=D.lean*.075,x=D.lean*7,y=-4*D.leanY;
 if(D.phase==='play'&&D.L>.25)y+=Math.sin(time*2*Math.PI*23)*.7*D.L;     // the purr shiver
 if(D.hissT>=0&&D.hissT<1){const u=D.hissT;y+=-10*Math.sin(Math.min(1,u/.12)*Math.PI/2)*(1-Math.max(0,(u-.6)/.4));}
 ctx.translate(200+x,110+y);ctx.rotate(r);ctx.translate(-200,-110);
}
function petHeadImg(img){const D=WILD.on&&WILD.petGame;if(!D)return img;
 if(D.hissT>=0&&D.hissT<1.1)return ART.headWild||img;return ART.headSweet||img;}
function petDrawHead(img){
 const D=WILD.on&&WILD.petGame;if(!D)return ctx.drawImage(img,-10,-25,420,240);
 img=petHeadImg(img);
 const parts=[];
 for(const s of [-1,1]){const a=petEarAngle(D,s);if(Math.abs(a)>.002)parts.push({poly:petPoly(PET_EAR,s),pv:petH(s>0?1536-PET_EAR_PIVOT[0]:PET_EAR_PIVOT[0],PET_EAR_PIVOT[1]),a});
  const w=petWhiskAngle(D,s);if(Math.abs(w)>.002)parts.push({poly:petPoly(PET_WHISK,s),pv:petH(s>0?1536-PET_WHISK_PIVOT[0]:PET_WHISK_PIVOT[0],PET_WHISK_PIVOT[1]),a:w});}
 if(!parts.length)return ctx.drawImage(img,-10,-25,420,240);
 const path=poly=>{ctx.moveTo(poly[0][0],poly[0][1]);for(let i=1;i<poly.length;i++)ctx.lineTo(poly[i][0],poly[i][1]);ctx.closePath();};
 // the head without the moving parts, then each part turned about its base
 ctx.save();ctx.beginPath();ctx.rect(-40,-60,480,320);for(const q of parts)path(q.poly);ctx.clip('evenodd');ctx.drawImage(img,-10,-25,420,240);ctx.restore();
 for(const q of parts){ctx.save();ctx.translate(q.pv[0],q.pv[1]);ctx.rotate(q.a);ctx.translate(-q.pv[0],-q.pv[1]);ctx.beginPath();path(q.poly);ctx.clip();ctx.drawImage(img,-10,-25,420,240);ctx.restore();}
}

// --- the Cozy button, under WILD 2 ---
function petButton(){const h=hudLayout();return {x:W/2+114,y:h.mainY+19,w:34,h:28};}
function drawPetButton(){
 if(inventoryOpen||WILD.on)return;const b=petButton(),pulse=.5+.5*Math.sin(performance.now()/300+.4);
 ctx.save();const g=ctx.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);g.addColorStop(0,'#ffb3dc');g.addColorStop(1,'#ff5fa8');
 uiRound(b.x,b.y,b.w,b.h,12,g,'rgba(255,255,255,'+(.55+.45*pulse)+')',2);
 petHeartPath(ctx,b.x+b.w/2,b.y+11,7);ctx.fillStyle='#fff';ctx.fill();
 ctx.fillStyle='#5a0b33';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 8px system-ui';ctx.fillText('COZY',b.x+b.w/2,b.y+22);ctx.restore();
}
function petEnter(){if(PET_REG){if(!wildModeEnter('cozy'))return false;petModeFlags();return true;}if(WILD.on)wildExit();if(!wild2Enter())return false;WILD.pet=true;petModeFlags();petCardLines(true);try{diagEvent('pet','enter cozy');}catch(e){}return true;}

// --- the Cozy goal card: Wild 2's card with its own title and lines ---
const PET_CARD_LINES=[['heart','Push off the heart coin','to pet the cat'],['stroke','Stroke the head, tap the ears','and the purr builds'],['peak','Stop at the peak purr','for the most coins'],
 ['visitor','Win','and a cat comes to visit'],['rain10','Rain coins pour','5, 10 or 25 coins'],['!','Bonus drops','fall from the sky']];
let PET_W2_LINES=null;
function petCardLines(on){if(PET_REG||typeof W2_CARD_LINES==='undefined')return;if(!PET_W2_LINES)PET_W2_LINES=W2_CARD_LINES.slice();W2_CARD_LINES.splice(0,W2_CARD_LINES.length,...(on?PET_CARD_LINES:PET_W2_LINES));}
const __petCardIcon=w2CardIcon;
w2CardIcon=function(kind,x,y){
 if(kind==='heart'){const sp=sprite('heart');ctx.drawImage(sp.cv,x-16,y-16,32,32);return;}
 if(kind==='stroke'){ctx.save();ctx.strokeStyle='#ffd0ea';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-18,y+4);ctx.quadraticCurveTo(x,y-14,x+18,y+4);ctx.stroke();
  ctx.fillStyle='#ffd0ea';ctx.beginPath();ctx.moveTo(x+20,y+8);ctx.lineTo(x+12,y+6);ctx.lineTo(x+19,y-1);ctx.closePath();ctx.fill();petHeartPath(ctx,x,y+10,5);ctx.fillStyle='#ff5fa8';ctx.fill();ctx.restore();return;}
 if(kind==='peak'){uiRound(x-20,y-6,40,12,6,'rgba(40,16,50,.9)','#ffb3dc',1.5);const g=ctx.createLinearGradient(x-20,0,x+20,0);g.addColorStop(0,'#ff8ac8');g.addColorStop(1,'#ffe066');uiRound(x-19,y-5,30,10,5,g);
  ctx.fillStyle='#ffe066';ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?3.5:8;ctx.lineTo(x+11+Math.cos(a)*r,y-13+Math.sin(a)*r);}ctx.closePath();ctx.fill();return;}
 return __petCardIcon(kind,x,y);
};

// --- hooks (each passes straight through outside Cozy) ---
const __petReset=wildReset,__petExit=wildExit,__petFinish=wildFinish,__petRain=wildRainCollected,__petBonus=wildScheduleBonus,__petLand=wildLandBonus,
 __petTickW=wildTick,__petPointer=wildPointer,__petHud=drawWildHud,__petDrawW=wildDraw,__petDanceStart=danceStart,__petDrawWildButton=drawWildButton;
wildReset=function(){const force=WILD.petForce,mode=WILD.pet;const r=__petReset();sfx.purr(0,20);petClear();WILD.pet=mode;WILD.petForce=force;petModeFlags();return r;};
wildExit=function(){sfx.purr(0,20);if(pawDance&&pawDance.pet)stopPawDance();const was=WILD.pet;petClear();WILD.pet=false;const r=__petExit();if(was&&!PET_REG)petCardLines(false);return r;};
// Once petting has started, a win waits until it's finished; a loss (or EXIT) ends it at once.
wildFinish=function(win,reason){
 if(WILD.petGame){if(win&&WILD.phase==='play'){WILD.petGame.winWaiting=true;return;}const D=WILD.petGame;WILD.petGame=null;sfx.purr(0,20);try{diagEvent('pet','cut L='+D.L.toFixed(2));}catch(e){}}
 WILD.petPending=null;return __petFinish(win,reason);
};
danceStart=function(){if(WILD.petGame)return;return __petDanceStart();};
if(typeof w2StartWheelNow==='function'){const __petWheelNow=w2StartWheelNow;w2StartWheelNow=function(){if(WILD.petGame){WILD.wheelForce=true;return;}return __petWheelNow();};}
wildRainCollected=function(b,x){
 if(b.kind!=='heart')return __petRain(b,x);
 const f=queueTreatAward(b.kind,x,b);
 if(WILD.phase==='play'&&board.status==='playing'&&!WILD.petGame)WILD.petPending={f,wait:0};
 try{diagEvent('pet','heart coin');}catch(e){}
};
wildScheduleBonus=function(){
 // About one heart coin a Cozy round: it replaces one bonus drop (the 1st or 2nd), unless a lost prize needs replacing.
 // If that one is lost off a side, a second can come later.
 if(petMode()){petModeFlags();
  if(!wildMissing().length&&!WILD.petGame&&!WILD.petPending&&((WILD.heartN===0&&WILD.bonusN+1>=WILD.heartAt)||(WILD.heartN===1&&WILD.pets===0&&WILD.bonusN>=WILD.heartAt+2&&Math.random()<.35))){
   const y=rand(430,620),x=200+rand(-1,1)*(tableHalfAt(y)-50);
   WILD.incoming.push({kind:'heart',id:null,x,y,t:.9,t0:.9});WILD.bonusN++;WILD.heartN++;sfx.wild('whistle',1);return;}
 }
 return __petBonus();
};
wildLandBonus=function(o){__petLand(o);if(o.kind==='heart'&&floats.length)floats[floats.length-1].text='HEART COIN!';};
wildTick=function(dt){
 if(!WILD.on)return __petTickW(dt);
 const paused=inventoryOpen||panel.style.display==='block';
 if(paused&&WILD.petGame)sfx.purr(0,20);
 if(WILD.petForce&&petMode()&&WILD.phase==='play'&&board.status==='playing'&&(WILD.goT||0)>=.8&&!paused){WILD.petForce=false;if(!WILD.petGame)WILD.petPending={f:null,wait:9};}
 if(WILD.petPending&&!WILD.petGame&&!paused){const P=WILD.petPending;P.wait+=dt;const f=P.f;
  if(WILD.phase==='play'&&board.status==='playing'&&!WILD.dance&&!(typeof W2_YAWN!=='undefined'&&W2_YAWN)&&sweepTime===0&&catquakeTime===0&&(!f||f.arrived||f.t>=f.tr+f.tm*.5||P.wait>1.2))petStart();}
 if(!WILD.petGame||WILD.phase!=='play'){if(WILD.petGame&&WILD.phase!=='play'){WILD.petGame=null;sfx.purr(0,20);}return __petTickW(dt);}
 // The round timer, Turbo and the bonus-drop clock pause while you pet; everything else keeps going.
 const left=WILD.left,turbo=WILD.turbo,next=WILD.nextBonus;
 __petTickW(dt);
 if(WILD.phase==='play'){WILD.left=left;if(WILD.turbo>0)WILD.turbo=turbo;WILD.nextBonus=next;}
 if(WILD.petGame)petTick(dt,paused);
};
wildPointer=function(e,p){
 if(!PET_REG&&!WILD.on&&world&&!inventoryOpen&&contains(petButton(),p)){petEnter();return true;}
 if(!WILD.on||!WILD.petGame||WILD.phase!=='play'||inventoryOpen||!world)return __petPointer(e,p);
 if(contains(wildButton(),p))return __petPointer(e,p); // EXIT still works
 const hud=hudLayout();if(p.y>hud.settingsY-20&&p.y<hud.settingsY+12&&p.x>hud.settingsX-78&&p.x<hud.settingsX+6)return false; // Settings
 petDown(e,p);return true; // every other touch is for the cat: no coin drops while you pet
};
drawWildHud=function(hud){__petHud(hud);if(WILD.petGame){ctx.save();ctx.fillStyle='#ffd0ea';ctx.fillRect(hud.left+78,hud.bannerY-6,3.5,12);ctx.fillRect(hud.left+84,hud.bannerY-6,3.5,12);ctx.restore();}};
wildDraw=function(){__petDrawW();if(WILD.on&&WILD.petGame&&!inventoryOpen)petDraw();};
drawWildButton=function(){__petDrawWildButton();if(!PET_REG)drawPetButton();};

// --- drawing: the purr meter strip below the chin, DONE, hearts and words ---
function petDraw(){
 const D=WILD.petGame,Y=PET_HUD_Y;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 const fade=D.phase==='end'?Math.max(0,1-D.endT/.5):Math.min(1,(time-D.started)/.25);
 if(fade>0){ctx.globalAlpha=fade;
  uiRound(14,Y-22,372,44,20,'rgba(48,10,36,.78)','#ff8ac8',2);
  // the heart beats with the purr
  const L=D.phase==='end'?D.result.L:D.L,beat=1+(.08+.14*L)*Math.max(0,Math.sin(time*Math.PI*2*(1.2+2.2*L)));
  ctx.save();ctx.translate(38,Y+1);ctx.scale(beat,beat);petHeartPath(ctx,0,0,13);ctx.fillStyle=D.flat>.5?'#ff6a4a':'#ff5fa8';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();ctx.restore();
  ctx.font='bold 10px system-ui';ctx.fillStyle='#ffd0ea';ctx.fillText('PURR',38,Y+17);
  // the meter: fills to the PEAK star; past it, a red "grumpy" zone
  const x0=62,x1=292,w=x1-x0,peakX=x0+w*.78,gx=peakX+(x1-peakX)*Math.min(1,D.flat);
  uiRound(x0,Y-9,w,18,9,'rgba(20,4,16,.9)','rgba(255,180,220,.5)',1);
  ctx.fillStyle='rgba(255,90,60,.28)';ctx.fillRect(peakX+8,Y-8,x1-peakX-14,16);
  const fx=x0+(peakX-x0)*Math.min(1,L);const g=ctx.createLinearGradient(x0,0,peakX,0);g.addColorStop(0,'#ff8ac8');g.addColorStop(.8,'#ffb3dc');g.addColorStop(1,'#ffe066');
  if(fx>x0+2)uiRound(x0+1,Y-8,fx-x0-2,16,8,g);
  if(D.flat>0){const rg=ctx.createLinearGradient(peakX,0,x1,0);rg.addColorStop(0,'#ffb04a');rg.addColorStop(1,'#ff3a2a');uiRound(peakX,Y-8,gx-peakX,16,6,rg);}
  // the peak star, glowing when you're there
  const at=L>=.97&&D.flat<.4,st=at?1.25+.15*Math.sin(time*14):1;ctx.save();ctx.translate(peakX,Y);ctx.scale(st,st);ctx.fillStyle=at?'#fff6a0':'#ffd23f';ctx.strokeStyle='#5a2a00';ctx.lineWidth=1.5;
  ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?5:12;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  ctx.font='bold 9px system-ui';ctx.fillStyle='#ffe066';ctx.fillText('PEAK',peakX,Y+17);
  // DONE (fills as you stay off the cat: lifting your finger and leaving it is a stop too)
  const R=petDoneRect();uiRound(R.x,R.y,R.w,R.h,16,D.phase==='play'?'#3ccf4e':'rgba(60,207,78,.5)','#d9ffd9',2);
  if(D.doneP>0){ctx.save();ctx.globalAlpha=fade*.55;uiRound(R.x+2,R.y+2,(R.w-4)*D.doneP,R.h-4,14,'#e8ffd0');ctx.restore();}
  ctx.font='900 18px Impact, "Arial Black", system-ui';ctx.fillStyle='#0c3a12';ctx.fillText('DONE',R.x+R.w/2,R.y+R.h/2+1);
  // the time left: a thin bar under the strip
  if(D.phase==='play'){const u=Math.max(0,1-D.t/D.len);ctx.fillStyle='rgba(255,138,200,.85)';ctx.fillRect(30,Y+25,340*u,3);}
  if(D.phase==='intro'){const u=Math.min(1,(D.t+PET_INTRO)/.3),k=(.6+.4*(1-Math.pow(1-u,3)))*(1+.04*Math.sin(time*9));ctx.save();ctx.translate(200,Y+60);ctx.scale(k,k);ctx.rotate(-.05);wildText('PET THE CAT!',0,0,44,'#ff8ac8','#3a0b2a',8);ctx.restore();
   ctx.font='bold 15px system-ui';ctx.fillStyle='#fff';ctx.fillText('Stroke the head · tap the ears',200,Y+98);ctx.fillStyle='#ffe066';ctx.fillText('Stop at the peak purr!',200,Y+120);}
  else if(D.phase==='play'&&D.t<2.5&&!D.strokes&&!D.ears){ctx.font='bold 14px system-ui';ctx.fillStyle='#fff';ctx.globalAlpha=fade*(.6+.4*Math.sin(time*6));ctx.fillText('Stroke the cat\'s head',200,Y+44);}
 }
 ctx.globalAlpha=1;
 // a hand that shows the stroke, only for a moment at the start (it passes over the forehead, never rests on the face)
 if(D.phase==='intro'||(D.phase==='play'&&D.t<1.2&&!D.strokes&&!D.ears)){const u=((D.t+PET_INTRO)%1.1)/1.1,a=petH(560+420*u,170),q=headToScreen(a[0],a[1]-6*Math.sin(u*Math.PI));
  ctx.globalAlpha=.85*Math.sin(u*Math.PI);ctx.font='30px system-ui';ctx.fillText('👆',q.x,q.y+16);ctx.globalAlpha=1;}
 for(const f of D.fx){
  if(f.heart){ctx.globalAlpha=Math.max(0,1-f.t/.9);petHeartPath(ctx,f.x,f.y,f.s);ctx.fillStyle='#ff6ab8';ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle='#fff';ctx.stroke();continue;}
  if(f.ring){const u=f.t/.35;ctx.globalAlpha=Math.max(0,1-u);ctx.strokeStyle='#ffd0ea';ctx.lineWidth=3*(1-u)+1;ctx.beginPath();ctx.arc(f.x,f.y,14+26*u,0,7);ctx.stroke();continue;}
  ctx.globalAlpha=Math.max(0,1-f.t);ctx.font=f.small?'bold 14px system-ui':'900 20px Impact, "Arial Black", system-ui';ctx.lineWidth=4;ctx.strokeStyle='#2a0b2e';ctx.strokeText(f.text,f.x,f.y-f.t*24);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y-f.t*24);}
 ctx.globalAlpha=1;
 // the end: below the chin, never over the face
 if(D.phase==='end'){const R=D.result,u=Math.min(1,D.endT/.25),out=Math.max(0,(D.endT-(PET_END-.35))/.35);ctx.globalAlpha=1-out;ctx.save();ctx.translate(200,Y+36);ctx.scale(.6+.45*u,.6+.45*u);ctx.rotate(-.04);
  const big={perfect:['PURR-FECT!','#7dff6a','#0c3a12'],hiss:['HSSSS!','#ff9a7a','#3a0b0b'],over:['A BIT MUCH…','#ffb04a','#3a1a00'],close:['SO CLOSE!','#ffe066','#3a1a00'],early:['MORE PETS?','#ffd0ea','#3a0b2a'],none:['NO PETS?','#d8c8ee','#2a0b3e']}[R.kind];
  wildText(big[0],0,0,46,big[1],big[2],8);
  ctx.font='bold 15px system-ui';ctx.fillStyle='#fff';
  const line=R.kind==='hiss'?'Too much petting! +'+R.coins+' coins':R.kind==='none'?'The cat waited for a pet':R.kind==='perfect'?'+'+R.coins+' coins · RAIN 10 coming':'+'+R.coins+' coins · stopped at '+(R.over>0?'peak + '+R.over.toFixed(1)+' s':R.pct+'% of the peak');
  ctx.fillText(line,0,38,340);ctx.restore();ctx.globalAlpha=1;}
 ctx.restore();
}

// --- Developer dials (Settings > Developer mode > Pet the cat), saved on this phone; values go in the performance log ---
function petDialText(k){const [,,,label,unit]=PET_DIALS[k];return label+': '+(+PET[k].toFixed(2))+unit;}
function petDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 const last=PET_LOG.length?PET_LOG[PET_LOG.length-1].result:null;
 return '<div class="set" id="pet-dev"><h3><span>Pet the cat (Cozy)</span><span>tuning</span></h3><button id="pet-now" class="wide">Start pet the cat now</button>'+
  Object.keys(PET_DIALS).map(k=>'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><button data-pet="'+k+'" data-dir="-1" style="'+b+'">−</button><span style="flex:1;text-align:center">'+petDialText(k)+'</span><button data-pet="'+k+'" data-dir="1" style="'+b+'">+</button></div>').join('')+
  '<p style="margin:4px 0;font-size:13px;opacity:.8">Last: '+(last?last.kind+', '+last.pct+'% of peak'+(last.over>0?' + '+last.over.toFixed(1)+' s over':'')+', '+last.coins+' coins':'none yet')+'.</p>'+
  '<button id="pet-dev-reset" class="wide">Pet the cat defaults</button></div>';}
function stepPetDial(k,dir){const [lo,hi,st]=PET_DIALS[k];PET[k]=Math.min(hi,Math.max(lo,Math.round((PET[k]+dir*st)*1000)/1000));petSave();}
function petStartNow(){
 if(!petMode())petEnter();
 if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();WILD.petForce=true;wildStartCountdown();}
 else if(!WILD.petGame)WILD.petForce=true;
 panel.style.display='none';try{diagEvent('pet-tuning','start-now');}catch(e){}
}
const __petDevHtml=wildDevHtml,__petDevBind=wildDevBind;
wildDevHtml=function(){return __petDevHtml()+petDevHtml();};
wildDevBind=function(panel){__petDevBind(panel);const box=panel.querySelector&&panel.querySelector('#pet-dev');if(!box)return;
 const reopen=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 for(const btn of box.querySelectorAll('[data-pet]'))btn.onclick=()=>{stepPetDial(btn.dataset.pet,+btn.dataset.dir);try{diagEvent('pet-tuning',btn.dataset.pet+'='+PET[btn.dataset.pet]);}catch(e){}reopen();};
 box.querySelector('#pet-now').onclick=petStartNow;
 box.querySelector('#pet-dev-reset').onclick=()=>{Object.assign(PET,PET_DEFAULTS);try{localStorage.removeItem(PET_KEY);}catch(e){}reopen();};};

if(PET_REG)registerWildMode({id:'cozy',name:'COZY',blurb:'Pet the cat. Stop at the peak purr!',
 colors:['#ff8ac8','#3a0b2a','#4a1838'],panel:['#5a1f4e','#220a1e'],features:{pet:true},cardLines:PET_CARD_LINES,
 icon(x,y){const sp=sprite('heart');ctx.drawImage(sp.cv,x-24,y-24,48,48);},
 cardIcon(kind,x,y){if(kind==='heart'||kind==='stroke'||kind==='peak'){w2CardIcon(kind,x,y);return true;}return false;}});
