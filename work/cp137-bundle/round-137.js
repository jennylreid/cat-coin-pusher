// ---- UAT 137 (Jenny, Nov 20: "I'm pretty excited to see the art in play. Can we do that now?"; tickets/ROUND-137.md) ----
// A. New prizes in play (CP-105 art, as approved; nothing redrawn). 18 prizes (the 17, and the Star) drop on the endless board alongside the existing
//    ones, behind the Developer switch "New prizes" (on by default on a UAT build, off on a production-named build until
//    approved). They use the existing prize drop-in and the frozen pickup unchanged: a bonus prize landing on the endless board
//    is one of the new prizes half the time, and each new board drops in two new prizes once, 2 s into play.
//    - Landing views: balloon animal, diamond, sapphire ring, hot dog, crab and owl each have six views (front, side, back,
//      tilts, top-down). A prize starts in a random view and swaps view every ~0.12 s while it tumbles (falling or spinning),
//      so it settles in whichever view it was in: they land different ways. The pickup's flight shows the front view.
//    - The diamond twinkles: its view's 42-frame loop (24 fps, 1.75 s), each diamond at its own phase.
//    - Rainbow at the same board size as the cheese (the same prize box; the art's own proportions).
//    - Collected new prizes go to the bag (pgAddItem) like other prizes and sell for 1 Catnip in the Shop. No Collections pages,
//      Album page or recipes yet.
const CP137_IDS=['cstar','rainbow','balloon_animal','hot_dog','daisy','hot_water_bottle','owl','accordion','diamond','sapphire_ring','crab','seahorse','oyster','sunflower','cornflower','rose','hydrangea','tulip'];
const CP137_NAMES={cstar:'Star',rainbow:'Rainbow',balloon_animal:'Balloon animal',hot_dog:'Hot dog',daisy:'Daisy',hot_water_bottle:'Hot water bottle',owl:'Owl',accordion:'Accordion',diamond:'Diamond',sapphire_ring:'Sapphire ring',crab:'Crab',seahorse:'Seahorse',oyster:'Oyster',sunflower:'Sunflower',cornflower:'Cornflower',rose:'Rose',hydrangea:'Hydrangea',tulip:'Tulip'};
const CP137_VIEWED=['balloon_animal','diamond','sapphire_ring','hot_dog','crab','owl'],CP137_VIEWS=['front','side','back','tilt-left','tilt-right','top-down'];
const CP137={KEY:'catpusher.uat.cp137newprizes.v1',art:{},views:{},tw:{},scratch:null,boardDrops:false,n:0};
function cp137Img(f){const im=new Image();im.src='img/art/cp137/'+f;return im;}
for(const id of CP137_IDS){CP137.art[id]=cp137Img(id+'.png');WILD_ART[id]=CP137.art[id];if(!WILD_PRIZES.includes(id))WILD_PRIZES.push(id);PRIZE_OPAQUE[id]=.86;PRIZE_ASPECT[id]=1;WILD_PRIZE_NAMES[id]=CP137_NAMES[id];PG_NAMES[id]=CP137_NAMES[id];}
for(const id of CP137_VIEWED)CP137.views[id]=CP137_VIEWS.map(v=>cp137Img(id+'-'+v+'.png'));
CP137.tw=CP137_VIEWS.map(v=>cp137Img('diamond-'+v+'-twinkle.png'));
CP137.star=cp137Img('cstar-twinkle.png');
// The Star (Jenny: "the star is ready"): a white-blue point of light that twinkles and shimmers in place (32 frames, 24 fps,
// 1.33 s), shown at about 0.85 of a coin across (glow and rays included; Jenny: 3/4 to a full coin, as long as it isn't
// blurry). Clearly not the gold five-point star marker. Same prize box and physics as the other prizes.
const CP137_STAR_K=1.7;
function cp137On(){try{const v=localStorage.getItem(CP137.KEY);if(v==='1')return true;if(v==='0')return false;}catch(e){}return typeof CP134_GOALS!=='undefined'?CP134_GOALS:/\bUAT\b/.test(BUILD);}
function cp137Set(on){try{localStorage.setItem(CP137.KEY,on?'1':'0');}catch(e){}}
function cp137Endless(){return typeof endActive==='function'&&endActive();}
function cp137Pick(){return CP137_IDS[Math.random()*CP137_IDS.length|0];}
// the drop-in: half the bonus prizes landing on the endless board are new prizes
{const __l137=wildLandBonus;wildLandBonus=function(o){try{if(o&&o.kind==='item'&&!o.cp137&&cp137On()&&cp137Endless()&&Math.random()<.5){o.id=cp137Pick();o.cp137=1;}}catch(e){}return __l137.apply(this,arguments);};}
// two new prizes once per board, 2 s into play
{const __r137=wildReset;wildReset=function(){CP137.boardDrops=false;return __r137.apply(this,arguments);};}
{const __u137=update;update=function(dt){const r=__u137(dt);try{if(!CP137.boardDrops&&cp137On()&&cp137Endless()&&WILD.phase==='play'&&board.status==='playing'&&!END.sweep&&(WILD.goT||0)>=2){CP137.boardDrops=true;
 for(let i=0;i<2;i++){const y=rand(430,600),x=200+rand(-1,1)*(tableHalfAt(y)-50);WILD.incoming.push({kind:'item',id:cp137Pick(),x,y,t:.9+i*.5,t0:.9+i*.5,cp137:1});}try{sfx.wild('whistle',1);}catch(e){}CP137.n+=2;}}catch(e){}return r;};}
// landing views and the diamond's twinkle: the body's current view is lent to the prize renderer for this draw only
function cp137Scratch(){if(!CP137.scratch){const c=document.createElement('canvas');c.width=c.height=128;CP137.scratch=c;}return CP137.scratch;}
const CP137_FRONT={v:0,t:0,ph:0};
function cp137ViewOf(b){if(!b.rb)return CP137_FRONT; // the pickup's flight shows the front view (its objects are pooled, so nothing is stored on them)
 let s=b.cp137;if(!s){s=b.cp137={v:Math.random()*6|0,t:time,ph:Math.random()*1.75};}
 try{const w=b.rb.angvel(),spin=Math.hypot(w.x,w.y,w.z),h=b.rb.translation().y/M,v=b.rb.linvel();const moving=spin>2.5||Math.abs(v.y)/M>40||h>b.half*2.2;
  if(moving&&time-s.t>.12){let n=Math.random()*5|0;if(n>=s.v)n++;s.v=n;s.t=time;}}catch(e){}return s;}
{const __d137=cp62DrawPrize;cp62DrawPrize=function(kind,id,x,y,s,owner){
 if(kind==='item'&&id==='cstar'){const at=CP137.star,old=WILD_ART.cstar;if(at&&at.complete&&at.naturalWidth){const ph=owner&&owner.rb?((owner.cp137s=owner.cp137s||{ph:Math.random()*1.33}).ph):0,f=Math.floor(((time+ph)%1.333)*24)%32,c=cp137Scratch(),g=c.getContext('2d');g.clearRect(0,0,128,128);g.drawImage(at,(f%8)*128,(f/8|0)*128,128,128,0,0,128,128);WILD_ART.cstar=c;}
  try{return __d137.call(this,kind,id,x,y+radius('item')*s*2.8*(CP137_STAR_K-1)*.2,s*CP137_STAR_K,owner);}finally{WILD_ART.cstar=old;}}
 if(kind!=='item'||!owner||!CP137.views[id])return __d137.apply(this,arguments);
 const st=cp137ViewOf(owner),old=WILD_ART[id];let art=CP137.views[id][st.v];
 if(id==='diamond'){const at=CP137.tw[st.v];if(at&&at.complete&&at.naturalWidth){const f=Math.floor(((time+st.ph)%1.75)*24)%42,c=cp137Scratch(),g=c.getContext('2d');g.clearRect(0,0,128,128);g.drawImage(at,(f%7)*128,(f/7|0)*128,128,128,0,0,128,128);art=c;}}
 if(!(art&&(art.getContext||(art.complete&&art.naturalWidth))))return __d137.apply(this,arguments);
 WILD_ART[id]=art;try{return __d137.apply(this,arguments);}finally{WILD_ART[id]=old;}};}
// the Shop can sell them (1 Catnip, as for any prize that isn't a cat's own); edit in build: the sell list adds cp137SellIds()
function cp137SellIds(){return CP137_IDS;}
// Developer: Settings > Engineer tools > "New prizes" on/off (saved on this phone)
{const __oc137=openCredits;openCredits=function(){const r=__oc137.apply(this,arguments);try{
  const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp137-new'))return r;
  const box=document.createElement('div');box.id='cp137-new';const hd=document.createElement('h3');hd.textContent='New prizes';box.appendChild(hd);
  const b=document.createElement('button');b.className='wide';const lab=()=>{b.textContent='New prizes on the endless board: '+(cp137On()?'On':'Off');};lab();
  b.onclick=()=>{cp137Set(!cp137On());lab();try{diagEvent('cp137','new prizes '+(cp137On()?'on':'off'));}catch(e){}};box.appendChild(b);eng.appendChild(box);}catch(e){}return r;};}
// B. Mouse pounce: at most 3 mice running at once (later mice wait their turn), and its meter sits at the very top of the board,
//    just under the pusher, so the mice have the whole board below it. Mouse count and timing otherwise unchanged.
const CP137_MICE_MAX=3;
function cp137PounceY(){try{return Math.round(skyScreen(200,PUSH_MAX+34,0).y);}catch(e){return POUNCE_HUD_Y;}}
{const __pl137=pounceLaunch;pounceLaunch=function(D,i){const r=__pl137.apply(this,arguments);try{const m=D.mice[D.mice.length-1],top=cp137PounceY()+44,bot=skyScreen(200,T.FRONT,0).y-22;if(m&&bot>top)m.y=rand(top,bot);}catch(e){}return r;};}
{const __pt137=pounceTick;pounceTick=function(dt,paused){const D=WILD.pounce;let hold=null;
 try{if(D&&D.phase==='play'&&!paused){const run=D.mice.filter(m=>m.state==='run').length;if(run>=CP137_MICE_MAX&&D.next<D.n&&D.t+dt>=D.times[D.next]){hold=D.next;for(let k=D.next;k<D.n;k++)D.times[k]+=dt;}}}catch(e){}
 return __pt137.apply(this,arguments);};}
// C. Board top bar: one button, Settings (Jenny: "There should probably only be one button there, and it should probably be
//    settings"): a clear cogwheel drawn like Home's (the same gear icon, no ring) in the top-right corner. The Developer
//    check-for-updates shortcut is gone (Settings has "Check for updates") and so is the sound icon (Settings has "Sound
//    effects: on/off"). (Edits in build.)
pgPlayGear=function(){const h=hudLayout();return {x:W-h.right-46,y:h.mainY-17,w:42,h:34};}; // the top-right corner, where the sound icon was
pgDrawPlayGear=function(){const g=pgPlayGear();pgGearIcon(g.x+g.w/2,g.y+g.h/2,10);};
function cp137OneButton(){return !!(typeof PG!=='undefined'&&PG&&!PG_HOME_OFF&&WILD.on);} // on a board: the sound icon goes too (Settings has "Sound effects: on/off")
// D. The cat chip works on Goal boards too (Jenny: "I need to be able to switch cats on the goal boards"), with the same lock
//    rule as the endless board (locked only while something is actively playing) and the same five cats.
function cp137GoalBoard(){try{return !!(typeof LAB==='object'&&LAB.on&&LAB.on()&&WILD.on);}catch(e){return false;}}
cp97On=function(){return ((typeof endActive==='function'&&endActive())||cp137GoalBoard())&&WILD.phase==='play'&&PGU.screen==='board';};
{const __c137=cp97Cats;cp97Cats=function(){return cp137GoalBoard()?PG_CATS.slice():__c137.apply(this,arguments);};}
{const __s137=cp97Switch;cp97Switch=function(cat){if(!cp137GoalBoard()||!PG||PG.open[cat])return __s137.apply(this,arguments);
 const was=PG.open[cat];PG.open[cat]=true;try{return __s137.apply(this,arguments);}finally{PG.open[cat]=was;try{pgSave();}catch(e){}}};}
// ---- end UAT 137 ----
