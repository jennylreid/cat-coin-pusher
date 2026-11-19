
// ---------- CP-72 more (prototype only, not a UAT; Jenny, Nov 18: "a side view of a kitten in the pose that I sent you of a
// crouched cat with the tail out waiting to pounce" + "more like the eyes making eye contact with you", "with the slow blink") ----------
// 1. Pounce crouch: each kitten's wind-up (the front-view play-bow) becomes a side view: crouched low, rear up, tail out,
//    the rear wiggling before the pounce, a still beat, then it bolts. Code stand-in in the kittens' own style (layout first).
// 2. A third ending style 'eyes': the ginger kitten springs up (poofed, as now), then its big eyes fill the screen, look at
//    you, one slow blink, and it is gone. 'still' (UAT 96) and 'crazy' (UAT 98) stay one switch away.
Z72.crouch={on:true,d:.95,settle:.16,freeze:.14,size:1.3}; // whole wind-up (s); sink low; the still beat before the bolt; size vs the kitten
Z72.leapHang.style='eyes'; // 'eyes' (this prototype) | 'crazy' (UAT 98, showing off) | 'still' (UAT 96)
Z72.eyes={rise:.25, in:.06,stare:.12,close:.15,shut:.07,open:.15,after:.06,out:.06}; // seconds: spring up, then the close-up beats
(function(){try{const q=new URLSearchParams(location.search||'');if(q.has('style'))Z72.leapHang.style=q.get('style');if(q.get('crouch')==='0')Z72.crouch.on=false;}catch(e){}})();
function cp72EyesLen(){const E=Z72.eyes;return E.in+E.stare+E.close+E.shut+E.open+E.after+E.out;}
const __cp72mPath=z72Path;
z72Path=function(k,aim){__cp72mPath(k,aim);let segs=k.segs;
 if(Z72.crouch.on){const b=segs.find(g=>g.k==='bow');if(b){const P0=b.f(0),side=P0.x<200?-1:1,C=Z72.crouch;b.d=C.d;
  b.f=u=>({x:P0.x,z:P0.z,h:0,dir:side,skid:Math.max(1e-4,Math.min(.9999,u)),pose:'crouch'});}}
 if(k.id===0&&Z72.leapHang.style==='eyes'){const sk=segs.find(g=>g.k==='skid'),S=sk.f(1),zF=T.FRONT-14,E=Z72.eyes;
  segs=segs.filter(g=>g.k!=='leap');
  const top=o=>({x:S.x,z:zF+4+o*60,h:40*Math.sin(Math.min(1,o)*Math.PI*.8),grow:1+o*.9,dir:1,pose:'leap',puff:Math.min(1,o/.12)});
  segs.push({k:'leap',d:E.rise,f:u=>({...top(u*.625),fade:1})});
  segs.push({k:'eyes',d:cp72EyesLen(),f:u=>({...top(.625),fade:0,eu:u})});}
 let t=0;for(const g of segs){g.t0=t;t+=g.d;}k.segs=segs;k.len=t;};
// --- the crouch, side view (stand-in in the kittens' style). skid = progress 0..1 through the wind-up, dir = facing ---
function z72Side(x,y,s,C,ph,dir,u,alpha){const Cr=Z72.crouch,T0=u*Cr.d,sink=z72E(T0/Cr.settle),frz=z72E((T0-(Cr.d-Cr.freeze))/(Cr.freeze*.6));
 const wig=(1-frz)*(T0>Cr.settle?1:0)*Math.sin((T0-Cr.settle)*34),ol='#2a1406';
 ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);ctx.scale(s*Cr.size*dir,s*Cr.size);ctx.lineJoin='round';ctx.lineCap='round';
 const low=sink*6+frz*2; // the chest sinks to the table (the rear stays up); a touch lower in the still beat
 // the rear: high, wiggling (rocks about the chest); the tail out behind and up, tip twitching
 ctx.save();ctx.translate(12,-6);ctx.rotate(wig*.08);ctx.translate(-12,6);
 const tip=Math.sin(ph*.9)*5*(1-frz*.7);ctx.strokeStyle=ol;ctx.lineWidth=8.5;ctx.beginPath();ctx.moveTo(-24,-32);
 ctx.quadraticCurveTo(-42,-38,-50,-46+tip*.4);ctx.quadraticCurveTo(-55,-52,-51,-60+tip);ctx.stroke();ctx.strokeStyle=C.fur;ctx.lineWidth=5.5;ctx.stroke();
 // far back leg (darker), then the body sloping down from the raised rear to the low chest, the haunch and the near back paw
 ctx.fillStyle=C.dark;ctx.strokeStyle=ol;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(-9,-3,6,4,0,0,7);ctx.fill();ctx.stroke();
 ctx.fillStyle=C.fur;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(-2,-18+low*.5,23,10,.48,0,7);ctx.fill();ctx.stroke();
 ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(8,-9+low*.7,9,3.5,.48,0,7);ctx.fill();
 ctx.strokeStyle=C.dark;ctx.lineWidth=2.4;for(const [sx,sy] of [[-15,-32],[-7,-28],[1,-24]]){ctx.beginPath();ctx.moveTo(sx,sy+low*.4);ctx.lineTo(sx+2.5,sy+6+low*.4);ctx.stroke();}
 ctx.fillStyle=C.fur;ctx.strokeStyle=ol;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(-16,-17,11,12.5,0,0,7);ctx.fill();ctx.stroke();
 ctx.fillStyle=C.dark;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(-12,-3,7,4.2,0,0,7);ctx.fill();ctx.stroke();
 ctx.restore();
 // front legs stretched flat along the table, then the head low between them, looking ahead
 for(const [fx,c] of [[4,C.dark],[10,C.light]]){ctx.fillStyle=c;ctx.strokeStyle=ol;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(fx+12,-3.5,13,3.6,0,0,7);ctx.fill();ctx.stroke();}
 const hx=22,hy=-15+low;ctx.fillStyle=C.fur;ctx.strokeStyle=ol;ctx.lineWidth=2.2;
 ctx.beginPath();ctx.moveTo(hx-9,hy-6);ctx.lineTo(hx-11,hy-22);ctx.lineTo(hx-1,hy-11);ctx.closePath();ctx.fill();ctx.stroke(); // far ear
 ctx.beginPath();ctx.ellipse(hx,hy,13,11.5,0,0,7);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(hx-5,hy-8);ctx.lineTo(hx-3,hy-23);ctx.lineTo(hx+5,hy-10);ctx.closePath();ctx.fill();ctx.stroke(); // near ear
 ctx.fillStyle='#ffb3c4';ctx.beginPath();ctx.moveTo(hx-3,hy-10);ctx.lineTo(hx-2.5,hy-19);ctx.lineTo(hx+2,hy-11);ctx.fill();
 ctx.strokeStyle=C.dark;ctx.lineWidth=2.4;for(const sx of [-6,-1]){ctx.beginPath();ctx.moveTo(hx+sx,hy-11);ctx.lineTo(hx+sx+1,hy-6);ctx.stroke();}
 ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(hx+8,hy+5,7,5,0,0,7);ctx.fill();
 ctx.fillStyle='#fff';ctx.strokeStyle=ol;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(hx+5,hy-2,4.8,5.6,0,0,7);ctx.fill();ctx.stroke();
 ctx.fillStyle='#1b1b1b';ctx.beginPath();ctx.ellipse(hx+6.3,hy-1.5,3.4,4.4,0,0,7);ctx.fill(); // big hunting pupil, locked on
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(hx+7,hy-3.4,1.2,0,7);ctx.fill();
 ctx.fillStyle='#ff7a96';ctx.beginPath();ctx.moveTo(hx+13.5,hy+1);ctx.lineTo(hx+12,hy+4);ctx.lineTo(hx+10.5,hy+1.5);ctx.fill();
 ctx.restore();}
const __cp72mKitten=z72Kitten;
z72Kitten=function(x,y,s,C,ph,dir,skid,alpha,lean,puff,rot,pose){if(pose==='crouch')return z72Side(x,y,s,C,ph,dir,skid,alpha);return __cp72mKitten.apply(this,arguments);};
// --- the 'eyes' ending: a close-up of the ginger kitten's eyes over the whole screen, one slow blink, gone ---
function cp72EyesDraw(){const X=Z72X,k=X&&X.kits[0];if(!k||k.gone||!k.P||k.P.seg!=='eyes')return;const P=k.P,E=Z72.eyes,C=k.coat;
 let t=P.eu*cp72EyesLen();const ph={};for(const n of ['in','stare','close','shut','open','after','out']){ph[n]=Math.max(0,Math.min(1,t/E[n]));t-=E[n];}
 const g=skyScreen(P.x,P.z,0),p0=skyScreen(P.x,P.z,P.h),s=g.s*Z72.size/48*(P.grow||1)*1.3,sk=16*s/330,hx=p0.x,hy=p0.y-32*s;
 const zi=z72E(ph.in),z=zi+Math.sin(zi*Math.PI)*.12,cx=hx+(200-hx)*zi,cy=hy+(H*.46-hy)*zi,sc=(sk+(1-sk)*z)*(1+ph.out*.5);
 const lid=z72E(ph.close)*(1-z72E(ph.open)*.85); // shut, then opens only part way: soft, half-lidded
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.globalAlpha=1-ph.out;ctx.translate(cx,cy);ctx.scale(sc,sc);
 const ol='#2a1406';ctx.lineJoin='round';ctx.lineCap='round';
 ctx.fillStyle=C.fur;ctx.strokeStyle=ol;ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(0,0,330,400,0,0,7);ctx.fill();ctx.stroke();
 ctx.strokeStyle=C.dark;ctx.lineWidth=24;for(const sx of [-70,0,70]){ctx.beginPath();ctx.moveTo(sx,-300);ctx.lineTo(sx*.8,-180);ctx.stroke();}
 ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(0,190,125,90,0,0,7);ctx.fill();
 ctx.fillStyle='#ff7a96';ctx.beginPath();ctx.moveTo(-34,118);ctx.lineTo(34,118);ctx.lineTo(0,152);ctx.closePath();ctx.fill();
 ctx.strokeStyle=ol;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,152);ctx.quadraticCurveTo(-34,196,-62,174);ctx.moveTo(0,152);ctx.quadraticCurveTo(34,196,62,174);ctx.stroke();
 for(const ex of [-98,98]){const ey=-20,rx=76,ry=86;
  ctx.save();ctx.translate(ex,ey);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,7);ctx.save();ctx.clip();
  ctx.fillStyle='#fff';ctx.fillRect(-rx,-ry,rx*2,ry*2);
  ctx.fillStyle='#1b1b1b';ctx.beginPath();ctx.ellipse(0,8,50,64,0,0,7);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(20,-22,17,0,7);ctx.fill();ctx.beginPath();ctx.arc(-18,30,7,0,7);ctx.fill();
  if(lid>0){const m=ry*.42,ly=-ry+(ry+m)*lid,lo=ry-(ry-m)*Math.max(0,(lid-.55)/.45);ctx.fillStyle=C.fur;ctx.fillRect(-rx-2,-ry-2,rx*2+4,ly+ry+2);ctx.fillRect(-rx-2,lo,rx*2+4,ry);
   ctx.strokeStyle=ol;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-rx,ly-6);ctx.quadraticCurveTo(0,ly+22*(2*lid-1),rx,ly-6);ctx.stroke();}
  ctx.restore();if(lid<.5){ctx.strokeStyle=ol;ctx.lineWidth=7;ctx.stroke();}ctx.restore();}
 ctx.restore();}
// drawn last, over everything on the screen (falling pieces, the other kitten, labels)
const __cp72mFrame=draw;draw=function(){const r=__cp72mFrame.apply(this,arguments);try{cp72EyesDraw();}catch(e){}return r;};
// ---------- end CP-72 more ----------
