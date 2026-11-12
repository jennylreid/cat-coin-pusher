# CP-33 staging: game-only UAT update for installed APK7. Complete 37-file runtime in `files`, no embedded APK
# (the runtime is carried once). UAT 24's runtime comes from its APK assets, never its empty JSON files object.
from pathlib import Path
import json,base64,hashlib,zipfile,subprocess
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-35-evidence'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((p.parent/'cp33/publication-manifest.json').read_text())  # baseline is published UAT 34
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 34'
assert u['version']==20261111174306 and u['apkVersion']==7 and len(u['files'])==37 and v['version']>u['version'] and v['apkVersion']==7
h=(p/'release.html').read_bytes();subprocess.run(['python',str(p/'build.py')],check=True);assert h==(p/'release.html').read_bytes(),'build not reproducible'
c=json.loads((e/'checks.json').read_text());assert len(c['passed'])==31 and not c['failed']
names=list(json.loads((r/'work/cp25/update-recovery/runtime-manifest.json').read_text()))
with zipfile.ZipFile(r/'uat/CatCoinPusher-UAT.apk') as z:
 assert z.read('assets/index.html')==(r/'work/cp25/installer-fix/release.html').read_bytes()
 assets=sorted(n[7:] for n in z.namelist() if n.startswith('assets/') and n[7:] not in ('version.txt','update-url.txt'))
 assert sorted(names)==assets and len(names)==37,(len(names),len(assets))
 files={n:base64.b64encode(h if n=='index.html' else z.read('assets/'+n)).decode() for n in names}
out={**u,**v,'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**v,'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'embeddedAPKBytes':0,'nativeChange':False,
   'backup':f"uat/backups/before-CP-35-UAT35-{v['version']}",'authorization':'CP-35 Wild board prototype; Jenny waived art/sound approvals and preview stops (brief); PM relayed Nov 11: publish to UAT tonight; UAT only'}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
