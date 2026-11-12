from pathlib import Path
import json,base64,hashlib,zipfile,subprocess
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/clear-order'
sha=lambda b:hashlib.sha256(b).hexdigest()
pin=json.loads((p/'baseline-pin.json').read_text());v=json.loads((p/'release-version.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
assert sha(raw)==pin['jsonSHA256'] and sha(apk)==pin['apkSHA256'] and v['version']>u['version']
assert len(json.loads((e/'checks.json').read_text())['passed'])==5
h=(p/'release.html').read_bytes();subprocess.run(['python',str(p/'build.py')],check=True);assert h==(p/'release.html').read_bytes()
with zipfile.ZipFile(r/'uat/CatCoinPusher-UAT.apk') as z:
 assert z.read('assets/index.html')==(p/'baseline.html').read_bytes()
 names=list(json.loads((r/'work/cp25/update-recovery/runtime-manifest.json').read_text()))
 files={name:base64.b64encode(h if name=='index.html' else z.read('assets/'+name)).decode() for name in names}
# Game-only release for installed APK6: no duplicate embedded installer.
out={**u,**v,'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');assert t.stat().st_size<66_621_786
m={**v,'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':t.stat().st_size,'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'backup':f"uat/backups/before-CP-25-clear-order-{v['version']}",'authorization':'Jenny: show board clear message before cat Rest; game-only UAT'}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
