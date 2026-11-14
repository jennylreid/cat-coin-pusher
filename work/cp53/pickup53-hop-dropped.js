// --- UAT 53 (Jenny, Nov 14): one collection effect for every piece. Every prize, the Quake coin, the rain coins, the
// music-note, fish and laser coins and the cat and recipe coins: it hops up from where it went over the ledge (a little
// bigger, a slight tilt), a quick sparkle, then it jumps up and off the nearer side of the screen. The old Pop (the
// prize blown up to 30% of the screen, the soft shadow, the spin into the bag) is gone, on every board and mode, with no
// switch. The art is drawn as it is; the ledge bell and the landing thump (the Quake coin's chime) are kept.
const HOP={rise:.22,hold:.14,leave:.42,up:54,grow:1.15,glints:7};
const __hopQueue=queueTreatAward;
queueTreatAward=function(id,x,body,preview=false,kind='item'){
 const f=__hopQueue(id,x,body,preview,kind); // where it went over, the ledge bell, the pool (same random draws as before)
 f.pop=false;f.hop=true;f.hopGlint=false;f.burst=true;f.spark=0;f.short=false;f.queued=false;
 f.t=0;f.tr=HOP.rise;f.tm=HOP.hold;f.ts=0;f.td=HOP.leave;              // no waiting in line: each one hops where it fell
 f.dir=f.x0<200?-1:1;f.mx=f.x0;f.my=f.y0-HOP.up;f.ms=f.s0*HOP.grow;f.es=f.ms*.85;f.px=f.mx;f.py=f.my;
 f.rot=(popRand()<.5?-1:1)*(4+6*popRand())*DEG;
 f.hx=f.mx+f.dir*36;f.hy=f.my-200;f.ex=f.dir<0?-80:SCREEN_W+80;f.ey=f.my-120; // the jump: up, then out past the edge
 return f;
};
const __hopPoint=pickupPoint;
pickupPoint=function(f,t=f.t){
 if(!f.hop)return __hopPoint(f,t);
 const P=PICKUP_POINT;P.flip=1;
 if(t<f.tr){const u=Math.max(0,t)/f.tr,e=easeOut(u);P.x=f.x0;P.y=f.y0+(f.my-f.y0)*e;P.s=f.s0+(f.ms-f.s0)*easeOutSoft(u);P.rot=f.rot*e;return P;}
 const lv=f.tr+f.tm;
 if(t<lv){const u=(t-f.tr)/f.tm,b=Math.sin(u*Math.PI);P.x=f.mx;P.y=f.my-b*4;P.s=f.ms*(1+.04*b);P.rot=f.rot;return P;}
 const u=Math.min(1,(t-lv)/f.td),e=easeIn(u)*.45+pickupEase(u)*.55;quadPoint(f.mx,f.my,f.hx,f.hy,f.ex,f.ey,e,P);
 P.s=f.ms+(f.es-f.ms)*e;P.rot=f.rot+f.dir*e*Math.PI*.6;return P;
};
// no striped panel or shade behind a hop
const __hopPanel=tickPanel;
tickPanel=function(dt){const f=panelTarget();if(f&&f.hop){PANEL.on=false;return;}return __hopPanel(dt);};
// the sparkle: a ring of glints as it reaches the top of its hop. Its own random stream (popRand), so the board's coins and
// drops draw the same numbers as before.
function hopSparkle(x,y,vx,vy,big){for(const k of sparkles)if(!k.on){k.on=true;k.x=x+(popRand()-.5)*8;k.y=y+(popRand()-.5)*8;k.vx=vx;k.vy=vy;k.t=0;k.life=.7;k.r=(4+popRand()*2)*big;k.ph=popRand()*6.28;return;}}
const __hopTick=tickTreatAwards;
tickTreatAwards=function(dt){
 __hopTick(dt);if(inventoryOpen||panel.style.display==='block')return;
 for(const f of treatAwards)if(f.hop&&!f.hopGlint&&f.t>=f.tr){f.hopGlint=true;const r0=prizeWidth(f.id==='quake'?'quake':f.id,f.ms)*.45;
  for(let j=0;j<HOP.glints;j++){const a=j/HOP.glints*Math.PI*2+popRand()*.6,sp=90+popRand()*60;hopSparkle(f.mx+Math.cos(a)*r0,f.my+Math.sin(a)*r0*.8,Math.cos(a)*sp,Math.sin(a)*sp*.8,1.2);}}
};
// glints always show (they used to wait for the Burst or Sparkles dials)
drawTreatAward=function(){
 if(inventoryOpen||panel.style.display==='block')return;
 let any=treatAwards.length>0;if(!any)for(const k of sparkles)if(k.on){any=true;break;}if(!any)return;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 drawBackdrop(backdropLevel());
 for(const f of treatAwards)if(!f.arrived)drawFlight(f);
 const gl=glint();
 for(const k of sparkles)if(k.on){const u=k.t/k.life,a=(1-u*u)*(.55+.45*Math.sin(k.t*30+k.ph)),r=k.r*1.6*(1-.3*u);ctx.globalAlpha=Math.max(0,a);ctx.drawImage(gl,k.x-r,k.y-r,2*r,2*r);}
 ctx.globalAlpha=1;ctx.restore();
};
// The Quake coin hops as the board's own coin sprite all the way (the big high-res copy was for the 70% Pop moment).
const __hopFlight=drawFlight;
drawFlight=function(f){
 if(!(f.hop&&f.kind==='quake'))return __hopFlight(f);
 const q=pickupPoint(f),sp=sprite('quake'),hs=sp.half*q.s;ctx.save();ctx.translate(q.x,q.y);if(q.rot)ctx.rotate(q.rot);ctx.drawImage(sp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();
};
