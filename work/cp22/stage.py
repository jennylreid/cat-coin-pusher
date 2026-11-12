from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-22-evidence'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert u['version']==20261027113731 and sha(raw)=='144b731fa4db9fae7bb467d99eb23cb64b00c28019e997eda6ef6716b5c7de49'
assert base64.b64decode(u['files']['index.html'])==(p/'baseline.html').read_bytes()
now=datetime.now(timezone(timedelta(hours=-4)));version=int(now.strftime('%Y%m%d%H%M%S'))
assert version>u['version']
name=now.strftime('%Y.%m.%d')+' UAT '+('9' if now.strftime('%Y%m%d')=='20261027' else '1')
h=(p/'draft.html').read_text(encoding='utf-8').replace("const BUILD = '2026.10.27 UAT 8';",f"const BUILD = '{name}';")
(p/'release.html').write_bytes(h.encode())
out={**u,'version':version,'displayName':name,'files':{**u['files'],'index.html':base64.b64encode(h.encode()).decode()}}
assert out['apkVersion']==4 and out['apk']==u['apk']
assert [n for n in out['files'] if out['files'][n]!=u['files'][n]]==['index.html']
for n,v in out['files'].items():assert base64.b64encode(base64.b64decode(v)).decode()==v
(p/'CatCoinPusher-UAT-game.json').write_text(json.dumps(out,separators=(',',':')))
m=dict(version=version,displayName=name,apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha((p/'CatCoinPusher-UAT-game.json').read_bytes()),backup=f'uat/backups/before-CP-22-{version}',authorization='Jenny CP-22: publish to UAT only',releaseHTMLSHA256=sha(h.encode()),changedFiles=['index.html'],nonHTMLFilesUnchanged=len(u['files'])-1)
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2))
(e/'staging.json').write_text(json.dumps(m,indent=2))
publish=(r/'work/cp21/publish.ps1').read_text(encoding='utf-8').replace('CP-21-evidence','CP-22-evidence')
(p/'publish.ps1').write_text(publish)
cloud=(r/'work/cp21/verify-cloud.py').read_text(encoding='utf-8').replace("stage=root/'work/cp21'","stage=root/'work/cp22'").replace('CP-21-evidence','CP-22-evidence')
(p/'verify-cloud.py').write_text(cloud)
results=sum([json.loads((p/f'wins-{seed}-final.json').read_text()) for seed in [42,1,2]],[])
assert len(results)==18 and all(x['result']=='won' for x in results)
(e/'wins.json').write_text(json.dumps(results,indent=2))
print(json.dumps(m,indent=2))
