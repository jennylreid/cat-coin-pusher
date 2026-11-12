# CP-33 Prize feedback: builds release.html from UAT 24's runtime (assets/index.html == installer-fix/release.html).
# Vacuum-arc pickup into the Inventory tile, grey-sink-ripple lost prize, Developer tuning; Paw/ribbon/bubble removed.
from pathlib import Path
import json
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
s = (p / 'assets/index.html').read_text(encoding='utf-8', newline='')
base = (p.parents[0] / 'cp25/installer-fix/release.html').read_text(encoding='utf-8', newline='')
assert s == base, 'baseline must be UAT 24 runtime'
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


rep("const BUILD = '2026.10.30 UAT 24';", "const BUILD = '%s';" % v['displayName'])

# --- Pickup module: replace the three CP-25 styles (Paw pause, ribbon, satchel bubble) and the style setting.
a = s.index('// UAT presentation choices only.')
b = s.index('// Local UAT diagnostics:')
MODULE = r"""// CP-33 prize feedback. Presentation only: inventory credit and save stay in fallOff. Nothing here pauses play.
// Collected prize: a vacuum arc (quadratic Bezier, ease-in-out) into the Inventory tile, shrinking, with a few gold
// sparkles; the tile springs on arrival. Lost prize (side gutter): grey, sink and fade, with a small dark ripple.
const PICKUP_FX_KEY='catpusher.uat.pickupfx.v2'; // UAT 26: new defaults start fresh (v1 held UAT 25 tuning)
const PICKUP_FX_DEFAULTS={flight:.7,endScale:.5,arcHeight:160,arcSide:0,sparkles:10,bounce:1.2,bounceTime:.15,sink:.3};
const PICKUP_FX_LIMITS={flight:[.2,1.5,.05],endScale:[.05,1,.05],arcHeight:[30,200,10],arcSide:[-1,1,.25],sparkles:[0,16,1],bounce:[1,1.5,.05],bounceTime:[.06,.5,.01],sink:[.1,1,.05]};
const PICKUP_FX_LABELS={flight:['Flight time',' s'],endScale:['End size','x'],arcHeight:['Arc height',' px'],arcSide:['Arc side',''],sparkles:['Sparkles',''],bounce:['Bounce size','x'],bounceTime:['Bounce time',' s'],sink:['Lost sink time',' s']};
const pickupFx={...PICKUP_FX_DEFAULTS};
try{const pref=JSON.parse(localStorage.getItem(PICKUP_FX_KEY)||'null');if(pref)for(const k in PICKUP_FX_DEFAULTS){const x=+pref[k],[lo,hi]=PICKUP_FX_LIMITS[k];if(Number.isFinite(x))pickupFx[k]=Math.min(hi,Math.max(lo,x));}}catch(e){}
function savePickupFx(){try{localStorage.setItem(PICKUP_FX_KEY,JSON.stringify(pickupFx));}catch(e){}}
function stepPickupFx(k,dir){const [lo,hi,st]=PICKUP_FX_LIMITS[k];pickupFx[k]=Math.round(Math.min(hi,Math.max(lo,pickupFx[k]+dir*st))*100)/100;savePickupFx();}
function resetPickupFx(){Object.assign(pickupFx,PICKUP_FX_DEFAULTS);savePickupFx();}
function pickupFxText(k){const [label,unit]=PICKUP_FX_LABELS[k],x=pickupFx[k];if(k==='arcSide')return label+': '+(x===0?'straight up':(x<0?'left ':'right ')+Math.abs(x));return label+': '+(+x.toFixed(2))+unit;}
// Pools: flights, lost effects and sparkles are reused, so a burst allocates nothing per frame.
const treatAwards=[],flightPool=[],lostFx=[],lostPool=[],SPARKLE_CAP=24,sparkles=[];
for(let i=0;i<SPARKLE_CAP;i++)sparkles.push({on:false,x:0,y:0,t:0,life:.55,r:0});
let tileBounceT=-1,lastPickupChime=-9,pickupPreviewIndex=0;
const pickupEase=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
const PICKUP_POINT={x:0,y:0};
function pickupTarget(){const b=inventoryButton();return {x:b.x+b.w/2,y:b.y+b.h/2};}
function boardToScreen(at){return {x:200+(at.x-200)*VIEW.z,y:VIEW.y+at.y*VIEW.zy,s:at.s*VIEW.z};}
function queueTreatAward(id,x,body,preview=false){
 // Starts where the prize went over the front edge (same projection as the board drawing).
 const wx=Number.isFinite(x)?x:body&&body.rb?body.rb.translation().x/M:200,at=screenOf(Math.max(T.L+ITEM_R,Math.min(T.R-ITEM_R,wx)),T.FRONT,0);
 const sc=boardToScreen(at),tg=pickupTarget(),f=flightPool.pop()||{};
 f.id=id;f.t=0;f.x0=sc.x;f.y0=sc.y;f.s0=sc.s;f.cx=(sc.x+tg.x)/2+pickupFx.arcSide*150;f.cy=arcControlY(sc.y,tg.y,pickupFx.arcHeight);
 f.dur=pickupFx.flight;f.end=pickupFx.endScale;f.spark=Math.round(pickupFx.sparkles);f.emitted=0;f.arrived=false;f.preview=!!preview;
 treatAwards.push(f);return f;
}
// Control point whose curve peaks exactly `rise` px above the start (bisection; runs once per pickup).
function arcControlY(y0,y2,rise){const goal=y0-rise,peak=c=>{let m=1e9;for(let i=0;i<=40;i++){const u=i/40,w=1-u;m=Math.min(m,w*w*y0+2*w*u*c+u*u*y2);}return m;};let lo=goal-4*rise-400,hi=Math.min(y0,y2);for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(peak(mid)<goal)lo=mid;else hi=mid;}return (lo+hi)/2;}
function pickupPoint(f,u){const tg=pickupTarget(),w=1-u;PICKUP_POINT.x=w*w*f.x0+2*w*u*f.cx+u*u*tg.x;PICKUP_POINT.y=w*w*f.y0+2*w*u*f.cy+u*u*tg.y;return PICKUP_POINT;}
function emitSparkle(x,y){for(const k of sparkles)if(!k.on){k.on=true;k.x=x+(Math.random()-.5)*8;k.y=y+(Math.random()-.5)*8;k.t=0;k.r=5.5+Math.random()*2;return;}}
function pickupChime(){const now=performance.now();if(now-lastPickupChime<120)return;lastPickupChime=now;sfx.itemCollected();}
// Lost prize: drawn at the table edge where it crossed into the side gutter.
function queueLostPrize(b,wx,wz){
 const at=screenOf(wx<200?T.L:T.R,Math.max(GUARD_END,Math.min(T.FRONT,wz)),0),f=lostPool.pop()||{};f.id=b.id;f.x=at.x;f.y=at.y;f.s=at.s;f.t=0;f.dur=pickupFx.sink;lostFx.push(f);return f;
}
function tickTreatAwards(dt){
 if(inventoryOpen||panel.style.display==='block')return;
 for(const k of sparkles)if(k.on){k.t+=dt;if(k.t>=k.life)k.on=false;}
 if(tileBounceT>=0){tileBounceT+=dt;if(tileBounceT>=pickupFx.bounceTime)tileBounceT=-1;}
 for(let i=treatAwards.length-1;i>=0;i--){
  const f=treatAwards[i];f.t+=dt;const u=Math.min(1,f.t/f.dur+1e-6);
  while(f.emitted<f.spark&&u>=(f.emitted+.5)/f.spark){const q=pickupPoint(f,pickupEase((f.emitted+.5)/f.spark));emitSparkle(q.x,q.y);f.emitted++;}
  if(!f.arrived&&u>=1){f.arrived=true;tileBounceT=0;pickupChime();}
  if(f.arrived&&f.t>=f.dur+pickupFx.bounceTime){treatAwards.splice(i,1);flightPool.push(f);}
 }
 for(let i=lostFx.length-1;i>=0;i--){const f=lostFx[i];f.t+=dt;if(f.t>=f.dur){lostFx.splice(i,1);lostPool.push(f);}}
}
// Spring for the tile: quick rise to the set size, a slight undershoot, then rest at 1.
const TILE_SPRING_PEAK=(()=>{let m=0;for(let i=0;i<=200;i++){const u=i/200;m=Math.max(m,Math.sin(Math.PI*1.25*u)*(1-u));}return m;})();
function inventoryTileScale(){if(tileBounceT<0)return 1;const u=Math.min(1,tileBounceT/pickupFx.bounceTime);return 1+(pickupFx.bounce-1)*Math.sin(Math.PI*1.25*u)*(1-u)/TILE_SPRING_PEAK;}
function prizeCenterLift(id,s){if(id==='tuna'){const w=radius('item')*s*3.8;return .3*w*ART.tuna.height/ART.tuna.width;}return radius('item')*s*2.8*.2;}
function previewPickup(){
 panel.style.display='none';const ids=['cheese','shrimp','tuna'],xs=[200,135,265];
 queueTreatAward(ids[pickupPreviewIndex%3],xs[pickupPreviewIndex%3],null,true);pickupPreviewIndex++;
}
function previewLostPrize(){
 panel.style.display='none';const ids=['cheese','shrimp','tuna'],side=pickupPreviewIndex%2?-1:1;
 queueLostPrize({id:ids[pickupPreviewIndex%3]},side>0?T.R+20:T.L-20,600);pickupPreviewIndex++;
}
function drawStarSparkle(x,y,r){ctx.beginPath();ctx.moveTo(x,y-r*2);ctx.quadraticCurveTo(x,y,x+r*2,y);ctx.quadraticCurveTo(x,y,x,y+r*2);ctx.quadraticCurveTo(x,y,x-r*2,y);ctx.quadraticCurveTo(x,y,x,y-r*2);ctx.fill();}
function drawTreatAward(){
 if(inventoryOpen||panel.style.display==='block')return;
 let any=treatAwards.length>0;if(!any)for(const k of sparkles)if(k.on){any=true;break;}if(!any)return;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 ctx.fillStyle='#ffd76a';
 for(const k of sparkles)if(k.on){const u=k.t/k.life,a=1-u*u,r=k.r*(1-.35*u);ctx.globalAlpha=.3*a;ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.arc(k.x,k.y,r*1.5,0,7);ctx.fill();ctx.globalAlpha=a;ctx.fillStyle='#ffcf2e';ctx.strokeStyle='rgba(92,52,0,.75)';ctx.lineWidth=1.2;drawStarSparkle(k.x,k.y,r);ctx.stroke();ctx.fillStyle='#ffffff';drawStarSparkle(k.x,k.y,r*.55);}
 ctx.globalAlpha=1;
 for(const f of treatAwards){if(f.arrived)continue;const e=pickupEase(Math.min(1,f.t/f.dur)),q=pickupPoint(f,e),sc=f.s0*(1+(f.end-1)*e);drawPrize('item',f.id,q.x,q.y+prizeCenterLift(f.id,sc),sc);}
 ctx.restore();
}
// Drawn inside the board transform (same space as the falling coins).
function drawLostPrizes(){
 if(!lostFx.length)return;
 for(const f of lostFx){
  const u=Math.min(1,f.t/f.dur),e=1-Math.pow(1-u,2);
  ctx.save();ctx.globalAlpha=.42*(1-u);ctx.strokeStyle='#170e1e';ctx.fillStyle='rgba(23,14,30,.35)';ctx.lineWidth=2.2*(1-u)+.6;
  const rad=(10+e*34)*f.s;ctx.beginPath();ctx.ellipse(f.x,f.y,rad,rad*SQUASH,0,0,7);ctx.fill();ctx.stroke();ctx.restore();
  const sc=f.s*(1-e);if(sc<=.01)continue;
  ctx.save();ctx.globalAlpha=1-u;ctx.filter='grayscale(1) brightness(.85)';drawPrize('item',f.id,f.x,f.y+prizeCenterLift(f.id,sc)+e*6*f.s,sc);ctx.restore();
 }
}

"""
s = s[:a] + MODULE.replace('\n', N) + s[b:]

# Collected prizes fly from where they were collected; the old front-fall sprite for prizes is not drawn twice.
rep("if(b.kind==='item'&&['cheese','shrimp','tuna'].includes(b.id)){S.got[b.id]=(S.got[b.id]||0)+1;queueTreatAward(b.id,x);}",
    "if(b.kind==='item'&&['cheese','shrimp','tuna'].includes(b.id)){S.got[b.id]=(S.got[b.id]||0)+1;queueTreatAward(b.id,x,b);falling.pop();} // CP-33: the flight replaces the front-fall sprite")
# Lost prize: a prize that leaves by a side gutter greys and sinks where it crossed; coins keep their gutter fall.
rep(" const rotation={...b.rb.rotation()};falling.push(",
    " if(b.kind==='item'){queueLostPrize(b,x,t.z/M);removeCoin(b);reconcileBoardTargets();return;} // CP-33: grey sink + ripple" + N +
    " const rotation={...b.rb.rotation()};falling.push(")
# The later fallOff wrapper must only annotate a falling entry that this call actually added.
rep("__oldFallOff(b,x);const f=falling[falling.length-1];if(f){",
    "const before=falling.length;__oldFallOff(b,x);const f=falling.length>before?falling[falling.length-1]:null;if(f){")
rep("  for (const r of rings) {", "  drawLostPrizes();" + N + "  for (const r of rings) {")
# Tile spring on arrival; the tile's art, size and label are unchanged.
rep("function drawInventoryButton(){const b=inventoryButton();ctx.drawImage(ART.collectionsTile,b.x,b.y,b.w,b.h);",
    "function drawInventoryButton(){const b=inventoryButton(),k=inventoryTileScale();if(k!==1){ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.scale(k,k);ctx.drawImage(ART.collectionsTile,-b.w/2,-b.h/2,b.w,b.h);ctx.restore();}else ctx.drawImage(ART.collectionsTile,b.x,b.y,b.w,b.h);")

# No pickup ever pauses play or eats a touch.
rep(" if(inventoryOpen||pickupBlocksPlay())return;", " if(inventoryOpen)return;")
rep(" const pickupModal=pickupBlocksPlay();tickTreatAwards(dt);if(pickupModal){regen();return;}tickCollectionPayoff(dt);", " tickTreatAwards(dt);tickCollectionPayoff(dt);")
rep("  if(pickupBlocksPlay()){stopDrops();cancelCollectionDrag();return;}" + N, "")
rep("inventoryOpen?'inventory':pickupBlocksPlay()?'pickup-paused':board.status;", "inventoryOpen?'inventory':board.status;")
rep("const paused=inventoryOpen||pickupBlocksPlay()||panel.style.display==='block'", "const paused=inventoryOpen||panel.style.display==='block'")
rep("diagEvent('game-stopped-hold',pickupBlocksPlay()?'pickup-paused':board.status);", "diagEvent('game-stopped-hold',board.status);")
rep("Active-hold summary excludes settings, inventory, pickup pauses and non-playing states.", "Active-hold summary excludes settings, inventory and non-playing states. Pickups never pause play.")
# Tuning values travel in the performance log (top level and in the session).
rep("return JSON.stringify({format:'CatCoin UAT performance log v1',", "return JSON.stringify({format:'CatCoin UAT performance log v1',pickupTuning:{...pickupFx},pickupTuningDefaults:PICKUP_FX_DEFAULTS,")

# Settings: style setting gone; Developer mode gets previews and tuning.
old_btns = "  +'<button id=\"pickup-style\" class=\"wide\">Pickup style: '+PICKUP_NAMES[pickupChoice]+'</button><button id=\"pickup-item\" class=\"wide\">Preview item: '+PRIZE_NAMES[pickupPreviewItem]+'</button><button id=\"pickup-preview\" class=\"wide\">Preview pickup (no reward)</button>'"
new_btns = ("  +(S.dev?'<div class=\"set\" id=\"pfx\"><h3><span>Prize feedback</span><span>tuning</span></h3><button id=\"pfx-preview\" class=\"wide\">Preview pickup (no reward)</button><button id=\"pfx-lost\" class=\"wide\">Preview lost prize</button>'"
            "+Object.keys(PICKUP_FX_DEFAULTS).map(k=>'<div style=\"display:flex;align-items:center;gap:8px;margin:6px 0\"><button data-pfx=\"'+k+'\" data-dir=\"-1\" style=\"min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px\">−</button><span style=\"flex:1;text-align:center\">'+pickupFxText(k)+'</span><button data-pfx=\"'+k+'\" data-dir=\"1\" style=\"min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px\">+</button></div>').join('')"
            "+'<button id=\"pfx-reset\" class=\"wide\">Reset tuning to defaults</button></div>':'')")
rep(old_btns, new_btns)
rep(" panel.querySelector('#pickup-style').onclick=()=>{cyclePickupChoice();openCredits();};" + N +
    " panel.querySelector('#pickup-item').onclick=()=>{cyclePickupPreviewItem();openCredits();};" + N +
    " panel.querySelector('#pickup-preview').onclick=previewPickup;",
    " const pfx=panel.querySelector('#pfx');if(pfx){pfx.querySelector('#pfx-preview').onclick=previewPickup;pfx.querySelector('#pfx-lost').onclick=previewLostPrize;pfx.querySelector('#pfx-reset').onclick=()=>{resetPickupFx();diagEvent('pickup-tuning','reset');openCredits();};"
    "for(const btn of pfx.querySelectorAll('[data-pfx]'))btn.onclick=()=>{stepPickupFx(btn.dataset.pfx,+btn.dataset.dir);diagEvent('pickup-tuning',btn.dataset.pfx+'='+pickupFx[btn.dataset.pfx]);const top=panel.scrollTop;openCredits();panel.scrollTop=top;};}")

# Test hook exports.
rep("queueTreatAward, pickupBlocksPlay, pickupDuration, previewPickup, cyclePickupChoice, get pickupChoice(){return pickupChoice;}, dismissTreatAward, get treatAwards(){return treatAwards;}",
    "queueTreatAward, queueLostPrize, previewPickup, previewLostPrize, pickupFx, stepPickupFx, resetPickupFx, inventoryTileScale, pickupPoint, pickupTarget, get tileBounceT(){return tileBounceT;}, get sparkles(){return sparkles;}, get lostFx(){return lostFx;}, get treatAwards(){return treatAwards;}")

for gone in ['pickupBlocksPlay', 'PICKUP_STYLES', 'PICKUP_NAMES', 'pickupChoice', 'satchel bubble', "style==='paw'", 'pickup-paused', 'dismissTreatAward', 'pickupDuration']:
    assert gone not in s, gone
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
