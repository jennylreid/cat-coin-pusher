from pathlib import Path
import json,base64,hashlib
p=Path('work/cp25/perf-rework');man={}
for label,src in [('production','work/cp21/promotion/CatCoinPusher-game.json'),('cp22','work/cp22/CatCoinPusher-UAT-game.json'),('uat16','uat/CatCoinPusher-UAT-game.json')]:
 u=json.loads(Path(src).read_bytes());d=p/label;d.mkdir(exist_ok=True);(d/'art').mkdir(exist_ok=True)
 h=base64.b64decode(u['files']['index.html']);(d/'release.html').write_bytes(h)
 for n,v in u['files'].items():
  if n.startswith('img/art/'):(d/'art'/Path(n).name).write_bytes(base64.b64decode(v))
 man[label]={'version':u['version'],'displayName':u['displayName'],'htmlSHA256':hashlib.sha256(h).hexdigest(),'rapierSHA256':hashlib.sha256(base64.b64decode(u['files']['lib/rapier.js'])).hexdigest()}
(p/'baselines.json').write_text(json.dumps(man,indent=2));print(json.dumps(man,indent=2))
p=Path('tickets/CP-25.md');p.write_text('''# CP-25 UAT16 FAILED — performance/input rework first (October 30)

Jenny reports **about 13 FPS while holding**, with coins not following hold-and-slide. UAT16 fails smooth play and hold-to-drop. Pickup work is stopped; all pickup previews are unapproved and on hold. Updated Stage 4 is the active scope: compare production October 27, CP-22 October 28 UAT1 and UAT16 under identical scripted input, identify the regression, add Developer physics/drawing/coin readouts, and repair finger follow. Keep PRIZE LOST same-board retry as built (Jenny's decision); no change needed.

Investigation in progress. Results and any next publication will replace this status at the top.

---

'''+p.read_text(encoding='utf-8'),encoding='utf-8')
