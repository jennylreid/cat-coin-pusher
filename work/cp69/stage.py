# CP-52 staging (UAT 68): Drop speed and Pause, on the published UAT 68, as a game-only UAT update
# for installed APK7 (same recipe: complete 37-file runtime in `files`, no embedded APK; the other 36 runtime files are the
# base's, byte for byte). Version and name come from release-version.json.
from pathlib import Path
import json,base64,hashlib,zipfile,subprocess
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp68'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-52-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT 68
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 68'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==37 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
rel=p/'release.html'
def build():subprocess.run(['python',str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
c=json.loads((e/'checks69.json').read_text(encoding='utf-8'));assert c['passed'] is True and not c['failed'] and Path(c['build'])==rel.resolve(),'run checks69.cjs on this release.html first'
names=list(json.loads((r/'work/cp25/update-recovery/runtime-manifest.json').read_text()))
with zipfile.ZipFile(r/'uat/CatCoinPusher-UAT.apk') as z:
 assert z.read('assets/index.html')==(r/'work/cp25/installer-fix/release.html').read_bytes()
 assets=sorted(n[7:] for n in z.namelist() if n.startswith('assets/') and n[7:] not in ('version.txt','update-url.txt'))
 assert sorted(names)==assets and len(names)==37,(len(names),len(assets))
 files={n:base64.b64encode(h if n=='index.html' else z.read('assets/'+n)).decode() for n in names}
for n in names:
 if n!='index.html':assert files[n]==u['files'][n],n
for id in ('feather','ball','cushion'):
 files['img/art/cp52-'+id+'.png']=base64.b64encode((p/'art'/('cp52-'+id+'.png')).read_bytes()).decode()
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html','img/art/cp52-feather.png','img/art/cp52-ball.png','img/art/cp52-cushion.png'],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-52 approved feather D, ball C, cushion C; UAT only on UAT 68; shared art cache replacement, same sizes/colliders and frozen pickup"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
