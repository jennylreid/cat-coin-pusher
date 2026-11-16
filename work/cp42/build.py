# UAT 42: builds release.html from published UAT 41 (work/cp41/release.html, pinned by hash).
# CP-33 Pop, Jenny's Nov 12 change: prizes and rain coins pop to 30% of the screen width (visible art), each near where it
# went over the ledge with a small random offset, a tilt up to 15 degrees and its own height, never stacked on another;
# the striped panel is replaced by a small soft shadow. Dials and the Pop / Current toggle stay. Quake coin unchanged.
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
s = (p.parent / 'cp41/release.html').read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == '9b26bfc810f8c413cd0180d7c122ca0300f48a23adaa3d19bacee4ee50e26d15', 'baseline must be UAT 41'
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


rep("const BUILD = '2026.11.12 UAT 41';", "const BUILD = '%s';" % v['displayName'])
# Dials: Pop peak default 30% (range 15-120%). Saved settings move to v7; the Pop peak and style start at the new default
# once (so a phone that saved 100% or Current sees the new Pop); every other saved dial is kept.
rep("popStyle:1,popPeak:1,popHold:.25,popShrink:.45};", "popStyle:1,popPeak:.3,popHold:.25,popShrink:.45};")
rep("popPeak:[.4,1.2,.05]", "popPeak:[.15,1.2,.05]")
rep("const PICKUP_FX_KEY='catpusher.uat.pickupfx.v6',PICKUP_FX_OLD_KEY='catpusher.uat.pickupfx.v5',PICKUP_FX_NEW_DEFAULTS=['held'];",
    "const PICKUP_FX_KEY='catpusher.uat.pickupfx.v7',PICKUP_FX_OLD_KEY='catpusher.uat.pickupfx.v6',PICKUP_FX_NEW_DEFAULTS=['popPeak','popStyle']; // UAT 42")
# The flight: scattered spot instead of the middle.
rep("""  f.tr=POP_RISE;f.tm=pickupFx.popHold*k;f.td=pickupFx.popShrink;f.rot=0;f.spinIn=0;f.mx=c.x;f.my=c.y;f.ms=pickupFx.popPeak*SCREEN_W/prizeWidth(id,1);
  const tg=pickupTarget();f.cx=(f.mx+tg.x)/2;f.cy=f.my+40;f.turns=pickupFx.spin;}""".replace('\n', N),
    """  f.tr=POP_RISE;f.tm=pickupFx.popHold*k;f.td=pickupFx.popShrink;f.spinIn=0;f.ms=pickupFx.popPeak*SCREEN_W/prizeWidth(id,1);popSpot(f,id);
  const tg=pickupTarget();f.cx=(f.mx+tg.x)/2;f.cy=f.my+40;f.turns=pickupFx.spin*(f.rot<0?-1:1);}""".replace('\n', N))
rep("""function popPoint(f,t,P){
 if(t<f.tr){const u=Math.min(1,t/f.tr),e=easeOut(u);quadPoint(f.x0,f.y0,f.x0,f.my,f.mx,f.my,e,P);P.s=f.s0+(f.ms-f.s0)*easeOutSoft(u);return P;}
 const lv=f.tr+f.tm+f.ts;if(t<lv){P.x=f.mx;P.y=f.my;P.s=f.ms;return P;}
 const u=Math.min(1,(t-lv)/f.td),tg=pickupTarget(),e=easeIn(u)*.4+pickupEase(u)*.6;quadPoint(f.mx,f.my,f.cx,f.cy,tg.x,tg.y,e,P);
 P.s=f.ms+(f.es-f.ms)*(1-Math.pow(1-u,3));P.rot=2*Math.PI*f.turns*e;return P;
}""".replace('\n', N),
    """function popPoint(f,t,P){
 if(t<f.tr){const u=Math.min(1,t/f.tr),e=easeOut(u);quadPoint(f.x0,f.y0,f.x0,f.my,f.mx,f.my,e,P);P.s=f.s0+(f.ms-f.s0)*easeOutSoft(u);P.rot=f.rot*e;return P;}
 const lv=f.tr+f.tm+f.ts;if(t<lv){P.x=f.mx;P.y=f.my;P.s=f.ms;P.rot=f.rot;return P;}
 const u=Math.min(1,(t-lv)/f.td),tg=pickupTarget(),e=easeIn(u)*.4+pickupEase(u)*.6;quadPoint(f.mx,f.my,f.cx,f.cy,tg.x,tg.y,e,P);
 P.s=f.ms+(f.es-f.ms)*(1-Math.pow(1-u,3));P.rot=f.rot*(1-e)+2*Math.PI*f.turns*e;return P;
}
// UAT 42: where a Pop peaks. Near where it went over the ledge: x within POP_JITTER of it, POP_UP units up the screen, a tilt
// of 4-15 degrees either way, kept POP_MARGIN inside the screen and below POP_TOP. With other Pop pickups on screen
// (taking turns or overlapping) it tries up to 8 spots, widening the search, and keeps the one farthest from them.
// Its own random stream, so the board's physics draws the same numbers as before.
const POP_JITTER=28,POP_UP=[150,240],POP_MARGIN=10,POP_TOP=96,POP_TILT=15;
let popSeed=0x2f6b4e1d;
function popRand(){popSeed^=popSeed<<13;popSeed^=popSeed>>>17;popSeed^=popSeed<<5;return (popSeed>>>0)/4294967296;}
function popSpot(f,id){
 const w=pickupFx.popPeak*SCREEN_W,others=treatAwards.filter(o=>o.pop&&!o.arrived);let best=null,bs=-1;
 for(let i=0;i<8;i++){
  const wide=1+i*.7,rot=(popRand()<.5?-1:1)*(4+(POP_TILT-4)*popRand())*DEG,ph=panelHalf(id,w,rot,0);
  const hw=Math.min(ph[0],SCREEN_W/2-POP_MARGIN),hh=Math.min(ph[1],(H-POP_TOP)/2-POP_MARGIN);
  const x=Math.max(POP_MARGIN+hw,Math.min(SCREEN_W-POP_MARGIN-hw,f.x0+(popRand()*2-1)*POP_JITTER*wide));
  const y=Math.max(POP_TOP+hh,Math.min(H-POP_MARGIN-hh,f.y0-(POP_UP[0]+popRand()*(POP_UP[1]-POP_UP[0]))*Math.min(1.6,.85+i*.12)));
  let d=1e9;for(const o of others)d=Math.min(d,Math.hypot(x-o.mx,y-o.my));const sc=Math.min(d,w*1.15);
  if(sc>bs){bs=sc;best={x,y,rot};}if(!others.length||sc>=w*1.15)break;
 }
 f.mx=best.x;f.my=best.y;f.rot=best.rot;f.px=f.mx;f.py=f.my;
}
// A small soft shadow under a Pop pickup instead of the striped panel (cached radial gradient).
let POP_SHADOW=null;
function popShadow(){if(POP_SHADOW)return POP_SHADOW;const n=64,cv=document.createElement('canvas');cv.width=cv.height=n;const g=cv.getContext('2d'),gr=g.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);
 gr.addColorStop(0,'rgba(10,4,20,.75)');gr.addColorStop(.5,'rgba(10,4,20,.45)');gr.addColorStop(1,'rgba(10,4,20,0)');g.fillStyle=gr;g.fillRect(0,0,n,n);POP_SHADOW=cv;return cv;}
function drawPopShadow(f,q){if(q.s<=0)return;const w=prizeWidth(f.id,q.s),h=w*(PRIZE_ASPECT[f.id]||1),a=Math.min(1,q.s/f.ms);
 ctx.globalAlpha=a;ctx.drawImage(popShadow(),q.x-w*.6+w*.04,q.y-h*.45+w*.16,w*1.2,h*1.1);ctx.globalAlpha=1;}""".replace('\n', N))
# No panel in Pop: popPanel now turns it off (a Quake coin or Current pickup still gets its panel).
rep("""function popPanel(f){const q=pickupPoint(f),w=prizeWidth(f.id,q.s),ph=panelHalf(f.id,w,0,pickupFx.panelPad*Math.min(1,q.s/f.ms));
 const hw=Math.min(ph[0],SCREEN_W/2),hh=Math.min(ph[1],H/2);PANEL.on=true;PANEL.w=2*hw;PANEL.h=2*hh;
 PANEL.x=Math.max(hw,Math.min(SCREEN_W-hw,q.x));PANEL.y=Math.max(hh,Math.min(H-hh,q.y));}""".replace('\n', N),
    "function popPanel(f){PANEL.on=false;} // UAT 42: no striped panel for Pop; a soft shadow is drawn with the prize")
rep("""function drawFlight(f){
 const q=pickupPoint(f);""".replace('\n', N), """function drawFlight(f){
 const q=pickupPoint(f);if(f.pop&&f.t>=0)drawPopShadow(f,q);""".replace('\n', N))
rep("PICKUP_FX_ORDER, popPoint, POP_RISE, ", "PICKUP_FX_ORDER, popPoint, POP_RISE, popSpot, ")
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
