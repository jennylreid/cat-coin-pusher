// ---------- CP-38 Wild 2 prototype (UAT 38) ----------
// A second Wild board, reached by its own button next to WILD!. It is the Wild board (same goal, timer, prizes, rain
// coins, bonus drops, dance break) with WILD.v2 set, plus: a clear dance payoff (a big bank counter, "+N COINS!", then
// the coins pour from above the cat), a perfect dance spins a prize wheel (with one bad slice: the cat stretches and
// yawns and its paws sweep coins off the sides), coin rain falling from high above, and a visiting cat after a win.
// Background music and a pusher slide sound play on every board (Developer dials: Music volume, Pusher sound).
WILD.v2=false;

// --- dials and saved data ---
const W2_KEY='catpusher.uat.wild2.v1',W2_VISITOR_KEY='catpusher.uat.visitors.v1';
const W2_DEFAULTS=Object.freeze({music:.5,pusher:.5});
const W2={...W2_DEFAULTS};
try{const d=JSON.parse(localStorage.getItem(W2_KEY)||'null');if(d)for(const k in W2_DEFAULTS)if(Number.isFinite(+d[k]))W2[k]=Math.min(1,Math.max(0,+d[k]));}catch(e){}
function w2Save(){try{localStorage.setItem(W2_KEY,JSON.stringify(W2));}catch(e){}}
let W2_SEEN={};try{W2_SEEN=JSON.parse(localStorage.getItem(W2_VISITOR_KEY)||'{}')||{};}catch(e){W2_SEEN={};}

// --- background music: 112 BPM, eight bars (F Dm Bb C F Am Bb C), scheduled ahead in eighth notes ---
const BGM_STEP=60/112/2,BGM_STEPS=64;
const BGM_BASS=[87.31,73.42,116.54,130.81,87.31,110,116.54,130.81];
const BGM_PAD=[[349.23,440,523.25],[293.66,349.23,440],[293.66,349.23,466.16],[329.63,392,523.25],[349.23,440,523.25],[329.63,440,523.25],[293.66,349.23,466.16],[329.63,392,466.16]];
const BGM_SCALE=[349.23,392,440,523.25,587.33,698.46,783.99];
const BGM_MEL=[[5,-1,4,-1,3,4,-1,2,3,-1,-1,1,2,-1,-1,-1],[2,-1,3,-1,4,-1,5,4,3,-1,2,-1,1,-1,-1,-1],[5,-1,4,-1,3,4,5,-1,4,-1,3,-1,2,-1,-1,-1],[0,1,2,-1,3,-1,4,-1,5,-1,6,-1,5,-1,-1,-1]];
const BGM={playing:false,next:0,step:0,level:-1};
function bgmWanted(){
 if(S.muted||!(W2.music>0)||document.hidden||(typeof inBackground!=='undefined'&&inBackground))return false;
 if(pawDance)return false; // the dance break, the win dances and the collection dance have their own music
 if(WILD.on&&(WILD.dance||WILD.phase==='end'))return false;
 if(!WILD.on&&board.status==='won')return false;
 return true;
}
function bgmStep(i,d){
 const bar=i>>3,s=i&7;
 if(s===0||s===4)sfx.bgm('kick',d);if(s===2||s===6)sfx.bgm('rim',d);if(s&1)sfx.bgm('shaker',d);
 if(s===0)sfx.bgm('pad',d,BGM_PAD[bar]);
 const r=BGM_BASS[bar];if(s===0)sfx.bgm('bass',d,r);else if(s===3)sfx.bgm('bass',d,r*1.5);else if(s===4)sfx.bgm('bass',d,r*2);else if(s===6)sfx.bgm('bass',d,r*1.5);
 const m=BGM_MEL[bar>>1][(bar&1)*8+s];if(m>=0)sfx.bgm('mar',d,BGM_SCALE[m]);
 if(i===BGM_STEPS-2)sfx.bgm('meow',d,698.46);
}
function bgmTick(){
 const want=bgmWanted(),now=danceNow();
 if(want&&!BGM.playing){BGM.playing=true;BGM.step=0;BGM.next=now+.1;BGM.level=-1;}
 if(!want&&BGM.playing){BGM.playing=false;BGM.level=-1;sfx.bgmBus(0,.25);}
 if(!BGM.playing)return;
 if(BGM.level!==W2.music){BGM.level=W2.music;sfx.bgmBus(W2.music,.35);}
 if(BGM.next<now-.3)BGM.next=now+.05; // after a stall, carry on rather than catch up
 while(BGM.next-now<.2){bgmStep(BGM.step,BGM.next-now);BGM.step=(BGM.step+1)%BGM_STEPS;BGM.next+=BGM_STEP;}
}
// --- the pusher slide: once forward (phase .08-.53), quieter back (.61-1), on every board while it plays ---
let w2PushLast=-1;
function pusherSoundTick(){
 const ph=pushPhase/PUSH_PERIOD,last=w2PushLast;w2PushLast=ph;
 if(last<0||board.status==='won'||board.status==='lost'||!(W2.pusher>0)||S.muted)return; // the pusher stops when a board ends
 const crossed=a=>(last<a&&ph>=a)||(last>ph&&(ph>=a||last<a)); // includes wrapping round
 if(crossed(.08))sfx.slide(W2.pusher,.45*PUSH_PERIOD,false);else if(crossed(.61))sfx.slide(W2.pusher,.39*PUSH_PERIOD,true);
}

// --- coins that fall from high above the cat (drawn on top), handed to physics just above the table ---
const SKY=[];
function skyDrop(kind,x,y,o={}){SKY.push({kind,id:o.id||null,x,y,t:-(o.delay||0),dur:o.dur||rand(.75,.95),spin:rand(0,6),vs:rand(6,11),sx:rand(-40,40),h:o.h||36,sound:o.sound!==false});}
function skyScreen(x,y,h){const p=screenOf(x,y,h);return {x:200+(p.x-200)*VIEW.z,y:VIEW.y+p.y*VIEW.zy,s:p.s*VIEW.z};}
function skyLand(s){
 const coin=s.kind==='coin'||s.kind==='silver';
 const b=addCoin(s.kind,s.id,s.x,s.h,s.y,s.kind==='item'?yawTurn(0):randomTurn(rand(.05,.3)),{x:0,y:-6,z:0},coin?{x:rand(-2,2),y:rand(-4,4),z:rand(-2,2)}:{x:0,y:0,z:0});
 b.rb.enableCcd(true);b.deliveryStartHeight=s.h;
 if(coin)b.rain=true;else{b.wildBonus=true;b.wildLandAt=time;if(s.kind==='item')b.wild=true;sfx.wild('thud',.8);const p=screenOf(s.x,s.y,0);rings.push({x:p.x,y:p.y,t:0,s:p.s});}
 if(s.sound&&(!coin||Math.random()<.5))sfx.wild2('land',.8);
}
function skyTick(dt){for(let i=SKY.length-1;i>=0;i--){const s=SKY[i];s.t+=dt;if(s.t>=s.dur){SKY.splice(i,1);if(WILD.on&&WILD.phase!=='end')skyLand(s);}}}
function skyDraw(){
 for(const s of SKY){if(s.t<0)continue;const e=skyScreen(s.x,s.y,s.h),u=s.t/s.dur,y0=-50,x=e.x+s.sx*(1-u),y=y0+(e.y-y0)*u*u;
  let sp,r;if(s.kind==='item'){const size=radius('item')*e.s*2.8;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(s.spin+u*6)*.3);drawPrize('item',s.id,0,size*.2,e.s);ctx.restore();continue;}
  sp=sprite(s.kind==='silver'?'coin':s.kind);r=sp.half*e.s;
  ctx.save();ctx.translate(x,y);ctx.scale(Math.max(.15,Math.abs(Math.cos(s.spin+u*s.vs))),.9);ctx.drawImage(sp.cv,-r,-r,2*r,2*r);ctx.restore();}
}

// --- the Wild 2 button, beside WILD! ---
function wild2Button(){const h=hudLayout();return {x:W/2+114,y:h.mainY-15,w:34,h:30};}
function drawWild2Button(){
 if(inventoryOpen||WILD.on)return;const b=wild2Button(),pulse=.5+.5*Math.sin(performance.now()/260+1.6);
 ctx.save();const g=ctx.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);g.addColorStop(0,'#4fe0ff');g.addColorStop(.5,'#a6ff6a');g.addColorStop(1,'#ffd23f');
 uiRound(b.x,b.y,b.w,b.h,13,g,'rgba(255,255,255,'+(.55+.45*pulse)+')',2);
 ctx.fillStyle='#10301a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 8px system-ui';ctx.fillText('WILD',b.x+b.w/2,b.y+9);ctx.font='900 15px Impact, "Arial Black", system-ui';ctx.fillText('2',b.x+b.w/2,b.y+21);ctx.restore();
}

// --- the dance payoff on Wild 2 ---
const W2_WHEEL=[{label:'+10',n:10,w:3,c:'#ffb23f'},{label:'+15',n:15,w:2.4,c:'#ff7ad5'},{label:'RAIN 25',kind:'rain25',w:.7,c:'#ff5a2c'},{label:'+10',n:10,w:3,c:'#4fe0b0'},
 {label:'QUAKE',kind:'quake',w:.7,c:'#4f8bff'},{label:'+20',n:20,w:1.8,c:'#c86aff'},{label:'PRIZE',kind:'prize',w:.5,c:'#ffd23f'},{label:'YAWN',kind:'yawn',w:1.1,c:'#6a6a7a'}];
let w2ForceSlice=null; // Developer: the next wheel lands on this slice
function w2PickSlice(){if(w2ForceSlice!=null){const i=w2ForceSlice;w2ForceSlice=null;return i;}const tot=W2_WHEEL.reduce((s,x)=>s+x.w,0);let r=Math.random()*tot;for(let i=0;i<W2_WHEEL.length;i++){r-=W2_WHEEL[i].w;if(r<0)return i;}return 0;}
function w2Rain(n,gap=.05){for(let i=0;i<n;i++){const y=rand(PUSH_MAX+40,T.FRONT-140),x=200+rand(-1,1)*(tableHalfAt(y)-COIN_R-6);skyDrop(Math.random()<.2?'silver':'coin',x,y,{delay:i*gap,sound:i%3===0});}}
const __w2Finale=danceFinale,__w2DanceTick=danceTick;
danceFinale=function(D){
 if(!WILD.v2)return __w2Finale(D);
 D.phase='finale';D.finT=0;stopPawDance();lunge=1;danceShake(null);sfx.dance('roar',1,.05);
 D.perfect=D.hits===D.n;D.coins=D.bank.coin;D.rainCoins=D.bank.rain5+D.bank.rain10;D.stage=D.perfect?'perfect':'total';D.st=0;
 WILD.danceCoins+=D.bank.coin;WILD.danceRainCoins+=D.rainCoins;WILD.rained+=D.bank.coin;
 if(D.perfect){sfx.wild2('perfect',1);WILD.perfects=(WILD.perfects||0)+1;}else if(D.coins+D.rainCoins)sfx.wild2('total',1);
 try{diagEvent('dance','finale v2 hits='+D.hits+'/'+D.n+(D.perfect?' perfect':''));}catch(e){}
};
function w2Next(D,stage){D.stage=stage;D.st=0;}
danceTick=function(dt,paused){
 const D=WILD.dance;if(!D||!WILD.v2||D.phase!=='finale'||!D.stage)return __w2DanceTick(dt,paused);
 if(paused)return;WILD.lastPay=time;D.finT+=dt;D.st+=dt;
 for(let i=D.fx.length-1;i>=0;i--){D.fx[i].t+=dt;if(D.fx[i].t>.9)D.fx.splice(i,1);}
 const sh=Math.max(0,1-D.finT/.8);danceShake(sh>0?[rand(-1,1)*8*sh,rand(-1,1)*6*sh]:null);
 if(D.stage==='perfect'){if(D.st>=1.2){w2Next(D,'total');if(D.coins+D.rainCoins)sfx.wild2('total',1);}return;}
 if(D.stage==='total'){
  if(D.st>=1.1){
   if(!(D.coins+D.rainCoins)){w2Next(D,D.perfect?'wheel':'done');return;}
   for(let i=0;i<D.bank.rain10;i++)skyDrop('rain10',200+rand(-90,90),rand(480,600),{delay:i*.12});
   for(let i=0;i<D.bank.rain5;i++)skyDrop('rain5',200+rand(-90,90),rand(480,600),{delay:(i+D.bank.rain10)*.12});
   w2Rain(D.coins,Math.max(.03,Math.min(.07,1.1/Math.max(1,D.coins))));sfx.wild2('whoosh',1);sfx.dance('pour',.7,.5);w2Next(D,'pour');}
  return;}
 if(D.stage==='pour'){if(!SKY.length&&D.st>.6)w2Next(D,D.perfect?'wheel':'done');return;}
 if(D.stage==='wheel'){
  if(!D.wheel){const i=w2PickSlice(),seg=Math.PI*2/W2_WHEEL.length,a0=Math.random()*Math.PI*2;let end=-Math.PI/2-(i+.5+rand(-.3,.3))*seg;while(end<a0+Math.PI*2*5)end+=Math.PI*2;
   D.wheel={i,a0,end,a:a0,dur:3.4,lastSeg:null,result:false};try{diagEvent('dance','wheel '+W2_WHEEL[i].label);}catch(e){}}
  const Wh=D.wheel,u=Math.min(1,(D.st-.5)/Wh.dur);if(D.st<.5)return; // the wheel pops in first
  Wh.a=Wh.a0+(Wh.end-Wh.a0)*(1-Math.pow(1-u,3.2));
  const seg=Math.PI*2/W2_WHEEL.length,under=Math.floor((((-Math.PI/2-Wh.a)%(Math.PI*2))+Math.PI*4)%(Math.PI*2)/seg);
  if(under!==Wh.lastSeg){Wh.lastSeg=under;sfx.wild2('tick',.8);}
  if(u>=1&&!Wh.result){Wh.result=true;Wh.at=D.st;const s=W2_WHEEL[Wh.i];sfx.wild2(s.kind==='yawn'?'tick':'win',1);w2ApplySlice(s,D);}
  if(Wh.result&&D.st-Wh.at>=1.6){if(W2_WHEEL[Wh.i].kind==='yawn')w2Next(D,'yawn');else w2Next(D,'settle');}
  return;}
 if(D.stage==='yawn'){if(!D.yawnStarted){D.yawnStarted=true;w2StartYawn();}if(!W2_YAWN)w2Next(D,'done');return;}
 if(D.stage==='settle'){if(!SKY.length&&D.st>.5)w2Next(D,'done');return;}
 if(D.stage==='done'){WILD.dance=null;WILD.happy=0;WILD.happyT=9;danceShake(null);try{diagEvent('dance','end v2 hits='+D.hits+' bank='+danceBanked(D));}catch(e){}}
};
function w2ApplySlice(s,D){
 if(s.n){w2Rain(s.n,.06);return;}
 const x=200+rand(-70,70),y=rand(580,650);
 if(s.kind==='rain25'||s.kind==='quake'){skyDrop(s.kind,x,y,{dur:1});return;}
 if(s.kind==='prize'){const need=WILD_COLLECTION.filter(id=>!WILD.have[id]),id=need.length?need[Math.random()*need.length|0]:WILD_COLLECTION[Math.random()*WILD_GOAL|0];skyDrop('item',x,y,{id,dur:1,h:30});}
}

// --- the stretch and yawn: the paws (approved art, unchanged) slide forward and sweep outward over the table ---
let W2_YAWN=null;
function w2StartYawn(){W2_YAWN={t:0,pushed:new Map()};stopTickle();stopPawDance();pawDanceToken++;pawDance={started:time,silent:true,index:0,switched:true,anchor:0,yawn:true};happyUntil=0;sfx.wild2('yawn',1);}
const __w2PawMotion=pawMotion;
pawMotion=function(side=0){
 if(!W2_YAWN||!pawDance||!pawDance.yawn)return __w2PawMotion(side);
 const t=W2_YAWN.t,s=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};if(!side)return {x:0,y:-8*s(t/.5)*(1-s((t-2.2)/.6)),r:0};
 const lift=s(t/.45)*(1-s((t-.45)/.35)),fwd=s((t-.6)/.6)*(1-s((t-2.1)/.7)),out=s((t-1.25)/.75)*(1-s((t-2.1)/.7));
 return {x:-side*34*fwd+side*120*out,y:-26*lift+200*fwd-20*out,r:side*(.25*lift-.18*out)};
};
function w2YawnTick(dt){
 const Y=W2_YAWN;if(!Y)return;Y.t+=dt;happyUntil=0;
 if(Y.t>=1.25&&Y.t<2.05){if(!Y.swept){Y.swept=true;sfx.wild2('sweep',1);callout('SWOOSH!',{color:'#b9a6d6',dur:.8});}
  // the paws sweep outward across the back half of the table: coins they reach go flying off the sides
  const f=Math.min(1,(Y.t-1.25)/.75),reach=20+f*170;
  // (the paws are drawn over table depth ~390-560); like a plough, everything the paws have reached keeps moving outward
  for(const b of bodies){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M;
   if(z<380||z>570||Math.abs(x-200)>reach)continue;
   if(!Y.pushed.has(b))Y.pushed.set(b,x<200?-1:1);const v=b.rb.linvel();b.rb.setLinvel({x:Y.pushed.get(b)*Math.max(Math.abs(v.x),rand(5,7.5)),y:Math.max(v.y,rand(.8,1.6)),z:v.z},true);}}
 if(Y.t>=2.8){W2_YAWN=null;if(pawDance&&pawDance.yawn)stopPawDance();}
}
function yawnText(){if(!W2_YAWN)return;const t=W2_YAWN.t;if(t>1.3)return;ctx.save();ctx.globalAlpha=Math.min(1,t*4)*(1-Math.max(0,(t-1)/.3));ctx.translate(200,150);ctx.rotate(-.06);wildText('YAAAWN…',0,0,40,'#d8c8ee','#2a1a3e',7);ctx.restore();}

// --- the visiting cat after a Wild 2 win (placeholder pictures drawn in code; no new cat art) ---
const W2_VISITORS={orange:{name:'Orange cat',treat:'tuna',fur:'#f29a3a',dark:'#c0621a',eye:'#7ad65a',mood:'Goofy, orange cat energy'},
 ragdoll:{name:'Ragdoll',treat:'cheese',fur:'#f4ead8',dark:'#8a7360',eye:'#6aaeff',mood:'Calm, floppy and fluffy'},
 siamese:{name:'Siamese',treat:'shrimp',fur:'#f1e4cc',dark:'#4a3426',eye:'#4f9bff',mood:'Loud, clever, wants attention'},
 tortie:{name:'Tortoiseshell',treat:'mouse',fur:'#2a2220',dark:'#d9782e',eye:'#c8d64a',mood:'Fiery and independent'}};
function w2PickVisitor(){
 const order=WILD.order||[];const ks=Object.keys(W2_VISITORS).filter(k=>WILD.have[W2_VISITORS[k].treat]);if(!ks.length)return null;
 const first=k=>{const i=order.indexOf(W2_VISITORS[k].treat);return i<0?99:i;};
 const fresh=ks.filter(k=>!W2_SEEN[k]);const pool=fresh.length?fresh:ks;pool.sort((a,b)=>first(a)-first(b));return pool[0];
}
function w2Visit(){const k=w2PickVisitor();if(!k)return;W2_SEEN[k]=(W2_SEEN[k]||0)+1;try{localStorage.setItem(W2_VISITOR_KEY,JSON.stringify(W2_SEEN));}catch(e){}
 WILD.visitor={k,t:0,open:true,first:W2_SEEN[k]===1};try{diagEvent('wild2','visitor '+k);}catch(e){}}
function drawVisitorCat(k,x,y,s){
 const V=W2_VISITORS[k];ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const ear=(d)=>{ctx.beginPath();ctx.moveTo(d*18,-30);ctx.lineTo(d*44,-62);ctx.lineTo(d*48,-18);ctx.closePath();ctx.fill();};
 ctx.fillStyle=k==='siamese'||k==='ragdoll'?V.dark:V.fur;ear(-1);ear(1);
 ctx.fillStyle=V.fur;ctx.beginPath();ctx.ellipse(0,0,54,46,0,0,7);ctx.fill();
 if(k==='orange'){ctx.fillStyle=V.dark;for(const d of [-1,0,1]){ctx.beginPath();ctx.ellipse(d*14,-38,4,11,d*.3,0,7);ctx.fill();}for(const d of [-1,1]){ctx.fillRect(d>0?34:-50,-6,16,4);ctx.fillRect(d>0?36:-50,4,14,4);}}
 if(k==='tortie'){ctx.fillStyle=V.dark;ctx.beginPath();ctx.ellipse(-24,-16,20,16,.4,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(28,12,16,20,-.3,0,7);ctx.fill();ctx.fillStyle='#8a4a1a';ctx.beginPath();ctx.ellipse(8,-30,10,8,0,0,7);ctx.fill();}
 if(k==='siamese'||k==='ragdoll'){ctx.fillStyle=V.dark;ctx.globalAlpha=k==='siamese'?.9:.55;ctx.beginPath();ctx.ellipse(0,10,k==='siamese'?30:24,k==='siamese'?26:18,0,0,7);ctx.fill();ctx.globalAlpha=1;if(k==='ragdoll'){ctx.fillStyle='#fffaf0';ctx.beginPath();ctx.ellipse(0,26,22,14,0,0,7);ctx.fill();}}
 for(const d of [-1,1]){ctx.fillStyle=V.eye;ctx.beginPath();ctx.ellipse(d*20,-6,10,12,0,0,7);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(d*20,-6,3.5,9,0,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(d*22,-10,2.5,0,7);ctx.fill();}
 ctx.fillStyle='#f48aa8';ctx.beginPath();ctx.moveTo(-6,10);ctx.lineTo(6,10);ctx.lineTo(0,17);ctx.closePath();ctx.fill();
 ctx.strokeStyle=k==='tortie'?'#ddd':'#333';ctx.lineWidth=1.6;for(const d of [-1,1])for(const a of [-.15,.05,.25]){ctx.beginPath();ctx.moveTo(d*14,18);ctx.lineTo(d*58,18+a*40);ctx.stroke();}
 ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,17);ctx.quadraticCurveTo(-6,24,-12,20);ctx.moveTo(0,17);ctx.quadraticCurveTo(6,24,12,20);ctx.stroke();
 ctx.restore();
}
function w2VisitorRect(){return {x:40,y:118,w:320,h:300};}
function drawVisitorCard(){
 const v=WILD.visitor;if(!v||!v.open)return;const R=w2VisitorRect(),u=Math.min(1,v.t/.3),k=.7+.3*(1-Math.pow(1-u,3)),V=W2_VISITORS[v.k];
 ctx.save();ctx.globalAlpha=u;ctx.translate(200,R.y+R.h/2);ctx.scale(k,k);ctx.translate(-200,-(R.y+R.h/2));
 wildPanel(R,'#3a6a8a','#142a3a');ctx.textAlign='center';ctx.textBaseline='middle';
 wildText('A VISITOR CAME!',200,R.y+34,30,'#ffd23f','#13222e',6);
 drawVisitorCat(v.k,200,R.y+128,1+.03*Math.sin(v.t*5));
 ctx.fillStyle='#fff';ctx.font='bold 18px system-ui';ctx.fillText(V.name+' loved your '+WILD_PRIZE_NAMES[V.treat].toLowerCase()+'!',200,R.y+208,300);
 ctx.font='13px system-ui';ctx.fillStyle='#cfe6f4';ctx.fillText(V.mood+(v.first?' · new visitor!':''),200,R.y+232,300);
 const seen=Object.keys(W2_VISITORS).filter(x=>W2_SEEN[x]);ctx.font='bold 12px system-ui';ctx.fillStyle='#fff';ctx.fillText('Visitors seen: '+seen.length+' of 4',200,R.y+258);
 Object.keys(W2_VISITORS).forEach((x,i)=>{ctx.globalAlpha=u*(W2_SEEN[x]?1:.25);drawVisitorCat(x,140+i*40,R.y+280,.22);});ctx.globalAlpha=u;
 ctx.font='11px system-ui';ctx.fillStyle='#9fc4da';ctx.fillText('tap to close',326,R.y+R.h-10);
 ctx.restore();
}

// --- hooks ---
const __w2Enter=wildEnter,__w2Exit=wildExit,__w2Reset=wildReset,__w2Pointer=wildPointer,__w2Tick=wildTick,__w2Draw=wildDraw,__w2Spawn=wildSpawnRainCoin,
 __w2Finish=wildFinish,__w2Prize=wildPrizeCollected,__w2DrawWildButton=drawWildButton,__w2Update=update,__w2DevHtml=wildDevHtml,__w2DevBind=wildDevBind;
function wild2Enter(){if(!__w2Enter())return false;WILD.v2=true;try{diagEvent('wild2','enter');}catch(e){}return true;}
wildEnter=function(){return __w2Enter();};
wildExit=function(){SKY.length=0;W2_YAWN=null;WILD.visitor=null;const r=__w2Exit();WILD.v2=false;return r;};
wildReset=function(){SKY.length=0;W2_YAWN=null;const r=__w2Reset();WILD.visitor=null;WILD.order=[];WILD.perfects=0;return r;};
wildPrizeCollected=function(b,x){const fresh=!WILD.have[b.id];__w2Prize(b,x);if(fresh&&WILD.have[b.id])(WILD.order||(WILD.order=[])).push(b.id);};
wildFinish=function(win,reason){SKY.length=0;W2_YAWN=null;const was=board.status;const r=__w2Finish(win,reason);if(WILD.v2&&win&&was==='playing')WILD.visitAt=2.4;else WILD.visitAt=null;return r;};
wildSpawnRainCoin=function(){
 if(!WILD.v2)return __w2Spawn();
 const y=rand(PUSH_MAX+30,T.FRONT-150),x=200+rand(-1,1)*(tableHalfAt(y)-COIN_R-6);skyDrop(Math.random()<.25?'silver':'coin',x,y,{sound:Math.random()<.4});sfx.wild('drip',.6);
};
wildPointer=function(e,p){
 if(!WILD.on&&world&&!inventoryOpen&&contains(wild2Button(),p)){wild2Enter();return true;}
 if(WILD.on&&WILD.v2&&WILD.visitor&&WILD.visitor.open&&WILD.phase==='end'){WILD.visitor.open=false;return true;}
 return __w2Pointer(e,p);
};
wildTick=function(dt){
 __w2Tick(dt);if(!WILD.on)return;
 const paused=inventoryOpen||panel.style.display==='block';if(paused)return;
 skyTick(dt);if(W2_YAWN)w2YawnTick(dt);
 if(WILD.phase==='end'&&WILD.visitAt!=null&&WILD.endT>=WILD.visitAt){WILD.visitAt=null;w2Visit();sfx.wild2('visitor',1);}
 if(WILD.visitor)WILD.visitor.t+=dt;
};
wildDraw=function(){
 __w2Draw();if(!WILD.on||inventoryOpen)return;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 skyDraw();if(WILD.v2){w2DanceDraw();yawnText();drawVisitorCard();}ctx.restore();
};
drawWildButton=function(){__w2DrawWildButton();drawWild2Button();};
update=function(dt){__w2Update(dt);try{bgmTick();pusherSoundTick();}catch(e){}};
// The big stages of the Wild 2 dance payoff, drawn over the board: the bank counter, PERFECT!, +N COINS! and the wheel.
function w2DanceDraw(){
 const D=WILD.dance;if(!D)return;const Y=DANCE_LANE_Y;
 if(D.phase!=='finale'){ // the bank: a big counter that grows with each banked beat
  const n=D.bank.coin,pop=Math.max(0,1-D.ringT/.3),size=Math.min(62,34+n*1.8)*(1+.25*pop),y=Y+86;
  ctx.save();ctx.translate(200,y);ctx.rotate(-.04);wildText('+'+n,0,0,size,'#ffd23f','#3a1a00',Math.max(6,size*.14));ctx.restore();
  ctx.font='bold 12px system-ui';ctx.fillStyle='#ffe9a8';ctx.fillText(n===1?'COIN BANKED':'COINS BANKED'+(D.streak>=2?' · streak '+D.streak:''),200,y+size*.5+10);
  const rc=D.bank.rain5+D.bank.rain10;if(rc){let x=200-(rc-1)*14;for(const k of ['rain10','rain5'])for(let i=0;i<D.bank[k];i++){const sp=sprite(k);ctx.drawImage(sp.cv,x-12,y-size*.5-22,24,24);x+=28;}}
  return;}
 const st=D.stage,t=D.st;ctx.save();
 if(st==='perfect'){const k=Math.min(1,t/.25);ctx.fillStyle='rgba(12,6,24,'+(.35*k)+')';ctx.fillRect(0,0,W,H);ctx.translate(200,H*.36);ctx.scale(.5+.6*k+.04*Math.sin(t*12),.5+.6*k+.04*Math.sin(t*12));ctx.rotate(-.06);wildText('PERFECT!',0,0,64,'#7dff6a','#0c3a12',10);ctx.font='bold 16px system-ui';ctx.fillStyle='#fff';ctx.fillText('every beat!',0,48);}
 else if(st==='total'||(st==='pour'&&t<.5)){const k=st==='total'?Math.min(1,t/.2):1-t/.5;ctx.globalAlpha=Math.max(0,k);ctx.translate(200,H*.36);ctx.scale(.6+.5*Math.min(1,t/.2),.6+.5*Math.min(1,t/.2));
  if(D.coins+D.rainCoins){wildText('+'+D.coins+' COINS!',0,0,D.coins>=10?54:60,'#ffd23f','#3a1a00',10);if(D.rainCoins){ctx.font='bold 17px system-ui';ctx.fillStyle='#fff';ctx.fillText('+ '+D.rainCoins+' rain coin'+(D.rainCoins>1?'s':''),0,44);}}
  else wildText('MISSED THE BEAT!',0,0,40,'#b9a6d6','#2a0b3e',8);}
 else if(st==='wheel'&&D.wheel)w2WheelDraw(D);
 ctx.restore();
}
function w2WheelDraw(D){
 const Wh=D.wheel,t=D.st,pop=Math.min(1,t/.35),cx=200,cy=290,R=128,seg=Math.PI*2/W2_WHEEL.length;
 ctx.fillStyle='rgba(12,6,24,'+(.5*pop)+')';ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(cx,cy);ctx.scale(.6+.4*pop,.6+.4*pop);
 wildText('PERFECT SPIN!',0,-R-34,30,'#7dff6a','#0c3a12',6);
 ctx.save();ctx.rotate(Wh.a);
 W2_WHEEL.forEach((s,i)=>{const lit=Wh.result&&i===Wh.i&&Math.sin(t*14)>-.3;ctx.fillStyle=lit?'#ffffff':s.c;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,i*seg,(i+1)*seg);ctx.closePath();ctx.fill();ctx.strokeStyle='#2a0b3e';ctx.lineWidth=3;ctx.stroke();
  ctx.save();ctx.rotate((i+.5)*seg);ctx.translate(R*.62,0);ctx.rotate(Math.PI/2);ctx.fillStyle=s.kind==='yawn'?'#fff':'#2a0b3e';ctx.font='900 '+(s.label.length>4?15:20)+'px Impact, "Arial Black", system-ui';ctx.fillText(s.label,0,0);
  if(s.kind==='rain25'||s.kind==='quake'){const sp=sprite(s.kind);ctx.drawImage(sp.cv,-13,14,26,26);}if(s.kind==='prize')drawPrize('item','bell',0,30,.33);ctx.restore();});
 ctx.restore();
 uiCircle(0,0,R+2,null,'#ffe08a',5);uiCircle(0,0,22,'#ffd23f','#3a1a00',3);ctx.fillStyle='#3a1a00';ctx.font='900 12px Impact, system-ui';ctx.fillText('SPIN',0,1);
 ctx.fillStyle='#fff';ctx.strokeStyle='#2a0b3e';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-14,-R-14);ctx.lineTo(14,-R-14);ctx.lineTo(0,-R+12);ctx.closePath();ctx.fill();ctx.stroke();
 if(Wh.result){const s=W2_WHEEL[Wh.i],txt=s.n?'+'+s.n+' COINS!':s.kind==='rain25'?'RAIN 25!':s.kind==='quake'?'QUAKE COIN!':s.kind==='prize'?'RARE PRIZE!':'UH OH… YAWN';ctx.save();ctx.translate(0,R+38);const k=1+.08*Math.sin(t*10);ctx.scale(k,k);wildText(txt,0,0,34,s.kind==='yawn'?'#d8c8ee':'#ffd23f','#2a0b3e',7);ctx.restore();}
 ctx.restore();
}
// Developer: Music volume and Pusher sound (all boards), and the Wild 2 wheel buttons.
function w2DevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 const dial=(k,label)=>'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><button data-w2="'+k+'" data-dir="-1" style="'+b+'">−</button><span style="flex:1;text-align:center">'+label+': '+(W2[k]>0?Math.round(W2[k]*100)+'%':'off')+'</span><button data-w2="'+k+'" data-dir="1" style="'+b+'">+</button></div>';
 return '<div class="set" id="w2-dev"><h3><span>Wild 2 and sound</span><span>tuning</span></h3>'+dial('music','Music volume')+dial('pusher','Pusher sound')+
  '<button id="w2-spin" class="wide">Wild 2: spin the wheel now</button>'+W2_WHEEL.map((s,i)=>'<button data-slice="'+i+'" class="wide">Wheel lands on '+s.label+'</button>').join('')+
  '<button id="w2-visitor" class="wide">Wild 2: show a visitor now</button><button id="w2-dev-reset" class="wide">Sound defaults (music 50%, pusher 50%)</button>'+
  '<p style="margin:4px 0;font-size:13px;opacity:.8">The wheel buttons open Wild 2 if needed and spin right after GO. Visitors seen: '+Object.keys(W2_VISITORS).filter(k=>W2_SEEN[k]).map(k=>W2_VISITORS[k].name).join(', ')+'.</p><button id="w2-visitors-clear" class="wide">Clear visitors seen</button></div>';}
function w2ForceWheel(i){
 w2ForceSlice=i==null?null:i;
 if(!WILD.on||!WILD.v2){if(WILD.on)wildExit();wild2Enter();}
 if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();wildStartCountdown();}
 WILD.wheelForce=true;panel.style.display='none';
}
function w2StartWheelNow(){ // a dance break that has already been danced perfectly: straight to the wheel
 const beat=60/DANCE.bpm;danceStart();const D=WILD.dance;D.p0=danceNow()-D.n*beat-1;D.hits=D.n;D.bank={coin:0,rain5:0,rain10:0};D.sched=D.n+1;danceFinale(D);D.stage='wheel';D.st=0;D.perfect=true;
}
wildDevHtml=function(){return __w2DevHtml()+w2DevHtml();};
wildDevBind=function(panel){__w2DevBind(panel);const box=panel.querySelector&&panel.querySelector('#w2-dev');if(!box)return;
 const reopen=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 for(const btn of box.querySelectorAll('[data-w2]'))btn.onclick=()=>{const k=btn.dataset.w2;W2[k]=Math.min(1,Math.max(0,Math.round((W2[k]+ +btn.dataset.dir*.1)*10)/10));w2Save();try{diagEvent('w2-tuning',k+'='+W2[k]);}catch(e){}reopen();};
 for(const btn of box.querySelectorAll('[data-slice]'))btn.onclick=()=>w2ForceWheel(+btn.dataset.slice);
 box.querySelector('#w2-spin').onclick=()=>w2ForceWheel(null);
 box.querySelector('#w2-visitor').onclick=()=>{panel.style.display='none';if(!WILD.on||!WILD.v2){if(WILD.on)wildExit();wild2Enter();}for(const id of WILD_COLLECTION)if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;(WILD.order||(WILD.order=[])).push(id);}if(WILD.phase!=='end'){board.status='playing';wildFinish(true);}};
 box.querySelector('#w2-dev-reset').onclick=()=>{Object.assign(W2,W2_DEFAULTS);try{localStorage.removeItem(W2_KEY);}catch(e){}reopen();};
 box.querySelector('#w2-visitors-clear').onclick=()=>{W2_SEEN={};try{localStorage.removeItem(W2_VISITOR_KEY);}catch(e){}reopen();};};
// a forced wheel starts as soon as the round is playing
const __w2Tick2=wildTick;
wildTick=function(dt){__w2Tick2(dt);if(WILD.on&&WILD.v2&&WILD.wheelForce&&WILD.phase==='play'&&board.status==='playing'&&!WILD.dance&&sweepTime===0&&catquakeTime===0&&panel.style.display!=='block'){WILD.wheelForce=false;w2StartWheelNow();}};
