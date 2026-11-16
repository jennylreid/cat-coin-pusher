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
MODULE = (p / 'module33.js').read_text(encoding='utf-8')  # UAT 33: spin in/out, pickup sounds, Time held 0.7 s
s = s[:a] + MODULE.replace('\n', N) + s[b:]
# UAT 33: three generated pickup sounds inside sfx (same tone/noise/bell helpers as the other sounds).
rep('    fanfare() {', (p / 'pickup-sounds.js').read_text(encoding='utf-8').replace('\n', N) + '    fanfare() {')

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
new_btns = ("  +(S.dev?'<div class=\"set\" id=\"pfx\"><h3><span>Prize feedback</span><span>tuning</span></h3><button id=\"pfx-preview\" class=\"wide\">Preview pickup (no reward)</button><button id=\"pfx-quake\" class=\"wide\">Preview Quake pickup (no reward)</button><button id=\"pfx-lost\" class=\"wide\">Preview lost prize</button>'"
            "+Object.keys(PICKUP_FX_DEFAULTS).map(k=>'<div style=\"display:flex;align-items:center;gap:8px;margin:6px 0\"><button data-pfx=\"'+k+'\" data-dir=\"-1\" style=\"min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px\">−</button><span style=\"flex:1;text-align:center\">'+pickupFxText(k)+'</span><button data-pfx=\"'+k+'\" data-dir=\"1\" style=\"min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px\">+</button></div>').join('')"
            "+'<button id=\"pfx-reset\" class=\"wide\">Reset tuning to defaults</button></div>':'')")
rep(old_btns, new_btns)
rep(" panel.querySelector('#pickup-style').onclick=()=>{cyclePickupChoice();openCredits();};" + N +
    " panel.querySelector('#pickup-item').onclick=()=>{cyclePickupPreviewItem();openCredits();};" + N +
    " panel.querySelector('#pickup-preview').onclick=previewPickup;",
    " const pfx=panel.querySelector('#pfx');if(pfx){pfx.querySelector('#pfx-preview').onclick=previewPickup;pfx.querySelector('#pfx-lost').onclick=previewLostPrize;pfx.querySelector('#pfx-quake').onclick=previewQuakePickup;pfx.querySelector('#pfx-reset').onclick=()=>{resetPickupFx();diagEvent('pickup-tuning','reset');openCredits();};"
    "for(const btn of pfx.querySelectorAll('[data-pfx]'))btn.onclick=()=>{stepPickupFx(btn.dataset.pfx,+btn.dataset.dir);diagEvent('pickup-tuning',btn.dataset.pfx+'='+pickupFx[btn.dataset.pfx]);const top=panel.scrollTop;openCredits();panel.scrollTop=top;};}")

# Test hook exports.
rep("queueTreatAward, pickupBlocksPlay, pickupDuration, previewPickup, cyclePickupChoice, get pickupChoice(){return pickupChoice;}, dismissTreatAward, get treatAwards(){return treatAwards;}",
    "queueTreatAward, queueLostPrize, previewPickup, previewLostPrize, previewQuakePickup, quakeButtonScale, quakeTarget, pickupCentre, shownPowerCount, quakeInFlight, get quakeBounceT(){return quakeBounceT;}, pickupFx, stepPickupFx, resetPickupFx, inventoryTileScale, pickupPoint, pickupTarget, prizeWidth, backdropLevel, bigQuakeSprite, panelHalf, PANEL, PANEL_MARGIN, get tileBounceT(){return tileBounceT;}, get sparkles(){return sparkles;}, get lostFx(){return lostFx;}, get treatAwards(){return treatAwards;}, PICKUP_FX_DEFAULTS, sfx")


# CP-34: the Quake coin flies into the Quake button; the "QUAKE +1 / COLLECTED!" text banner is no longer shown.
rep("if(b.kind==='quake'){board.earnedQuakes++;sfx.special();itemToasts.push({text:'QUAKE +1',t:0});}",
    "if(b.kind==='quake'){board.earnedQuakes++;falling.pop();queueTreatAward('quake',x,b,false,'quake');} // CP-34: flight replaces the text banner; sound on landing")
rep("for(const [id,b] of Object.entries(powerButtons())){ctx.save();const x=b.x+b.w/2,y=b.y+b.h/2,enabled=powerEnabled(id);",
    "for(const [id,b] of Object.entries(powerButtons())){ctx.save();const x=b.x+b.w/2,y=b.y+b.h/2,enabled=powerEnabled(id),pk=id==='quake'?quakeButtonScale():1;if(pk!==1){ctx.translate(x,y);ctx.scale(pk,pk);ctx.translate(-x,-y);}")
rep("ctx.fillText(powerCount(id),b.x+b.w-2,b.y+9)", "ctx.fillText(shownPowerCount(id),b.x+b.w-2,b.y+9)")

for gone in ['QUAKE +1', 'pickupBlocksPlay', 'PICKUP_STYLES', 'PICKUP_NAMES', 'pickupChoice', 'satchel bubble', "style==='paw'", 'pickup-paused', 'dismissTreatAward', 'pickupDuration']:
    assert gone not in s, gone
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
