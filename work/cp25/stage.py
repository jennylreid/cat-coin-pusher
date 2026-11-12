from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib,re
p=Path(__file__).parent;r=p.parents[1]
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert base64.b64decode(u['files']['index.html'])==(r/'work/cp22/release.html').read_bytes()
assert (r/'tickets/CP-25-evidence/checks.json').exists()
assert len(json.loads((r/'tickets/CP-25-evidence/natural-loop.json').read_text())['rows'])==3
now=datetime.now(timezone(timedelta(hours=-4)));version=int(now.strftime('%Y%m%d%H%M%S'));assert version>u['version']
name='2026.10.28 UAT 2'
h=re.sub(r"const BUILD = '[^']+';",f"const BUILD = '{name}';",(p/'draft.html').read_text(encoding='utf-8'))
(p/'release.html').write_bytes(h.encode())
out={**u,'version':version,'displayName':name,'files':{**u['files'],'index.html':base64.b64encode(h.encode()).decode()}}
assert [n for n in out['files'] if out['files'][n]!=u['files'][n]]==['index.html']
(p/'CatCoinPusher-UAT-game.json').write_text(json.dumps(out,separators=(',',':')))
m=dict(version=version,displayName=name,apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha((p/'CatCoinPusher-UAT-game.json').read_bytes()),backup=f'uat/backups/before-CP-25-stage1-{version}',authorization='Jenny: CP-25 Stage 1 publish to UAT then wait for OK',releaseHTMLSHA256=sha(h.encode()),changedFiles=['index.html'],nonHTMLFilesUnchanged=len(u['files'])-1)
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
