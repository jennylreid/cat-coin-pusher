// Inventory is credited/saved by fallOff; this queue only presents the pickup.
const treatAwards=[];
function startTreatAward(){} // No sound until the item reaches the satchel.
function queueTreatAward(id,fromX=200){treatAwards.push({id,t:-.5,sounded:false,fromX:Math.max(48,Math.min(352,fromX))});}
function dismissTreatAward(){if(treatAwards.length)treatAwards.shift();}
function tickTreatAwards(dt){
 if(inventoryOpen)return;
 const a=treatAwards[0];if(!a)return;a.t+=dt;
 if(a.t>=.95&&!a.sounded){a.sounded=true;sfx.itemCollected();}
 if(a.t>=1.2)dismissTreatAward();
}
function pickupFlight(a){
 const b=collectionsTile(),h=hudLayout(),from={x:a.fromX,y:H-h.bottom-100},to={x:b.x+b.w/2,y:b.y+b.h/2};
 const t=Math.max(0,Math.min(1,(a.t-.15)/.8)),k=t*t*(3-2*t),q=1-k,control={x:from.x*.35+to.x*.65,y:Math.min(from.y,to.y)-80};
 return {x:q*q*from.x+2*q*k*control.x+k*k*to.x,y:q*q*from.y+2*q*k*control.y+k*k*to.y,scale:1.05*(1-k)+.12*k,alpha:a.t<.08?a.t/.08:a.t<.95?1:0};
}
function drawTreatAward(){
 if(inventoryOpen)return;const a=treatAwards[0];if(!a||a.t<0)return;
 const p=pickupFlight(a);ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);
 ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);drawPrize('item',a.id,0,18*p.scale,p.scale);ctx.restore();
 if(a.t>=.95){
  const b=collectionsTile(),pulse=Math.sin(Math.PI*Math.min(1,(a.t-.95)/.25));
  ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.scale(1+.12*pulse,1+.12*pulse);ctx.drawImage(ART.collectionsTile,-b.w/2,-b.h/2,b.w,b.h);ctx.restore();
 }
}
