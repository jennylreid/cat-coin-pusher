from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];h=(p.parent/'loop-repair/release.html').read_text(encoding='utf-8');u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==(p.parent/'loop-repair/release.html').read_bytes()
h=h.replace("const BUILD = '2026.10.29 UAT 12';","const BUILD = 'CP-25 INVENTORY PREVIEW';")
start=h.index('function screenTap(p){');end=h.index('function collectionPointerDown',start);part=h[start:end];old="if(loopScreen==='inventory'){openLoopScreen('water');return;}";assert old in part;part=part.replace(old,"if(loopScreen==='inventory')return;");h=h[:start]+part+h[end:]
for startToken,endToken in [('function collectionsTile(){','function hitCollectionsTile('),('function drawCollectionsTile(){','function drawInventoryButton('),('function drawInventoryOnly(){','Promise.all([RAPIER.init(), loadArt()])')]:
 start=h.index(startToken);end=h.index(endToken,start);h=h[:start]+h[end:]
pos=h.index('Promise.all([RAPIER.init(), loadArt()])');h=h[:pos]+(p/'ui.js').read_text(encoding='utf-8')+'\n'+h[pos:]
h=h.replace('collectionsTile, inventoryButton,','collectionsTile, inventoryGrid, inventoryButton,')
(p/'draft.html').write_text(h,encoding='utf-8');print('Built compact Inventory with powers and footer doily Collections tile; preview only')
