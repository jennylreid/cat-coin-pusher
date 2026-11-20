# CP-74 try 7, fix 3 (close-up): the arm's painted end is a flat cut, so it must stay under the paw; and the shoulder's soft lower
# edge must never show without fur beneath. Rule: everything below the paw is revealed by the paw. The arm slides the paw's full
# path (its end always under the paw); each shoulder is drawn only down to 40 units below its paw's centre (the paw covers that line).
from pathlib import Path
p=Path(__file__).parent/'cp74-hug.js';s=p.read_text(encoding='utf-8')
def rep(a,b):
    global s
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
rep(""" const f=Math.max(0,(ay+ah-(S.cy+R.shH/2))/T.dy),back=(1-e.reach)*f; // arm travel as a part of the paw's
 const ox=-T.dx*back+S.x*(1-e.reach),oy=-T.dy*back+S.y*(1-e.reach);""",
""" const back=1-e.reach,ox=-T.dx*back,oy=-T.dy*back; // the arm slides the paw's whole path: its end stays under the paw""")
rep(""" if(sh&&k>0)for(const s of [-1,1]){ctx.save();ctx.translate(s<0?S.cx+S.x:400-S.cx-S.x,S.cy+S.y);""",
""" // drawn only down to 40 below the paw's centre (under the paw), so its soft lower edge always has the arm beneath it
 const Tp=z74MittPath(L,e.reach);
 if(sh&&k>0)for(const s of [-1,1]){ctx.save();ctx.beginPath();ctx.rect(-200,-200,800,Tp.y+40+200);ctx.clip();ctx.translate(s<0?S.cx+S.x:400-S.cx-S.x,S.cy+S.y);""")
s=s.replace("// the left arm (try 7): Codex's whole arm painting, straight, never bent or scaled. It slides along the paw's path: at reach 0\n// its end sits just under the shoulder's lower edge (so the shoulder's soft edge always has fur beneath it), at reach 1 it is in\n// place along the board's side under the paw.",
"// the left arm (try 7): Codex's whole arm painting, straight, never bent or scaled. It slides along the paw's whole path, its\n// end always under the paw; at reach 1 it is in place along the board's side.")
p.write_text(s,encoding='utf-8');print('try 7 fix 3 written')
