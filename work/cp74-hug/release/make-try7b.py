# CP-74 try 7, fix 1 (found in the frame-by-frame close-up): the travelling mitt starts exactly where and how the resting
# mitt is drawn on the board (mittRest(side), turn MITT_TURN=0 plus its tiny wobble), and in the same pass (above the coins)
# until it is fully below the front lip; then it is drawn under the coins (only falling pieces are there).
from pathlib import Path
p=Path(__file__).parent/'cp74-hug.js';s=p.read_text(encoding='utf-8')
def rep(a,b):
    global s
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
def block(start,end,new):
    global s
    a=s.index(start);b=s.index(end,a);s=s[:a]+new+s[b:]
rep(" REST_TURN:.12, // the resting mitt's turn (drawPaws, rest pose) - where each mitt starts and ends\n","")
block("function z74MittPath(L,u){","// the left arm","""// the left mitt's path at reach u: from exactly where the board's resting mitt is drawn (drawPaws: mittRest(side), turned by
// MITT_TURN plus its tiny wobble) in a straight line to its place in the lower corner, turning to 40 degrees; same size throughout
function z74MittPath(L,u){const m=mittRest(-1),x0=m.x,y0=m.y,x2=200-Z74.MITT_DX,y2=L.mittY,t0=-(MITT_TURN+Math.sin(time*1.7)*.018);
 return {x:x0+(x2-x0)*u,y:y0+(y2-y0)*u,dx:x2-x0,dy:y2-y0,turn:t0+(Z74.MITT_TURN-t0)*u};}
// where each mitt is drawn this frame: 'paws' (the resting mitts' own pass, above the coins) while any of it may be over the
// board, 'layer' (with the arms, under the coins) once it is wholly below the front lip
function z74MittPass(L,e){const T=z74MittPath(L,e.reach);return T.y-70<L.lip?'paws':'layer';}
function z74DrawMitts(){const X=PGPX,e=z74Env(X.t),L=Z74.L||z74Layout(),r=z74RimPts(),R=Z74.REF;if(!r)return;
 const ys=(r.left[r.left.length-1].y-r.left[0].y)/(R.rimBot-R.rimTop),ay=r.left[0].y+(R.armTop-R.rimTop)*ys;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 for(const s of [-1,1]){const kn=e.hold?3*Math.sin(X.t*Math.PI*2*1.3+(s>0?Math.PI:0)):0;ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}z74LeftArm(L,e,ay,ys,true,kn);ctx.restore();}
 ctx.restore();}
""")
block(" // mitts: the resting mitts themselves"," ctx.restore();}\n// drawn right after the machine",""" // mitts: drawn here (under the coins) once they are below the lip, or if the resting mitts' pass did not run last frame
 const hidden=sweepTime>0||catquakeTime>0;
 if(!hidden&&(z74MittPass(L,e)==='layer'||Z74.pawsF<Z74.f-1)){ctx.restore();z74DrawMitts();return;}
""")
rep("const __z74Paws=drawPaws;drawPaws=function(){if(!z74On()||sweepTime>0||catquakeTime>0)return __z74Paws();}; // during the hug the resting mitts are drawn travelling (z74DrawLayer)",
"""// during the hug the resting mitts are drawn travelling: here, in their own pass above the coins, while over the board
const __z74Paws=drawPaws;drawPaws=function(){if(!z74On()||sweepTime>0||catquakeTime>0)return __z74Paws();
 Z74.pawsF=Z74.f;try{const L=Z74.L||z74Layout();if(z74MittPass(L,z74Env(PGPX.t))==='paws')z74DrawMitts();}catch(e){Z74.err=String(e);}};""")
rep("f:0,drawnF:-1,","f:0,drawnF:-1,pawsF:-9,")
p.write_text(s,encoding='utf-8');print('try 7 fix 1 written')
