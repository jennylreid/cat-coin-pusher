// Credit/save stays in fallOff. This is only the recognition-and-stow animation.
const treatAwards=[];
function startTreatAward(){}
function queueTreatAward(id,fromX=200){treatAwards.push({id,t:-.5,sounded:false,fromX:Math.max(72,Math.min(328,fromX))});}
function dismissTreatAward(){if(treatAwards.length)treatAwards.shift();}
function tickTreatAwards(dt){
 if(inventoryOpen)return;const a=treatAwards[0];if(!a)return;a.t+=dt;
 if(a.t>=1.25&&!a.sounded){a.sounded=true;sfx.itemCollected();}
 if(a.t>=1.6)dismissTreatAward();
}
function pickupFlight(a){
 const b=collectionsTile(),h=hudLayout(),from={x:200+(a.fromX-200)*.35,y:H-h.bottom-112},to={x:b.x+b.w/2,y:b.y+b.h*.38};
 const t=Math.max(0,Math.min(1,(a.t-.48)/.77)),k=t*t*t*(t*(t*6-15)+10),q=1-k;
 const c1={x:from.x+28,y:from.y-150},c2={x:to.x-75,y:to.y-65};
 let s=1.65;
 if(a.t<.28){const v=Math.max(0,a.t/.28),c=1.35;s=.22+1.43*(1+(c+1)*(v-1)**3+c*(v-1)**2);}
 else if(a.t<.48)s=1.65+.025*Math.sin((a.t-.28)/.2*Math.PI);
 else s=1.65*(1-k)**.72+.065*k;
 return {x:q*q*q*from.x+3*q*q*k*c1.x+3*q*k*k*c2.x+k*k*k*to.x,y:q*q*q*from.y+3*q*q*k*c1.y+3*q*k*k*c2.y+k*k*k*to.y-12*Math.sin(Math.PI*Math.min(1,Math.max(0,a.t/.48)))*(a.t<.48?1:0),scale:s,rotation:a.t<.48?-.045*Math.sin(Math.PI*Math.min(1,a.t/.48)):.10*Math.sin(Math.PI*t),alpha:Math.max(0,Math.min(1,a.t/.07,(1.29-a.t)/.04))};
}
function drawTreatAward(){
 if(inventoryOpen)return;const a=treatAwards[0];if(!a||a.t<0)return;
 const p=pickupFlight(a);ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);ctx.rotate(p.rotation);drawPrize('item',a.id,0,18*p.scale,p.scale);ctx.restore();
 if(a.t>=1.25){
  const b=collectionsTile(),t=Math.min(1,(a.t-1.25)/.35),pulse=Math.sin(Math.PI*t)*Math.exp(-t*1.5);
  ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.scale(1+.16*pulse,1-.06*pulse);ctx.drawImage(ART.collectionsTile,-b.w/2,-b.h/2,b.w,b.h);
  ctx.globalAlpha=Math.sin(Math.PI*t)*.8;ctx.strokeStyle='#ffe5a0';ctx.lineWidth=1.2;
  for(const [x,y] of [[-b.w*.55,-b.h*.38],[b.w*.5,-b.h*.55],[b.w*.56,b.h*.2]]){const r=2+2*pulse;ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);ctx.stroke();}ctx.restore();
 }
}
