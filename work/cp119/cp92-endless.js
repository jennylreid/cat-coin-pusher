// ---------- CP-92 Endless board (Jenny, Nov 18-19: "We'll have just an open board. You can just play endlessly as long as you
// have coins... on that endless board, you have the ability to reset it... a meter that has to fill before it enables the
// player to start a new board."; "Let's get an endless board in UAT.") ----------
// UAT only. Home > "Endless board" (under Board lab, or in its place when Developer is off) plays the cat you're on, as PLAY
// does, on an open board with no round timer, no goal row and no win or "level complete":
//  - Coin wallet: drops come from a wallet that is kept on this phone between sessions (catpusher.uat.cp92endless.v1).
//    Start 100 coins; +1 every 30 s of real time (app open or closed) up to a cap of 100 (full from empty in 50 minutes).
//    Coins pushed off the front go back into the wallet as they always have (they may take it over the cap; the refill
//    then waits). A coin over the front always counts (PM, Nov 19: no hidden skim); the return is the natural one,
//    measured in tickets/CP-92.md. Empty wallet: no drops, the clock spot reads "+1 0:23" and the board says "Out of coins".
//  - Reset meter: fills by coins played (200 drops). When full, the bar becomes a "NEW BOARD" button. Tapping it (when no
//    power, side game, Yawn or Dance break runs) sweeps the board: a bar crosses from the back to the front, shoving
//    everything off; the sweep pays nothing. Then the next setup is built in front of the player and play goes on.
//    The meter fills at once when the board is nearly empty (fewer than 20 coins on the table for 1.5 s).
//  - Boards: the 10 level layouts in level order, then the 11 lab layouts (Jenny, Nov 18: "You can use them in the
//    rotation. There's nothing special about these."). First pass in that order; once every board has been seen, a reset
//    picks at random from the seen boards (never the one you're on). A board added to the list later is next in line.
//  - Kept as on a level: prizes (to the pantry, with the frozen pickup), the cat's power and side game, bonus drops, rain,
//    the wheel. Each layout keeps its own prize list behind the scenes (the bonus drops still bring back its lost prizes),
//    but nothing is shown as a goal: no goal row, no "2 / 5" counter, no COLLECTION!, no round end of any kind.
//  - Side-game coins: see "side-game coins on the endless board" below (by coins played; laser banked and kept).
//  - Home always works: leaving (Home, or any way back to Home) turns the mode off, keeps the wallet, and normal play is
//    the level you were on, rebuilt. The board itself isn't saved; coming back rebuilds the board you were on.
const END={on:false,KEY:'catpusher.uat.cp92endless.v1',START:100,CAP:100,REFILL:30,METER:200,EMPTY_N:20,EMPTY_SEC:1.5,
 SWEEP:{cross:1.25,hold:.55},w:null,sweep:null,emptyT:0,lastSave:0,pulse:-9,stats:{resets:0,auto:0,dropped:0,credited:0}};
const END_LEVELS=PGL_LEVELS.map((L,i)=>'L'+(i+1));
const END_LABS=['tower','edge','pins','wall','mice','red','lanes','cup','bumper','gate','chain'].filter(k=>typeof LAB!=='undefined'&&LAB.B[k]).map(k=>'lab:'+k);
function endOrder(){return END_LEVELS.concat(END_LABS);} // new boards: add them to the end of this list
function endLoad(){if(END.w)return END.w;let w=null;try{w=JSON.parse(localStorage.getItem(END.KEY)||'null');}catch(e){}
 if(!w||typeof w!=='object'||!Number.isFinite(w.coins))w={coins:END.START,t:Date.now(),meter:0,cur:null,seen:[]};
 if(!Array.isArray(w.seen))w.seen=[];if(!Number.isFinite(w.t))w.t=Date.now();if(!Number.isFinite(w.meter))w.meter=0;
 if(!endOrder().includes(w.cur))w.cur=null;return END.w=w;}
function endSave(){try{localStorage.setItem(END.KEY,JSON.stringify(END.w));END.lastSave=performance.now();}catch(e){}}
// the refill: whole coins for the real time passed, up to the cap; while at or over the cap the clock waits
function endRefill(){const w=endLoad(),now=Date.now();if(now<w.t)w.t=now;
 if(w.coins>=END.CAP){w.t=now;return 0;}const n=Math.floor((now-w.t)/(END.REFILL*1000));if(n<=0)return 0;
 const add=Math.min(n,END.CAP-w.coins);w.coins+=add;w.t+=n*END.REFILL*1000;if(w.coins>=END.CAP)w.t=now;return add;}
function endNextIn(){const w=endLoad();if(w.coins>=END.CAP)return null;return Math.max(0,END.REFILL*1000-(Date.now()-w.t));}
function endClockText(ms){const s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
// the board order: unseen boards first, in order; then random from the seen ones (not the current one)
function endPickNext(){const w=endLoad(),o=endOrder(),un=o.find(k=>!w.seen.includes(k));if(un)return un;
 const pool=w.seen.filter(k=>o.includes(k)&&k!==w.cur);return pool.length?pool[Math.random()*pool.length|0]:o[0];}
function endSetBoard(k){const w=endLoad();w.cur=k;if(!w.seen.includes(k))w.seen.push(k);w.meter=0;END.emptyT=0;endSave();}
function endKey(){return END.w&&END.w.cur||END_LEVELS[0];}
function endLabKey(){const k=endKey();return k.startsWith('lab:')?k.slice(4):null;}
function endName(){const k=endKey(),lk=endLabKey();if(lk)return LAB.B[lk].name;return PGL_LEVELS[+k.slice(1)-1].name;}
// a lab layout as an open board: its pieces and prizes, the normal extras on, no goal, no drop budget
const END_LABDEF={};
function endLabDef(){const k=endLabKey();if(!k)return null;if(!END_LABDEF[k])END_LABDEF[k]={...LAB.B[k],extras:true,budget:0,lab:{kind:'endless',text:'',row:'',n:0,unit:''}};return END_LABDEF[k];}
function endActive(){return END.on&&WILD.on&&pglActive();}
// the layout stands in for the level wherever a level is read (layout, prize list); the player's own level is untouched
{const __endLevel=pglLevel;pglLevel=function(n){if(END.on&&!n){const lk=endLabKey();if(lk)return endLabDef();return __endLevel(+endKey().slice(1));}return __endLevel(n);};}
if(typeof LAB!=='undefined'){const __endLabOn=LAB.on,__endLabDef=LAB.def;
 LAB.on=function(){if(END.on&&endLabKey()&&pglActive())return true;return __endLabOn();};
 LAB.def=function(){if(END.on&&endLabKey())return endLabDef();return __endLabDef();};}
// Level 1's quiet rules (no bonus prizes) never apply on the endless board
{const __endLv1=cp50Lv1;cp50Lv1=function(){if(END.on)return false;return __endLv1();};}
// the wallet is the board's coin count
{const __endReset=wildReset;wildReset=function(){const r=__endReset.apply(this,arguments);if(END.on&&WILD.on){endRefill();S.coins=endLoad().coins;board.remaining=S.coins;WILD.left=600;endBankIn();}return r;};}
// no round end of any kind: no timer, no out-of-coins end, no win
{const __endFinish=wildFinish;wildFinish=function(win,reason){if(endActive())return;return __endFinish.apply(this,arguments);};}
{const __endTick=wildTick;wildTick=function(dt){
 if(endActive()){WILD.left=600;WILD.turboDone=true;WILD.lastPay=time; /* no phase change here: the round's Home works by going back to the goal-card phase */
  const w=endLoad();w.coins=S.coins;endBankOut();const add=endRefill();if(add){S.coins=w.coins;board.remaining=S.coins;}
  if(performance.now()-END.lastSave>2000)endSave();}
 const r=__endTick.apply(this,arguments);
 if(endActive()){try{endSweepTick(dt);endEmptyTick(dt);}catch(e){try{diagEvent('cp92','tick '+e);}catch(_){}}}
 return r;};}
// no goal counter on a prize: the prize itself (pantry, pickup) is unchanged
{const __endPrize=wildPrizeCollected;wildPrizeCollected=function(b,x){const n=floats.length,c0=S.coins;const r=__endPrize.apply(this,arguments);if(endActive())END.stats.prizeCoins=(END.stats.prizeCoins|0)+(S.coins-c0);
 if(endActive())for(let i=floats.length-1;i>=n;i--){const t=floats[i]&&floats[i].text;if(typeof t==='string'&&(/^\d+ \/ \d+$/.test(t)||t==='COLLECTION!'))floats.splice(i,1);}return r;};}
// the clock spot shows the refill
{const __endClock=wildClock;wildClock=function(){if(endActive()){const ms=endNextIn();return ms==null?'Full':'+1 '+endClockText(ms);}return __endClock();};}
{const __endMsg=wildMessage;wildMessage=function(){if(endActive()){if(END.sweep)return 'New board…';if(S.coins<=0&&WILD.phase==='play'){const ms=endNextIn();return 'Out of coins · +1 in '+endClockText(ms||0);}}const m=__endMsg.apply(this,arguments);if(endActive()&&typeof m==='string'&&/^Collect|COLLECTION/.test(m))return '';return m;};}
// the meter: coins played on this board
{const __endDrop=tryDrop;tryDrop=function(...a){if(endActive()&&END.sweep)return false;const n0=board.released;const r=__endDrop.apply(this,a);
 if(endActive()&&board.released>n0){const w=endLoad(),d=board.released-n0;w.meter=Math.min(END.METER,w.meter+d);w.side=(w.side|0)+d;END.stats.dropped+=d;w.coins=S.coins;if(w.meter>=END.METER&&w.meter-d<END.METER)END.pulse=time;}return r;};}
// a nearly empty board fills the meter at once
function endCoinsOnTable(){let n=0;for(const b of bodies){if(b.dead||!(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))continue;const z=b.rb.translation().z/M;if(z<=T.FRONT)n++;}return n;}
function endEmptyTick(dt){const w=endLoad();if(END.sweep||w.meter>=END.METER||WILD.phase!=='play'){END.emptyT=0;return;}
 if(endCoinsOnTable()<END.EMPTY_N){END.emptyT+=dt;if(END.emptyT>=END.EMPTY_SEC){w.meter=END.METER;END.pulse=time;END.stats.auto++;endSave();try{diagEvent('cp92','meter full: board nearly empty');}catch(e){}}}else END.emptyT=0;}
// the reset: free when nothing else runs (the same rule as the side-game slot)
function endFree(){return endActive()&&!END.sweep&&WILD.phase==='play'&&board.status==='playing'&&!(typeof PGPX!=='undefined'&&PGPX)&&!(typeof pgpSideGame==='function'&&pgpSideGame())
 &&!WILD.dance&&!WILD.toss&&!WILD.chase&&!WILD.pounce&&!WILD.petGame&&!WILD.tossPending&&!WILD.chasePending&&!WILD.pouncePending&&!(typeof W2_YAWN!=='undefined'&&W2_YAWN)
 &&sweepTime<=0&&catquakeTime<=0&&!(typeof PAW40_STATE==='object'&&PAW40_STATE&&PAW40_STATE.swipe)&&!inventoryOpen&&panel.style.display!=='block'&&!(typeof cp51Paused!=='undefined'&&cp51Paused);}
function endReady(){return endLoad().meter>=END.METER;}
function endStartSweep(){stopDrops();holding=false;taps=[];pendingDrops=[];END.sweep={t:0,kicked:new Set()};END.stats.resets++;try{sfx.wild('turbo',1);}catch(e){}try{diagEvent('cp92','sweep '+endKey());}catch(e){}}
function endBarZ(t){const u=Math.max(0,Math.min(1,t/END.SWEEP.cross)),e=u*u*(3-2*u)*.3+u*.7;return PUSH_MAX-10+(T.FRONT+40-(PUSH_MAX-10))*e;}
function endSweepTick(dt){const S0=END.sweep;if(!S0)return;S0.t+=dt;const z=endBarZ(S0.t);
 for(const b of [...bodies]){if(b.dead||S0.kicked.has(b))continue;const q=b.rb.translation(),bz=q.z/M;if(bz>z+8)continue;S0.kicked.add(b);
  if(b.kind==='stack'){removeCoin(b);continue;}
  try{b.rb.wakeUp&&b.rb.wakeUp();b.rb.setLinvel({x:(q.x/M-200)*.25*M,y:40*M,z:520*M},true);}catch(e){removeCoin(b);}}
 if(S0.t>=END.SWEEP.cross+END.SWEEP.hold){for(const b of [...bodies])if(!b.dead)removeCoin(b);END.sweep=null;endNewBoard(endPickNext());}}
// the sweep pays nothing: anything over an edge while it runs is just gone
{const __endFall=fallOff;fallOff=function(b,x){if(endActive()&&END.sweep&&b&&!b.dead){removeCoin(b);return;}
 if(endActive()&&b&&!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5')){const z=b.rb.translation().z/M,side=Math.abs(x-200)>(T.R-T.L)/2-2;if(!side&&z>=T.FRONT-30){END.stats.credited+=b.kind==='gold5'?5:1;}}
 return __endFall.apply(this,arguments);};}
// building the next board: the level path builds it (prefill, towers, lab pieces); side-game charges stay with you
function endNewBoard(k){endBankOut();endSetBoard(k);wildReset();
 WILD.phase='play';board.status='playing';WILD.goT=0;try{const p=screenOf(200,560,0);rings.push({x:p.x,y:p.y,t:0,s:p.s});sfx.wild('thud',1);}catch(e){}}
// --- side-game coins on the endless board (PM, Nov 19, Jenny's decisions) ---
// When: the board's own side-game coin (laser on the Siamese, fish on the Orange, mouse on the Tortie) comes as the next bonus
// drop once END.SIDE_EVERY coins have been played since the last one (today's levels give about one per round of 65-120
// coins); never while one is on the board, falling in, pending or its game is running. The levels' own rule (the Nth bonus
// drop, only when no needed prize is missing, so it came late in a round) is off here. A coin lost off a side brings the
// next one after half the count. It lands in the front part of the board (depth 600-680) so ordinary play pushes it off.
// Banking: fish and mouse start their side game at once, as before CP-88 (Jenny: "when you only have 1 minute to clear a
// board, it doesn't do you much good to bank a power" / side games start automatically on the endless board); the laser
// stays banked in the CP-88 slot and is kept with the wallet (sessions, resets, leaving) until used. Levels: CP-88 as today.
END.SIDE_EVERY=100;END.stats.side=[];
function endSideKind(){return typeof cp88Kind==='function'?cp88Kind():null;}
const END_SIDE_GAME={laser:'chase',fish:'toss',mousecoin:'pounce'},END_SIDE_PEND={laser:'chasePending',fish:'tossPending',mousecoin:'pouncePending'};
function endSideBusy(k){return bodies.some(b=>!b.dead&&b.kind===k)||WILD.incoming.some(o=>o.kind===k)||!!WILD[END_SIDE_GAME[k]]||!!WILD[END_SIDE_PEND[k]];}
{const __endBonus=wildScheduleBonus;wildScheduleBonus=function(){if(endActive()){const k=endSideKind(),w=endLoad();
  WILD.laserN=9;WILD.fishN=9;WILD.mouseN=9; // the levels' own rule stays off on the endless board
  if(k&&(w.side|0)>=END.SIDE_EVERY&&!endSideBusy(k)){const y=rand(600,680),x=200+rand(-1,1)*(tableHalfAt(y)-70);
   WILD.incoming.push({kind:k,id:null,x,y,t:.9,t0:.9});WILD.bonusN++;w.side=0;sfx.wild('whistle',1);END.stats.side.push({kind:k,due:END.stats.dropped});endSave();return;}}
 return __endBonus.apply(this,arguments);};}
{const __endLand=wildLandBonus;wildLandBonus=function(o){const r=__endLand.apply(this,arguments);if(endActive()&&o&&END_SIDE_GAME[o.kind]){const e=END.stats.side[END.stats.side.length-1];if(e&&e.kind===o.kind&&e.land==null){e.land=END.stats.dropped;e.y=Math.round(o.y);}}return r;};}
{const __endRain0=wildRainCollected;wildRainCollected=function(b,x){const c0=S.coins;const r=__endRain0.apply(this,arguments);if(endActive())END.stats.rainCoins=(END.stats.rainCoins|0)+(S.coins-c0);return r;};}
{const __endRain=wildRainCollected;wildRainCollected=function(b,x){const k=b&&b.kind;
 if(endActive()&&END_SIDE_GAME[k]){const e=END.stats.side.find(e=>e.kind===k&&e.land!=null&&e.got==null&&!e.lost);if(e)e.got=END.stats.dropped;
  if(k!=='laser'&&typeof __cp88Rain==='function')return __cp88Rain.apply(this,arguments);} // fish, mouse: start at once (the pre-CP-88 path)
 return __endRain.apply(this,arguments);};}
{const __endGutter=gutterOff;gutterOff=function(b,x){if(endActive()&&b&&!b.dead&&!END.sweep&&END_SIDE_GAME[b.kind]){const w=endLoad();w.side=Math.max(w.side|0,END.SIDE_EVERY/2);
  const e=END.stats.side.find(e=>e.kind===b.kind&&e.land!=null&&e.got==null&&!e.lost);if(e){e.lost=true;e.at=END.stats.dropped;}}return __endGutter.apply(this,arguments);};}
// the slot shows only for the laser here (fish and mouse never bank on the endless board)
if(typeof cp88Shown==='function'){const __endShown=cp88Shown;cp88Shown=function(){if(endActive()&&endSideKind()!=='laser')return false;return __endShown.apply(this,arguments);};}
// the banked laser is kept with the wallet
function endBankIn(){if(typeof CP88==='undefined')return;const w=endLoad();CP88.bank={laser:w.laser|0,fish:0,mousecoin:0};}
function endBankOut(){if(typeof CP88==='undefined'||!END.w)return;END.w.laser=CP88.bank.laser|0;}
// --- the row above the cat's head: the board's name, then the meter (a NEW BOARD button when full) ---
function endRowRect(){const R=cp50RowLayout(),h=Math.max(18,Math.min(28,R.D)),w=196;return {x:200-w/2,y:R.cy-h/2,w,h};}
{const __endRowOn=cp50RowOn;cp50RowOn=function(){if(END.on)return !!(WILD.on&&!inventoryOpen&&(WILD.phase==='play'||WILD.phase==='count'));return __endRowOn();};}
{const __endRow=cp50DrawRow;cp50DrawRow=function(){if(!END.on)return __endRow.apply(this,arguments);if(!cp50RowOn())return;
 const R=cp50RowLayout(),b=endRowRect(),w=endLoad(),k=Math.min(1,w.meter/END.METER),full=k>=1,free=endFree();globalThis.CP50_ROW=R;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 wildText('ENDLESS · '+endName(),200,R.ly,14,'#ffd23f','#2a0b3e',4);
 if(END.sweep){uiRound(b.x,b.y,b.w,b.h,b.h/2,'rgba(42,11,62,.85)','#fff6d0',1.5);wildText('NEW BOARD…',200,b.y+b.h/2+1,15,'#fff6d0','#2a0b3e',4);}
 else if(full){let pu=time-END.pulse;if(!(pu>=0))pu=9;const s=1+(pu<2?.08*Math.abs(Math.sin(pu*7)):.03*Math.sin(time*4));
  ctx.translate(200,b.y+b.h/2);ctx.scale(s,s);ctx.translate(-200,-(b.y+b.h/2));
  uiRound(b.x,b.y,b.w,b.h,b.h/2,free?'#3ccf4e':'rgba(60,207,78,.55)','#fff6d0',2);wildText('NEW BOARD',200,b.y+b.h/2+1,16,'#ffffff','#0c3a12',4);}
 else{uiRound(b.x,b.y,b.w,b.h,b.h/2,'rgba(42,11,62,.8)','rgba(255,246,208,.7)',1.5);
  if(k>0){ctx.save();ctx.beginPath();ctx.rect(b.x,b.y,b.w*k,b.h);ctx.clip();uiRound(b.x+2,b.y+2,b.w-4,b.h-4,(b.h-4)/2,'#2fb5a8');ctx.restore();}
  ctx.font='bold 12px system-ui';ctx.fillStyle='#fff6d0';ctx.fillText('New board '+Math.round(k*100)+'%',200,b.y+b.h/2+1);}
 ctx.restore();};}
{const __endTap=powerTap;powerTap=function(p){if(endActive()&&cp50RowOn()){const b=endRowRect();if(contains({x:b.x-6,y:b.y-6,w:b.w+12,h:b.h+12},p)){stopDrops();
   if(endReady()&&endFree())endStartSweep();else try{pgSfx('lock');}catch(e){}return true;}}return __endTap.apply(this,arguments);};}
// the sweep bar: drawn over the board (a long rake in the pusher's colours)
{const __endDraw=draw;draw=function(){__endDraw.apply(this,arguments);try{const S0=END.sweep;if(!S0||!endActive())return;const z=Math.min(endBarZ(S0.t),T.FRONT+30),hw=tableHalfAt(Math.min(T.FRONT,z)),
  A=screenOf(200-hw-6,z,12),B=screenOf(200+hw+6,z,12),a=Math.min(1,S0.t/.15,(END.SWEEP.cross+END.SWEEP.hold-S0.t)/.25);
  ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.globalAlpha=Math.max(0,a);ctx.lineCap='round';
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=16*B.s;ctx.beginPath();ctx.moveTo(A.x,A.y+10*B.s);ctx.lineTo(B.x,B.y+10*B.s);ctx.stroke();
  ctx.strokeStyle='#8a5a2a';ctx.lineWidth=14*B.s;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();
  ctx.strokeStyle='#e8c35a';ctx.lineWidth=5*B.s;ctx.beginPath();ctx.moveTo(A.x,A.y-3*B.s);ctx.lineTo(B.x,B.y-3*B.s);ctx.stroke();ctx.restore();}catch(e){}};}
// --- entering and leaving ---
function endStart(){try{if(!PG)pgInit();const w=endLoad();endRefill();if(!w.cur)endSetBoard(endPickNext());
  const cat=PGU.boardCat||PG.current||'tuxedo';if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}
  END.on=true;END.sweep=null;END.emptyT=0;if(WILD.on)wildExit();pgPlay(PG.open[cat]?cat:'tuxedo');if(WILD.phase!=='card')wildReset();wildStartCountdown();
  try{diagEvent('cp92','start '+endKey()+' coins='+w.coins);}catch(e){}}catch(e){END.on=false;try{diagEvent('cp92','start failed '+e);}catch(_){}}}
function endStop(){if(!END.on)return;if(WILD.on&&END.w){END.w.coins=S.coins;endBankOut();}END.on=false;END.sweep=null;endSave();try{diagEvent('cp92','stop coins='+(END.w&&END.w.coins));}catch(e){}if(WILD.on)wildReset();}
// leaving always returns to normal play: whenever Home shows with the endless board on, the mode is turned off
{const __endGuard=update;update=function(dt){__endGuard(dt);try{if(END.on&&PGU&&PGU.screen==='main')endStop();}catch(e){}};}
try{document.addEventListener('visibilitychange',()=>{try{if(END.on&&WILD.on&&END.w){END.w.coins=S.coins;endBankOut();endSave();}}catch(e){}});}catch(e){}
// --- Home: the button (UAT; under Board lab when that shows, else in its place) ---
function endBtn(){if(!PG)return null;const L=PGA.L,R=pgMainRects();if(!L||!L.play)return null;const w=176;let y,h=36;
 const lb=typeof labhBtn==='function'?labhBtn():null;
 if(lb){y=lb.y+lb.h+10;if(y+h>R.bot-2){y=lb.y+lb.h+6;h=Math.max(28,Math.min(36,R.bot-2-y));}} // short phones: a slimmer button, never over Board lab
 else{y=(typeof cp87Btn==='function'&&cp87Btn())?cp87Btn().y+cp87Btn().h+10:L.play.y+L.play.h+14;y=Math.min(y,R.bot-h-2);}
 return {x:200-w/2,y,w,h};}
function endHomeFree(){return typeof labhFree==='function'?labhFree():(PGU.screen==='main'&&!PGU.win&&!PGU.pick&&!PGU.modes&&!PGU.door);}
{const __endDrawMain=pgDrawMain;pgDrawMain=function(dt){const r=__endDrawMain(dt);try{if(endHomeFree()){const b=endBtn();if(b){
   uiRound(b.x,b.y,b.w,b.h,b.h/2,'rgba(232,140,40,.94)','rgba(255,240,210,.9)',1.5);
   ctx.save();ctx.font='bold '+(b.h<34?14:15)+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';ctx.fillText('Endless board',200,b.y+b.h/2+1);ctx.restore();}}}catch(e){}return r;};}
{const __endMainTap=pgMainTap;pgMainTap=function(p){try{if(endHomeFree()){const b=endBtn();if(b&&contains({x:b.x-4,y:b.y-4,w:b.w+8,h:b.h+4},p)){pgSfx('tap');endStart();return;}}}catch(e){}return __endMainTap(p);};}
// --- Developer: Settings > Engineer tools > "Endless board" (empty or fill the wallet, fill the meter, start the order again) ---
{const __endCredits=openCredits;
 openCredits=function(){const r=__endCredits.apply(this,arguments);try{
  const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp92-endless'))return r;
  const box=document.createElement('div');box.id='cp92-endless';const hd=document.createElement('h3');hd.textContent='Endless board';box.appendChild(hd);
  const A={empty:['Empty wallet',()=>{const w=endLoad();w.coins=0;w.t=Date.now();if(endActive()){S.coins=0;board.remaining=0;}}],
   fill:['Fill wallet',()=>{const w=endLoad();w.coins=END.CAP;w.t=Date.now();if(endActive()){S.coins=END.CAP;board.remaining=S.coins;}}],
   meter:['Fill meter',()=>{endLoad().meter=END.METER;END.pulse=time;}],
   order:['Start order again',()=>{const w=endLoad();w.seen=[];w.cur=null;w.meter=0;}]};
  for(const k in A){const b=document.createElement('button');b.textContent=A[k][0];b.style.margin='0 6px 6px 0';b.onclick=()=>{try{A[k][1]();endSave();b.textContent='✓ '+A[k][0];setTimeout(()=>b.textContent=A[k][0],900);}catch(e){}};box.appendChild(b);}
  eng.appendChild(box);}catch(e){}return r;};}
// ---------- end CP-92 Endless board ----------
