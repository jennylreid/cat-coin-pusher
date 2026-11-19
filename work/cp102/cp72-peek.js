// ---------- CP-72 peek-a-boo ending (UAT 102; Jenny, Nov 18: "keep this small jump, but before leaving the screen, pause
// at the edge of the screen with just the eyes showing, just for a moment." / "go with the peekaboo ending also.") ----------
// Style 'peek' (Engineer tools "Zoomies ending" -> Peek-a-boo, now the default): the ginger kitten's final leap is UAT 96's
// hang (puffed, about 1.5x, not tilted); then instead of shrinking away it drops to the bottom edge of the screen and stops
// there with just the top of its head and its eyes showing, looking at you, for a moment (fur settling back down), then
// ducks out of sight. Drawn with the kittens' own drawing (z72Kitten), at the size it had in the hang; drawn last so the
// screen edge is the real edge. The rest of Zoomies is unchanged.
const CP72P={drop:.24,hold:.5,duck:.14, eyes:7}; // seconds: fall to the edge, the peek, ducking away; eyes this far (kitten units) above the edge
function cp72PeekLen(){return CP72P.drop+CP72P.hold+CP72P.duck;}
const __cp72pPath=z72Path;
z72Path=function(k,aim){const L=Z72.leapHang,peek=k.id===0&&L.style==='peek';if(peek)L.style='still';
 try{__cp72pPath(k,aim);}finally{if(peek)L.style='peek';}
 if(!peek)return;const segs=k.segs,hang=segs[segs.length-2],Ph=hang.f(1);segs.pop();
 for(const [n,d] of [['drop',CP72P.drop],['hold',CP72P.hold],['duck',CP72P.duck]])segs.push({k:'leap',d,f:u=>({...Ph,h:Ph.h,fade:0,pk:n,pu:u})});
 let t=0;for(const g of segs){g.t0=t;t+=g.d;}k.len=t;};
// the peek, over everything: from where the hang ended to the bottom edge, held, then down out of sight
function cp72PeekDraw(){const X=Z72X,k=X&&X.kits[0];if(!k||k.gone||!k.P||!k.P.pk)return;const P=k.P,C=CP72P;
 const g=skyScreen(P.x,P.z,0),p0=skyScreen(P.x,P.z,P.h),s=g.s*Z72.size/48*(P.grow||1),bottom=ctx.canvas.height/(scale*renderPixelRatio);
 const at=bottom+(33-C.eyes)*s; // the kitten's feet: its eyes (33 units up, front view) sit C.eyes units above the edge
 let y,puff,pose;
 if(P.pk==='drop'){const e=z72E(P.pu);y=p0.y+(at-p0.y)*e;puff=Math.max(0,1-P.pu*1.6);pose=P.pu<.5?'leap':undefined;}
 else if(P.pk==='hold'){y=at;puff=0;pose=undefined;}
 else{const e=P.pu*P.pu;y=at+e*40*s;puff=0;pose=undefined;}
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 z72Kitten(p0.x,y,s,k.coat,Math.PI,1,0,1,0,puff,0,pose);ctx.restore();}
const __cp72pFrame=draw;draw=function(){const r=__cp72pFrame.apply(this,arguments);try{cp72PeekDraw();}catch(e){}return r;};
// CP-72 Level 7 (UAT 102; Jenny, Nov 18: "nudge prizes only while they're sliding toward a side; resting edge prizes stay
// put."): Zoomies' side guard (in z72Tick) now acts only while a piece moves toward the nearer side faster than `out` (m/s;
// 0.05 = 5 table units/s), and then only stops that slide (sideways speed set to `back` inward, 0.15 m/s) instead of sending
// it inward at 1.6 m/s. Prizes resting at an edge (Level 7, "Edge of the table") stay where they are.
var CP72G={out:.05,back:.15};
// ---------- end CP-72 peek-a-boo ----------
