# CP-74 try 8 (PM review of try 7, Nov 18): 1) no haze: the shoulder painting's soft lower edge (rows 500-640 of its canvas,
# Codex's fade into the arm) is drawn only on top of arm fur, never over the sky; 2) the paw never covers the play area: it is
# drawn behind the coins from the first frame of the reach, and its path keeps out to the side (in the strip beside the board,
# as far as the screen allows); 3) the arm moves with the paw (translation only), so the visible arm always ends at the wrist.
# Everything else as try 7 (no elbow, constant-size paws, shoulders lean, no fades, letting go = reverse).
from pathlib import Path
p=Path(__file__).parent/'cp74-hug.js';s=p.read_text(encoding='utf-8')
def rep(a,b):
    global s
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
def block(start,end,new):
    global s
    a=s.index(start);b=s.index(end,a);s=s[:a]+new+s[b:]
# 2) path: out to the side; 3) arm offset = the paw's offset from its place
block("// the left mitt's path at reach u:","// the left arm","""// the left mitt's path at reach u: from exactly where the board's resting mitt is drawn (drawPaws: mittRest(side), turned by
// MITT_TURN plus its tiny wobble) to its place in the lower corner, turning to 40 degrees, same size throughout. On the way it
// keeps out in the strip beside the board: its centre at most 72 left of the board's rim (partly off the screen's edge if need be).
function z74RimXAt(y){const r=z74RimPts();if(!r)return 200;const P=r.left;if(y<=P[0].y)return P[0].x;for(let i=1;i<P.length;i++)if(y<=P[i].y){const a=P[i-1],b=P[i];return a.x+(b.x-a.x)*(y-a.y)/((b.y-a.y)||1);}return P[P.length-1].x;}
function z74MittPath(L,u){const m=mittRest(-1),x0=m.x,y0=m.y,x2=200-Z74.MITT_DX,y2=L.mittY,t0=-(MITT_TURN+Math.sin(time*1.7)*.018);
 const y=y0+(y2-y0)*u,lx=x0+(x2-x0)*u,sm=v=>v*v*(3-2*v),w=sm(z74Seg(u,0,.15))*(1-sm(z74Seg(u,.8,1))),x=lx+w*(Math.min(lx,z74RimXAt(y)-72)-lx);
 return {x,y,ox:x-x2,oy:y-y2,turn:t0+(Z74.MITT_TURN-t0)*u};}
function z74DrawMitts(){const X=PGPX,e=z74Env(X.t),L=Z74.L||z74Layout(),r=z74RimPts(),R=Z74.REF;if(!r)return;
 const ys=(r.left[r.left.length-1].y-r.left[0].y)/(R.rimBot-R.rimTop),ay=r.left[0].y+(R.armTop-R.rimTop)*ys;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 for(const s of [-1,1]){const kn=e.hold?3*Math.sin(X.t*Math.PI*2*1.3+(s>0?Math.PI:0)):0;ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}z74LeftArm(L,e,ay,ys,true,kn);ctx.restore();}
 ctx.restore();}
""")
rep(" const back=1-e.reach,ox=-T.dx*back,oy=-T.dy*back; // the arm slides the paw's whole path: its end stays under the paw",
    " const ox=T.ox,oy=T.oy; // the arm moves with the paw (same offset from its place): its end stays under the paw")
# 1) the shoulder in two parts: solid (canvas rows < 500) and soft lower edge (rows >= 500, Codex's fade)
rep("// shoulders + arms","""// the shoulder painting split once into its solid part (canvas rows above 500) and its soft lower edge (rows 500-640)
function z74ShoulderParts(){if(Z74.shParts)return Z74.shParts;const im=Z74.img.shoulder;if(!im)return null;const W0=im.width,H0=im.height,cut=Math.round(H0*500/640);
 const mk=(y0,y1)=>{const c=document.createElement('canvas');c.width=W0;c.height=H0;const g=c.getContext('2d');g.beginPath();g.rect(0,y0,W0,y1-y0);g.clip();g.drawImage(im,0,0);return c;};
 return Z74.shParts={solid:mk(0,cut),soft:mk(cut,H0)};}
// an offscreen layer the size of the screen, for composing each side's arm and shoulder
function z74Layer(){const k=scale*renderPixelRatio,w=Math.ceil(W*k),h=Math.ceil(H*k);let c=Z74.layer;if(!c||c.width!==w||c.height!==h){c=Z74.layer=document.createElement('canvas');c.width=w;c.height=h;}
 const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,h);g.setTransform(k,0,0,k,0,0);return {c,g};}
// shoulders + arms""")
block(" // each arm slides out from behind its shoulder (whole painting, straight); then the shoulders, leaning into the reach"," ctx.restore();\n // the board's own rim again",""" // each side composed in a layer: the arm (whole painting, straight) sliding out with its paw; on top of it only, the shoulder's
 // soft lower edge (never over the sky: no haze); then the shoulder's solid part, leaning into the reach
 const parts=z74ShoulderParts(),k=e.sh,ln=e.reach,Ln=Z74.LEAN,S=z74ShoulderAt(L,e),Tp=z74MittPath(L,e.reach),c0=ctx,Ly=z74Layer();
 for(const s of [-1,1]){Ly.g.save();Ly.g.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);Ly.g.clearRect(-200,-200,800,H+400);
  ctx=Ly.g;try{
   ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}z74LeftArm(L,e,ay,ys,false,0);ctx.restore();
   if(parts&&k>0){ctx.save();
    // revealed by the paw: under the paw down to 40 below its centre, beside it (towards the middle) down to 40 above it
    const px=s<0?Tp.x:400-Tp.x,cut=Tp.y+40,hi=Math.min(cut,Tp.y-40);ctx.beginPath();
    if(s<0){ctx.rect(-200,-200,px+50+200,cut+200);ctx.rect(px+50,-200,600,hi+200);}else{ctx.rect(px-50,-200,600,cut+200);ctx.rect(-200,-200,px-50+200,hi+200);}ctx.clip();
    ctx.translate(s<0?S.cx+S.x:400-S.cx-S.x,S.cy+S.y);if(s>0)ctx.scale(-1,1);const q=1+Ln.grow*ln;ctx.scale(q,q);
    ctx.globalCompositeOperation='source-atop';ctx.drawImage(parts.soft,-R.shW/2,-R.shH/2,R.shW,R.shH);
    ctx.globalCompositeOperation='source-over';ctx.drawImage(parts.solid,-R.shW/2,-R.shH/2,R.shW,R.shH);ctx.restore();}
  }finally{ctx=c0;}
  Ly.g.restore();ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(Ly.c,0,0);ctx.restore();}
""")
# 2) the paws are always drawn with the arms, under the coins; the resting mitts' pass draws nothing during the hug
block(" // mitts: drawn here (under the coins) once they are below the lip"," ctx.restore();}\n// drawn right after the machine",""" // mitts: always drawn here, under the coins, from the first frame of the reach: they never cover a coin or a prize
 const hidden=sweepTime>0||catquakeTime>0;
 if(!hidden){ctx.restore();z74DrawMitts();return;}
""")
block("// during the hug the resting mitts are drawn travelling: here, in their own pass above the coins, while over the board","\n// --- the power",
"""// during the hug the resting mitts are the travelling paws (drawn with the arms, under the coins), so their own pass draws nothing
const __z74Paws=drawPaws;drawPaws=function(){if(!z74On()||sweepTime>0||catquakeTime>0)return __z74Paws();};
""")
s=s.replace("// - (try 7, after UAT 106) No elbow, no fades:","// - (try 8) The shoulder's soft lower edge only over arm fur (no haze); the paws behind the coins from the first frame and out\n//   to the side; the arm moves with its paw. (try 7, after UAT 106) No elbow, no fades:")
p.write_text(s,encoding='utf-8');print('try 8 written')
