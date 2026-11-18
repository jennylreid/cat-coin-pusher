"""Stage CP-62 UAT 80 on the exact published UAT 79; no channel writes."""
from pathlib import Path
import json,base64,hashlib,subprocess
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp79'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());e=r/'tickets/CP-62-evidence/uat80'
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256']
assert u['version']==20261116235950 and u['apkVersion']==7 and len(u['files'])==47 and v['version']>u['version']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes()
def build():
    subprocess.run(['python',str(p/'build.py')],check=True);return (p/'release.html').read_bytes()
h=build();assert h==build()
c=json.loads((e/'checks80.json').read_text());assert c['passed'] and not c['failed']
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
art={f'img/art/{a.name}':a.read_bytes() for a in sorted((p/'art').glob('cp62-*.png'))}
assert len(art)==15 and not set(art)&set(u['files'])
for k,b in art.items():files[k]=base64.b64encode(b).decode()
assert all(files[k]==u['files'][k] for k in u['files'] if k!='index.html')
out={**u,**v,'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
assert t.stat().st_size<55_000_000
m={**v,'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':t.stat().st_size,'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':sorted(art),'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],'backup':f"uat/backups/before-UAT80-{v['version']}",'evidence':e.relative_to(r).as_posix(),'authorization':'Jenny: CP-62 Phase B go; milk B (corrected), mouse A, bell A, bowtie A; random existing A/B/C colours per notes, cushion and yarn prize. UAT 80 only, on UAT 79.'}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
