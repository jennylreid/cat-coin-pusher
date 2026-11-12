// ---------- UAT 43: Wild 2 speed, star prize, obvious lost prizes, a bigger wheel ----------

// --- 1. Speed: a plain-coin budget on the Wild boards, gold "5" coins beyond it, CCD only while a coin falls ---
// Rain, pours and sky coins check the budget: while the table holds W43_COIN_CAP plain coins or more, every fifth
// surplus coin lands as one gold "5" coin (worth 5 when it goes over the front) and the other four are not made, so the
// rain still looks thick from above but the physics doesn't grow. Prizes, rain coins and the Quake are never capped.
const W43_COIN_CAP=130;
RAIN.gold5={n:5,gold:true,r:Math.round(COIN_R*1.3),half:COIN_HALF*1.15,face:['#fff6c8','#ffc93c','#9a6a00'],edge:'#8a5c00'};
EDGE.gold5=RAIN.gold5.edge;PRIZE_OPAQUE.gold5=.95;PRIZE_ASPECT.gold5=1;
const __w43RainFace=rainFace;
rainFace=function(g,c,r,kind){
 if(!RAIN[kind]||!RAIN[kind].gold)return __w43RainFace(g,c,r,kind);
 let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,'#fff8d0');gr.addColorStop(.55,'#f5c632');gr.addColorStop(1,'#8a5c00');
 g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();g.lineWidth=r*.12;g.strokeStyle='#fff3b0';g.beginPath();g.arc(c,c,r*.84,0,7);g.stroke();
 g.font='900 '+Math.round(r*1.15)+'px Impact, "Arial Black", system-ui';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=r*.18;g.strokeStyle='#6a4200';g.strokeText('5',c,c+r*.06);g.fillStyle='#fffbe8';g.fillText('5',c,c+r*.06);
};
let w43Surplus=0;
function w43PlainCount(){let n=0;for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver'))n++;return n;}
// returns the kind to make for one more plain coin: 'coin' / 'silver' under the budget, then 'gold5' once per 5, else null
function w43Budget(kind){if(!WILD.on||w43PlainCount()<W43_COIN_CAP)return kind;w43Surplus++;if(w43Surplus>=5){w43Surplus=0;WILD.gold5=(WILD.gold5||0)+1;return 'gold5';}return null;}
// Wild 1 rain (wildSpawnRainCoin) and dance pour (danceSpawn), Wild 2 sky coins (skyDrop) go through the budget.
const __w43Spawn=wildSpawnRainCoin,__w43DanceSpawn=danceSpawn;
// Sky coins are all scheduled at once by a pour, so they're budgeted when they land: they all fall (the rain looks just as
// thick), and past the budget four in five vanish into the pile as they touch down while every fifth lands as a gold 5.
const __w43SkyLand=skyLand;
skyLand=function(s){if(s.kind==='coin'||s.kind==='silver'){const k=w43Budget(s.kind);if(!k)return;if(k!==s.kind)s={...s,kind:k};}return __w43SkyLand(s);};
wildSpawnRainCoin=function(){
 if(WILD.v2||w43PlainCount()<W43_COIN_CAP)return __w43Spawn(); // Wild 2 goes through skyDrop
 const k=w43Budget('coin');if(k!=='gold5')return;const y=rand(PUSH_MAX+30,T.FRONT-150),x=200+rand(-1,1)*(tableHalfAt(y)-COIN_R-8),h=rand(240,330);
 const b=addCoin('gold5',null,x,h,y,randomTurn(rand(.05,.3)),{x:0,y:-2,z:0},{x:0,y:rand(-3,3),z:0});b.rb.enableCcd(true);b.deliveryStartHeight=h;b.w43At=time;sfx.wild('drip',1);
};
danceSpawn=function(kind){if(kind!=='coin')return __w43DanceSpawn(kind);const k=w43Budget('coin');if(!k)return;if(k==='coin')return __w43DanceSpawn('coin');
 const y=rand(PUSH_MAX+30,T.FRONT-120),x=200+rand(-1,1)*(tableHalfAt(y)-COIN_R-8),b=addCoin('gold5',null,x,300,y,randomTurn(rand(.05,.3)),{x:0,y:-3,z:0},{x:0,y:0,z:0});b.rb.enableCcd(true);b.deliveryStartHeight=300;b.w43At=time;};
// A gold 5 over the front pays 5 coins into the Wild bank; over a side it's lost like a coin.
const __w43Rain=wildRainCollected;
wildRainCollected=function(b,x){if(b.kind!=='gold5')return __w43Rain(b,x);S.coins+=5;board.remaining=S.coins;WILD.lastPay=time;const p=proj(x,T.FRONT);floats.push({text:'+5',x:p.x,y:p.y-10,t:0,big:true});try{sfx.kaching();}catch(e){}};
// CCD only while a coin is falling or flying: every half second on the Wild boards, slow coins on the table switch it
// off, fast ones (a Quake, the yawn sweep, a fall) switch it back on.
let w43CcdT=0;
function w43CcdTick(dt){
 if(!WILD.on)return;w43CcdT+=dt;if(w43CcdT<.5)return;w43CcdT=0;
 const busy=catquakeTime>0||sweepTime>0||(typeof W2_YAWN!=='undefined'&&W2_YAWN);
 for(const b of bodies){if(b.dead||b.kind==='stack')continue;const v=b.rb.linvel(),sp=Math.abs(v.x)+Math.abs(v.y)+Math.abs(v.z),on=b.rb.isCcdEnabled();
  if(busy||sp>1.2){if(!on)b.rb.enableCcd(true);}else if(on)b.rb.enableCcd(false);}
}
// The budget also covers the player's own drops: while the table holds more than W43_COIN_CAP plain coins, twice a
// second five resting coins close together near the back become one gold 5 in their place (worth the same 5 coins),
// with a glint and a soft chime. Prizes, rain coins and the Quake coin are never merged.
let w43MergeT=0;const W43_GLINTS=[];
function w43MergeTick(dt){
 if(!WILD.on||WILD.phase!=='play')return;w43MergeT+=dt;if(w43MergeT<.5)return;w43MergeT=0;
 let plain=[];for(const b of bodies){if(b.dead||(b.kind!=='coin'&&b.kind!=='silver'))continue;const v=b.rb.linvel();if(Math.abs(v.x)+Math.abs(v.y)+Math.abs(v.z)>.6)continue;const p=b.rb.translation();plain.push({b,x:p.x/M,y:p.y/M,z:p.z/M});}
 const total=w43PlainCount();if(total<=W43_COIN_CAP||plain.length<5)return;
 plain.sort((a,b)=>a.z-b.z); // from the back
 for(let tries=0;tries<Math.min(6,plain.length);tries++){
  const c=plain[tries],near=plain.filter(q=>q!==c&&Math.hypot(q.x-c.x,q.z-c.z)<COIN_R*3.2).sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z)).slice(0,4);
  if(near.length<4)continue;const grp=[c,...near],x=grp.reduce((s,q)=>s+q.x,0)/5,z=grp.reduce((s,q)=>s+q.z,0)/5,y=Math.max(...grp.map(q=>q.y));
  for(const q of grp)removeCoin(q.b);
  const g=addCoin('gold5',null,x,y+2,z,randomTurn(rand(0,.2)),{x:0,y:0,z:0},{x:0,y:0,z:0});g.w43At=time;WILD.merged=(WILD.merged||0)+1;
  const e=skyScreen(x,z,y);W43_GLINTS.push({x:e.x,y:e.y,s:e.s,t:0});try{sfx.wild('drip',.5);}catch(err){}
  return;}
}
function w43GlintDraw(dt){for(let i=W43_GLINTS.length-1;i>=0;i--){const G=W43_GLINTS[i];G.t+=dt;if(G.t>.6){W43_GLINTS.splice(i,1);continue;}const u=G.t/.6;ctx.save();ctx.globalAlpha=1-u;ctx.strokeStyle='#fff3b0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(G.x,G.y,(10+30*u)*G.s,0,7);ctx.stroke();ctx.restore();}}
// Fewer starting rows of plain coins on Wild 2: the front-most row of the prefill is left out (prizes stay).
const __w43Prefill=wildPrefill;
wildPrefill=function(){
 __w43Prefill();if(!WILD.v2)return;
 let maxZ=-1;for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver'))maxZ=Math.max(maxZ,b.rb.translation().z/M);
 for(const b of [...bodies])if(!b.dead&&(b.kind==='coin'||b.kind==='silver')&&b.rb.translation().z/M>maxZ-COIN_R)removeCoin(b);
 w43PlaceStar();
};

// --- 2. The star prize: one prize per Wild 2 round brings that round's visitor ---
const W43_STAR_TREATS={tuna:'orange',cheese:'ragdoll',shrimp:'siamese',mouse:'tortie'};
function w43PickStar(){const ks=Object.keys(W43_STAR_TREATS),fresh=ks.filter(id=>!W2_SEEN[W43_STAR_TREATS[id]]),pool=fresh.length?fresh:ks;return pool[Math.random()*pool.length|0];}
// It swaps places with the yarn ball, the back-most prize, so it starts far from the front.
function w43PlaceStar(){
 const star=WILD.star;if(!star)return;const sb=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===star),yb=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='yarn');
 if(!sb||!yb||sb===yb)return;const a=sb.rb.translation(),c=yb.rb.translation();sb.rb.setTranslation(c,true);yb.rb.setTranslation(a,true);
}
const __w43Reset=wildReset;
wildReset=function(){WILD.star=null;w43Surplus=0;const v2=WILD.v2;if(v2)WILD.star=w43PickStar();const r=__w43Reset();WILD.winHeld=false;WILD.starBackAt=0;WILD.iconShake={};WILD.gold5=0;WILD.lostN=0;return r;};
// wildEnter sets v2 after the reset, so Wild 2 picks its star on entry here
const __w43Enter2=wild2Enter;
wild2Enter=function(){const r=__w43Enter2();if(r&&WILD.v2&&!WILD.star){wildReset();}return r;};
// The star's visitor comes after the win.
const __w43PickVisitor=w2PickVisitor;
w2PickVisitor=function(){if(WILD.v2&&WILD.star&&WILD.have[WILD.star])return W43_STAR_TREATS[WILD.star];return __w43PickVisitor();};
// Only one star on the board: a random bonus prize never brings a second one.
const __w43Bonus=wildScheduleBonus;
wildScheduleBonus=function(){const n=WILD.incoming.length,missing=wildMissing();const r=__w43Bonus();const o=WILD.incoming[n]; // what was missing before this drop
 if(o&&o.kind==='item'&&WILD.star&&o.id===WILD.star&&!missing.includes(WILD.star)){const others=WILD_COLLECTION.filter(id=>id!==WILD.star);o.id=others[Math.random()*others.length|0];}
 if(o&&o.kind==='item'&&missing.includes(o.id))callout(o.id===WILD.star?'THE STAR IS BACK!':'BONUS DROP INCOMING!',{color:o.id===WILD.star?'#ffd23f':'#7dff6a',dur:1.2});
 return r;};
// A lost star comes back later (12 s), not straight away.
const __w43Missing=wildMissing;
function w43Missing(){return __w43Missing();}
wildMissing=function(){const m=__w43Missing();return WILD.star&&time<WILD.starBackAt?m.filter(id=>id!==WILD.star):m;};

// --- 3. Lost prizes you notice: tumble over the edge, rail flash, icon shake, sounds, "Lost the duck!" ---
const W43_LOST=[];
const __w43Gutter=gutterOff;
gutterOff=function(b,x){
 if(!(WILD.on&&WILD.v2&&b.kind==='item')||b.dead)return __w43Gutter(b,x);
 const t=b.rb.translation(),side=x<200?-1:1,z=Math.max(PUSH_MAX,Math.min(T.FRONT,t.z/M)),need=!WILD.have[b.id],star=b.id===WILD.star;
 W43_LOST.push({id:b.id,side,z,t:0,star});WILD.iconShake[b.id]=0;WILD.lostN++;
 sfx.wild43&&sfx.wild43(star?'lostStar':'lost',1);
 if(star){WILD.starBackAt=time+12;callout('LOST THE STAR!',{color:'#ff4b4b',dur:1.6});}
 else if(need)callout('LOST THE '+String(WILD_PRIZE_NAMES[b.id]||b.id).replace(/^(Toy|Rubber|Cat) /,'').toUpperCase()+'!',{color:'#ff8a6a',dur:1.1});
 try{diagEvent('wild2','lost '+b.id+(star?' (star)':''));}catch(e){}
 removeCoin(b);reconcileBoardTargets();
};
function w43LostTick(dt){for(let i=W43_LOST.length-1;i>=0;i--){const L=W43_LOST[i];L.t+=dt;if(L.t>1.4)W43_LOST.splice(i,1);}for(const k in WILD.iconShake){WILD.iconShake[k]+=dt;if(WILD.iconShake[k]>.8)delete WILD.iconShake[k];}}
function w43LostDraw(){
 for(const L of W43_LOST){
  // the side rail flashes along its length
  const fl=Math.max(0,1-L.t/.7),ex=L.side<0?T.L:T.R;if(fl>0){const a=skyScreen(ex,PUSH_MAX+10,0),b=skyScreen(ex,T.FRONT,0);ctx.save();ctx.globalAlpha=fl*(.6+.4*Math.sin(L.t*40));ctx.strokeStyle=L.star?'#ffd23f':'#ff5a5a';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();}
  // the prize tumbles over the edge: out, down and spinning, fading as it drops away
  const u=Math.min(1,L.t/1.1),e=skyScreen(ex,L.z,0),x=e.x+L.side*(18+60*u),y=e.y+260*u*u-24*Math.sin(u*Math.PI),s=e.s*(1-.35*u);
  ctx.save();ctx.globalAlpha=1-u*u;ctx.translate(x,y);ctx.rotate(L.side*u*5);drawPrize('item',L.id,0,0,s);ctx.restore();
  if(L.star){ctx.save();ctx.globalAlpha=1-u;w43Star(x,y-30*s,14,'#ffd23f');ctx.restore();}
 }
}
// The collection icon of a lost prize shakes; the star prize's icon has a gold star.
const __w43Icon=wildIcon;
wildIcon=function(id,x,y,w,got){const k=WILD.on&&WILD.iconShake?WILD.iconShake[id]:undefined;if(k!==undefined)x+=Math.sin(k*45)*5*(1-k/.8);__w43Icon(id,x,y,w,got);
 if(WILD.on&&WILD.v2&&WILD.star===id)w43Star(x+w*.36,y-w*.05,Math.max(6,w*.24),'#ffd23f');};
function w43Star(x,y,r,fill){ctx.save();ctx.translate(x,y);ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=Math.max(1.2,r*.16);ctx.strokeStyle='#5a3a00';ctx.stroke();ctx.restore();}
// The star prize on the board: a gold star bobbing over it.
function w43StarOnBoard(){
 if(!WILD.v2||!WILD.star||WILD.have[WILD.star]||WILD.phase==='card'||(WILD.dance&&WILD.dance.phase==='finale'))return;const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===WILD.star);if(!b)return;
 const p=b.rb.translation(),e=skyScreen(p.x/M,p.z/M,p.y/M),bob=Math.sin(performance.now()/220)*3;ctx.save();ctx.globalAlpha=.9;w43Star(e.x,e.y-radius('item')*e.s*1.7+bob,16+5*e.s,'#ffd23f');ctx.restore();
}

// --- 4. The bigger wheel: near full width, a longer spin with a pause before it lands; every slice is an event ---
W2_WHEEL.length=0;
W2_WHEEL.push({label:'RAIN 25',kind:'rain25',w:.16,c:'#ff5a2c'},{label:'DANCE AGAIN',kind:'again',w:.16,c:'#ff7ad5'},{label:'RAIN 10 + QUAKE',kind:'r10q',w:.2,c:'#4f8bff'},
 {label:'PRIZE YOU NEED',kind:'prize',w:.15,c:'#7dff6a'},{label:'RAIN 25',kind:'rain25',w:.16,c:'#ff8a3c'},{label:'JACKPOT 50',kind:'jackpot',w:.05,c:'#ffd23f'},{label:'YAWN',kind:'yawn',w:.12,c:'#6a6a7a'});
const W43_SPIN=4.6,W43_PAUSE=.55,W43_CREEP=.4,W43_WAIT=8;
function w43StartSpin(D,tapped){const Wh=D.wheel;if(!Wh||!Wh.waiting)return;Wh.waiting=false;Wh.spinAt=D.st;Wh.a0=Wh.a;Wh.tapped=tapped;
 let end=Wh.end;while(end<Wh.a0+Math.PI*2*7)end+=Math.PI*2;while(end>Wh.a0+Math.PI*2*8)end-=Math.PI*2;const seg=Math.PI*2/W2_WHEEL.length;Wh.end=end;Wh.stop=end-seg*.62;
 sfx.wild2('whoosh',1);try{diagEvent('dance','wheel spin '+(tapped?'tapped':'auto'));}catch(e){}}
// her tap on the waiting wheel starts it
const __w43TapWheel=danceTap;
danceTap=function(e){const D=WILD.dance;if(D&&WILD.v2&&D.phase==='finale'&&D.stage==='wheel'&&D.wheel&&D.wheel.waiting&&D.st>=.5){w43StartSpin(D,true);return;}return __w43TapWheel(e);};
const __w43DanceTick=danceTick;
danceTick=function(dt,paused){
 const D=WILD.dance;
 if(D&&WILD.v2&&D.phase==='finale'&&D.stage==='wheel'&&!paused){
  D.finT+=dt;D.st+=dt;WILD.lastPay=time;
  if(!D.wheel){const i=w2PickSlice(),seg=Math.PI*2/W2_WHEEL.length,a0=Math.random()*Math.PI*2;let end=-Math.PI/2-(i+.5+rand(-.25,.25))*seg;while(end<a0+Math.PI*2*7)end+=Math.PI*2;
   D.wheel={i,a0,end,a:a0,lastSeg:null,result:false,stop:end-seg*.62,waiting:true,spinAt:null};try{diagEvent('dance','wheel '+W2_WHEEL[i].label);}catch(e){}}
  // UAT 43: the wheel waits for her tap (TAP TO SPIN!), gently rocking; after W43_WAIT s it spins by itself. The slice was
  // already drawn from the odds, so how and when she taps doesn't change the outcome.
  const Wh=D.wheel;if(Wh.waiting){Wh.a=Wh.a0+Math.sin(D.st*2.4)*.06;if(D.st>=.5+W43_WAIT)w43StartSpin(D,false);return;}
  const t=D.st-Wh.spinAt;
  // spin down to just short of the slice, hold a breath, then creep over into it
  if(t<W43_SPIN){const u=t/W43_SPIN;Wh.a=Wh.a0+(Wh.stop-Wh.a0)*(1-Math.pow(1-u,3.4));}
  else if(t<W43_SPIN+W43_PAUSE)Wh.a=Wh.stop+Math.sin((t-W43_SPIN)*30)*.004;
  else{const u=Math.min(1,(t-W43_SPIN-W43_PAUSE)/W43_CREEP),e=u*u*(3-2*u);Wh.a=Wh.stop+(Wh.end-Wh.stop)*e;}
  aim.lookX=200+Math.cos(Wh.a*3)*130; // the cat watches the wheel go round
  const seg=Math.PI*2/W2_WHEEL.length,under=Math.floor((((-Math.PI/2-Wh.a)%(Math.PI*2))+Math.PI*4)%(Math.PI*2)/seg);
  if(under!==Wh.lastSeg){Wh.lastSeg=under;sfx.wild2('tick',.9);}
  if(t>=W43_SPIN+W43_PAUSE+W43_CREEP&&!Wh.result){Wh.result=true;Wh.at=D.st;const s=W2_WHEEL[Wh.i];sfx.wild43&&sfx.wild43(s.kind==='yawn'?'uhoh':s.kind==='jackpot'?'jackpot':'slice',1);w2ApplySlice(s,D);}
  if(Wh.result&&D.st-Wh.at>=(W2_WHEEL[Wh.i].kind==='jackpot'?2.2:1.6)){const k=W2_WHEEL[Wh.i].kind;D.stage=k==='yawn'?'yawn':'settle';D.st=0;delete aim.lookX;}
  return;
 }
 const again=D&&D.again;__w43DanceTick(dt,paused);
 if(again&&!WILD.dance&&WILD.phase==='play'){WILD.happy=DANCE.notches;WILD.dancePending={f:null,wait:9};} // Dance again: straight into another break
};
w2ApplySlice=function(s,D){
 const front=()=>({x:200+rand(-80,80),y:rand(590,650)});
 if(s.kind==='rain25'){const p=front();skyDrop('rain25',p.x,p.y,{dur:1});return;}
 if(s.kind==='r10q'){w2Rain(10,.06);D.quakeAt=time+1.6;WILD.pendingQuake=time+1.6;return;}
 if(s.kind==='prize'){const need=WILD_COLLECTION.filter(id=>!WILD.have[id]),id=need.length?need[Math.random()*need.length|0]:WILD_COLLECTION[Math.random()*WILD_GOAL|0];skyDrop('item',200+rand(-60,60),T.FRONT-42,{id,dur:1,h:24});return;}
 if(s.kind==='jackpot'){w2Rain(50,.035);sfx.wild('win',1);return;}
 if(s.kind==='again'){D.again=true;return;}
};
// Rain 10 + Quake: once the ten coins have landed the board shakes (a free Quake).
function w43QuakeTick(){if(WILD.pendingQuake&&time>=WILD.pendingQuake&&sweepTime===0&&catquakeTime===0&&board.status==='playing'){WILD.pendingQuake=0;board.quakes++;if(!useCatquake())board.quakes--;}}
w2WheelDraw=function(D){
 const ch=w43ChinY(),R=Math.max(120,Math.min(175,(H-4-96-(ch+58))/2)),Wh=D.wheel,t=D.st,pop=Math.min(1,t/.35),cx=200,cy=ch+58+R,n=W2_WHEEL.length,seg=Math.PI*2/n,st=Wh.waiting?-1:t-Wh.spinAt,stopT=W43_SPIN+W43_PAUSE+W43_CREEP;
 ctx.fillStyle='rgba(12,6,24,'+(.6*pop)+')';ctx.fillRect(0,ch,W,H-ch);
 ctx.save();ctx.translate(cx,cy);ctx.scale(.55+.45*pop,.55+.45*pop);
 wildText('PERFECT SPIN!',0,-R-38,34,'#7dff6a','#0c3a12',7);
 // light bulbs round the rim, chasing while it spins
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2,on=(Math.floor(t*12)+i)%3===0||Wh.result;uiCircle(Math.cos(a)*(R+10),Math.sin(a)*(R+10),4,on?'#fff6c0':'#6a5020');}
 ctx.save();ctx.rotate(Wh.a);
 W2_WHEEL.forEach((s,i)=>{const lit=Wh.result&&i===Wh.i&&Math.sin(t*14)>-.3;ctx.fillStyle=lit?'#ffffff':s.c;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,i*seg,(i+1)*seg);ctx.closePath();ctx.fill();ctx.strokeStyle='#2a0b3e';ctx.lineWidth=4;ctx.stroke();
  ctx.save();ctx.rotate((i+.5)*seg);ctx.translate(R*.6,0);ctx.rotate(Math.PI/2);const dark=s.kind==='yawn'||s.kind==='r10q';ctx.fillStyle=dark?'#fff':'#2a0b3e';ctx.textAlign='center';ctx.textBaseline='middle';
  const words=s.label.split(' '),l1=words.length>2?words.slice(0,-1).join(' '):words[0],l2=words.length>2?words[words.length-1]:words.slice(1).join(' ');
  ctx.font='900 '+(Math.max(l1.length,l2.length)>6?15:19)+'px Impact, "Arial Black", system-ui';ctx.fillText(l1,0,-34);if(l2)ctx.fillText(l2,0,-15);
  if(s.kind==='rain25'||s.kind==='r10q'){const sp=sprite(s.kind==='r10q'?'rain10':'rain25');ctx.drawImage(sp.cv,-17,6,34,34);}
  if(s.kind==='r10q'){const sp=sprite('quake');ctx.drawImage(sp.cv,4,26,24,24);}
  if(s.kind==='prize')drawPrize('item','bell',0,30,.42);
  if(s.kind==='jackpot'){for(let j=0;j<5;j++)uiCircle(-10+j*5,30-j*4,9,'#f5c632','#8a5c00',1.2);}
  if(s.kind==='again'){danceNoteGlyph(-8,24,1.3,'#2a0b3e');danceNoteGlyph(10,22,1.3,'#2a0b3e');}
  if(s.kind==='yawn'){ctx.font='900 18px Impact, system-ui';ctx.fillText('z z z',0,24);}
  ctx.restore();});
 ctx.restore();
 uiCircle(0,0,R+2,null,'#ffe08a',6);uiCircle(0,0,30,'#ffd23f','#3a1a00',3);ctx.fillStyle='#3a1a00';ctx.font='900 15px Impact, system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SPIN',0,1);
 if(Wh.waiting&&t>=.4){const k=1+.07*Math.sin(t*7);ctx.save();ctx.translate(0,R+46);ctx.scale(k,k);wildText('TAP TO SPIN!',0,0,40,'#ffd23f','#2a0b3e',8);ctx.restore();
  ctx.font='bold 13px system-ui';ctx.fillStyle='rgba(255,240,200,.85)';ctx.textAlign='center';ctx.fillText('spins by itself in '+Math.max(1,Math.ceil(.5+W43_WAIT-t))+' s',0,R+80);}
 const wob=Wh.result||Wh.waiting?0:Math.sin(t*60)*.06*(st<stopT?1:0);ctx.save();ctx.translate(0,-R-4);ctx.rotate(wob);ctx.fillStyle='#fff';ctx.strokeStyle='#2a0b3e';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,-16);ctx.lineTo(18,-16);ctx.lineTo(0,22);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 if(Wh.result){const s=W2_WHEEL[Wh.i],txt={rain25:'RAIN 25!',r10q:'RAIN 10 + QUAKE!',prize:'A PRIZE YOU NEED!',jackpot:'JACKPOT 50!',again:'DANCE AGAIN!',yawn:'UH OH… YAWN'}[s.kind];
  ctx.save();ctx.translate(0,R+44);const k=1+.08*Math.sin(t*10)+(s.kind==='jackpot'?.15:0);ctx.scale(k,k);wildText(txt,0,0,s.kind==='jackpot'?44:36,s.kind==='yawn'?'#d8c8ee':'#ffd23f','#2a0b3e',7);ctx.restore();}
 ctx.restore();
};

// --- 5. The goal card names this round's star prize and its visitor ---
const __w43CardIcon=w2CardIcon,__w43CardDraw=drawWild2Card;
w2CardIcon=function(kind,x,y){if(kind!=='star'||!WILD.star)return __w43CardIcon(kind,x,y);drawPrize('item',WILD.star,x,y+9,30/(radius('item')*2.8));w43Star(x+13,y-12,9,'#ffd23f');};
drawWild2Card=function(){
 if(WILD.star){const V=W2_VISITORS[W43_STAR_TREATS[WILD.star]];W2_CARD_LINES[3]=['star','The '+String(WILD_PRIZE_NAMES[WILD.star]).toLowerCase()+' is the star prize','win with it and the '+V.name+' visits'];}
 __w43CardDraw();
};

// --- 6. A win during a dance break waits for the break to finish (Wild and Wild 2) ---
// The taps, the payoff, the pour, a perfect dance's wheel and a yawn all play out; then the win sequence runs. The round
// timer is paused during the break as before, so the wait can't lose the round. A "Dance again" slice is skipped (the
// round is already won).
const __w43Finish=wildFinish;
wildFinish=function(win,reason){
 if(win&&WILD.on&&WILD.dance){if(!WILD.winHeld){WILD.winHeld=true;callout('ALL '+WILD_GOAL+'! FINISH THE DANCE!',{color:'#7dff6a',dur:1.4});try{diagEvent('wild','win held for the dance');}catch(e){}}return;}
 WILD.winHeld=false;return __w43Finish(win,reason);
};
function w43WinTick(){if(WILD.winHeld&&!WILD.dance&&WILD.phase==='play'){WILD.dancePending=null;wildFinish(true);}}

// --- hooks: ticks and drawing ---
const __w43Tick=wildTick,__w43Draw=wildDraw;
wildTick=function(dt){__w43Tick(dt);if(!WILD.on)return;const paused=inventoryOpen||panel.style.display==='block';if(paused)return;w43LostTick(dt);w43CcdTick(dt);w43MergeTick(dt);if(WILD.v2)w43QuakeTick();w43WinTick();};
wildDraw=function(){__w43Draw();if(!WILD.on||inventoryOpen)return;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);if(WILD.v2){w43StarOnBoard();w43LostDraw();}w43GlintDraw(1/60);ctx.restore();};

// --- 7. Nothing stays on the cat's face (Jenny, UAT 43): cards, banners and the wheel sit below the chin line ---
function w43ChinY(){return VIEW.y+(CHIN_Y+HEAD_DROP)*VIEW.zy;}
// Wild 1 goal card: the same card, moved down below the chin (only the board under it is dimmed).
const __w43CardRects=wildCardRects;
wildCardRects=function(){if(WILD.v2)return __w43CardRects();const y=Math.min(w43ChinY()+6,H-356);return {card:{x:30,y,w:340,h:350},go:{x:110,y:y+253,w:180,h:58},back:{x:140,y:y+317,w:120,h:28}};};
// Wild 2 goal card: compact, from the chin to the bottom of the screen. Tall screens show all six lines; short ones
// the four that matter most (meter, beat, wheel, star).
w2CardLayout=function(){
 const bottom=H-6,room0=bottom-(w43ChinY()+4),n=room0>=276+6*36?6:4,row=Math.max(30,Math.min(52,(room0-276)/n)),h=276+row*n,top=Math.min(w43ChinY()+4,bottom-h),room=bottom-top,y=top+(room-h)/2; // a short screen lifts it just enough to fit
 const linesY=y+146,s=linesY+row*n+22;return {card:{x:10,y,w:380,h},row,n,linesY,start:{x:56,y:s,w:288,h:60},back:{x:120,y:s+68,w:160,h:28}};
};
drawWild2Card=function(){
 if(WILD.star){const V=W2_VISITORS[W43_STAR_TREATS[WILD.star]];W2_CARD_LINES[3]=['star','The '+String(WILD_PRIZE_NAMES[WILD.star]).toLowerCase()+' is the star prize','win with it and the '+V.name+' visits'];}
 const L=w2CardLayout(),R=L.card,pop=Math.min(1,WILD.cardT/.25),k=.7+.3*(1-Math.pow(1-pop,3)),cy=R.y+R.h/2,ch=w43ChinY();
 ctx.fillStyle='rgba(12,6,24,'+(.7*pop)+')';ctx.fillRect(0,ch,W,H-ch);
 ctx.save();ctx.translate(200,cy);ctx.scale(k,k);ctx.translate(-200,-cy);ctx.textAlign='center';ctx.textBaseline='middle';
 wildPanel(R,'#4b1f6e','#1d0f33');
 wildText('WILD 2',200,R.y+28,36,'#a6ff6a','#10301a',7);
 ctx.fillStyle='#ffd23f';ctx.font='900 21px Impact, "Arial Black", system-ui';ctx.fillText('GOAL: COLLECT ALL '+WILD_GOAL+' PRIZES',200,R.y+60,356);
 WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*44,R.y+74,34,false));
 ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.fillText('before the '+WILD_SECONDS+' s timer or your coins run out',200,R.y+128,360);
 const two=L.row>=36;
 for(let i=0;i<L.n;i++){const [ic,a,b]=W2_CARD_LINES[i],y=L.linesY+i*L.row+L.row/2;
  w2CardIcon(ic,52,y);ctx.textAlign='left';ctx.fillStyle='#fff';
  if(two){ctx.font='bold 16px system-ui';ctx.fillText(a,86,y-9,296);ctx.fillStyle='#ffe08a';ctx.font='bold 14px system-ui';ctx.fillText(b,86,y+10,296);}
  else{ctx.font='bold 15px system-ui';ctx.fillText(a+' '+b,86,y,298);}ctx.textAlign='center';}
 const s=L.start,pulse=1+.04*Math.sin(performance.now()/180);ctx.save();ctx.translate(s.x+s.w/2,s.y+s.h/2);ctx.scale(pulse,pulse);ctx.translate(-(s.x+s.w/2),-(s.y+s.h/2));
 wildButtonDraw(s,'TAP TO START','#3ccf4e','#0c3a12',30);ctx.restore();
 ctx.fillStyle='#e8dcff';ctx.font='bold 13px system-ui';ctx.fillText('The timer starts after 3, 2, 1, GO!',200,s.y-11);
 uiRound(L.back.x,L.back.y,L.back.w,L.back.h,14,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Back to the game',200,L.back.y+L.back.h/2+1);
 ctx.restore();
};
// The visitor card goes below the chin too (over the win card until it's closed).
w2VisitorRect=function(){return {x:40,y:Math.min(w43ChinY()+8,H-306),w:320,h:300};};
