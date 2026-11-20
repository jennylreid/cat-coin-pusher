# CP-74 try 7, fix 2 (close-up): the shoulder painting's soft lower edge needs the arm beneath it, or it shows as a grey haze
# over the sky. So the arm's starting place is just under the shoulder (its end at the shoulder's lower edge), it slides out
# from behind the head together with the shoulder, and during the reach it slides the rest of the way (70% of the paw's travel,
# so the paw leads and the arm ends under it). The arm is only drawn below a line through the shoulder's middle (moving with
# the shoulder), which the shoulder painting covers.
from pathlib import Path
p=Path(__file__).parent/'cp74-hug.js';s=p.read_text(encoding='utf-8')
def block(start,end,new):
    global s
    a=s.index(start);b=s.index(end,a);s=s[:a]+new+s[b:]
block("// the left arm (try 7)","// --- layout","""// the left arm (try 7): Codex's whole arm painting, straight, never bent or scaled. It slides along the paw's path: at reach 0
// its end sits just under the shoulder's lower edge (so the shoulder's soft edge always has fur beneath it), at reach 1 it is in
// place along the board's side under the paw. It moves with the shoulder (z74ShoulderAt) and is only drawn below the line
// through the shoulder's middle, which the shoulder painting covers. The mitt (mitt=true) is the resting mitt travelling.
function z74ShoulderAt(L,e){const R=Z74.REF,k=e.sh,ln=e.reach,Ln=Z74.LEAN; // the left shoulder's centre offset from its place
 return {x:(1-k)*60-Ln.dx*ln,y:-(1-k)*40+Ln.dy*ln,cx:R.shX,cy:L.shY-R.shUp};}
function z74LeftArm(L,e,ay,ys,mitt,kn){const T=z74MittPath(L,e.reach);if(mitt){z74Mitt(T.x,T.y+kn,-1,1,T.turn);return;}
 const R=Z74.REF,ah=R.armH*ys,im=z74Pre('left',R.armW,ah);if(!im)return;const S=z74ShoulderAt(L,e);
 const f=Math.max(0,(ay+ah-(S.cy+R.shH/2))/T.dy),back=(1-e.reach)*f; // arm travel as a part of the paw's
 const ox=-T.dx*back+S.x*(1-e.reach),oy=-T.dy*back+S.y*(1-e.reach);
 ctx.save();ctx.beginPath();ctx.rect(-200,S.cy+S.y,800,H+400);ctx.clip();
 ctx.drawImage(im,R.armX+ox,ay+oy,R.armW,ah);ctx.restore();}
""")
block(" const sh=z74Pre('shoulder',R.shW,R.shH),k=e.sh,ln=e.reach,Ln=Z74.LEAN;"," ctx.restore();\n // the board's own rim again",""" const sh=z74Pre('shoulder',R.shW,R.shH),k=e.sh,ln=e.reach,Ln=Z74.LEAN,S=z74ShoulderAt(L,e);
 // tucked (k=0) the shoulder sits 60 in and 40 up, behind the head; it slides out (no fade, no pop), then leans with the reach
 if(sh&&k>0)for(const s of [-1,1]){ctx.save();ctx.translate(s<0?S.cx+S.x:400-S.cx-S.x,S.cy+S.y);if(s>0)ctx.scale(-1,1);
  const q=1+Ln.grow*ln;ctx.scale(q,q);ctx.drawImage(sh,-R.shW/2,-R.shH/2,R.shW,R.shH);ctx.restore();}
""")
p.write_text(s,encoding='utf-8');print('try 7 fix 2 written')
