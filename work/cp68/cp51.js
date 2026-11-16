// ---------- CP-51 (UAT 68, Jenny Nov 16): drop speed, no 45-coin limit, Pause ----------
// 1. Drop speed. Since CP-25 UAT 3 (Oct 28) holding and tapping both dropped a coin every 0.20 s (5 a second).
//    Holding now drops one every CP51.hold s, a slower steady stream. Tapping may go faster, up to one every CP51.tap s;
//    a tap that comes a little early isn't lost: it waits and drops as soon as the gap opens (one tap at a time; a
//    second early tap still gets "Easy taps"). The first coin of a press always drops at once.
var CP51={hold:.40,tap:.25,q:null,view:'menu',why:'',pausedAt:0,n:0};
var cp51Paused=false;
function cp51Queue(at){ // tryDrop's gap check: keep one early tap
 if(CP51.q||!WILD.on||WILD.phase!=='play')return false;CP51.q={x:at.x,y:at.y,t:time};return true;}
function cp51StepDrops(){ // called from step() in place of the old hold check
 if(CP51.q&&(time-CP51.q.t>.6||(WILD.on&&WILD.phase!=='play')))CP51.q=null;
 if(CP51.q&&time-lastDrop>=CP51.tap-1e-6){const q=CP51.q;CP51.q=null;tryDrop(q);return;}
 if(holding&&time-lastDrop>=CP51.hold-1e-6)tryDrop(holdPos);}
// 1b. The 45-coin limit is gone. What stays is the far-off safety net: at 120 coin pieces on the board (plain coins plus
//     gold 5s) drops slow to one a second and "Board full" shows, until coins fall off (CP-48's slow-down, from 120). Rain past 100 still lands as
//     gold 5s and merging stays at 130 (unchanged).
const CP51_BACKSTOP=120;
function cp51Pieces(){let n=0;for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))n++;return n;}

// 2. Pause. A pause button around the round timer (clock, time, two bars). Tapping it stops the timer, the physics, drops,
//    side games and the music, and shows the pop-up: RESUME, FINISH ROUND (end now; prizes and coins are kept, normal end
//    card), and Sound, How to play, Home. The game pauses by itself when the app goes to the background or the screen
//    turns off, and the pop-up is there on return.
function cp51CanPause(){return !!(world&&WILD.on&&WILD.phase==='play'&&board.status==='playing'&&!inventoryOpen&&panel.style.display!=='block'&&(typeof PGU==='undefined'||!PG||PG_HOME_OFF||PGU.screen==='board'));}
function cp51ShowButton(){return cp51Paused||cp51CanPause();}
function cp51Btn(hud){hud=hud||hudLayout();return {x:hud.left+5,y:hud.bannerY-15,w:91,h:30};}
function cp51Hit(){const r=cp51Btn();return {x:r.x-4,y:r.y-5,w:r.w+8,h:r.h+10};}
function cp51Pause(why){
 if(cp51Paused||!cp51CanPause())return false;
 cp51Paused=true;CP51.q=null;CP51.view='menu';CP51.why=why||'button';CP51.pausedAt=time;CP51.n++;
 stopDrops('pause');taps=[];try{diagEvent('pause',CP51.why);}catch(e){}return true;}
function cp51Resume(why){
 if(!cp51Paused)return;cp51Paused=false;CP51.view='menu';last=performance.now();acc=0;
 try{diagEvent('resume',why||'button');}catch(e){}}
function cp51Finish(){ // end the round now: normal end card, prizes and coins kept
 cp51Resume('finish');
 if(WILD.winHeld||WILD.got>=WILD_GOAL)wildFinish(true);else wildFinish(false,'finish');}
function cp51Home(){ // exactly what the round's top "Home" button does
 cp51Resume('home');const b=wildButton();__cp51Pointer({timeStamp:0,pointerId:-1,preventDefault(){}},{x:b.x+b.w/2,y:b.y+b.h/2});}
function cp51Rects(){const hud=hudLayout(),h=286,top=hud.headerBottom+8,bottom=hud.bottomY-8,y=Math.round(Math.max(top,(top+bottom)/2-h/2));
 return {card:{x:36,y,w:328,h},resume:{x:66,y:y+92,w:268,h:48},finish:{x:66,y:y+152,w:268,h:40},
  sound:{x:50,y:y+234,w:94,h:34},help:{x:153,y:y+234,w:94,h:34},home:{x:256,y:y+234,w:94,h:34}};}
function cp51Tap(){try{pgSfx('tap');}catch(e){}}
function cp51PopTap(p){
 if(CP51.view==='rules'){cp51Tap();CP51.view='menu';return;}
 const R=cp51Rects();
 if(contains(R.resume,p)){cp51Tap();cp51Resume('button');}
 else if(contains(R.finish,p)){cp51Tap();cp51Finish();}
 else if(contains(R.sound,p)){S.muted=!S.muted;saveAudioSettings();musicTick();cp51Tap();}
 else if(contains(R.help,p)){cp51Tap();CP51.view='rules';WILD.cardT=1;}
 else if(contains(R.home,p)){cp51Tap();cp51Home();}}
function cp51DrawPop(){
 ctx.fillStyle='rgba(12,6,24,.55)';ctx.fillRect(0,0,W,H);
 if(CP51.view==='rules'){ // the goal card that "? How to play" shows, with BACK in place of TAP TO START
  const wb=wildButtonDraw,ft=ctx.fillText;
  wildButtonDraw=function(r,label,...a){if(label==='TAP TO START')return wb(r,'BACK','#ffd23f','#3a1a00',30);return wb(r,label,...a);};
  ctx.fillText=function(t,...a){if(t==='The timer starts after 3, 2, 1, GO!')t='Paused. Tap anywhere to go back.';return ft.call(ctx,t,...a);};
  try{drawWild2Card();}finally{wildButtonDraw=wb;ctx.fillText=ft;}return;}
 const R=cp51Rects(),y=R.card.y;
 wildPanel(R.card,'#4b1f6e','#1d0f33');
 wildText('PAUSED',200,y+38,44,'#ffd23f','#3a1a00',8);
 ctx.fillStyle='#f0e0ff';ctx.font='bold 15px system-ui';ctx.fillText(wildClock()+' left · '+WILD.got+' of '+WILD_GOAL+' prizes',200,y+74,300);
 wildButtonDraw(R.resume,'RESUME','#ffd23f','#3a1a00',28);
 wildButtonDraw(R.finish,'FINISH ROUND','#ff9a4a','#3a1400',22);
 ctx.fillStyle='#f0e0ff';ctx.font='12px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Ends the round now. You keep your prizes and coins.',200,y+211,300);
 for(const [k,label] of [['sound',S.muted?'Sound: Off':'Sound: On'],['help','How to play'],['home','Home']]){const r=R[k];
  uiRound(r.x,r.y,r.w,r.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,r.x+r.w/2,r.y+r.h/2+1,r.w-8);}}
// the button: a soft pill behind the timer, and two bars after the time (the dance draws its own pink bars there)
const __cp51Hud=drawWildHud;
drawWildHud=function(hud){const on=cp51ShowButton();
 if(on){const r=cp51Btn(hud);ctx.save();uiRound(r.x,r.y,r.w,r.h,r.h/2,cp51Paused?'rgba(255,210,63,.28)':'rgba(255,255,255,.12)','rgba(255,255,255,.6)',1.3);ctx.restore();}
 __cp51Hud(hud);
 if(on&&!WILD.dance){ctx.save();ctx.fillStyle='#fff';const x=hud.left+78,y=hud.bannerY;ctx.fillRect(x,y-6,3.5,12);ctx.fillRect(x+6,y-6,3.5,12);ctx.restore();}};
const __cp51Draw=draw;
draw=function(){__cp51Draw();if(!cp51Paused)return;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 try{cp51DrawPop();}finally{ctx.restore();}};
const __cp51Pointer=wildPointer;
wildPointer=function(e,p){
 if(cp51Paused){cp51PopTap(p);return true;}
 if(cp51CanPause()&&contains(cp51Hit(),p)){cp51Tap();cp51Pause('button');return true;}
 return __cp51Pointer(e,p);};
// while paused: no physics, no game update; the side games' own pause bookkeeping still runs (wildTick sees cp51Paused)
const __cp51Step=step;step=function(){if(cp51Paused)return;return __cp51Step();};
const __cp51Update=update;update=function(dt){if(!cp51Paused)return __cp51Update(dt);try{wildTick(dt);bgmTick();}catch(e){}};
const __cp51Bgm=bgmWanted;bgmWanted=function(){if(cp51Paused)return false;return __cp51Bgm();};
// background / screen off: pause (and show the pop-up on return)
const __cp51AppPaused=window.appPaused;
window.appPaused=function(p){if(p)cp51Pause('background');return __cp51AppPaused?__cp51AppPaused(p):undefined;};
function cp51Hidden(){if(document.hidden)cp51Pause('background');}
document.addEventListener('visibilitychange',cp51Hidden);
// 3. Add-ons (Jenny, Nov 16, after passing UAT 67).
// 3a. Level 1 is the intro: only gold coins plus the cheese and shrimp on the board (no Quake coin, no Rain 5 or Rain 10),
//     and its bonus drops are plain gold coins. A goal prize that fell off a side still comes back by bonus drop.
PGL_LEVELS[0].rain=[];PGL_LEVELS[0].quake=null;
const __cp51Bonus=wildScheduleBonus;
wildScheduleBonus=function(){const lv1=cp50Lv1(),n=WILD.incoming.length,miss=lv1?wildMissing():[];const r=__cp51Bonus();
 if(lv1){const o=WILD.incoming[n];if(o&&!(o.kind==='item'&&miss.includes(o.id))){o.kind='coin';o.id=null;}}return r;};
// 3b. The prize bell (the struck bell as a prize drops over the ledge) at half its volume. Nothing else in the pickup changes.
var CP51_BELL=.5;
