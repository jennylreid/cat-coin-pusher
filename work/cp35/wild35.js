// ---------- CP-35 Wild board prototype (UAT 35) ----------
// A separate, timed board reached from the WILD button in the header. Goal card, countdown, timer, rain coins (5/10/25)
// that pour that many free coins onto the board, extra code-drawn prizes, bonus drops from the sky, toppling towers,
// a Turbo pusher, lots of generated sounds, and a win or Time's up screen. Nothing here changes Boards 1-3:
// while the Wild board is on, the normal board's save is left alone (save() is skipped) and the purse is set aside,
// then both come back exactly on the way out. Approved art (cat, mitts, coins, Quake coin, treats, pusher) is used as is.
var WILD={on:false,phase:'off',left:0,got:0,stash:null,nextBonus:0,incoming:[],rains:[],rainLeft:0,rainTimer:0,rainGap:.1,
 turbo:0,turboDone:false,lastSec:99,count:0,endT:0,win:false,danced:false,confetti:[],cardT:0,runs:0,best:null,toppled:0,rained:0,bonusN:0,have:{},lastPay:0,reason:''};
var WILD_SECONDS=60,WILD_COINS=110; // Developer dials (Settings > Wild board) can change both; saved on this phone
const WILD_COLLECTION=['cheese','shrimp','tuna','yarn','duck','mouse','bell'],WILD_GOAL=WILD_COLLECTION.length,WILD_OUT_SEC=6,WILD_TURBO_AT=25,WILD_TURBO_SEC=8,WILD_PUSH_PERIOD=3.2,WILD_TURBO_PERIOD=1.5;
const WILD_BOARD=Object.freeze({id:'wild',name:'Wild board',seed:3535,coins:0,seconds:WILD_SECONDS,targets:[],towers:[]});
// Rain coins: big code-drawn coins with their number; physics like a heavy coin.
const RAIN={rain5:{n:5,r:31,half:4.2,face:['#e9fff6','#4fe0b0','#0d7a5c'],edge:'#0f6d55'},
 rain10:{n:10,r:34,half:4.4,face:['#fff0ff','#e070ff','#7a1aa0'],edge:'#6c1890'},
 rain25:{n:25,r:38,half:4.6,face:['#fff6d8','#ff7a3c','#a3200f'],edge:'#9a2410'}};
const WILD_PRIZES=['yarn','duck','mouse','bell']; // new code-drawn prizes; the approved treats are used as they are
const WILD_PRIZE_NAMES={yarn:'Yarn ball',duck:'Rubber duck',mouse:'Toy mouse',bell:'Cat bell',cheese:'Cheese',shrimp:'Shrimp',tuna:'Tuna'};
for(const k in RAIN){EDGE[k]=RAIN[k].edge;PRIZE_OPAQUE[k]=1;PRIZE_ASPECT[k]=1;}
for(const id of WILD_PRIZES){PRIZE_OPAQUE[id]=.86;PRIZE_ASPECT[id]=1;}
function wildPlaying(){return !!(WILD&&WILD.on);}

// --- sizes, sprites and drawing for the new pieces (existing kinds pass straight through) ---
const __wildRadius=radius,__wildHalf=halfOf,__wildSprite=sprite,__wildDrawPrize=drawPrize,__wildContactSolid=contactSolid;
radius=function(kind){return RAIN[kind]?RAIN[kind].r:__wildRadius(kind);};
halfOf=function(kind){return RAIN[kind]?RAIN[kind].half:__wildHalf(kind);};
contactSolid=function(b){return __wildContactSolid(b)||!!RAIN[b.kind];};
function rainFace(g,c,r,kind){
 const R=RAIN[kind],[c1,c2,c3]=R.face;
 let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,c1);gr.addColorStop(.55,c2);gr.addColorStop(1,c3);
 g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();
 g.lineWidth=r*.1;g.strokeStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(c,c,r*.86,0,7);g.stroke();
 // little raindrops round the ring
 g.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<10;i++){const a=i/10*Math.PI*2,x=c+Math.cos(a)*r*.72,y=c+Math.sin(a)*r*.72;g.beginPath();g.moveTo(x,y-r*.07);g.quadraticCurveTo(x+r*.05,y+r*.02,x,y+r*.05);g.quadraticCurveTo(x-r*.05,y+r*.02,x,y-r*.07);g.fill();}
 const txt=String(R.n);g.font='900 '+Math.round(r*(txt.length>1?.78:.95))+'px Impact, "Arial Black", system-ui';g.textAlign='center';g.textBaseline='middle';
 g.lineJoin='round';g.lineWidth=r*.16;g.strokeStyle=c3;g.strokeText(txt,c,c+r*.04);g.fillStyle='#fffbe8';g.fillText(txt,c,c+r*.04);
 g.font='bold '+Math.round(r*.2)+'px system-ui';g.fillStyle='#fffbe8';g.fillText('RAIN',c,c+r*.56);
}
sprite=function(kind,id){
 if(RAIN[kind]){const key='wild:'+kind;if(!sprites[key])sprites[key]=makeSprite(RAIN[kind].r,(g,c,r)=>rainFace(g,c,r,kind));return sprites[key];}
 return __wildSprite(kind,id);
};
const WILD_ART={};
function wildPrizeArt(id){
 if(WILD_ART[id])return WILD_ART[id];
 const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d');WILD_ART[id]=cv;
 const shadow=()=>{g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(64,112,40,9,0,0,7);g.fill();};
 g.lineJoin='round';g.lineCap='round';
 if(id==='yarn'){shadow();let gr=g.createRadialGradient(52,50,6,64,64,46);gr.addColorStop(0,'#ffc2e0');gr.addColorStop(1,'#e04c98');g.fillStyle=gr;g.beginPath();g.arc(64,64,44,0,7);g.fill();
  g.strokeStyle='rgba(140,20,80,.55)';g.lineWidth=3;for(let i=-3;i<=3;i++){g.beginPath();g.ellipse(64,64,44,Math.abs(i)*11+4,i*.5,0,7);g.stroke();}
  g.strokeStyle='#e04c98';g.lineWidth=5;g.beginPath();g.moveTo(100,90);g.bezierCurveTo(118,100,104,118,122,122);g.stroke();}
 else if(id==='duck'){shadow();g.fillStyle='#ffd21f';g.strokeStyle='#c98a00';g.lineWidth=3;g.beginPath();g.ellipse(66,84,40,26,0,0,7);g.fill();g.stroke();
  g.beginPath();g.arc(52,48,24,0,7);g.fill();g.stroke();g.fillStyle='#ff8a1f';g.beginPath();g.moveTo(26,48);g.quadraticCurveTo(14,52,24,58);g.quadraticCurveTo(32,58,32,52);g.closePath();g.fill();
  g.fillStyle='#222';g.beginPath();g.arc(46,42,4,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(47,41,1.4,0,7);g.fill();
  g.strokeStyle='#e6a800';g.lineWidth=4;g.beginPath();g.moveTo(70,82);g.quadraticCurveTo(84,72,96,84);g.stroke();}
 else if(id==='mouse'){shadow();g.strokeStyle='#8a7d8f';g.lineWidth=4;g.beginPath();g.moveTo(104,90);g.bezierCurveTo(124,80,118,58,104,60);g.stroke();
  g.fillStyle='#b9b0c0';g.strokeStyle='#6f6577';g.lineWidth=3;g.beginPath();g.moveTo(14,92);g.quadraticCurveTo(30,44,74,50);g.quadraticCurveTo(110,58,106,92);g.closePath();g.fill();g.stroke();
  g.fillStyle='#f3b6cf';g.beginPath();g.arc(52,46,14,0,7);g.fill();g.stroke();g.fillStyle='#ff6aa0';g.beginPath();g.arc(14,90,5,0,7);g.fill();
  g.fillStyle='#2a2230';g.beginPath();g.arc(34,72,4,0,7);g.fill();g.strokeStyle='#5d5466';g.lineWidth=1.5;for(const d of [-4,0,4]){g.beginPath();g.moveTo(16,88+d*.3);g.lineTo(2,84+d);g.stroke();}}
 else if(id==='bell'){shadow();g.strokeStyle='#d33';g.lineWidth=7;g.beginPath();g.arc(64,30,16,Math.PI,0);g.stroke();
  let gr=g.createRadialGradient(50,52,4,64,66,44);gr.addColorStop(0,'#fff4b8');gr.addColorStop(.5,'#f5c632');gr.addColorStop(1,'#a8740c');g.fillStyle=gr;g.beginPath();g.arc(64,68,40,0,7);g.fill();
  g.strokeStyle='#8a5c00';g.lineWidth=3;g.beginPath();g.moveTo(26,62);g.lineTo(102,62);g.stroke();g.fillStyle='#5a3a00';g.beginPath();g.arc(64,84,7,0,7);g.fill();g.fillRect(62,84,4,18);}
 return cv;
}
drawPrize=function(kind,id,x,y,s){
 if(RAIN[id]){const sp=sprite(id),d=radius('item')*s*2.8*.95;ctx.drawImage(sp.cv,x-d/2*sp.half/RAIN[id].r,y-d*.2-d/2*sp.half/RAIN[id].r,d*sp.half/RAIN[id].r,d*sp.half/RAIN[id].r);return;}
 if(WILD_PRIZES.includes(id)){const size=radius('item')*s*2.8;ctx.drawImage(wildPrizeArt(id),x-size/2,y-size*.7,size,size);return;}
 return __wildDrawPrize(kind,id,x,y,s);
};

// --- the board ---
function wildPrefill(){
 // Same ordered start rows as Boards 1-3, then towers, prizes, rain coins and a Quake coin on top.
 const d=COIN_R*2+1,START_CLEAR=20,towers=[{x:140,y:430,n:10},{x:260,y:430,n:12}];
 for(let y=PUSH_MAX+COIN_R+2;y+COIN_R<=T.FRONT-START_CLEAR;y+=d){
  const n=Math.floor(2*Math.min(tableHalfAt(y-COIN_R),tableHalfAt(y+COIN_R))/d);
  for(let i=0;i<n;i++){const x=200+(i-(n-1)/2)*d;if(towers.some(t=>Math.hypot(t.x-x,t.y-y)<COIN_R*1.6))continue;addCoin(seededRandom()<.25?'silver':'coin',null,x,COIN_HALF+.2,y,yawTurn(0));}
 }
 for(const t of towers){const b=addStack(t.x,null,t.y,null,t.n,null,seededRandom()*6);b.limit=5+seededRandom()*6;} // CP-35: topple after a short shove
 const top=COIN_HALF*2+halfOf('item')+1;
 const prizes=[['tuna',200,625],['cheese',108,595],['shrimp',292,600],['yarn',90,500],['duck',310,505],['mouse',96,670],['bell',304,672]];
 for(const [id,x,y] of prizes){const b=addCoin('item',id,x,top,y,yawTurn(0));b.wild=true;}
 addCoin('rain10',null,200,COIN_HALF*2+RAIN.rain10.half+1,700,yawTurn(seededRandom()*6)).rb.enableCcd(true);
 addCoin('rain5',null,200,COIN_HALF*2+RAIN.rain5.half+1,440,yawTurn(seededRandom()*6)).rb.enableCcd(true);
 addCoin('quake',null,150,COIN_HALF*2+halfOf('quake')+1,540,yawTurn(0));
}
function wildReset(){
 PUSH_PERIOD=WILD_PUSH_PERIOD;S.coins=WILD_COINS;BOARD=WILD_BOARD;resetBoard();
 board.sweeps=0;board.quakes=0;board.remaining=S.coins;
 Object.assign(WILD,{phase:'card',left:WILD_SECONDS,got:0,have:{},lastPay:0,reason:'',nextBonus:5,incoming:[],rains:[],rainLeft:0,rainTimer:0,turbo:0,turboDone:false,lastSec:99,count:0,endT:0,win:false,danced:false,cardT:0,toppled:0,rained:0,bonusN:0});
}
function wildEnter(){
 if(WILD.on)return false;
 stopDrops();cancelCollectionDrag();save(); // the normal board, as it is now
 WILD.stash={coins:S.coins,lastRegen:S.lastRegen,boardIndex};WILD.on=true;wildReset();
 try{diagEvent('wild','enter');}catch(e){}
 sfx.wild('bonus',1);return true;
}
function wildStartCountdown(){WILD.phase='count';WILD.count=3;WILD.lastSec=4;}
function wildExit(){
 if(!WILD.on)return false;
 const dev=S.dev,st=WILD.stash;WILD.on=false;WILD.phase='off';PUSH_PERIOD=WILD_PUSH_PERIOD;stopDrops();
 S.coins=st.coins;S.lastRegen=st.lastRegen;boardIndex=st.boardIndex;BOARD=BOARDS[boardIndex];
 load(); // back to the normal board exactly as saved on the way in
 S.dev=dev;save();try{diagEvent('wild','exit');}catch(e){}
 return true;
}
function wildFinish(win,reason){
 if(board.status==='won'||board.status==='lost')return;
 board.status=win?'won':'lost';board.endReason=win?'wild-goal':(reason||'time');WILD.reason=win?'':(reason||'time');stopDrops();holding=false;taps=[];pendingDrops=[];
 WILD.phase='end';WILD.win=win;WILD.endT=0;WILD.incoming=[];WILD.rainLeft=0;WILD.rains=[];
 if(WILD.turbo>0){WILD.turbo=0;wildSetPeriod(WILD_PUSH_PERIOD);}
 WILD.runs++;if(win&&(WILD.best==null||WILD.left>WILD.best))WILD.best=WILD.left;
 sfx.wild(win?'win':'lose',1);
 if(win)wildConfetti(90);
 try{diagEvent('wild',win?'win':WILD.reason);}catch(e){}
}
function wildSetPeriod(p){pushPhase=pushPhase*p/PUSH_PERIOD;PUSH_PERIOD=p;} // keeps the pusher where it is
function wildPrizeCollected(b,x){
 // Each prize of the collection counts once; a repeat pays 5 coins into the Wild bank instead.
 queueTreatAward(b.id,x,b);const p=proj(x,T.FRONT),fresh=WILD_COLLECTION.includes(b.id)&&!WILD.have[b.id];
 if(fresh){WILD.have[b.id]=true;WILD.got++;floats.push({text:WILD.got>=WILD_GOAL?'COLLECTION!':WILD.got+' / '+WILD_GOAL,x:p.x,y:p.y-10,t:0,big:true});}
 else{S.coins+=5;board.remaining=S.coins;floats.push({text:'REPEAT +5 COINS',x:p.x,y:p.y-10,t:0});}
 if(WILD.got>=WILD_GOAL)wildFinish(true);
}
// Needed prizes that are nowhere on the board or on their way (lost off a side): the next bonus drop brings one.
function wildMissing(){return WILD_COLLECTION.filter(id=>!WILD.have[id]&&!bodies.some(b=>!b.dead&&b.kind==='item'&&b.id===id)&&!WILD.incoming.some(o=>o.id===id));}
function wildRainCollected(b,x){
 const f=queueTreatAward(b.kind,x,b),n=RAIN[b.kind].n;
 WILD.rains.push({f,n,wait:0});
}
function wildStartRain(n){
 WILD.rainLeft+=n;WILD.rained+=n;WILD.rainGap=n>=25?.085:n>=10?.1:.12;WILD.rainTimer=0;
 callout('COIN RAIN ×'+n+'!',{color:n>=25?'#ff8a3c':n>=10?'#e88aff':'#5ef0c0',dur:1.3});sfx.wild('rain',1);
 if(n>=25)wildConfetti(30);
}
function wildSpawnRainCoin(){
 const y=rand(PUSH_MAX+30,T.FRONT-150),x=200+rand(-1,1)*(tableHalfAt(y)-COIN_R-6),h=rand(240,330);
 const b=addCoin(Math.random()<.25?'silver':'coin',null,x,h,y,randomTurn(rand(.05,.4)),{x:0,y:-2,z:0},{x:rand(-2,2),y:rand(-4,4),z:rand(-2,2)});
 b.rb.enableCcd(true);b.deliveryStartHeight=h;b.rain=true;sfx.wild('drip',1);
}
function wildScheduleBonus(){
 // A bonus falls by itself: a marker and a falling whistle first, then it drops out of the sky.
 const miss=wildMissing(),r=Math.random(),pick=miss.length?'prize':r<.3?'rain5':r<.5?'rain10':r<.58?'rain25':r<.7?'quake':'prize';
 const need=WILD_COLLECTION.filter(id=>!WILD.have[id]),id=pick!=='prize'?null:miss.length?miss[0]:need.length&&Math.random()<.5?need[Math.random()*need.length|0]:WILD_COLLECTION[Math.random()*WILD_GOAL|0];
 const y=rand(430,650),x=200+rand(-1,1)*(tableHalfAt(y)-50);
 WILD.incoming.push({kind:pick==='prize'?'item':pick,id,x,y,t:.9,t0:.9});WILD.bonusN++;sfx.wild('whistle',1);
}
function wildLandBonus(o){
 const h=o.kind==='item'?300:320,half=halfOf(o.kind);
 const b=addCoin(o.kind,o.id,o.x,h,o.y,o.kind==='item'?yawTurn(0):randomTurn(rand(.05,.3)),{x:0,y:-4,z:0},{x:0,y:o.kind==='item'?0:rand(-3,3),z:0});
 b.rb.enableCcd(true);b.deliveryStartHeight=h;b.wildBonus=true;b.wildLandAt=time;
 if(o.kind==='item')b.wild=true;
 const p=screenOf(o.x,o.y,0);rings.push({x:p.x,y:p.y,t:0,s:p.s});
 if(o.kind==='quake'||RAIN[o.kind]||o.kind==='item')floats.push({text:o.kind==='item'?'BONUS PRIZE!':o.kind==='quake'?'BONUS QUAKE!':'BONUS RAIN!',x:p.x,y:p.y-30,t:0,big:true});
 sfx.wild('thud',1);
}
function wildConfetti(n){
 for(let i=0;i<n;i++)WILD.confetti.push({x:rand(10,390),y:rand(-120,-10),vx:rand(-40,40),vy:rand(80,260),a:rand(0,6),va:rand(-8,8),r:rand(5,10),c:['#ffd23f','#ffe78a','#ff7ad5','#7df0ff','#a6ff6a','#ffb23f'][i%6],t:0,gold:Math.random()<.5});
 if(WILD.confetti.length>220)WILD.confetti.splice(0,WILD.confetti.length-220);
}
function wildBoardTick(dt){board.remaining=S.coins;}
function wildTick(dt){
 if(!WILD.on)return;
 for(let i=WILD.confetti.length-1;i>=0;i--){const c=WILD.confetti[i];c.t+=dt;c.vy+=220*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.a+=c.va*dt;if(c.y>H+20)WILD.confetti.splice(i,1);}
 WILD.cardT+=dt;
 const paused=inventoryOpen||panel.style.display==='block';if(paused)return;
 if(WILD.phase==='count'){
  WILD.count-=dt;const sec=Math.ceil(WILD.count);
  if(sec<WILD.lastSec&&sec>0){WILD.lastSec=sec;sfx.wild('beep',1);}
  if(WILD.count<=0){WILD.phase='play';board.status='playing';sfx.wild('go',1);WILD.goT=0;}
  return;
 }
 if(WILD.phase==='end'){
  WILD.endT+=dt;
  if(WILD.win&&!WILD.danced&&sweepTime===0&&catquakeTime===0&&WILD.endT>.6){WILD.danced=true;previewDancingPose();}
  if(WILD.win&&WILD.endT<6&&Math.random()<dt*6)wildConfetti(3);
  return;
 }
 if(WILD.phase!=='play'||board.status!=='playing')return;
 WILD.goT=(WILD.goT||0)+dt;
 WILD.left=Math.max(0,WILD.left-dt);
 const sec=Math.ceil(WILD.left);
 if(sec!==WILD.lastSec){WILD.lastSec=sec;if(sec<=10&&sec>0){sfx.wild(sec<=5?'tickHi':'tick',1);if(sec===10)callout('10 SECONDS!',{color:'#ff6a6a',dur:1});}}
 if(WILD.left<=5&&WILD.left>0&&(WILD.left%1)<.5&&((WILD.left+dt)%1)>=.5)sfx.wild('tock',1); // second tick each second at the end
 if(WILD.left<=0){wildFinish(false,'time');return;}
 // Out of coins: empty bank, nothing raining or falling in, no Quake to use, and nothing paid at the front for WILD_OUT_SEC.
 if(S.coins>0||WILD.rainLeft>0||WILD.rains.length||WILD.incoming.length||board.earnedQuakes>0||catquakeTime>0)WILD.lastPay=Math.max(WILD.lastPay,time);
 if(time-WILD.lastPay>=WILD_OUT_SEC){wildFinish(false,'coins');return;}
 if(WILD.nextBonus>2&&wildMissing().length)WILD.nextBonus=2;
 // Turbo pusher, once, 30 s from the end.
 if(!WILD.turboDone&&WILD.left<=WILD_TURBO_AT){WILD.turboDone=true;WILD.turbo=WILD_TURBO_SEC;wildSetPeriod(WILD_TURBO_PERIOD);callout('TURBO PUSHER!',{color:'#ff6ad5',dur:1.3});sfx.wild('turbo',1);}
 if(WILD.turbo>0){WILD.turbo-=dt;if(WILD.turbo<=0){WILD.turbo=0;wildSetPeriod(WILD_PUSH_PERIOD);}}
 // Bonus drops every 6-9 s.
 WILD.nextBonus-=dt;if(WILD.nextBonus<=0){WILD.nextBonus=rand(6,9);wildScheduleBonus();}
 for(let i=WILD.incoming.length-1;i>=0;i--){const o=WILD.incoming[i];o.t-=dt;if(o.t<=0){WILD.incoming.splice(i,1);wildLandBonus(o);}}
 // Rain starts once its coin is held up big (the CP-33 moment), or after 2.5 s at most.
 for(let i=WILD.rains.length-1;i>=0;i--){const r=WILD.rains[i];r.wait+=dt;const f=r.f;
  if(!f||f.arrived||f.t>=f.tr+f.tm*.6||r.wait>2.5){WILD.rains.splice(i,1);wildStartRain(r.n);}}
 if(WILD.rainLeft>0){WILD.rainTimer-=dt;while(WILD.rainTimer<=0&&WILD.rainLeft>0){WILD.rainLeft--;WILD.rainTimer+=WILD.rainGap;wildSpawnRainCoin();}}
}

// --- hooks into the game (each passes straight through when the Wild board is off) ---
const __wildFallOff=fallOff,__wildBreakStack=breakStack,__wildUpdate=update,__wildDraw=draw;
fallOff=function(b,x){
 if(!WILD.on||b.dead)return __wildFallOff(b,x);
 const z=b.rb.translation().z/M,side=Math.abs(x-200)>(T.R-T.L)/2-2;
 const rescue=!side&&z<T.FRONT-30;
 if(rescue||side||!(b.kind==='item'||RAIN[b.kind])){
  if(!rescue&&!side&&(b.kind==='coin'||b.kind==='silver')&&b.rain&&Math.random()<.3)sfx.wild('drip',.6);
  if(!rescue&&!side)WILD.lastPay=time;
  return __wildFallOff(b,x); // coins pay into the Wild bank; the Quake coin flies to its button as usual
 }
 if(board.status!=='playing'){removeCoin(b);return;}
 WILD.lastPay=time;
 if(b.kind==='item')wildPrizeCollected(b,x);else wildRainCollected(b,x);
 removeCoin(b);
};
breakStack=function(b){const r=__wildBreakStack(b);if(WILD.on){WILD.toppled++;sfx.wild('topple',1);}return r;};
update=function(dt){__wildUpdate(dt);wildTick(dt);};
draw=function(){__wildDraw();if(WILD.on&&!inventoryOpen)wildDraw();};

// --- HUD pieces ---
function wildButton(){const h=hudLayout();return {x:W/2+60,y:h.mainY-15,w:50,h:30};}
function drawWildButton(){
 if(inventoryOpen)return;const b=wildButton(),on=WILD.on,pulse=on?0:.5+.5*Math.sin(performance.now()/260);
 ctx.save();const g=ctx.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);
 if(on){g.addColorStop(0,'#4a2a5a');g.addColorStop(1,'#2a1838');}else{g.addColorStop(0,'#ff4fd8');g.addColorStop(.5,'#ffb23f');g.addColorStop(1,'#4fe0ff');}
 uiRound(b.x,b.y,b.w,b.h,15,g,on?'#c9a7e8':'rgba(255,255,255,'+(.55+.45*pulse)+')',on?1:2);
 ctx.fillStyle=on?'#f4ecff':'#2a0f3a';ctx.font=on?'bold 12px system-ui':'900 14px Impact, "Arial Black", system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillText(on?'EXIT':'WILD!',b.x+b.w/2,b.y+b.h/2+1);ctx.restore();
}
function wildClock(){const s=Math.ceil(WILD.left);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function drawWildHud(hud){
 // Timer where the purse countdown usually is, prize progress where the target list usually is.
 const low=WILD.left<=10&&WILD.phase==='play';ctx.save();ctx.textBaseline='middle';ctx.textAlign='left';
 ctx.font='bold 17px system-ui';ctx.fillStyle=low?(Math.sin(performance.now()/90)>0?'#ff5050':'#ffd0d0'):'#fff';
 uiCircle(hud.left+19,hud.bannerY,6.5,null,ctx.fillStyle,1.8);ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(hud.left+19,hud.bannerY-4);ctx.lineTo(hud.left+19,hud.bannerY);ctx.lineTo(hud.left+22,hud.bannerY+2);ctx.stroke();ctx.fillText(wildClock(),hud.left+31,hud.bannerY);
 if(WILD.turbo>0){ctx.font='bold 12px system-ui';ctx.fillStyle='#ff9ae8';ctx.fillText('TURBO '+Math.ceil(WILD.turbo),hud.left+92,hud.bannerY);}
 const bottom=hud.bottomY;ctx.font='bold 12px system-ui';ctx.fillStyle='#fff0d0';ctx.fillText('Collection '+WILD.got+' / '+WILD_GOAL,hud.left+14,bottom+5);
 WILD_COLLECTION.forEach((id,i)=>{const x=hud.left+24+(i%4)*24,y=bottom+22+(i/4|0)*22;wildIcon(id,x,y,20,!!WILD.have[id]);});
 ctx.restore();
}
function wildIcon(id,x,y,w,got){ctx.save();ctx.globalAlpha=got?1:.32;drawPrize('item',id,x,y+w*.3,w/(radius('item')*2.8));ctx.restore();if(got){const cx=x+w*.42,cy=y+w*.3;uiCircle(cx,cy,5,'#7dff6a','#1f6a18',1);ctx.strokeStyle='#0c3a12';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx-2.5,cy);ctx.lineTo(cx-.5,cy+2);ctx.lineTo(cx+2.8,cy-2.2);ctx.stroke();}}
function wildMessage(){return S.coins===0&&WILD.phase==='play'?(board.earnedQuakes>0?'Use your Quake!':'Out of coins!'):WILD.phase==='card'?'Read the goal':WILD.phase==='count'?'Get ready…':WILD.phase==='end'?(WILD.win?'You won!':WILD.reason==='coins'?'Out of coins':"Time's up"):'Collect all '+WILD_GOAL+'!';}

// --- overlays: goal card, countdown, last seconds, end screens, confetti ---
function wildCardRects(){const cy=H*.47;return {card:{x:30,y:cy-175,w:340,h:350},go:{x:110,y:cy+78,w:180,h:58},back:{x:140,y:cy+142,w:120,h:28}};}
function wildEndRects(){const cy=H*.5;return {card:{x:30,y:cy-120,w:340,h:270},again:{x:70,y:cy+16,w:260,h:52},back:{x:110,y:cy+110,w:180,h:30}};}
function wildText(t,x,y,size,fill,stroke,lw){ctx.font='italic 900 '+size+'px Impact, "Arial Black", system-ui';ctx.lineJoin='round';if(stroke){ctx.lineWidth=lw||size*.16;ctx.strokeStyle=stroke;ctx.strokeText(t,x,y);}ctx.fillStyle=fill;ctx.fillText(t,x,y);}
function wildPanel(r,top,bottom){const g=ctx.createLinearGradient(0,r.y,0,r.y+r.h);g.addColorStop(0,top);g.addColorStop(1,bottom);uiRound(r.x,r.y,r.w,r.h,22,g,'#ffe08a',3);}
function wildButtonDraw(r,label,fill,text,size){uiRound(r.x,r.y+4,r.w,r.h,r.h/2,'rgba(0,0,0,.35)');uiRound(r.x,r.y,r.w,r.h,r.h/2,fill,'#fff6d0',2);ctx.fillStyle=text;ctx.font='900 '+size+'px Impact, "Arial Black", system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,r.x+r.w/2,r.y+r.h/2+1);}
function wildDraw(){
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 // incoming bonus markers on the board
 if(WILD.incoming.length){ctx.save();ctx.translate(200,VIEW.y);ctx.scale(VIEW.z,VIEW.zy);ctx.translate(-200,0);
  for(const o of WILD.incoming){const p=screenOf(o.x,o.y,0),u=1-o.t/o.t0,pulse=.5+.5*Math.sin(performance.now()/60);
   ctx.globalAlpha=.5+.5*pulse;ctx.strokeStyle=o.kind==='item'?'#7dff6a':o.kind==='quake'?'#7db8ff':'#ff7ad5';ctx.lineWidth=3;
   const rr=(46-u*22)*p.s;ctx.beginPath();ctx.ellipse(p.x,p.y,rr,rr*SQUASH,0,0,7);ctx.stroke();
   ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.font='900 '+Math.round(26*p.s)+'px Impact, system-ui';ctx.fillText('!',p.x,p.y-4);}
  ctx.restore();}
 // big countdown in the last 10 seconds
 if(WILD.phase==='play'&&WILD.left<=10){const s=Math.ceil(WILD.left),k=1+.25*(1-(WILD.left%1));ctx.save();ctx.globalAlpha=.55;ctx.translate(200,H*.3);ctx.scale(k,k);wildText(String(s),0,0,110,'#ff4b4b','#2a0010',10);ctx.restore();}
 for(const c of WILD.confetti){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);if(c.gold){ctx.scale(Math.cos(c.a*1.7),1);uiCircle(0,0,c.r,'#f5c632','#a8740c',1.2);uiCircle(0,0,c.r*.55,'#ffe78a');}else{ctx.fillStyle=c.c;ctx.fillRect(-c.r*.6,-c.r*.3,c.r*1.2,c.r*.6);}ctx.restore();}
 if(WILD.phase==='card'){
  const R=wildCardRects(),pop=Math.min(1,WILD.cardT/.25),k=.7+.3*(1-Math.pow(1-pop,3));
  ctx.fillStyle='rgba(12,6,24,'+(.62*pop)+')';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(200,H*.47);ctx.scale(k,k);ctx.translate(-200,-H*.47);
  wildPanel(R.card,'#4b1f6e','#1d0f33');
  wildText('WILD BOARD',200,R.card.y+44,44,'#ffd23f','#2a0b3e',8);
  ctx.fillStyle='#fff';ctx.font='bold 21px system-ui';ctx.fillText('Collect all '+WILD_GOAL+' prizes',200,R.card.y+88);
  WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*42,R.card.y+106,36,false));
  ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.fillText('before the '+WILD_SECONDS+' s timer or your coins run out',200,R.card.y+158,320);
  ctx.font='14px system-ui';ctx.fillStyle='#f0e0ff';ctx.textAlign='left';
  const lines=[['rain10','Rain coins pour 5, 10 or 25 coins'],['!','Bonus drops fall from the sky']];
  lines.forEach(([ic,t],i)=>{const y=R.card.y+190+i*28;if(RAIN[ic]){const sp=sprite(ic);ctx.drawImage(sp.cv,62-12,y-12,24,24);}else if(ic==='!'){uiCircle(62,y,11,'#ff7ad5');ctx.fillStyle='#fff';ctx.font='900 16px Impact, system-ui';ctx.textAlign='center';ctx.fillText('!',62,y+1);ctx.textAlign='left';ctx.font='14px system-ui';}else{for(let j=0;j<4;j++)uiCircle(62,y+8-j*5,9,'#f5c632','#8a5c00',1);}ctx.fillStyle='#f0e0ff';ctx.fillText(t,82,y+1);});
  ctx.textAlign='center';wildButtonDraw(R.go,'GO!','#3ccf4e','#0c3a12',30);
  ctx.fillStyle='#d8c8ee';ctx.font='13px system-ui';ctx.fillText('Back to the game',200,R.back.y+R.back.h/2);ctx.restore();
 }else if(WILD.phase==='count'){
  const s=Math.ceil(WILD.count),u=1-(WILD.count%1||1),k=1.5-.5*Math.min(1,u*4);ctx.save();ctx.translate(200,H*.42);ctx.scale(k,k);ctx.globalAlpha=Math.min(1,(1-u)*3);wildText(String(s),0,0,120,'#ffd23f','#2a0b3e',12);ctx.restore();
 }else if(WILD.phase==='play'&&(WILD.goT||0)<.8){const u=WILD.goT/.8;ctx.save();ctx.globalAlpha=1-u;ctx.translate(200,H*.42);ctx.scale(1+u*.6,1+u*.6);wildText('GO!',0,0,120,'#7dff6a','#0c3a12',12);ctx.restore();}
 else if(WILD.phase==='end'){
  const u=Math.min(1,WILD.endT/.35),R=wildEndRects(),show=WILD.endT>.9;
  // the big word first, then the card with the buttons
  ctx.save();ctx.translate(200,H*.5-170);const k=WILD.endT<.35?.4+.9*u:1.15-.15*Math.min(1,(WILD.endT-.35)/.25)+.03*Math.sin(WILD.endT*6);ctx.scale(k,k);ctx.rotate(-.06);
  if(WILD.win)wildText('YOU WIN!',0,0,62,'#ffd23f','#3a1a00',10);else wildText(WILD.reason==='coins'?'OUT OF COINS!':"TIME'S UP!",0,0,WILD.reason==='coins'?48:58,'#ff6a4a','#2a0010',10);ctx.restore();
  if(show){const a=Math.min(1,(WILD.endT-.9)/.25);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(12,6,24,.35)';ctx.fillRect(0,R.card.y-10,W,R.card.h+20);
   wildPanel(R.card,WILD.win?'#2d6a2a':'#5a1f2e',WILD.win?'#123a10':'#2a0f18');
   ctx.fillStyle='#fff';ctx.font='bold 20px system-ui';ctx.fillText(WILD.got+' of '+WILD_GOAL+' prizes',200,R.card.y+26);WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*38,R.card.y+40,30,!!WILD.have[id]));
   ctx.font='14px system-ui';ctx.fillStyle='#f0e0ff';ctx.fillText(WILD.win?wildClock()+' to spare'+(WILD.best!=null&&WILD.best===WILD.left&&WILD.runs>1?' · best yet!':''):(WILD.reason==='coins'?'The coins ran out. One more go?':'The timer ran out. One more go?'),200,R.card.y+92);
   ctx.font='12px system-ui';ctx.fillText(WILD.rained+' coins rained · '+WILD.toppled+' towers toppled · '+WILD.bonusN+' bonus drops',200,R.card.y+114);
   wildButtonDraw(R.again,'PLAY AGAIN','#ffd23f','#3a1a00',26);
   uiRound(R.back.x,R.back.y,R.back.w,R.back.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText('Back to the game',200,R.back.y+R.back.h/2);ctx.restore();}
 }
 ctx.restore();
}
// Taps: the WILD button, the goal card and the end screen. Everything else plays as normal.
function wildPointer(e,p){
 if(!world||inventoryOpen)return false;
 if(!WILD.on){if(contains(wildButton(),p)){wildEnter();return true;}return false;}
 if(WILD.phase==='card'){const R=wildCardRects();if(contains(R.go,p)){wildStartCountdown();sfx.wild('beep',1);}else if(contains(R.back,p))wildExit();return true;}
 if(WILD.phase==='end'){if(WILD.endT<.9)return true;const R=wildEndRects();if(contains(R.again,p)){wildReset();wildStartCountdown();sfx.wild('beep',1);}else if(contains(R.back,p)||contains(wildButton(),p))wildExit();return true;}
 if(contains(wildButton(),p)){wildExit();return true;}
 if(WILD.phase==='count')return true;
 return false;
}
// Developer dials: Wild timer (30-180 s) and Wild starting coins (30-400). Defaults 60 s and 110 coins.
const WILD_DIAL_KEY='catpusher.uat.wild.v1',WILD_DIALS={seconds:[60,30,180,5,'Wild timer',' s'],coins:[110,30,400,10,'Wild starting coins','']};
try{const w=JSON.parse(localStorage.getItem(WILD_DIAL_KEY)||'null');if(w){if(Number.isFinite(+w.seconds))WILD_SECONDS=Math.min(180,Math.max(30,+w.seconds));if(Number.isFinite(+w.coins))WILD_COINS=Math.min(400,Math.max(30,+w.coins));}}catch(e){}
function wildDial(k){return k==='seconds'?WILD_SECONDS:WILD_COINS;}
function stepWildDial(k,dir){const [,lo,hi,st]=WILD_DIALS[k],x=Math.min(hi,Math.max(lo,wildDial(k)+dir*st));if(k==='seconds')WILD_SECONDS=x;else WILD_COINS=x;try{localStorage.setItem(WILD_DIAL_KEY,JSON.stringify({seconds:WILD_SECONDS,coins:WILD_COINS}));}catch(e){}}
function wildDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 return '<div class="set" id="wild-dev"><h3><span>Wild board</span><span>tuning</span></h3>'+Object.keys(WILD_DIALS).map(k=>'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><button data-wild="'+k+'" data-dir="-1" style="'+b+'">−</button><span style="flex:1;text-align:center">'+WILD_DIALS[k][4]+': '+wildDial(k)+WILD_DIALS[k][5]+'</span><button data-wild="'+k+'" data-dir="1" style="'+b+'">+</button></div>').join('')+'<p style="margin:4px 0;font-size:13px;opacity:.8">Used from the next Wild round (GO or Play again).</p><button id="wild-dev-reset" class="wide">Wild defaults (60 s, 110 coins)</button></div>';}
function wildDevBind(panel){const box=panel.querySelector&&panel.querySelector('#wild-dev');if(!box)return;
 for(const btn of box.querySelectorAll('[data-wild]'))btn.onclick=()=>{stepWildDial(btn.dataset.wild,+btn.dataset.dir);try{diagEvent('wild-tuning',btn.dataset.wild+'='+wildDial(btn.dataset.wild));}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 box.querySelector('#wild-dev-reset').onclick=()=>{WILD_SECONDS=60;WILD_COINS=110;try{localStorage.removeItem(WILD_DIAL_KEY);}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};}
