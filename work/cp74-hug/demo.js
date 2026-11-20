
// ---------- CP-74 prototype: demo controls for the watch page and the recordings (not game code) ----------
// Starts a fresh round on the Ragdoll's board (Cozy) at the given level, skipping the title.
function z74DemoRound(level,cat){cat=cat||'ragdoll';if(!PG)pgInit();
 for(const c of PG_CATS)PG.open[c]=true;PG.current=cat;
 const L=pglLv();L.passed=Math.max(L.passed,(level|0)-1,typeof PG_SWITCH_LEVEL==='number'?PG_SWITCH_LEVEL:0);L.sel=level|0||1;
 if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}
 if(WILD.on&&WILD.phase!=='idle'&&WILD.phase!=='card'){try{wildExit();}catch(e){}}
 try{pgPlay(cat);}catch(e){}
 if(WILD.phase==='end')wildReset();wildStartCountdown();}
// Plays the power through the real button (a power is added first so the button is live); keeps the clock topped up.
function z74DemoPlay(){if(WILD.phase!=='play'||PGPX)return false;WILD.left=Math.max(WILD.left,40);
 if(!PG.powers)PG.powers={};PG.powers[pgpCat()]=Math.max(1,pgpCount());if(board.status==='ready')board.status='playing';
 const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});return !!PGPX;}
// Drops a piece on top of the pile: rain5, rain10, quake, coin, or a prize id.
function z74DemoAdd(what,x,z){const item=!['rain5','rain10','rain25','quake','gold5','coin'].includes(what);
 return addCoin(item?'item':what,item?what:null,x??200+rand(-110,110),40,z??rand(430,690),yawTurn(rand(0,6)));}
// Keeps side games and bonus drops out of the demo so the power is what you watch.
function z74DemoQuiet(){WILD.nextBonus=999;if(typeof WILD.nextToss==='number')WILD.nextToss=999;}
function z74DemoState(){return {screen:PGU.screen,phase:WILD.phase,level:pglOn()?pglSel():null,cat:pgpCat(),power:PGPX&&PGPX.id,t:PGPX?PGPX.t:0,
 period:PUSH_PERIOD,powers:pgpCount(),stats:typeof Z74!=='undefined'?Z74.stats:null};}
// ?level=N starts that level's round on load; &auto=1 plays the power shortly after the round starts; &at=s sets the delay.
(function(){if(typeof URLSearchParams==='undefined'||typeof location==='undefined')return;const q=new URLSearchParams(location.search||'');if(!q.has('level'))return;
 const lv=+q.get('level')||1,auto=q.get('auto')==='1',delay=(+q.get('at')||3)*1000;let last=0,playAt=0;
 const iv=setInterval(()=>{try{if(!ART||!ART.head||!bodies)return;
  if(WILD.phase==='play'){z74DemoQuiet();if(!auto)return clearInterval(iv);if(!playAt)playAt=performance.now()+delay;else if(performance.now()>playAt){z74DemoPlay();clearInterval(iv);}return;}
  if(WILD.phase==='count')return;
  if(performance.now()-last>1500){last=performance.now();z74DemoRound(lv);}}catch(e){}},250);})();
