
// ---------- CP-101 rework: the Ragdoll's body behind its dancing head (Jenny on UAT 129: when the head bobs or slumps "the
// pusher shows through with no cat body behind it"). No new art: the Hug's approved shoulder painting (CP-74 try 9,
// CP74_ART.shoulder: its solid part and soft lower edge, the right one mirrored as in the Hug) is drawn twice under the head,
// side by side under the chin, so they read as the cat's chest and shoulders behind the flop. Drawn for the whole Ragdoll
// Dance break (on and off with it, no fade); clipped to outside the board's rim (never over the board, the coins or the
// prizes); under the head and the mitts; it sways with the dance's lazy sway. Drawing only: no physics, timing or pickup change.
const CP101B={dx:70,dy:14,k:1.15,off:false,frames:0};
function cp101BodyOn(){const D=WILD.on&&WILD.dance;return !!(D&&D.ragdoll&&!CP101B.off&&!inventoryOpen&&!(typeof PGPX!=='undefined'&&PGPX));}
function cp101Body(){const r=z74RimPts(),parts=z74ShoulderParts();if(!r||!parts)return;const L=z74Layout(),R=Z74.REF,x=danceBeatX();
 const sw=x==null?0:Math.sin(Math.PI*2*x/3)*4,w=R.shW*CP101B.k,h=R.shH*CP101B.k,cy=L.chin+CP101B.dy;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);z74ClipOutside(r);
 for(const s of [-1,1]){ctx.save();ctx.translate(200+s*CP101B.dx+sw,cy);if(s>0)ctx.scale(-1,1);
  ctx.drawImage(parts.soft,-w/2,-h/2,w,h);ctx.drawImage(parts.solid,-w/2,-h/2,w,h);ctx.restore();}
 ctx.restore();ctx.save();ctx.setTransform(...Z74.rimM);__z74Rim();ctx.restore();CP101B.frames++;}
// drawn right after the machine, like the Hug's body: under the head and the mitts
const __cp101Machine=drawMachine;drawMachine=function(){const r=__cp101Machine.apply(this,arguments);
 if(cp101BodyOn()&&CP101B.f!==Z74.f){CP101B.f=Z74.f;try{cp101Body();}catch(e){CP101B.err=String(e);}}return r;};
// ---------- end CP-101 rework ----------
