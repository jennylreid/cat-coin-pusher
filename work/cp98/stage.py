# CP-72 showing-off hang staging (UAT 98), on published UAT 97 (from work/cp97/stage.py): complete game-only update for installed APK7.
# Only index.html changes; the other 77 runtime files are carried over byte for byte from the published UAT 97 JSON.
# Lays the runtime out in boot96/ for the real-browser boot check:
#   python stage.py --boot-only ; node powercheck.cjs boot98 > <evidence>/real-browser-boot.json ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys
p=Path(__file__).parent;r=p.parents[1];B=p.parent/'cp97'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-72-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT 97
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not UAT 97'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==78 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not cp97/release.html'
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
for name in ('checks98.json','checks97-on98.json','checks75-on98.json','checks94-on98.json','checks93-on98.json','checks92-on98.json','checks72-on98.json','checks71-on98.json','checks64-on98.json'):
    c=json.loads((e/name).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),(name,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(name,c['failed'])
bt=json.loads((e/'real-browser-boot.json').read_text().strip().splitlines()[-1])
assert bt['title'] and bt['play'] and not bt['errors'] and bt['build']==v['displayName'] and bt.get('started') and bt.get('power') and bt.get('yawn') and bt.get('cp78'),'real-browser boot/power/yawn/CP-78 failed'
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),
   'authorization':f"UAT {uat}: CP-72 hang rework (Jenny, Nov 18: \"CP-72 hang UAT 96: rework. During the hang the ginger kitten moves toward the middle of the screen and tilts about 20 degrees, for extra crazy energy. Rest unchanged. Next UAT after 97. Yes, we'll try it.\"; \"It knows it's cute, so it kind of puts itself right in your face for a second.\" \"Showing off is a good way to frame it.\"; PM go after UAT 97 was out); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
