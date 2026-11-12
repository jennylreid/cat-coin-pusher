// CP-33 prize feedback / CP-34 Quake pickup. Presentation only: inventory and Quake credit/save stay in fallOff.
// Nothing here pauses play or consumes input. No text, no flash, no dimming.
// Prize (UAT 29, round 5): rises from where it was collected and grows until it nearly fills the screen width, then holds
// still for a moment, turned a little and slightly off-centre (each pickup draws its own angle and offset), with a sparkle
// burst, a soft glow behind it and the chime. Then it shrinks quickly into the Inventory bag, which springs. No flip,
// tumble or wobble. Prizes collected together take turns; from the 3rd queued on, a half-length version plays.
// Credit and save stay at payout; only the animation waits.
// Quake coin (CP-34, unchanged): flies up into the Quake button, flipping, with a sparkle trail; the button springs and
// its shown count goes up on landing.
// Lost prize (side gutter): grey, sink and fade, with a small dark ripple.
const PICKUP_FX_KEY='catpusher.uat.pickupfx.v4'; // UAT 29: new motion; old flip values don't apply, so everything starts on these defaults
const PICKUP_FX_DEFAULTS={rise:.35,size:.9,held:.5,turn:14,offCentre:.04,burst:14,toBag:.3,endScale:.5,sparkles:10,bounce:1.2,bounceTime:.15,quakeFlight:.8,sink:.3};
const PICKUP_FX_LIMITS={rise:[.1,.8,.05],size:[.3,1,.05],held:[.1,1.5,.05],turn:[0,30,2],offCentre:[0,.12,.01],burst:[0,20,2],toBag:[.15,1,.05],endScale:[.05,1,.05],sparkles:[0,16,1],bounce:[1,1.5,.05],bounceTime:[.06,.5,.01],quakeFlight:[.3,1.5,.05],sink:[.1,1,.05]};
const PICKUP_FX_LABELS={rise:['Rise and grow',' s'],size:['Size','% of screen width'],held:['Time held',' s'],turn:['Turn (max)','°'],offCentre:['Off-centre (max)','% of screen'],burst:['Burst size',' sparkles'],toBag:['Into bag',' s'],endScale:['End size','x'],sparkles:['Trail sparkles',''],bounce:['Bounce size','x'],bounceTime:['Bounce time',' s'],quakeFlight:['Quake flight',' s'],sink:['Lost sink time',' s']};
const pickupFx={...PICKUP_FX_DEFAULTS};
try{const pref=JSON.parse(localStorage.getItem(PICKUP_FX_KEY)||'null');if(pref)for(const k in PICKUP_FX_DEFAULTS){const x=+pref[k],[lo,hi]=PICKUP_FX_LIMITS[k];if(Number.isFinite(x))pickupFx[k]=Math.min(hi,Math.max(lo,x));}}catch(e){}
function savePickupFx(){try{localStorage.setItem(PICKUP_FX_KEY,JSON.stringify(pickupFx));}catch(e){}}
function stepPickupFx(k,dir){const [lo,hi,st]=PICKUP_FX_LIMITS[k];pickupFx[k]=Math.round(Math.min(hi,Math.max(lo,pickupFx[k]+dir*st))*100)/100;savePickupFx();}
function resetPickupFx(){Object.assign(pickupFx,PICKUP_FX_DEFAULTS);savePickupFx();}
function pickupFxText(k){const [label,unit]=PICKUP_FX_LABELS[k],x=pickupFx[k];return label+': '+(['turn','offCentre','burst'].includes(k)&&x===0?'off':(k==='size'||k==='offCentre'?Math.round(x*100):+x.toFixed(2))+unit);}
// Pools: flights, lost effects and sparkles are reused, so a burst allocates nothing per frame.
const treatAwards=[],flightPool=[],lostFx=[],lostPool=[],SPARKLE_CAP=36,sparkles=[];
for(let i=0;i<SPARKLE_CAP;i++)sparkles.push({on:false,x:0,y:0,vx:0,vy:0,t:0,life:.55,r:0});
let tileBounceT=-1,quakeBounceT=-1,lastPickupChime=-9,pickupPreviewIndex=0;
const pickupEase=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2,easeOut=u=>1-Math.pow(1-u,3),easeIn=u=>u*u*u;
const easeOutSoft=u=>{const c=.6;return 1+(c+1)*Math.pow(u-1,3)+c*Math.pow(u-1,2);}; // ~2% overshoot at full size
const PICKUP_POINT={x:0,y:0,s:1,flip:1,rot:0,glow:0};
const DEG=Math.PI/180,SCREEN_W=400,SHORT_FROM=2,SHORT_K=.5; // 3rd queued prize onwards: rise and hold at half length
// Visible width of a prize at scale s: drawPrize's box times the art's opaque share (measured from snacks.webp / tuna.png alpha).
const PRIZE_OPAQUE={cheese:.87,shrimp:.826,tuna:.928},PRIZE_ASPECT={cheese:.91,shrimp:1,tuna:.657},EDGE_SPILL=8,prizeWidth=(id,s)=>ITEM_R*s*(id==='tuna'?3.8:2.8)*(PRIZE_OPAQUE[id]||.87);
function pickupTarget(){const b=inventoryButton();return {x:b.x+b.w/2,y:b.y+b.h/2};}
function quakeTarget(){const b=powerButtons().quake;return {x:b.x+b.w/2,y:b.y+b.h/2};}
function pickupCentre(){return {x:200,y:H*.52};}
function boardToScreen(at){return {x:200+(at.x-200)*VIEW.z,y:VIEW.y+at.y*VIEW.zy,s:at.s*VIEW.z};}
function queueTreatAward(id,x,body,preview=false,kind='item'){
 // Starts where it went over the front edge (same projection as the board drawing).
 const wx=Number.isFinite(x)?x:body&&body.rb?body.rb.translation().x/M:200,at=screenOf(Math.max(T.L+ITEM_R,Math.min(T.R-ITEM_R,wx)),T.FRONT,0);
 const sc=boardToScreen(at),f=flightPool.pop()||{};
 f.kind=kind;f.id=id;f.t=0;f.x0=sc.x;f.y0=sc.y;f.s0=sc.s;f.emitted=0;f.burst=false;f.arrived=false;f.preview=!!preview;f.spark=Math.round(pickupFx.sparkles);
 if(kind==='quake'){
  const tg=quakeTarget();f.tr=0;f.tm=0;f.td=pickupFx.quakeFlight;f.mx=sc.x;f.my=sc.y;f.ms=sc.s;
  f.ts=0;f.rot=0;f.short=false;f.cx=sc.x+(sc.x<200?-1:1)*90;f.cy=(sc.y+tg.y)/2;f.es=Math.min(1,26/(2*radius('quake')*sc.s))*sc.s;f.turns=2;
 }else{
  // Prizes take turns: this one waits (hovering where it was collected) and starts rising as the one ahead leaves the
  // middle, so the middle only ever holds one.
  let ahead=0,leave=0;for(const o of treatAwards)if(o.kind==='item'){const r=o.tr+o.tm+o.ts-o.t;if(r>0){ahead++;leave=Math.max(leave,r);}}
  const k=ahead>=SHORT_FROM?SHORT_K:1,c=pickupCentre(),side=()=>Math.random()<.5?-1:1;
  f.short=k<1;f.tr=pickupFx.rise*k;f.tm=pickupFx.held*k;f.ts=0;f.td=pickupFx.toBag;f.t=-leave;
  // Each pickup: its own turn (40-100% of the max, either way) and offset (x 40-100% of the max either way, y up to the max).
  f.rot=side()*pickupFx.turn*(.43+.57*Math.random())*DEG;
  // The side offset is capped so the turned prize spills at most EDGE_SPILL px past a screen edge.
  const w2=prizeWidth(id,pickupFx.size*SCREEN_W/prizeWidth(id,1))/2,half=w2*Math.abs(Math.cos(f.rot))+w2*(PRIZE_ASPECT[id]||1)*Math.abs(Math.sin(f.rot));
  f.mx=c.x+side()*Math.min(pickupFx.offCentre*SCREEN_W*(.4+.6*Math.random()),Math.max(0,SCREEN_W/2+EDGE_SPILL-half));f.my=c.y+(Math.random()*2-1)*pickupFx.offCentre*SCREEN_W;
  f.ms=pickupFx.size*SCREEN_W/prizeWidth(id,1);f.es=sc.s*pickupFx.endScale;
  const tg=pickupTarget();f.cx=(f.mx+tg.x)/2;f.cy=f.my+20;
 }
 treatAwards.push(f);return f;
}
function quadPoint(x0,y0,cx,cy,x2,y2,u,out){const w=1-u;out.x=w*w*x0+2*w*u*cx+u*u*x2;out.y=w*w*y0+2*w*u*cy+u*u*y2;return out;}
// Position, size and flip (horizontal scale, -1..1) of a flight at its own time t.
function pickupPoint(f,t=f.t){
 const P=PICKUP_POINT;P.rot=0;P.flip=1;P.glow=0;
 if(t<0){P.x=f.x0;P.y=f.y0-Math.abs(Math.sin(t*5))*4;P.s=f.s0;return P;} // waiting its turn
 if(t<f.tr){const u=Math.min(1,t/f.tr),e=easeOut(u);quadPoint(f.x0,f.y0,f.x0,f.my,f.mx,f.my,e,P);P.s=f.s0+(f.ms-f.s0)*easeOutSoft(u);P.rot=f.rot*e;return P;}
 const lv=f.tr+f.tm+f.ts;
 if(t<lv){P.x=f.mx;P.y=f.my;P.s=f.ms;P.rot=f.rot;P.glow=Math.min(1,(t-f.tr)/.2);return P;} // held still; the glow eases in over 0.2 s (no flash)
 const u=Math.min(1,(t-lv)/f.td),tg=f.kind==='quake'?quakeTarget():pickupTarget();
 if(f.kind==='quake'){const e=pickupEase(u);quadPoint(f.mx,f.my,f.cx,f.cy,tg.x,tg.y,e,P);P.s=f.ms+(f.es-f.ms)*e;P.flip=Math.cos(2*Math.PI*f.turns*e);return P;}
 // Into the bag: shrinks fast (most of the size goes in the first third) while it swoops down.
 const e=easeIn(u)*.35+pickupEase(u)*.65,k=1-Math.pow(1-u,4);quadPoint(f.mx,f.my,f.cx,f.cy,tg.x,tg.y,e,P);
 P.s=f.ms+(f.es-f.ms)*k;P.rot=f.rot*(1-e);P.glow=Math.max(0,1-u*2.5);return P;
}
function emitSparkle(x,y,vx=0,vy=0,big=1){for(const k of sparkles)if(!k.on){k.on=true;k.x=x+(Math.random()-.5)*8;k.y=y+(Math.random()-.5)*8;k.vx=vx;k.vy=vy;k.t=0;k.life=big>1?.7:.55;k.r=(5.5+Math.random()*2)*big;return;}}
function pickupChime(){const now=performance.now();if(now-lastPickupChime<120)return;lastPickupChime=now;sfx.itemCollected();}
// Lost prize: drawn at the table edge where it crossed into the side gutter.
function queueLostPrize(b,wx,wz){
 const at=screenOf(wx<200?T.L:T.R,Math.max(GUARD_END,Math.min(T.FRONT,wz)),0),f=lostPool.pop()||{};f.id=b.id;f.x=at.x;f.y=at.y;f.s=at.s;f.t=0;f.dur=pickupFx.sink;lostFx.push(f);return f;
}
function quakeInFlight(){let n=0;for(const f of treatAwards)if(f.kind==='quake'&&!f.arrived&&!f.preview)n++;return n;}
function tickTreatAwards(dt){
 if(inventoryOpen||panel.style.display==='block')return;
 for(const k of sparkles)if(k.on){k.t+=dt;k.x+=k.vx*dt;k.y+=k.vy*dt;const d=Math.max(0,1-dt*3.2);k.vx*=d;k.vy*=d;if(k.t>=k.life)k.on=false;}
 if(tileBounceT>=0){tileBounceT+=dt;if(tileBounceT>=pickupFx.bounceTime)tileBounceT=-1;}
 if(quakeBounceT>=0){quakeBounceT+=dt;if(quakeBounceT>=pickupFx.bounceTime)quakeBounceT=-1;}
 for(let i=treatAwards.length-1;i>=0;i--){
  const f=treatAwards[i];f.t+=dt;const lv=f.tr+f.tm+f.ts,end=lv+f.td;
  // The reveal: a burst of sparkles from around the prize and the existing chime as it reaches full size.
  if(f.kind==='item'&&!f.burst&&f.t>=f.tr){f.burst=true;pickupChime();const n=Math.round(pickupFx.burst),r0=prizeWidth(f.id,f.ms)*.42;for(let j=0;j<n;j++){const a=j/n*Math.PI*2+.3+(Math.random()-.5)*.35,sp=150+Math.random()*90;emitSparkle(f.mx+Math.cos(a)*r0,f.my+Math.sin(a)*r0*.75,Math.cos(a)*sp,Math.sin(a)*sp*.8,1.5);}}
  // Trail along the final flight.
  const u=Math.max(0,Math.min(1,(f.t-lv)/f.td+1e-6));
  while(f.t>=lv&&f.emitted<f.spark&&u>=(f.emitted+.5)/f.spark){const q=pickupPoint(f,lv+(f.emitted+.5)/f.spark*f.td);emitSparkle(q.x,q.y);f.emitted++;}
  if(!f.arrived&&f.t>=end-1e-6){f.arrived=true;if(f.kind==='quake'){quakeBounceT=0;sfx.special();}else tileBounceT=0;}
  if(f.arrived&&f.t>=end+pickupFx.bounceTime){treatAwards.splice(i,1);flightPool.push(f);}
 }
 for(let i=lostFx.length-1;i>=0;i--){const f=lostFx[i];f.t+=dt;if(f.t>=f.dur){lostFx.splice(i,1);lostPool.push(f);}}
}
// Spring for the tile and the Quake button: quick rise to the set size, a slight undershoot, then rest at 1.
const TILE_SPRING_PEAK=(()=>{let m=0;for(let i=0;i<=200;i++){const u=i/200;m=Math.max(m,Math.sin(Math.PI*1.25*u)*(1-u));}return m;})();
function springScale(t){if(t<0)return 1;const u=Math.min(1,t/pickupFx.bounceTime);return 1+(pickupFx.bounce-1)*Math.sin(Math.PI*1.25*u)*(1-u)/TILE_SPRING_PEAK;}
function inventoryTileScale(){return springScale(tileBounceT);}
function quakeButtonScale(){return springScale(quakeBounceT);}
// The Quake button shows its count going up when the coin lands (credit itself is already saved at payout).
function shownPowerCount(id){const n=powerCount(id);return id==='quake'&&!S.dev&&BOARD.id==='tuna-terraces'?Math.max(0,n-quakeInFlight()):n;}
function prizeCenterLift(id,s){if(id==='tuna'){const w=radius('item')*s*3.8;return .3*w*ART.tuna.height/ART.tuna.width;}return radius('item')*s*2.8*.2;}
function previewPickup(){
 panel.style.display='none';const ids=['cheese','shrimp','tuna'],xs=[200,135,265];
 queueTreatAward(ids[pickupPreviewIndex%3],xs[pickupPreviewIndex%3],null,true);pickupPreviewIndex++;
}
function previewQuakePickup(){panel.style.display='none';queueTreatAward('quake',[200,140,260][pickupPreviewIndex%3],null,true,'quake');pickupPreviewIndex++;}
function previewLostPrize(){
 panel.style.display='none';const ids=['cheese','shrimp','tuna'],side=pickupPreviewIndex%2?-1:1;
 queueLostPrize({id:ids[pickupPreviewIndex%3]},side>0?T.R+20:T.L-20,600);pickupPreviewIndex++;
}
function drawStarSparkle(x,y,r){ctx.beginPath();ctx.moveTo(x,y-r*2);ctx.quadraticCurveTo(x,y,x+r*2,y);ctx.quadraticCurveTo(x,y,x,y+r*2);ctx.quadraticCurveTo(x,y,x-r*2,y);ctx.quadraticCurveTo(x,y,x,y-r*2);ctx.fill();}
function drawFlight(f){
 const q=pickupPoint(f);
 // Soft glow behind a held prize: local to the prize, steady, never over the whole screen.
 if(f.kind==='item'&&q.glow>0){const r=prizeWidth(f.id,q.s)*.72,g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,r);
  g.addColorStop(0,'rgba(255,240,170,.6)');g.addColorStop(.62,'rgba(255,220,110,.42)');g.addColorStop(1,'rgba(255,200,80,0)');
  ctx.globalAlpha=q.glow;ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,r,0,7);ctx.fill();ctx.globalAlpha=1;}
 // Quake keeps its coin flip (horizontal scale follows cos; never quite zero so the edge stays visible).
 let fl=q.flip;if(Math.abs(fl)<.06)fl=fl<0?-.06:.06;
 ctx.save();ctx.translate(q.x,q.y);if(q.rot)ctx.rotate(q.rot);if(fl!==1)ctx.scale(fl,1);
 if(f.kind==='quake'){const sp=sprite('quake'),r=radius('quake')*q.s;ctx.drawImage(sp.cv,-r,-r,2*r,2*r);}
 else drawPrize('item',f.id,0,prizeCenterLift(f.id,q.s),q.s);
 ctx.restore();
}
function drawTreatAward(){
 if(inventoryOpen||panel.style.display==='block')return;
 let any=treatAwards.length>0;if(!any)for(const k of sparkles)if(k.on){any=true;break;}if(!any)return;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 for(const f of treatAwards)if(!f.arrived)drawFlight(f);
 // Sparkles on top of the prizes so the burst around the big prize stays visible.
 for(const k of sparkles)if(k.on){const u=k.t/k.life,a=1-u*u,r=k.r*(1-.35*u);ctx.globalAlpha=.3*a;ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.arc(k.x,k.y,r*1.5,0,7);ctx.fill();ctx.globalAlpha=a;ctx.fillStyle='#ffcf2e';ctx.strokeStyle='rgba(92,52,0,.75)';ctx.lineWidth=1.2;drawStarSparkle(k.x,k.y,r);ctx.stroke();ctx.fillStyle='#ffffff';drawStarSparkle(k.x,k.y,r*.55);}
 ctx.globalAlpha=1;
 ctx.restore();
}
// Drawn inside the board transform (same space as the falling coins).
function drawLostPrizes(){
 if(!lostFx.length)return;
 for(const f of lostFx){
  const u=Math.min(1,f.t/f.dur),e=1-Math.pow(1-u,2);
  ctx.save();ctx.globalAlpha=.42*(1-u);ctx.strokeStyle='#170e1e';ctx.fillStyle='rgba(23,14,30,.35)';ctx.lineWidth=2.2*(1-u)+.6;
  const rad=(10+e*34)*f.s;ctx.beginPath();ctx.ellipse(f.x,f.y,rad,rad*SQUASH,0,0,7);ctx.fill();ctx.stroke();ctx.restore();
  const sc=f.s*(1-e);if(sc<=.01)continue;
  ctx.save();ctx.globalAlpha=1-u;ctx.filter='grayscale(1) brightness(.85)';drawPrize('item',f.id,f.x,f.y+prizeCenterLift(f.id,sc)+e*6*f.s,sc);ctx.restore();
 }
}

