from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib,subprocess
p=Path(__file__).parent;r=p.parents[2];baseline=json.loads((p/'baseline.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert u['version']==baseline['version'];assert base64.b64decode(u['files']['index.html'])==(p/'baseline.html').read_bytes()
audit=json.loads((r/'tickets/CP-25-evidence/two-intervals/physics-audit.json').read_text())['results'];assert len(audit)==3
for x in audit:
 for k in ['confirmedThroughCrossings','deepSamplesOverHalfUnit','plateSamplesOverHalfUnit','tableRescues','unearnedFlips']:assert x[k]==0,(k,x)
 assert x['maxPenetration']<.5 and x['maxPlatePenetration']<.5
launch=json.loads((r/'tickets/CP-25-evidence/two-intervals/launch.json').read_text());assert len(launch)==3 and all(x['eventsOver2mPerSecond']==0 for x in launch)
wins=json.loads((r/'tickets/CP-25-evidence/two-intervals/wins.json').read_text());assert len(wins)==24 and all(x['result']=='won' for x in wins)
assert len(json.loads((r/'tickets/CP-25-evidence/two-intervals/functional.json').read_text())['passed'])==4
assert len(json.loads((r/'tickets/CP-25-evidence/two-intervals/readout-hold.json').read_text())['builds'])==2
h=(p/'candidate.html').read_bytes();assert b"2026.10.30 UAT 18" in h
subprocess.run(['python',str(p/'build.py')],check=True);assert h==(p/'candidate.html').read_bytes();(p/'release.html').write_bytes(h)
v=int(datetime.now(timezone(timedelta(hours=-4))).strftime('%Y%m%d%H%M%S'));assert v>u['version']
out={**u,'version':v,'displayName':'2026.10.30 UAT 18','files':{**u['files'],'index.html':base64.b64encode(h).decode()}}
t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
sha=lambda b:hashlib.sha256(b).hexdigest()
m=dict(version=v,displayName=out['displayName'],apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha(t.read_bytes()),backup=f'uat/backups/before-CP-25-two-intervals-{v}',authorization='Jenny approved trial two collision intervals and CP-22 safety checks; UAT only; pickup work stopped',releaseHTMLSHA256=sha(h),changedFiles=['index.html'])
assert [k for k in out['files'] if out['files'][k]!=u['files'].get(k)]==['index.html']
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
