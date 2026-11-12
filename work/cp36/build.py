# UAT 36: builds release.html from published UAT 35 (work/cp35/release.html, pinned by hash).
# 1. CP-35 win/lose card: smaller and lower, below the cat's paws, so the dancing cat stays in view.
# 2. CP-33 pickup style "Pop": the prize pops to fill the screen (visible art) in 0.2 s, holds briefly, then shrinks and
#    spins into the bag. Developer dials for Pop peak size, Time at peak and Shrink time; Pickup style Pop / Current.
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
s = (p.parent / 'cp35/release.html').read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == '2bc91d5d03961646f13e4820b5c25b360e83cc5aae53c4fc55144c1ae1f5b26a', 'baseline must be UAT 35'
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


rep("const BUILD = '2026.11.11 UAT 35';", "const BUILD = '%s';" % v['displayName'])

# ---------- 1. Wild end card ----------
# The cat and its dancing paws reach y ~432 (game units, measured over a full dance); the card starts below at 446.
# The big word now sits on the card's top instead of over the cat's face.
rep("function wildEndRects(){const cy=H*.5;return {card:{x:30,y:cy-120,w:340,h:270},again:{x:70,y:cy+16,w:260,h:52},back:{x:110,y:cy+110,w:180,h:30}};}",
    "function wildEndRects(){const y=WILD_END_TOP;return {card:{x:30,y,w:340,h:262},again:{x:70,y:y+172,w:260,h:46},back:{x:110,y:y+226,w:180,h:28}};}" + N +
    "const WILD_END_TOP=446; // UAT 36: below the cat's paws (lowest claw ~432 during the dance)")
word_old = ("  ctx.save();ctx.translate(200,H*.5-170);const k=WILD.endT<.35?.4+.9*u:1.15-.15*Math.min(1,(WILD.endT-.35)/.25)+.03*Math.sin(WILD.endT*6);ctx.scale(k,k);ctx.rotate(-.06);" + N +
            "  if(WILD.win)wildText('YOU WIN!',0,0,62,'#ffd23f','#3a1a00',10);else wildText(WILD.reason==='coins'?'OUT OF COINS!':\"TIME'S UP!\",0,0,WILD.reason==='coins'?48:58,'#ff6a4a','#2a0010',10);ctx.restore();" + N)
word_new = ("  ctx.save();ctx.translate(200,R.card.y+33);const k=WILD.endT<.35?.4+.9*u:1.15-.15*Math.min(1,(WILD.endT-.35)/.25)+.03*Math.sin(WILD.endT*6);ctx.scale(k,k);ctx.rotate(-.04);" + N +
            "  if(WILD.win)wildText('YOU WIN!',0,0,50,'#ffd23f','#3a1a00',9);else wildText(WILD.reason==='coins'?'OUT OF COINS!':\"TIME'S UP!\",0,0,WILD.reason==='coins'?38:46,'#ff6a4a','#2a0010',9);ctx.restore();" + N)
rep(word_old, "  // the card first (after a short beat), then the big word on its top edge" + N)
rep("ctx.fillText('Back to the game',200,R.back.y+R.back.h/2);ctx.restore();}" + N + " }",
    "ctx.fillText('Back to the game',200,R.back.y+R.back.h/2);ctx.restore();}" + N + word_new + " }")
rep("ctx.fillText(WILD.got+' of '+WILD_GOAL+' prizes',200,R.card.y+26);WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*38,R.card.y+40,30,!!WILD.have[id]));",
    "ctx.fillText(WILD.got+' of '+WILD_GOAL+' prizes',200,R.card.y+88);WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*38,R.card.y+100,28,!!WILD.have[id]));")
rep("'The timer ran out. One more go?'),200,R.card.y+92);", "'The timer ran out. One more go?'),200,R.card.y+142);")
rep("bonus drops',200,R.card.y+114);", "bonus drops',200,R.card.y+160);")
rep("wildButtonDraw(R.again,'PLAY AGAIN','#ffd23f','#3a1a00',26);", "wildButtonDraw(R.again,'PLAY AGAIN','#ffd23f','#3a1a00',24);")

# ---------- 2. Pickup style "Pop" ----------
rep("bounce:1.2,bounceTime:.15,quakeFlight:.8,sink:.3,volume:1};",
    "bounce:1.2,bounceTime:.15,quakeFlight:.8,sink:.3,volume:1,popStyle:1,popPeak:1,popHold:.25,popShrink:.45};")
rep("quakeFlight:[.3,1.5,.05],sink:[.1,1,.05],volume:[0,1.5,.1]};",
    "quakeFlight:[.3,1.5,.05],sink:[.1,1,.05],volume:[0,1.5,.1],popStyle:[0,1,1],popPeak:[.4,1.2,.05],popHold:[0,1.5,.05],popShrink:[.15,1.2,.05]};")
rep("sink:['Lost sink time',' s'],volume:['Pickup volume','%']};",
    "sink:['Lost sink time',' s'],volume:['Pickup volume','%'],popStyle:['Pickup style',''],popPeak:['Pop peak size','% of screen width'],popHold:['Pop time at peak',' s'],popShrink:['Pop shrink time',' s']};")
rep("if(k==='volume')return label+': '+(x===0?'off':Math.round(x*100)+unit);",
    "if(k==='volume')return label+': '+(x===0?'off':Math.round(x*100)+unit);if(k==='popStyle')return label+': '+(x?'Pop':'Current (UAT 34)');if(k==='popPeak')return label+': '+Math.round(x*100)+unit;")
# Settings: the style toggle is one wide button at the top of Prize feedback; the Pop dials follow it.
rep("<button id=\"pfx-lost\" class=\"wide\">Preview lost prize</button>'+Object.keys(PICKUP_FX_DEFAULTS).map(",
    "<button id=\"pfx-lost\" class=\"wide\">Preview lost prize</button><button id=\"pfx-style\" class=\"wide\">'+pickupFxText('popStyle')+' (tap to switch)</button>'+PICKUP_FX_ORDER.filter(k=>k!=='popStyle').map(")
rep("pfx.querySelector('#pfx-quake').onclick=previewQuakePickup;",
    "pfx.querySelector('#pfx-quake').onclick=previewQuakePickup;pfx.querySelector('#pfx-style').onclick=()=>{pickupFx.popStyle=pickupFx.popStyle?0:1;savePickupFx();diagEvent('pickup-tuning','popStyle='+pickupFx.popStyle);const top=panel.scrollTop;openCredits();panel.scrollTop=top;};")
rep("const pickupFx={...PICKUP_FX_DEFAULTS};",
    "const pickupFx={...PICKUP_FX_DEFAULTS};" + N +
    "const PICKUP_FX_ORDER=['popStyle','popPeak','popHold','popShrink',...Object.keys(PICKUP_FX_DEFAULTS).filter(k=>!/^pop/.test(k))];")
# Rain coins: their visible disc is 95% of the drawn box (was counted as 100%), so "fills the screen" is measured on the art.
rep("for(const k in RAIN){EDGE[k]=RAIN[k].edge;PRIZE_OPAQUE[k]=1;PRIZE_ASPECT[k]=1;}",
    "for(const k in RAIN){EDGE[k]=RAIN[k].edge;PRIZE_OPAQUE[k]=.95;PRIZE_ASPECT[k]=1;}")
# The flight: Pop replaces the rise, hold and path of prizes and rain coins. The Quake coin keeps its own flight.
rep(" else{const tg=pickupTarget();f.es=sc.s*pickupFx.endScale;f.turns=pickupFx.spin;f.cx=(f.mx+tg.x)/2;f.cy=f.my+20;}" + N + " treatAwards.push(f);return f;",
    " else{const tg=pickupTarget();f.es=sc.s*pickupFx.endScale;f.turns=pickupFx.spin;f.cx=(f.mx+tg.x)/2;f.cy=f.my+20;}" + N +
    " f.pop=!quake&&pickupFx.popStyle>0;" + N +
    " if(f.pop){ // UAT 36 Pop: straight to the middle, visible art fills Pop peak size of the screen width, no turn or offset" + N +
    "  f.tr=POP_RISE;f.tm=pickupFx.popHold*k;f.td=pickupFx.popShrink;f.rot=0;f.spinIn=0;f.mx=c.x;f.my=c.y;f.ms=pickupFx.popPeak*SCREEN_W/prizeWidth(id,1);" + N +
    "  const tg=pickupTarget();f.cx=(f.mx+tg.x)/2;f.cy=f.my+40;f.turns=pickupFx.spin;}" + N +
    " treatAwards.push(f);return f;")
rep(" if(t<0){P.x=f.x0;P.y=f.y0-Math.abs(Math.sin(t*5))*4;P.s=f.s0;return P;} // waiting its turn" + N,
    " if(t<0){P.x=f.x0;P.y=f.y0-Math.abs(Math.sin(t*5))*4;P.s=f.s0;return P;} // waiting its turn" + N +
    " if(f.pop)return popPoint(f,t,P);" + N)
rep("// Backdrop level 0..1: up while any pickup is rising,",
    "// UAT 36 Pop: up from the ledge to full size in POP_RISE (a small overshoot), held, then it shrinks (most of the size goes" + N +
    "// early) and spins flat (Spin dial: whole turns) as it swoops down into the bag." + N +
    "const POP_RISE=.2;" + N +
    "function popPoint(f,t,P){" + N +
    " if(t<f.tr){const u=Math.min(1,t/f.tr),e=easeOut(u);quadPoint(f.x0,f.y0,f.x0,f.my,f.mx,f.my,e,P);P.s=f.s0+(f.ms-f.s0)*easeOutSoft(u);return P;}" + N +
    " const lv=f.tr+f.tm+f.ts;if(t<lv){P.x=f.mx;P.y=f.my;P.s=f.ms;return P;}" + N +
    " const u=Math.min(1,(t-lv)/f.td),tg=pickupTarget(),e=easeIn(u)*.4+pickupEase(u)*.6;quadPoint(f.mx,f.my,f.cx,f.cy,tg.x,tg.y,e,P);" + N +
    " P.s=f.ms+(f.es-f.ms)*(1-Math.pow(1-u,3));P.rot=2*Math.PI*f.turns*e;return P;" + N +
    "}" + N +
    "// The striped panel grows and shrinks with a Pop pickup: around its visible art plus padding, inside the screen." + N +
    "function popPanel(f){const q=pickupPoint(f),w=prizeWidth(f.id,q.s),ph=panelHalf(f.id,w,0,pickupFx.panelPad*Math.min(1,q.s/f.ms));" + N +
    " const hw=Math.min(ph[0],SCREEN_W/2),hh=Math.min(ph[1],H/2);PANEL.on=true;PANEL.w=2*hw;PANEL.h=2*hh;" + N +
    " PANEL.x=Math.max(hw,Math.min(SCREEN_W-hw,q.x));PANEL.y=Math.max(hh,Math.min(H-hh,q.y));}" + N +
    "// Backdrop level 0..1: up while any pickup is rising,")
rep("function tickPanel(dt){const f=panelTarget();if(!f){if(backdropLevel()<=0)PANEL.on=false;return;}" + N,
    "function tickPanel(dt){const f=panelTarget();if(!f){if(backdropLevel()<=0)PANEL.on=false;return;}" + N +
    " if(f.pop){popPanel(f);return;}" + N)
rep("PICKUP_FX_DEFAULTS, sfx, ", "PICKUP_FX_DEFAULTS, PICKUP_FX_ORDER, popPoint, POP_RISE, sfx, ")
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
