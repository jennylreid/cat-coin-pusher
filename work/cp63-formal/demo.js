
// ---------- CP-63 prototype: demo controls for the watch page (not game code) ----------
function cp63DemoState(){return {screen:PGU.screen,phase:WILD.phase,level:pglOn()?pglSel():null,cat:pgpCat(),on:!!CP63X,t:CP63X?CP63X.t:0,
 picks:CP63X?CP63X.picks.map(o=>o.id):[],powers:pgpCount(),stats:CP63.stats};}
// Starts a fresh round on the given level (skipping the title).
function cp63DemoRound(level){
 const L=pglLv();L.passed=Math.max(L.passed,(level|0)-1);L.sel=level|0||1;
 if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}
 if(WILD.on&&WILD.phase!=='idle'&&WILD.phase!=='card'){try{wildExit();}catch(e){}}
 try{pgPlay(pgPlayCat());}catch(e){}
 if(WILD.phase==='end')wildReset();wildStartCountdown();}
// Plays the power through the real button (a power is added first so the button is live); keeps the round clock topped up.
function cp63DemoPlay(){if(WILD.phase!=='play'||CP63X)return false;WILD.left=Math.max(WILD.left,40);
 if(!PG.powers)PG.powers={};PG.powers[pgpCat()]=Math.max(1,pgpCount());if(board.status==='ready')board.status='playing';
 const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});return !!CP63X;}
// Drops a piece on top of the pile (for trying it with richer boards): rain5, rain10, quake, or a prize id.
function cp63DemoAdd(what,x,z){const item=!['rain5','rain10','rain25','quake','gold5','coin'].includes(what);
 return addCoin(item?'item':what,item?what:null,x??200+rand(-110,110),40,z??rand(430,690),yawTurn(rand(0,6)));}
// ?level=N starts that level's round on load; &auto=1 plays the power shortly after the round starts.
(function(){if(typeof URLSearchParams==='undefined')return;const q=new URLSearchParams(location.search||'');if(!q.has('level'))return;const lv=+q.get('level')||1,auto=q.get('auto')==='1';let last=0,playAt=0;
 const iv=setInterval(()=>{try{if(!ART||!ART.head||!bodies)return;
  if(WILD.phase==='play'){if(!auto)return clearInterval(iv);if(!playAt)playAt=performance.now()+2500;else if(performance.now()>playAt){cp63DemoPlay();clearInterval(iv);}return;}
  if(WILD.phase==='count')return;
  if(performance.now()-last>1500){last=performance.now();if(!PG)pgInit();cp63DemoRound(lv);}}catch(e){}},250);})();
// The watch page's tick box: whether the cane carries the pieces over the front edge.
function cp63DemoEdge(on){CP63.offEdge=!!on;}
