from pathlib import Path
import json,base64,re
p=Path(__file__).parent;r=p.parents[2]
h=(p.parent/'stage2/release.html').read_text(encoding='utf-8')
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes())
assert base64.b64decode(u['files']['index.html'])==(p.parent/'stage2/release.html').read_bytes(), 'Published baseline changed'
def rep(a,b):
 global h
 assert a in h,a[:100]
 h=h.replace(a,b)
h=re.sub(r"const BUILD = '[^']+';", "const BUILD = '2026.10.28 UAT 4';",h)
start=h.index('// CP-25: these two collections');end=h.index('function drawHUD()',start)
ui=(p/'collections.js').read_text(encoding='utf-8')+'\n'+(p/'ui.js').read_text(encoding='utf-8')
# Retain the existing hand-drawn future outlines and silhouette cache.
old=(p.parent/'stage2/collections.js').read_text(encoding='utf-8')
outlines=old[old.index('function outlinePrize('):old.index('function drawInventory()')]
h=h[:start]+ui+'\n'+outlines+'\n'+(p/'awards.js').read_text(encoding='utf-8')+'\n'+h[end:]
rep("if(b.kind==='item'&&['cheese','shrimp','tuna'].includes(b.id))S.got[b.id]=(S.got[b.id]||0)+1;", "if(b.kind==='item'&&['cheese','shrimp','tuna'].includes(b.id)){S.got[b.id]=(S.got[b.id]||0)+1;queueTreatAward(b.id);}")
rep("sfx.special();itemToasts.push({text:(ITEMS[b.id]?.name||b.id).toUpperCase()+' COLLECTED!',t:0});", "sfx.special();")
rep('!itemToasts.length&&!callouts.length&&sweepTime', '!treatAwards.length&&!itemToasts.length&&!callouts.length&&sweepTime')
rep('if(c.afterCollections&&(itemToasts.length||sweepTime>0||catquakeTime>0))return;', 'if(c.afterCollections&&(treatAwards.length||itemToasts.length||sweepTime>0||catquakeTime>0))return;')
rep('collectionStars=Math.max(0,collectionStars-dt);', 'tickTreatAwards(dt);collectionStars=Math.max(0,collectionStars-dt);')
rep('if(inventoryOpen){drawInventory();return;}', 'if(inventoryOpen){drawInventory();drawTreatAward();return;}')
rep('  drawCallout();\n}', '  drawCallout();\n  drawCollectionsTile();drawTreatAward();\n}')
rep("ctx.fillText('Collections',hud.left+94,hud.settingsY-33);", '')
rep("  if(streamPointer!==null)return;\n  const p = toGame(e);\n  if(inventoryOpen){screenTap(p);return;}", "  const p = toGame(e);\n  if(treatAwards.length){stopDrops();cancelCollectionDrag();dismissTreatAward();return;}\n  if(streamPointer!==null)return;\n  if(inventoryOpen){collectionPointerDown(e,p);return;}\n  if(hitCollectionsTile(p)){openLoopScreen('water');return;}")
rep("if(p.x>h.left+4&&p.x<h.left+100){openLoopScreen('water');return;}", '')
rep("cv.addEventListener('pointermove', e => { if (holding&&e.pointerId===streamPointer)", "cv.addEventListener('pointermove', e => {if(inventoryOpen){collectionPointerMove(e,toGame(e));return;} if (holding&&e.pointerId===streamPointer)")
rep("for (const ev of ['pointerup','pointercancel','lostpointercapture']) cv.addEventListener(ev,e=>{if(e.pointerId===streamPointer)stopDrops();});", "for(const ev of ['pointerup','pointercancel','lostpointercapture'])cv.addEventListener(ev,e=>{if(collectionDrag?.pointer===e.pointerId){collectionPointerUp(e,toGame(e),ev==='pointerup');return;}if(e.pointerId===streamPointer)stopDrops();});")
rep("addEventListener('blur',stopDrops);", "addEventListener('blur',()=>{stopDrops();cancelCollectionDrag();});")
rep('if (document.hidden){stopDrops();save();}', 'if (document.hidden){stopDrops();cancelCollectionDrag();save();}')
rep("addEventListener('pagehide',()=>{stopDrops();save();});", "addEventListener('pagehide',()=>{stopDrops();cancelCollectionDrag();save();});")
rep("addEventListener('resize', resize);", "addEventListener('resize',()=>{cancelCollectionDrag();resize();});")
rep('openLoopScreen, screenTap, placeItem,', 'openLoopScreen, screenTap, placeItem, screenLayout, collectionGeometry, collectionsTile, queueTreatAward, dismissTreatAward, get treatAwards(){return treatAwards;}, get collectionDrag(){return collectionDrag;},')
(p/'draft.html').write_text(h,encoding='utf-8')
print('Built CP-25 collection layout and treat overlay revision')
