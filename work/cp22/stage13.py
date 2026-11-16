from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib,re
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-22-evidence'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert sha(raw)=='9715a64d62fd2342821ec7367e564b914b8d367e6bd54186f43672c3aa5e1635'
assert base64.b64decode(u['files']['index.html'])==(p/'uat12/release.html').read_bytes()
rows=sum([json.loads((p/f'wins13-{seed}.json').read_text()) for seed in [42,1,2]],[])
assert len(rows)==18 and all(x['result']=='won' for x in rows)
render=json.loads((e/'uat13-render-final.json').read_text());plain=json.loads((e/'uat13-no-render-final.json').read_text())
assert render['trajectoryHash']==plain['trajectoryHash'] and render['deepSamples']==0 and render['renderReorderedPhysicsFrames']==0
assert json.loads((e/'uat13-swept.json').read_text())['confirmedThroughCrossings']==0
for mode in ['centre','sweep','left']:
 a=json.loads((e/f'uat13-launch-final-{mode}.json').read_text());assert not a['events']
now=datetime.now(timezone(timedelta(hours=-4)));version=int(now.strftime('%Y%m%d%H%M%S'));assert version>u['version']
name=now.strftime('%Y.%m.%d')+' UAT 1'
assert name=='2026.10.28 UAT 1'
h=re.sub(r"const BUILD = '[^']+';",f"const BUILD = '{name}';",(p/'draft.html').read_text(encoding='utf-8'))
(p/'release.html').write_bytes(h.encode())
out={**u,'version':version,'displayName':name,'files':{**u['files'],'index.html':base64.b64encode(h.encode()).decode()}}
assert [n for n in out['files'] if out['files'][n]!=u['files'][n]]==['index.html']
(p/'CatCoinPusher-UAT-game.json').write_text(json.dumps(out,separators=(',',':')))
m=dict(version=version,displayName=name,apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha((p/'CatCoinPusher-UAT-game.json').read_bytes()),backup=f'uat/backups/before-CP-22-20261028-UAT1-{version}',authorization='Jenny CP-22: stop unintended coin bouncing/launches; keep 0.35-second taps and contact improvements; UAT only',releaseHTMLSHA256=sha(h.encode()),changedFiles=['index.html'],nonHTMLFilesUnchanged=len(u['files'])-1)
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'staging.json').write_text(json.dumps(m,indent=2));(e/'uat13-wins.json').write_text(json.dumps(rows,indent=2));(e/'uat13-launch-before.json').write_bytes((p/'launch12.json').read_bytes())
print(json.dumps(m,indent=2))
