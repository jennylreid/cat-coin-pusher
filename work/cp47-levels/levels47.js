// ---------- CP-47 Levels and cats (UAT 61; Jenny, Nov 14) ----------
// Levels are the boards: ten fixed layouts in sequence, each with a goal and an honest difficulty tag. Every replay starts
// the same (fixed prize spots, towers, rain and Quake coins, same seed). Passing a level opens the next. "Level n" is
// this number everywhere. Cats are who you play as: a cat brings its side game (its mode), its power and its prizes to any
// level. A cat's prizes are never in a level's layout: they fall from the sky during play, only while you play that cat.
// No XP: screens appear when a goal needs them (Kitchen after Level 2 with the first recipe, the Shop when a recipe needs
// a bought ingredient, the Porch with the first dish, the Album with the first photo, Cats with the second cat).
// The old boards and modes stay under Developer (MODES and "Old boards 1-3"), untouched by levels.
// Saved inside the progression save (catpusher.uat.progress.v1): PG.lv = {passed, sel, stars}, PG.shown, PG.powers.

// --- three more everyday prizes, drawn in code like the others (levels need more than five kinds for their goals) ---
const PGL_NEW=['ball','box','sock'];
Object.assign(PG_NAMES,{ball:'Toy ball',box:'Box',sock:'Sock'});
for(const id of PGL_NEW){PG_COMMON.push(id);PG_NEW_PRIZES.push(id);PG_PRIZES.push(id);if(!WILD_PRIZES.includes(id))WILD_PRIZES.push(id);PRIZE_OPAQUE[id]=.86;PRIZE_ASPECT[id]=1;WILD_PRIZE_NAMES[id]=PG_NAMES[id];}
const __pglPrizeArt=wildPrizeArt;
wildPrizeArt=function(id){
 if(!PGL_NEW.includes(id))return __pglPrizeArt(id);if(WILD_ART[id]&&WILD_ART[id].pgl)return WILD_ART[id];
 const cv=document.createElement('canvas');cv.width=cv.height=128;cv.pgl=1;const g=cv.getContext('2d');WILD_ART[id]=cv;g.lineJoin='round';g.lineCap='round';
 g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(64,112,40,9,0,0,7);g.fill();
 if(id==='ball'){g.save();g.beginPath();g.arc(64,64,42,0,7);g.clip();g.fillStyle='#ffffff';g.fillRect(0,0,128,128);g.fillStyle='#e8343c';g.fillRect(0,0,128,48);g.fillStyle='#2a6ae0';g.fillRect(0,80,128,48);
  const gr=g.createRadialGradient(46,44,6,64,64,46);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(0,0,0,.22)');g.fillStyle=gr;g.fillRect(0,0,128,128);g.restore();
  g.strokeStyle='#5a1a1a';g.lineWidth=4;g.beginPath();g.arc(64,64,42,0,7);g.stroke();uiStar(g,64,64,11,'#ffd23f');}
 else if(id==='box'){g.fillStyle='#c98a4a';g.strokeStyle='#6a4018';g.lineWidth=4;g.beginPath();g.moveTo(20,52);g.lineTo(64,40);g.lineTo(108,52);g.lineTo(108,100);g.lineTo(64,112);g.lineTo(20,100);g.closePath();g.fill();g.stroke();
  g.fillStyle='#e0a868';g.beginPath();g.moveTo(20,52);g.lineTo(64,64);g.lineTo(108,52);g.lineTo(64,40);g.closePath();g.fill();g.stroke();
  g.beginPath();g.moveTo(64,64);g.lineTo(64,112);g.stroke();g.fillStyle='#a8682a';g.beginPath();g.moveTo(20,52);g.lineTo(6,36);g.lineTo(50,26);g.lineTo(64,40);g.closePath();g.fill();g.stroke();
  g.beginPath();g.moveTo(108,52);g.lineTo(122,36);g.lineTo(78,26);g.lineTo(64,40);g.closePath();g.fill();g.stroke();}
 else if(id==='sock'){g.strokeStyle='#5a2a6a';g.lineWidth=4;g.beginPath();g.moveTo(44,14);g.lineTo(84,14);g.lineTo(84,70);g.quadraticCurveTo(86,84,104,88);g.quadraticCurveTo(122,96,110,110);g.lineTo(62,110);g.quadraticCurveTo(42,108,44,84);g.closePath();
  g.fillStyle='#ff9ad8';g.fill();g.save();g.clip();g.fillStyle='#8a4ad8';for(let y=24;y<100;y+=22)g.fillRect(0,y,128,10);g.fillStyle='#fff6d0';g.fillRect(40,10,48,12);g.restore();g.stroke();}
 return cv;};
function uiStar(g,x,y,r,c){g.save();g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}g.closePath();g.fill();g.restore();}

// --- the levels ---
// p: [id, x, depth] prize spots (x 30..370 across, depth 288 back .. 740 front). goal: the prizes to collect (each kind once;
// extra copies on the board are bonus prizes). top: [id, slot] for prizes on a tower wall (slot 0..4, left to right).
// towers: 'default' (Wild 2's two) or a list {x,y,n}; wall: a tower wall (heights); rain: [kind,x,y]; quake: [x,y] or null.
const PGL_LEVELS=[
 {name:'First push',tag:'Normal',coins:110,secs:60,goal:['egg','milk','sardine','biscuit'],star:'biscuit',
  p:[['egg',200,630],['milk',108,600],['sardine',292,600],['biscuit',250,520]],towers:'default',rain:[['rain10',200,705],['rain5',200,440]],quake:[140,545]},
 {name:'Line up',tag:'Normal',coins:110,secs:60,goal:['feather','ball','egg','milk','box'],star:'egg',
  p:[['feather',80,560],['ball',140,560],['egg',200,560],['milk',260,560],['box',320,560]],towers:'default',rain:[['rain10',110,690],['rain5',200,440]],quake:[200,660]},
 {name:'At the back',tag:'Hard',coins:90,secs:50,goal:['sardine','sock','biscuit','egg','box'],star:'sock',
  p:[['sardine',100,365],['sock',200,345],['biscuit',300,365],['egg',150,440],['box',250,440]],towers:[],rain:[['rain10',200,650],['rain5',110,580],['rain5',290,580]],quake:null},
 {name:'Crammed',tag:'Normal',coins:110,secs:60,goal:['egg','milk','feather','ball','sock','biscuit'],star:'sock',
  p:[['egg',90,485],['milk',160,480],['feather',240,480],['ball',310,485],['sock',120,560],['biscuit',200,555],['sardine',280,560],['milk',90,640],['box',160,635],['egg',240,635],['ball',310,640],['feather',200,705]],
  towers:'default',rain:[['rain10',200,435]],quake:null},
 {name:'Tower wall',tag:'Hard',coins:110,secs:60,goal:['egg','milk','sock','ball','feather'],star:'sock',
  top:[['egg',0],['milk',1],['sock',2],['ball',3],['feather',4]],p:[],wall:[13,18,23,18,13],rain:[['rain10',200,650],['rain5',200,718]],quake:[290,610]},
 {name:'Coin rain',tag:'Normal',coins:110,secs:60,goal:['biscuit','box','egg','sardine','milk','feather'],star:'feather',
  p:[['biscuit',100,520],['feather',200,505],['box',300,520],['egg',150,600],['sardine',250,600],['milk',200,690]],towers:'default',
  rain:[['rain25',200,440],['rain10',80,625],['rain10',320,625],['rain5',310,700]],quake:[95,700]},
 {name:'Edge of the table',tag:'Super hard',coins:80,secs:60,goal:['sock','ball','egg','box','feather','milk','sardine'],star:'sardine',
  p:[['sock',62,425],['ball',338,425],['egg',58,560],['box',342,560],['feather',62,655],['milk',338,655],['sardine',200,350]],towers:'default',rain:[['rain5',200,640]],quake:null},
 {name:'Wall and back',tag:'Hard',coins:120,secs:70,goal:['milk','egg','box','ball','biscuit','sardine'],star:'box',
  top:[['milk',0],['egg',1],['box',2],['ball',3],['biscuit',4]],p:[['sardine',200,365]],wall:[13,18,23,18,13],rain:[['rain10',200,650]],quake:[110,640]},
 {name:'Prize party',tag:'Normal',coins:110,secs:60,goal:['ball','sock','egg','milk','sardine'],star:null,
  p:[['ball',80,450],['sock',150,440],['egg',250,440],['milk',320,450],['sardine',110,520],['box',200,510],['feather',290,520],['biscuit',80,595],['ball',160,590],['egg',240,590],['sock',320,595],['milk',120,665],['sardine',200,660],['box',280,665]],
  towers:[],rain:[['rain10',200,720]],quake:[200,370]},
 {name:'The vault',tag:'Super hard',coins:65,secs:55,goal:['egg','milk','box','ball','feather','sock','biscuit','sardine'],star:'sock',
  top:[['egg',0],['milk',1],['box',2],['ball',3],['feather',4]],p:[['sock',200,312],['biscuit',66,345],['sardine',334,345]],wall:[16,21,23,21,16],rain:[],quake:null}];
const PGL_N=PGL_LEVELS.length;
const PGL={dev:false};
function pglLv(){if(!PG)return {passed:0,sel:1,stars:{}};if(!PG.lv||typeof PG.lv!=='object')PG.lv={passed:0,sel:1,stars:{}};const L=PG.lv;L.passed=Math.max(0,Math.min(PGL_N,L.passed|0));L.sel=Math.max(1,Math.min(PGL_N,L.sel|0||1,L.passed+1));if(!L.stars)L.stars={};return L;}
function pglSel(){return pglLv().sel;}
function pglLevel(n){return PGL_LEVELS[(n||pglSel())-1];}
// Levels apply to a cat's board (not to Developer modes, the old boards or the test suites' old board).
function pglActive(){return !!(PG&&!PG_HOME_OFF&&!PGU.oldBoards&&!PGL.dev);}
function pglOn(){return pglActive()&&WILD.on&&WILD.v2?pglLevel():null;}

const __pglFresh=pgFresh;pgFresh=function(){return {...__pglFresh(),lv:{passed:0,sel:1,stars:{}},shown:{},seenScr:{},powers:{}};};

// --- cats: the side game each brings (its mode), its power and its prizes ---
const PGL_CATINFO={tuxedo:{game:'Dance break',power:'Yawn'},orange:{game:'Treat toss',power:'Zoomies'},ragdoll:{game:'Pet the cat',power:'Hug'},
 siamese:{game:'Laser chase',power:'Sonic meow'},tortie:{game:'Mouse pounce',power:'Tortitude'}};
for(const c of PG_CATS){PG_CAT[c].board=PGL_CATINFO[c].game;}
PG_CAT.tortie.mode='pounce'; // Tower wall is a level type now; the Tortoiseshell brings Mouse pounce (UAT 62)
if(!WILD_MODES.pounce)registerWildMode({id:'pounce',name:'MOUSE POUNCE',blurb:'Tap the toy mice before they get away',colors:['#ff8a3c','#3a1400','#4a2410'],panel:['#5c2a14','#240e06'],
 features:{pounce:true},cardLines:[['paw','Prizes topple off the sides','Tap the glow to Paw save'],['rain10','Rain coins pour','5, 10 or 25 coins'],['!','Bonus drops','fall from the sky']],icon(x,y){uiPaw(x,y,.6,'#ffb27a');}});
pgCanPlay=function(cat){return !!PG.open[cat];}; // no level-5 gate: any cat you have, between rounds
function pglCatCount(){return PG_CATS.filter(c=>PG.open[c]).length;}
// A level's tower wall comes from the level, whichever cat plays it.
const __pglFeature=wildFeature;wildFeature=function(f){if(f==='towerwall'){const L=pglOn();if(L)return !!L.wall;}return __pglFeature(f);};
// The name on the PLAY screen and the goal card is the cat's.
const __pglModeName=wildModeName;wildModeName=function(){if(pglOn())return PG_CAT[PGU.boardCat||'tuxedo'].name.toUpperCase();return __pglModeName();};
// Developer's MODES picker plays the old modes as they were (no levels); playing a cat brings levels back.
const __pglModesTap=pgModesTap;pgModesTap=function(p){PGL.dev=true;return __pglModesTap(p);};
const __pglPlay=pgPlay;pgPlay=function(cat){PGL.dev=false;return __pglPlay(cat);};

// --- the board: the level's own layout on Wild 2's start rows ---
const __pglRoundList=pgRoundList;pgRoundList=function(cat){const L=pglActive()?pglLevel():null;if(L)return L.goal.slice();return __pglRoundList(cat);}; // old modes keep CP-45's list
const __pglPickStar=w43PickStar;w43PickStar=function(){const L=pglActive()&&WILD.v2?pglLevel():null;if(L)return L.star||null;return __pglPickStar();};
function pglClearAt(x,y,r){for(const b of [...bodies]){if(b.dead||(b.kind!=='coin'&&b.kind!=='silver'))continue;const q=b.rb.translation();if(Math.hypot(q.x/M-x,q.z/M-y)<r)removeCoin(b);}}
function pglFree(x,y,r){return !bodies.some(b=>{if(b.dead)return false;const q=b.rb.translation();return Math.hypot(q.x/M-x,q.z/M-y)<r;});}
const __pglPrefill=wildPrefill;
wildPrefill=function(){
 const L=pglOn();if(!L)return __pglPrefill();
 const H0=TW.heights.slice();if(L.wall)TW.heights.splice(0,5,...L.wall);
 try{__pglPrefill();}finally{TW.heights.splice(0,5,...H0);}
 // the level replaces Wild 2's own prizes, rain coins, Quake and (unless it keeps them) its two towers
 const keepDefault=L.towers==='default';
 for(const b of [...bodies]){if(b.dead)continue;if(b.kind==='item'||RAIN[b.kind]||b.kind==='quake'||(b.kind==='stack'&&!b.tw&&!keepDefault))removeCoin(b);}
 // fill the start rows where Wild 2's towers stood (same rows and spacing as the prefill)
 if(!keepDefault){const d=COIN_R*2+1;for(let y=PUSH_MAX+COIN_R+2;y+COIN_R<=T.FRONT-20-d;y+=d){const n=Math.floor(2*Math.min(tableHalfAt(y-COIN_R),tableHalfAt(y+COIN_R))/d);
  for(let i=0;i<n;i++){const x=200+(i-(n-1)/2)*d;if([[140,430],[260,430]].some(([tx,ty])=>Math.hypot(tx-x,ty-y)<COIN_R*1.6)&&pglFree(x,y,COIN_R*1.2)&&!(L.wall&&Math.abs(y-TW.z)<COIN_R*2.2))addCoin(seededRandom()<.25?'silver':'coin',null,x,COIN_HALF+.2,y,yawTurn(0));}}}
 if(Array.isArray(L.towers))for(const t of L.towers){pglClearAt(t.x,t.y,COIN_R*1.6);const s=addStack(t.x,null,t.y,null,t.n,null,seededRandom()*6);s.limit=5+seededRandom()*6;}
 const top=COIN_HALF*2+halfOf('item')+1;
 for(const [id,x,y] of L.p){const b=addCoin('item',id,x,top,y,yawTurn(0));b.wild=true;}
 if(L.top)for(const [id,slot] of L.top){const b=addCoin('item',id,200+(slot-2)*TW.gap,top,TW.z+90,yawTurn(0));b.wild=true;b.pglTop=slot;} // lifted onto its tower once the board settles
 for(const [k,x,y] of L.rain||[])addCoin(k,null,x,COIN_HALF*2+RAIN[k].half+1,y,yawTurn(seededRandom()*6)).rb.enableCcd(true);
 if(L.quake)addCoin('quake',null,L.quake[0],COIN_HALF*2+halfOf('quake')+1,L.quake[1],yawTurn(0));
};
// Tower-wall levels: each prize goes on its own tower (the star prize on the middle one).
const __pglTwPlace=twPlacePrizes;
twPlacePrizes=function(){const L=pglOn();if(!L||!L.top)return __pglTwPlace();
 const towers=bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.tw);const xs=[-2,-1,0,1,2].map(i=>200+i*TW.gap);
 for(const t of towers){t.rb.setTranslation({x:xs[t.twSlot]*M,y:(t.half+.1)*M,z:TW.z*M},true);t.rb.setRotation({x:0,y:0,z:0,w:1},true);t.rb.setLinvel({x:0,y:0,z:0},true);t.rb.setAngvel({x:0,y:0,z:0},true);
  const p=t.rb.translation();t.lx=p.x;t.lz=p.z;t.moved=0;t.tipping=false;t.twSide=false;}
 for(const b of bodies){if(b.dead||b.kind!=='item'||b.pglTop==null)continue;const t=towers.find(t=>t.twSlot===b.pglTop);if(!t)continue;const p=t.rb.translation();
  b.rb.setTranslation({x:p.x,y:p.y+(t.half+halfOf('item')+.6)*M,z:p.z},true);b.rb.setLinvel({x:0,y:0,z:0},true);b.rb.setAngvel({x:0,y:0,z:0},true);b.rb.setRotation(yawTurn(0),true);b.twTop=true;}};
// The level's coins and time.
const __pglReset=wildReset;
wildReset=function(){const r=__pglReset();const L=pglOn();if(L){S.coins=L.coins;board.remaining=S.coins;WILD.left=L.secs;WILD.pglLevel=pglSel();WILD.pglCatDrops=0;WILD.pglSched=0;}return r;};

// --- a cat's prizes fall from the sky during play, only while you play that cat ---
const __pglBonus=wildScheduleBonus;
wildScheduleBonus=function(){const L=pglOn(),miss=L?wildMissing():[],n0=WILD.incoming.length;const r=__pglBonus();
 if(L&&WILD.incoming.length>n0){const o=WILD.incoming[WILD.incoming.length-1],own=PG_CAT[PGU.boardCat||'tuxedo'].own;
  if(o.kind==='item'&&!miss.includes(o.id)&&(Math.random()<.5||(!WILD.pglCatDrops&&WILD.bonusN>=3))){o.id=own[(WILD.pglCatDrops|0)%own.length];WILD.pglCatDrops=(WILD.pglCatDrops|0)+1;}}
 return r;};
// and two of them for sure each round (about 10 s and 32 s after GO), a marker and a whistle first like any bonus drop
const PGL_CAT_DROPS=[10,32];
const __pglTick=wildTick;
wildTick=function(dt){const r=__pglTick(dt);const L=pglOn();
 if(L&&WILD.phase==='play'&&board.status==='playing'){const k=WILD.pglSched|0,t=WILD.goT||0;
  if(k<PGL_CAT_DROPS.length&&t>=PGL_CAT_DROPS[k]){WILD.pglSched=k+1;const own=PG_CAT[PGU.boardCat||'tuxedo'].own,id=own[(WILD.pglCatDrops|0)%own.length],y=rand(450,620),x=200+rand(-1,1)*(tableHalfAt(y)-50);
   WILD.incoming.push({kind:'item',id,x,y,t:.9,t0:.9});WILD.pglCatDrops=(WILD.pglCatDrops|0)+1;sfx.wild('whistle',1);}}
 return r;};
// A cat's prize isn't on the goal list: it shows its name instead of "REPEAT".
const __pglCollected=wildPrizeCollected;
wildPrizeCollected=function(b,x){const f0=floats.length;const r=__pglCollected(b,x);
 if(pglOn()&&pgOwner(b.id)&&!WILD_COLLECTION.includes(b.id))for(let i=floats.length-1;i>=f0;i--)if(floats[i].text==='REPEAT +5 COINS'){floats[i].text=pgName(b.id).toUpperCase()+'!';floats[i].big=true;break;}
 return r;};

// --- no XP: levels unlock things ---
pgAddXP=function(){return [];};
for(const k in PG_DOCK_LEVEL)PG_DOCK_LEVEL[k]=0;
pgRecipeOpen=function(r){return pglLv().passed>=r.level||(PG.recipes&&r.id in PG.recipes)||(PG.dishes[r.id]|0)>0;};
const PGL_SCR_NAME={kitchen:'The Kitchen',porch:'The Porch',album:'The Album',shop:'The Shop',board:'Cats'};
function pglScreenNeed(id){const lv=pglLv();
 if(id==='kitchen')return lv.passed>=2||PG_RECIPES.some(r=>r.id in PG.recipes)||Object.values(PG.dishes).some(n=>n>0);
 if(id==='porch')return Object.values(PG.dishes).some(n=>n>0)||PG.porch.some(s=>s);
 if(id==='album')return PG_CATS.some(c=>PG.photos[c]>0);
 if(id==='shop'){const m=pgMissing(pgCurrentRecipe());return !!PG.shown.kitchen&&Object.keys(m).some(i=>!pgWinnable(i));}
 if(id==='board')return pglCatCount()>=2;
 return false;}
function pglShown(id){return !!(PG&&PG.shown&&PG.shown[id]);}
function pglCheckScreens(quiet){if(!PG)return;if(!PG.shown)PG.shown={};let ch=false;
 for(const id of ['kitchen','shop','porch','album','board'])if(!PG.shown[id]&&pglScreenNeed(id)){PG.shown[id]=1;ch=true;if(!quiet)pgToast(id==='board'?'Cats: pick who you play as':PGL_SCR_NAME[id]+' is open','#ffe08a');}
 if(ch)pgSave();}
// buttons appear only once their screen is needed; a "!" shows until it's first visited
pgSideRects=function(y0,gap){const r=[];PG_SIDE_L.filter(pglShown).forEach((id,i)=>r.push({id,x:36,y:y0+i*gap,r:25}));PG_SIDE_R.filter(pglShown).forEach((id,i)=>r.push({id,x:W-36,y:y0+i*gap,r:25}));
 return r.map(b=>({...b,level:0,hit:{x:b.x-32,y:b.y-30,w:64,h:68}}));};
const __pglWaiting=pgWaiting;pgWaiting=function(id){if(PG&&PG.shown&&PG.shown[id]&&!(PG.seenScr&&PG.seenScr[id]))return true;return __pglWaiting(id);};
const __pglDockName=pgDockName;pgDockName=function(id){return id==='board'?'Cats':__pglDockName(id);};
const __pglGo=pgGo;pgGo=function(screen){if(PG&&screen!=='board'){if(!PG.seenScr)PG.seenScr={};if(!PG.seenScr[screen]){PG.seenScr[screen]=1;pgSave();}}return __pglGo(screen);};
// passing a level
function pglUnlocks(n){for(const r of PG_RECIPES)if(r.level===n&&!(r.id in PG.recipes)&&!(PG.photos[r.cat]>0)){PG.recipes[r.id]=1;PG.seen['r:'+r.id]=0;pgToast('New recipe: '+r.name,'#ffe08a');}}
const __pglRoundEnd=pgRoundEnd;
pgRoundEnd=function(win){const done=WILD.pgDone;__pglRoundEnd(win);if(done||!PG||PG_HOME_OFF)return;const P=WILD.pgResult;if(!P)return;const L=pglOn();
 if(!L){pgSave();return;}const lv=pglLv(),n=WILD.pglLevel||lv.sel;P.lvl=n;
 if(win){const first=n>lv.passed;if(first){lv.passed=n;pglUnlocks(n);}P.first=first;if((P.stars|0)>(lv.stars[n]|0))lv.stars[n]=P.stars;lv.sel=Math.min(PGL_N,lv.passed+1);P.next=lv.sel>n?lv.sel:0;}
 pglCheckScreens();pgSave();try{diagEvent('levels','level '+n+' '+(win?'passed':'lost')+' stars='+(P.stars|0)+' passed='+lv.passed);}catch(e){}};
// End card: stars, coins, and the level passed.
pgEndText=function(R){const P=WILD.pgResult;if(!P||PG_HOME_OFF)return false;const y=R.card.y+140;
 for(let i=0;i<3;i++)w43Star(200+(i-1)*34,y-2,13,i<P.stars?'#ffd23f':'rgba(255,255,255,.18)');
 ctx.font='bold 13px system-ui';ctx.fillStyle='#fff6d0';ctx.textAlign='center';
 const lead=P.lvl&&P.stars?(P.first?'Level '+P.lvl+' passed! ':'')+(P.next?'Level '+P.next+' is open · ':''):'';
 ctx.fillText(lead+'+'+P.coins+' coins'+(P.nip?' · +1 Catnip':''),200,y+20,330);return true;};
function pglAgainText(){if(!pglOn()||!WILD.pgResult)return 'PLAY AGAIN';return WILD.pgResult.next?'NEXT LEVEL':WILD.win?'PLAY AGAIN':'TRY AGAIN';}
const __pglBackText=pgBackText;pgBackText=function(){return pglActive()?'Main screen':__pglBackText();};

// --- the PLAY screen: Level n and its tag, the level's name with the goal, stars, and arrows for passed levels ---
pgBoardLevel=function(){return pglActive()?pglSel():(PG&&PG.passed|0)+1;};
const __pglDiff=pgDiff;pgDiff=function(cat){if(pglActive())return pglLevel().tag;return __pglDiff(cat);};
const __pglCentre=pgCentre;
pgCentre=function(y,t,o={}){
 if(!pglActive())return __pglCentre(y,t,o);
 const L=__pglCentre(y,t,o),lv=pglLv(),n=lv.sel,lev=pglLevel(n);
 // earned stars, small, under "Level n"
 const st=lv.stars[n]|0;if(st)for(let i=0;i<3;i++)w43Star(200+(i-1)*16,y+56,6,i<st?'#ffd23f':'rgba(255,255,255,.22)');
 // arrows to replay passed levels (and back to the newest)
 ctx.font='italic 900 22px Impact, "Arial Black", system-ui';const lw=ctx.measureText('LEVEL '+n).width;ctx.font='900 15px Impact, system-ui';const tw=ctx.measureText(lev.tag.toUpperCase()).width+22,tot=lw+10+tw;
 const ax=200-tot/2-24,bx=200+tot/2+24,can=Math.min(PGL_N,lv.passed+1);
 L.prev=n>1?{x:ax-20,y:y+38-20,w:40,h:40}:null;L.next=n<can?{x:bx-20,y:y+38-20,w:40,h:40}:null;
 for(const [r,d] of [[L.prev,-1],[L.next,1]])if(r){uiCircle(r.x+20,r.y+20,13,'rgba(255,255,255,.14)','rgba(255,232,176,.7)',1.5);pgChevron(r.x+20+d*1.5,r.y+20,d,'#fff',5);}
 return L;};
// the goal line names the level (the build points pgCentre's goal line here)
function pglGoalText(){return pglActive()&&WILD.v2?pglLevel().name+': collect these '+WILD_GOAL:'Collect these '+WILD_GOAL;}
function pglPickLevel(d){const lv=pglLv(),can=Math.min(PGL_N,lv.passed+1),n=Math.max(1,Math.min(can,lv.sel+d));if(n===lv.sel)return false;lv.sel=n;pgSave();pgSfx('tap');
 if(WILD.on&&WILD.phase==='card')wildReset();try{diagEvent('levels','select '+n);}catch(e){}return true;}
const __pglMainTap=pgMainTap;
pgMainTap=function(p){const L=PGA.L;if(pglActive()&&L&&!PGU.win&&!PGU.pick&&!PGU.modes&&!PGU.door){if(L.prev&&contains(L.prev,p)){pglPickLevel(-1);return;}if(L.next&&contains(L.next,p)){pglPickLevel(1);return;}}return __pglMainTap(p);};
const __pglBoardPointer=pgBoardPointer;
pgBoardPointer=function(p){const L=PGU.bL;if(pglActive()&&PG_AB==='B'&&L&&!PGU.rules&&!PGU.win&&!PGU.pick&&!PGU.modes&&!PGU.door&&pgRestPhase()&&WILD.phase==='card'){if(L.prev&&contains(L.prev,p)){pglPickLevel(-1);return true;}if(L.next&&contains(L.next,p)){pglPickLevel(1);return true;}}return __pglBoardPointer(p);};

// --- the top bar without the XP level ---
const __pglDrawDock=pgDrawDock;
pgDrawDock=function(){if(!pglActive()||!pgABOn())return __pglDrawDock();
 const D=pgDock(),a=WILD.phase==='card'?Math.min(1,(WILD.cardT||0)/.2):Math.min(1,((WILD.endT||0)-.9)/.2);if(!(a>0))return;
 ctx.save();ctx.globalAlpha=a;ctx.textBaseline='middle';
 let gr=ctx.createLinearGradient(0,0,0,D.bottom);gr.addColorStop(0,'#160a24');gr.addColorStop(1,'#2c1544');ctx.fillStyle=gr;ctx.fillRect(0,0,W,D.bottom);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,D.bottom,W,4);ctx.fillStyle='#ffe08a';ctx.fillRect(0,D.bottom-2,W,2);
 const y=D.y1;uiCircle(24,y,10,'#f5c632','#a8740c',1.5);pgPaw(24,y+1,.2,'#a8740c');ctx.textAlign='left';ctx.font='bold 17px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,40,y+1,70);
 const cx=40+Math.min(70,ctx.measureText(String(PG.coins)).width)+18;pgCatnipLeaf(cx,y+8,.8);ctx.fillStyle='#8dff9a';ctx.fillText(PG.catnip,cx+13,y+1);
 pgCollIcon(D.coll.x+D.coll.w/2,y);pgInvIcon(D.inv.x+D.inv.w/2,y);
 if(D.modes){const m=D.modes;uiRound(m.x,m.y,m.w,m.h,10,'rgba(20,60,60,.92)','#5ef0c0',1.5);ctx.fillStyle='#d8fff2';ctx.textAlign='center';ctx.font='900 11px Impact, system-ui';ctx.fillText('MODES',m.x+m.w/2,m.y+m.h/2+1);}
 pgGearIcon(D.gear.x+D.gear.w/2,y,9);ctx.restore();};

// --- the cat picker (the Cats button, once you have two cats) ---
function pglPickRects(){const top=Math.max(pgTop()+70,H-650),rows=PG_CATS.map((c,i)=>({c,x:24,y:top+66+i*90,w:352,h:82}));return {card:{x:12,y:top,w:376,h:66+PG_CATS.length*90+56},rows,close:{x:140,y:top+66+PG_CATS.length*90+10,w:120,h:34}};}
pgPickRects=pglPickRects;
pgDrawBoardPick=function(dt){const R=pglPickRects(),u=Math.min(1,PGU.pickT/.2);ctx.save();ctx.globalAlpha=u;ctx.fillStyle='rgba(8,4,16,.72)';ctx.fillRect(0,0,W,H);
 wildPanel(R.card,'#4b1f6e','#1d0f33');wildText('PICK A CAT',200,R.card.y+36,30,'#ffd23f','#2a0b3e',6);
 for(const r of R.rows){const C=PG_CAT[r.c],I=PGL_CATINFO[r.c],open=!!PG.open[r.c],cur=r.c===PGU.boardCat;uiRound(r.x,r.y,r.w,r.h,16,open?(cur?'rgba(125,255,106,.16)':'rgba(255,255,255,.14)'):'rgba(0,0,0,.3)',open?C.tag:'#554',2);
  if(open)pgHead(r.c,r.x+46,r.y+r.h/2,78,'calm');else{ctx.save();ctx.globalAlpha*=.5;ctx.filter='brightness(0)';pgHead(r.c,r.x+46,r.y+r.h/2,78,'calm',{noPupils:true});ctx.restore();ctx.fillStyle='#fff';ctx.font='900 26px Impact, system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',r.x+46,r.y+r.h/2+2);}
  ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.font='bold 17px system-ui';ctx.fillText(open?C.name:'???',r.x+94,r.y+20,170);
  ctx.font='12px system-ui';ctx.fillStyle='#e8dcff';
  if(open){ctx.fillText(I.game+' · power: '+I.power,r.x+94,r.y+42,250);ctx.fillText('Prizes:',r.x+94,r.y+63);const px=r.x+94+ctx.measureText('Prizes: ').width;C.own.forEach((id,i)=>pgPrizeIcon(id,px+14+i*30,r.y+60,24));
   const pw=(PG.powers&&PG.powers[r.c])|0;if(pw){ctx.textAlign='right';ctx.fillStyle='#ffe08a';ctx.font='bold 12px system-ui';ctx.fillText(I.power+' ×'+pw,r.x+r.w-14,r.y+63);}}
  else ctx.fillText('Photograph it on the Porch, then win its cat coin',r.x+94,r.y+44,250);
  ctx.textAlign='center';if(open&&cur){ctx.font='900 13px Impact, system-ui';ctx.fillStyle='#7dff6a';ctx.fillText('PLAYING',r.x+r.w-40,r.y+22);}else if(open)pgPlayTri(r.x+r.w-30,r.y+24,'#7dff6a');}
 ctx.textAlign='center';uiRound(R.close.x,R.close.y,R.close.w,R.close.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Close',200,R.close.y+R.close.h/2+1);ctx.restore();};
// switching cats keeps the level; the board rebuilds with that cat's side game
const __pglBP2=pgBoardPointer;
pgBoardPointer=function(p){if(PGU.pick&&pglActive()){const R=pglPickRects();for(const r of R.rows)if(contains(r,p)){if(!PG.open[r.c]){pgSfx('lock');pgToast('Photograph it on the Porch, then win its cat coin','#ffe08a');return true;}
   if(WILD.on&&r.c===PGU.boardCat){PGU.pick=false;pgSfx('back');return true;}pgSfx('door');pgSwitchBoard(r.c);try{diagEvent('levels','cat '+r.c);}catch(e){}return true;}PGU.pick=false;pgSfx('back');return true;}
 return __pglBP2(p);};
// a cat coin makes the cat playable
function pglCatLine(cat){return PGL_CATINFO[cat].game+' · power: '+PGL_CATINFO[cat].power;}

// screens appear as soon as they're needed, on any screen; a short message says so
const __pglUpdate=update;update=function(dt){__pglUpdate(dt);if(!PG||PG_HOME_OFF)return;PGL.chk=(PGL.chk||0)-dt;if(PGL.chk<=0&&!(WILD.on&&PGU.screen==='board'&&(WILD.phase==='play'||WILD.phase==='count'))){PGL.chk=.5;pglCheckScreens(!PGL.started);PGL.started=true;}};

// --- Developer: levels ---
const __pglDevHtml=pgDevHtml;
pgDevHtml=function(){let h=__pglDevHtml().replace(/<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Difficulty: [^<]*<\/span><button data-pgdiff="[a-z]+"[^>]*>[^<]*<\/button><\/div>/g,'');
 const lv=PG?pglLv():{passed:0,sel:1};
 const rows='<h3 style="margin-top:10px"><span>Levels (CP-47)</span><span>passed '+lv.passed+' / '+PGL_N+'</span></h3><button id="pgl-pass" class="wide">Pass the next level</button><button id="pgl-all" class="wide">Open every level</button><button id="pgl-reset" class="wide">Reset levels to Level 1</button>';
 return h.replace('<h3 style="margin-top:10px"><span>MODES',rows+'<h3 style="margin-top:10px"><span>MODES');};
const __pglDevBind=wildDevBind;
wildDevBind=function(panel){__pglDevBind(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;const re=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 const on=(id,f)=>{const el=box.querySelector('#'+id);if(el)el.onclick=()=>{if(!PG)pgInit();f();pglCheckScreens();pgSave();if(WILD.on&&WILD.phase==='card')wildReset();re();};};
 on('pgl-pass',()=>{const lv=pglLv();if(lv.passed<PGL_N){lv.passed++;pglUnlocks(lv.passed);}lv.sel=Math.min(PGL_N,lv.passed+1);});
 on('pgl-all',()=>{const lv=pglLv();for(let n=lv.passed+1;n<=PGL_N;n++)pglUnlocks(n);lv.passed=PGL_N;lv.sel=PGL_N;});
 on('pgl-reset',()=>{PG.lv={passed:0,sel:1,stars:{}};});};
