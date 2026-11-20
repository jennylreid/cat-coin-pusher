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
{const __labLv1=cp50Lv1;cp50Lv1=function(){if(LAB.on())return !LAB.def().extras;return __labLv1();};} // round-2 boards (extras:true) keep the normal extras
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
{const __labFill=ctx.fillText;ctx.fillText=function(t,...a){
  // the drop budget where the clock was: a coin over the clock icon, the number, then a small "drops"
  if(typeof t==='string'&&/^\d+ drops$/.test(t)&&labBudget()){const [x,y]=a,n=t.split(' ')[0];const fs0=ctx.fillStyle;ctx.save();uiCircle(x-12,y,9,'#2a0b3e',null,0);const sp=sprite('coin');ctx.drawImage(sp.cv,x-20,y-8,16,16);ctx.fillStyle=fs0;
   const r=__labFill.call(this,n,x,y);const w=ctx.measureText(n).width;ctx.font='bold 11px system-ui';__labFill.call(this,'drops',x+w+3,y+1);ctx.restore();return r;}if(typeof t==='string'&&t.indexOf(' prizes')>=0&&LAB.on()){const G=LAB.def().lab;
  if(G.kind!=='collect')t=t.replace(/\d+ of \d+ prizes/,Math.min(LAB.st.got,G.n)+' of '+G.n+' '+G.unit);}return __labFill.call(this,t,...a);};}
// the picker: Settings -> Developer -> Engineer tools -> "Board lab"
function labStart(k){LAB.set(k);try{panel.style.display='none';}catch(e){}if(!k)return;
 try{if(!PG)pgInit();const cat=PGU.boardCat||PG.current||'tuxedo';if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}
  if(WILD.on)wildExit();pgPlay(PG.open[cat]?cat:'tuxedo');if(WILD.phase!=='card')wildReset();wildStartCountdown();}catch(e){try{diagEvent('cp83','start failed '+e);}catch(_){}}}
/* CP-83: the Board lab picker is removed (PM, Nov 18: no lab state can reach normal play) */
// ---------- CP-83 round 2 (Jenny, Nov 18: "make aim and timing matter ... A board counts only if skilled drops clearly beat
// random ones.") ----------
// Lab-only board pieces that react to where you drop, drawn in code (stand-in art). They are added as fixed colliders when a
// lab board that has them is built, and removed whenever any board is built or the Wild board is left. Normal play has none.
//   rails:[[x0,z0,x1,z1],...]  low walls that split the board into lanes
//   cup:{x,z,r}               a hole: a coin whose centre passes over it drops in (counts, pays 1 coin)
//   bumpers:[{x,z,r}]         a post that kicks away any coin that touches it (counts once per coin)
//   gate:{x0,x1,z,pad:{x,z,r},open}  a bar across the front; a coin you dropped in the last 3 s crossing the pad opens it
// Goal kinds added: cup (N coins in the cup), bump (N coins bumped).
const LAB2={cols:[],flash:0,gateOpen:0,gateUp:true,gateCol:null,stats:{cup:0,bump:0,gate:0}};
function lab2Clear(){for(const c of LAB2.cols){try{world.removeCollider(c,true);}catch(e){}}LAB2.cols=[];LAB2.gateCol=null;LAB2.gateOpen=0;LAB2.gateUp=true;LAB2.flash=0;}
function lab2Seg(px,pz,x0,z0,x1,z1){const dx=x1-x0,dz=z1-z0,t=Math.max(0,Math.min(1,((px-x0)*dx+(pz-z0)*dz)/(dx*dx+dz*dz)));return Math.hypot(px-x0-t*dx,pz-z0-t*dz);}
function lab2Wall(x0,z0,x1,z1,h,th){const len=Math.hypot(x1-x0,z1-z0),a=Math.atan2(x1-x0,z1-z0);
 return world.createCollider(RAPIER.ColliderDesc.cuboid(th/2*M,h/2*M,len/2*M).setTranslation((x0+x1)/2*M,h/2*M,(z0+z1)/2*M).setRotation({x:0,y:Math.sin(a/2),z:0,w:Math.cos(a/2)}).setFriction(.2));}
function lab2Build(L){lab2Clear();if(!L)return;
 const near=f=>{for(const b of [...bodies]){if(b.dead)continue;const q=b.rb.translation();if(f(q.x/M,q.z/M,b))removeCoin(b);}};
 for(const [x0,z0,x1,z1] of L.rails||[]){near((x,z)=>lab2Seg(x,z,x0,z0,x1,z1)<COIN_R+5);LAB2.cols.push(lab2Wall(x0,z0,x1,z1,30,6));}
 for(const B of L.bumpers||[]){near((x,z)=>Math.hypot(x-B.x,z-B.z)<B.r+COIN_R+3);LAB2.cols.push(world.createCollider(RAPIER.ColliderDesc.cylinder(18*M,B.r*M).setTranslation(B.x*M,18*M,B.z*M).setFriction(.1).setRestitution(.6)));}
 if(L.cup)near((x,z)=>Math.hypot(x-L.cup.x,z-L.cup.z)<L.cup.r+COIN_R);
 if(L.gate){const G=L.gate;near((x,z)=>Math.abs(z-G.z)<COIN_R+5&&x>G.x0-COIN_R&&x<G.x1+COIN_R);near((x,z)=>Math.hypot(x-G.pad.x,z-G.pad.z)<G.pad.r);
  LAB2.gateCol=lab2Wall(G.x0,G.z,G.x1,G.z,30,8);LAB2.cols.push(LAB2.gateCol);}}
{const __lab2Prefill=wildPrefill;wildPrefill=function(){const r=__lab2Prefill.apply(this,arguments);try{lab2Build(LAB.on()&&WILD.on?LAB.def():null);}catch(e){try{diagEvent('cp83','pieces '+e);}catch(_){}}return r;};}
{const __lab2Exit=wildExit;wildExit=function(){lab2Clear();return __lab2Exit.apply(this,arguments);};}
// play: the cup takes coins, bumpers kick, the switch opens the gate
function lab2Tick(dt){if(!LAB.on()||!WILD.on)return;const L=LAB.def();if(!(L.cup||L.bumpers||L.gate))return;LAB2.flash=Math.max(0,LAB2.flash-dt);
 const playing=board.status==='playing'&&WILD.phase==='play';
 for(const b of [...bodies]){if(b.dead||(b.kind!=='coin'&&b.kind!=='silver'))continue;const q=b.rb.translation(),x=q.x/M,z=q.z/M,y=q.y/M;
  if(L.cup&&y<COIN_HALF*2+2&&Math.hypot(x-L.cup.x,z-L.cup.z)<L.cup.r){removeCoin(b);LAB2.stats.cup++;S.coins+=1;board.remaining=S.coins;const p=proj(L.cup.x,L.cup.z);floats.push({text:'+1',x:p.x,y:p.y-14,t:0});sfx.wild('drip',.8);
   if(playing&&L.lab.kind==='cup'&&LAB.st.got<L.lab.n)labScore(L.cup.x);continue;}
  for(const B of L.bumpers||[]){const d=Math.hypot(x-B.x,z-B.z);if(d<B.r+COIN_R+1.5&&y<20&&!(b.lab2Kick>time-.6)){b.lab2Kick=time;const ux=(x-B.x)/d,uz=(z-B.z)/d,v=b.rb.linvel();
    b.rb.setLinvel({x:v.x+ux*1.6,y:v.y+.5,z:v.z+uz*1.6+.5},true);LAB2.flash=.18;sfx.clink(.6);if(!b.lab2Bumped){b.lab2Bumped=true;LAB2.stats.bump++;if(playing&&L.lab.kind==='bump'&&LAB.st.got<L.lab.n)labScore(B.x);}}}
  if(L.gate&&b.input&&b.mouthAt>time-3&&Math.hypot(x-L.gate.pad.x,z-L.gate.pad.z)<L.gate.pad.r&&LAB2.gateOpen<=0){LAB2.gateOpen=L.gate.open;LAB2.stats.gate++;sfx.wild('whistle',1);
   const p=proj(L.gate.pad.x,L.gate.pad.z);floats.push({text:'GATE OPEN!',x:p.x,y:p.y-14,t:0,big:true});}}
 if(L.gate&&LAB2.gateCol){const G=L.gate;if(LAB2.gateOpen>0){LAB2.gateOpen-=dt;if(LAB2.gateUp){LAB2.gateCol.setEnabled(false);LAB2.gateUp=false;}}
  else if(!LAB2.gateUp){const busy=bodies.some(b=>{if(b.dead)return false;const q=b.rb.translation();return Math.abs(q.z/M-G.z)<COIN_R+6&&q.x/M>G.x0-COIN_R&&q.x/M<G.x1+COIN_R;});if(!busy){LAB2.gateCol.setEnabled(true);LAB2.gateUp=true;}}}}
{const __lab2Update=update;update=function(dt){__lab2Update(dt);try{lab2Tick(dt);}catch(e){}};}
// drawing (after the table, before the coins)
function lab2Poly(pts,fill,stroke){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.2;ctx.stroke();}}
function lab2DrawWall(x0,z0,x1,z1,h,top,side){const a=screenOf(x0,z0,0),b=screenOf(x1,z1,0),c=screenOf(x1,z1,h),d=screenOf(x0,z0,h);lab2Poly([a,b,c,d],side,'rgba(0,0,0,.35)');
 ctx.strokeStyle=top;ctx.lineWidth=Math.max(2,4*c.s);ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.stroke();}
function lab2Ellipse(x,z,r,h,fill,stroke,lw){const c=screenOf(x,z,h),e=screenOf(x+r,z,h),f=screenOf(x,z+r,h);ctx.beginPath();ctx.ellipse(c.x,c.y,Math.max(1,Math.abs(e.x-c.x)),Math.max(1,Math.abs(f.y-c.y)),0,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}}
function lab2Draw(){if(!LAB.on()||!WILD.on)return;const L=LAB.def();if(!(L.rails||L.cup||L.bumpers||L.gate))return;ctx.save();
 if(L.cup){lab2Ellipse(L.cup.x,L.cup.z,L.cup.r+5,0,'#2a1708','#ffd23f',3);lab2Ellipse(L.cup.x,L.cup.z,L.cup.r,0,'#050302',null);}
 if(L.gate){const G=L.gate,on=LAB2.gateOpen>0;lab2Ellipse(G.pad.x,G.pad.z,G.pad.r,0,on?'rgba(125,255,106,.9)':'rgba(255,90,90,.85)','#2a0b3e',2);
  const c=screenOf(G.pad.x,G.pad.z,0);ctx.fillStyle='#2a0b3e';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SWITCH',c.x,c.y);
  if(!on)lab2DrawWall(G.x0,G.z,G.x1,G.z,30,'#ff6a5a','rgba(160,40,40,.85)');else lab2DrawWall(G.x0,G.z,G.x1,G.z,3,'#7dff6a','rgba(40,140,40,.6)');}
 for(const [x0,z0,x1,z1] of L.rails||[])lab2DrawWall(x0,z0,x1,z1,30,'#9ff0ff','rgba(30,110,140,.85)');
 for(const B of L.bumpers||[]){const k=LAB2.flash>0;lab2Ellipse(B.x,B.z,B.r,0,'#5a1f6e',null);
  const a=screenOf(B.x-B.r,B.z,0),b=screenOf(B.x+B.r,B.z,0),c=screenOf(B.x+B.r,B.z,36),d=screenOf(B.x-B.r,B.z,36);lab2Poly([a,b,c,d],k?'#ffb0ff':'#c04ad8',null);
  lab2Ellipse(B.x,B.z,B.r,36,k?'#fff2a0':'#ff8ad8','#5a1f6e',2);}
 ctx.restore();}
{const __lab2Machine=drawMachine;drawMachine=function(...a){const r=__lab2Machine.apply(this,a);try{lab2Draw();}catch(e){}return r;};}
// the boards
Object.assign(LAB.B,{
 lanes:{name:'Three lanes',tag:'Lab',coins:200,secs:900,budget:24,extras:true,lab:{kind:'collect',text:'Get the tuna',row:'Get the tuna'},goal:['tuna'],star:null,
  // two rails fan out from the drop zone and split the board into three lanes; the tuna waits at the front of the left one
  rails:[[163,300,108,748],[237,300,292,748]],p:[['tuna',78,640]],towers:[],rain:[],quake:null},
 cup:{name:'Cup shot',tag:'Lab',coins:200,secs:900,budget:18,extras:true,lab:{kind:'cup',n:6,text:'Sink 6 coins in the cup',unit:'coins in the cup'},goal:[],star:null,
  // a hole on the left of the board: coins pushed over it drop in
  cup:{x:150,z:430,r:30},p:[],towers:[],rain:[],quake:null},
 bumper:{name:'Bumper',tag:'Lab',coins:200,secs:900,budget:28,extras:true,lab:{kind:'bump',n:12,text:'Bump 12 coins',unit:'coins bumped'},goal:[],star:null,
  // a pinball post just in front of the right-hand drop lanes: coins pushed into it get kicked
  bumpers:[{x:248,z:345,r:18}],p:[],towers:[],rain:[],quake:null},
 gate:{name:'Switch gate',tag:'Lab',coins:200,secs:900,budget:14,extras:true,lab:{kind:'collect',text:'Get the cheese',row:'Open the gate:'},goal:['cheese'],star:null,
  // a red bar across the front middle; a coin you drop onto the switch (back left) opens it for 4 s
  gate:{x0:105,x1:295,z:738,pad:{x:122,z:296,r:17},open:3},p:[['cheese',200,690]],towers:[],rain:[],quake:null}});
LAB.ORDER.push('lanes','cup','bumper','gate');
// Timing light (every lab board): measured on UAT 103 (Level 3, 2 coins a stroke, 30 strokes x 3 seeds), coins dropped
// while the pusher is between about 35% and 60% of its cycle (most of the way through its push) send about 90 pieces over the
// front per 100 coins; random timing about 50; dropped while it's fully back about 37. Nothing about the physics changes: a
// strip on the pusher's front edge lights green during that window so the player can see and learn it, and a drop made
// inside it says "Good timing!" (at most once every 1.5 s). Developer switch: Engineer tools -> "Timing strip": Off (default)
// / On, saved on the phone (catpusher.uat.cp83timing.v1); when On it shows in every round (levels too). Drawing only.
const LAB2T={from:.35,to:.6,lastSay:-9,good:0,drops:0,KEY:'catpusher.uat.cp83timing.v1',mode:'off'};
try{const v=localStorage.getItem(LAB2T.KEY);if(v==='on'||v==='off')LAB2T.mode=v;}catch(e){}
LAB2T.on=()=>LAB2T.mode==='on';LAB2T.set=k=>{if(k!=='on'&&k!=='off')return;LAB2T.mode=k;try{localStorage.setItem(LAB2T.KEY,k);}catch(e){}};
function lab2InWindow(){const ph=pushPhase/PUSH_PERIOD;return ph>=LAB2T.from&&ph<=LAB2T.to;}
function lab2DrawLight(){if(!LAB2T.on()||!WILD.on||WILD.phase!=='play')return;const on=lab2InWindow(),h=TONGUE_H*.75;
 const a=screenOf(200-PUSH_HALF+6,pusherY,h),b=screenOf(200+PUSH_HALF-6,pusherY,h);ctx.save();ctx.lineCap='round';
 ctx.strokeStyle=on?'rgba(125,255,106,.95)':'rgba(255,255,255,.18)';ctx.lineWidth=Math.max(3,7*a.s);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
 if(on){ctx.strokeStyle='rgba(125,255,106,.35)';ctx.lineWidth=Math.max(8,18*a.s);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}
{const __lab2tMachine=drawMachine;drawMachine=function(...a){const r=__lab2tMachine.apply(this,a);try{lab2DrawLight();}catch(e){}return r;};}
{const __lab2tDrop=tryDrop;tryDrop=function(...a){const r=__lab2tDrop.apply(this,a);try{if(r!==false&&WILD.on&&WILD.phase==='play'&&(LAB2T.on()||LAB.on())){LAB2T.drops++;if(lab2InWindow()){LAB2T.good++;
   if(LAB2T.on()&&time-LAB2T.lastSay>1.5){LAB2T.lastSay=time;const p=screenOf(200,pusherY+40,0);floats.push({text:'Good timing!',x:p.x,y:p.y,t:0});}}}}catch(e){}return r;};}
// Tower fall (Jenny, Nov 18: "It would be fun if they were really stacked up with towers that fall in a really fun way").
// Developer switch: Settings -> Developer -> Engineer tools -> "Tower fall": Today (default) / Topple. Saved on the phone
// (catpusher.uat.cp83tower.v1). Applies to every tower on every board while it is on (levels included), never otherwise.
// Today a tower gets one tip, only when it is moving fast; if that tip doesn't take it past 14 degrees it stands back up and
// is never tipped again, so the pile slides it along until it goes over an edge whole. Topple changes three things:
//  1. tip: once a tower has been shoved its limit, it is tipped (whatever its speed) by a push at its top twice today's, in
//     the way the pile is moving it (forward if it isn't moving);
//  2. it keeps being tipped: while it is still upright and the pile is still moving it, another tip every 0.4 s;
//  3. it falls, then bursts: it leans to 48 degrees (or 0.7 s past 14) before it comes apart, and comes apart the way the old
//     Board 3 terraces did (each coin keeps the tower's spin, spreads out, the spill recording plays).
// Heavier towers (3x, same look) were tried for Jenny's "different size coins": no better than Topple (slightly more went
// over an edge whole), so not offered. Bigger coins would mean resizing the approved coin art, so size wasn't tried.
// Pusher, coin physics and the frozen pickup are unchanged.
const LABT=(()=>{const KEY='catpusher.uat.cp83tower.v1',NAMES={today:'Today',topple:'Topple'};let mode='today';
 try{const v=localStorage.getItem(KEY);if(v in NAMES)mode=v;}catch(e){}
 const stats={tips:0,retips:0,bursts:0,edge:0};
 return {KEY,NAMES,stats,on:()=>mode==='topple',get:()=>mode,set(k){if(!(k in NAMES))return;mode=k;try{localStorage.setItem(KEY,k);}catch(e){}try{diagEvent('cp83','tower '+k);}catch(_){}}};})();
const LABT_COS48=Math.cos(48*Math.PI/180);LABT.minSpeed=.02; // m/s (2 units a second): being pushed, not resting
function labtTilt(b){return qrot(b.rb.rotation(),{x:0,y:1,z:0}).y;}
function labtTip(b){const v=b.rb.linvel(),sp=Math.hypot(v.x,v.z);const ux=sp>1e-4?v.x/sp:0,uz=sp>1e-4?v.z/sp:1;
 const t=b.rb.translation(),top=qrot(b.rb.rotation(),{x:0,y:b.half*M,z:0}),k=b.rb.mass()*TOWER_TIP_PUSH*2;
 b.rb.applyImpulseAtPoint({x:ux*k,y:0,z:uz*k},{x:t.x+top.x,y:t.y+top.y,z:t.z+top.z},true);b.labtAt=time;}
function labtTick(){if(!LABT.on())return;
 for(const b of bodies){if(b.dead||b.kind!=='stack')continue;const up=labtTilt(b);
  // shoved past its limit and still standing while the pile keeps moving it: another tip every 0.4 s
  if((b.tipping||b.moved>b.limit)&&up>.99&&time-(b.labtAt??-9)>.4){const v=b.rb.linvel();if(Math.hypot(v.x,v.z)>LABT.minSpeed){b.tipping=true;labtTip(b);LABT.stats.tips++;}}}}
{const __labtUpdate=update;update=function(dt){__labtUpdate(dt);try{labtTick();}catch(e){}};}
{const __labtBreak=breakStack;
 breakStack=function(b){if(!LABT.on()||!b||b.dead)return __labtBreak(b);const t=b.rb.translation(),up=labtTilt(b);
  if(t.y>=0&&up>LABT_COS48){if(b.labtLean==null)b.labtLean=time;if(time-b.labtLean<.7)return;} // still falling: let it lean
  if(t.y<0)LABT.stats.edge++;else LABT.stats.bursts++;
  const B0=BOARD;BOARD=Object.create(B0,{id:{value:'tuna-terraces',enumerable:true}});try{return __labtBreak(b);}finally{BOARD=B0;}};}
// the switch in Engineer tools, under "Board lab"
{const __labtCredits=openCredits;
 openCredits=function(){const r=__labtCredits.apply(this,arguments);try{
  const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp83-tower'))return r;
  const box=document.createElement('div');box.id='cp83-tower';const hd=document.createElement('h3');hd.textContent='Tower fall';box.appendChild(hd);
  const btns=[];const paint=()=>btns.forEach(b=>{const on=b.dataset.tf===LABT.get();b.textContent=(on?'✓ ':'')+LABT.NAMES[b.dataset.tf];b.style.fontWeight=on?'700':'400';});
  for(const k of ['today','topple']){const b=document.createElement('button');b.dataset.tf=k;b.style.marginRight='6px';b.onclick=()=>{LABT.set(k);paint();};btns.push(b);box.appendChild(b);}
  paint();const lab=eng.querySelector('#cp83-lab');if(lab&&lab.nextSibling)eng.insertBefore(box,lab.nextSibling);else eng.appendChild(box);}catch(e){}return r;};}
{const __lab2tCredits=openCredits;
 openCredits=function(){const r=__lab2tCredits.apply(this,arguments);try{
  const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp83-timing'))return r;
  const box=document.createElement('div');box.id='cp83-timing';const hd=document.createElement('h3');hd.textContent='Timing strip';box.appendChild(hd);
  const btns=[];const N={off:'Off',on:'On'};const paint=()=>btns.forEach(b=>{const on=b.dataset.ts===LAB2T.mode;b.textContent=(on?'✓ ':'')+N[b.dataset.ts];b.style.fontWeight=on?'700':'400';});
  for(const k of ['off','on']){const b=document.createElement('button');b.dataset.ts=k;b.style.marginRight='6px';b.onclick=()=>{LAB2T.set(k);paint();};btns.push(b);box.appendChild(b);}
  paint();const tf=eng.querySelector('#cp83-tower');if(tf&&tf.nextSibling)eng.insertBefore(box,tf.nextSibling);else eng.appendChild(box);}catch(e){}return r;};}
// Drop budget (round-2 boards, Jenny: "the timer gives me way too much time"; the plan is a coin wallet, CP-23): no round
// timer; a fixed number of drops to reach the goal, shown where the clock was ("18 drops"). Coins won still go to the wallet
// as usual; the budget only counts drops. When it is used up and the goal isn't met within 4 s of the last drop, the round
// ends as "out of coins". Sized from the skilled-vs-random bot runs (with the extras on).
const LABB={last:-9};
function labBudget(){return LAB.on()&&WILD.on&&LAB.def().budget?LAB.def().budget:0;}
{const __labbReset=wildReset;wildReset=function(){const r=__labbReset.apply(this,arguments);LAB.st.left=labBudget();LABB.last=-9;return r;};}
{const __labbDrop=tryDrop;tryDrop=function(...a){if(labBudget()&&WILD.phase==='play'&&LAB.st.left<=0)return false;const n0=board.released;const r=__labbDrop.apply(this,a);
  if(labBudget()&&board.released>n0){LAB.st.left=Math.max(0,LAB.st.left-(board.released-n0));LABB.last=time;}return r;};}
{const __labbTick=wildTick;wildTick=function(dt){if(labBudget()&&WILD.phase==='play')WILD.left=Math.max(WILD.left,600);const r=__labbTick(dt);
  if(labBudget()&&WILD.phase==='play'&&board.status==='playing'&&LAB.st.left<=0&&!LAB.st.pending&&time-LABB.last>4)wildFinish(false,'coins');return r;};}
{const __labbClock=wildClock;wildClock=function(){if(labBudget())return (LAB.st.left|0)+' drops';return __labbClock();};}
// ---------- CP-83 round 3: Pusher chains, direction A (Jenny, Nov 18: "one tap can give you up to 20 or 25 payoffs... it's a
// much more satisfying feeling when you get a big one."; "Let's go with A, please") ----------
// The board starts plain gold (three hint coins in the back row, one of each colour). Every coin you drop is red, green or
// blue (stand-in tints of the coin face, as Red coins); the ledge under the cat's mouth shows your next coin and the two after
// it. You build the chain yourself:
//  - trigger: your coin lands touching 2+ coins of its colour -> that group (3+) bursts (checked only as it lands, so groups
//    the pile pushes together later wait for you);
//  - chain: a bursting group sets off any touching group of 2+ of the NEXT colour in the cycle red -> green -> blue -> red,
//    0.2 s later, and so on ("CHAIN x3!  11"). A pair right in front of a burst can be kicked apart first: build pairs
//    side by side.
// So you lay pairs side by side in cycle order, then drop the third coin of the first pair. Burst coins are kicked forward
// and turn gold. Goal kind 'chain': N coins burst from one tap (all its chain steps together). Normal extras, drop budget.
const LAB3={colors:['lab-red','lab-green','lab-blue'],tint:{'lab-red':['#ff3a2e','#a8281e'],'lab-blue':['#2f7bff','#1e4aa8','color'],'lab-green':['#3adf5a','#1e8a30']},
 cycle:{'lab-red':'lab-green','lab-green':'lab-blue','lab-blue':'lab-red'},trigMin:3,chainMin:2,queue:[],ahead:[],stats:{bursts:0,chains:0,coins:0,tapBest:0,taps:[]},rs:1};
function lab3Rand(){LAB3.rs=LAB3.rs*16807%2147483647;return (LAB3.rs-1)/2147483646;}
function labTintSprite(id){const key='coin:'+id;if(sprites[key])return sprites[key];const base=sprite('coin');const cv=document.createElement('canvas');cv.width=base.cv.width;cv.height=base.cv.height;
 const g=cv.getContext('2d');g.drawImage(base.cv,0,0);g.globalCompositeOperation=LAB3.tint[id][2]||'multiply';g.fillStyle=LAB3.tint[id][0];g.fillRect(0,0,cv.width,cv.height);
 g.globalCompositeOperation='destination-in';g.drawImage(base.cv,0,0);return sprites[key]={...base,cv};}
{const __lab3Draw=drawCoinAt;drawCoinAt=function(kind,c,q,id){if(kind==='coin'&&LAB3.tint[id]){labTintSprite(id);const er=EDGE.coin;EDGE.coin=LAB3.tint[id][1];try{return __lab3Draw(kind,c,q,id);}finally{EDGE.coin=er;}}return __lab3Draw(kind,c,q,id);};}
function lab3Chain(){return LAB.on()&&WILD.on&&!!LAB.def().chain;}
function lab3Pick(){return LAB3.colors[Math.floor(lab3Rand()*3)];}
// the board: plain gold, with one hint coin of each colour in the back row
{const __lab3Prefill=wildPrefill;wildPrefill=function(){const r=__lab3Prefill.apply(this,arguments);try{if(lab3Chain()){
   const back=bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')&&b.rb.translation().z/M<PUSH_MAX+COIN_R*2+6).sort((a,b)=>a.rb.translation().x-b.rb.translation().x);
   for(const b of bodies)if(!b.dead&&b.kind==='silver')b.kind='coin';
   const pick=[Math.floor(back.length*.2),Math.floor(back.length*.5),Math.floor(back.length*.8)];pick.forEach((k,i)=>{if(back[k])back[k].id=LAB3.colors[i];});}}catch(e){}return r;};}
{const __lab3Reset=wildReset;wildReset=function(){const r=__lab3Reset.apply(this,arguments);LAB3.queue=[];Object.assign(LAB3.stats,{bursts:0,chains:0,coins:0,tapBest:0,taps:[]});
  if(lab3Chain()){LAB3.rs=(LAB.def().chain.seed||7)*31+5;LAB3.ahead=[lab3Pick(),lab3Pick(),lab3Pick()];LAB.st.next=LAB3.ahead[0];}return r;};}
// your coin takes the first colour in the preview; a new one joins the end
{const __lab3Drop=tryDrop;tryDrop=function(...a){const n0=board.released;const r=__lab3Drop.apply(this,a);
  try{if(lab3Chain()&&board.released>n0){const b=bodies[bodies.length-1];if(b&&b.input&&b.kind==='coin'){b.id=LAB3.ahead[0];b.lab3Wait=true;}LAB3.ahead.shift();LAB3.ahead.push(lab3Pick());LAB.st.next=LAB3.ahead[0];}}catch(e){}return r;};}
const LAB3_TOUCH=COIN_R*2+5;
function lab3Group(seed){const id=seed.id,out=[seed],seen=new Set([seed.uid]);const pool=bodies.filter(b=>!b.dead&&b.kind==='coin'&&b.id===id);
 for(let i=0;i<out.length;i++){const p=out[i].rb.translation();for(const b of pool){if(seen.has(b.uid))continue;const q=b.rb.translation();if(Math.hypot((q.x-p.x)/M,(q.z-p.z)/M)<LAB3_TOUCH&&Math.abs(q.y-p.y)/M<COIN_HALF*5){seen.add(b.uid);out.push(b);}}}return out;}
function lab3Burst(group,step,root){const colour=group[0].id;root=root||{n:0};root.n+=group.length;LAB3.stats.tapBest=Math.max(LAB3.stats.tapBest,root.n);const playing=board.status==='playing'&&WILD.phase==='play';let sx=0,sz=0;
 for(const b of group){const q=b.rb.translation();sx+=q.x/M;sz+=q.z/M;const v=b.rb.linvel();b.rb.setLinvel({x:v.x+(lab3Rand()-.5)*.6,y:.7,z:v.z+1.7+lab3Rand()*.5},true);b.rb.setAngvel({x:(lab3Rand()-.5)*8,y:0,z:(lab3Rand()-.5)*8},true);b.id=null;b.lab3Wait=false;}
 sx/=group.length;sz/=group.length;LAB3.stats.bursts++;LAB3.stats.coins+=group.length;LAB3.stats.chains=Math.max(LAB3.stats.chains,step);
 const p=proj(sx,sz);floats.push({text:step>1?'CHAIN ×'+step+'!  '+root.n:'BURST '+group.length,x:p.x,y:p.y-16,t:0,big:root.n>=6||step>1});
 try{sfx.tumble(Math.min(12,group.length+2));}catch(e){}
 if(playing&&LAB.def().lab.kind==='chain'){const L=LAB.def();LAB.st.got=Math.min(L.lab.n,Math.max(LAB.st.got,root.n));if(LAB.st.got>=L.lab.n)labWin();}
 const nextId=LAB3.cycle[colour],near=new Set();
 for(const b of group){const p2=b.rb.translation();for(const o of bodies){if(o.dead||o.kind!=='coin'||o.id!==nextId||near.has(o))continue;const q=o.rb.translation();if(Math.hypot((q.x-p2.x)/M,(q.z-p2.z)/M)<LAB3_TOUCH+4)near.add(o);}}
 for(const o of near)LAB3.queue.push({at:time+.2,seed:o,step:step+1,root});
 if(step===1)LAB3.stats.taps.push(root);}
function lab3Tick(){if(!lab3Chain())return;
 // your coin: checked as it lands (0.4 s), so coins the pile pushes together later don't go off by themselves
 for(const b of bodies){if(b.dead||!b.lab3Wait||b.fresh)continue;if(b.lab3T==null)b.lab3T=time;if(time-b.lab3T>.4||!LAB3.tint[b.id]){b.lab3Wait=false;continue;}
  if(time-(b.lab3C||0)<.1)continue;b.lab3C=time;const g=lab3Group(b);if(g.length>=LAB3.trigMin){b.lab3Wait=false;lab3Burst(g,1);}}
 for(let i=LAB3.queue.length-1;i>=0;i--){const e=LAB3.queue[i];if(time<e.at)continue;LAB3.queue.splice(i,1);if(e.seed.dead||!LAB3.tint[e.seed.id])continue;const g=lab3Group(e.seed);if(g.length>=LAB3.chainMin)lab3Burst(g,e.step,e.root);}}
{const __lab3Update=update;update=function(dt){__lab3Update(dt);try{lab3Tick();}catch(e){}};}
// the preview on the ledge under the cat's mouth: the next coin big, the two after it smaller
function lab3DrawNext(){if(!lab3Chain()||!LAB3.ahead.length||WILD.phase==='end')return;const c=screenOf(200,T.BACK+8,6);ctx.save();
 uiCircle(c.x,c.y,17,'rgba(42,11,62,.85)','#ffd23f',2);ctx.drawImage(labTintSprite(LAB3.ahead[0]).cv,c.x-14,c.y-14,28,28);
 for(let i=1;i<3;i++){const x=c.x+18+i*20;uiCircle(x,c.y,9,'rgba(42,11,62,.75)',null,0);ctx.globalAlpha=1-.25*(i-1);ctx.drawImage(labTintSprite(LAB3.ahead[i]).cv,x-8,c.y-8,16,16);ctx.globalAlpha=1;}
 ctx.font='bold 10px system-ui';ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillStyle='#fff6d0';ctx.fillText('NEXT',c.x-22,c.y);ctx.restore();}
{const __lab3Machine=drawMachine;drawMachine=function(...a){const r=__lab3Machine.apply(this,a);try{lab3DrawNext();}catch(e){}return r;};}
// test helper (bots only, not used by the game): what a coin of colour id landing at (x,z) would do now:
// {trig: coins it would burst in one tap (0 if it wouldn't trigger), touch: same-colour coins it would touch, cyc: coins of the
// colours before/after it in the cycle it would touch}
function lab3Look(x,z,id){const coins=bodies.filter(b=>!b.dead&&b.kind==='coin'&&LAB3.tint[b.id]).map(b=>{const q=b.rb.translation();return {x:q.x/M,z:q.z/M,id:b.id};});
 const used=new Set();const grp=(start,c,skipUsed)=>{const out=[start],seen=new Set([start]);for(let i=0;i<out.length;i++)for(const o of coins){if(seen.has(o)||o.id!==c||(skipUsed&&used.has(o)))continue;if(Math.hypot(o.x-out[i].x,o.z-out[i].z)<LAB3_TOUCH){seen.add(o);out.push(o);}}return out;};
 const me={x,z,id};const g0=grp(me,id,false);const touch=coins.filter(o=>o.id===id&&Math.hypot(o.x-x,o.z-z)<LAB3_TOUCH).length;
 const prev=Object.keys(LAB3.cycle).find(k=>LAB3.cycle[k]===id),cyc=coins.filter(o=>(o.id===prev||o.id===LAB3.cycle[id])&&Math.hypot(o.x-x,o.z-z)<LAB3_TOUCH+4).length;
 if(g0.length<LAB3.trigMin)return {trig:0,touch,cyc};let total=g0.length-1+1;g0.forEach(o=>used.add(o));let front=g0,c=id;
 for(let step=0;step<10&&front.length;step++){c=LAB3.cycle[c];const nxt=[];for(const o of coins){if(used.has(o)||o.id!==c)continue;if(front.some(f=>Math.hypot(f.x-o.x,f.z-o.z)<LAB3_TOUCH+4)){const g=grp(o,c,true);if(g.length>=LAB3.chainMin){g.forEach(q=>used.add(q));nxt.push(...g);}}}total+=nxt.length;front=nxt;}
 return {trig:total,touch,cyc};}
Object.assign(LAB.B,{
 chain:{name:'Pusher chains',tag:'Lab',coins:200,secs:900,budget:20,extras:true,chain:{seed:7},lab:{kind:'chain',n:11,text:'Burst 11 in one tap',unit:'in one tap (best)'},goal:[],star:null,
  // plain gold board; you build pairs of colours in cycle order (red, green, blue) and set them off with the third coin
  p:[],towers:[],rain:[],quake:null}});
LAB.ORDER.push('chain');
// ---------- CP-83 Home > Board lab (Jenny, Nov 18: "I don't like having to go into settings and open these boards
// individually. Just give me a button on the home screen with all the lab boards so I can work through them all, please.") --
// UAT only, and only with Developer on (Developer off = production view). A teal "Board lab" button on Home, under "Daily
// puzzles" when that button is there (CP-87), else under PLAY. It opens a list of every lab board by round, each with its name
// and goal, plus the Tower fall and Timing strip switches (the same settings as in Engineer tools). Tap a board to play it;
// when the round ends the list comes back with the result and a "Next board" button, and boards played this session are
// ticked. "Home" turns the lab off and goes back to Home. This is the only way into the lab (no Engineer tools picker).
const LABH={el:null,active:false,last:null,played:{},won:{},result:'',opened:0};
const LABH_ROUNDS=[['Round 1',['tower','edge','pins','wall','mice','red']],['Round 2',['lanes','cup','bumper','gate']],['Round 3',['chain']]];
function labhOrder(){return LABH_ROUNDS.flatMap(r=>r[1]).filter(k=>LAB.B[k]);}
function labhNext(){const o=labhOrder();if(!LABH.last)return o[0];const i=o.indexOf(LABH.last);return o[(i+1)%o.length];}
function labhBuild(){if(LABH.el)return LABH.el;const el=document.createElement('div');el.id='cp83home';
 el.style.cssText='position:fixed;inset:0;z-index:60;display:none;flex-direction:column;background:rgba(18,10,34,.97);color:#f4ecff;font:15px system-ui,sans-serif;overflow:hidden';
 const st=document.createElement('style');st.textContent='#cp83home .bar{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #4a3a6a}'+
  '#cp83home .bar b{font-size:18px}#cp83home .body{overflow-y:auto;padding:8px 14px 24px;flex:1}#cp83home h3{margin:14px 0 6px;font-size:13px;color:#bfaee0;letter-spacing:.05em;text-transform:uppercase}'+
  '#cp83home button{font:700 15px system-ui,sans-serif;color:#f4ecff;background:#3a2d52;border:1px solid #6b5a8a;border-radius:12px;min-height:40px;padding:0 12px;touch-action:manipulation}'+
  '#cp83home .bd{display:flex;flex-direction:column;align-items:flex-start;width:100%;margin:5px 0;padding:8px 12px;text-align:left}#cp83home .bd small{font-weight:400;color:#cfc2ea;font-size:13px;margin-top:2px}'+
  '#cp83home .next{width:100%;background:#2fb5a8;border-color:#bff5ee;color:#08201d;margin:6px 0}#cp83home .res{margin:6px 0 2px;color:#ffe08a;font-weight:700}'+
  '#cp83home .sw{display:flex;align-items:center;gap:6px;margin:6px 0;flex-wrap:wrap}#cp83home .sw span{min-width:96px;color:#cfc2ea}#cp83home .sw button.on{background:#2fb5a8;color:#08201d;border-color:#bff5ee}';
 el.appendChild(st);const bar=document.createElement('div');bar.className='bar';bar.innerHTML='<span style="width:76px"></span><b>Board lab</b><button data-a="home">Home</button>';el.appendChild(bar);
 const body=document.createElement('div');body.className='body';el.appendChild(body);LABH.body=body;
 el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;try{pgSfx('tap');}catch(_){}
  if(b.dataset.a==='home')return labhHome();if(b.dataset.k)return labhPlay(b.dataset.k);
  if(b.dataset.tf){LABT.set(b.dataset.tf);labhPaint();}if(b.dataset.ts){LAB2T.set(b.dataset.ts);labhPaint();}});
 document.body.appendChild(el);LABH.el=el;return el;}
function labhPaint(){const B=LABH.body;if(!B)return;const nx=labhNext(),esc=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));let h='';
 if(LABH.result)h+='<div class="res">'+esc(LABH.result)+'</div>';
 if(nx)h+='<button class="next" data-k="'+nx+'">'+(LABH.last?'Next board: ':'Start: ')+esc(LAB.B[nx].name)+' ▶</button>';
 h+='<div class="sw"><span>Tower fall</span>'+['today','topple'].map(k=>'<button data-tf="'+k+'" class="'+(LABT.get()===k?'on':'')+'">'+LABT.NAMES[k]+'</button>').join('')+'</div>';
 h+='<div class="sw"><span>Timing strip</span>'+['off','on'].map(k=>'<button data-ts="'+k+'" class="'+(LAB2T.mode===k?'on':'')+'">'+(k==='on'?'On':'Off')+'</button>').join('')+'</div>';
 for(const [title,ks] of LABH_ROUNDS){h+='<h3>'+title+'</h3>';for(const k of ks){const L=LAB.B[k];if(!L)continue;const mark=LABH.won[k]?' ✓★':LABH.played[k]?' ✓':'';
   h+='<button class="bd" data-k="'+k+'"><span>'+esc(L.name)+mark+'</span><small>'+esc(L.lab.text)+(L.budget?' · '+L.budget+' drops':'')+'</small></button>';}}
 B.innerHTML=h;}
function labhOpen(){const el=labhBuild();labhPaint();el.style.display='flex';LABH.opened=performance.now();try{diagEvent('cp83','lab list');}catch(e){}}
function labhClose(){if(LABH.el)LABH.el.style.display='none';}
function labhPlay(k){labhClose();LABH.active=true;LABH.last=k;LABH.result='';LABH.shownEnd=false;labStart(k);}
function labhHome(){labhClose();LABH.active=false;LABH.result='';LAB.set(null);try{if(WILD.on){wildReset();PGU.screen='main';}}catch(e){}}
// after a lab round started from the list: the list comes back with the result
{const __labhTick=wildTick;wildTick=function(dt){const r=__labhTick(dt);try{if(LABH.active&&LAB.on()&&WILD.phase==='end'&&(WILD.endT||0)>1.8&&!LABH.shownEnd){LABH.shownEnd=true;const k=LABH.last,L=LAB.B[k];
   LABH.played[k]=1;if(WILD.win)LABH.won[k]=1;LABH.result=L.name+': '+(WILD.win?'you won!':WILD.reason==='coins'?'out of coins':'round over')+(L.lab.kind!=='collect'?' ('+Math.min(LAB.st.got,L.lab.n)+' of '+L.lab.n+')':'');labhOpen();}}catch(e){}return r;};}
// Home: the button
function labhBtn(){if(!S.dev||!PG)return null;const L=PGA.L,R=pgMainRects();if(!L||!L.play)return null;const w=176,h=36;
 let y=(typeof cp87Btn==='function'&&cp87Btn())?cp87Btn().y+cp87Btn().h+10:L.play.y+L.play.h+14;y=Math.min(y,R.bot-h-2);return {x:200-w/2,y,w,h};}
// leaving the lab always returns to normal play: whenever Home shows with a lab board still chosen and the list closed (the
// round's own Home button, or any other way back), the lab is turned off and the normal level rebuilt. A lab choice is never
// saved, so a fresh start is always normal play.
{const __labhGuard=update;update=function(dt){__labhGuard(dt);try{if(LAB.st.sel&&PGU&&PGU.screen==='main'&&!(LABH.el&&LABH.el.style.display==='flex')){LAB.set(null);LABH.active=false;LABH.result='';if(WILD.on){wildReset();}}}catch(e){}};}
function labhFree(){return PGU.screen==='main'&&!PGU.win&&!PGU.pick&&!PGU.modes&&!PGU.door&&!(LABH.el&&LABH.el.style.display==='flex');}
{const __labhDraw=pgDrawMain;pgDrawMain=function(dt){const r=__labhDraw(dt);try{if(labhFree()){const b=labhBtn();if(b){
   uiRound(b.x,b.y,b.w,b.h,18,'rgba(47,181,168,.92)','rgba(220,255,250,.85)',1.5);
   ctx.save();ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';ctx.fillText('Board lab',200,b.y+b.h/2+1);ctx.restore();}}}catch(e){}return r;};}
{const __labhTap=pgMainTap;pgMainTap=function(p){try{if(labhFree()){const b=labhBtn();if(b&&contains({x:b.x-4,y:b.y-4,w:b.w+8,h:b.h+8},p)){pgSfx('tap');LABH.last=null;LABH.result='';labhOpen();return;}}}catch(e){}return __labhTap(p);};}
// ---------- end CP-83 ----------
