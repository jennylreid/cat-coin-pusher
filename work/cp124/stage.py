# CP-96 Sleepy Coins in Daily puzzles, UAT 124 staging (from work/cp123/stage.py): complete game-only update for installed APK7, on the base in release-version.json.
# Only index.html changes; every other runtime file is carried over byte for byte from the published UAT 123 JSON.
#   python stage.py --boot-only ; run-pre.sh (checks124, homecheck on boot124, frozen pickup, 92e, 93g, 97s) ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys
p=Path(__file__).parent;r=p.parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1]
B=p.parent/v['base'];pin=json.loads((B/'publication-manifest.json').read_text())
e=r/f'tickets/CP-96-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
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
G=p/f'boot{uat}';wrote=0
for k,b64 in files.items():
    b=base64.b64decode(b64);f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
for f in [x for x in G.rglob('*') if x.is_file()]:
    if f.relative_to(G).as_posix() not in files:f.unlink()
print('boot folder',G,'files',len(files),'written',wrote)
if '--boot-only' in sys.argv:sys.exit(0)
NEED=['checks124.json','checks64-on124.json','checks92e-on124.json','checks93g-on124.json','checks97s-on124.json']
for n in NEED:
    c=json.loads((e/n).read_text(encoding='utf-8'));assert Path(c['build']).resolve()==rel.resolve(),(n,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(n,c['failed'])
hc=json.loads((e/'homecheck.json').read_text(encoding='utf-8'));assert hc['passed'] and not hc['failed'] and hc['build']==f'cp124/boot{uat}','homecheck failed or not on this boot folder'
for z in ('412x915','360x640'):assert any(e.glob('*%s*.png'%z)),('missing homecheck stills',z)
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'baselineJSONBytes':len(raw),'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),'checks':NEED+['homecheck.json'],
   'authorization':f"UAT {uat}: CP-96 Sleepy Coins added to Home > Daily puzzles, the three CP-85 puzzles removed, 9x12 grid (Jenny via PM, Nov 19: \"Let's add that one to the daily puzzles\", \"load sleepy coins into the next build so I can test it\"; PM, Nov 19: \"Rebase Sleepy Coins on 123 ... Stage (report the bytes), publish UAT 124 and verify the cloud copy\"); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps({k:m[k] for k in ('jsonBytes','baselineJSONBytes','runtimeFiles','stagedJSONSHA256')},indent=1))
