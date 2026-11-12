from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];h=(p.parent/'pickup-modal/release.html').read_text(encoding='utf-8');u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==(p.parent/'pickup-modal/release.html').read_bytes()
h=h.replace("const BUILD = '2026.10.29 UAT 10';","const BUILD = 'CP-25 LAYOUT PREVIEW';")
# Replace only requested UI routines, preserving the rest of the pinned release.
for name,nextname in [('drawBoardHUD','// CP-25:'),('drawTreatAward','// UI-only celebration.')]:
 start=h.index('function '+name+'(');end=h.index(nextname,start);h=h[:start]+h[end:]
start=h.index('function drawCollectionsTile()');end=h.index('// UI-only celebration.',start);h=h[:start]+h[end:]
old="loopScreen=COLLECTIONS[view]?view:'water'";assert old in h;h=h.replace(old,"loopScreen=view==='inventory'?'inventory':COLLECTIONS[view]?view:'water'")
old="function drawInventory(){if(loopScreen==='water')drawWaterInventory();else drawKitchenInventory();}";assert old in h;h=h.replace(old,"function drawInventory(){if(loopScreen==='inventory')drawInventoryOnly();else if(loopScreen==='water')drawWaterInventory();else drawKitchenInventory();}")
old='function collectionPointerDown(e,p){';assert old in h;h=h.replace(old,old+"\n if(loopScreen==='inventory'){screenTap(p);return;}")
old="if(p.y>=s.top+42&&p.y<=s.top+84&&p.x>=s.left&&p.x<=s.right){";assert old in h;h=h.replace(old,old+"if(loopScreen==='inventory'){openLoopScreen('water');return;}")
start=h.index("  {const h=hudLayout();if(p.y>h.settingsY-50");end=h.index("  if(board.status==='won'",start);h=h[:start]+"  if(contains(inventoryButton(),p)){openLoopScreen('inventory');return;}\n  if(powerTap(p))return;\n"+h[end:]
start=h.index(' if(p.y>hud.bottomY&&p.x>=20');end=h.index('  // the top bar and quest banner',start);h=h[:start]+" if(p.y>hud.bottomY-12)return;\n"+h[end:]
pos=h.index('Promise.all([RAPIER.init(), loadArt()])');h=h[:pos]+(p/'ui.js').read_text(encoding='utf-8')+'\n'+h[pos:]
h=h.replace('collectionsTile, queueTreatAward,','collectionsTile, inventoryButton, powerButtons, powerCount, powerEnabled, queueTreatAward,')
(p/'draft.html').write_text(h,encoding='utf-8');print('Built local paw UI layout draft; UAT remains unchanged')
