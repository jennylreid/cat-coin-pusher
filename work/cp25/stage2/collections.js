// CP-25: these two collections are permanent first completions, not repeatable sets.
const COLLECTIONS={water:{name:'Water',items:['tuna','shrimp'],future:['sardine','crab'],reward:100},cheese:{name:'Cheese',items:['cheese'],future:['mouse'],reward:50}};
const placements={cheese:false,shrimp:false,tuna:false},collectionPaid={water:false,cheese:false};
let loopScreen='inventory',selectedTreat=null,collectionMessage='',collectionStars=0,celebratingCollection=null;
const PRIZE_NAMES={tuna:'Tuna',shrimp:'Shrimp',cheese:'Cheese',sardine:'Sardine',crab:'Crab',mouse:'Toy mouse'};
function stopDrops(){holding=false;streamPointer=null;}
function openLoopScreen(view){stopDrops();inventoryOpen=true;loopScreen=view;selectedTreat=null;collectionMessage='';save();}
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
function screenLayout(){const h=hudLayout();return {top:h.top+28,left:Math.max(20,h.left+12),right:Math.min(380,W-h.right-12)};}
function screenTap(p){
 const {top,left,right}=screenLayout();
 if(p.x>right-70&&p.y>=top-16&&p.y<=top+30){inventoryOpen=false;selectedTreat=null;stopDrops();save();return;}
 if(p.y>=top+42&&p.y<=top+84){const i=Math.floor((p.x-left)/((right-left)/3));if(i>=0&&i<3){loopScreen=['inventory','water','cheese'][i];selectedTreat=null;collectionMessage='';}return;}
 if(loopScreen==='inventory'){
  const i=Math.floor((p.y-top-108)/122),id=['cheese','shrimp','tuna'][i];
  if(id&&p.x>=left&&p.x<=right&&p.y<=top+108+i*122+108&&S.got[id]>0&&!placements[id]){selectedTreat=id;loopScreen=id==='cheese'?'cheese':'water';collectionMessage='Tap the matching silhouette to place '+PRIZE_NAMES[id]+'.';}
  return;
 }
 const set=COLLECTIONS[loopScreen],ids=[...set.items,...set.future],cell=(right-left-12)/2;
 for(let i=0;i<ids.length;i++){
  const x=left+i%2*(cell+12),y=top+118+Math.floor(i/2)*136;
  if(p.x>=x&&p.x<=x+cell&&p.y>=y&&p.y<=y+124){if(selectedTreat===ids[i])placeItem(ids[i]);else collectionMessage=set.future.includes(ids[i])?'Future prize · not obtainable yet':placements[ids[i]]?'Already placed':S.got[ids[i]]?'Select it from your inventory below.':'Win this treat off the front first.';return;}
 }
 const tray=top+426;
 if(p.y>=tray+28&&p.y<=tray+122){const i=Math.floor((p.x-left)/((right-left)/set.items.length)),id=set.items[i];if(id&&S.got[id]>0&&!placements[id]){selectedTreat=id;collectionMessage='Tap the matching silhouette to place '+PRIZE_NAMES[id]+'.';}}
}
function outlinePrize(id,x,y){
 ctx.save();ctx.translate(x,y);ctx.strokeStyle='#ab9cbe';ctx.lineWidth=2.5;ctx.beginPath();
 if(id==='sardine'){ctx.ellipse(0,0,34,14,0,0,Math.PI*2);ctx.moveTo(-30,0);ctx.lineTo(-48,-17);ctx.lineTo(-48,17);ctx.closePath();}
 else if(id==='crab'){ctx.ellipse(0,5,27,18,0,0,Math.PI*2);for(const s of [-1,1]){for(let j=0;j<3;j++){ctx.moveTo(s*22,j*9-3);ctx.lineTo(s*39,j*13-7);}ctx.moveTo(s*18,-4);ctx.lineTo(s*32,-26);ctx.lineTo(s*23,-34);ctx.moveTo(s*32,-26);ctx.lineTo(s*43,-35);}}
 else if(id==='mouse'){ctx.ellipse(0,5,30,18,0,0,Math.PI*2);ctx.moveTo(23,0);ctx.lineTo(42,8);ctx.lineTo(25,15);ctx.moveTo(17,-11);ctx.arc(17,-15,10,0,Math.PI*2);ctx.moveTo(-29,5);ctx.bezierCurveTo(-58,2,-52,35,-35,29);}
 ctx.stroke();ctx.restore();
}
const collectionShadows=new Map();
function shadowPrize(id,x,y){
 let cv=collectionShadows.get(id);
 if(!cv){cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d');if(id==='tuna'){const h=128*ART.tuna.height/ART.tuna.width;c.drawImage(ART.tuna,0,(128-h)/2,128,h);}else{const w=ART.snacks.width/2;c.drawImage(ART.snacks,id==='shrimp'?w:0,0,w,ART.snacks.height,0,0,128,128);}c.globalCompositeOperation='source-in';c.fillStyle='#0e0918';c.fillRect(0,0,128,128);collectionShadows.set(id,cv);}
 ctx.drawImage(cv,x-38,y-38,76,76);
}
function drawInventory(){
 const {top,left,right}=screenLayout(),width=right-left;
 ctx.fillStyle='#160f24';ctx.fillRect(0,0,W,H);ctx.textBaseline='middle';
 ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 24px system-ui';ctx.fillText('Your treasures',left,top+6);
 ctx.textAlign='right';ctx.font='bold 16px system-ui';ctx.fillText('Close',right,top+6);
 ['Inventory','Water','Cheese'].forEach((name,i)=>{const x=left+i*width/3;ctx.fillStyle=loopScreen===['inventory','water','cheese'][i]?'#775578':'#30213f';ctx.fillRect(x,top+42,width/3-3,42);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.fillText(name,x+width/6,top+64);});
 if(loopScreen==='inventory'){
  ['cheese','shrimp','tuna'].forEach((id,i)=>{const y=top+108+i*122;ctx.fillStyle='#30213f';ctx.fillRect(left,y,width,108);drawPrize('item',id,left+63,y+76,.72);ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 18px system-ui';ctx.fillText(PRIZE_NAMES[id],left+130,y+28);ctx.font='15px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText('Owned: '+(S.got[id]||0),left+130,y+55);ctx.fillStyle='#d0bedf';ctx.font='12px system-ui';ctx.fillText(placements[id]?'Placed in collection':S.got[id]?'Tap to choose a place':'Win off the front',left+130,y+82);});
  ctx.textAlign='left';ctx.fillStyle='#d0bedf';ctx.font='14px system-ui';ctx.fillText('Purse: '+S.coins+' coins',left,top+508);ctx.fillText('Choose Water or Cheese to see your collection.',left,top+542);return;
 }
 const set=COLLECTIONS[loopScreen],ids=[...set.items,...set.future],cell=(width-12)/2;
 ctx.textAlign='left';ctx.fillStyle='#d0bedf';ctx.font='13px system-ui';ctx.fillText(collectionPaid[loopScreen]?'Reward collected · future prizes coming later':'+ '+set.reward+' coins for placing '+set.items.map(id=>PRIZE_NAMES[id]).join(' + '),left,top+101);
 ids.forEach((id,i)=>{const x=left+i%2*(cell+12),y=top+118+Math.floor(i/2)*136,future=set.future.includes(id);ctx.fillStyle=selectedTreat===id?'#55405f':'#30213f';ctx.fillRect(x,y,cell,124);if(placements[id])drawPrize('item',id,x+cell/2,y+76,.63);else if(future)outlinePrize(id,x+cell/2,y+48);else shadowPrize(id,x+cell/2,y+47);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 14px system-ui';ctx.fillText(PRIZE_NAMES[id],x+cell/2,y+94);ctx.font='11px system-ui';ctx.fillStyle='#d0bedf';ctx.fillText(future?'Future prize':placements[id]?'Placed':'Place here',x+cell/2,y+112);});
 const tray=top+426;ctx.textAlign='left';ctx.font='bold 14px system-ui';ctx.fillStyle='#fff';ctx.fillText('From your inventory · select, then place',left,tray+8);
 set.items.forEach((id,i)=>{const w=width/set.items.length,x=left+i*w;ctx.fillStyle=selectedTreat===id?'#775578':'#30213f';ctx.fillRect(x,tray+28,w-6,94);drawPrize('item',id,x+40,tray+88,.48);ctx.textAlign='left';ctx.font='14px system-ui';ctx.fillStyle='#fff';ctx.fillText('×'+(S.got[id]||0),x+83,tray+58);ctx.font='11px system-ui';ctx.fillText(placements[id]?'Placed':PRIZE_NAMES[id],x+83,tray+83);});
 ctx.textAlign='left';ctx.font='13px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText(collectionMessage||'Future slots stay empty for now.',left,top+578,width);ctx.fillStyle='#d0bedf';ctx.fillText('Purse: '+S.coins+' coins',left,top+606);
 if(collectionStars>0&&celebratingCollection===loopScreen){ctx.textAlign='center';ctx.fillStyle='#ffd76a';ctx.font='bold 18px system-ui';ctx.fillText('COLLECTION COMPLETE!',200,top+407);}
}
