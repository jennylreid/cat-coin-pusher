"""Stage UAT 89 (CP-64 add-on: Jackpot prizes don't fill the Dance meter) on the published UAT 88. Game-only: only
index.html changes. Writes boot89/ (full runtime for the real-browser boot), CatCoinPusher-UAT-game.json (staged),
publication-manifest.json, publish.ps1 and verify-cloud.py (copied from cp88, retargeted). Touches nothing in uat/.
Usage: python prepare.py"""
from pathlib import Path
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-64-evidence/uat89';e.mkdir(parents=True,exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest()
live=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();pin=json.loads((p.parent/'cp88/publication-manifest.json').read_text())
assert sha(live)==pin['stagedJSONSHA256'],'live UAT JSON is not published UAT 88'
u=json.loads(live);assert u['version']==20261117235959
assert base64.b64decode(u['files']['index.html'])==(p.parent/'cp88/release.html').read_bytes(),'UAT 88 index.html differs from cp88/release.html'
files=dict(u['files']);files['index.html']=base64.b64encode((p/'release.html').read_bytes()).decode()
changed=[k for k in files if files[k]!=u['files'][k]];assert changed==['index.html'],changed
for k,v in files.items():
 f=p/'boot89'/k;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(base64.b64decode(v))
v=json.loads((p/'release-version.json').read_text());assert v['version']>u['version']
out={**u,**{k:v[k] for k in ['version','displayName','apkVersion']},'apk':'','files':files}
t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
m={**v,'baselineJSONSHA256':pin['stagedJSONSHA256'],'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes()),
 'releaseHTMLSHA256':sha((p/'release.html').read_bytes()),'runtimeFiles':len(files),'changedRuntimeFiles':changed,'addedRuntimeFiles':[],
 'backup':f"uat/backups/before-UAT89-{v['version']}",'evidence':'tickets/CP-64-evidence/uat89',
 'authorization':"CP-64 add-on (Jenny, Nov 17): Jackpot prizes don't fill the Dance meter; UAT only",'nativeChange':False,'jsonBytes':t.stat().st_size}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2))
(p/'publish.ps1').write_text((p.parent/'cp88/publish.ps1').read_text())
(p/'verify-cloud.py').write_text((p.parent/'cp88/verify-cloud.py').read_text().replace('cp88','cp89'))
print(json.dumps(m,indent=2))
