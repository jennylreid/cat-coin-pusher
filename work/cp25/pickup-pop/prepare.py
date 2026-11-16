from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];source=(p.parent/'pickup-flight/release.html').read_bytes();u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==source
h=source.decode().replace("const BUILD = '2026.10.29 UAT 5';","const BUILD = '2026.10.29 UAT 6';")
code=(p/'awards.js').read_text(encoding='utf-8');split=code.index('function drawTreatAward()');start=h.index('const treatAwards=[];');end=h.index('function collectionsTile()',start);h=h[:start]+code[:split]+h[end:];start=h.index('function drawTreatAward()');end=h.index('// UI-only celebration.',start);h=h[:start]+code[split:]+'\n'+h[end:];(p/'draft.html').write_text(h,encoding='utf-8')
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py','check.cjs']:
 t=(p.parent/'pickup-flight'/name).read_text(encoding='utf-8').replace('work/cp25/pickup-flight','work/cp25/pickup-pop').replace('CP-25-evidence/pickup-flight','CP-25-evidence/pickup-pop')
 if name=='stage.py':t=t.replace("p.parent/'no-box/release.html'","p.parent/'pickup-flight/release.html'").replace('2026.10.29 UAT 5','2026.10.29 UAT 6').replace('before-CP-25-pickup-flight-','before-CP-25-pickup-pop-').replace('Jenny requested replacing pickup overlay with item flight to satchel and sound; UAT only','Jenny confirmed bottom-to-side satchel direction and requested larger-then-smaller delightful movement; UAT only')
 if name=='check.cjs':
  t=t.replace('i<85','i<103').replace('i<15','i<21').replace('i<210','i<260').replace('t:.95','t:1.25').replace('tile.y+tile.h/2','tile.y+tile.h*.38').replace('i<81','i<99').replace('i===14','i===12').replace('i===23','i===27')
 (p/name).write_text(t,encoding='utf-8')
print('Prepared pop, recognition pause, curved shrink and soft satchel catch')
