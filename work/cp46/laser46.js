// ---------- CP-42 Laser mode: Wild 2 with Laser chase as its side game (UAT 46) ----------
// A game mode reached from the MODES picker (under WILD! / WILD 2). It is Wild 2 (goal card with TAP TO START, timer,
// rain coins, bonus drops, towers, music, win and lose cards, the visitor) with WILD.laser set: no happy meter or dance
// break; instead a laser coin (code-drawn, a red dot) arrives as a bonus drop about once a round. Push it off and Laser
// chase starts: the round timer pauses, a red laser dot appears, the player drags it around the board, and the cat's
// mitt (the approved art, moved in code) chases it and pounces, swatting the coins and prizes under it toward the front.
// The cat's eyes follow the dot. Every pounce says what it hit (SWAT! a prize, BAP! coins, miss). At the end,
// "+N KNOCKED OFF!" counts what the paw sent over the front; anything that goes over is collected normally.
// A win waits until the chase is finished. Wild, Wild 2 and Boards 1-3 don't change.
// On a build with CP-41's mode registry (UAT 45 on), Laser mode registers there (one MODES picker for all modes) and
// WILD.laser just means "the Laser mode is on". Without it (the UAT 42 prototype), this file brings its own picker.
const LASER_REG=typeof registerWildMode==='function';
let __laserOn=false;
Object.defineProperty(WILD,'laser',{configurable:true,get(){return LASER_REG?!!(WILD.on&&WILD.mode==='laser'):__laserOn;},set(v){if(!LASER_REG)__laserOn=!!v;}});
const LASER_DEFAULTS=Object.freeze({len:9,paw:1,swat:1});
const LASER={...LASER_DEFAULTS},LASER_KEY='catpusher.uat.laser.v1',LASER_LOG_KEY='catpusher.uat.laserlog.v1';
// [min, max, step, label, unit]
const LASER_DIALS={len:[5,15,.5,'Chase length',' s'],paw:[.5,2,.1,'Paw speed','x'],swat:[.5,2,.1,'Swat strength','x']};
try{const d=JSON.parse(localStorage.getItem(LASER_KEY)||'null');if(d)for(const k in LASER_DIALS)if(Number.isFinite(+d[k]))LASER[k]=Math.min(LASER_DIALS[k][1],Math.max(LASER_DIALS[k][0],+d[k]));}catch(e){}
function laserSave(){try{localStorage.setItem(LASER_KEY,JSON.stringify(LASER));}catch(e){}}
let LASER_LOG=[];try{LASER_LOG=JSON.parse(localStorage.getItem(LASER_LOG_KEY)||'[]')||[];}catch(e){LASER_LOG=[];}
let LASER_HOP=4,LASER_PUSH=5.5,LASER_PRIZE_K=.5,LASER_FLY=.35;const LASER_INTRO=.9,LASER_END=2.4,LASER_GRACE=1.6,LASER_R=58,LASER_HUD_Y=468;
// where the pads sit relative to the mitt's drawing origin (screen units; left mitt, mirrored for the right)
const LASER_PAD={x:-6,y:34};

// --- the laser coin: same physics as the rain coins; dark with a glowing red dot ---
RAIN.laser={n:0,laser:true,r:33,half:4.4,face:['#6b6f80','#2b2d38','#101117'],edge:'#14151c'};
EDGE.laser=RAIN.laser.edge;PRIZE_OPAQUE.laser=.95;PRIZE_ASPECT.laser=1;
const __laserRainFace=rainFace;
rainFace=function(g,c,r,kind){
 if(!RAIN[kind]||!RAIN[kind].laser)return __laserRainFace(g,c,r,kind);
 const [c1,c2,c3]=RAIN[kind].face;let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,c1);gr.addColorStop(.55,c2);gr.addColorStop(1,c3);
 g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();
 g.lineWidth=r*.09;g.strokeStyle='#ff3b3b';g.beginPath();g.arc(c,c,r*.86,0,7);g.stroke();
 g.fillStyle='rgba(255,120,120,.85)';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.arc(c+Math.cos(a)*r*.72,c+Math.sin(a)*r*.72,r*.04,0,7);g.fill();}
 // the dot: a red glow, a hot core and a white centre, a little above the middle
 const dy=c-r*.1;gr=g.createRadialGradient(c,dy,0,c,dy,r*.5);gr.addColorStop(0,'rgba(255,90,90,.95)');gr.addColorStop(.45,'rgba(255,30,40,.55)');gr.addColorStop(1,'rgba(255,0,0,0)');
 g.fillStyle=gr;g.beginPath();g.arc(c,dy,r*.5,0,7);g.fill();g.fillStyle='#ff2a2a';g.beginPath();g.arc(c,dy,r*.17,0,7);g.fill();g.fillStyle='#fff2f2';g.beginPath();g.arc(c-r*.03,dy-r*.03,r*.07,0,7);g.fill();
 g.font='bold '+Math.round(r*.2)+'px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#ffd6d6';g.fillText('LASER',c,c+r*.6);
};

// --- screen <-> table ---
function laserScreen(x,y,h=0){return skyScreen(x,y,h);}
function laserWorld(sx,sy){const py=(sy-VIEW.y)/VIEW.zy;let lo=PUSH_MAX-200,hi=T.FRONT+150;for(let i=0;i<32;i++){const m=(lo+hi)/2;if(screenOf(200,m,0).y<py)lo=m;else hi=m;}const y=(lo+hi)/2,g=screenOf(200,y,0).s;return {x:200+(sx-200)/VIEW.z/g,y};} // inverse of skyScreen at table height
function laserClamp(w){const y=Math.max(PUSH_MAX+34,Math.min(T.FRONT-12,w.y)),hw=tableHalfAt(y)-12;return {x:Math.max(200-hw,Math.min(200+hw,w.x)),y};}
// the rest spot of each mitt's pads, from the game's own mittRest
function laserPadRest(side){const r=__laserMittRest(side);return {x:r.x+(side<0?LASER_PAD.x:-LASER_PAD.x),y:r.y+LASER_PAD.y};}

// --- state ---
function laserClear(){Object.assign(WILD,{chase:null,chasePending:null,chaseForce:false,laserN:0,laserAt:null,chases:0,chaseKnocked:0});}
laserClear();
function laserActive(){return !!(WILD.on&&WILD.chase);}
function laserLog(D,ev){D.log.push([+D.t.toFixed(3),...ev]);}
function laserTweaks(){if(!WILD.laser)return;WILD.noteAt=999;WILD.noteN=9;WILD.fishAt=999;WILD.fishN=9;WILD.happy=0;}

function laserStart(){
 stopDrops();holding=false;
 const paws={};for(const s of [-1,1]){const r=laserPadRest(s);paws[s]={x:r.x,y:r.y,lift:0,sq:1,out:0};}
 const dot=laserClamp({x:200,y:560});
 WILD.chase={t:-LASER_INTRO,phase:'intro',len:LASER.len,paw:LASER.paw,swat:LASER.swat,dot,touch:null,lastTouch:-9,side:1,paws,
  st:'chase',stT:0,cd:.35,sinceP:0,tx:0,ty:0,tw:null,head:{x:0,y:0,r:0},
  flying:[],flyT:0,pounces:0,hits:0,prizeHits:0,misses:0,coinHits:0,knocked:0,knockedAll:0,knockedPrizes:[],fx:[],endT:0,winWaiting:false,log:[],started:time,dotSeen:0};
 WILD.chasePending=null;WILD.chases++;
 sfx.laser('start',1);try{navigator.vibrate&&navigator.vibrate(40);}catch(e){}
 try{diagEvent('laser','start len='+LASER.len+' paw='+LASER.paw+' swat='+LASER.swat);}catch(e){}
 laserLog(WILD.chase,['start',LASER.len,LASER.paw,LASER.swat]);
}
// A touch: the dot jumps to the finger and follows it while it moves.
function laserDown(e,p){
 const D=WILD.chase;if(!D||D.phase==='end')return;
 D.touch=e&&e.pointerId!=null?e.pointerId:1;laserMoveTo(D,p,true);
}
function laserMoveTo(D,p,jump){
 const w=laserClamp(laserWorld(p.x,p.y));
 if(jump){sfx.laser('dot',.8);const q=laserScreen(w.x,w.y,0);D.fx.push({ring:true,red:true,x:q.x,y:q.y,t:0});laserLog(D,['dot',+w.x.toFixed(0),+w.y.toFixed(0)]);}
 D.dot=w;D.lastTouch=D.t;
}
function laserPointerMove(e){const D=laserActive()?WILD.chase:null;if(!D||D.touch==null||(e.pointerId!=null&&e.pointerId!==D.touch))return false;laserMoveTo(D,toGame(e),false);return true;}
function laserPointerUp(e){const D=laserActive()?WILD.chase:null;if(!D||D.touch==null||(e.pointerId!=null&&e.pointerId!==D.touch))return false;D.touch=null;return true;}

// The pounce lands: everything under the pads gets swatted toward the front, a little outward and up.
function laserImpact(D){
 const w=D.tw,s=D.swat;let coins=0,prizes=0,stacks=0;const hitIds=[];D.flying=[];D.flyT=LASER_FLY;
 const onTable=w.y>=PUSH_MAX+10&&w.y<=T.FRONT+4&&Math.abs(w.x-200)<=tableHalfAt(w.y)+6;
 if(onTable)for(const b of bodies){if(b.dead||!b.rb)continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,d=Math.hypot(x-w.x,z-w.y);if(d>LASER_R)continue;
  const k=1-.55*(d/LASER_R)*(d/LASER_R),v=b.rb.linvel(),dx=d>4?(x-w.x)/d:rand(-1,1);
  const prize=b.kind==='item',stack=b.kind==='stack',m=stack?.55:prize?LASER_PRIZE_K:1;
  b.rb.setLinvel({x:v.x+dx*rand(1.2,2.2)*k*s*m+rand(-.4,.4),y:Math.max(v.y,LASER_HOP*rand(.85,1.15)*k*Math.sqrt(s)*(stack?.5:1)),z:Math.max(v.z,0)+LASER_PUSH*rand(.85,1.15)*k*s*m},true);
  b.laserHit=WILD.chases;D.flying.push(b);
  if(prize){prizes++;hitIds.push(b.id);}else if(stack)stacks++;else coins++;}
 const q=laserScreen(w.x,w.y,0);D.pounces++;
 if(prizes){D.hits++;D.prizeHits+=prizes;D.coinHits+=coins;sfx.laser('thump',1,coins);sfx.laser('prize',1);
  D.fx.push({ring:true,gold:true,x:q.x,y:q.y,t:0});D.fx.push({text:'SWAT!',color:'#ffd23f',x:q.x,y:q.y-108,t:0,big:true});
  for(let j=0;j<8;j++){const a=j/8*Math.PI*2+rand(-.3,.3);D.fx.push({spark:true,x:q.x,y:q.y,vx:Math.cos(a)*rand(110,180),vy:Math.sin(a)*rand(90,150)-40,t:0});}
  try{navigator.vibrate&&navigator.vibrate([20,30,20]);}catch(e){}}
 else if(coins||stacks){D.hits++;D.coinHits+=coins;sfx.laser('thump',1,coins);D.fx.push({ring:true,x:q.x,y:q.y,t:0});
  D.fx.push({text:coins+stacks>=6?'BAP BAP!':'BAP!',color:'#ffffff',x:q.x,y:q.y-100,t:0});try{navigator.vibrate&&navigator.vibrate(15);}catch(e){}}
 else{D.misses++;sfx.laser('miss',1);D.fx.push({cross:true,x:q.x,y:q.y-6,t:0});D.fx.push({text:'miss',color:'#c9b6e6',x:q.x,y:q.y-96,t:0});}
 for(let j=0;j<6;j++)D.fx.push({dust:true,x:q.x+rand(-14,14),y:q.y+rand(-4,6),vx:rand(-70,70),vy:rand(-50,-10),t:0});
 laserLog(D,['pounce',+w.x.toFixed(0),+w.y.toFixed(0),coins,prizes,stacks,hitIds.join('+')]);
 try{diagEvent('laser','pounce coins='+coins+' prizes='+prizes+(stacks?' tower':''));}catch(e){}
}
function laserTick(dt,paused){
 const D=WILD.chase;if(!D||paused)return;
 WILD.lastPay=time;D.t+=dt;if(D.flyT>0){D.flyT-=dt;if(D.flyT<=0)D.flying=[];}
 for(let i=D.fx.length-1;i>=0;i--){const f=D.fx[i];f.t+=dt;if(f.spark||f.dust){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.9;f.vy=f.vy*.9+(f.dust?60:300)*dt;}
  if(f.t>(f.cross?.7:f.spark?.5:f.dust?.5:f.ring?.4:.9))D.fx.splice(i,1);}
 const dq=laserScreen(D.dot.x,D.dot.y,0);
 // the eyes follow the dot (the game's own pupils), the head leans a little toward it
 if(typeof aim==='object'&&aim){aim.lookX=D.phase==='end'?200:D.dot.x;}
 const hx=D.phase==='end'?0:(dq.x-200)*.045,hy=D.phase==='end'?0:Math.max(-2,Math.min(6,(dq.y-560)*.02)),hr=D.phase==='end'?0:(dq.x-200)*.00045,e=Math.min(1,dt*6);
 D.head.x+=(hx-D.head.x)*e;D.head.y+=(hy-D.head.y)*e;D.head.r+=(hr-D.head.r)*e;
 // which mitt chases: the one on the dot's side (with a little give in the middle)
 if(D.st==='chase'&&D.phase!=='end'){if(D.dot.x<185)D.side=-1;else if(D.dot.x>215)D.side=1;}
 const sp=D.paw;
 for(const s of [-1,1]){const P=D.paws[s];
  if(s!==D.side||D.phase==='end'||D.phase==='intro'){const r=laserPadRest(s),k=Math.min(1,dt*7);P.x+=(r.x-P.x)*k;P.y+=(r.y-P.y)*k;P.lift+=(0-P.lift)*k;P.sq+=(1-P.sq)*k;P.out=Math.hypot(P.x-r.x,P.y-r.y)>1.5?1:0;}}
 if(D.phase==='intro'){if(D.t>=0){D.phase='play';laserLog(D,['play']);}return;}
 if(D.phase==='play'){
  const P=D.paws[D.side];P.out=1;D.stT+=dt;D.sinceP+=dt;D.cd-=dt*sp;
  if(D.st==='chase'){
   const dx=dq.x-P.x,dy=dq.y-P.y,dist=Math.hypot(dx,dy),vmax=760*sp,v=Math.min(vmax,dist*9*sp);
   if(dist>.5){P.x+=dx/dist*Math.min(dist,v*dt);P.y+=dy/dist*Math.min(dist,v*dt);}
   P.lift+=(1-P.lift)*Math.min(1,dt*8);P.sq+=(1.04-P.sq)*Math.min(1,dt*8);
   if(D.cd<=0&&(dist<30||(D.sinceP>1.4/sp&&dist<110))){D.st='wind';D.stT=0;D.tw={...D.dot};D.tx=dq.x;D.ty=dq.y;D.wx=P.x;D.wy=P.y;sfx.laser('wind',.9);}
  }else if(D.st==='wind'){ // the wiggle: up a bit higher, over the spot it's locked on to
   const u=Math.min(1,D.stT/(.2/sp));P.x=D.wx+(D.tx-D.wx)*u+Math.sin(D.stT*70)*2.5;P.y=D.wy+(D.ty-D.wy)*u;P.lift=1+.7*u;P.sq=1.04+.06*u;
   if(D.stT>=.2/sp){D.st='strike';D.stT=0;sfx.laser('pounce',.9);}
  }else if(D.st==='strike'){const u=Math.min(1,D.stT/.075);P.x=D.tx;P.y=D.ty;P.lift=1.7*(1-u);P.sq=1.1-.16*u;
   if(u>=1){D.st='hold';D.stT=0;laserImpact(D);}
  }else if(D.st==='hold'){P.lift=0;P.sq+=(1-P.sq)*Math.min(1,dt*10);
   if(D.stT>=.16){D.st='chase';D.stT=0;D.cd=.42;D.sinceP=0;}}
  if(D.t>=D.len-LASER_INTRO&&(D.st==='chase'||D.st==='hold')){laserFinish(D);}
  return;}
 D.endT+=dt;
 if(D.endT>=LASER_END){WILD.chase=null;if(typeof aim==='object'&&aim)aim.lookX=200;
  if(D.winWaiting||(WILD.got>=WILD_GOAL&&board.status==='playing')){board.status='playing';wildFinish(true);}}
}
function laserFinish(D){
 D.phase='end';D.endT=0;D.touch=null;
 laserLog(D,['stop',D.pounces,D.hits,D.prizeHits,D.misses]);
 try{diagEvent('laser','stop pounces='+D.pounces+' hits='+D.hits+' prizes='+D.prizeHits+' misses='+D.misses);}catch(e){}
}
// counted while the chase runs and for a short while after the paw stops (what it hit is still sliding)
function laserCounting(){const D=WILD.chase;return !!(D&&(D.phase==='play'||(D.phase==='end'&&D.endT<LASER_GRACE)));}
function laserEndLog(D){
 if(D.logged)return;D.logged=true;WILD.chaseKnocked+=D.knocked;
 laserLog(D,['end',D.knocked,D.knockedAll,D.pounces,D.hits,D.prizeHits,D.misses,D.knockedPrizes.join('+')]);
 try{diagEvent('laser','end knocked='+D.knocked+' all='+D.knockedAll+' pounces='+D.pounces+' prizes='+D.prizeHits);}catch(e){}
 LASER_LOG.push({at:new Date().toISOString(),board:'laser',dials:{...LASER},events:D.log});while(LASER_LOG.length>3)LASER_LOG.shift();
 try{localStorage.setItem(LASER_LOG_KEY,JSON.stringify(LASER_LOG));}catch(e){}
}

// --- hooks (each passes straight through outside Laser mode) ---
const __laserMittRest=mittRest,__laserFall=fallOff,__laserReset=wildReset,__laserExit=wildExit,__laserFinish=wildFinish,__laserRain=wildRainCollected,
 __laserBonus=wildScheduleBonus,__laserLand=wildLandBonus,__laserTickW=wildTick,__laserPointer=wildPointer,__laserHud=drawWildHud,__laserDrawW=wildDraw,
 __laserDanceStart=danceStart,__laserDanceFill=danceFill,__laserCard=drawWild2Card,__laserCardIcon=w2CardIcon,__laserButton=drawWildButton;
// The game caps coin speeds every step (soft landings); what the paw just swatted flies free for LASER_FLY s.
const __laserDamp=dampCoinImpacts;
dampCoinImpacts=function(){const D=WILD.on&&WILD.chase;if(!D||!D.flying.length)return __laserDamp();const keep=[];for(const b of D.flying)if(!b.dead&&b.rb)keep.push([b,b.rb.linvel()]);__laserDamp();for(const [b,v] of keep)b.rb.setLinvel(v,true);};
// a mitt that's out chasing is drawn by the chase, on top of the board
mittRest=function(side){const D=WILD.on&&WILD.chase;if(D&&D.paws[side]&&D.paws[side].out)return {x:-9999,y:-9999};return __laserMittRest(side);};
fallOff=function(b,x){
 if(laserCounting()){const D=WILD.chase;D.knockedAll++;
  if(b.laserHit===WILD.chases){D.knocked++;if(b.kind==='item')D.knockedPrizes.push(b.id);sfx.laser('over',.8,D.knocked);
   const p=proj(x,T.FRONT),sx=200+(p.x-200)*VIEW.z,sy=VIEW.y+p.y*VIEW.zy;D.fx.push({text:'+1',color:'#ff8a8a',x:sx,y:sy-18,t:0});}
  laserLog(D,['over',b.kind,b.id||'',b.laserHit===WILD.chases?1:0]);}
 return __laserFall(b,x);
};
function laserEnter(){if(LASER_REG){if(!wildModeEnter('laser'))return false;}else{if(WILD.on)wildExit();if(!wild2Enter())return false;WILD.laser=true;}laserTweaks();try{diagEvent('laser','enter');}catch(e){}return true;}
wildReset=function(){const force=WILD.chaseForce;const r=__laserReset();laserClear();WILD.chaseForce=force;laserTweaks();return r;};
wildExit=function(){laserClear();WILD.laser=false;LASER_MODES.open=false;return __laserExit();};
// Once a chase has started, a win waits until it's finished; a loss (or EXIT) ends it at once.
wildFinish=function(win,reason){
 if(WILD.chase){if(win&&WILD.phase==='play'){WILD.chase.winWaiting=true;return;}const D=WILD.chase;laserEndLog(D);WILD.chase=null;try{diagEvent('laser','cut knocked='+D.knocked);}catch(e){}}
 WILD.chasePending=null;return __laserFinish(win,reason);
};
// Laser mode has no happy meter or dance break; Laser chase is its side game.
danceStart=function(){if(WILD.laser||WILD.chase)return;return __laserDanceStart();};
danceFill=function(n,x){if(WILD.laser)return;return __laserDanceFill(n,x);};
wildRainCollected=function(b,x){
 if(b.kind!=='laser')return __laserRain(b,x);
 const f=queueTreatAward(b.kind,x,b);
 if(WILD.phase==='play'&&board.status==='playing'&&!WILD.chase)WILD.chasePending={f,wait:0};
 try{diagEvent('laser','laser coin');}catch(e){}
};
wildScheduleBonus=function(){
 // About one laser coin a round: it replaces the 2nd bonus drop and lands near the front, unless a lost prize needs replacing. If that one
 // is lost off a side, a second can come later.
 if(WILD.laser){
  if(WILD.laserAt==null)WILD.laserAt=2;
  if(!wildMissing().length&&!WILD.chase&&((WILD.laserN===0&&WILD.bonusN+1>=WILD.laserAt)||(WILD.laserN===1&&WILD.chases===0&&WILD.bonusN>=WILD.laserAt+2&&Math.random()<.35))){
   const y=rand(625,690),x=200+rand(-1,1)*(tableHalfAt(y)-70); // near the front: it should go over within a few pushes
   WILD.incoming.push({kind:'laser',id:null,x,y,t:.9,t0:.9});WILD.bonusN++;WILD.laserN++;sfx.wild('whistle',1);return;}
 }
 return __laserBonus();
};
wildLandBonus=function(o){__laserLand(o);if(o.kind==='laser'&&floats.length)floats[floats.length-1].text='LASER!';};
wildTick=function(dt){
 if(!WILD.on)return __laserTickW(dt);
 const paused=inventoryOpen||panel.style.display==='block';
 if(WILD.chaseForce&&WILD.laser&&WILD.phase==='play'&&board.status==='playing'&&(WILD.goT||0)>=.8&&!paused){WILD.chaseForce=false;if(!WILD.chase)WILD.chasePending={f:null,wait:9};}
 if(WILD.chasePending&&!WILD.chase&&!paused){const P=WILD.chasePending;P.wait+=dt;const f=P.f;
  if(WILD.phase==='play'&&board.status==='playing'&&!WILD.dance&&!WILD.toss&&!W2_YAWN&&!(typeof PAW40_STATE==='object'&&PAW40_STATE&&PAW40_STATE.swipe)&&sweepTime===0&&catquakeTime===0&&(!f||f.arrived||f.t>=f.tr+f.tm*.5||P.wait>1.2))laserStart();}
 if(!WILD.chase||WILD.phase!=='play'){if(WILD.chase&&WILD.phase!=='play'){laserEndLog(WILD.chase);WILD.chase=null;}return __laserTickW(dt);}
 // The round timer, Turbo and the bonus-drop clock pause during the chase; everything else keeps going.
 const left=WILD.left,turbo=WILD.turbo,next=WILD.nextBonus;
 __laserTickW(dt);
 if(WILD.phase==='play'){WILD.left=left;if(WILD.turbo>0)WILD.turbo=turbo;WILD.nextBonus=next;}
 if(WILD.chase){const D=WILD.chase;laserTick(dt,paused);if(D.phase==='end'&&D.endT>=LASER_GRACE)laserEndLog(D);if(!WILD.chase)laserEndLog(D);}
};
wildPointer=function(e,p){
 if(!LASER_REG&&!WILD.on&&world&&!inventoryOpen){if(LASER_MODES.open){laserModesTap(p);return true;}if(contains(laserModesButton(),p)){LASER_MODES.open=true;LASER_MODES.t=0;sfx.wild('beep',1);return true;}}
 if(!WILD.on||!WILD.chase||WILD.phase!=='play'||inventoryOpen||!world)return __laserPointer(e,p);
 if(contains(wildButton(),p))return __laserPointer(e,p); // EXIT still works
 const hud=hudLayout();if(p.y>hud.settingsY-20&&p.y<hud.settingsY+12&&p.x>hud.settingsX-78&&p.x<hud.settingsX+6)return false; // Settings
 laserDown(e,p);return true; // every other touch moves the dot: no coin drops during the chase
};
// The banner (where Wild 2 shows the happy meter): the chase's time left and what it has knocked off.
drawWildHud=function(hud){
 __laserHud(hud);if(!WILD.laser)return;const D=WILD.chase,x0=W-Math.max(8,hud.right+10)-124,y=hud.bannerY,w=124;
 ctx.save();ctx.textBaseline='middle';ctx.textAlign='left';
 if(D){ctx.fillStyle='#ff9a9a';ctx.fillRect(hud.left+78,y-6,3.5,12);ctx.fillRect(hud.left+84,y-6,3.5,12); // the round timer's pause mark
  const left=D.phase==='intro'?1:D.phase==='play'?Math.max(0,1-(D.t)/(D.len-LASER_INTRO)):0;
  uiRound(x0,y-7,w-34,14,7,'rgba(40,6,10,.85)','#ff8a8a',1.2);uiRound(x0+2,y-5,Math.max(0,(w-38)*left),10,5,'#ff3b3b');
  ctx.font='900 15px Impact, "Arial Black", system-ui';ctx.fillStyle='#ffe0e0';ctx.fillText('×'+D.knocked,x0+w-30,y+1);}
 else{laserDotGlyph(x0+12,y,6,1);ctx.font='bold 11px system-ui';ctx.fillStyle='#ffc8c8';ctx.fillText(WILD.chases?'LASER ×'+WILD.chaseKnocked:'LASER COIN SOON',x0+24,y+1,100);}
 ctx.restore();
};
wildDraw=function(){__laserDrawW();if(WILD.on&&WILD.chase&&!inventoryOpen)laserDraw();};

// --- the goal card: Wild 2's card with Laser mode's title and lines ---
const LASER_CARD_LINES=[['laser','A laser coin falls in','push it off: LASER CHASE!'],['drag','Drag the red dot','and the cat pounces on it'],['paw','Pounce near the front','to swat prizes off the edge'],
 ['visitor','Win','and a cat comes to visit'],['rain10','Rain coins pour','5, 10 or 25 coins'],['!','Bonus drops','fall from the sky']];
drawWild2Card=function(){
 if(!WILD.laser||LASER_REG)return __laserCard(); // with the registry, the card reads the mode's name and lines
 const keep=W2_CARD_LINES.splice(0,W2_CARD_LINES.length,...LASER_CARD_LINES),wt=wildText;
 wildText=function(t,x,y,size,fill,stroke,lw){if(t==='WILD 2')return wt('LASER',x,y,size,'#ff5a5a','#300a0e',lw);return wt(t,x,y,size,fill,stroke,lw);};
 try{__laserCard();}finally{wildText=wt;W2_CARD_LINES.splice(0,W2_CARD_LINES.length,...keep);}
};
function laserCardIcon(kind,x,y){
 if(kind==='laser'){const sp=sprite('laser');ctx.drawImage(sp.cv,x-17,y-17,34,34);return;}
 if(kind==='drag'){ctx.strokeStyle='rgba(255,90,90,.55)';ctx.lineWidth=3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x-20,y+10);ctx.quadraticCurveTo(x-6,y-14,x+12,y);ctx.stroke();ctx.setLineDash([]);laserDotGlyph(x+12,y,7,1);return;}
 if(kind==='paw'){ctx.save();ctx.translate(x,y+2);ctx.rotate(-.12);drawRestMitt(46);ctx.restore();return;}
}
w2CardIcon=function(kind,x,y){if(!LASER_REG&&WILD.laser&&(kind==='laser'||kind==='drag'||kind==='paw'))return laserCardIcon(kind,x,y);return __laserCardIcon(kind,x,y);};

// --- the MODES picker: under WILD! and WILD 2, outside a round. Other modes can add themselves to GAME_MODES. ---
const LASER_MODES={open:false,t:0};
const GAME_MODES=[{id:'laser',name:'LASER CHASE',sub:'Drag the laser, the cat pounces',color:'#ff5a5a',icon:(x,y)=>{const sp=sprite('laser');ctx.drawImage(sp.cv,x-20,y-20,40,40);},enter:laserEnter}];
if(LASER_REG)registerWildMode({id:'laser',name:'LASER CHASE',blurb:'Drag the laser dot: the cat pounces',colors:['#ff5a5a','#300a0e','#3a1420'],panel:['#5a1428','#1c0610'],
 features:{laser:true},cardLines:LASER_CARD_LINES,icon:(x,y)=>{const sp=sprite('laser');ctx.drawImage(sp.cv,x-24,y-24,48,48);},
 cardIcon:(kind,x,y)=>{if(kind==='laser'||kind==='drag'||kind==='paw'){laserCardIcon(kind,x,y);return true;}return false;}});
function laserModesButton(){const h=hudLayout();return {x:W/2+60,y:h.mainY+21,w:88,h:20};}
function laserModesLayout(){const n=GAME_MODES.length,row=64,h=70+n*row+44,y=Math.max(hudLayout().headerBottom+330,Math.min(H-h-90,430));return {card:{x:24,y,w:352,h},row,rows:GAME_MODES.map((m,i)=>({x:36,y:y+56+i*row,w:328,h:row-8,m})),close:{x:140,y:y+h-38,w:120,h:28}};}
function laserModesTap(p){const L=laserModesLayout();for(const r of L.rows)if(contains(r,p)){LASER_MODES.open=false;sfx.wild('beep',1);r.m.enter();return;}LASER_MODES.open=false;}
function laserDotGlyph(x,y,r,a){const g=ctx.createRadialGradient(x,y,0,x,y,r*2.6);g.addColorStop(0,'rgba(255,60,60,'+(.75*a)+')');g.addColorStop(1,'rgba(255,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*2.6,0,7);ctx.fill();
 uiCircle(x,y,r,'rgba(255,40,40,'+a+')');uiCircle(x-r*.15,y-r*.15,r*.42,'rgba(255,240,240,'+a+')');}
drawWildButton=function(){
 __laserButton();if(LASER_REG||inventoryOpen||WILD.on)return;
 const b=laserModesButton(),pulse=.5+.5*Math.sin(performance.now()/300+.8);ctx.save();
 uiRound(b.x,b.y,b.w,b.h,10,'rgba(48,10,20,.92)','rgba(255,120,120,'+(.5+.4*pulse)+')',1.6);laserDotGlyph(b.x+12,b.y+b.h/2,4,1);
 ctx.fillStyle='#ffe2e2';ctx.font='900 12px Impact, "Arial Black", system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('MODES ▾',b.x+b.w/2+7,b.y+b.h/2+1);
 if(LASER_MODES.open){LASER_MODES.t+=1/60;const L=laserModesLayout(),R=L.card,k=.85+.15*Math.min(1,LASER_MODES.t/.15);
  ctx.fillStyle='rgba(8,4,16,.45)';ctx.fillRect(0,R.y-20,W,R.h+40);ctx.translate(200,R.y+R.h/2);ctx.scale(k,k);ctx.translate(-200,-(R.y+R.h/2));
  wildPanel(R,'#3a0f22','#160610');wildText('GAME MODES',200,R.y+28,28,'#ffd23f','#2a0b10',6);
  for(const r of L.rows){uiRound(r.x,r.y,r.w,r.h,14,'rgba(255,255,255,.08)',r.m.color,2);r.m.icon(r.x+34,r.y+r.h/2);
   ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='900 20px Impact, "Arial Black", system-ui';ctx.fillText(r.m.name,r.x+66,r.y+r.h/2-9,180);
   ctx.font='bold 13px system-ui';ctx.fillStyle='#ffe0e0';ctx.fillText(r.m.sub,r.x+66,r.y+r.h/2+12,190);
   wildButtonDraw({x:r.x+r.w-70,y:r.y+r.h/2-15,w:60,h:30},'PLAY','#3ccf4e','#0c3a12',16);ctx.textAlign='center';}
  uiRound(L.close.x,L.close.y,L.close.w,L.close.h,14,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Close',200,L.close.y+L.close.h/2+1);}
 ctx.restore();
};

// --- drawing: the dot, the chasing mitt, the words ---
function laserDrawMitt(D,s){
 const P=D.paws[s],sh=P.lift>0?P.lift:0;
 // a soft shadow on the table under a lifted mitt (bigger and fainter the higher it is)
 if(D.phase!=='end'||P.out){ctx.save();ctx.globalAlpha=.32*Math.min(1,.4+sh)/(1+sh*.4);ctx.fillStyle='#0a0410';ctx.beginPath();ctx.ellipse(P.x,P.y+6,30+sh*8,11+sh*3,0,0,7);ctx.fill();ctx.restore();}
 const ox=s<0?LASER_PAD.x:-LASER_PAD.x,lift=-16*sh;
 ctx.save();ctx.translate(P.x-ox,P.y-LASER_PAD.y+lift);if(s>0)ctx.scale(-1,1);ctx.rotate(MITT_TURN+(D.st==='strike'||D.st==='hold'?.06:0));ctx.scale(P.sq,P.sq*(D.st==='hold'?.97:1));drawRestMitt(MITT_W);ctx.restore();
}
function laserDraw(){
 const D=WILD.chase;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 const dq=laserScreen(D.dot.x,D.dot.y,0),dotA=D.phase==='end'?Math.max(0,1-D.endT/.3):Math.min(1,(time-D.started)/.2);
 // the dot under the mitt: drawn first, then again on top of the mitt (a laser shines on the paw too)
 if(dotA>0)laserDotGlyph(dq.x+Math.sin(time*31)*.6,dq.y+Math.cos(time*27)*.6,6.5,dotA*(.85+.15*Math.sin(time*40)));
 for(const s of [-1,1])if(D.paws[s].out)laserDrawMitt(D,s);
 if(dotA>0)laserDotGlyph(dq.x,dq.y,5,dotA*.8);
 for(const f of D.fx){
  if(f.spark){ctx.globalAlpha=Math.max(0,1-f.t/.5);uiCircle(f.x,f.y,3.4,'#fff3b0');continue;}
  if(f.dust){ctx.globalAlpha=Math.max(0,.6*(1-f.t/.5));uiCircle(f.x,f.y,4+f.t*10,'rgba(230,220,200,.7)');continue;}
  if(f.ring){const u=f.t/.4;ctx.globalAlpha=Math.max(0,1-u);ctx.strokeStyle=f.gold?'#ffd23f':f.red?'#ff5a5a':'#fff3e0';ctx.lineWidth=(f.gold?6:4)*(1-u)+1;ctx.beginPath();ctx.ellipse(f.x,f.y,(f.red?8:24)+(f.red?22:46)*u,((f.red?8:24)+(f.red?22:46)*u)*.55,0,0,7);ctx.stroke();continue;}
  if(f.cross){const u=f.t/.7,a=Math.max(0,1-u),r=10*(1+.25*Math.min(1,u*4));ctx.globalAlpha=a;ctx.save();ctx.translate(f.x,f.y-u*10);ctx.lineCap='round';
   ctx.strokeStyle='rgba(20,6,30,.8)';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-r,-r);ctx.lineTo(r,r);ctx.moveTo(r,-r);ctx.lineTo(-r,r);ctx.stroke();ctx.strokeStyle='#c9b6e6';ctx.lineWidth=3.6;ctx.stroke();ctx.restore();continue;}
  const pop=f.t<.12?1+.4*Math.sin(f.t/.12*Math.PI):1;ctx.globalAlpha=Math.max(0,1-f.t/.9);ctx.save();ctx.translate(f.x,f.y-f.t*34);ctx.scale(pop,pop);
  ctx.font='900 '+(f.big?30:f.text.length>2?22:20)+'px Impact, "Arial Black", system-ui';ctx.lineWidth=5;ctx.lineJoin='round';ctx.strokeStyle='#2a0b10';ctx.strokeText(f.text,0,0);ctx.fillStyle=f.color;ctx.fillText(f.text,0,0);ctx.restore();}
 ctx.globalAlpha=1;
 const Y=LASER_HUD_Y;
 if(D.phase==='intro'){const u=Math.min(1,(D.t+LASER_INTRO)/.3),k=(.6+.4*(1-Math.pow(1-u,3)))*(1+.04*Math.sin(time*9));ctx.save();ctx.translate(200,Y+20);ctx.scale(k,k);ctx.rotate(-.05);wildText('LASER CHASE!',0,0,44,'#ff5a5a','#300a0e',8);ctx.restore();
  ctx.font='bold 16px system-ui';ctx.lineWidth=4;ctx.strokeStyle='rgba(20,4,8,.8)';ctx.strokeText('Drag the red dot. The cat pounces!',200,Y+60);ctx.fillStyle='#fff';ctx.fillText('Drag the red dot. The cat pounces!',200,Y+60);}
 else if(D.phase==='play'&&D.lastTouch<-1&&D.t>.4){ctx.globalAlpha=.6+.4*Math.sin(time*6);ctx.font='bold 16px system-ui';ctx.lineWidth=4;ctx.strokeStyle='rgba(20,4,8,.8)';ctx.strokeText('Drag the dot!',dq.x,dq.y+34);ctx.fillStyle='#ffd6d6';ctx.fillText('Drag the dot!',dq.x,dq.y+34);ctx.globalAlpha=1;}
 if(D.phase==='end'){const u=Math.min(1,D.endT/.25),out=Math.max(0,(D.endT-(LASER_END-.35))/.35);ctx.globalAlpha=1-out;ctx.save();ctx.translate(200,Y+20);ctx.scale(.6+.5*u,.6+.5*u);ctx.rotate(-.05);
  if(D.knocked)wildText('+'+D.knocked+' KNOCKED OFF!',0,0,D.knocked>=10?40:44,'#ffd23f','#3a1a00',9);else wildText('NOTHING FELL!',0,0,40,'#c9b6e6','#2a0b3e',8);
  ctx.font='bold 15px system-ui';ctx.fillStyle='#fff';ctx.lineWidth=4;ctx.strokeStyle='rgba(20,4,8,.8)';
  const parts=[D.pounces+' pounce'+(D.pounces===1?'':'s')];if(D.prizeHits)parts.push(D.prizeHits+' prize swat'+(D.prizeHits===1?'':'s'));if(D.knockedPrizes.length)parts.push(D.knockedPrizes.length+' prize'+(D.knockedPrizes.length===1?'':'s')+' off');
  const line=parts.join(' · ');ctx.strokeText(line,0,40);ctx.fillText(line,0,40);ctx.restore();ctx.globalAlpha=1;
  if(!D.endSound&&D.endT>=LASER_GRACE*.6){D.endSound=true;if(D.knocked){sfx.laser('end',1,D.knocked);wildConfetti(Math.min(60,10+D.knocked*3));}else sfx.laser('none',1);}}
 ctx.restore();
}
// the head leans toward the dot while the chase runs (used by the cat drawing)
function laserHead(){const D=WILD.on&&WILD.chase;return D?D.head:null;}

// --- Developer dials (Settings > Developer mode > Laser chase), saved on this phone; values go in the performance log ---
function laserDialText(k){const [,,,label,unit]=LASER_DIALS[k],x=LASER[k];if(k!=='len')return label+': '+x.toFixed(1)+unit;return label+': '+(+x.toFixed(2))+unit;}
function laserDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 return '<div class="set" id="laser-dev"><h3><span>Laser chase (Laser mode)</span><span>tuning</span></h3><button id="laser-now" class="wide">Start laser chase now</button>'+
  Object.keys(LASER_DIALS).map(k=>'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><button data-laser="'+k+'" data-dir="-1" style="'+b+'">−</button><span style="flex:1;text-align:center">'+laserDialText(k)+'</span><button data-laser="'+k+'" data-dir="1" style="'+b+'">+</button></div>').join('')+
  '<button id="laser-dev-reset" class="wide">Laser chase defaults</button></div>';}
function stepLaserDial(k,dir){const [lo,hi,st]=LASER_DIALS[k];LASER[k]=Math.min(hi,Math.max(lo,Math.round((LASER[k]+dir*st)*1000)/1000));laserSave();}
function laserStartNow(){
 if(!WILD.on||!WILD.laser)laserEnter();
 if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();WILD.chaseForce=true;wildStartCountdown();}
 else if(!WILD.chase)WILD.chaseForce=true;
 panel.style.display='none';try{diagEvent('laser-tuning','start-now');}catch(e){}
}
const __laserDevHtml=wildDevHtml,__laserDevBind=wildDevBind;
wildDevHtml=function(){return __laserDevHtml()+laserDevHtml();};
wildDevBind=function(panel){__laserDevBind(panel);const box=panel.querySelector&&panel.querySelector('#laser-dev');if(!box)return;
 const reopen=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 for(const btn of box.querySelectorAll('[data-laser]'))btn.onclick=()=>{stepLaserDial(btn.dataset.laser,+btn.dataset.dir);try{diagEvent('laser-tuning',btn.dataset.laser+'='+LASER[btn.dataset.laser]);}catch(e){}reopen();};
 box.querySelector('#laser-now').onclick=laserStartNow;
 box.querySelector('#laser-dev-reset').onclick=()=>{Object.assign(LASER,LASER_DEFAULTS);try{localStorage.removeItem(LASER_KEY);}catch(e){}reopen();};};
