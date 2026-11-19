// ---------- CP-72 Zoomies ending, final (UAT 105; Jenny, Nov 18: "CP-72 Zoomies ending: only peek-a-boo. Kitten stays small:
// the puffed one hangs back and peeks at normal size (at most a little bigger), no blow-up and no screen-sized cat. Remove
// the other ending choices.") ----------
// Peek-a-boo is the only ending (the "Zoomies ending" and "Zoomies sound" choices are gone from Engineer tools; today's
// Zoomies sound plays). The ginger kitten's last leap stays small: it puffs at about its own size (the leap's growth toward
// you is cut to CP72S.growK of what it was, and no 1.5x blow-up), hangs back for CP72S.hang s, then peeks over the bottom
// edge at CP72S.peek x its size on the board, and ducks away.
const CP72S={growK:.35,hang:.6,peek:1.15};
Object.assign(Z72.leapHang,{big:1,hang:CP72S.hang});
const __cp72sPath=z72Path;
z72Path=function(k,aim){__cp72sPath(k,aim);if(k.id!==0||Z72.leapHang.style!=='peek')return;
 for(const g of k.segs)if(g.k==='leap'){const f0=g.f;g.f=u=>{const P=f0(u);if(typeof P.grow==='number')P.grow=1+(P.grow-1)*CP72S.growK;return P;};}};
// the peek at the kitten's own size: from its size at the end of the hang down to CP72S.peek x its size on the board
cp72PeekDraw=function(){const X=Z72X,k=X&&X.kits[0];if(!k||k.gone||!k.P||!k.P.pk)return;const P=k.P,C=CP72P;
 const g=skyScreen(P.x,P.z,0),p0=skyScreen(P.x,P.z,P.h),base=g.s*Z72.size/48,sH=base*(P.grow||1),sP=base*CP72S.peek,bottom=ctx.canvas.height/(scale*renderPixelRatio);
 const at=bottom+(33-C.eyes)*sP;let y,s,puff,pose;
 if(P.pk==='drop'){const e=z72E(P.pu);y=p0.y+(at-p0.y)*e;s=sH+(sP-sH)*e;puff=Math.max(0,1-P.pu*1.6);pose=P.pu<.5?'leap':undefined;}
 else if(P.pk==='hold'){y=at;s=sP;puff=0;}
 else{y=at+P.pu*P.pu*40*sP;s=sP;puff=0;}
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 z72Kitten(p0.x,y,s,k.coat,Math.PI,1,0,1,0,puff,0,pose);ctx.restore();};
// ---------- end CP-72 final ending ----------
