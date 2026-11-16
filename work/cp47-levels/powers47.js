// ---------- CP-47 Powers and Mouse pounce (UAT 62; Jenny, Nov 14) ----------
// Each cat's power is earned by playing its side game perfectly (a perfect Dance break, every treat caught, the peak
// purr, a laser chase with no misses, every mouse pounced). It's stored with a count on the button beside Quake (the old
// paw-sweep slot, empty on these boards) and used with a tap, on any level, while you play that cat. Quake stays a coin
// anyone wins. Every power is big, loud and felt; the sounds are the game's existing ones (audio is CP-46's), the
// visuals are drawn in code, and approved art is only moved, never redrawn.
//  Yawn (Tuxedo): the cat stretches and its paws swipe things off the sides (the wheel's Yawn).
//  Zoomies (Orange): the pusher at double speed for 6 s, kittens zip across the board nudging coins forward.
//  Hug (Ragdoll): the Ragdoll flops over the board and blocks both side gutters for 6 s.
//  Sonic meow (Siamese): a meow that shakes the board; the pusher reaches twice as far for 5 s.
//  Tortitude (Tortoiseshell): a fiery burst shoves a big group of coins forward.
// Mouse pounce (the Tortoiseshell's side game): push the mouse coin off; toy mice scurry across the board for about 8 s;
// tap one and the mitt pounces on it (+3 coins to the bank), a tap on nothing is a miss. The bank pours down as a coin
// rain at the end; every mouse caught is PERFECT! (a RAIN 10 coin and a Tortitude).
const PGP={tuxedo:{id:'yawn',name:'YAWN',col:'#b8a6ff'},orange:{id:'zoomies',name:'ZOOMIES',col:'#ffb03a'},ragdoll:{id:'hug',name:'HUG',col:'#ff9ad8'},
 siamese:{id:'sonic',name:'SONIC MEOW',col:'#6ad8ff'},tortie:{id:'tortitude',name:'TORTITUDE',col:'#ff6a2a'}};
const PGP_CAP=9;
let PGPX=null; // the power in action: {id,t,dur,...}
function pgpCat(){return PGU.boardCat||'tuxedo';}
function pgpCount(cat){return (PG&&PG.powers&&PG.powers[cat||pgpCat()])|0;}
function pgpSideGame(){return !!(WILD.dance||WILD.toss||WILD.chase||WILD.petGame||WILD.pounce||(typeof W2_YAWN!=='undefined'&&W2_YAWN));}
function pgpReady(){return !!(pglOn()&&pgpCount()>0&&WILD.phase==='play'&&board.status==='playing'&&!PGPX&&!pgpSideGame()&&sweepTime<=0&&catquakeTime<=0);}
function pgpAward(cat,why){if(!PG)return;if(!PG.powers)PG.powers={};const n=pgpCount(cat);if(n>=PGP_CAP){return;}PG.powers[cat]=n+1;pgSave();WILD.pgpPulse=time;
 callout(PGP[cat].name+' +1!',{color:PGP[cat].col,dur:1.6});pgSfx('levelup',.8);try{diagEvent('powers','earned '+PGP[cat].id+' ('+why+') count='+(n+1));}catch(e){}}
// a perfect side game, played as this cat, earns its power
const __pgpW2=sfx.wild2;sfx.wild2=function(kind,...a){if(kind==='perfect'&&pglOn())WILD.pgpEarn=(WILD.pgpEarn|0)+1;return __pgpW2.call(this,kind,...a);};
if(typeof laserEndLog==='function'){const __pgpLaserEnd=laserEndLog;laserEndLog=function(D){if(pglOn()&&D&&!D.logged&&D.misses===0&&D.hits>=3)WILD.pgpEarn=(WILD.pgpEarn|0)+1;return __pgpLaserEnd(D);};}

// --- the button (in the paw-sweep slot) ---
function pgpButton(){return powerButtons().sweep;}
function pgpIcon(id,x,y,k,c){ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.lineCap='round';ctx.lineJoin='round';
 if(id==='yawn'){ctx.fillStyle=c;ctx.font='900 15px Impact, system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Z',-5,4);ctx.font='900 11px Impact, system-ui';ctx.fillText('Z',4,-3);ctx.font='900 8px Impact, system-ui';ctx.fillText('Z',10,-9);}
 else if(id==='zoomies'){ctx.strokeStyle=c;ctx.lineWidth=2.4;for(const yy of [-6,0,6]){ctx.beginPath();ctx.moveTo(-12,yy);ctx.lineTo(-3+Math.abs(yy)*.5,yy);ctx.stroke();}uiPaw(6,1,.32,c);}
 else if(id==='hug'){pgHeart(0,1,1.25,c);}
 else if(id==='sonic'){ctx.strokeStyle=c;ctx.lineWidth=2.4;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-7,0,5+i*5,-.8,.8);ctx.stroke();}uiCircle(-8,0,3,c);}
 else{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-13);ctx.quadraticCurveTo(10,-2,8,6);ctx.quadraticCurveTo(6,13,0,13);ctx.quadraticCurveTo(-6,13,-8,6);ctx.quadraticCurveTo(-10,-2,0,-13);ctx.fill();
  ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.moveTo(0,-2);ctx.quadraticCurveTo(5,5,3,9);ctx.quadraticCurveTo(0,12,-3,9);ctx.quadraticCurveTo(-5,5,0,-2);ctx.fill();}
 ctx.restore();}
const __pgpDrawPB=drawPowerButtons;
drawPowerButtons=function(){if(!pglOn())return __pgpDrawPB();
 const pb=powerButtons;powerButtons=function(){const r=pb();return {quake:r.quake};};try{__pgpDrawPB();}finally{powerButtons=pb;}
 const b=pgpButton(),x=b.x+b.w/2,y=b.y+b.h/2,P=PGP[pgpCat()],n=pgpCount(),on=pgpReady(),pu=WILD.pgpPulse!=null?time-WILD.pgpPulse:9,k=pu<2.5?1+.12*Math.abs(Math.sin(pu*7)):1;
 ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.globalAlpha=on||n>0?1:.65;uiCircle(0,0,21,'#3a1d50',P.col,1.6);uiCircle(0,0,17,'#5a2d74');if(PGPX)uiCircle(0,0,17,P.col);pgpIcon(P.id,0,0,1,PGPX?'#2a1040':P.col);
 if(pu<2.5){ctx.globalAlpha=Math.max(0,1-pu/2.5);ctx.strokeStyle=P.col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,21+pu*10,0,7);ctx.stroke();}
 ctx.restore();ctx.save();uiCircle(b.x+b.w-2,b.y+9,8.5,'#f6df9b','#835f2e',1);ctx.fillStyle='#243e43';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n,b.x+b.w-2,b.y+9);ctx.restore();};
const __pgpTap=powerTap;
powerTap=function(p){if(pglOn()&&contains(pgpButton(),p)){if(pgpReady())pgpUse();else if(!PGPX){pgSfx('lock');if(!pgpCount()&&WILD.phase==='play')floats.push({text:PGP[pgpCat()].name+': '+pgpHow(pgpCat()),x:200,y:hudLayout().headerBottom+40,t:0});}return true;}return __pgpTap(p);};
function pgpHow(cat){return {tuxedo:'perfect Dance break',orange:'catch every treat',ragdoll:'peak purr',siamese:'laser, no misses',tortie:'catch every mouse'}[cat];}

// --- using a power ---
function pgpUse(){const cat=pgpCat(),P=PGP[cat];PG.powers[cat]=pgpCount(cat)-1;pgSave();stopDrops();
 try{diagEvent('powers','use '+P.id+' left='+PG.powers[cat]+' level='+pglSel());}catch(e){}
 callout(P.name+'!',{color:P.col,dur:1.4});try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}
 if(P.id==='yawn'){w2StartYawn();PGPX={id:'yawn',t:0,dur:2.8};return;}
 if(P.id==='zoomies'){const base=WILD.turbo>0?WILD_TURBO_PERIOD:WILD_PUSH_PERIOD;wildSetPeriod(base/2);sfx.wild('turbo',1);
  PGPX={id:'zoomies',t:0,dur:6,kits:Array.from({length:7},(_,i)=>({d:i%2?-1:1,z:rand(330,700),t0:i*.75+rand(0,.3),v:rand(260,360),hit:new Set()}))};return;}
 if(P.id==='hug'){const len=T.FRONT-GUARD_END+40,z=(GUARD_END+T.FRONT)/2;PGPX={id:'hug',t:0,dur:6,cols:[-1,1].map(s=>world.createCollider(RAPIER.ColliderDesc.cuboid(8*M,40*M,len/2*M).setTranslation((200+s*((T.R-T.L)/2+8))*M,40*M,z*M).setFriction(.2)))};
  pgSfx('meow',1.2);pgSfx('purr',1);try{sfx.paw40('swipe',1);}catch(e){}return;}
 if(P.id==='sonic'){PGPX={id:'sonic',t:0,dur:5,next:0};shake=Math.max(shake,1.2);pgSfx('meow',1.6);try{sfx.wild('topple',1);}catch(e){}return;}
 if(P.id==='tortitude'){PGPX={id:'tortitude',t:0,dur:1.6,flames:[]};let n=0;
  for(const b of bodies){if(b.dead||b.kind==='stack')continue;const q=b.rb.translation(),z=q.z/M,x=q.x/M;if(z<PUSH_MAX||z>T.FRONT-40||Math.abs(x-200)>150)continue;
   const k=(b.kind==='coin'||b.kind==='silver'?1:b.kind==='item'?.7:.85)*b.rb.mass()*(1.6+((z-PUSH_MAX)/(T.FRONT-PUSH_MAX))*.8);b.rb.wakeUp();b.rb.applyImpulse({x:(x-200)*.002*k,y:.9*k,z:2.6*k},true);n++;}
  for(let i=0;i<46;i++)PGPX.flames.push({x:rand(60,340),z:rand(360,T.FRONT-60),t:-rand(0,.5),s:rand(.7,1.4)});
  shake=Math.max(shake,1);try{sfx.dance('roar',1);}catch(e){}try{sfx.wild('topple',1);}catch(e){}try{wildConfetti(24);}catch(e){}WILD.pgpShoved=n;return;}}
function pgpEnd(){const X=PGPX;if(!X)return;PGPX=null;
 if(X.id==='zoomies'){wildSetPeriod(WILD.turbo>0?WILD_TURBO_PERIOD:WILD_PUSH_PERIOD);}
 if(X.id==='hug'&&X.cols)for(const c of X.cols){try{world.removeCollider(c,true);}catch(e){}}}
// the pusher's reach (the build multiplies the stroke by this): twice as far during a Sonic meow
function pglReach(){return PGPX&&PGPX.id==='sonic'&&PGPX.t<PGPX.dur?2:1;}
function pgpTick(dt){
 if(WILD.pgpEarn&&!pgpSideGame()&&WILD.on){WILD.pgpEarn=0;if(pglOn())pgpAward(pgpCat(),'perfect');}
 const X=PGPX;if(!X)return;X.t+=dt;
 if(X.id==='yawn'){if(X.t>=X.dur||(!W2_YAWN&&X.t>.3))pgpEnd();return;}
 if(X.id==='zoomies'){for(const k of X.kits){const u=X.t-k.t0;if(u<0)continue;const x=k.d>0?-30+u*k.v:430-u*k.v;if(x<-40||x>440)continue;
   if(!k.snd){k.snd=1;try{sfx.laser('wind',.7);}catch(e){}}
   for(const b of bodies){if(b.dead||k.hit.has(b)||(b.kind!=='coin'&&b.kind!=='silver'&&b.kind!=='gold5'))continue;const q=b.rb.translation();if(Math.abs(q.x/M-x)<26&&Math.abs(q.z/M-k.z)<34){k.hit.add(b);const m=b.rb.mass();b.rb.wakeUp();b.rb.applyImpulse({x:k.d*.5*m,y:.4*m,z:1.4*m},true);}}}}
 if(X.id==='sonic'){shake=Math.max(shake,.35);if(X.t>=X.next){X.next+=1.25;if(X.t>.1)pgSfx('meow',1.1);}}
 if(X.t>=X.dur)pgpEnd();}
// Draws the power on the board (in the screen's own coordinates, like the side games).
function pgpDraw(){const X=PGPX;if(!X&&!WILD.pounce)return;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 if(X&&X.id==='zoomies'){for(const k of X.kits){const u=X.t-k.t0;if(u<0)continue;const x=k.d>0?-30+u*k.v:430-u*k.v;if(x<-40||x>440)continue;const p=skyScreen(x,k.z,0),s=p.s*.9;pgpKitten(p.x,p.y-10*s,s,k.d,X.t*18+k.t0*5);
   ctx.save();ctx.globalAlpha=.45;ctx.strokeStyle='#ffd08a';ctx.lineWidth=3*s;for(const dy of [-8,0,8]){ctx.beginPath();ctx.moveTo(p.x-k.d*30*s,p.y-10*s+dy*s);ctx.lineTo(p.x-k.d*70*s,p.y-10*s+dy*s);ctx.stroke();}ctx.restore();}
  const a=Math.min(1,X.t/.3,(X.dur-X.t)/.4);ctx.globalAlpha=Math.max(0,a);wildText('2× PUSHER',200,w43ChinY()+28,26,'#ffb03a','#3a1400',5);}
 if(X&&X.id==='hug'){const a=Math.min(1,X.t/.35,(X.dur-X.t)/.5),flop=1-Math.pow(1-Math.min(1,X.t/.35),3);ctx.globalAlpha=Math.max(0,a);
  for(const s of [-1,1]){const pts=[];for(let z=GUARD_END-10;z<=T.FRONT+10;z+=20){const p=skyScreen(200+s*((T.R-T.L)/2),z,0);pts.push(p);}
   ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#8f7d6e';ctx.lineWidth=34*flop;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x+s*6,p.y):ctx.moveTo(p.x+s*6,p.y));ctx.stroke();
   ctx.strokeStyle='#fbf6ee';ctx.lineWidth=20*flop;ctx.stroke();ctx.restore();
   const e=pts[pts.length-1],pw=pgArt('ragdoll','paw');if(pw){const w=74*flop,h=w*pw.height/pw.width;ctx.save();ctx.translate(e.x+s*4,e.y-6);ctx.scale(s,1);ctx.drawImage(pw,-w/2,-h/2,w,h);ctx.restore();}}
  for(let i=0;i<3;i++){const u=((X.t*.8+i/3)%1);ctx.save();ctx.globalAlpha=Math.max(0,a)*(1-u);pgHeart(200+Math.sin(i*2.1+X.t)*90,w43ChinY()+90-u*60,1.6,'#ff6ab8');ctx.restore();}
  ctx.globalAlpha=Math.max(0,a);wildText('NO SIDE FALLS',200,w43ChinY()+28,24,'#ff9ad8','#3a0b2e',5);}
 if(X&&X.id==='sonic'){const a=Math.min(1,(X.dur-X.t)/.4),cy=w43ChinY()-30;ctx.globalAlpha=Math.max(0,a);
  for(let i=0;i<4;i++){const u=((X.t*1.2+i/4)%1);ctx.save();ctx.globalAlpha=Math.max(0,a)*(1-u)*.9;ctx.strokeStyle=i%2?'#6ad8ff':'#ffffff';ctx.lineWidth=6*(1-u)+1;ctx.beginPath();ctx.ellipse(200,cy+u*260,60+u*190,(60+u*190)*.32,0,0,7);ctx.stroke();ctx.restore();}
  wildText('2× REACH',200,w43ChinY()+28,26,'#6ad8ff','#0b2a3e',5);}
 if(X&&X.id==='tortitude'){for(const f of X.flames){const u=(X.t-f.t)/1.1;if(u<0||u>1)continue;const p=skyScreen(f.x,f.z,0),s=p.s*f.s,h=(30+45*Math.sin(u*Math.PI))*s;
   ctx.save();ctx.globalAlpha=1-u*.8;const g=ctx.createLinearGradient(0,p.y-h,0,p.y);g.addColorStop(0,'rgba(255,240,120,0)');g.addColorStop(.3,'#ffd23f');g.addColorStop(.7,'#ff6a1a');g.addColorStop(1,'#c81e0a');ctx.fillStyle=g;
   ctx.beginPath();ctx.moveTo(p.x-14*s,p.y);ctx.quadraticCurveTo(p.x-18*s,p.y-h*.5,p.x+Math.sin(u*12+f.x)*6*s,p.y-h);ctx.quadraticCurveTo(p.x+18*s,p.y-h*.5,p.x+14*s,p.y);ctx.closePath();ctx.fill();ctx.restore();}
  const u=Math.min(1,X.t/.15);ctx.globalAlpha=Math.max(0,.55*(1-X.t/.6));ctx.fillStyle='#ff8a2a';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
 ctx.restore();}
function pgpKitten(x,y,s,d,ph){ctx.save();ctx.translate(x,y);ctx.scale(s*d,s);const C=PG_CAT.orange,leg=Math.sin(ph)*6;
 ctx.strokeStyle=C.fur;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-14,4);ctx.lineTo(-18-leg,16);ctx.moveTo(-6,4);ctx.lineTo(-4+leg,16);ctx.moveTo(8,4);ctx.lineTo(6-leg,16);ctx.moveTo(14,4);ctx.lineTo(18+leg,16);ctx.stroke();
 ctx.fillStyle=C.fur;ctx.beginPath();ctx.ellipse(0,0,20,11,0,0,7);ctx.fill();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,-2);ctx.quadraticCurveTo(-32,-10,-30,-22);ctx.stroke();
 ctx.beginPath();ctx.arc(20,-8,10,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(14,-14);ctx.lineTo(16,-24);ctx.lineTo(21,-16);ctx.moveTo(22,-16);ctx.lineTo(27,-23);ctx.lineTo(28,-12);ctx.fill();
 ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(24,-4,5,4,0,0,7);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(23,-10,1.8,0,7);ctx.arc(28,-9,1.6,0,7);ctx.fill();ctx.restore();}

// --- hooks: tick, draw, reset, finish ---
const __pgpTickW=wildTick;wildTick=function(dt){const r=__pgpTickW(dt);if(WILD.on&&!(inventoryOpen||panel.style.display==='block'))pgpTick(dt);return r;};
const __pgpDrawW=wildDraw;wildDraw=function(){__pgpDrawW();if(WILD.on&&!inventoryOpen)pgpDraw();};
const __pgpReset=wildReset;wildReset=function(){pgpEnd();WILD.pgpEarn=0;WILD.pgpPulse=null;return __pgpReset();};
const __pgpExit=wildExit;wildExit=function(){pgpEnd();return __pgpExit();};
const __pgpFinish=wildFinish;wildFinish=function(win,reason){const r=__pgpFinish(win,reason);if(board.status==='won'||board.status==='lost'){if(WILD.pgpEarn&&!pgpSideGame()){WILD.pgpEarn=0;if(pglOn())pgpAward(pgpCat(),'perfect');}pgpEnd();}return r;};

// ---------- Mouse pounce (the Tortoiseshell's side game) ----------
const POUNCE={len:8,count:14,tapR:44,coins:3};
const POUNCE_INTRO=.9,POUNCE_END=2.1,POUNCE_HUD_Y=468;
RAIN.mousecoin={n:0,pounce:true,r:33,half:4.4,face:['#fff0e0','#ff8a3c','#7a2a06'],edge:'#6a2406'};
EDGE.mousecoin=RAIN.mousecoin.edge;PRIZE_OPAQUE.mousecoin=.95;PRIZE_ASPECT.mousecoin=1;
const __pounceFace=rainFace;
rainFace=function(g,c,r,kind){if(!RAIN[kind]||!RAIN[kind].pounce)return __pounceFace(g,c,r,kind);
 const [c1,c2,c3]=RAIN[kind].face;let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,c1);gr.addColorStop(.5,c2);gr.addColorStop(1,c3);g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();
 g.lineWidth=r*.1;g.strokeStyle='#ffd23f';g.beginPath();g.arc(c,c,r*.86,0,7);g.stroke();
 const s=r/30;g.save();g.translate(c,c-4*s);g.fillStyle='#e8e2ee';g.strokeStyle='#4a3a52';g.lineWidth=1.6*s;g.beginPath();g.moveTo(-16*s,6*s);g.quadraticCurveTo(-8*s,-10*s,6*s,-8*s);g.quadraticCurveTo(16*s,-6*s,15*s,6*s);g.closePath();g.fill();g.stroke();
 g.fillStyle='#f6b6cf';g.beginPath();g.arc(-4*s,-9*s,4.5*s,0,7);g.fill();g.stroke();g.fillStyle='#111';g.beginPath();g.arc(-11*s,0,1.6*s,0,7);g.fill();g.strokeStyle='#4a3a52';g.beginPath();g.moveTo(15*s,4*s);g.quadraticCurveTo(22*s,0,20*s,-8*s);g.stroke();g.restore();
 g.font='bold '+Math.round(r*.19)+'px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff6d0';g.fillText('POUNCE',c,c+r*.6);};
function pounceClear(){Object.assign(WILD,{pounce:null,pouncePending:null,pounceForce:false,mouseN:0,mouseAt:null,pounces:0});}
pounceClear();
function pounceStart(){const n=POUNCE.count,play=Math.max(3,POUNCE.len-1.6),times=[];for(let i=0;i<n;i++)times.push(i>n*.6&&i%3===0&&times.length?times[times.length-1]+.05:play*Math.pow(i/n,.75)+rand(0,.12)); // a few at first, then faster, pairs late on
 stopDrops();holding=false;
 WILD.pounce={t:-POUNCE_INTRO,phase:'intro',n,times,next:0,mice:[],fx:[],slams:[],caught:0,escaped:0,whiffs:0,streak:0,bank:0,perfect:false,winWaiting:false,endT:0,started:time};
 WILD.pouncePending=null;WILD.pounces++;try{sfx.toss('start',1);}catch(e){}try{navigator.vibrate&&navigator.vibrate(40);}catch(e){}try{diagEvent('pounce','start n='+n);}catch(e){}}
function pounceLaunch(D,i){const prog=D.n>1?i/(D.n-1):1,d=Math.random()<.5?1:-1,y=rand(500,720),v=(170+240*prog)*rand(.85,1.15);
 D.mice.push({d,y,x:d>0?-34:434,v,t:0,dart:Math.random()<.35+prog*.3?rand(.3,.8):0,paused:0,state:'run',ft:0});}
function pounceTap(p){const D=WILD.pounce;if(!D||D.phase!=='play')return;
 let best=null,bd=1e9;for(const m of D.mice){if(m.state!=='run')continue;const dd=Math.hypot(m.x-p.x,(m.y-14)-p.y);if(dd<bd){bd=dd;best=m;}}
 D.slams.push({x:best&&bd<=POUNCE.tapR?best.x:p.x,y:best&&bd<=POUNCE.tapR?best.y-6:p.y,t:0});try{sfx.laser('pounce',.9);}catch(e){}
 if(best&&bd<=POUNCE.tapR){best.state='caught';best.ft=0;D.caught++;D.streak++;D.bank+=POUNCE.coins;try{sfx.toss('catch',1,D.streak);}catch(e){}try{navigator.vibrate&&navigator.vibrate(18);}catch(e){}
  D.fx.push({ring:true,x:best.x,y:best.y-10,t:0});D.fx.push({text:D.streak>=5&&D.streak%5===0?'POUNCE!':'+'+POUNCE.coins,color:'#ffd23f',x:best.x,y:best.y-40,t:0});
  for(let j=0;j<6;j++){const a=j/6*Math.PI*2;D.fx.push({spark:true,x:best.x,y:best.y-10,vx:Math.cos(a)*rand(90,150),vy:Math.sin(a)*rand(90,150),t:0});}
  try{diagEvent('pounce','catch d='+bd.toFixed(0)+' streak='+D.streak);}catch(e){}return;}
 D.whiffs++;D.streak=0;try{sfx.toss('whiff',.8);}catch(e){}try{sfx.wild43&&sfx.wild43('bonk',.9);}catch(e){}D.fx.push({cross:true,x:p.x,y:p.y,t:0});}
function pounceTick(dt,paused){const D=WILD.pounce;if(!D||paused)return;WILD.lastPay=time;D.t+=dt;
 for(let i=D.fx.length-1;i>=0;i--){const f=D.fx[i];f.t+=dt;if(f.spark){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.9;f.vy=f.vy*.9+300*dt;}if(f.t>(f.cross?.7:f.spark?.45:f.ring?.35:.9))D.fx.splice(i,1);}
 for(let i=D.slams.length-1;i>=0;i--){D.slams[i].t+=dt;if(D.slams[i].t>.45)D.slams.splice(i,1);}
 if(D.phase==='intro'){if(D.t>=0)D.phase='play';else return;}
 if(D.phase==='play'){while(D.next<D.n&&D.t>=D.times[D.next]){pounceLaunch(D,D.next);D.next++;}
  for(let i=D.mice.length-1;i>=0;i--){const m=D.mice[i];m.t+=dt;
   if(m.state==='run'){if(m.dart&&m.t>m.dart&&m.paused<.35){m.paused+=dt;}else m.x+=m.d*m.v*(m.paused>=.35&&m.dart?1.6:1)*dt;
    if(m.x<-40||m.x>440){m.state='gone';D.escaped++;D.streak=0;try{sfx.toss('drop',.8);}catch(e){}D.fx.push({cross:true,small:true,x:Math.max(24,Math.min(376,m.x)),y:m.y-10,t:0});}}
   else if(m.state==='caught'){m.ft+=dt;if(m.ft>.5)m.state='gone';}
   if(m.state==='gone')D.mice.splice(i,1);}
  if(D.next>=D.n&&!D.mice.length)pounceFinish(D);return;}
 D.endT+=dt;if(D.endT>=POUNCE_END){WILD.pounce=null;if(D.bank>0)wildStartRain(D.bank);if(D.winWaiting||(WILD.got>=WILD_GOAL&&board.status==='playing')){board.status='playing';wildFinish(true);}}}
function pounceFinish(D){D.phase='end';D.endT=0;D.perfect=D.caught===D.n;
 if(!D.bank)try{sfx.toss('drop',1);}catch(e){}
 if(D.caught)wildConfetti(Math.min(60,10+D.caught*3));
 if(D.perfect){sfx.wild2('perfect',1);skyDrop('rain10',200+rand(-60,60),rand(560,630),{dur:1,delay:.6});}
 try{diagEvent('pounce','end caught='+D.caught+'/'+D.n+' whiffs='+D.whiffs+' escaped='+D.escaped+(D.perfect?' perfect':''));}catch(e){}}
// hooks, as Treat toss does them
const __pounceReset=wildReset,__pounceExit=wildExit,__pounceFinish=wildFinish,__pounceRain=wildRainCollected,__pounceBonus=wildScheduleBonus,__pounceLand=wildLandBonus,__pounceTickW=wildTick,__pouncePointer=wildPointer,__pounceDrawW=wildDraw;
wildReset=function(){const f=WILD.pounceForce;const r=__pounceReset();pounceClear();WILD.pounceForce=f;return r;};
wildExit=function(){pounceClear();return __pounceExit();};
wildFinish=function(win,reason){if(WILD.pounce){if(win&&WILD.phase==='play'){WILD.pounce.winWaiting=true;return;}WILD.pounce=null;}WILD.pouncePending=null;return __pounceFinish(win,reason);};
wildRainCollected=function(b,x){if(b.kind!=='mousecoin')return __pounceRain(b,x);const f=queueTreatAward(b.kind,x,b);if(WILD.phase==='play'&&board.status==='playing'&&!WILD.pounce)WILD.pouncePending={f,wait:0};try{diagEvent('pounce','mouse coin');}catch(e){}};
wildScheduleBonus=function(){
 if(wildFeature('pounce')){if(WILD.mouseAt==null)WILD.mouseAt=3+(Math.random()*3|0);
  if(!wildMissing().length&&!WILD.pounce&&((WILD.mouseN===0&&WILD.bonusN+1>=WILD.mouseAt)||(WILD.mouseN===1&&WILD.pounces===0&&WILD.bonusN>=WILD.mouseAt+2&&Math.random()<.25))){
   const y=rand(430,620),x=200+rand(-1,1)*(tableHalfAt(y)-50);WILD.incoming.push({kind:'mousecoin',id:null,x,y,t:.9,t0:.9});WILD.bonusN++;WILD.mouseN++;sfx.wild('whistle',1);return;}}
 return __pounceBonus();};
wildLandBonus=function(o){__pounceLand(o);if(o.kind==='mousecoin'&&floats.length)floats[floats.length-1].text='POUNCE!';};
wildTick=function(dt){if(!WILD.on)return __pounceTickW(dt);const paused=inventoryOpen||panel.style.display==='block';
 if(WILD.pounceForce&&wildFeature('pounce')&&WILD.phase==='play'&&board.status==='playing'&&(WILD.goT||0)>=.8&&!paused){WILD.pounceForce=false;if(!WILD.pounce)WILD.pouncePending={f:null,wait:9};}
 if(WILD.pouncePending&&!WILD.pounce&&!paused){const P=WILD.pouncePending;P.wait+=dt;const f=P.f;if(WILD.phase==='play'&&board.status==='playing'&&!W2_YAWN&&!PGPX&&sweepTime===0&&catquakeTime===0&&(!f||f.arrived||f.t>=f.tr+f.tm*.5||P.wait>1.2))pounceStart();}
 if(!WILD.pounce||WILD.phase!=='play'){if(WILD.pounce&&WILD.phase!=='play')WILD.pounce=null;return __pounceTickW(dt);}
 const left=WILD.left,turbo=WILD.turbo,next=WILD.nextBonus;__pounceTickW(dt);if(WILD.phase==='play'){WILD.left=left;if(WILD.turbo>0)WILD.turbo=turbo;WILD.nextBonus=next;}
 if(WILD.pounce)pounceTick(dt,paused);};
wildPointer=function(e,p){if(!WILD.on||!WILD.pounce||WILD.phase!=='play'||inventoryOpen||!world)return __pouncePointer(e,p);if(contains(wildButton(),p))return __pouncePointer(e,p);pounceTap(p);return true;};
wildDraw=function(){__pounceDrawW();if(WILD.on&&WILD.pounce&&!inventoryOpen)pounceDraw();};
function pounceDraw(){const D=WILD.pounce,Y=POUNCE_HUD_Y;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 const fade=D.phase==='end'?Math.max(0,1-D.endT/.4):Math.min(1,(time-D.started)/.25);
 if(fade>0){ctx.globalAlpha=fade;uiRound(16,Y-20,368,40,18,'rgba(48,16,4,.75)','#ff9a4a',2);
  ctx.font='900 20px Impact, "Arial Black", system-ui';ctx.textAlign='left';ctx.fillStyle='#ffe78a';ctx.fillText('× '+D.caught,58,Y+1);drawPrize('item','mouse',40,Y+5,22/prizeWidth('mouse',1));
  const left=D.n-D.next;for(let i=0;i<D.n;i++)uiCircle(130+i*(140/Math.max(1,D.n-1)),Y,3,i<left?'#ffb27a':'rgba(255,255,255,.18)');
  ctx.textAlign='right';ctx.font='bold 13px system-ui';ctx.fillStyle=D.streak>=3?'#ffd23f':'#ffe8d8';ctx.fillText(D.streak>=2?'streak '+D.streak:'TAP THE MICE',370,Y+1);ctx.textAlign='center';
  if(D.phase==='intro'){const u=Math.min(1,(D.t+POUNCE_INTRO)/.3),k=(.6+.4*(1-Math.pow(1-u,3)))*(1+.04*Math.sin(time*9));ctx.save();ctx.translate(200,Y+58);ctx.scale(k,k);ctx.rotate(-.05);wildText('MOUSE POUNCE!',0,0,42,'#ffb27a','#3a1400',8);ctx.restore();
   ctx.font='bold 14px system-ui';ctx.fillStyle='#fff';ctx.fillText('Tap the toy mice before they get away',200,Y+96);}}
 ctx.globalAlpha=1;
 for(const m of D.mice){const s=56/prizeWidth('mouse',1);ctx.save();ctx.translate(m.x,m.y);if(m.state==='caught'){const u=Math.min(1,m.ft/.5);ctx.globalAlpha=1-u;ctx.scale(1+u*.3,1-u*.6);}else ctx.translate(0,-Math.abs(Math.sin(m.t*22))*3);
  ctx.scale(-m.d,1);ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,2,24,6,0,0,7);ctx.fill();drawPrize('item','mouse',0,prizeCenterLift('mouse',s)-8,s);ctx.restore();}
 for(const S2 of D.slams){const u=S2.t/.45,dn=Math.min(1,S2.t/.1),up=Math.max(0,(S2.t-.22)/.23),pw=ART.paw;if(!pw)continue;const w=86*(1.25-.25*dn),h=w*pw.height/pw.width,yy=S2.y-60*(1-dn)-50*up;
  ctx.save();ctx.globalAlpha=Math.max(0,1-up);ctx.translate(S2.x,yy-h*.25);ctx.drawImage(pw,-w/2,-h/2,w,h);ctx.restore();if(S2.t<.12&&S2.t+.02>.1){shake=Math.max(shake,.25);}}
 for(const f of D.fx){if(f.spark){ctx.globalAlpha=Math.max(0,1-f.t/.45);uiCircle(f.x,f.y,3.2,'#fff3b0');continue;}
  if(f.ring){const u=f.t/.35;ctx.globalAlpha=Math.max(0,1-u);ctx.strokeStyle='#fff3b0';ctx.lineWidth=4*(1-u)+1;ctx.beginPath();ctx.arc(f.x,f.y,18+38*u,0,7);ctx.stroke();continue;}
  if(f.cross){const u=f.t/.7,a=Math.max(0,1-Math.max(0,u-.4)/.6),sc=f.small?.7:1,r=13;ctx.globalAlpha=a;ctx.save();ctx.translate(f.x,f.y-u*8);ctx.scale(sc,sc);ctx.lineCap='round';ctx.strokeStyle='#2a0010';ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(-r,-r);ctx.lineTo(r,r);ctx.moveTo(r,-r);ctx.lineTo(-r,r);ctx.stroke();ctx.strokeStyle='#ff4b4b';ctx.lineWidth=7;ctx.stroke();ctx.restore();continue;}
  ctx.globalAlpha=Math.max(0,1-f.t/.9);ctx.font='900 22px Impact, "Arial Black", system-ui';ctx.lineWidth=4;ctx.strokeStyle='#2a0b3e';ctx.strokeText(f.text,f.x,f.y-f.t*30);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y-f.t*30);}
 ctx.globalAlpha=1;
 if(D.phase==='end'){const u=Math.min(1,D.endT/.25),out=Math.max(0,(D.endT-(POUNCE_END-.35))/.35);ctx.globalAlpha=1-out;ctx.save();ctx.translate(200,Y+40);ctx.scale(.6+.5*u,.6+.5*u);ctx.rotate(-.05);
  if(D.caught)wildText('+'+D.caught+' MICE!',0,0,50,'#ffd23f','#3a1a00',9);else wildText('ALL GOT AWAY!',0,0,38,'#c9b6e6','#2a0b3e',8);
  ctx.font='bold 15px system-ui';ctx.fillStyle='#fff';if(D.bank)ctx.fillText(D.bank+' coins coming down',0,40);
  if(D.perfect){ctx.translate(0,-62);ctx.scale(1+.05*Math.sin(D.endT*12),1+.05*Math.sin(D.endT*12));wildText('PERFECT!',0,0,40,'#7dff6a','#0c3a12',8);ctx.font='bold 13px system-ui';ctx.fillStyle='#fff';ctx.fillText('every mouse! RAIN 10 and a Tortitude',0,30);}
  ctx.restore();ctx.globalAlpha=1;}
 ctx.restore();}
// the mouse coin's goal-card icon
const __pounceCardIcon=w2CardIcon;w2CardIcon=function(kind,x,y){if(kind==='mousecoin'){const sp=sprite('mousecoin');ctx.drawImage(sp.cv,x-17,y-17,34,34);return;}if(kind==='mouse'){drawPrize('item','mouse',x,y+8,30/prizeWidth('mouse',1));return;}if(WILD.mode==='pounce'&&kind==='paw'){const w=34,h=w*ART.paw.height/ART.paw.width;ctx.drawImage(ART.paw,x-w/2,y-h/2,w,h);return;}if(WILD.mode==='pounce'&&kind==='perfect'){wildText('×'+POUNCE.count,x,y,18,'#7dff6a','#0c3a12',4);return;}return __pounceCardIcon(kind,x,y);};
WILD_MODES.pounce.cardLines=[['mousecoin','Push the mouse coin off','and the toy mice run!'],['mouse','Tap the mice','the mitt pounces'],['perfect','Catch every one','for a RAIN 10 and a Tortitude'],
 ['paw','Prizes topple off the sides','Tap the glow to Paw save'],['rain10','Rain coins pour','5, 10 or 25 coins'],['!','Bonus drops','fall from the sky']];
try{pgFixAllLines();}catch(e){}

// --- Developer: start a pounce now, give powers ---
const __pgpDevHtml=pgDevHtml;
pgDevHtml=function(){const h=__pgpDevHtml();const rows='<h3 style="margin-top:10px"><span>Powers (CP-47)</span><span>'+PG_CATS.map(c=>PGP[c].name.split(' ')[0].toLowerCase()+' '+pgpCount(c)).join(' · ')+'</span></h3><button id="pgp-give" class="wide">Give 3 of every power</button><button id="pgp-pounce" class="wide">Start Mouse pounce now (as the Tortoiseshell)</button>';
 return h.replace('<h3 style="margin-top:10px"><span>MODES',rows+'<h3 style="margin-top:10px"><span>MODES');};
const __pgpDevBind=wildDevBind;
wildDevBind=function(panel){__pgpDevBind(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;const re=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 const g=box.querySelector('#pgp-give');if(g)g.onclick=()=>{if(!PG)pgInit();if(!PG.powers)PG.powers={};for(const c of PG_CATS)PG.powers[c]=Math.min(PGP_CAP,pgpCount(c)+3);pgSave();re();};
 const s=box.querySelector('#pgp-pounce');if(s)s.onclick=()=>{panel.style.display='none';if(!PG)pgInit();if(!PG.open.tortie){PG.open.tortie=1;PG.openOrder.push('tortie');}if(PGU.boardCat!=='tortie'||!WILD.on)pgSwitchBoard('tortie');
  if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();PGU.screen='board';WILD.pounceForce=true;wildStartCountdown();}else if(!WILD.pounce)WILD.pounceForce=true;};};
