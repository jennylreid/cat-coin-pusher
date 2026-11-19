# CP-90 Zoomies painted kittens UAT 117 staging (from work/cp116/stage.py): complete game-only update for installed APK7, on the
# base in release-version.json. index.html changes and 3 art files are added (img/art/cp90-*.webp from art/, lossless copies of
# work/cp90-kittens/*.png); the other runtime files are carried over byte for byte from the published UAT 116 JSON.
#   python stage.py --boot-only ; (checks + real Chrome kitcheck.cjs) ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys,os
p=Path(__file__).parent;r=p.parents[1];DEV=os.environ.get('DEV')=='1'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1]
B=p.parent/('cp96' if DEV else v['base']);pin=json.loads((B/'publication-manifest.json').read_text())
e=r/(f'tickets/CP-90-evidence/uat{uat}'+('-dev' if DEV else ''));e.mkdir(parents=True,exist_ok=True)
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
from PIL import Image
ADDED={}
for n in ['ginger-run','cream-run','ginger-peek']:
    k='img/art/cp90-'+n+'.webp';assert k not in u['files'],k;b=(p/'art'/('cp90-'+n+'.webp')).read_bytes()
    assert Image.open(p/'art'/('cp90-'+n+'.webp')).convert('RGBA').tobytes()==Image.open(p.parent/'cp90-kittens'/(n+'.png')).convert('RGBA').tobytes(),'art not pixel-identical: '+n
    files[k]=base64.b64encode(b).decode();ADDED[k]=sha(b)
G=p/(f'boot{uat}'+('dev' if DEV else ''));wrote=0
for k,b64 in files.items():
    b=base64.b64decode(b64);f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
print('boot folder',G,'files written',wrote)
if '--boot-only' in sys.argv or DEV:sys.exit(0)
names=sorted(f.name for f in e.glob('checks*-on117.json'))+['checks90.json']
NEED=['checks90.json','checks64-on117.json','checks72-on117.json','checks94-on117.json'] # this ticket's checks + the frozen pickup + the Zoomies suites; the rest run after publication
assert all(n in names for n in NEED),('missing results',names)
for name in names:
    c=json.loads((e/name).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),(name,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(name,c['failed'])
kc=json.loads((e/'real-browser-boot.json').read_text().strip().splitlines()[-1])
assert kc['title'] and kc['play'] and not kc['errors'] and kc['build']==v['displayName'] and kc.get('cp90'),'real-browser boot / Zoomies kittens check failed'
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':ADDED,'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),'checks':names,
   'authorization':f"UAT {uat}: CP-90 Zoomies painted kittens as a Developer choice, Painted default, the puff original (PM, Nov 19, Jenny's words: \"I prefer the original Ginger Puff cat.\" / \"I need to see both. I need to see them in action as well.\"; PM: \"Do (UAT 117, on UAT 116)\"); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
