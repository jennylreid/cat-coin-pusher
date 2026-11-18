
// ---------- CP-58 prototype: demo controls for the watch page (not game code) ----------
function cp58DemoState(){return {screen:PGU.screen,phase:WILD.phase,level:pglOn()?pglSel():null,yawn:!!W2_YAWN,t:W2_YAWN&&W2_YAWN.t||0,
 prizes:bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id),goal:typeof WILD_COLLECTION!=='undefined'?WILD_COLLECTION:[],stats:CP58.stats};}
// Starts a fresh round on the given level (skipping the title), with time to spare.
function cp58DemoRound(level){
 const L=pglLv();L.passed=Math.max(L.passed,(level|0)-1);L.sel=level|0||1;
 if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}
 if(WILD.on&&WILD.phase!=='idle'&&WILD.phase!=='card'){try{wildExit();}catch(e){}}
 try{pgPlay(pgPlayCat());}catch(e){}
 if(WILD.phase==='end')wildReset();wildStartCountdown();CP58.demoRound=true;}
// Plays the moment now (a round must be in play); keeps the round clock topped up for watching.
function cp58DemoPlay(){if(WILD.phase!=='play'||W2_YAWN)return false;WILD.left=Math.max(WILD.left,40);stopDrops&&stopDrops();w2StartYawn();return true;}
// Places a prize on the board near the front (for trying it with other prizes).
function cp58DemoPrize(id,x,z){const b=addCoin('item',id,x??200+rand(-90,90),COIN_HALF*2+halfOf('item')+2,z??rand(560,700),yawTurn(0));b.wild=true;return b;}
// ?level=N starts that level's round on load; &auto=1 plays the moment shortly after the round starts.
(function(){if(typeof URLSearchParams==='undefined')return;const q=new URLSearchParams(location.search||'');if(!q.has('level'))return;const lv=+q.get('level')||1,auto=q.get('auto')==='1';let last=0,playAt=0;
 const iv=setInterval(()=>{try{if(!ART||!ART.head||!bodies)return;
  if(WILD.phase==='play'){if(!auto)return clearInterval(iv);if(!playAt)playAt=performance.now()+2500;else if(performance.now()>playAt){cp58DemoPlay();clearInterval(iv);}return;}
  if(WILD.phase==='count')return;
  if(performance.now()-last>1500){last=performance.now();if(!PG)pgInit();cp58DemoRound(lv);}}catch(e){}},250);})();
