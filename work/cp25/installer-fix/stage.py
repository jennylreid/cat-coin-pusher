from pathlib import Path
import json,base64,hashlib,zipfile
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/installer-fix'
sha=lambda b:hashlib.sha256(b).hexdigest()
pin=json.loads((p/'baseline-pin.json').read_text());v=json.loads((p/'release-version.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();old=json.loads(raw)
assert sha(raw)==pin['jsonSHA256'] and old['version']==pin['version'] and sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes())==pin['apkSHA256']
assert v['version']>old['version'] and v['apkVersion']==7
h=(p/'release.html').read_bytes();assert h.replace(b'UAT 24',b'UAT 23')==base64.b64decode(old['files']['index.html'])
apk=(p/'build-app/outputs/apk/debug/app-debug.apk').read_bytes()
checks=json.loads((e/'native-verification.json').read_text());assert checks['signatureVerified'] and checks['compiledVersion']==7 and checks['policyPassed'] and checks['paddingPassed']
with zipfile.ZipFile(p/'build-app/outputs/apk/debug/app-debug.apk') as z:
 for name,data in old['files'].items():assert z.read('assets/'+name)==(h if name=='index.html' else base64.b64decode(data)),name
 assert z.read('assets/version.txt').decode().strip()==str(v['version'])
 assert z.read('assets/update-url.txt').decode().strip()==(r/'work/uat15/download-url.txt').read_text().strip()
 assert not any('keystore' in n.lower() for n in z.namelist())
out={**old,**v,'apk':base64.b64encode(apk).decode(),'files':{}}
t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');assert t.stat().st_size<51_000_000
(p/'CatCoinPusher-UAT.apk').write_bytes(apk)
m={**v,'baselineJSONSHA256':sha(raw),'baselineAPKSHA256':pin['apkSHA256'],'stagedJSONSHA256':sha(t.read_bytes()),'stagedAPKSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'backup':f"uat/backups/before-CP-25-installer-fix-{v['version']}",'jsonBytes':t.stat().st_size,'apkBytes':len(apk),'runtimeFilesInAPK':len(old['files']),'runtimeFilesInEnvelope':0,'signerSHA256':checks['signerSHA256'],'authorization':'Fix missing-installer error and retained diagnostic tail; self-contained UAT APK7, current clear-order game retained'}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
