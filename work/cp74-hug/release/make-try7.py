# CP-74 try 7 (Jenny, Nov 18, after UAT 106: "the paws reach forward and the arms come out from behind, as if the shoulders
# are... reaching far forward ... putting its shoulders into it"; "Fades don't work"). Rewrites the motion in cp74-hug.js:
# no elbow, no fades, nothing scales except a small shoulder lean.
from pathlib import Path
p=Path(__file__).parent/'cp74-hug.js';s=p.read_text(encoding='utf-8')
def rep(a,b):
    global s
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
def block(start,end,new):
    global s
    a=s.index(start);b=s.index(end,a);s=s[:a]+new+s[b:]
a=s.index(" IN:1.5,");b=s.index(" REST_TURN:.12,")
s=s[:a]+""" IN:1.5,     // in (try 7): the shoulders slide out from behind the head 0-0.4 s; the resting mitts travel forward and down to
             // the lower corners and each straight arm slides out from behind its shoulder under its mitt (0.1-1.5 s, eased);
             // the shoulders lean forward and down with the reach
 ON:1.5,     // the gutter walls go up once the arms are in place...
 HOLD:6,     // ...and stay 6 s (as before)
 OUT:1.5,    // let go: the reach played backwards, frame for frame (same 1.5 s)
 LEAN:{dy:14,dx:8,grow:.06}, // the shoulders' lean at full reach: 14 down, 8 out, 6% wider (the mitts never change size)
"""+s[b:]
block("function z74Env(t){","// the arm painting cut at the elbow","""function z74Env(t){const o=t-(Z74.ON+Z74.HOLD);
 const io=u=>{u=z74Clamp(u,0,1);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;}; // ease in and out: slow start, slow end
 // sh: shoulders out from behind the head (0 tucked, 1 out); reach: 0 = mitts resting beside the head, arms hidden behind the
 // shoulders; 1 = mitts in the lower corners, arms along the board's sides. Letting go = the same curves at reversed time.
 const at=x=>({sh:io(z74Seg(x,0,.4)),reach:io(z74Seg(x,.1,1.5))});
 if(o<0)return {...at(t),hold:t>=Z74.IN,arm:1};
 const r=Z74.ON-o*(Z74.ON/Z74.OUT);return {...at(r),hold:false,arm:1};}
""")
block("function z74MittPath(L,u){","// the left arm","""function z74MittPath(L,u){const x0=200-135,y0=VIEW.y+180*VIEW.zy+45,x2=200-Z74.MITT_DX,y2=L.mittY;
 return {x:x0+(x2-x0)*u,y:y0+(y2-y0)*u,dx:x2-x0,dy:y2-y0,turn:Z74.REST_TURN+(Z74.MITT_TURN-Z74.REST_TURN)*u};}
""")
block("// the left arm","// --- layout","""// the left arm (try 7): Codex's whole arm painting, straight, never bent or scaled, slid along the mitt's path so its end
// stays under the mitt: at reach 0 it sits a full path-length back, behind the shoulder; it is only drawn below the line
// through the shoulder's middle (that line is under the shoulder painting), so it comes out from behind the shoulder.
// The mitt (mitt=true) is the resting mitt travelling down its path, always fully drawn.
function z74LeftArm(L,e,ay,ys,mitt,kn){const T=z74MittPath(L,e.reach);if(mitt){z74Mitt(T.x,T.y+kn,-1,1,T.turn);return;}
 const R=Z74.REF,ah=R.armH*ys,im=z74Pre('left',R.armW,ah);if(!im)return;const back=1-e.reach;
 ctx.save();ctx.beginPath();ctx.rect(-200,L.shY-R.shUp,800,H+400);ctx.clip();
 ctx.drawImage(im,R.armX-T.dx*back,ay-T.dy*back,R.armW,ah);ctx.restore();}
""")
block(" // each arm unfolds: the upper arm swings in about the shoulder"," ctx.restore();\n // the board's own rim again",""" // each arm slides out from behind its shoulder (whole painting, straight); then the shoulders, leaning into the reach
 for(const s of [-1,1]){ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}z74LeftArm(L,e,ay,ys,false,0);ctx.restore();}
 const sh=z74Pre('shoulder',R.shW,R.shH),k=e.sh,ln=e.reach,Ln=Z74.LEAN;
 // tucked (k=0) the shoulder sits 60 in and 40 up, behind the head; it slides out (no fade, no pop), then leans with the reach
 if(sh&&k>0)for(const s of [-1,1]){ctx.save();ctx.translate((s<0?R.shX:400-R.shX)-s*(1-k)*60+s*Ln.dx*ln,L.shY-R.shUp-(1-k)*40+Ln.dy*ln);if(s>0)ctx.scale(-1,1);
  const q=1+Ln.grow*ln;ctx.scale(q,q);ctx.drawImage(sh,-R.shW/2,-R.shH/2,R.shW,R.shH);ctx.restore();}
""")
s=s.replace("// - (UAT 104f) The resting mitts travel down from beside the head to the lower corners while each arm unfolds as in try 4,\n//   and at the end they travel back up while the arm folds away (upper arm first).",
"// - (try 7, after UAT 106) No elbow, no fades: the resting mitts travel forward and down to the lower corners at constant\n//   size, each straight painted arm slides out from behind its shoulder under its mitt, and the shoulders lean forward into\n//   the reach; letting go is the same played backwards. (UAT 106 = try 6: the arms unfolded at an elbow.)")
p.write_text(s,encoding='utf-8');print('try 7 written')
