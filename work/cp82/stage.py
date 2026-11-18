# CP-58 change staging (UAT 82), on published UAT 81: complete game-only update for installed APK7.
# Only index.html changes; the other 64 runtime files are carried over byte for byte from the published UAT 81 JSON.
from pathlib import Path
import json,base64,hashlib,subprocess
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp81'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-58-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT 81
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 81'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==65 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not cp81/release.html'
rel=p/'release.html'
def build():subprocess.run(['python',str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
c=json.loads((e/'checks82.json').read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),'run work/cp82/checks82.cjs on this release.html first'
# PM (Nov 17): publish now for the boot fix; the only failure allowed is check 2's coin count (1 coin, not 2-4; tuned in UAT 83)
WAIVED=[f for f in c['failed'] if f.startswith('2 no prize in reach')];assert c['failed']==WAIVED and len(WAIVED)<=1,c['failed']
# the real-browser boot (headless Chrome, real time, full runtime folder): run `node bootcheck.cjs boot82 > <evidence>/real-browser-boot.json`
assert (p/'boot82/index.html').read_bytes()==h,'boot82/index.html is not this build'
bt=json.loads((e/'real-browser-boot.json').read_text());assert bt['title'] and bt['play'] and not bt['errors'] and bt['build']==v['displayName'],'real-browser boot failed'
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'waivedChecks':WAIVED,'changedRuntimeFiles':['index.html'],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-58 change (Jenny via PM, Nov 17: eaten prizes are \"exactly like a prize that falls off the side\"; no drop-back message; no prize in reach -> a few top coins; publish as UAT 82 on UAT 81); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
