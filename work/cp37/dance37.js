// ---------- CP-36 Dance break (Wild board prototype, UAT 37) ----------
// A happy meter fills one notch per prize; a rare music-note coin fills it at once. When it's full the round timer
// pauses and the cat does its Dancing pose (one move, looped) to a beat generated in code. Each tap on the beat banks a
// gold coin (sometimes a rain coin); off-beat taps bank nothing and cost the next beat. When the music stops, the cat
// roars, the screen shakes and everything banked pours onto the board. Wild board only; Boards 1-3 never reach this.
const DANCE_DEFAULTS=Object.freeze({notches:4,len:9,bpm:109,window:.13,latency:.05,rainChance:.12,move:1});
const DANCE={...DANCE_DEFAULTS},DANCE_KEY='catpusher.uat.dance.v1';
// [min, max, step, label, unit]
const DANCE_DIALS={notches:[2,8,1,'Prizes per happy meter',''],len:[5,15,.5,'Dance length',' s'],bpm:[80,140,3,'Beat tempo',' BPM'],
 window:[.05,.25,.01,'On-beat window','± s'],latency:[0,.2,.01,'Tap delay allowance',' s'],rainChance:[0,.5,.02,'Rain-coin chance','%'],move:[1,3,1,'Dance move','']};
try{const d=JSON.parse(localStorage.getItem(DANCE_KEY)||'null');if(d)for(const k in DANCE_DIALS)if(Number.isFinite(+d[k]))DANCE[k]=Math.min(DANCE_DIALS[k][1],Math.max(DANCE_DIALS[k][0],+d[k]));}catch(e){}
function danceSave(){try{localStorage.setItem(DANCE_KEY,JSON.stringify(DANCE));}catch(e){}}
const DANCE_COUNT_IN=3; // beats of count-in before the dance (the pose's own intro plays over them)
const DANCE_BASS=[[130.81,196],[110,164.81],[87.31,130.81],[98,146.83]]; // C Am F G
const DANCE_LEAD=[[523.25,659.25,783.99,659.25],[440,523.25,659.25,523.25],[349.23,440,523.25,440],[392,493.88,587.33,493.88]];

// --- the music-note coin: a code-drawn coin like the rain coins (same physics), deep blue with a gold double note ---
RAIN.note={n:0,note:true,r:33,half:4.4,face:['#e6f0ff','#3d6bff','#141f66'],edge:'#17237a'};
EDGE.note=RAIN.note.edge;PRIZE_OPAQUE.note=.95;PRIZE_ASPECT.note=1;
const __danceRainFace=rainFace;
rainFace=function(g,c,r,kind){
 if(!RAIN[kind]||!RAIN[kind].note)return __danceRainFace(g,c,r,kind);
 const [c1,c2,c3]=RAIN[kind].face;let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,c1);gr.addColorStop(.5,c2);gr.addColorStop(1,c3);
 g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();
 g.lineWidth=r*.1;g.strokeStyle='#ffd23f';g.beginPath();g.arc(c,c,r*.86,0,7);g.stroke();
 g.fillStyle='rgba(255,236,150,.9)';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.arc(c+Math.cos(a)*r*.72,c+Math.sin(a)*r*.72,r*.045,0,7);g.fill();}
 // a beamed pair of eighth notes
 const s=r/30;g.save();g.translate(c-1*s,c-3*s);g.fillStyle='#ffd23f';g.strokeStyle='#7a4a00';g.lineWidth=1.6*s;
 const head=(x,y)=>{g.beginPath();g.ellipse(x,y,6.2*s,4.6*s,-.45,0,7);g.fill();g.stroke();};
 g.beginPath();g.moveTo(-5*s,9*s);g.lineTo(-5*s,-14*s);g.lineTo(13*s,-18*s);g.lineTo(13*s,5*s);g.lineTo(10*s,5*s);g.lineTo(10*s,-12.5*s);g.lineTo(-2*s,-9.5*s);g.lineTo(-2*s,9*s);g.closePath();g.fill();g.stroke();
 head(-9*s,10*s);head(6*s,6*s);g.restore();
 g.font='bold '+Math.round(r*.19)+'px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff6d0';g.fillText('DANCE',c,c+r*.6);
};

// --- state on WILD ---
function danceClear(roll){Object.assign(WILD,{happy:0,happyT:9,dance:null,dancePending:null,danceForce:false,noteN:0,noteAt:roll?2+(Math.random()*4|0):3,dances:0,danceCoins:0,danceRainCoins:0});}
danceClear();
function danceNow(){return performance.now()/1000;}
function danceActive(){return !!(WILD.on&&WILD.dance);}
function danceShake(px){try{cv.style.transform=px?'translate('+px[0].toFixed(1)+'px,'+px[1].toFixed(1)+'px)':'';}catch(e){}}
function danceEndVisuals(){if(pawDance&&pawDance.dbreak)stopPawDance();danceShake(null);}

// The pose follows the music: one bar of 4 beats is one 2.2 s cycle of the chosen move, the count-in plays its intro.
const __dancePhase=pawDancePhase;
pawDancePhase=function(){
 if(!pawDance||!pawDance.dbreak||!WILD.dance)return __dancePhase();
 const D=WILD.dance,x=(danceNow()-D.p0)/D.beat; // beats from the first dance beat
 if(x<0)return {intro:true,t:Math.max(0,(x+DANCE_COUNT_IN)/DANCE_COUNT_IN)*1.667};
 return {intro:false,index:D.move,t:(x%4)/4*2.2};
};
function danceKeepPose(){
 happyUntil=0;
 if(sweepTime>0||catquakeTime>0)return;
 if(!pawDance||!pawDance.dbreak){stopTickle();stopPawDance();pawDanceToken++;pawDance={started:time,silent:true,index:WILD.dance.move,switched:true,anchor:0,dbreak:true};}
}

// --- starting, tapping, finishing ---
function danceStart(){
 const beat=60/DANCE.bpm,n=Math.max(4,Math.round(DANCE.len/beat));
 stopDrops();holding=false;
 WILD.dance={p0:danceNow()+.25+DANCE_COUNT_IN*beat,beat,n,move:DANCE.move,window:DANCE.window,latency:DANCE.latency,rainChance:DANCE.rainChance,
  sched:-DANCE_COUNT_IN,judged:{},blocked:-99,hits:0,misses:0,streak:0,best:0,bank:{coin:0,rain5:0,rain10:0},fx:[],ringT:9,
  phase:'count',finT:0,queue:[],spawnT:0,spawnGap:.05,started:time,pausedAt:null};
 WILD.happy=DANCE.notches;WILD.dancePending=null;WILD.dances++;
 danceKeepPose();sfx.dance('full',1);try{navigator.vibrate&&navigator.vibrate(45);}catch(e){}
 try{diagEvent('dance','start bpm='+DANCE.bpm+' beats='+n);}catch(e){}
}
function danceBanked(D){return D.bank.coin+D.bank.rain5+D.bank.rain10;}
function danceTap(e){
 const D=WILD.dance;if(!D||D.phase==='finale')return;
 const now=danceNow(),stamp=e&&Number.isFinite(e.timeStamp)&&e.timeStamp>0&&Math.abs(performance.now()-e.timeStamp)<500?e.timeStamp/1000:now;
 const adj=stamp-D.latency,k=Math.round((adj-D.p0)/D.beat),err=adj-(D.p0+k*D.beat);
 if(k<0||k>=D.n)return; // count-in and after the music: nothing
 if(Math.abs(err)<=D.window){
  if(D.judged[k])return; // a second tap on a beat already banked: ignored
  if(D.blocked===k){D.judged[k]='miss';D.misses++;D.streak=0;danceFx('BLOCKED','#b9a6d6');sfx.dance('miss',1);return;}
  D.judged[k]='hit';D.hits++;D.streak++;D.best=Math.max(D.best,D.streak);D.ringT=0;
  const r=Math.random(),kind=r<D.rainChance?(Math.random()<.25?'rain10':'rain5'):'coin';D.bank[kind]++;
  D.fx.push({kind,t:0,x:200,y:DANCE_LANE_Y});
  if(kind==='coin'){sfx.dance('hit',1,0,D.streak);danceFx(D.streak>=8&&D.streak%8===0?'GROOVY!':'+1','#ffd23f');}
  else{sfx.dance('hitRain',1);danceFx(kind==='rain10'?'+RAIN 10!':'+RAIN 5!',kind==='rain10'?'#e88aff':'#5ef0c0');}
  return;
 }
 // Off the beat: nothing banked, and the next beat can't be banked (so tapping fast doesn't pay).
 D.blocked=err<0?k:k+1;D.misses++;D.streak=0;danceFx('off beat','#b9a6d6');sfx.dance('miss',1);
}
function danceFx(text,color){const D=WILD.dance;if(D)D.fx.push({text,color,t:0,x:200,y:DANCE_LANE_Y-50});}
function danceSchedule(D){
 // Music: four-on-the-floor kick, snare and clap on 2 and 4, off-beat hats, a C-Am-F-G bass and a little lead.
 // Each beat is scheduled ahead on the audio clock, early by the device's output delay so it is heard on the indicator.
 const now=danceNow(),lat=sfx.danceLatency();
 while(D.sched<=D.n&&D.p0+D.sched*D.beat-now<.15+lat){
  const k=D.sched,d=D.p0+k*D.beat-now-lat,h=D.beat/2;D.sched++;
  if(k<0){sfx.dance('count',1,d,k===-1?1600:1200);sfx.dance('hat',.8,d+h);continue;}
  if(k===D.n){sfx.dance('stop',1,d);continue;}
  const b=k%4,bar=(k/4|0)%4;
  sfx.dance('kick',1,d);if(k===0)sfx.dance('crash',.8,d);
  if(b===1||b===3){sfx.dance('snare',1,d);if(k>=4)sfx.dance('clap',.7,d);}
  sfx.dance('hat',1,d+h);if(k>=8)sfx.dance('hat',.5,d+h/2),sfx.dance('hat',.5,d+h*1.5);
  sfx.dance('bass',1,d,DANCE_BASS[bar][b%2]);
  if(k>=4){const m=DANCE_LEAD[bar];sfx.dance('lead',1,d,m[b]);if(b!==3)sfx.dance('lead',.8,d+h,m[(b+1)%4]*(k>=12?2:1));}
 }
}
function danceTick(dt,paused){
 const D=WILD.dance;if(!D)return;
 if(paused){if(D.pausedAt==null)D.pausedAt=danceNow();return;}
 if(D.pausedAt!=null){const gap=danceNow()-D.pausedAt;D.p0+=gap;D.pausedAt=null;} // Settings or the bag paused the dance
 WILD.lastPay=time;
 for(let i=D.fx.length-1;i>=0;i--){D.fx[i].t+=dt;if(D.fx[i].t>.9)D.fx.splice(i,1);}
 D.ringT+=dt;
 if(D.phase!=='finale'){
  danceKeepPose();danceSchedule(D);
  const x=(danceNow()-D.p0)/D.beat;
  if(x>=0&&D.phase==='count')D.phase='dance';
  // a beat that passed without a tap breaks the streak
  const last=Math.floor(x-D.window/D.beat-D.latency/D.beat);if(last>=0&&last<D.n&&!D.judged[last]){D.judged[last]='none';D.streak=0;}
  if(x>=D.n)danceFinale(D);
  return;
 }
 D.finT+=dt;
 const sh=Math.max(0,1-D.finT/.9);danceShake(sh>0?[rand(-1,1)*9*sh,rand(-1,1)*7*sh]:null);
 if(D.finT>=.15){D.spawnT-=dt;while(D.spawnT<=0&&D.queue.length){D.spawnT+=D.spawnGap;danceSpawn(D.queue.shift());}}
 if(!D.queue.length&&D.finT>=1.4){WILD.dance=null;WILD.happy=0;danceShake(null);WILD.happyT=9;
  try{diagEvent('dance','end hits='+D.hits+' misses='+D.misses+' bank='+danceBanked(D));}catch(e){}}
}
function danceFinale(D){
 D.phase='finale';D.finT=0;stopPawDance();lunge=1;danceShake(null);
 const n=danceBanked(D);sfx.dance('roar',1,.05);
 // rain coins first (they land in the middle to be pushed off), then the gold pours in thick
 for(let i=0;i<D.bank.rain10;i++)D.queue.push('rain10');for(let i=0;i<D.bank.rain5;i++)D.queue.push('rain5');for(let i=0;i<D.bank.coin;i++)D.queue.push('coin');
 D.spawnGap=n?Math.max(.03,Math.min(.07,1.1/n)):.05;
 WILD.danceCoins+=D.bank.coin;WILD.danceRainCoins+=D.bank.rain5+D.bank.rain10;WILD.rained+=D.bank.coin;
 if(n){callout(D.bank.rain5+D.bank.rain10?'DANCE RAIN ×'+n+'!':'COIN RAIN ×'+n+'!',{color:'#ffd23f',dur:1.4});sfx.dance('pour',1,.1);wildConfetti(Math.min(80,20+n*3));}
 else callout('MISSED THE BEAT!',{color:'#b9a6d6',dur:1.2});
}
function danceSpawn(kind){
 if(kind==='coin'){const y=rand(PUSH_MAX+30,T.FRONT-120),x=200+rand(-1,1)*(tableHalfAt(y)-COIN_R-6),h=rand(240,360);
  const b=addCoin('coin',null,x,h,y,randomTurn(rand(.05,.4)),{x:0,y:-3,z:0},{x:rand(-2,2),y:rand(-4,4),z:rand(-2,2)});
  b.rb.enableCcd(true);b.deliveryStartHeight=h;b.rain=true;if(Math.random()<.35)sfx.wild('drip',.8);return;}
 const y=rand(470,600),x=200+rand(-1,1)*(tableHalfAt(y)-50),h=320;
 const b=addCoin(kind,null,x,h,y,randomTurn(rand(.05,.3)),{x:0,y:-4,z:0},{x:0,y:rand(-3,3),z:0});
 b.rb.enableCcd(true);b.deliveryStartHeight=h;b.wildBonus=true;b.wildLandAt=time;
 const p=screenOf(x,y,0);rings.push({x:p.x,y:p.y,t:0,s:p.s});sfx.wild('thud',.8);
}
function danceFill(n,x){
 const before=WILD.happy;WILD.happy=Math.min(DANCE.notches,WILD.happy+n);if(WILD.happy===before)return;WILD.happyT=0;
 if(WILD.happy>=DANCE.notches){sfx.dance('full',1);if(!WILD.dancePending)WILD.dancePending={f:treatAwards[treatAwards.length-1]||null,wait:0};}
 else sfx.dance('notch',1,0,WILD.happy);
}

// --- hooks (each passes straight through when the Wild board is off) ---
const __danceReset=wildReset,__danceExit=wildExit,__danceFinish=wildFinish,__dancePrize=wildPrizeCollected,__danceRain=wildRainCollected,
 __danceBonus=wildScheduleBonus,__danceLand=wildLandBonus,__danceTickW=wildTick,__dancePointer=wildPointer,__danceHud=drawWildHud,__danceDrawW=wildDraw;
wildReset=function(){danceEndVisuals();__danceReset();const force=WILD.danceForce;danceClear(true);WILD.danceForce=force;};
wildExit=function(){danceEndVisuals();danceClear();return __danceExit();};
wildFinish=function(win,reason){if(WILD.dance){const D=WILD.dance;WILD.dance=null;WILD.dancePending=null;danceEndVisuals();try{diagEvent('dance','cut hits='+D.hits);}catch(e){}}return __danceFinish(win,reason);};
wildPrizeCollected=function(b,x){__dancePrize(b,x);if(WILD.phase==='play'&&board.status==='playing')danceFill(1,x);};
wildRainCollected=function(b,x){
 if(b.kind!=='note')return __danceRain(b,x);
 queueTreatAward(b.kind,x,b);callout('MUSIC NOTE!',{color:'#7db8ff',dur:.9});danceFill(DANCE.notches,x);
};
wildScheduleBonus=function(){
 // About one music-note coin a round: it replaces one bonus drop (between the 2nd and 5th), unless a lost prize needs replacing.
 if(!wildMissing().length&&((WILD.noteN===0&&WILD.bonusN+1>=WILD.noteAt)||(WILD.noteN===1&&Math.random()<.06))){
  const y=rand(430,620),x=200+rand(-1,1)*(tableHalfAt(y)-50);
  WILD.incoming.push({kind:'note',id:null,x,y,t:.9,t0:.9});WILD.bonusN++;WILD.noteN++;sfx.wild('whistle',1);return;
 }
 return __danceBonus();
};
wildLandBonus=function(o){__danceLand(o);if(o.kind==='note'&&floats.length)floats[floats.length-1].text='MUSIC NOTE!';};
wildTick=function(dt){
 if(!WILD.on)return __danceTickW(dt);
 const paused=inventoryOpen||panel.style.display==='block';
 if(WILD.danceForce&&WILD.phase==='play'&&board.status==='playing'&&!paused){WILD.danceForce=false;if(!WILD.dance)WILD.dancePending={f:null,wait:9};}
 WILD.happyT+=dt;
 if(WILD.dancePending&&!WILD.dance&&!paused){const P=WILD.dancePending;P.wait+=dt;const f=P.f;
  if(WILD.phase==='play'&&board.status==='playing'&&sweepTime===0&&catquakeTime===0&&(!f||f.arrived||f.t>=f.tr+f.tm||P.wait>1.3))danceStart();}
 if(!WILD.dance||WILD.phase!=='play'){if(WILD.dance&&WILD.phase!=='play'){WILD.dance=null;danceEndVisuals();}return __danceTickW(dt);}
 // The round timer, Turbo and the bonus-drop clock pause during the dance; everything else keeps going.
 const left=WILD.left,turbo=WILD.turbo,next=WILD.nextBonus;
 __danceTickW(dt);
 if(WILD.phase==='play'){WILD.left=left;if(WILD.turbo>0)WILD.turbo=turbo;WILD.nextBonus=next;}
 if(WILD.dance)danceTick(dt,paused);
};
wildPointer=function(e,p){
 if(!WILD.on||!WILD.dance||WILD.phase!=='play'||inventoryOpen||!world)return __dancePointer(e,p);
 if(contains(wildButton(),p))return __dancePointer(e,p); // EXIT still works
 const hud=hudLayout();if(p.y>hud.settingsY-20&&p.y<hud.settingsY+12&&p.x>hud.settingsX-78&&p.x<hud.settingsX+6)return false; // Settings
 danceTap(e);return true; // every other tap is a dance tap: no coin drops during the break
};
const DANCE_LANE_Y=468;
drawWildHud=function(hud){
 __danceHud(hud);
 // the happy meter, right of the power buttons
 const n=DANCE.notches,full=WILD.happy>=n||!!WILD.dance,x0=W-Math.max(8,hud.right+10)-124,y=hud.bannerY,w=124,seg=(w-24)/n;
 ctx.save();ctx.textBaseline='middle';ctx.textAlign='left';
 const pulse=full?.5+.5*Math.sin(performance.now()/110):0;
 ctx.font='bold 11px system-ui';ctx.fillStyle=full?'#ffd0f4':'#ffc8e8';ctx.fillText(WILD.dance?'DANCE!':'HAPPY CAT',x0+24,y-13);
 // a little heart
 ctx.fillStyle=full?'rgba(255,'+(90+80*pulse|0)+',200,1)':'#ff6ab8';ctx.beginPath();const hx=x0+10,hy=y+1,hs=7+(WILD.happyT<.3?3*(1-WILD.happyT/.3):0)+pulse*1.5;
 ctx.moveTo(hx,hy+hs*.75);ctx.bezierCurveTo(hx-hs*1.3,hy-hs*.2,hx-hs*.6,hy-hs*1.2,hx,hy-hs*.45);ctx.bezierCurveTo(hx+hs*.6,hy-hs*1.2,hx+hs*1.3,hy-hs*.2,hx,hy+hs*.75);ctx.fill();
 let level=WILD.happy;
 if(WILD.dance){const D=WILD.dance;level=D.phase==='finale'?0:n*Math.max(0,Math.min(1,1-(danceNow()-D.p0)/(D.n*D.beat)));} // drains as the dance runs
 for(let i=0;i<n;i++){const sx=x0+24+i*seg,fillAmt=Math.max(0,Math.min(1,level-i)),pop=!WILD.dance&&i===WILD.happy-1&&WILD.happyT<.35?1+.35*Math.sin(WILD.happyT/.35*Math.PI):1;
  ctx.save();ctx.translate(sx+seg/2,y);ctx.scale(pop,pop);uiRound(-seg/2+1,-7,seg-2,14,5,'rgba(40,16,50,.9)','#ff9ad8',1.2);
  if(fillAmt>0){uiRound(-seg/2+1,-7,(seg-2)*fillAmt,14,5,full?'rgba(255,'+(120+100*pulse|0)+',220,1)':'#ff5fb0');}
  ctx.restore();}
 if(WILD.dance){ctx.fillStyle='#ffd0f4';ctx.fillRect(hud.left+78,y-6,3.5,12);ctx.fillRect(hud.left+84,y-6,3.5,12);} // round timer paused
 ctx.restore();
};
wildDraw=function(){__danceDrawW();if(WILD.on&&WILD.dance&&!inventoryOpen)danceDraw();};
function danceCoinIcon(x,y,r){uiCircle(x,y,r,'#f5c632','#a8740c',1.4);uiCircle(x,y,r*.6,'#ffe78a');}
function danceDraw(){
 const D=WILD.dance,now=danceNow(),x=(now-D.p0)/D.beat,Y=DANCE_LANE_Y;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 const fin=D.phase==='finale',fade=fin?Math.max(0,1-D.finT/.5):Math.min(1,(time-D.started)/.25);
 if(fade>0){ctx.globalAlpha=fade;
  // the lane: notes slide in from both sides and meet the ring on each beat
  uiRound(16,Y-34,368,68,22,'rgba(26,10,44,.78)','#ff9ad8',2);
  ctx.save();ctx.beginPath();ctx.rect(20,Y-32,360,64);ctx.clip();
  for(let k=Math.max(-DANCE_COUNT_IN,Math.floor(x)-1);k<=Math.min(D.n-1,Math.floor(x)+3);k++){const u=k-x;if(u<-.3||u>2.6)continue;
   const j=D.judged[k],c=k<0?'#9a8ab8':j==='hit'?'#ffd23f':j==='miss'||j==='none'?'#6a5a7a':'#ff7ad5',a=u<0?Math.max(0,1+u/.3):1;ctx.globalAlpha=fade*a;
   for(const s of [-1,1]){const nx=200+s*u*68;danceNoteGlyph(nx,Y,u<0?1:.85,c);}}
  ctx.restore();ctx.globalAlpha=fade;
  // the ring: pulses on every beat, flashes gold on a banked beat
  const ph=x-Math.round(x),near=Math.max(0,1-Math.abs(ph)*4),hitFlash=Math.max(0,1-D.ringT/.25);
  ctx.lineWidth=3+3*near;ctx.strokeStyle=hitFlash>0?'#ffd23f':'#ffffff';ctx.beginPath();ctx.arc(200,Y,22+5*near+6*hitFlash,0,7);ctx.stroke();
  if(hitFlash>0){ctx.globalAlpha=fade*hitFlash*.5;uiCircle(200,Y,22+10*hitFlash,'#ffd23f');ctx.globalAlpha=fade;}
  // beat dots 1-2-3-4
  const bi=x<0?-1:Math.floor(x+.5)%4;for(let i=0;i<4;i++)uiCircle(170+i*20,Y+27,3.2,i===bi?'#ffffff':'rgba(255,255,255,.28)');
  // count-in numbers
  if(x<.5){const u=Math.min(1,(time-D.started)/.3),k=(.6+.4*(1-Math.pow(1-u,3)))*(1+.04*Math.sin(time*9));ctx.save();ctx.globalAlpha=fade*Math.min(1,(.5-x)*2);ctx.translate(200,Y-62);ctx.scale(k,k);ctx.rotate(-.05);wildText('DANCE BREAK!',0,0,46,'#ff7ad5','#2a0b3e',8);ctx.restore();ctx.globalAlpha=fade;}
  if(x<0){const c=Math.ceil(-x);ctx.globalAlpha=fade*Math.min(1,(1-(c+x))*3+.2);wildText(String(c),200,Y-2,40,'#ffd23f','#2a0b3e',6);ctx.globalAlpha=fade;}
  else{ctx.font='bold 11px system-ui';ctx.fillStyle='#ffe0f4';ctx.fillText('TAP ON THE BEAT',200,Y-24);}
  // the dance timer: a bar along the bottom of the lane and the seconds left
  const total=D.n*D.beat,left=Math.max(0,Math.min(total,D.p0+total-now));
  uiRound(36,Y+36,328,7,3.5,'rgba(0,0,0,.45)');if(left>0)uiRound(36,Y+36,328*left/total,7,3.5,'#ff7ad5');
  ctx.font='bold 13px system-ui';ctx.textAlign='right';ctx.fillStyle='#fff';ctx.fillText(Math.ceil(left)+' s',372,Y-1);ctx.textAlign='center';
 }
 ctx.globalAlpha=1;
 // the bank: gold coins and rain coins banked so far, counting up
 const by=Y+80,bank=D.bank,pop=Math.max(0,1-D.ringT/.3);
 if(!fin||D.finT<.3){ctx.globalAlpha=fin?1-D.finT/.3:1;
  uiRound(110,by-20,180,40,20,'rgba(26,10,44,.85)','#ffd23f',2);danceCoinIcon(136,by,12*(1+.3*pop));
  ctx.font='900 24px Impact, "Arial Black", system-ui';ctx.textAlign='left';ctx.fillStyle='#ffe78a';ctx.fillText('× '+bank.coin,154,by+1);
  let rx=226;for(const k of ['rain5','rain10'])if(bank[k]){const sp=sprite(k);ctx.drawImage(sp.cv,rx-11,by-11,22,22);ctx.font='bold 13px system-ui';ctx.fillStyle='#fff';ctx.fillText('×'+bank[k],rx+12,by+1);rx+=34;}
  ctx.font='bold 10px system-ui';ctx.fillStyle='#ffd0f4';ctx.textAlign='center';ctx.fillText(D.streak>=2?'BANK · streak '+D.streak:'BANK',200,by-27);ctx.globalAlpha=1;}
 // banked coins fly from the ring to the bank; words over the lane
 for(const f of D.fx){if(f.kind){const u=Math.min(1,f.t/.35);if(u<1){const fx=200+(136-200)*u,fy=Y+(by-Y)*u-30*Math.sin(u*Math.PI);if(f.kind==='coin')danceCoinIcon(fx,fy,10);else{const sp=sprite(f.kind);ctx.drawImage(sp.cv,fx-12,fy-12,24,24);}}continue;}
  ctx.globalAlpha=Math.max(0,1-f.t/.9);ctx.font='900 '+(f.text.length>5?18:22)+'px Impact, "Arial Black", system-ui';ctx.lineWidth=4;ctx.strokeStyle='#2a0b3e';ctx.strokeText(f.text,f.x,f.y-f.t*28);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y-f.t*28);ctx.globalAlpha=1;}
 ctx.restore();
}
function danceNoteGlyph(x,y,s,c){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=c;ctx.strokeStyle='rgba(20,6,30,.8)';ctx.lineWidth=1.4;
 ctx.beginPath();ctx.ellipse(-3,7,6,4.5,-.45,0,7);ctx.fill();ctx.stroke();ctx.fillRect(1.6,-12,2.6,19);ctx.beginPath();ctx.moveTo(4.2,-12);ctx.quadraticCurveTo(13,-7,9,2);ctx.quadraticCurveTo(10,-6,4.2,-6);ctx.fill();ctx.restore();}

// --- Developer dials (Settings > Developer mode > Dance break), saved on this phone; values go in the performance log ---
function danceDialText(k){const [,,,label,unit]=DANCE_DIALS[k],x=DANCE[k];
 if(k==='window')return label+': ±'+x.toFixed(2)+' s';if(k==='latency')return label+': '+x.toFixed(2)+unit;if(k==='rainChance')return label+': '+Math.round(x*100)+unit;
 if(k==='move')return label+': '+['','paw drum','sway','big paws'][x];return label+': '+(+x.toFixed(2))+unit;}
function danceDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 return '<div class="set" id="dance-dev"><h3><span>Dance break</span><span>tuning</span></h3><button id="dance-now" class="wide">Start dance break now</button>'+Object.keys(DANCE_DIALS).map(k=>'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><button data-dance="'+k+'" data-dir="-1" style="'+b+'">−</button><span style="flex:1;text-align:center">'+danceDialText(k)+'</span><button data-dance="'+k+'" data-dir="1" style="'+b+'">+</button></div>').join('')+'<p style="margin:4px 0;font-size:13px;opacity:.8">Used from the next dance break. "Start dance break now" opens the Wild board and starts one right after GO.</p><button id="dance-dev-reset" class="wide">Dance defaults</button></div>';}
function stepDanceDial(k,dir){const [lo,hi,st]=DANCE_DIALS[k];DANCE[k]=Math.min(hi,Math.max(lo,Math.round((DANCE[k]+dir*st)*1000)/1000));if(k==='notches'&&WILD.happy>=DANCE[k]&&!WILD.dance)WILD.happy=DANCE[k]-1;danceSave();}
function danceStartNow(){
 if(!WILD.on)wildEnter();
 if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();WILD.danceForce=true;wildStartCountdown();}
 else if(!WILD.dance)WILD.danceForce=true;
 panel.style.display='none';try{diagEvent('dance-tuning','start-now');}catch(e){}
}
const __danceDevHtml=wildDevHtml,__danceDevBind=wildDevBind;
wildDevHtml=function(){return __danceDevHtml()+danceDevHtml();};
wildDevBind=function(panel){__danceDevBind(panel);const box=panel.querySelector&&panel.querySelector('#dance-dev');if(!box)return;
 const reopen=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 for(const btn of box.querySelectorAll('[data-dance]'))btn.onclick=()=>{stepDanceDial(btn.dataset.dance,+btn.dataset.dir);try{diagEvent('dance-tuning',btn.dataset.dance+'='+DANCE[btn.dataset.dance]);}catch(e){}reopen();};
 box.querySelector('#dance-now').onclick=danceStartNow;
 box.querySelector('#dance-dev-reset').onclick=()=>{Object.assign(DANCE,DANCE_DEFAULTS);try{localStorage.removeItem(DANCE_KEY);}catch(e){}reopen();};};
