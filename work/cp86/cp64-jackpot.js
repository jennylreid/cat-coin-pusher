// ---------- CP-64 Jackpot cascade (UAT 86, Jenny Nov 17) ----------
// The wheel's JACKPOT slice (about 2%) starts a short, timed cascade of bonus drops (mostly prizes) instead of 25 coins:
// the "bonkers" look of the CP-59 bug, but a state with its own end and caps. The round timer, Turbo, the bonus clock and
// the out-of-coins clock are held while it runs; goal prizes it drops count as usual. A win during it waits for its end.
// Drops use the normal bonus marker, whistle and landing (wildLandBonus) and the frozen pickup as it is.
const CP64={drops:8.4,  // s of drops; the tail (last drops landing) brings it to about 9-9.5 s
 gap:.16,               // s between drops (about 6 a second)
 maxDrops:48,           // drops per Jackpot at most
 maxPieces:210,         // no new drop while the board holds this many pieces
 maxPrizes:28,          // ... or this many prizes
 maxQuakes:2,           // Quake coins per Jackpot at most
 hard:11,               // s: it always ends by then, whatever happens
 turbo:true,            // the pusher runs at Turbo speed (WILD_TURBO_PERIOD) while it lasts, so the prizes spill
 stats:null};
function cp64Side(){return !!(WILD.dance||WILD.toss||WILD.chase||WILD.petGame||WILD.pounce);}
function cp64Start(){
 WILD.jpPending=false;
 WILD.jp={t:0,next:0,n:0,prizes:0,rain:0,quakes:0,skipped:0,peak:0,heldDance:WILD.dancePending||null,heldForce:!!WILD.danceForce,period:PUSH_PERIOD};
 if(CP64.turbo&&PUSH_PERIOD>WILD_TURBO_PERIOD)wildSetPeriod(WILD_TURBO_PERIOD);
 WILD.dancePending=null;WILD.danceForce=false;
 callout('JACKPOT!',{color:'#ffd23f',dur:1.8});wildConfetti(60);
 try{diagEvent('jackpot','start left='+WILD.left.toFixed(1));}catch(e){}
}
function cp64End(why){
 const J=WILD.jp;if(!J)return;WILD.jp=null;
 if(PUSH_PERIOD!==J.period)wildSetPeriod(J.period);
 CP64.stats={n:J.n,prizes:J.prizes,rain:J.rain,quakes:J.quakes,skipped:J.skipped,peak:J.peak,t:+J.t.toFixed(2),why};
 if(WILD.phase==='play'){WILD.lastPay=time;
  if(WILD.winHeld)WILD.dancePending=null; // a held win goes first; the round is won, so a waiting Dance break is skipped
  else{if(J.heldDance&&!WILD.dancePending)WILD.dancePending=J.heldDance;if(J.heldForce)WILD.danceForce=true;}
  if(why==='done')callout('JACKPOT OVER',{color:'#ffe08a',dur:1.2});}
 try{diagEvent('jackpot','end '+why+' drops='+J.n+' prizes='+J.prizes);}catch(e){}
}
function cp64Drop(J){
 let pieces=0,prizes=0;for(const b of bodies)if(!b.dead){pieces++;if(b.kind==='item'&&!b.bottle)prizes++;}
 pieces+=WILD.incoming.length;J.peak=Math.max(J.peak,pieces);
 if(pieces>=CP64.maxPieces||prizes>=CP64.maxPrizes){J.skipped++;return;}
 const r=Math.random();let kind=r<.8?'item':r<.9?'rain5':'quake';
 if(kind==='quake'&&J.quakes>=CP64.maxQuakes)kind='item';
 if(kind==='rain5'&&cp61Crowded())kind='item'; // CP-61: no rain on a crowded board
 let id=kind==='item'?WILD_COLLECTION[Math.random()*WILD_GOAL|0]:null;
 if(id&&id===WILD.star&&!wildMissing().includes(id)){const o=WILD_COLLECTION.filter(i=>i!==WILD.star);id=o[Math.random()*o.length|0];} // one star prize, as in normal bonus drops
 const front=Math.random()<.7,y=CP64.y?rand(...CP64.y):front?rand(650,740):rand(500,650),x=200+rand(-1,1)*(tableHalfAt(y)-(front?85:50)); // mostly near the front edge, away from the sides
 WILD.incoming.push({kind,id,x,y,t:rand(.55,.9),t0:.9,jp:true});WILD.bonusN++;sfx.wild('whistle',1);
 J.n++;if(kind==='item')J.prizes++;else if(kind==='quake')J.quakes++;else J.rain++;
}
// the round's tick: the Jackpot holds the clocks while it runs
const __cp64Tick=wildTick;
wildTick=function(dt){
 if(!WILD.on){WILD.jp=null;WILD.jpPending=false;return __cp64Tick(dt);}
 const paused=inventoryOpen||panel.style.display==='block'||cp51Paused;
 if(WILD.jp&&(WILD.phase!=='play'||board.status!=='playing'))cp64End('round over');
 if(!paused&&WILD.jpPending&&!WILD.jp&&!cp64Side()&&WILD.phase==='play'&&board.status==='playing')cp64Start();
 const J=WILD.jp;if(!J||paused)return __cp64Tick(dt);
 if(WILD.dancePending){if(!J.heldDance)J.heldDance=WILD.dancePending;WILD.dancePending=null;} // a full Happy Cat meter waits for the end
 if(WILD.danceForce){J.heldForce=true;WILD.danceForce=false;}
 // hold the clocks (kept away from 0 inside, so nothing can run out during it; put back after)
 const left=WILD.left,turbo=WILD.turbo,next=WILD.nextBonus;
 WILD.left=Math.max(left,1);if(turbo>0)WILD.turbo=Math.max(turbo,1);WILD.nextBonus=Math.max(next,1);WILD.lastPay=time;
 __cp64Tick(dt);
 if(WILD.phase==='play'){WILD.left=left;if(WILD.turbo>0)WILD.turbo=turbo;WILD.nextBonus=next;WILD.lastPay=time;}
 if(WILD.jp!==J)return;
 J.t+=dt;
 if(J.t<CP64.drops){J.next-=dt;while(J.next<=0&&J.n<CP64.maxDrops){J.next+=CP64.gap;cp64Drop(J);}}
 else if(!WILD.incoming.some(o=>o.jp)||J.t>=CP64.hard)cp64End(J.t>=CP64.hard?'hard stop':'done');
};
// a win during the Jackpot waits for its end (as one during a Dance break does); anything else ends it at once
const __cp64Finish=wildFinish;
wildFinish=function(win,reason){
 if(win&&WILD.on&&(WILD.jp||WILD.jpPending)&&WILD.phase==='play'){
  if(!WILD.jpWinHeld){WILD.jpWinHeld=true;WILD.winHeld=true;callout('ALL '+WILD_GOAL+'! JACKPOT!',{color:'#7dff6a',dur:1.4});try{diagEvent('jackpot','win held');}catch(e){}}
  return;}
 WILD.jpWinHeld=false;if(WILD.jp)cp64End('round over');WILD.jpPending=false;return __cp64Finish(win,reason);
};
const __cp64Reset=wildReset,__cp64Exit=wildExit;
wildReset=function(){WILD.jp=null;WILD.jpPending=false;WILD.jpWinHeld=false;return __cp64Reset();};
wildExit=function(){WILD.jp=null;WILD.jpPending=false;WILD.jpWinHeld=false;return __cp64Exit();};
// the wheel: JACKPOT (about 2%) starts the cascade once the dance break is over; the other slices are unchanged
for(const s of W2_WHEEL){if(s.kind==='jackpot'){s.label='JACKPOT';s.w=.02;}else if(s.kind==='quake')s.w=.22;else if(s.kind==='again')s.w=.17;else if(s.kind==='prize')s.w=.17;}
{let y=0;for(const s of W2_WHEEL)if(s.kind==='yawn')s.w=y++?.12:.13;}
const __cp64Apply=w2ApplySlice;
w2ApplySlice=function(s,D){if(s.kind==='jackpot'){WILD.jpPending=true;sfx.wild('win',1);try{diagEvent('jackpot','wheel');}catch(e){}return;}return __cp64Apply(s,D);};
// Developer: start a Jackpot now (opens a round if needed; starts right after GO, or after a running side game)
function cp64StartNow(){
 if(!WILD.on)wildEnter();
 if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();wildStartCountdown();}
 WILD.jpPending=true;panel.style.display='none';try{diagEvent('jackpot','start-now');}catch(e){}
}
const __cp64DevHtml=wildDevHtml,__cp64DevBind=wildDevBind;
wildDevHtml=function(){return __cp64DevHtml().replace('<button id="w2-spin" class="wide">','<button id="cp64-now" class="wide">Start a Jackpot now</button><button id="w2-spin" class="wide">');};
wildDevBind=function(panel){__cp64DevBind(panel);const b=panel.querySelector&&panel.querySelector('#cp64-now');if(b)b.onclick=cp64StartNow;};
// Jenny (Nov 17): during a Jackpot a prize over the side is lost as normal, but shows no "LOST THE …!" banner
const __cp64Gutter=gutterOff;
gutterOff=function(b,x){if(!WILD.jp)return __cp64Gutter(b,x);const co=callout;callout=function(t,o){if(/^LOST THE /.test(String(t)))return;return co.apply(this,arguments);};
 try{return __cp64Gutter(b,x);}finally{callout=co;}};
