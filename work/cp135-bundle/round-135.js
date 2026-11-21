// ---- UAT 135 (Jenny, Nov 20, after testing production 2026.11.20; tickets/ROUND-135.md) ----
// 1. Keep prizes coming on the endless board: when fewer than 3 prizes are on the board (counting those already falling in),
//    one more drops in with the existing bonus-prize drop-in (marker, whistle, "BONUS PRIZE!"), at most one every 6 s, so a board
//    never runs dry. It lands in the back half (depth 420-560), so it takes some pushing. Which prize: one of this board's own
//    prizes not on the board yet (else any of them). It doesn't count as a bonus drop (side-game coin schedules unchanged).
//    The pickup itself (look, sizes, timing, sounds, multi-drop) is untouched.
const CP135P={MIN:3,GAP:6,WARM:3,last:-99,n:0};
function cp135PrizeTick(){try{
 if(!(typeof endActive==='function'&&endActive())||WILD.phase!=='play'||board.status!=='playing'||END.sweep||(typeof cp51Paused!=='undefined'&&cp51Paused)||inventoryOpen)return;
 if((WILD.goT||0)<CP135P.WARM||time-CP135P.last<CP135P.GAP)return;
 const on=bodies.filter(b=>!b.dead&&b.kind==='item'),inc=WILD.incoming.filter(o=>o.kind==='item').length+SKY.filter(o=>o.kind==='item').length;
 if(on.length+inc>=CP135P.MIN)return;
 const pool=(WILD_COLLECTION&&WILD_COLLECTION.length?WILD_COLLECTION:['cheese','shrimp']),have=new Set(on.map(b=>b.id)),fresh=pool.filter(id=>!have.has(id));
 const id=(fresh.length?fresh:pool)[Math.random()*(fresh.length?fresh:pool).length|0],y=rand(420,560),x=200+rand(-1,1)*(tableHalfAt(y)-50);
 WILD.incoming.push({kind:'item',id,x,y,t:.9,t0:.9});sfx.wild('whistle',1);CP135P.last=time;CP135P.n++;try{diagEvent('cp135','prize refill '+id+' on='+on.length+' inc='+inc);}catch(e){}
}catch(e){}}
{const __u135=update;update=function(dt){const r=__u135(dt);cp135PrizeTick();return r;};}
{const __r135=wildReset;wildReset=function(){CP135P.last=-99;return __r135.apply(this,arguments);};}
// 2. Never the same board twice in a row. Every start of the endless board from Home builds the board afresh, so PLAY now starts
//    the next board in the rotation (as NEW BOARD does), never the one just played. A new player's first board is still the
//    gentle First push. NEW BOARD never repeats the current board (it already didn't; now guaranteed even with one board left).
//    A board picked from the Level boards list (UAT) plays that board.
const CP135R={pick:false};
{const __pn135=endPickNext;endPickNext=function(){const w=endLoad(),k=__pn135.apply(this,arguments);if(k!==w.cur)return k;
 const o=endOrder().filter(x=>x!==w.cur);return o.length?o[Math.random()*o.length|0]:k;};}
{const __cp135Play=cp100Play;cp100Play=function(){CP135R.pick=true;try{return __cp135Play.apply(this,arguments);}finally{CP135R.pick=false;}};}
{const __es135=endStart;endStart=function(){try{const w=endLoad();if(w.cur&&!CP135R.pick&&!END.on)endSetBoard(endPickNext());}catch(e){}return __es135.apply(this,arguments);};}
// 3. Level boards are UAT only (like Goal boards): on a production-named build (no "UAT" in the build name) Home has no
//    "Level boards" button and the boards list never opens. (CP134_GOALS is the same channel test.)
{const __eb135=endBtn;endBtn=function(){return CP134_GOALS?__eb135.apply(this,arguments):null;};}
{const __co135=cp100Open;cp100Open=function(){if(!CP134_GOALS)return;return __co135.apply(this,arguments);};}
// 4. The board's own Home button is gone (the pause menu's Home takes you there). It isn't drawn on a board and a tap where it
//    was does nothing; the pause menu's Home still uses it underneath. Leaves the top bar to the timer pill, the powers, the
//    gear, sound and the side game's meter. (Goal boards' and levels' end cards keep their own Home.)
function cp135HomeGone(){return !!(typeof PG!=='undefined'&&PG&&!PG_HOME_OFF&&WILD.on&&WILD.phase!=='end');}
{const __dw135=drawWildButton;drawWildButton=function(){if(cp135HomeGone())return;return __dw135.apply(this,arguments);};}
{const __wp135=wildPointer;wildPointer=function(e,p){if(cp135HomeGone()&&contains(wildButton(),p))return true;return __wp135.apply(this,arguments);};}
// ---- end UAT 135 ----
