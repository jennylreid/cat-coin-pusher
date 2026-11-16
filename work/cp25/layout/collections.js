// CP-25: these two collections are permanent first completions, not repeatable sets.
const COLLECTIONS={water:{name:'Water',items:['tuna','shrimp'],future:['sardine','crab'],reward:100},cheese:{name:'Cheese',items:['cheese'],future:['mouse'],reward:50}};
const placements={cheese:false,shrimp:false,tuna:false},collectionPaid={water:false,cheese:false};
let loopScreen='inventory',selectedTreat=null,collectionMessage='',collectionStars=0,celebratingCollection=null;
const PRIZE_NAMES={tuna:'Tuna',shrimp:'Shrimp',cheese:'Cheese',sardine:'Sardine',crab:'Crab',mouse:'Toy mouse'};
function stopDrops(){holding=false;streamPointer=null;}
function openLoopScreen(view){stopDrops();cancelCollectionDrag();inventoryOpen=true;loopScreen=COLLECTIONS[view]?view:'water';selectedTreat=null;collectionMessage='';save();}
function emptyPurse(){if(!S.dev)return false;stopDrops();S.coins=0;S.lastRegen=Date.now();board.remaining=0;save();return true;}
function placeItem(id){
 const key=id==='cheese'?'cheese':'water',set=COLLECTIONS[key];
 if(!set.items.includes(id)||placements[id]||!(S.got[id]>0))return false;
 regen();S.got[id]--;placements[id]=true;selectedTreat=null;
 collectionMessage=PRIZE_NAMES[id]+' placed';
 if(!collectionPaid[key]&&set.items.every(x=>placements[x])){
  collectionPaid[key]=true;S.coins+=set.reward;board.remaining=S.coins;
  collectionMessage=set.name+' complete! +'+set.reward+' coins';collectionStars=3;celebratingCollection=key;
  sweetUntil=time+3;sfx.fanfare();
 }
 save();return true;
}
