# CP-72 add-ons staging (UAT 94), on published UAT 93 (copied from work/cp93/stage.py): complete game-only update for installed APK7.
# Only index.html changes; the other 69 runtime files are carried over byte for byte from the published UAT 93 JSON.
# Lays the runtime out in boot90/ for the real-browser boot check:
#   python stage.py --boot-only ; node powercheck.cjs boot94 > <evidence>/real-browser-boot.json ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp93'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-72-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT 93
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 93'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==70 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not cp93/release.html'
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
for name in ('checks94.json','checks93-on94.json','checks92-on94.json','checks72-on94.json','checks71-on94.json','checks64-on94.json'):
    c=json.loads((e/name).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),(name,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(name,c['failed'])
bt=json.loads((e/'real-browser-boot.json').read_text().strip().splitlines()[-1])
assert bt['title'] and bt['play'] and not bt['errors'] and bt['build']==v['displayName'] and bt.get('started') and bt.get('power'),'real-browser boot/power failed'
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<56_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-72 add-ons (Jenny, Nov 18: \"we have a similar problem to formal inspection with the words Zoomies getting in the way of the actual animation. So I'd like to have the announcement of what's coming, or the title, and then the animation without words over top of it.\" and \"CP-72 Zoomies: in the final leap toward the player, one kitten poofs again (fur straight out). Same UAT as the title fix.\"); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
