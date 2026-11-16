// ---------- CP-48 (UAT 63, Jenny Nov 15): freeze fix and the simple Level 1 ----------
// 1a. Coin limit (Jenny's option A, Nov 15). Your own dropped coins still on the board are limited to about 45: at the
//     limit, drops slow to one a second (taps and holds in between drop nothing; the coins stay in the bank) and a short
//     "Board full" shows (front of the board, like "Easy taps", and in the board's message line). Grid, tower, rain and
//     prize pieces don't count, so a flood stops near 100 coins on Level 1 while tower levels play normally. Rain, pours
//     and sky coins past 100 plain coins land as one gold 5 in five (the UAT 43 budget, from 100 instead of 130); the
//     gold 5 merging of resting coins stays at 130 as before. Prizes, rain coins (5/10/25), the Quake, powers and the
//     pickup are never limited or changed.
const CP48_OWN=45,CP48_SLOW=1,CP48_RAIN=100;
let cp48FullAt=-99,cp48FullLogAt=-99;
function cp48Own(){let n=0;for(const b of bodies)if(!b.dead&&b.input&&(b.kind==='coin'||b.kind==='silver'))n++;return n;}
function cp48Full(){return cp48Own()>=CP48_OWN;}
const __cp48TryDrop=tryDrop;
tryDrop=function(at=aim){
 if(!inventoryOpen&&board.status!=='won'&&board.status!=='lost'&&board.remaining>0&&cp48Full()&&time-lastDrop<CP48_SLOW-1e-6){
  if(time-cp48FullAt>.9){cp48FullAt=time;const p=screenOf(200,T.FRONT-12,10);floats.push({text:'Board full',x:p.x,y:p.y,t:0});try{sfx.clink(.12);}catch(e){}}
  if(time-cp48FullLogAt>5){cp48FullLogAt=time;try{diagEvent('board-full',{own:cp48Own(),plain:w43PlainCount()});}catch(e){}}
  return false;}
 return __cp48TryDrop(at);};
w43Budget=function(kind){if(!WILD.on||w43PlainCount()<CP48_RAIN)return kind;w43Surplus++;if(w43Surplus>=5){w43Surplus=0;WILD.gold5=(WILD.gold5||0)+1;return 'gold5';}return null;};
const __cp48Msg=wildMessage;
wildMessage=function(){if(WILD.on&&WILD.phase==='play'&&S.coins>0&&cp48Full())return 'Board full!';return __cp48Msg();};

// 2/3. The full grid on every level (Jenny, Nov 15): production's 9 rows (5 at the back, then 8 rows of 6, 53 coins)
//    with no gaps; towers and blocks stand straight up on top of the grid coins instead of replacing them. Level 1 has no
//    towers. Same seeded coin mix every replay.
const CP48_LIFT=COIN_HALF*2+.1; // the grid's top: towers stand on it
function cp48Grid(){for(const b of [...bodies])if(!b.dead&&(b.kind==='coin'||b.kind==='silver'))removeCoin(b);
 const d=COIN_R*2+1;for(let y=PUSH_MAX+COIN_R+2;y+COIN_R<=T.FRONT-20;y+=d){const n=Math.floor(2*Math.min(tableHalfAt(y-COIN_R),tableHalfAt(y+COIN_R))/d);
  for(let i=0;i<n;i++)addCoin(seededRandom()<.25?'silver':'coin',null,200+(i-(n-1)/2)*d,COIN_HALF+.2,y,yawTurn(0));}}
// raise standing towers (and the prizes put on them) from the table onto the grid
function cp48Lift(items){let n=0;for(const t of bodies){if(t.dead||t.kind!=='stack')continue;const p=t.rb.translation();if(p.y/M>t.half+.5)continue;n++;t.rb.setTranslation({x:p.x,y:(t.half+.1+CP48_LIFT)*M,z:p.z},true);t.rb.setLinvel({x:0,y:0,z:0},true);t.rb.setAngvel({x:0,y:0,z:0},true);const q=t.rb.translation();t.lx=q.x;t.lz=q.z;}
 if(items&&n)for(const b of bodies){if(b.dead||b.kind!=='item'||!(b.twTop||b.pglOn))continue;const p=b.rb.translation();b.rb.setTranslation({x:p.x,y:p.y+CP48_LIFT*M,z:p.z},true);}}
const __cp48Prefill=wildPrefill;
wildPrefill=function(){__cp48Prefill();if(!pglOn())return;cp48Grid();cp48Lift(false);};
const __cp48TwPlace=twPlacePrizes;
twPlacePrizes=function(){const r=__cp48TwPlace();if(pglOn())cp48Lift(true);return r;};
const __cp48Stand=pglStandBlocks;
pglStandBlocks=function(L){const r=__cp48Stand(L);if(pglOn()&&L&&L.blocks)cp48Lift(true);return r;};

// 1b. Logging, so the next freeze names its cause (saved with the existing UAT diagnostics, catpusher.uat.diagnostics.v1
//     and the connected log file): 200 events; the log saved at once on the first error; every 5 s during a round even
//     while holding (local copy); long frames (over 100 ms) with the screen and coin count; the last 10 taps and what took
//     them; screen changes; peak coins per session and per round.
const CP48={taps:[],lastScreen:'',roundPeak:0,errSaved:false,lastLong:-1e9,longSkipped:0,saveMs:0};
diagSession.taps=CP48.taps;diagSession.peakCoins=0;diagSession.coinCap={ownLimit:CP48_OWN,slowSec:CP48_SLOW,rainBudget:CP48_RAIN,merge:W43_COIN_CAP};
function cp48Screen(){try{const pg=PG&&!PG_HOME_OFF;let s=pg?PGU.screen:'old-board';
 if(s==='board'&&WILD.on)s+=':'+WILD.phase;
 if(WILD.on){if(WILD.dance)s+='+dance';if(WILD.pet)s+='+pet';if(WILD.petGame)s+='+petgame';if(WILD.laser)s+='+laser';if(WILD.toss)s+='+toss';if(WILD.pounce)s+='+pounce';if(typeof PGPX!=='undefined'&&PGPX)s+='+'+PGPX.id;}
 if(panel.style.display==='block')s+='+settings';if(inventoryOpen)s+='+inventory';
 if(pg){if(PGU.pick)s+='+cats';if(PGU.rules)s+='+rules';if(PGU.door)s+='+door';if(PGU.modes)s+='+modes';}
 return s;}catch(e){return 'unknown';}}
function cp48Target(p){const hit=[];const add=(n,f)=>{try{const r=f();if(r&&contains(r,p))hit.push(n);}catch(e){}};
 try{const pg=PG&&!PG_HOME_OFF,scr=pg?PGU.screen:'old-board';
  if(scr==='title')return 'title';
  if(scr==='main'){const R=pgMainRects(),D=pgDock();
   ['gear','coll','inv','modes'].forEach(k=>add('top:'+k,()=>D[k]));(D.tiles||[]).forEach(t=>add('top:'+t.id,()=>t));
   (R.side||[]).forEach(b=>add('side:'+b.id,()=>b.hit));add('play',()=>(PGA.L&&PGA.L.play)||R.play);add('help',()=>PGA.L&&PGA.L.help);
   add('cat',()=>({x:R.head.x-R.head.w*.45,y:R.head.y-R.head.w*.4,w:R.head.w*.9,h:R.head.w*.8}));}
  else if(scr!=='board')add('back',()=>pgBack());
  else if(WILD.on){add('board-button',()=>wildButton());
   if(WILD.phase==='end'){const R=wildEndRects();add('end:again',()=>R.again);add('end:main',()=>R.back);}
   if(WILD.phase==='card'){const R=wildCardRects();add('card:go',()=>R.go);add('card:back',()=>R.back);}
   add('power',()=>pgpButton());add('gear',()=>pgPlayGear());}
  return hit[0]||(scr==='board'?'board':scr);}catch(e){return 'unknown';}}
const __cp48Ptr=wildPointer;
wildPointer=function(e,p){let before='',target='';try{before=cp48Screen();target=cp48Target(p);}catch(x){}
 let r;try{r=__cp48Ptr(e,p);}finally{try{const after=cp48Screen();diagPush(CP48.taps,[diagAt(),Math.round(p.x),Math.round(p.y),target,before,after!==before?after:'',r?1:0,w43PlainCount()],10);}catch(x){}}
 return r;};
function cp48SaveLocal(){try{diagFinishBin();localStorage.setItem(DIAG_KEY,JSON.stringify({schema:1,current:diagSession,previous:diagPrevious}));diagLastSave=performance.now();}catch(e){}}
function cp48FrameLog(ms,physics,drawing,steps){
 const n=w43PlainCount(),sc=cp48Screen();
 if(n>diagSession.peakCoins)diagSession.peakCoins=n;if(n>CP48.roundPeak)CP48.roundPeak=n;
 if(sc!==CP48.lastScreen){const was=CP48.lastScreen;CP48.lastScreen=sc;diagEvent('screen',(was||'start')+' > '+sc+' ('+n+' coins)');
  if(/:play/.test(sc)&&!/:play/.test(was))CP48.roundPeak=n;
  if(/:end/.test(sc)&&!/:end/.test(was)){let lv=null;try{lv=pglSel();}catch(e){}diagEvent('round-end',{level:lv,cat:PG&&PGU.boardCat||null,peakCoins:CP48.roundPeak,win:!!WILD.win});diagNeedSave=true;}}
 if(ms>100&&ms<5000){const now=performance.now();
  if(now-CP48.lastLong>2000){diagEvent('long-frame',{ms:diagRound(ms),physicsMs:diagRound(physics),drawMs:diagRound(drawing),steps,coins:n,bodies:bodies.length,screen:sc,skippedSince:CP48.longSkipped});CP48.lastLong=now;CP48.longSkipped=0;}
  else CP48.longSkipped++;}
 else if(ms>=5000)diagEvent('frame-gap',{ms:Math.round(ms),screen:sc});
 if(WILD.on&&WILD.phase==='play'){CP48.saveMs+=Math.min(ms,1000);if(CP48.saveMs>=5000){CP48.saveMs=0;cp48SaveLocal();}}
}
const __cp48DiagFrame=diagFrame;
diagFrame=function(ms,physics,drawing,steps,wasHolding){try{__cp48DiagFrame(ms,physics,drawing,steps,wasHolding);}finally{try{if(Number.isFinite(ms)&&ms>0)cp48FrameLog(ms,physics,drawing,steps);}catch(e){}}};
function cp48FirstError(){if(CP48.errSaved)return;CP48.errSaved=true;
 try{diagEvent('first-error-state',{screen:cp48Screen(),coins:w43PlainCount(),bodies:bodies.length,holding,lastTaps:CP48.taps.slice(-3)});diagFlush('first-error');}catch(e){}}
const __cp48FrameError=frameError;
frameError=function(e){__cp48FrameError(e);cp48FirstError();};
addEventListener('error',ev=>{try{diagEvent('js-error',String(ev&&ev.message||'error').slice(0,140)+' '+String(ev&&ev.filename||'').slice(-30)+':'+(ev&&ev.lineno||''));}catch(e){}cp48FirstError();});
addEventListener('unhandledrejection',ev=>{try{diagEvent('js-error','rejection '+String(ev&&ev.reason&&(ev.reason.message||ev.reason)||'').slice(0,140));}catch(e){}cp48FirstError();});
