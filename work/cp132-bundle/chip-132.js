// ---- UAT 132: cat chip (Jenny, Nov 20: "There should never be a lock on the board unless you're in gameplay.") ----
// f) The chip locks only while something is actively playing: a power (its action, title and held beat), a side game running
//    or starting (its coin was just collected; it starts within about a second), the Dance break (and its wheel), the Jackpot,
//    the sweep, the Quake, a paw swipe. It no longer locks because a side-game coin is on the board, falling in, or banked.
cp97Locked=function(){if(!cp97On())return true;
 if(typeof PGPX!=='undefined'&&PGPX)return true;if(typeof CP86T!=='undefined'&&CP86T)return true;
 if(typeof pgpSideGame==='function'&&pgpSideGame())return true;
 if(WILD.dance||WILD.dancePending||WILD.toss||WILD.tossPending||WILD.chase||WILD.chasePending||WILD.pounce||WILD.pouncePending||WILD.petGame||WILD.petPending)return true;
 if(WILD.jp||WILD.jpPending)return true;if(END.sweep||sweepTime>0||catquakeTime>0)return true;
 if(typeof PAW40_STATE==='object'&&PAW40_STATE&&PAW40_STATE.swipe)return true;return false;};
// e) Switching cats with a side-game coin on the board or falling in: it becomes the new cat's side-game coin at once, in the
//    same spot (the new cat's coin art; Tuxedo music note, Orange fish, Ragdoll heart, Siamese laser, Tortie mouse). So the
//    board only ever holds the current cat's coin. A banked laser (CP-88 slot) stays banked, as before.
const CP132_KIND={tuxedo:'note',orange:'fish',ragdoll:'heart',siamese:'laser',tortie:'mousecoin'},CP132={converted:0};
function cp132Convert(){const k=CP132_KIND[PGU.boardCat||'tuxedo'];if(!k)return;
 for(const b of [...bodies]){if(b.dead||!CP97_COINS.includes(b.kind)||b.kind===k)continue;
  const t=b.rb.translation(),q=b.rb.rotation();removeCoin(b);addCoin(k,null,t.x/M,t.y/M,t.z/M,q);CP132.converted++;}
 for(const o of WILD.incoming)if(CP97_COINS.includes(o.kind)&&o.kind!==k){o.kind=k;CP132.converted++;}}
{const __cp132Sw=cp97Switch;cp97Switch=function(cat){const r=__cp132Sw.apply(this,arguments);if(r!==false)try{cp132Convert();}catch(e){try{diagEvent('cp132','convert '+e);}catch(_){}}return r;};}
// ---- end UAT 132 cat chip ----
