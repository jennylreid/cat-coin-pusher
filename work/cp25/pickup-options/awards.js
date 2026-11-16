// UAT presentation choices only. Real inventory credit remains in fallOff.
const PICKUP_KEY='catpusher.uat.pickup.v1';
const PICKUP_STYLES=['paw','ribbon','satchel'],PICKUP_NAMES={cycle:'Cycle three styles',paw:'Paw reward (paused)',ribbon:'Reward ribbon (keep playing)',satchel:'Satchel bubble (keep playing)'};
let pickupChoice='cycle',pickupNext=1,pickupPreviewItem='cheese';
try{const pref=JSON.parse(localStorage.getItem(PICKUP_KEY)||'null');if(pref&&(pref.choice==='cycle'||PICKUP_STYLES.includes(pref.choice)))pickupChoice=pref.choice;if(Number.isInteger(pref?.next))pickupNext=((pref.next%3)+3)%3;}catch(e){}
function savePickupChoice(){try{localStorage.setItem(PICKUP_KEY,JSON.stringify({choice:pickupChoice,next:pickupNext}));}catch(e){}}
function cyclePickupChoice(){const choices=['cycle',...PICKUP_STYLES];pickupChoice=choices[(choices.indexOf(pickupChoice)+1)%choices.length];savePickupChoice();}
function choosePickupStyle(){if(pickupChoice!=='cycle')return pickupChoice;const style=PICKUP_STYLES[pickupNext];pickupNext=(pickupNext+1)%3;savePickupChoice();return style;}
const treatAwards=[];
function pickupBlocksPlay(){return !inventoryOpen&&treatAwards[0]?.style==='paw';}
function startTreatAward(){const a=treatAwards[0];if(!a)return;if(a.style==='paw'){stopDrops();cancelCollectionDrag();}if(!a.sounded){a.sounded=true;sfx.itemCollected();}}
function queueTreatAward(id){treatAwards.push({id,t:0,sounded:false,style:choosePickupStyle()});startTreatAward();}
function dismissTreatAward(){if(treatAwards.length)treatAwards.shift();startTreatAward();}
function tickTreatAwards(dt){if(inventoryOpen||panel.style.display==='block')return;const a=treatAwards[0];if(!a)return;a.t+=dt;if(a.t>=pickupDuration(a))dismissTreatAward();}
function pickupDuration(a){return a.style==='paw'?2:a.style==='ribbon'?2.4:2.2;}
function cyclePickupPreviewItem(){const ids=['cheese','shrimp','tuna'];pickupPreviewItem=ids[(ids.indexOf(pickupPreviewItem)+1)%ids.length];}
function previewPickup(){panel.style.display='none';queueTreatAward(pickupPreviewItem);}
function drawTreatAward(){
 const a=treatAwards[0];if(!a||inventoryOpen||panel.style.display==='block')return;const d=pickupDuration(a),fade=Math.max(0,Math.min(1,a.t/.14,(d-a.t)/.22)),pop=.94+.06*Math.min(1,a.t/.18);
 ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.globalAlpha=fade;
 if(a.style==='paw'){
  ctx.fillStyle='rgba(9,23,29,.67)';ctx.fillRect(0,0,W,H);drawPawMedallion(W/2,H/2,pop,()=>drawPrize('item',a.id,0,29,1.95));
 }else if(a.style==='ribbon'){
  const h=hudLayout(),y=h.bottomY-124,w=Math.min(316,W-h.left-h.right-32),x=(W-w)/2;
  ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=12;ctx.shadowOffsetY=4;uiRound(x,y,w,94,20,'#fff0cd','#c79f57',1.5);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle='#286d72';ctx.beginPath();ctx.moveTo(x+10,y+79);ctx.lineTo(x+w-10,y+79);ctx.lineTo(x+w-24,y+91);ctx.lineTo(x+24,y+91);ctx.closePath();ctx.fill();
  drawPrize('item',a.id,x+77,y+63,1.02*pop);ctx.drawImage(ART.collectionsTile,x+w-80,y+18,49,49);
  for(let i=0;i<3;i++)uiCircle(x+147+i*19,y+44,2.5,'#c39444');
 }else{
  const bag=inventoryButton(),x=bag.x+bag.w/2,y=bag.y-80-5*Math.sin(Math.min(1,a.t/d)*Math.PI);
  ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=12;ctx.shadowOffsetY=4;uiCircle(x,y,57,'#fff0cd','#d8b779',1.5);ctx.shadowBlur=0;ctx.shadowOffsetY=0;uiCircle(x+7,y+65,6,'#fff0cd','#d8b779',.7);uiCircle(x+3,y+76,3,'#fff0cd');
  ctx.save();ctx.translate(x,y);ctx.scale(pop,pop);drawPrize('item',a.id,0,23,1.03);ctx.restore();
 }
 ctx.restore();
}
