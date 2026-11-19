# CP-79 Yawn sound + CP-80 Siamese dev wheel staging (UAT 99), on published UAT 98 (from work/cp96/stage.py): complete game-only update for installed APK7.
# Only index.html changes (the 3 sounds are embedded in it); the other runtime files are carried over byte for byte from the
# published UAT 98 JSON. Lays the runtime out in boot99/ for the real-browser check:
#   python stage.py --boot-only ; PORT=8797 node yawncheck.cjs boot99 > <evidence>/real-browser-boot.json ; python stage.py
# Preparation (before UAT 98 is out): DEV=1 python stage.py --boot-only -> boot99dev/ from the published UAT 96 package
# (work/cp96/CatCoinPusher-UAT-game.json) with release-dev.html; never published.
from pathlib import Path
import json,base64,hashlib,subprocess,sys,os
p=Path(__file__).parent;r=p.parents[1];DEV=os.environ.get('DEV')=='1'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1]
B=p.parent/('cp96' if DEV else v['base']);pin=json.loads((B/'publication-manifest.json').read_text())
e=r/(f'tickets/CP-79-evidence/uat{uat}'+('-dev' if DEV else ''));e.mkdir(parents=True,exist_ok=True)
if DEV:raw=(B/'CatCoinPusher-UAT-game.json').read_bytes();assert sha(raw)==pin['stagedJSONSHA256'],'cp96 package changed'
else:
    raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
    assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not '+pin['displayName']
    assert v['baseSHA256']==pin['releaseHTMLSHA256'],'release-version.json base pin is not the published base'
u=json.loads(raw)
assert u['version']==pin['version'] and u['apkVersion']==7 and (DEV or v['version']>u['version']) and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not the base release.html'
rel=p/('release-dev.html' if DEV else 'release.html')
def build():subprocess.run(['python',str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
G=p/(f'boot{uat}'+('dev' if DEV else ''));wrote=0
for k,b64 in files.items():
    b=base64.b64decode(b64);f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
print('boot folder',G,'files written',wrote)
if '--boot-only' in sys.argv or DEV:sys.exit(0)
names=['checks79.json','checks80.json','checks72z.json','checks72s.json']+sorted(f.name for f in e.glob('checks*-on99.json'))
assert len(names)>=13,('missing regression results',names)
for name in names:
    c=json.loads((e/name).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),(name,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(name,c['failed'])
bt=json.loads((e/'real-browser-boot.json').read_text().strip().splitlines()[-1])
assert bt['title'] and bt['play'] and not bt['errors'] and bt['build']==v['displayName'] and bt.get('cp79') and bt.get('cp72z'),'real-browser boot/yawn/zoomies sound check failed'
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),'checks':names,
   'authorization':f"UAT {uat}: CP-79 Yawn sound as a Developer choice (Jenny, Nov 18, via PM: \"CP-79 Yawn sound: put today, A2, B2 and AB in the next UAT as a Developer choice (today's is the default). I'll pick on my phone.\"; CP-80 Developer wheel on the Siamese (PM go, Nov 18); CP-72 Zoomies sound (\"Pusher sound: replace the turbo rev with the sound of coins being pushed; 2-3 real candidates as a Developer choice next to today's, I pick on my phone.\") and \"remove the gold streaks\"); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
