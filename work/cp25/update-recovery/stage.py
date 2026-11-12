from pathlib import Path
import json,base64,hashlib,zipfile
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/update-recovery'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();old=json.loads(raw)
assert old['version']==20261030165425 and sha(raw)=='ce66c40d1805e3747e20c7dd4bdf24603082a93a759e25a5a91c0a9133e89188'
v=json.loads((p/'release-version.json').read_text());assert v['version']>old['version'] and v['apkVersion']==6
h=(p/'release.html').read_bytes();assert h.replace(b'UAT 21',b'UAT 20')==base64.b64decode(old['files']['index.html'])
apk=(p/'build-app/outputs/apk/debug/app-debug.apk').read_bytes()
with zipfile.ZipFile(p/'build-app/outputs/apk/debug/app-debug.apk') as z:
 for name,data in old['files'].items():
  assert z.read('assets/'+name)==(h if name=='index.html' else base64.b64decode(data)),name
 assert z.read('assets/version.txt').decode().strip()==str(v['version'])
 assert z.read('assets/update-url.txt').decode().strip()==(r/'work/uat15/download-url.txt').read_text().strip()
 assert not any('keystore' in n.lower() for n in z.namelist())
# APK-only update: the complete current runtime is already bundled in this installer.
# APK4 and APK5 select the APK branch; APK6's bundled version equals the envelope.
# An empty files object satisfies the old reader without duplicating 51MB of base64.
out={**old,**v,'apk':base64.b64encode(apk).decode(),'files':{}}
t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
assert t.stat().st_size<51_000_000 and t.stat().st_size<66_621_786
(p/'CatCoinPusher-UAT.apk').write_bytes(apk)
m={**v,'baselineJSONSHA256':sha(raw),'baselineAPKSHA256':sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes()),'stagedJSONSHA256':sha(t.read_bytes()),'stagedAPKSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'backup':f"uat/backups/before-CP-25-update-recovery-{v['version']}",'jsonBytes':t.stat().st_size,'apkBytes':len(apk),'runtimeFilesInAPK':len(old['files']),'runtimeFilesInEnvelope':0,'signerSHA256':'20ddef2a158095a45a176efa2ddffa60ecf0c074d569b7dcd9785b1cfa122dc2','authorization':'Repair failed UAT20 app update/crash; APK-only envelope, no gameplay change beyond release label'}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
