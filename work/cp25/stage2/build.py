from pathlib import Path
import json,base64,re
p=Path(__file__).parent;r=p.parents[2]
h=(p.parent/'release.html').read_text(encoding='utf-8')
h=re.sub(r"const BUILD = '[^']+';", "const BUILD = '2026.10.28 UAT 3';",h)
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes())
assert base64.b64decode(u['files']['index.html'])==(p.parent/'release.html').read_bytes(), 'Stage 1 baseline changed'
def rep(a,b):
 global h
 assert a in h,a[:100]
 h=h.replace(a,b)
rep('let inventoryOpen=false, clearWait=0, saveError=false;', 'let inventoryOpen=false, clearWait=0, saveError=false;\nconst DROP_INTERVAL=.20;\nlet streamPointer=null;')
rep("  S.dev=!!data.dev;", "  S.dev=!!data.dev;\n  for(const id of ['cheese','shrimp','tuna'])placements[id]=!!data.placements?.[id];\n  for(const id of ['water','cheese'])collectionPaid[id]=!!data.collectionPaid?.[id];")
rep('got:S.got,dev:S.dev,boardIndex,board,', 'got:S.got,dev:S.dev,placements,collectionPaid,boardIndex,board,')
rep('time-lastDrop<.35-1e-6','time-lastDrop<DROP_INTERVAL-1e-6')
rep('  time += STEP;', '  time += STEP;\n if(holding&&time-lastDrop>=DROP_INTERVAL-1e-6)tryDrop(holdPos);')
rep('  // Normal input releases once on pointerdown; holding only updates the eyes/aim.', '  // CP-25: steady hold stream is scheduled by fixed simulation steps; no catch-up queue.')
rep('if(inventoryOpen){regen();return;}', 'collectionStars=Math.max(0,collectionStars-dt);if(inventoryOpen){regen();return;}')
rep('function draw() {\n  ctx.setTransform(scale * devicePixelRatio, 0, 0, scale * devicePixelRatio, 0, 0);', 'function draw() {\n  ctx.setTransform(scale * devicePixelRatio, 0, 0, scale * devicePixelRatio, 0, 0);\n  if(inventoryOpen){drawInventory();return;}')
rep("ctx.fillText('Inventory',hud.settingsX,hud.settingsY-33);", "ctx.fillText('Inventory',hud.settingsX,hud.settingsY-33);ctx.fillText('Collections',hud.left+94,hud.settingsY-33);")
start=h.index('function drawInventory(){');end=h.index('function drawHUD()',start)
h=h[:start]+(p/'collections.js').read_text(encoding='utf-8')+'\n'+h[end:]
rep(' holding=false;taps=[];\n const canCheck=', ' stopDrops();taps=[];\n const canCheck=')
rep("  +(S.dev?'<button id=\"tap-areas\"", "  +(S.dev?'<button id=\"empty-purse\" class=\"wide\">Empty purse</button>':'')\n  +(S.dev?'<button id=\"tap-areas\"")
rep(" const tapAreas=panel.querySelector('#tap-areas');", " const empty=panel.querySelector('#empty-purse');if(empty)empty.onclick=()=>{emptyPurse();panel.style.display='none';};\n const tapAreas=panel.querySelector('#tap-areas');")
rep("  const p = toGame(e);\n  if(inventoryOpen){const h=hudLayout();if(p.x>280&&p.y<h.top+68){inventoryOpen=false;save();}return;}\n  {const h=hudLayout();if(p.x>h.settingsX-80&&p.y>h.settingsY-50&&p.y<h.settingsY-16){inventoryOpen=true;holding=false;save();return;}}", "  if(streamPointer!==null)return;\n  const p = toGame(e);\n  if(inventoryOpen){screenTap(p);return;}\n  {const h=hudLayout();if(p.y>h.settingsY-50&&p.y<h.settingsY-16){if(p.x>h.settingsX-80){openLoopScreen('inventory');return;}if(p.x>h.left+4&&p.x<h.left+100){openLoopScreen('water');return;}}}")
rep('  holding = true; holdPos = aimFromScreen(p.x);', '  streamPointer=e.pointerId;holding = true; holdPos = aimFromScreen(p.x);')
rep("cv.addEventListener('pointermove', e => { if (holding)", "cv.addEventListener('pointermove', e => { if (holding&&e.pointerId===streamPointer)")
rep("for (const ev of ['pointerup', 'pointercancel']) cv.addEventListener(ev, () => { holding = false; });", "for (const ev of ['pointerup','pointercancel','lostpointercapture']) cv.addEventListener(ev,e=>{if(e.pointerId===streamPointer)stopDrops();});\naddEventListener('blur',stopDrops);")
rep("if (document.hidden) save();", "if (document.hidden){stopDrops();save();}")
rep("addEventListener('pagehide', save);", "addEventListener('pagehide',()=>{stopDrops();save();});")
rep("'Tap board · purse carries over'", "'Tap or hold · slide to aim'")
rep("'Tap board to play':'Tap or hold", "'Tap or hold to play':'Tap or hold")
rep('get inventoryOpen(){return inventoryOpen;}, openInventory(){inventoryOpen=true;}, closeInventory(){inventoryOpen=false;}', "get inventoryOpen(){return inventoryOpen;}, openInventory(){openLoopScreen('inventory');}, closeInventory(){inventoryOpen=false;}, openLoopScreen, screenTap, placeItem, placements, collectionPaid, emptyPurse, get streamPointer(){return streamPointer;}, get dropInterval(){return DROP_INTERVAL;}")
(p/'draft.html').write_text(h,encoding='utf-8')
print('Built Stage 2 from published Stage 1')
