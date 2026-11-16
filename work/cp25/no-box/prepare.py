from pathlib import Path
import base64,json
p=Path(__file__).parent;r=p.parents[2];u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());source=(p.parent/'kitchen/release.html').read_bytes();assert base64.b64decode(u['files']['index.html'])==source
h=source.decode();box="if(hover){ctx.strokeStyle='#ffe29a';ctx.lineWidth=2;ctx.strokeRect(r.x,r.y,r.w,r.h);}"
assert h.count(box)==2
h=h.replace(box,'').replace("const BUILD = '2026.10.29 UAT 3';","const BUILD = '2026.10.29 UAT 4';")
(p/'draft.html').write_text(h,encoding='utf-8')
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py','check.cjs']:
 t=(p.parent/'kitchen'/name).read_text(encoding='utf-8').replace('work/cp25/kitchen','work/cp25/no-box').replace('CP-25-evidence/kitchen','CP-25-evidence/no-box')
 if name=='stage.py':t=t.replace("p.parent/'seahorse/release.html'","p.parent/'kitchen/release.html'").replace("added=['cheese-scene-v1.png','cheese-outline.png']",'added=[]').replace('2026.10.29 UAT 3','2026.10.29 UAT 4').replace('before-CP-25-kitchen-','before-CP-25-no-box-').replace('Jenny approved kitchen painting and renamed Cheese collection Kitchen; UAT only','Jenny requested no square highlight when dragging to collection slots; UAT only')
 (p/name).write_text(t,encoding='utf-8')
print('Removed destination rectangles from both scene renderers; item outlines retained')
