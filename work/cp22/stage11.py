from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-22-evidence'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert u['version']==20261027161026 and sha(raw)=='c58268277417a7599d61ae865d4c4f57c0213c7c73f994f9533418f0b2352cee'
assert base64.b64decode(u['files']['index.html'])==(p/'uat10/release.html').read_bytes()
now=datetime.now(timezone(timedelta(hours=-4)));version=int(now.strftime('%Y%m%d%H%M%S'))
assert version>u['version']
name=now.strftime('%Y.%m.%d')+' UAT '+('11' if now.strftime('%Y%m%d')=='20261027' else '1')
h=(p/'draft.html').read_text(encoding='utf-8').replace("const BUILD = '2026.10.27 UAT 10';",f"const BUILD = '{name}';")
(p/'release.html').write_bytes(h.encode())
out={**u,'version':version,'displayName':name,'files':{**u['files'],'index.html':base64.b64encode(h.encode()).decode()}}
assert out['apkVersion']==4 and out['apk']==u['apk']
assert [n for n in out['files'] if out['files'][n]!=u['files'][n]]==['index.html']
(p/'CatCoinPusher-UAT-game.json').write_text(json.dumps(out,separators=(',',':')))
m=dict(version=version,displayName=name,apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha((p/'CatCoinPusher-UAT-game.json').read_bytes()),backup=f'uat/backups/before-CP-22-UAT11-{version}',authorization='Jenny CP-22: fix merging/pass-through, restore 0.35-second limit; UAT only',releaseHTMLSHA256=sha(h.encode()),changedFiles=['index.html'],nonHTMLFilesUnchanged=len(u['files'])-1)
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'staging.json').write_text(json.dumps(m,indent=2))
rows=sum([json.loads((p/f'wins11-{seed}.json').read_text()) for seed in [42,1,2]],[])
assert len(rows)==18 and all(x['result']=='won' for x in rows)
(e/'uat11-wins.json').write_text(json.dumps(rows,indent=2))
print(json.dumps(m,indent=2))
