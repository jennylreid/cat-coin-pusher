// UI-only celebration. The ledger still credits/saves the whole reward atomically.
let collectionPayoff=null,pendingCollectionDance=false,collectionDance=null;
function beginCollectionPayoff(key,reward,id){collectionPayoff={key,reward,id,t:0};pendingCollectionDance=true;}
function collectionPurseDisplay(){
 const p=collectionPayoff;if(!p)return S.coins;
 const k=Math.min(1,Math.max(0,(p.t-.2)/1.85));return S.coins-p.reward+Math.floor(p.reward*k);
}
function closeCollectionScreen(){cancelCollectionDrag();inventoryOpen=false;stopDrops();collectionPayoff=null;startPendingCollectionDance();save();}
function startPendingCollectionDance(){
 if(!pendingCollectionDance||inventoryOpen||sweepTime>0||catquakeTime>0||shake>0)return;
 pendingCollectionDance=false;stopTickle();stopPawDance();
 collectionDance={until:time+4.4,previousShakes:danceShakesTable};danceShakesTable=false;
 happyUntil=0;sweetUntil=time+4.4;
 // Approved dance motion, using its existing silent clock and poses; no table-jolt world.
 pawDanceToken++;pawDance={started:time,silent:true,index:1,switched:true,anchor:0};save();
}
function endCollectionDance(){if(!collectionDance)return;const previous=collectionDance.previousShakes;collectionDance=null;stopPawDance();danceShakesTable=previous;}
function tickCollectionPayoff(dt){
 if(collectionPayoff){collectionPayoff.t+=dt;if(collectionPayoff.t>=2.8)collectionPayoff=null;}
 if(collectionDance&&(!pawDance||time>=collectionDance.until||sweepTime>0||catquakeTime>0))endCollectionDance();
 if(!collectionDance&&!inventoryOpen)startPendingCollectionDance();
}
function payoffArea(g){if(g.scene)return g.scene;const slots=g.slots;const x=Math.min(...slots.map(r=>r.x)),y=Math.min(...slots.map(r=>r.y)),right=Math.max(...slots.map(r=>r.x+r.w)),bottom=Math.max(...slots.map(r=>r.y+r.h));return {x,y,w:right-x,h:bottom-y};}
function drawSceneWake(g){
 const p=collectionPayoff;if(!p||p.key!==loopScreen)return;
 const r=payoffArea(g),life=Math.sin(Math.PI*Math.min(1,p.t/2.8));ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();
 if(p.key==='water'){
  ctx.strokeStyle='rgba(143,239,255,'+(.42*life)+')';ctx.lineWidth=2;
  for(let i=0;i<5;i++){const k=(p.t*.25+i*.19)%1;ctx.beginPath();ctx.ellipse(r.x+r.w*.5,r.y+r.h*.46,r.w*(.1+.6*k),r.h*(.025+.16*k),0,0,7);ctx.stroke();}
  for(let i=0;i<10;i++){const x=r.x+r.w*((i*.618)%1),y=r.y+r.h*(1-(p.t*.3+i*.13)%1);ctx.beginPath();ctx.arc(x,y,2+i%3,0,7);ctx.stroke();}
 }else{
  const glow=ctx.createRadialGradient(r.x+r.w*.5,r.y,0,r.x+r.w*.5,r.y,r.h*1.2);glow.addColorStop(0,'rgba(255,225,136,'+(.4*life)+')');glow.addColorStop(1,'rgba(255,189,94,0)');ctx.fillStyle=glow;ctx.fillRect(r.x,r.y,r.w,r.h);
 }
 ctx.restore();
}
function drawPayoffCoins(g){
 const p=collectionPayoff;if(!p||p.key!==loopScreen)return;
 const r=g.slots.find(s=>s.id===p.id)||g.slots[0],from={x:r.x+r.w/2,y:r.y+r.h*.45},to={x:g.satchel.x+g.satchel.w-56,y:g.satchel.y+23};
 for(let i=0;i<12;i++){
  const t=(p.t-.15-i*.085)/.9;if(t<0||t>=1)continue;const q=1-t,c={x:200+(i-5.5)*8,y:g.top+80};
  const x=q*q*from.x+2*q*t*c.x+t*t*to.x,y=q*q*from.y+2*q*t*c.y+t*t*to.y;
  ctx.save();ctx.translate(x,y);ctx.rotate(t*3+i*.3);blitFlat('coin',0,0,.23);ctx.restore();
 }
}
