// ---------- CP-97 Switch cats on the endless board (Jenny, Nov 18: "the board and the cat choice are two totally different
// things."; Nov 19: "that chip... It currently says orange, but if I open it, it could have little faces of each cat." "The chip
// has to be locked strategically for sure. And I do want to use the approved faces.") ----------
// Endless board only (UAT). Tap the cat's name chip (under the chin, right): a row of the cats' approved faces opens just
// below it (the cats you have; the one playing is ringed). Tap a face: that cat takes over at once on the same board (no
// fades, no rebuild): its art, side game, power and power button, and its side-game coin rule. The board, coins, wallet, reset
// meter and banked laser coin stay as they are. Tap anywhere else to close the row (that tap doesn't drop a coin).
// Locked (a tap gives the lock sound and a little shake; the chip shows a padlock and dims) while: a power runs (its title,
// action and held beat), a side game runs or is about to start, the Dance break or its wheel, the Jackpot, a side-game coin
// (music note, fish, laser, heart, mouse) is on the board or falling in, the NEW BOARD sweep, a Quake, or the countdown.
// What a switch resets: the side games' own per-board counters (each cat starts its side game fresh on this board, as on a
// new board; the Dance meter starts from 0). Timed levels: the chip is just a tag, as today.
const CP97={open:false,t:0,shake:-9,FACE:46,GAP:8,stats:{switches:0,refused:0}};
const CP97_COINS=['note','fish','laser','heart','mousecoin'];
function cp97On(){return typeof endActive==='function'&&endActive()&&(WILD.phase==='play')&&PGU.screen==='board';}
function cp97Cats(){return PG_CATS.filter(c=>PG.open[c]);}
function cp97ChinY(){return typeof w43ChinY==='function'?w43ChinY():300;}
function cp97Chip(){const cat=PGU.boardCat||'tuxedo',C=PG_CAT[cat],t=C.short||C.name,w=Math.max(54,t.length*8.4+22)*.8,h=22*.8,x=W-46,y=cp97ChinY()-14;return {x:x-w/2,y:y-h/2,w,h,cx:x,cy:y};}
function cp97Locked(){if(!cp97On())return true;
 if(typeof PGPX!=='undefined'&&PGPX)return true;if(typeof CP86T!=='undefined'&&CP86T)return true;
 if(typeof pgpSideGame==='function'&&pgpSideGame())return true;
 if(WILD.dance||WILD.dancePending||WILD.toss||WILD.tossPending||WILD.chase||WILD.chasePending||WILD.pounce||WILD.pouncePending||WILD.petGame||WILD.petPending)return true;
 if(WILD.jp||WILD.jpPending)return true;if(END.sweep||sweepTime>0||catquakeTime>0)return true;
 if(bodies.some(b=>!b.dead&&CP97_COINS.includes(b.kind))||WILD.incoming.some(o=>CP97_COINS.includes(o.kind)))return true;
 if(typeof PAW40_STATE==='object'&&PAW40_STATE&&PAW40_STATE.swipe)return true;return false;}
function cp97Row(){const cats=cp97Cats(),n=cats.length,F=CP97.FACE,G=CP97.GAP,w=n*F+(n-1)*G+16,ch=cp97Chip();let x=Math.min(W-6-w,ch.cx-w/2);x=Math.max(6,x);
 const y=ch.y+ch.h+8;return {x,y,w,h:F+12,faces:cats.map((c,i)=>({cat:c,x:x+8+i*(F+G),y:y+6,w:F,h:F}))};}
// the switch itself: the same board, the new cat's mode and art (the game's own flags all follow WILD.mode)
// Each cat's own per-board counters (its side-game coin schedule, the Dance meter) are kept when you switch away and come
// back on the same board, so switching can't bring a cat's coin again early; a cat new to this board starts fresh, counted
// from the board's bonus drops so far (its first coin comes on the usual schedule). A new board clears them.
const CP97_KEYS=['happy','happyT','noteN','noteAt','dances','danceCoins','danceRainCoins','fishN','fishAt','tosses','tossCaught','laserN','laserAt','chases','chaseKnocked','heartAt','hearts','mouseN','mouseAt','pounces'];
CP97.mem={};
{const __cp97Reset=wildReset;wildReset=function(){CP97.mem={};CP97.open=false;return __cp97Reset.apply(this,arguments);};}
function cp97Switch(cat){const old=PGU.boardCat||'tuxedo';if(cat===old||!PG.open[cat])return false;
 const snap={};for(const k of CP97_KEYS)if(k in WILD)snap[k]=WILD[k];CP97.mem[old]=snap;
 try{danceClear(true);}catch(e){}try{tossClear();}catch(e){}try{laserClear();}catch(e){}try{petClear();}catch(e){}try{pounceClear();}catch(e){}
 PGU.boardCat=cat;PG.current=cat;try{pgSave();}catch(e){}
 WILD.mode=PG_CAT[cat].mode&&WILD_MODES[PG_CAT[cat].mode]?PG_CAT[cat].mode:null;
 try{pgApplyArt(cat);}catch(e){}
 const back=CP97.mem[cat];
 if(back)Object.assign(WILD,back);
 else{try{laserTweaks();}catch(e){}try{petModeFlags();}catch(e){}const n=WILD.bonusN|0; // fresh on this board: schedules count from now
  if(typeof WILD.noteAt==='number'&&WILD.noteAt<900)WILD.noteAt+=n;if(typeof WILD.heartAt==='number')WILD.heartAt+=n;}
 if(typeof endBankIn==='function')endBankIn(); // the banked laser stays with the wallet whichever cat plays
 CP97.stats.switches++;try{diagEvent('cp97','switch '+old+' -> '+cat);}catch(e){}return true;}
{const __cp97Tap=powerTap;powerTap=function(p){
 if(cp97On()&&CP97.open){const R=cp97Row();for(const f of R.faces)if(contains(f,p)){stopDrops();CP97.open=false;
     if(cp97Locked()){CP97.stats.refused++;CP97.shake=time;try{pgSfx('lock');}catch(e){}return true;}
     if(cp97Switch(f.cat))try{pgSfx('tap');}catch(e){}return true;}
   CP97.open=false;stopDrops();return true;} // a tap anywhere else just closes the row
 if(cp97On()){const c=cp97Chip();if(contains({x:c.x-8,y:c.y-10,w:c.w+16,h:c.h+18},p)){stopDrops();
   if(cp97Locked()){CP97.stats.refused++;CP97.shake=time;try{pgSfx('lock');}catch(e){}}else{CP97.open=true;CP97.t=0;try{pgSfx('tap');}catch(e){}}return true;}}
 else CP97.open=false;
 return __cp97Tap.apply(this,arguments);};}
// the row closes by itself when something locks the chip
{const __cp97Upd=update;update=function(dt){__cp97Upd(dt);try{if(CP97.open){CP97.t+=dt;if(!cp97On()||cp97Locked())CP97.open=false;}}catch(e){}};}
// drawing: the chip shakes on a refused tap and shows a padlock while locked; the face row below it
{const __cp97Tag=pgTag;pgTag=function(cat,x,y,s){if(!cp97On()||x!==W-46)return __cp97Tag.apply(this,arguments);
 const lock=cp97Locked(),u=time-CP97.shake,sh=u>=0&&u<.35?Math.sin(u*60)*3*(1-u/.35):0;ctx.save();if(lock)ctx.globalAlpha=.6;
 const r=__cp97Tag.call(this,cat,x+sh,y,s);ctx.restore();
 const c=cp97Chip();if(lock)try{pgLock(c.x+c.w+2+sh,c.cy+1,.55);}catch(e){}
 else{ctx.save();ctx.fillStyle='#ffe08a';ctx.beginPath();const ax=c.x+c.w+5+sh,ay=c.cy;ctx.moveTo(ax-4,ay-2);ctx.lineTo(ax+4,ay-2);ctx.lineTo(ax,ay+3);ctx.closePath();ctx.fill();ctx.restore();}
 if(CP97.open&&!lock)cp97DrawRow();return r;};}
function cp97DrawRow(){const R=cp97Row(),cur=PGU.boardCat||'tuxedo';ctx.save();
 uiRound(R.x,R.y,R.w,R.h,14,'rgba(26,12,40,.92)','#ffe08a',1.5);
 for(const f of R.faces){const on=f.cat===cur;if(on)uiCircle(f.x+f.w/2,f.y+f.h/2,f.w/2+1,'rgba(255,224,138,.25)','#ffd23f',2.5);
  pgHead(f.cat,f.x+f.w/2,f.y+f.h*.56,f.w*.98,'calm');}
 ctx.restore();}
// ---------- end CP-97 ----------
