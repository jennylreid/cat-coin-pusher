// ---- UAT 132: Collections coin rewards go into the wallet (Jenny, Nov 20: "Put it in the board coins.") ----
// Completing a collection (Water: Tuna + Shrimp, 100; Kitchen: Cheese, 50) pays into the endless board's wallet. On the endless
// board the round's coins already are the wallet; from Home they were paid into the old round purse, which the wallet never saw.
// The satchel's coin line shows the wallet.
{const __cw132=placeItem;placeItem=function(id){const before={...collectionPaid},on=typeof endActive==='function'&&endActive();const r=__cw132.apply(this,arguments);
  try{if(!on&&typeof endLoad==='function')for(const k in COLLECTIONS)if(collectionPaid[k]&&!before[k]){const amt=COLLECTIONS[k].reward;S.coins-=amt;board.remaining=S.coins;
    const w=endLoad();w.coins=(w.coins|0)+amt;endSave();try{diagEvent('cp132','collection '+k+' +'+amt+' to wallet '+w.coins);}catch(e){}}}catch(e){}return r;};}
collectionPurseDisplay=function(){const base=(typeof endActive==='function'&&!endActive()&&typeof cp100Coins==='function')?cp100Coins():S.coins;
  const p=collectionPayoff;if(!p)return base;const k=Math.min(1,Math.max(0,(p.t-.2)/1.85));return base-p.reward+Math.floor(p.reward*k);};
// ---- end UAT 132 Collections wallet ----
