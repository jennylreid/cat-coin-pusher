# CP-74 try 9 (Jenny on try 8: "the paws look like they're dropping the way a yo-yo drops on a string. It just doesn't look like
# a cat is reaching down."). Motion only, from cp74-hug-try8.js -> cp74-hug-try9.js (cp74-hug.js stays try 8 for UAT 110):
# - the shoulders lead (0-0.4 s), the paws start a beat later;
# - anticipation: each paw lifts slightly up and back (0.2-0.45 s) before it goes;
# - an arc: forward toward the player and down along a curve, out then in, the paw's turn changing gradually along it;
# - ease-out: fast at the start, slowing into place (0.4-1.3 s), then a small press as it plants (1.3-1.5 s);
# - letting go is the same played backwards. Try 8's rules kept (solid arm revealed behind the paw to the wrist, paws behind the
#   coins, constant size, no fades).
from pathlib import Path
P=Path(__file__).parent;s=(P/'cp74-hug-try8.js').read_text(encoding='utf-8')
def rep(a,b):
    global s
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
rep(" const at=x=>({sh:io(z74Seg(x,0,.4)),fore:io(z74Seg(x,.1,1.4)),upper:io(z74Seg(x,.15,1.5)),reach:io(z74Seg(x,.1,1.5))});",
""" // try 9: the shoulders lead; each paw lifts (anticipation), reaches along an arc with ease-out, then presses as it plants
 const out=u=>1-Math.pow(1-z74Clamp(u,0,1),3),bump=u=>{u=z74Clamp(u,0,1);return Math.sin(Math.PI*u);};
 const at=x=>({sh:io(z74Seg(x,0,.4)),reach:out(z74Seg(x,.4,1.3)),
  lift:bump(z74Seg(x,.2,.6))*(1-z74Seg(x,.4,.6)*.5), // up and back before it goes, gone once the reach is under way
  press:bump(z74Seg(x,1.3,1.5))});""") if " const at=x=>({sh:io(z74Seg(x,0,.4)),fore:" in s else rep(
" const at=x=>({sh:io(z74Seg(x,0,.4)),reach:io(z74Seg(x,.1,1.5))});",
""" // try 9: the shoulders lead; each paw lifts (anticipation), reaches along an arc with ease-out, then presses as it plants
 const out=u=>1-Math.pow(1-z74Clamp(u,0,1),3),bump=u=>{u=z74Clamp(u,0,1);return Math.sin(Math.PI*u);};
 const at=x=>({sh:io(z74Seg(x,0,.4)),reach:out(z74Seg(x,.4,1.3)),
  lift:bump(z74Seg(x,.2,.6))*(1-z74Seg(x,.4,.6)*.5), // up and back before it goes, eased away once the reach is under way
  press:bump(z74Seg(x,1.3,1.5))});""")
# the path: a curve out (toward the screen edge) then in, plus the lift (up 14, back 6 towards the head) and the press (down 5)
a=s.index("function z74MittPath(L,u){");b=s.index("\n",s.index("return {",a))
s=s[:a]+"""function z74MittPath(L,u,e){const m=mittRest(-1),x0=m.x,y0=m.y,x2=200-Z74.MITT_DX,y2=L.mittY,t0=-(MITT_TURN+Math.sin(time*1.7)*.018);
 const cx=Math.max(4,Math.min(x0,x2)-34),cy=y0+(y2-y0)*.45,a=1-u; // control point: out to the side, part-way down (an arc toward the player)
 let x=a*a*x0+2*a*u*cx+u*u*x2,y=a*a*y0+2*a*u*cy+u*u*y2;
 const lf=e&&e.lift||0,pr=e&&e.press||0;x+=6*lf;y+=-14*lf+5*pr; // lift: up and back towards the head; press: down as it plants
 const tw=u*u*(3-2*u);return {x,y,ox:x-x2,oy:y-y2,turn:t0+(Z74.MITT_TURN-t0)*tw};}"""+s[b:]
rep("const T=z74MittPath(L,e.reach);if(mitt)","const T=z74MittPath(L,e.reach,e);if(mitt)")
rep("Tp=z74MittPath(L,e.reach),","Tp=z74MittPath(L,e.reach,e),")
s=s.replace("// - (try 8)","// - (try 9) The shoulders lead; each paw lifts slightly, reaches along an arc with ease-out and presses as it plants.\n// - (try 8)",1)
(P/'cp74-hug-try9.js').write_text(s,encoding='utf-8');print('try 9 written to cp74-hug-try9.js')
