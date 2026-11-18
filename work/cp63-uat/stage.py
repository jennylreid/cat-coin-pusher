# CP-63 staging (Formal inspection): a complete game-only update for installed APK7, on the published UAT named by
# release-version.json "base" (its work folder's publication-manifest.json pins the channel). Only index.html changes;
# every other runtime file is carried over byte for byte from the published JSON.
# Also lays the runtime out in work/cp63-formal/game (the published files + this index.html) for the real-browser boot
# check: node ../cp82/bootcheck.cjs ../cp63-formal/game > <evidence>/real-browser-boot.json (run between stage passes).
from pathlib import Path
import json,base64,hashlib,subprocess,sys
p=Path(__file__).parent;r=p.parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());B=p.parent/v['base'];uat=v['displayName'].split()[-1]
e=r/f'tickets/CP-63-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not the base UAT'
assert u['version']==pin['version'] and u['apkVersion']==7 and v['version']>u['version'] and v['apkVersion']==7
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes()==(p/'base.html').read_bytes(),'published index.html is not the base release'
rel=p/'release.html'
def build():subprocess.run(['python',str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
# the boot folder: the published runtime files + this build
G=p.parent/'cp63-formal/game';wrote=0
for k,b64 in u['files'].items():
    b=h if k=='index.html' else base64.b64decode(b64);f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
print('boot folder',G,'files written',wrote)
if '--boot-only' in sys.argv:sys.exit(0)
c=json.loads((e/'checks.json').read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve() and c['passed'],('checks', c['failed'])
bt=json.loads((e/'real-browser-boot.json').read_text());assert bt['title'] and bt['play'] and not bt['errors'] and bt['build']==v['displayName'],'real-browser boot failed'
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-63 Formal inspection replaces the Tuxedo's YAWN power, stand-in monocle and cane (Jenny via PM, Nov 17: \"you could push it to UAT tonight\"); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
