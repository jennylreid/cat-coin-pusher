from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib,subprocess
p=Path(__file__).parent;r=p.parents[2];baseline=json.loads((p/'baseline.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);assert u['version']==baseline['version'];assert base64.b64decode(u['files']['index.html'])==(p/'baseline.html').read_bytes()
checks=json.loads((r/'tickets/CP-25-evidence/auto-log/checks.json').read_text());assert len(checks['passed'])==5
eq=json.loads((r/'tickets/CP-25-evidence/auto-log/equivalence-overhead.json').read_text());assert eq['gameplayStatesIdentical'] and eq['framesCompared']==600 and eq['diagnosticWritesDuringHeldRecording']==0
h=(p/'candidate.html').read_bytes();assert b"2026.10.30 UAT 19" in h;subprocess.run(['python',str(p/'build.py')],check=True);assert h==(p/'candidate.html').read_bytes();(p/'release.html').write_bytes(h)
v=int(datetime.now(timezone(timedelta(hours=-4))).strftime('%Y%m%d%H%M%S'));assert v>u['version']
out={**u,'version':v,'displayName':'2026.10.30 UAT 19','files':{**u['files'],'index.html':base64.b64encode(h).decode()}};t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
sha=lambda b:hashlib.sha256(b).hexdigest();m=dict(version=v,displayName=out['displayName'],apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha(t.read_bytes()),backup=f'uat/backups/before-CP-25-auto-log-{v}',authorization='Jenny requested automatic diagnostic collection instead of manually reading active-play numbers; local recorder and copy/export; game-only UAT',releaseHTMLSHA256=sha(h),changedFiles=['index.html']);assert [k for k in out['files'] if out['files'][k]!=u['files'].get(k)]==['index.html'];(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
