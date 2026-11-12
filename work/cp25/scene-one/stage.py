from pathlib import Path
from datetime import datetime
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[2]
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert base64.b64decode(u['files']['index.html'])==(p.parent/'stage3/release.html').read_bytes()
assert len(json.loads((r/'tickets/CP-25-evidence/scene-one/checks.json').read_text())['passed'])==4
h=(p/'draft.html').read_bytes();(p/'release.html').write_bytes(h)
files={**u['files'],'index.html':base64.b64encode(h).decode(),'img/art/collections-satchel-v1.png':base64.b64encode((p/'art/collections-satchel-v1.png').read_bytes()).decode()}
version=int(datetime.now().strftime('%Y%m%d%H%M%S'));assert version>u['version']
out={**u,'version':version,'displayName':'2026.10.28 UAT 6','files':files}
target=p/'CatCoinPusher-UAT-game.json';target.write_text(json.dumps(out,separators=(',',':')))
sha=lambda b:hashlib.sha256(b).hexdigest()
m=dict(version=version,displayName=out['displayName'],apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha(target.read_bytes()),backup=f'uat/backups/before-CP-25-scene-one-{version}',authorization='Jenny approved satchel tile and selected Scene wakes up payoff; illustrated scenes await separate approval',releaseHTMLSHA256=sha(h),changedFiles=['index.html','img/art/collections-satchel-v1.png'])
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
