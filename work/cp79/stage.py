# CP-58 step 2 staging (UAT 79), on published UAT 78: complete game-only update for installed APK7.
# index.html is the new build; two new runtime files carry the Runway round-yawn art (img/art/cp58-yawn-face.webp,
# lossless and pixel-identical to the approved yawn-face-3.png, and img/art/cp58-yawn-eyes.png). Every other file is carried
# over byte for byte from the published UAT 78 JSON.
from pathlib import Path
import json,base64,hashlib,subprocess
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp78'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-58-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT 78
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 78'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==45 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not cp78/release.html'
rel=p/'release.html'
def build():subprocess.run(['python',str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
c=json.loads((e/'checks79.json').read_text(encoding='utf-8'));assert c['passed'] is True and not c['failed'] and Path(c['build'])==rel.resolve(),'run work/cp79/checks79.cjs on this release.html first'
ART={'img/art/cp58-yawn-face.webp':p/'art/cp58-yawn-face.webp','img/art/cp58-yawn-eyes.png':p/'art/cp58-yawn-eyes.png'}
assert sha(ART['img/art/cp58-yawn-eyes.png'].read_bytes())==sha((p.parent/'cp58-yawn/game/runway/yawn-eyes-3.png').read_bytes())
assert not set(ART)&set(u['files'])
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
for k,f in ART.items():files[k]=base64.b64encode(f.read_bytes()).decode()
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':sorted(ART),'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-58 step 2 (Jenny via PM, Nov 16: \"CP-58: the round yawn (3) with Runway eyes is approved. Build it into UAT.\"; the wheel's YAWN slices; publish as UAT 79 on UAT 78); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
