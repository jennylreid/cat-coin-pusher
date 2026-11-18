// ---------- CP-64 add-on (UAT 89, Jenny Nov 17): Jackpot prizes don't fill the Dance meter ----------
// "You win so many prizes that you end up having some sort of side game right afterward." Every piece a Jackpot drops is
// tagged when it lands (b.jp); collecting a tagged prize, during the Jackpot or after it ends, adds nothing to the Happy
// Cat (Dance) meter, so no Dance break starts because of it. Every other prize fills the meter as before, and a meter
// that was already full before the Jackpot behaves as before (held, then its Dance break). Pickup itself is unchanged.
const __cp64mLand=wildLandBonus;
wildLandBonus=function(o){if(!o||!o.jp)return __cp64mLand(o);const ac=addCoin;
 addCoin=function(){const b=ac.apply(this,arguments);if(b)b.jp=true;return b;};
 try{return __cp64mLand(o);}finally{addCoin=ac;}};
const __cp64mPrize=wildPrizeCollected;
wildPrizeCollected=function(b,x){if(!b||!b.jp)return __cp64mPrize(b,x);const df=danceFill;danceFill=function(){};
 try{return __cp64mPrize(b,x);}finally{danceFill=df;}};
