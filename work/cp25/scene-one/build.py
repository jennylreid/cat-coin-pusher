from pathlib import Path
import json,base64,re
p=Path(__file__).parent;r=p.parents[2]
h=(p.parent/'stage3/release.html').read_text(encoding='utf-8')
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes())
assert base64.b64decode(u['files']['index.html'])==(p.parent/'stage3/release.html').read_bytes()
def rep(a,b):
 global h
 assert a in h,a[:100]
 h=h.replace(a,b)
h=re.sub(r"const BUILD = '[^']+';","const BUILD = '2026.10.28 UAT 6';",h)
rep("ART.tuna=await image('img/art/tuna.png');", "ART.tuna=await image('img/art/tuna.png');\n ART.collectionsTile=await image('img/art/collections-satchel-v1.png');")
start=h.index('function drawCollectionsTile()');end=h.index('function drawTreatAward()',start)
h=h[:start]+'''function drawCollectionsTile(){const b=collectionsTile();ctx.save();ctx.drawImage(ART.collectionsTile,b.x,b.y,b.w,b.h);ctx.restore();}
'''+h[end:]
rep("S.dev=!!data.dev;", "S.dev=!!data.dev;pendingCollectionDance=!!data.pendingCollectionDance;")
rep('dev:S.dev,placements,collectionPaid,', 'dev:S.dev,placements,collectionPaid,pendingCollectionDance,')
rep('tickTreatAwards(dt);collectionStars=', 'tickCollectionPayoff(dt);tickTreatAwards(dt);collectionStars=')
rep('!treatAwards.length&&!itemToasts.length', '!collectionDance&&!treatAwards.length&&!itemToasts.length')
rep('function resetBoard() {', 'function resetBoard() {\n endCollectionDance();')
rep('stopDrops();cancelCollectionDrag();inventoryOpen=true;', 'stopDrops();endCollectionDance();cancelCollectionDrag();inventoryOpen=true;')
rep("sweetUntil=time+3;sfx.fanfare();", "beginCollectionPayoff(key,set.reward,id);sfx.fanfare();")
rep('cancelCollectionDrag();inventoryOpen=false;stopDrops();save();return;', 'closeCollectionScreen();return;')
rep("ctx.fillText(S.coins+' coins',b.x+b.w-15,b.y+23);", "ctx.fillText(collectionPurseDisplay()+' coins',b.x+b.w-15,b.y+23);")
rep(' g.slots.forEach(r=>{\n', ' g.slots.forEach(r=>{\n')
# Insert UI-only payoff drawing after all slots and before instructions/satchel.
rep(" ctx.textAlign='center';ctx.font='13px system-ui';ctx.fillStyle='#ffe29a';ctx.fillText(collectionMessage", " drawSceneWake(g);\n ctx.textAlign='center';ctx.font='13px system-ui';ctx.fillStyle='#ffe29a';ctx.fillText(collectionMessage")
rep(' if(collectionDrag){ctx.save();', ' drawPayoffCoins(g);\n if(collectionDrag){ctx.save();')
pos=h.index('function drawHUD()');h=h[:pos]+(p/'payoff.js').read_text(encoding='utf-8')+'\n'+h[pos:]
rep('closeInventory(){inventoryOpen=false;}', 'closeInventory(){closeCollectionScreen();}')
rep('openLoopScreen, screenTap, placeItem,', 'openLoopScreen, screenTap, placeItem, get collectionPayoff(){return collectionPayoff;}, get collectionDance(){return collectionDance;}, get pendingCollectionDance(){return pendingCollectionDance;}, collectionPurseDisplay,')
(p/'draft.html').write_text(h,encoding='utf-8');print('Built approved tile and Scene wakes up payoff')
