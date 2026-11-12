// ---------- CP-41 Treat toss: a second side game on Wild 2 (UAT 45) ----------
// A fish coin ("TREATS", a code-drawn coin like the music-note coin) arrives as a bonus drop about once a round.
// Push it off and Treat toss starts: the round timer pauses and the cat flips treats up from behind the board in arcs
// (the approved treat sprites as they are). Tap a treat in the air to catch it (snap and chomp, a pop, it flies to the
// bag); a tap on empty air or a treat that falls back gets a soft whiff and a small cross. It ramps up: a few treats,
// then more and faster, on the music's eighth-note grid. At the end, "+N TREATS!": treats the goal needs tick off the
// collection, spares go to the pantry, and catching every one is PERFECT! (a RAIN 10 coin drops from the sky).
// A win waits until the toss is finished. It runs only in a mode that features it (wildFeature('toss')); Wild 1 and
// Wild 2 never see a fish coin. Every catch and miss goes in the log.
const TOSS_DEFAULTS=Object.freeze({len:8.5,count:16,speed:1,tapR:44});
const TOSS={...TOSS_DEFAULTS},TOSS_KEY='catpusher.uat.treattoss.v1',TOSS_LOG_KEY='catpusher.uat.tosslog.v1',PANTRY_KEY='catpusher.uat.pantry.v1';
// [min, max, step, label, unit]
const TOSS_DIALS={len:[5,15,.5,'Toss length',' s'],count:[6,30,1,'Treats tossed',''],speed:[.6,1.6,.1,'Treat speed','x'],tapR:[26,80,2,'Tap radius',' px']};
try{const d=JSON.parse(localStorage.getItem(TOSS_KEY)||'null');if(d)for(const k in TOSS_DIALS)if(Number.isFinite(+d[k]))TOSS[k]=Math.min(TOSS_DIALS[k][1],Math.max(TOSS_DIALS[k][0],+d[k]));}catch(e){}
function tossSave(){try{localStorage.setItem(TOSS_KEY,JSON.stringify(TOSS));}catch(e){}}
let TOSS_LOG=[];try{TOSS_LOG=JSON.parse(localStorage.getItem(TOSS_LOG_KEY)||'[]')||[];}catch(e){TOSS_LOG=[];}
let PANTRY={};try{PANTRY=JSON.parse(localStorage.getItem(PANTRY_KEY)||'{}')||{};}catch(e){PANTRY={};}
const TOSS_INTRO=.9,TOSS_END=2.1,TOSS_W=72,TOSS_LAUNCH_Y=430,TOSS_FLOOR=772,TOSS_HUD_Y=468;

// --- the fish coin: same physics as the rain coins; teal with an orange fish ---
RAIN.fish={n:0,fish:true,r:33,half:4.4,face:['#e9fffb','#18b39a','#0b5a52'],edge:'#0b4a44'};
EDGE.fish=RAIN.fish.edge;PRIZE_OPAQUE.fish=.95;PRIZE_ASPECT.fish=1;
const __tossRainFace=rainFace;
rainFace=function(g,c,r,kind){
 if(!RAIN[kind]||!RAIN[kind].fish)return __tossRainFace(g,c,r,kind);
 const [c1,c2,c3]=RAIN[kind].face;let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,c1);gr.addColorStop(.5,c2);gr.addColorStop(1,c3);
 g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();
 g.lineWidth=r*.1;g.strokeStyle='#ffd23f';g.beginPath();g.arc(c,c,r*.86,0,7);g.stroke();
 g.fillStyle='rgba(255,236,150,.9)';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.arc(c+Math.cos(a)*r*.72,c+Math.sin(a)*r*.72,r*.045,0,7);g.fill();}
 // a fat orange fish, facing left
 const s=r/30;g.save();g.translate(c+1*s,c-4*s);g.fillStyle='#ff9a3c';g.strokeStyle='#7a3a00';g.lineWidth=1.6*s;
 g.beginPath();g.ellipse(-3*s,0,13*s,8.5*s,0,0,7);g.fill();g.stroke();
 g.beginPath();g.moveTo(8*s,0);g.lineTo(18*s,-8*s);g.lineTo(16*s,0);g.lineTo(18*s,8*s);g.closePath();g.fill();g.stroke();
 g.fillStyle='#ffd08a';g.beginPath();g.moveTo(-4*s,-7*s);g.quadraticCurveTo(1*s,-14*s,5*s,-6*s);g.closePath();g.fill();
 g.fillStyle='#fff';g.beginPath();g.arc(-10*s,-2*s,2.6*s,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(-10.5*s,-2*s,1.3*s,0,7);g.fill();
 g.strokeStyle='#7a3a00';g.lineWidth=1.2*s;g.beginPath();g.arc(1*s,0,5*s,-1,1);g.stroke();g.restore();
 g.font='bold '+Math.round(r*.19)+'px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff6d0';g.fillText('TREATS',c,c+r*.6);
};

// --- state ---
function tossClear(){Object.assign(WILD,{toss:null,tossPending:null,tossForce:false,fishN:0,fishAt:null,tosses:0,tossCaught:0});}
tossClear();
function tossActive(){return !!(WILD.on&&WILD.toss);}
function tossLog(D,ev){D.log.push([+D.t.toFixed(3),...ev]);}
function tossNeed(){return WILD_COLLECTION.filter(id=>!WILD.have[id]);}
// Which treat flies next. Each toss brings at most TOSS_GOAL_MAX prizes the goal still needs (so a toss helps the goal
// but never wins the round on its own); every other treat is one already collected (a spare for the pantry).
const TOSS_GOAL_MAX=2;
function tossPick(D){const have=WILD_COLLECTION.filter(id=>WILD.have[id]),pool=D.goalIds.concat(have);
 if(D.goalIds.length&&(Math.random()<.4||!have.length))return D.goalIds[Math.random()*D.goalIds.length|0];return pool[Math.random()*pool.length|0];}

function tossStart(){
 const n=Math.round(TOSS.count),play=Math.max(2,TOSS.len-2.2),grid=typeof BGM_STEP==='number'?BGM_STEP:.268,times=[];
 // a few at first, then more and faster: launch i at play*(i/n)^0.7, snapped to the music's eighth-note grid
 for(let i=0;i<n;i++){let t=Math.round(play*Math.pow(i/n,.7)/grid)*grid;if(times.length&&t<times[times.length-1]-1e-6)t=times[times.length-1]+grid*(i>n*.6?.5:1);if(i>n*.66&&i%3===0&&times.length)t=times[times.length-1]; /* pairs late on */times.push(t);}
 stopDrops();holding=false;
 WILD.toss={t:-TOSS_INTRO,phase:'intro',n,times,next:0,air:[],fx:[],caught:0,dropped:0,whiffs:0,streak:0,best:0,caughtIds:[],len:TOSS.len,speed:TOSS.speed,tapR:TOSS.tapR,
  goalIds:tossNeed().sort(()=>Math.random()-.5).slice(0,TOSS_GOAL_MAX),endT:0,applied:false,winWaiting:false,perfect:false,pantry:0,newIds:[],log:[],started:time};
 WILD.tossPending=null;WILD.tosses++;
 sfx.toss('start',1);try{navigator.vibrate&&navigator.vibrate(40);}catch(e){}
 try{diagEvent('toss','start n='+n+' len='+TOSS.len+' speed='+TOSS.speed+' r='+TOSS.tapR);}catch(e){}
 tossLog(WILD.toss,['start',n,TOSS.len,TOSS.speed,TOSS.tapR]);
}
// One treat: launched from behind the board near the cat, an arc up to its apex and down past the front of the table.
function tossLaunch(D,i){
 const prog=D.n>1?i/(D.n-1):1,id=tossPick(D),x0=200+rand(-80,80),x1=Math.max(40,Math.min(360,x0+rand(-170,170)));
 const ya=rand(190,320)+prog*rand(0,50),T=(2.2-.95*prog)*rand(.88,1.08)/D.speed,y0=TOSS_LAUNCH_Y,y1=TOSS_FLOOR+40;
 const a=Math.sqrt(2*(y0-ya)),b=Math.sqrt(2*(y1-ya)),g=(a+b)*(a+b)/(T*T),v0=Math.sqrt(2*g*(y0-ya));
 D.air.push({id,i,x0,x1,y0,g,v0,T,t:0,spin:rand(-1,1)*(3+4*prog),rot0:rand(-.4,.4),s:TOSS_W/prizeWidth(id,1),state:'air',ft:0,fx:0,fy:0});
 sfx.toss('flip',.8,prog);lunge=Math.max(lunge,.35);happyUntil=time+.6;
 tossLog(D,['flip',id,+x0.toFixed(0),+T.toFixed(2)]);
}
function tossPos(o){const t=o.t,u=Math.min(1,t/o.T);return {x:o.x0+(o.x1-o.x0)*u,y:o.y0-o.v0*t+.5*o.g*t*t,r:o.rot0+o.spin*t};}
function tossTap(e,p){
 const D=WILD.toss;if(!D||D.phase!=='play')return;
 let best=null,bd=1e9;for(const o of D.air){if(o.state!=='air'||o.t<.08)continue;const q=tossPos(o),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;best=o;}}
 if(best&&bd<=D.tapR){
  const q=tossPos(best);best.state='caught';best.ft=0;best.fx=q.x;best.fy=q.y;best.fr=q.r;D.caught++;D.streak++;D.best=Math.max(D.best,D.streak);D.caughtIds.push(best.id);
  const fresh=!WILD.have[best.id]&&WILD_COLLECTION.includes(best.id)&&!D.newIds.includes(best.id);if(fresh)D.newIds.push(best.id);
  sfx.toss('catch',1,D.streak);try{navigator.vibrate&&navigator.vibrate(18);}catch(e){}
  D.fx.push({ring:true,x:q.x,y:q.y,t:0});
  const word=fresh?'NEW!':D.streak>=10&&D.streak%5===0?'PURR-FECT!':D.streak>=5&&D.streak%5===0?'YUM!':'+1';
  D.fx.push({text:word,color:fresh?'#7dff6a':'#ffd23f',x:q.x,y:q.y-28,t:0});
  for(let j=0;j<6;j++){const a=j/6*Math.PI*2+rand(-.3,.3);D.fx.push({spark:true,x:q.x,y:q.y,vx:Math.cos(a)*rand(90,150),vy:Math.sin(a)*rand(90,150),t:0});}
  tossLog(D,['catch',best.id,+bd.toFixed(1),+best.t.toFixed(2),D.streak]);
  try{diagEvent('toss','catch '+best.id+' d='+bd.toFixed(0)+' streak='+D.streak);}catch(e){}
  return;}
 // a tap on empty air
 D.whiffs++;D.streak=0;sfx.toss('whiff',1);D.fx.push({cross:true,x:p.x,y:p.y,t:0});
 tossLog(D,['whiff',+p.x.toFixed(0),+p.y.toFixed(0),best?+bd.toFixed(1):null]);
}
function tossTick(dt,paused){
 const D=WILD.toss;if(!D||paused)return;
 WILD.lastPay=time;D.t+=dt;happyUntil=Math.max(happyUntil,time+.2);
 for(let i=D.fx.length-1;i>=0;i--){const f=D.fx[i];f.t+=dt;if(f.spark){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.9;f.vy=f.vy*.9+300*dt;}if(f.t>(f.cross?.7:f.spark?.45:f.ring?.35:.9))D.fx.splice(i,1);}
 if(D.phase==='intro'){if(D.t>=0){D.phase='play';}else return;}
 if(D.phase==='play'){
  while(D.next<D.n&&D.t>=D.times[D.next]){tossLaunch(D,D.next);D.next++;}
  for(let i=D.air.length-1;i>=0;i--){const o=D.air[i];
   if(o.state==='air'){o.t+=dt;const q=tossPos(o);
    if(o.t>.3&&q.y>=TOSS_FLOOR){o.state='gone';D.dropped++;D.streak=0;sfx.toss('drop',1);D.fx.push({cross:true,x:Math.max(24,Math.min(376,q.x)),y:TOSS_FLOOR-12,t:0,small:true});
     tossLog(D,['drop',o.id,+o.t.toFixed(2)]);}}
   else if(o.state==='caught'){o.ft+=dt;if(o.ft>=.42){o.state='bagged';tileBounceT=0;pickupLandSound();}}
   if(o.state==='gone'||o.state==='bagged')D.air.splice(i,1);}
  if(D.next>=D.n&&!D.air.length&&D.t>=Math.min(D.len,D.times[D.n-1]+.5))tossFinish(D);
  return;}
 D.endT+=dt;
 if(D.endT>=TOSS_END){WILD.toss=null;if(D.winWaiting||(WILD.got>=WILD_GOAL&&board.status==='playing')){board.status='playing';wildFinish(true);}}
}
function tossFinish(D){
 D.phase='end';D.endT=0;D.perfect=D.caught===D.n;
 // treats the goal needs tick off the collection; spares go to the pantry
 for(const id of D.caughtIds){if(WILD_COLLECTION.includes(id)&&!WILD.have[id]){WILD.have[id]=true;WILD.got++;(WILD.order||(WILD.order=[])).push(id);}else{PANTRY[id]=(PANTRY[id]||0)+1;D.pantry++;}}
 try{localStorage.setItem(PANTRY_KEY,JSON.stringify(PANTRY));}catch(e){}
 WILD.tossCaught+=D.caught;
 if(D.caught){sfx.toss('end',1,D.caught);wildConfetti(Math.min(60,10+D.caught*3));}else sfx.toss('drop',1);
 if(D.perfect){sfx.wild2('perfect',1);const x=200+rand(-60,60),y=rand(560,630);skyDrop('rain10',x,y,{dur:1,delay:.6});}
 tossLog(D,['end',D.caught,D.n,D.whiffs,D.dropped,D.best,D.perfect?1:0,D.newIds.length,D.pantry]);
 try{diagEvent('toss','end caught='+D.caught+'/'+D.n+' whiffs='+D.whiffs+' best='+D.best+(D.perfect?' perfect':'')+' new='+D.newIds.length+' pantry='+D.pantry);}catch(e){}
 TOSS_LOG.push({at:new Date().toISOString(),board:WILD.mode||(WILD.v2?'wild2':'wild'),dials:{...TOSS},events:D.log});while(TOSS_LOG.length>3)TOSS_LOG.shift();
 try{localStorage.setItem(TOSS_LOG_KEY,JSON.stringify(TOSS_LOG));}catch(e){}
}

// --- hooks (each passes straight through outside Wild 2) ---
const __tossReset=wildReset,__tossExit=wildExit,__tossFinish=wildFinish,__tossRain=wildRainCollected,__tossBonus=wildScheduleBonus,__tossLand=wildLandBonus,
 __tossTickW=wildTick,__tossPointer=wildPointer,__tossHud=drawWildHud,__tossDrawW=wildDraw,__tossDanceStart=danceStart;
wildReset=function(){const force=WILD.tossForce;const r=__tossReset();tossClear();WILD.tossForce=force;return r;};
wildExit=function(){tossClear();return __tossExit();};
// Once a toss has started, a win waits until it's finished; a loss (or EXIT) ends it at once.
wildFinish=function(win,reason){
 if(WILD.toss){if(win&&WILD.phase==='play'){WILD.toss.winWaiting=true;return;}const D=WILD.toss;WILD.toss=null;try{diagEvent('toss','cut caught='+D.caught);}catch(e){}}
 WILD.tossPending=null;return __tossFinish(win,reason);
};
// No dance break starts during a toss; it waits for the toss to end (and the other way round).
danceStart=function(){if(WILD.toss)return;return __tossDanceStart();};
const __tossWheelNow=w2StartWheelNow;w2StartWheelNow=function(){if(WILD.toss){WILD.wheelForce=true;return;}return __tossWheelNow();};
wildRainCollected=function(b,x){
 if(b.kind!=='fish')return __tossRain(b,x);
 const f=queueTreatAward(b.kind,x,b);
 if(WILD.phase==='play'&&board.status==='playing'&&!WILD.toss)WILD.tossPending={f,wait:0};
 try{diagEvent('toss','fish coin');}catch(e){}
};
wildScheduleBonus=function(){
 // About one fish coin a Wild 2 round: it replaces one bonus drop (the 3rd to 6th, never the music note's), unless a lost
 // prize needs replacing. If that one is lost off a side, a second can come later.
 if(wildFeature('toss')){
  if(WILD.fishAt==null){WILD.fishAt=3+(Math.random()*4|0);if(wildFeature('dance')&&WILD.fishAt===WILD.noteAt)WILD.fishAt++;}
  const noteDue=wildFeature('dance')&&WILD.noteN===0&&WILD.bonusN+1>=WILD.noteAt; // only where the music note exists
  if(!noteDue&&!wildMissing().length&&!WILD.toss&&((WILD.fishN===0&&WILD.bonusN+1>=WILD.fishAt)||(WILD.fishN===1&&WILD.tosses===0&&WILD.bonusN>=WILD.fishAt+2&&Math.random()<.25))){
   const y=rand(430,620),x=200+rand(-1,1)*(tableHalfAt(y)-50);
   WILD.incoming.push({kind:'fish',id:null,x,y,t:.9,t0:.9});WILD.bonusN++;WILD.fishN++;sfx.wild('whistle',1);return;}
 }
 return __tossBonus();
};
wildLandBonus=function(o){__tossLand(o);if(o.kind==='fish'&&floats.length)floats[floats.length-1].text='TREATS!';};
wildTick=function(dt){
 if(!WILD.on)return __tossTickW(dt);
 const paused=inventoryOpen||panel.style.display==='block';
 if(WILD.tossForce&&wildFeature('toss')&&WILD.phase==='play'&&board.status==='playing'&&(WILD.goT||0)>=.8&&!paused){WILD.tossForce=false;if(!WILD.toss)WILD.tossPending={f:null,wait:9};}
 if(WILD.tossPending&&!WILD.toss&&!paused){const P=WILD.tossPending;P.wait+=dt;const f=P.f;
  if(WILD.phase==='play'&&board.status==='playing'&&!WILD.dance&&!W2_YAWN&&sweepTime===0&&catquakeTime===0&&(!f||f.arrived||f.t>=f.tr+f.tm*.5||P.wait>1.2))tossStart();}
 if(!WILD.toss||WILD.phase!=='play'){if(WILD.toss&&WILD.phase!=='play')WILD.toss=null;return __tossTickW(dt);}
 // The round timer, Turbo and the bonus-drop clock pause during the toss; everything else keeps going.
 const left=WILD.left,turbo=WILD.turbo,next=WILD.nextBonus;
 __tossTickW(dt);
 if(WILD.phase==='play'){WILD.left=left;if(WILD.turbo>0)WILD.turbo=turbo;WILD.nextBonus=next;}
 if(WILD.toss)tossTick(dt,paused);
};
wildPointer=function(e,p){
 if(!WILD.on||!WILD.toss||WILD.phase!=='play'||inventoryOpen||!world)return __tossPointer(e,p);
 if(contains(wildButton(),p))return __tossPointer(e,p); // EXIT still works
 const hud=hudLayout();if(p.y>hud.settingsY-20&&p.y<hud.settingsY+12&&p.x>hud.settingsX-78&&p.x<hud.settingsX+6)return false; // Settings
 tossTap(e,p);return true; // every other tap is a catch: no coin drops during the toss
};
drawWildHud=function(hud){__tossHud(hud);if(WILD.toss){ctx.save();ctx.fillStyle='#bff7e6';ctx.fillRect(hud.left+78,hud.bannerY-6,3.5,12);ctx.fillRect(hud.left+84,hud.bannerY-6,3.5,12);ctx.restore();}};
wildDraw=function(){__tossDrawW();if(WILD.on&&WILD.toss&&!inventoryOpen)tossDraw();};

// A soft light glow behind a treat in the air, so it reads apart from the same prizes lying on the board (cached).
let TOSS_GLOW=null;
function tossGlow(){if(TOSS_GLOW)return TOSS_GLOW;const n=64,cv=document.createElement('canvas');cv.width=cv.height=n;const g=cv.getContext('2d'),gr=g.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);
 gr.addColorStop(0,'rgba(220,255,245,.85)');gr.addColorStop(.45,'rgba(120,240,210,.4)');gr.addColorStop(1,'rgba(120,240,210,0)');g.fillStyle=gr;g.fillRect(0,0,n,n);TOSS_GLOW=cv;return cv;}
// --- drawing: the treats on top of everything, the strip below the cat's chin, the words ---
function tossDraw(){
 const D=WILD.toss,Y=TOSS_HUD_Y;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 const fade=D.phase==='end'?Math.max(0,1-D.endT/.4):Math.min(1,(time-D.started)/.25);
 if(fade>0){ctx.globalAlpha=fade;
  uiRound(16,Y-20,368,40,18,'rgba(8,40,40,.72)','#5ef0c0',2);
  // caught counter (left), treats left (middle dots), streak (right)
  ctx.font='900 20px Impact, "Arial Black", system-ui';ctx.textAlign='left';ctx.fillStyle='#ffe78a';ctx.fillText('× '+D.caught,58,Y+1);
  const ic=D.caughtIds.length?D.caughtIds[D.caughtIds.length-1]:'cheese';drawPrize('item',ic,40,Y+5,22/prizeWidth(ic,1));
  const left=D.n-D.next,dots=Math.min(D.n,20);for(let i=0;i<dots;i++){const on=i<Math.round(left*dots/D.n);uiCircle(130+i*(140/Math.max(1,dots-1)),Y,3,on?'#5ef0c0':'rgba(255,255,255,.18)');}
  ctx.textAlign='right';ctx.font='bold 13px system-ui';ctx.fillStyle=D.streak>=3?'#ffd23f':'#d8fff2';ctx.fillText(D.streak>=2?'streak '+D.streak:'TAP THE TREATS',370,Y+1);ctx.textAlign='center';
  if(D.phase==='intro'){const u=Math.min(1,(D.t+TOSS_INTRO)/.3),k=(.6+.4*(1-Math.pow(1-u,3)))*(1+.04*Math.sin(time*9));ctx.save();ctx.translate(200,Y+58);ctx.scale(k,k);ctx.rotate(-.05);wildText('TREAT TOSS!',0,0,46,'#5ef0c0','#0b2a2a',8);ctx.restore();
   ctx.font='bold 14px system-ui';ctx.fillStyle='#fff';ctx.fillText('Tap treats in the air to catch them',200,Y+96);}
 }
 ctx.globalAlpha=1;
 // treats in the air and on their way to the bag
 for(const o of D.air){
  if(o.state==='air'){const q=tossPos(o),gr=tossGlow(),gw=TOSS_W*1.7;ctx.globalAlpha=Math.min(1,o.t/.2);ctx.drawImage(gr,q.x-gw/2,q.y-gw/2,gw,gw);ctx.globalAlpha=1;ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.r);drawPrize('item',o.id,0,prizeCenterLift(o.id,o.s),o.s);ctx.restore();}
  else if(o.state==='caught'){const u=Math.min(1,o.ft/.42),e=u*u*(3-2*u),tg=pickupTarget(),x=o.fx+(tg.x-o.fx)*e,y=o.fy+(tg.y-o.fy)*e-60*Math.sin(u*Math.PI),pop=u<.15?1+.35*Math.sin(u/.15*Math.PI):1,s=o.s*pop*(1-.65*e);
   ctx.save();ctx.translate(x,y);ctx.rotate(o.fr+e*6);drawPrize('item',o.id,0,prizeCenterLift(o.id,s),s);ctx.restore();}}
 // pops, words and crosses
 for(const f of D.fx){
  if(f.spark){ctx.globalAlpha=Math.max(0,1-f.t/.45);uiCircle(f.x,f.y,3.2,'#fff3b0');continue;}
  if(f.ring){const u=f.t/.35;ctx.globalAlpha=Math.max(0,1-u);ctx.strokeStyle='#fff3b0';ctx.lineWidth=4*(1-u)+1;ctx.beginPath();ctx.arc(f.x,f.y,18+38*u,0,7);ctx.stroke();continue;}
  if(f.cross){const u=f.t/.7,a=Math.max(0,1-u),r=(f.small?9:11)*(1+.25*Math.min(1,u*4));ctx.globalAlpha=a;ctx.save();ctx.translate(f.x,f.y-u*10);ctx.lineCap='round';
   ctx.strokeStyle='rgba(20,6,30,.8)';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-r,-r);ctx.lineTo(r,r);ctx.moveTo(r,-r);ctx.lineTo(-r,r);ctx.stroke();
   ctx.strokeStyle='#c9b6e6';ctx.lineWidth=3.6;ctx.stroke();ctx.restore();continue;}
  ctx.globalAlpha=Math.max(0,1-f.t/.9);ctx.font='900 '+(f.text.length>3?20:24)+'px Impact, "Arial Black", system-ui';ctx.lineWidth=4;ctx.strokeStyle='#2a0b3e';ctx.strokeText(f.text,f.x,f.y-f.t*30);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y-f.t*30);}
 ctx.globalAlpha=1;
 // the end: +N TREATS!, what they did, PERFECT!
 if(D.phase==='end'){const u=Math.min(1,D.endT/.25),out=Math.max(0,(D.endT-(TOSS_END-.35))/.35);ctx.globalAlpha=1-out;ctx.save();ctx.translate(200,Y+40);ctx.scale(.6+.5*u,.6+.5*u);ctx.rotate(-.05);
  if(D.caught)wildText('+'+D.caught+' TREATS!',0,0,50,'#ffd23f','#3a1a00',9);else wildText('ALL DROPPED!',0,0,40,'#c9b6e6','#2a0b3e',8);
  ctx.font='bold 15px system-ui';ctx.fillStyle='#fff';const parts=[];if(D.newIds.length)parts.push(D.newIds.length+' for the goal');if(D.pantry)parts.push(D.pantry+' to the pantry');if(parts.length)ctx.fillText(parts.join(' · '),0,40);
  if(D.perfect){ctx.translate(0,-62);ctx.scale(1+.05*Math.sin(D.endT*12),1+.05*Math.sin(D.endT*12));wildText('PERFECT!',0,0,40,'#7dff6a','#0c3a12',8);ctx.font='bold 13px system-ui';ctx.fillStyle='#fff';ctx.fillText('every treat! RAIN 10 coming',0,30);}
  ctx.restore();ctx.globalAlpha=1;}
 ctx.restore();
}

// --- Developer dials (Settings > Developer mode > Treat toss), saved on this phone; values go in the performance log ---
function tossDialText(k){const [,,,label,unit]=TOSS_DIALS[k],x=TOSS[k];if(k==='speed')return label+': '+x.toFixed(1)+unit;return label+': '+(+x.toFixed(2))+unit;}
function tossDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 return '<div class="set" id="toss-dev"><h3><span>Treat toss (side game)</span><span>tuning</span></h3><button id="toss-now" class="wide">Start treat toss now</button>'+
  Object.keys(TOSS_DIALS).map(k=>'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><button data-toss="'+k+'" data-dir="-1" style="'+b+'">−</button><span style="flex:1;text-align:center">'+tossDialText(k)+'</span><button data-toss="'+k+'" data-dir="1" style="'+b+'">+</button></div>').join('')+
  '<p style="margin:4px 0;font-size:13px;opacity:.8">Pantry: '+(Object.keys(PANTRY).map(k=>(WILD_PRIZE_NAMES[k]||k)+' '+PANTRY[k]).join(', ')||'empty')+'.</p>'+
  '<button id="toss-dev-reset" class="wide">Treat toss defaults</button></div>';}
function stepTossDial(k,dir){const [lo,hi,st]=TOSS_DIALS[k];TOSS[k]=Math.min(hi,Math.max(lo,Math.round((TOSS[k]+dir*st)*1000)/1000));tossSave();}
function tossStartNow(){
 if(!wildFeature('toss')){const id=WILD_MODE_ORDER.find(k=>WILD_MODES[k].features.toss);if(!id||!wildModeEnter(id))return;}
 if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();WILD.tossForce=true;wildStartCountdown();}
 else if(!WILD.toss)WILD.tossForce=true;
 panel.style.display='none';try{diagEvent('toss-tuning','start-now');}catch(e){}
}
const __tossDevHtml=wildDevHtml,__tossDevBind=wildDevBind;
wildDevHtml=function(){return __tossDevHtml()+tossDevHtml();};
wildDevBind=function(panel){__tossDevBind(panel);const box=panel.querySelector&&panel.querySelector('#toss-dev');if(!box)return;
 const reopen=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 for(const btn of box.querySelectorAll('[data-toss]'))btn.onclick=()=>{stepTossDial(btn.dataset.toss,+btn.dataset.dir);try{diagEvent('toss-tuning',btn.dataset.toss+'='+TOSS[btn.dataset.toss]);}catch(e){}reopen();};
 box.querySelector('#toss-now').onclick=tossStartNow;
 box.querySelector('#toss-dev-reset').onclick=()=>{Object.assign(TOSS,TOSS_DEFAULTS);try{localStorage.removeItem(TOSS_KEY);}catch(e){}reopen();};};
