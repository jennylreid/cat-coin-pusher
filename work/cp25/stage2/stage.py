from pathlib import Path
from datetime import datetime,timezone,timedelta
import json,base64,hashlib,re
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/stage2'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert base64.b64decode(u['files']['index.html'])==(p.parent/'release.html').read_bytes()
assert json.loads((e/'checks.json').read_text())['dropInterval']==.2
assert json.loads((e/'swept.json').read_text())['confirmedThroughCrossings']==0
assert json.loads((e/'flips.json').read_text())['unearnedFlipCrossings']==0
assert json.loads((e/'pusher.json').read_text())['plateSamplesOverHalfUnit']==0
assert not json.loads((e/'launch.json').read_text())['events']
for mode in ['centre','left','sweep']:
 assert json.loads((e/f'pile-{mode}.json').read_text())['deepContactSamplesOverHalfUnit']==0
loop=json.loads((e/'natural-hold-loop.json').read_text());assert len(loop['rows'])==3 and loop['afterPlacement']['rewards']=={'water':True,'cheese':True}
now=datetime.now(timezone(timedelta(hours=-4)));version=int(now.strftime('%Y%m%d%H%M%S'));assert version>u['version']
name='2026.10.28 UAT 3';h=(p/'draft.html').read_bytes();assert f"const BUILD = '{name}';".encode() in h
baseline=(p.parent/'release.html').read_text(encoding='utf-8');candidate=h.decode().replace('\r\n','\n')
for fn in ['initPhysics','addCoin','prefill','deliveryImpact','dampCoinImpacts','solidCoinContacts','stepCatquake','stepPawSweep']:
 pattern=r'^function '+fn+r'\b[\s\S]*?^}'
 assert re.search(pattern,baseline,re.M).group()==re.search(pattern,candidate,re.M).group(),fn+' physics changed'
(p/'release.html').write_bytes(h)
out={**u,'version':version,'displayName':name,'files':{**u['files'],'index.html':base64.b64encode(h).decode()}}
assert [n for n in out['files'] if out['files'][n]!=u['files'][n]]==['index.html']
(p/'CatCoinPusher-UAT-game.json').write_text(json.dumps(out,separators=(',',':')))
m=dict(version=version,displayName=name,apkVersion=4,baselineJSONSHA256=sha(raw),stagedJSONSHA256=sha((p/'CatCoinPusher-UAT-game.json').read_bytes()),backup=f'uat/backups/before-CP-25-stage2-{version}',authorization='Jenny: Stage 1 OK; Stage 2 with sardine/crab/toy mouse, hold to drop, faster drops and Developer Empty purse; UAT only',releaseHTMLSHA256=sha(h),changedFiles=['index.html'],nonHTMLFilesUnchanged=len(u['files'])-1)
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
