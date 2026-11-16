from pathlib import Path
import json,base64,hashlib,zipfile,shutil,subprocess
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/log-file'
sha=lambda b:hashlib.sha256(b).hexdigest()
pin=json.loads((p/'baseline-pin.json').read_text());v=json.loads((p/'release-version.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert sha(raw)==pin['sha256'] and u['version']==pin['version'] and v['version']>u['version']
assert sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes())==pin['apkSHA256']
assert base64.b64decode(u['files']['index.html'])==(p/'baseline.html').read_bytes()
for name in ['physics-audit.json','edge-audit.json']:
 for a in json.loads((e/name).read_text())['results']:
  assert all(a[k]==0 for k in ['confirmedThroughCrossings','deepSamplesOverHalfUnit','plateSamplesOverHalfUnit','tableRescues','flipCrossings','unearnedFlips'])
  assert a['maxPenetration']<.5 and a['maxPlatePenetration']<.5
assert len(json.loads((e/'functional.json').read_text())['passed'])==5
h=(p/'candidate.html').read_bytes();subprocess.run(['python',str(p/'build.py')],check=True);assert h==(p/'candidate.html').read_bytes()
(p/'release.html').write_bytes(h)
apk=(p/'build-app/outputs/apk/debug/app-debug.apk').read_bytes()
out={**u,**v,'apk':base64.b64encode(apk).decode(),'files':{**u['files'],'index.html':base64.b64encode(h).decode()}}
with zipfile.ZipFile(p/'build-app/outputs/apk/debug/app-debug.apk') as z:
 for name,data in out['files'].items():assert z.read('assets/'+name)==base64.b64decode(data),name
 assert z.read('assets/version.txt').decode().strip()==str(v['version'])
 assert z.read('assets/update-url.txt').decode().strip()==(r/'work/uat15/download-url.txt').read_text().strip()
 assert not any('keystore' in n.lower() for n in z.namelist())
assert [k for k in out['files'] if out['files'][k]!=u['files'].get(k)]==['index.html']
t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');assert t.stat().st_size<128*1024*1024
(p/'CatCoinPusher-UAT.apk').write_bytes(apk)
m={**v,'baselineJSONSHA256':sha(raw),'baselineAPKSHA256':pin['apkSHA256'],'stagedJSONSHA256':sha(t.read_bytes()),'stagedAPKSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'backup':f"uat/backups/before-CP-25-log-file-{v['version']}",'jsonBytes':t.stat().st_size,'apkBytes':len(apk),'runtimeFiles':len(out['files']),'signerSHA256':'20ddef2a158095a45a176efa2ddffa60ecf0c074d569b7dcd9785b1cfa122dc2','authorization':'Jenny approved one collision interval and button-based OneDrive file logs; UAT only'}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
