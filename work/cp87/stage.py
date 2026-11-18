# UAT 87 staging (CP-64 Jackpot cascade + CP-57 title sound switch, one UAT; Jenny Nov 17), on published UAT 85: game-only update for APK7.
# Only index.html changes; the other 65 runtime files are carried over byte for byte from the published UAT 85 JSON.
# Also lays the runtime out in boot86/ for the real-browser boot check:
#   python stage.py --boot-only ; node ../cp86/bootcheck.cjs ../cp87/boot87 > <evidence>/real-browser-boot.json ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp85'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-57-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT 85
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 85'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==66 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not cp85/release.html'
rel=p/'release.html'
def build():subprocess.run(['python',str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
G=p/f'boot{uat}';wrote=0
for k,b64 in files.items():
    b=base64.b64decode(b64);f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
print('boot folder',G,'files written',wrote)
if '--boot-only' in sys.argv:sys.exit(0)
for nm,how in [('checks86-on87.json','work/cp87/checks86-on87.cjs'),('checks-title87.json','work/cp57-title/checks-title87.cjs ../cp87/release.html ../cp86/release.html')]:
    c=json.loads((e/nm).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),'run '+how+' on this release.html first'
    assert c['passed'] is True and not c['failed'],(nm,c['failed'])
bt=json.loads((e/'real-browser-boot.json').read_text());st=json.loads(bt['state'])
assert bt['title'] and bt['play'] and not bt['errors'] and bt['build']==v['displayName'] and st['bottleArt'] and st['jackpot']==0.02,'real-browser boot failed'
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-64 Jackpot cascade + CP-57 title sound switch (Jenny, Nov 17: \"Publish Jackpot + title sound together as one UAT.\"); UAT only, on UAT 85"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
