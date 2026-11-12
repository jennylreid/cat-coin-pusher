from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];h=(p.parent/'no-box/release.html').read_text(encoding='utf-8')
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==(p.parent/'no-box/release.html').read_bytes()
h=h.replace("const BUILD = '2026.10.29 UAT 4';","const BUILD = '2026.10.29 UAT 5';")
start=h.index('const treatAwards=[];');end=h.index('function collectionsTile()',start)
code=(p/'awards.js').read_text(encoding='utf-8');draw=code.index('function drawTreatAward()')
h=h[:start]+code[:draw]+h[end:]
start=h.index('function drawTreatAward()');end=h.index('// UI-only celebration.',start)
h=h[:start]+code[draw:]+'\n'+h[end:]
assert 'queueTreatAward(b.id);' in h;h=h.replace('queueTreatAward(b.id);','queueTreatAward(b.id,x);')
assert 'if(treatAwards.length){stopDrops();cancelCollectionDrag();dismissTreatAward();return;}' in h
h=h.replace('if(treatAwards.length){stopDrops();cancelCollectionDrag();dismissTreatAward();return;}','// Pickup flight is non-modal; ordinary controls remain active.')
h=h.replace('collectionsTile, queueTreatAward,','collectionsTile, pickupFlight, queueTreatAward,')
(p/'draft.html').write_text(h,encoding='utf-8');print('Built non-modal pickup flight and arrival chime')
