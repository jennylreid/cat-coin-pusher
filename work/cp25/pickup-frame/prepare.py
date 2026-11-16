from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];source=(p.parent/'pickup-pop/release.html').read_bytes();u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==source
h=source.decode().replace("const BUILD = '2026.10.29 UAT 6';","const BUILD = '2026.10.29 UAT 7';")
code=(p/'awards.js').read_text(encoding='utf-8');split=code.index('function drawTreatAward()');start=h.index('const treatAwards=[];');end=h.index('function collectionsTile()',start);h=h[:start]+code[:split]+h[end:];start=h.index('function drawTreatAward()');end=h.index('// UI-only celebration.',start);h=h[:start]+code[split:]+'\n'+h[end:]
assert '// Pickup flight is non-modal; ordinary controls remain active.' in h
h=h.replace('// Pickup flight is non-modal; ordinary controls remain active.', 'if(treatAwards.length){stopDrops();cancelCollectionDrag();dismissTreatAward();return;}').replace('collectionsTile, pickupFlight, queueTreatAward,','collectionsTile, queueTreatAward,')
(p/'draft.html').write_text(h,encoding='utf-8')
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'pickup-pop'/name).read_text(encoding='utf-8').replace('work/cp25/pickup-pop','work/cp25/pickup-frame').replace('CP-25-evidence/pickup-pop','CP-25-evidence/pickup-frame')
 if name=='stage.py':t=t.replace("p.parent/'pickup-flight/release.html'","p.parent/'pickup-pop/release.html'").replace("['passed'])==6","['passed'])==4").replace('2026.10.29 UAT 6','2026.10.29 UAT 7').replace('before-CP-25-pickup-pop-','before-CP-25-pickup-frame-').replace('Jenny confirmed bottom-to-side satchel direction and requested larger-then-smaller delightful movement; UAT only','Jenny rejected flight and requested framed collected-item overlay with briefly grayed background; UAT only')
 (p/name).write_text(t,encoding='utf-8')
print('Prepared framed pickup overlay with neutral grey backdrop')
