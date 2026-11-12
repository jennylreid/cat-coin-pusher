from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib,re
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/layout'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert base64.b64decode(u['files']['index.html'])==(p.parent/'stage2/release.html').read_bytes()
assert len(json.loads((e/'checks.json').read_text())['passed'])==5
assert json.loads((e/'video-fixture.json').read_text())['placements']['cheese']
now=datetime.now(timezone(timedelta(hours=-4)));version=int(now.strftime('%Y%m%d%H%M%S'));assert version>u['version']
name='2026.10.28 UAT 4';h=(p/'draft.html').read_bytes();assert f"const BUILD = '{name}';".encode() in h
old=(p.parent/'stage2/release.html').read_text(encoding='utf-8');new=h.decode().replace('\r\n','\n')
for fn in ['initPhysics','addCoin','prefill','deliveryImpact','dampCoinImpacts','solidCoinContacts','stepCatquake','stepPawSweep','fitView','resize']:
 pattern=r'^function '+fn+r'\b[\s\S]*?^}'
 assert re.search(pattern,old,re.M).group()==re.search(pattern,new,re.M).group(),fn+' changed'
(p/'release.html').write_bytes(h)
out={**u,'version':version,'displayName':name,'files':{**u['files'],'index.html':base64.b64encode(h).decode()}}
assert [n for n in out['files'] if out['files'][n]!=u['files'][n]]==['index.html']
(p/'CatCoinPusher-UAT-game.json').write_text(json.dumps(out,separators=(',',':')))
m=dict(version=version,displayName=name,apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha((p/'CatCoinPusher-UAT-game.json').read_bytes()),backup=f'uat/backups/before-CP-25-layout-{version}',authorization='Jenny: updated CP-25 brief; side Collections tile, full-screen frame and satchel, drag-only placement and queued You got it overlays; UAT only',releaseHTMLSHA256=sha(h),changedFiles=['index.html'],nonHTMLFilesUnchanged=len(u['files'])-1)
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
