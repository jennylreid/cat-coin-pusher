from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[2]
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert base64.b64decode(u['files']['index.html'])==(p.parent/'pickup-modal/release.html').read_bytes()
assert len(json.loads((r/'tickets/CP-25-evidence/paw-ui/checks.json').read_text())['passed'])==3
h=(p/'draft.html').read_bytes().replace(b"const BUILD = 'CP-25 LAYOUT PREVIEW';",b"const BUILD = '2026.10.29 UAT 11';");assert b"const BUILD = '2026.10.29 UAT 11';" in h;(p/'release.html').write_bytes(h)
files={**u['files'],'index.html':base64.b64encode(h).decode()}
added=[]
for name in added:files['img/art/'+name]=base64.b64encode((p/'art'/name).read_bytes()).decode()
version=int(datetime.now(timezone(timedelta(hours=-4))).strftime('%Y%m%d%H%M%S'));assert version>u['version']
out={**u,'version':version,'displayName':'2026.10.29 UAT 11','files':files}
target=p/'CatCoinPusher-UAT-game.json';target.write_text(json.dumps(out,separators=(',',':')))
sha=lambda b:hashlib.sha256(b).hexdigest()
m=dict(version=version,displayName=out['displayName'],apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha(target.read_bytes()),backup=f'uat/backups/before-CP-25-paw-ui-{version}',authorization='Jenny selected B paw medallion, requested matching Collections tile, bottom Inventory satchel and top power buttons; explicitly requested UAT publication',releaseHTMLSHA256=sha(h),changedFiles=['index.html']+['img/art/'+name for name in added])
for key in u:
 if key not in ['version','displayName','files']:assert u[key]==out[key]
assert [key for key in files if files[key]!=u['files'].get(key)]==m['changedFiles']
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
