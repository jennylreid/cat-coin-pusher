
// ---------- UAT 134 item I: Developer start-now buttons always start on the endless board with that game's or power's own cat
// (Jenny, Nov 20: Pet the cat -> Ragdoll, Treat toss -> Orange, Hug -> Ragdoll...; "from Home or any board, never a timed
// level"). Replaces UAT 133's power switch (next round #6), which left the board and built a new one for the new cat.
// - On the endless board: the same board stays (coins, wallet, layout, meter); the cat changes the way the cat chip changes it
//   (CP-97), at the moment the start fires: once the round is in play and nothing else is running.
// - From Home, a timed level or any other board: the endless board starts with that cat (as Home's PLAY does).
// - Side games: Treat toss -> Orange, Laser chase -> Siamese, Pet the cat -> Ragdoll, Mouse pounce -> Tortie. Powers: their own
//   cat. Start Dance break now: the cat in play (from Home: the current cat), on the endless board too.
// - As before (CP-102): no coin or power is taken from the player; a cat not yet open is opened for the test.
const CP134S={GAME_CAT:{toss:'orange',chase:'siamese',pet:'ragdoll',pounce:'tortie'},log:[],err:null};
function cp134Cat(kind,id){if(kind==='power')return PGP[id]?id:null;if(kind==='game')return CP134S.GAME_CAT[id]||null;
 const c=PGU.screen==='board'&&WILD.on?PGU.boardCat:PG.current;return c&&PG.open[c]?c:'tuxedo';}
function cp134OnEndless(){return typeof endActive==='function'&&endActive()&&PGU.screen==='board';}
cp102Start=function(kind,id){panel.style.display='none';if(!PG)pgInit();const cat=cp134Cat(kind,id);if(!cat)return;
 if(!PG.open[cat]){PG.open[cat]=1;if(PG.openOrder&&!PG.openOrder.includes(cat))PG.openOrder.push(cat);try{pgSave();}catch(e){}}
 const from=cp134OnEndless()?'endless':PGU.screen==='board'&&WILD.on?'board':'home';
 if(from!=='endless'){PGU.boardCat=cat;PG.current=cat;endStart();}
 if(!cp134OnEndless()&&!(END.on&&WILD.on)){CP134S.err='endless did not start';cp102Note('Endless board did not start');return;}
 if(kind==='dance'&&!wildFeature('dance')){cp102Note('No dance for this cat yet');return;}
 CP102.want={kind,id,cat,t:time};CP134S.log.push({kind,id,cat,from});
 try{diagEvent('cp102','start-now '+kind+' '+id+' cat='+cat+' from='+from);}catch(e){}};
// the cat switch on the endless board, right before the start fires (nothing else running, the round in play)
const __cp134Fire=cp102Fire;cp102Fire=function(){const W0=CP102.want;
 if(W0&&W0.cat&&cp134OnEndless()&&PGU.boardCat!==W0.cat&&WILD.phase==='play'&&board.status==='playing'&&!cp102Busy()){
  CP97.open=false;if(!cp97Switch(W0.cat)){CP134S.err='switch refused '+W0.cat;CP102.want=null;return;}}
 return __cp134Fire.apply(this,arguments);};
// ---------- end UAT 134 item I ----------
