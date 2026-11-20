# CP-83 UAT 109 staging (Home > Board lab + round 3), on the published base (from work/cp104-lab/stage.py): complete game-only update for installed APK7.
# Only index.html changes; the other runtime files are carried over byte for byte from the published UAT 101 JSON.
#   python stage.py --boot-only ; REVIEW_PORT=8797 node labcheck.cjs boot109 > <evidence>/real-browser-boot.json ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys,os
p=Path(__file__).parent;r=p.parents[1];DEV=os.environ.get('DEV')=='1'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1]
B=p.parent/('cp96' if DEV else v['base']);pin=json.loads((B/'publication-manifest.json').read_text())
e=r/(f'tickets/CP-83-evidence/uat{uat}'+('-dev' if DEV else ''));e.mkdir(parents=True,exist_ok=True)
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
names=['checks109.json']+sorted(f.name for f in e.glob('checks*-on109.json'))
NEED=['checks109.json','checks64-on109.json'] # CP-83 brief: the change's checks + one frozen-pickup suite + the real-browser boot; the rest run after publication
assert all(n in names for n in NEED),('missing results',names)
for name in names:
    c=json.loads((e/name).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),(name,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(name,c['failed'])
bt=json.loads((e/'real-browser-boot.json').read_text().strip().splitlines()[-1])
assert bt['title'] and bt['play'] and not bt['errors'] and bt['build']==v['displayName'] and bt.get('cp83'),'real-browser boot/Board lab check failed'
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),'checks':names,
   'authorization':f"UAT {uat}: CP-83 Home > Board lab + round 3 Pusher chains (Jenny, Nov 18: \"Just give me a button on the home screen with all the lab boards so I can work through them all, please.\"; \"Let's go with A, please, for CP 83.\"); PM: \"Yours is UAT 109, built on 108\"; UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
