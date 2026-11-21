# UAT 139 staging (Prize art B, the Star bigger; on UAT 138; from work/cp138-bundle/stage.py): game-only update for installed APK7.
# index.html changes; the A prize art is dropped from the package (img/art/cp137: 9 review-2 sprites, 34 landing views, 4 diamond
# twinkle atlases; kept: the A rainbow, and the A diamond with its tilted views and their twinkles); nothing is added.
# Only index.html changes; every other runtime file is carried over byte for byte from the published base JSON.
#   python stage.py --boot-only ; node probe129.cjs boot130 <evidence> (real Chrome, touch) ; python checks130.py ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys
p=Path(__file__).parent;r=p.parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1]
B=p.parent/v['base'];pin=json.loads((B/'publication-manifest.json').read_text())
e=r/'tickets/CP-100-evidence/uat139';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not '+pin['displayName']
assert v['baseSHA256']==pin['releaseHTMLSHA256'],'release-version.json base pin is not the published base'
u=json.loads(raw)
assert u['version']==pin['version'] and u['apkVersion']==7 and v['version']>u['version'] and v['apkVersion']==7
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not the base release.html'
rel=p/'release.html'
def build():subprocess.run([sys.executable,str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
ADD=[];A11=['balloon_animal','cornflower','daisy','diamond','hydrangea','owl','oyster','rainbow','rose','sunflower','tulip']
KEEP={'img/art/cp137/'+f for f in ['rainbow.png','diamond.png','diamond-tilt-left.png','diamond-tilt-right.png','diamond-tilt-left-twinkle.png','diamond-tilt-right-twinkle.png']} # Jenny's exceptions: the A rainbow, the A diamond tilted with its twinkle
DROP=sorted(k for k in files if k.startswith('img/art/cp137/') and (k.rsplit('/',1)[1][:-4] in A11 or '-' in k.rsplit('/',1)[1]) and not k.rsplit('/',1)[1].startswith('cstar') and k not in KEEP)
assert len(DROP)==9+34+4,len(DROP)
for k in DROP:del files[k]
G=p/f'boot{uat}';wrote=0
for k,b64 in files.items():
    b=base64.b64decode(b64);f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
for f in [x for x in G.rglob('*') if x.is_file()]:
    if f.relative_to(G).as_posix() not in files:f.unlink()
print('boot folder',G,'files',len(files),'written',wrote)
if '--boot-only' in sys.argv:sys.exit(0)
NEED=['checks139.json']
for n in NEED:
    c=json.loads((e/n).read_text(encoding='utf-8'));assert Path(c['build']).resolve()==rel.resolve(),(n,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(n,c['failed'])
for z in ('412x915','360x640'):assert any(e.glob('*%s*.png'%z)),('missing homecheck stills',z)
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'baselineJSONBytes':len(raw),'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':ADD,'droppedRuntimeFiles':DROP,'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),'checks':NEED,
   'authorization':f"UAT {uat}: Prize art B for the new prizes (one way, sizes up to the shrimp; A rainbow and tilted A diamond), the rest of the A art and its pill removed, the Star bigger, paw save bats the prize to the middle (NEXT-ROUND 23-25); Jenny via the PM, Nov 21; UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps({k:m[k] for k in ('jsonBytes','baselineJSONBytes','runtimeFiles','stagedJSONSHA256')},indent=1))
