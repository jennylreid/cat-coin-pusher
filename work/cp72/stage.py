# CP-56 phase B staging (UAT 71), on published UAT 71: complete 40-file game-only update for installed APK7.
# Every file except index.html is carried over byte for byte from the published UAT 71 JSON.
from pathlib import Path
import json,base64,hashlib,subprocess
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp71'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-56-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT 71
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 71'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==40 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not cp71/release.html'
rel=p/'release.html'
def build():subprocess.run(['python',str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
c=json.loads((e/'checks72.json').read_text(encoding='utf-8'));assert c['passed'] is True and not c['failed'] and Path(c['build'])==rel.resolve(),'run checks72.cjs on this release.html first'
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
for a in (p/'art').glob('cp56-*.png'):files['img/art/'+a.name]=base64.b64encode(a.read_bytes()).decode()
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html']+['img/art/'+a.name for a in sorted((p/'art').glob('cp56-*.png'))],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-56 phase B (Jenny's go via PM, Nov 16): approved sock B, biscuit A, sardine B, egg B, box A; shared cache art only, frozen pickup; UAT only, on UAT 71"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
