// ---------- CP-83 Board lab (Jenny, Nov 18: "5-6 board setups ... in the real game, chosen with a Developer picker. I play
// them and pick the fun ones.") ----------
// Settings -> Developer -> Engineer tools -> "Board lab": pick a board and a round starts on it (the cat you're on, its side
// game and power as usual). Each board has one goal shown in the goal row above the cat's head and a trick where the drop
// lane matters. A lab board is a level-shaped layout (same fields as PGL_LEVELS) plus a goal kind:
//   collect: the level's goal list (each prize once, as levels do)   count: N of one prize (extras on the board)
//   topple: knock over the marked towers                              red: N red coins over the front edge
// The choice lasts until the app is closed or "Off" is picked; normal play never sees it. A lab round never passes or
// fails a level (the level save is put back after it). When the goal is met the round waits 2 s so the spill plays out,
// then wins. Approved art, the coin art, the pusher, the physics and the frozen pickup are untouched; red coins are plain
// coins with a tinted copy of the coin face (drawn in code, only on the Red coins board).
const LAB=(()=>{
 const B={
  tower:{name:'Tall tower',tag:'Lab',coins:60,secs:150,lab:{kind:'topple',n:1,text:'Topple the tower',unit:'tower'},goal:['tuna'],star:null,
   // one tall tower near the front with the tuna on top: push it over the edge (or tip it) for the tuna and a pour of coins
   blocks:[[[200,650,15]]],btop:[['tuna',0,0]],towers:[],p:[],rain:[['rain5',96,480],['rain5',304,480]],quake:null,mark:[0]},
  edge:{name:'Cliff edge',tag:'Lab',coins:60,secs:150,lab:{kind:'collect',text:'Get all 3 prizes',row:'Get all 3'},goal:['cheese','shrimp','tuna'],star:null,
   // a second layer of coins along the front edge; the cheese is perched on it, the shrimp and tuna sit further back on
   // their own sides, so each needs its own push down its lane
   ledge:{y:[659,712],x:[70,330]},perch:[['cheese',95,700]],p:[['shrimp',200,630],['tuna',305,575]],towers:[],rain:[],quake:null},
  pins:{name:'Bowling pins',tag:'Lab',coins:60,secs:150,lab:{kind:'topple',n:6,text:'Knock down all 6 pins',unit:'pins'},goal:[],star:null,
   // six short towers set up like bowling pins near the front, the head pin in the middle lane: a straight push takes them
   // over the edge together (a strike); a pin counts when it tips or goes over the front
   blocks:[[[200,590,5]],[[170,640,5]],[[230,640,5]],[[140,690,5]],[[200,690,5]],[[260,690,5]]],btop:[],towers:[],p:[],rain:[['rain10',110,450]],quake:null,mark:[0,1,2,3,4,5]},
  wall:{name:'Break the wall',tag:'Lab',coins:70,secs:150,lab:{kind:'collect',text:'Get the 3 prizes behind the wall',row:'Behind the wall'},goal:['yarn','bell','duck'],star:null,
   // the levels' five-tower wall across the board; the prizes wait behind it (top:[] keeps them off the towers), so you
   // have to open a gap first
   wall:[5,6,6,6,5],top:[],p:[['yarn',110,360],['bell',200,345],['duck',290,360]],towers:[],rain:[['rain5',200,650]],quake:null},
  mice:{name:'Mouse hunt',tag:'Lab',coins:70,secs:150,lab:{kind:'count',id:'mouse',n:5,text:'Get 5 mice',unit:'mice'},goal:['mouse'],star:null,
   // seven mice: two on short towers, two near the open sides, three in the pile
   blocks:[[[120,450,5]],[[280,450,5]]],btop:[['mouse',0,0],['mouse',1,0]],towers:[],
   p:[['mouse',62,600],['mouse',338,600],['mouse',200,380],['mouse',150,660],['mouse',250,660]],rain:[],quake:null},
  red:{name:'Red coins',tag:'Lab',coins:60,secs:150,lab:{kind:'red',n:8,text:'Collect 8 red coins',unit:'red coins'},goal:[],star:null,
   // fourteen red coins in a diagonal band from the back left to the front centre
   red:[[94,394],[147,394],[94,447],[147,447],[200,447],[147,500],[200,500],[253,500],[200,553],[253,553],[200,606],[253,606],[200,659],[147,659]],
   towers:[],p:[],rain:[['rain5',300,400]],quake:null}};
 const ORDER=['tower','edge','pins','wall','mice','red'];
 const S0={sel:null,got:0,winAt:0,pending:false,round:0,lost:0};const st={...S0};
 const on=()=>!!(st.sel&&B[st.sel]&&pglActive());
 const def=()=>B[st.sel];
 function set(k){st.sel=k&&B[k]?k:null;try{diagEvent('cp83','lab '+(st.sel||'off'));}catch(e){}}
 return {B,ORDER,st,on,def,set};})();

// a lab board stands in for the selected level everywhere a level is read (layout, goal list, coins, time, name)
{const __labLevel=pglLevel;pglLevel=function(n){if(LAB.on())return LAB.def();return __labLevel(n);};}
// Level 1's quiet rules apply: no cat sky-drop prizes, bonus prize drops become rain 5 (a needed prize lost off a side still
// comes back), so nothing but the board's own pieces is in play
{const __labLv1=cp50Lv1;cp50Lv1=function(){if(LAB.on())return true;return __labLv1();};}
{const __labGoalText=pglGoalText;pglGoalText=function(){if(LAB.on())return 'Lab: '+LAB.def().lab.text;return __labGoalText();};}

// the layout extras: a coin ledge (second layer), red coins, goal towers
{const __labPrefill=wildPrefill;
 wildPrefill=function(){const r=__labPrefill();if(!LAB.on()||!WILD.on)return r;const L=LAB.def();
  if(L.ledge){const d=COIN_R*2+1,[y0,y1]=L.ledge.y,[x0,x1]=L.ledge.x;for(let y=y0;y<=y1;y+=d*.68)for(let x=x0;x<=x1;x+=d)addCoin('coin',null,x+((y-y0)/(d*.68)%2?d/2:0),COIN_HALF*3+.4,y,yawTurn(0));}
  if(L.perch)for(const [id,x,y] of L.perch){const b=addCoin('item',id,x,COIN_HALF*4+halfOf('item')+1,y,yawTurn(0));b.wild=true;}
  if(L.red){const R=COIN_R*1.1;for(const [x,y] of L.red){let best=null,bd=R;for(const b of bodies){if(b.dead||(b.kind!=='coin'&&b.kind!=='silver'))continue;const q=b.rb.translation(),dd=Math.hypot(q.x/M-x,q.z/M-y);if(dd<bd){bd=dd;best=b;}}
   if(best){best.kind='coin';best.id='lab-red';}}}
  return r;};}
// mark the goal towers once they're stood up
{const __labReset=wildReset;
 wildReset=function(){const r=__labReset();const st=LAB.st;Object.assign(st,{got:0,winAt:0,pending:false,lost:0});
  if(LAB.on()&&WILD.on){const L=LAB.def();st.round++;
   for(const b of bodies)if(!b.dead&&b.kind==='stack'&&b.pglBlock&&(L.mark||[]).includes(b.pglBlock[0]))b.labGoal=true;
}
  return r;};}

// the red coin face: a tinted copy of the approved coin sprite (the coin art itself is not changed)
function labRedSprite(){const key='coin:lab-red';if(sprites[key])return sprites[key];const base=sprite('coin');const cv=document.createElement('canvas');cv.width=base.cv.width;cv.height=base.cv.height;
 const g=cv.getContext('2d');g.drawImage(base.cv,0,0);g.globalCompositeOperation='multiply';g.fillStyle='#ff3a2e';g.fillRect(0,0,cv.width,cv.height);
 g.globalCompositeOperation='destination-in';g.drawImage(base.cv,0,0);return sprites[key]={...base,cv};}
{const __labDrawCoin=drawCoinAt;drawCoinAt=function(kind,c,q,id){if(kind==='coin'&&id==='lab-red'){labRedSprite();const er=EDGE.coin;EDGE.coin='#a8281e';try{return __labDrawCoin(kind,c,q,id);}finally{EDGE.coin=er;}}return __labDrawCoin(kind,c,q,id);};}

// counting
function labFloat(text,x,big){const p=proj(Math.max(T.L+20,Math.min(T.R-20,x)),T.FRONT);floats.push({text,x:p.x,y:p.y-10,t:0,big:!!big});}
function labScore(x){const st=LAB.st,L=LAB.def(),n=L.lab.n;st.got++;labFloat(st.got>=n?'DONE!':st.got+' / '+n,x,true);if(st.got>=n)labWin();}
function labWin(){const st=LAB.st;if(st.pending)return;st.pending=true;st.winAt=time+2;}
{const __labPrize=wildPrizeCollected;
 wildPrizeCollected=function(b,x){if(!LAB.on())return __labPrize(b,x);const L=LAB.def();
  if(L.lab.kind==='count'&&b.id===L.lab.id){queueTreatAward(b.id,x,b);if(LAB.st.got<L.lab.n)labScore(x);return;}
  return __labPrize(b,x);};}
{const __labFall=fallOff;
 fallOff=function(b,x){if(LAB.on()&&WILD.on&&b&&!b.dead&&board.status==='playing'){const L=LAB.def(),z=b.rb.translation().z/M,side=Math.abs(x-200)>(T.R-T.L)/2-2,front=!side&&z>=T.FRONT-30;
   if(L.lab.kind==='red'&&b.id==='lab-red'){if(front){if(LAB.st.got<L.lab.n)labScore(x);}else if(side)LAB.st.lost++;}
   if(L.lab.kind==='topple'&&b.kind==='stack'&&b.labGoal&&!b.labDone){b.labDone=true;if(LAB.st.got<L.lab.n)labScore(x);}}
  return __labFall(b,x);};}
{const __labBreak=breakStack;
 breakStack=function(b){if(LAB.on()&&WILD.on&&b&&b.labGoal&&!b.labDone&&board.status==='playing'){b.labDone=true;const L=LAB.def();if(LAB.st.got<L.lab.n)labScore(b.rb.translation().x/M);}return __labBreak(b);};}
// a win waits 2 s so the spill plays out; time running out while it waits still wins
{const __labFinish=wildFinish;
 wildFinish=function(win,reason){if(LAB.on()&&WILD.on){const st=LAB.st;
   if(win){if(!st.pending){if(LAB.def().lab.kind==='collect')labWin();return;}if(time<st.winAt)return;}
   else if(st.pending)win=true;}
  return __labFinish(win,reason);};}
{const __labTick=wildTick;wildTick=function(dt){const r=__labTick(dt);const st=LAB.st;if(LAB.on()&&WILD.on&&st.pending&&time>=st.winAt&&board.status==='playing')wildFinish(true);return r;};}
// a lab round never passes a level, unlocks a recipe or changes the level you're on
{const __labEnd=pgRoundEnd;pgRoundEnd=function(win){if(!LAB.on())return __labEnd(win);const save=JSON.stringify(pglLv()),u=pglUnlocks,c=pglCheckScreens;pglUnlocks=()=>{};pglCheckScreens=()=>{};let r;
  try{r=__labEnd(win);}finally{pglUnlocks=u;pglCheckScreens=c;try{const P=WILD.pgResult;if(P){P.first=false;P.next=0;}PG.lv=JSON.parse(save);pgSave();}catch(e){}}return r;};}
{const __labAgain=pglAgainText;pglAgainText=function(){if(LAB.on())return 'PLAY AGAIN';return __labAgain();};}

// the goal row: "LAB · board name", then the goal with its progress
{const __labRow=cp50DrawRow;
 cp50DrawRow=function(){if(!LAB.on()||!cp50RowOn())return __labRow();const L=LAB.def(),G=L.lab,R=cp50RowLayout();globalThis.CP50_ROW=R;
  ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
  wildText('LAB · '+L.name,200,R.ly,14,'#ffd23f','#2a0b3e',4);
  if(G.kind==='collect'&&WILD_COLLECTION.length){const D=Math.min(R.D,34),f={D,step:D+6};const tw=WILD_COLLECTION.length*(D+6);
   ctx.font='italic 900 15px Impact, "Arial Black", system-ui';const gt=G.row||G.text,lw=ctx.measureText(gt).width;
   const x0=200-(lw+10+tw)/2;wildText(gt,x0+lw/2,R.cy,15,'#fff6d0','#2a0b3e',4);cp50Draw(x0+lw+10+tw/2,R.cy,f);}
  else{const got=Math.min(LAB.st.got,G.n),txt=G.text+'   '+got+' / '+G.n,D=Math.min(R.D,30);ctx.font='italic 900 16px Impact, "Arial Black", system-ui';
   const lw=ctx.measureText(txt).width,icon=G.kind==='count'||G.kind==='red',x0=200-(lw+(icon?D+8:0))/2;
   if(G.kind==='count')wildIcon(G.id,x0+D/2,R.cy,D,got>=G.n);
   else if(G.kind==='red'){const sp=labRedSprite();uiCircle(x0+D/2,R.cy,D/2,'#fff1d6','#2a0b3e',1.5);ctx.drawImage(sp.cv,x0+3,R.cy-D/2+3,D-6,D-6);}
   wildText(txt,x0+(icon?D+8:0)+lw/2,R.cy,16,got>=G.n?'#7dff6a':'#fff6d0','#2a0b3e',4);}
  ctx.restore();};}

{const __labMsg=wildMessage;wildMessage=function(){const m=__labMsg.apply(this,arguments);if(LAB.on()&&typeof m==='string'&&m.startsWith('Collect all'))return LAB.def().lab.row||LAB.def().lab.text;return m;};}
// the end card and Pause read the board's own count ("3 of 5 mice") instead of "n of m prizes" on the counting boards
{const __labFill=ctx.fillText;ctx.fillText=function(t,...a){if(typeof t==='string'&&t.indexOf(' prizes')>=0&&LAB.on()){const G=LAB.def().lab;
  if(G.kind!=='collect')t=t.replace(/\d+ of \d+ prizes/,Math.min(LAB.st.got,G.n)+' of '+G.n+' '+G.unit);}return __labFill.call(this,t,...a);};}
// the picker: Settings -> Developer -> Engineer tools -> "Board lab"
function labStart(k){LAB.set(k);try{panel.style.display='none';}catch(e){}if(!k)return;
 try{if(!PG)pgInit();const cat=PGU.boardCat||PG.current||'tuxedo';if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}
  if(WILD.on)wildExit();pgPlay(PG.open[cat]?cat:'tuxedo');if(WILD.phase!=='card')wildReset();wildStartCountdown();}catch(e){try{diagEvent('cp83','start failed '+e);}catch(_){}}}
{const __labCredits=openCredits;
 openCredits=function(){const r=__labCredits.apply(this,arguments);try{
  const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp83-lab'))return r;
  const box=document.createElement('div');box.id='cp83-lab';const hd=document.createElement('h3');hd.textContent='Board lab';box.appendChild(hd);
  const note=document.createElement('p');note.style.margin='0 0 6px';note.style.fontSize='12px';note.textContent='Tap a board to play it now. Lasts until the app closes or Off.';box.appendChild(note);
  const btns=[];const paint=()=>btns.forEach(b=>{const k=b.dataset.lab,on=(LAB.st.sel||'')===k;const nm=k?LAB.B[k].name+': '+LAB.B[k].lab.text:'Off (normal levels)';b.textContent=(on?'✓ ':'')+nm;b.style.fontWeight=on?'700':'400';});
  for(const k of ['',...LAB.ORDER]){const b=document.createElement('button');b.dataset.lab=k;b.className='wide';b.style.display='block';b.style.margin='4px 0';b.style.textAlign='left';
   b.onclick=()=>{labStart(k||null);paint();};btns.push(b);box.appendChild(b);}
  paint();const sum=eng.querySelector('summary');if(sum&&sum.nextSibling)eng.insertBefore(box,sum.nextSibling);else eng.appendChild(box);}catch(e){}return r;};}
// ---------- end CP-83 ----------
