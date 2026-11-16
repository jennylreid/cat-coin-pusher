# CP-33 staging: game-only UAT update for installed APK7. Complete 37-file runtime in `files`, no embedded APK
# (the runtime is carried once). UAT 24's runtime comes from its APK assets, never its empty JSON files object.
from pathlib import Path
import json,base64,hashlib,zipfile,subprocess
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-33-evidence'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((p/'uat32-publication-manifest.json').read_text())  # UAT 33: baseline is published UAT 32
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 32'
assert u['version']==20261111152951 and u['apkVersion']==7 and len(u['files'])==37 and v['version']>u['version'] and v['apkVersion']==7
h=(p/'release.html').read_bytes();subprocess.run(['python',str(p/'build.py')],check=True);assert h==(p/'release.html').read_bytes(),'build not reproducible'
assert len(json.loads((e/'uat33/checks.json').read_text())['passed'])==20
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
   'backup':f"uat/backups/before-CP-33-UAT33-{v['version']}",'authorization':'Jenny approved UAT 33 Nov 11, relayed by PM: prizes spin in and out (Spin dial), 3 generated pickup sounds with picker and volume, Time held 0.7 s; UAT only'}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'uat33/package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
