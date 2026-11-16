from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];h=(p/'observed-live.html').read_text(encoding='utf-8');u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==(p/'observed-live.html').read_bytes()
def rep(a,b):
 global h
 assert a in h,a[:100]
 h=h.replace(a,b)
rep("const BUILD = '2026.10.29 UAT 14';","const BUILD = '2026.10.29 UAT 15';")
start=h.index('const treatAwards=[];');end=h.index('function hitCollectionsTile(',start);h=h[:start]+h[end:]
start=h.index('function drawTreatAward(){');end=h.index('function drawBoardHUD(){',start);h=h[:start]+h[end:]
pos=h.index('Promise.all([RAPIER.init(), loadArt()])');h=h[:pos]+(p/'awards.js').read_text(encoding='utf-8')+'\n'+h[pos:]
rep('if(inventoryOpen||treatAwards.length)return;','if(inventoryOpen||pickupBlocksPlay())return;')
rep('const pickupModal=treatAwards.length>0;', 'const pickupModal=pickupBlocksPlay();')
rep('if(treatAwards.length){stopDrops();cancelCollectionDrag();dismissTreatAward();return;}', 'if(pickupBlocksPlay()){stopDrops();cancelCollectionDrag();return;}')
rep("+'<button id=\"devmode\" class=\"devswitch\">Developer mode: '","+'<button id=\"pickup-style\" class=\"wide\">Pickup style: '+PICKUP_NAMES[pickupChoice]+'</button><button id=\"pickup-item\" class=\"wide\">Preview item: '+PRIZE_NAMES[pickupPreviewItem]+'</button><button id=\"pickup-preview\" class=\"wide\">Preview pickup (no reward)</button>'\n  +'<button id=\"devmode\" class=\"devswitch\">Developer mode: '")
rep("panel.querySelector('#sound-test').onclick=", "panel.querySelector('#pickup-style').onclick=()=>{cyclePickupChoice();openCredits();};\n panel.querySelector('#pickup-item').onclick=()=>{cyclePickupPreviewItem();openCredits();};\n panel.querySelector('#pickup-preview').onclick=previewPickup;\n panel.querySelector('#sound-test').onclick=")
rep('queueTreatAward, dismissTreatAward,','queueTreatAward, pickupBlocksPlay, pickupDuration, previewPickup, cyclePickupChoice, get pickupChoice(){return pickupChoice;}, dismissTreatAward,')
(p/'draft.html').write_text(h,encoding='utf-8');print('Built three selectable/cycling pickup styles; taps never dismiss; no physics timing changes')
