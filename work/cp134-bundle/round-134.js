// ---- UAT 134 items A, B, D, E, F, G (Jenny, Nov 20; tickets/ROUND-134.md) ----
// A. Pet the cat: the ring is gone; the strip meter is back (heart, meter, PEAK star, DONE and the time-left line), over the
//    coin board about 3/4 of the way down toward the front ("as much out of the way as possible, but while still being easy to
//    spot"). Fill and timing unchanged. The title (with UAT 133's longer time), the hints and the result stay under the chin
//    (petHudY, y 468), so the strip never sits on them. (Edits in build: the ring call is the strip again, drawn at petStripY.)
function petStripY(){try{const b=skyScreen(200,T.BACK,0).y,f=skyScreen(200,T.FRONT,0).y;return Math.round(Math.min(f-24,Math.max(b+(f-b)*.75,petHudY()+154)));}catch(e){return 560;}} // short phones: just below the hint lines
petDoneRect=function(){return {x:302,y:petStripY()-19,w:76,h:38};};
// B. One set of pause bars in the top-left pill. The side games (Dance, Treat toss, Laser chase, Pet the cat) draw their own
//    coloured "paused" bars after the timer; on the wider pill (endless board, goal boards) they sat at the narrow pill's spot
//    while the pause button's white bars sat further right, so two sets showed. Now the coloured bars use the pause button's
//    spot and the white bars stay off while a side game shows its own. (Edits in build.)
function cp134BarX(hud){return hud.left+((typeof hudWide133==='function'&&hudWide133())?102:78);}
function cp134OwnBars(){return !!(WILD.dance||WILD.toss||WILD.petGame||(WILD.laser&&WILD.chase));}
// D. MODES is gone from Home (button and tap area); the Developer panel keeps its MODES section.
{const __d134=pgDock;pgDock=function(){const D=__d134.apply(this,arguments);try{if(D)D.modes=null;}catch(e){}return D;};}
// E. Home: swipe the big cat face left or right to switch cats (swipe left = next). Instant, no fade. The same cats as the
//    board's chip (all five). A plain tap on the face still gets the sweet face, hearts and a meow (now on the lift, so a
//    swipe doesn't meow first). PLAY then starts the endless board with that cat.
const CP134H={down:null,swipes:0};
function cp134SwipeCat(dir){const L=PG_CATS.slice(),cur=PGU.boardCat||PG.current||'tuxedo',i=Math.max(0,L.indexOf(cur)),cat=L[(i+dir+L.length)%L.length];
 PGU.boardCat=cat;if(PG.open[cat])PG.current=cat;try{pgSave();}catch(e){}CP134H.swipes++;try{pgSfx('tap');}catch(e){}try{diagEvent('cp134','home swipe '+cur+' -> '+cat);}catch(e){}}
{const __mt134=pgMainTap;pgMainTap=function(p){try{if(endHomeFree()){const R=pgMainRects();if(Math.hypot(p.x-R.head.x,(p.y-R.head.y)*1.2)<R.head.w*.45){CP134H.down={x:p.x,y:p.y,t:performance.now(),tap:__mt134};return;}}}catch(e){}return __mt134(p);};}
try{const up=e=>{const d=CP134H.down;if(!d)return;CP134H.down=null;if(e.type==='pointercancel')return;let p;try{p=toGame(e);}catch(_){return;}
  const dx=p.x-d.x,dy=p.y-d.y;if(PGU.screen!=='main')return;
  if(Math.abs(dx)>=36&&Math.abs(dx)>Math.abs(dy)*1.2)cp134SwipeCat(dx<0?1:-1);else d.tap({x:d.x,y:d.y});};
 document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);}catch(e){}
// a cat not opened yet plays the endless board too (as the chip allows); it stays unopened everywhere else
{const __es134=endStart;endStart=function(){const cat=PGU.boardCat;if(!PG||!cat||PG.open[cat])return __es134.apply(this,arguments);
 const was=PG.open[cat];PG.open[cat]=1;try{return __es134.apply(this,arguments);}finally{PG.open[cat]=was;try{pgSave();}catch(e){}}};}
// F. The board's name: no permanent banner. When a new board starts (the first board, or NEW BOARD), "New board: <name>" shows
//    for about 3 s in the row above the cat's head, then goes. (Edit in build: the row's name line calls cp134BoardName.)
const CP134N={pending:false,at:null,SECS:3};
{const __sb134=endSetBoard;endSetBoard=function(){const r=__sb134.apply(this,arguments);CP134N.pending=true;CP134N.at=null;return r;};}
function cp134BoardName(R){if(!CP134N.pending)return;if(WILD.phase!=='play'&&WILD.phase!=='count')return;const now=performance.now()/1000;
 if(CP134N.at==null)CP134N.at=now;const u=now-CP134N.at;if(u>CP134N.SECS){CP134N.pending=false;return;}
 ctx.save();ctx.globalAlpha=Math.min(1,u/.2,(CP134N.SECS-u)/.4);wildText('New board: '+endName(),200,R.ly,16,'#ffd23f','#2a0b3e',4);ctx.restore();}
// G. Goal boards are UAT only until their design pass. The switch is the channel: on when the build name says UAT (the same
//    test the UAT Developer default uses); the production build's name has no "UAT", so there the Home "Goal boards" button
//    and its list are gone. The endless rotation's open boards are unchanged.
const CP134_GOALS=/\bUAT\b/.test(BUILD);
{const __gb134=cp100GoalBtn;cp100GoalBtn=function(){return CP134_GOALS?__gb134.apply(this,arguments):null;};}
{const __co134=cp100Open;cp100Open=function(mode){if(!CP134_GOALS&&mode==='goals')mode='levels';return __co134.call(this,mode);};}
// J. Home: a tap on the cat sends hearts out from all around the face, every angle, floating outward and across (Jenny, Nov 20:
//    "coming out from every angle"). Same heart art; 8 hearts (was 5 off the top), about 1.6 s each (was 1.3). Edits in build:
//    the tap calls cp134Hearts, and the hearts loop moves a heart with a direction along it.
function cp134Hearts(R){const n=8,a0=Math.random()*Math.PI*2,rx=R.head.w*.42,ry=R.head.w*.36;
 for(let i=0;i<n;i++){const a=a0+i*Math.PI*2/n+rand(-.2,.2),sp=rand(70,95);
  PGA.hearts.push({x:R.head.x+Math.cos(a)*rx,y:R.head.y+Math.sin(a)*ry,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.85,ph:rand(0,6),L:1.6,t:-i*.03});}}
// ---- end UAT 134 items A, B, D, E, F, G, J ----
