# CP-87 UAT 107 staging, on published UAT 106 (from work/cp106-hug/stage.py): complete game-only update for installed APK7.
# Only index.html changes; the other runtime files are carried over byte for byte from the published UAT 106 JSON.
#   python stage.py --boot-only ; EXPECT_BUILD="2026.11.18 UAT 107" node homecheck.cjs cp107/boot107 ../../tickets/CP-87-evidence/uat107 ; python stage.py
from pathlib import Path
import json,base64,hashlib,subprocess,sys
p=Path(__file__).parent;r=p.parents[1]
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1]
B=p.parent/v['base'];pin=json.loads((B/'publication-manifest.json').read_text())
e=r/f'tickets/CP-87-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not '+pin['displayName']
assert v['baseSHA256']==pin['releaseHTMLSHA256'],'release-version.json base pin is not the published base'
u=json.loads(raw)
assert u['version']==pin['version'] and u['apkVersion']==7 and v['version']>u['version'] and v['apkVersion']==7
assert sha((B/'release.html').read_bytes())==pin['releaseHTMLSHA256']
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not the base release.html'
rel=p/'release.html'
def build():subprocess.run([sys.executable,str(p/'build.py')],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()
G=p/f'boot{uat}';wrote=0
for k,b64 in files.items():
    b=base64.b64decode(b64);f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
print('boot folder',G,'files written',wrote)
if '--boot-only' in sys.argv:sys.exit(0)
names=[f'checks{uat}.json']+sorted(f.name for f in e.glob(f'checks*-on{uat}.json'))
NEED=[f'checks{uat}.json',f'checks64-on{uat}.json'] # PM, Nov 18: the change's checks + one frozen-pickup suite + the real-browser boot; the rest run after publication
assert all(n in names for n in NEED),('missing results',names)
for name in names:
    c=json.loads((e/name).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),(name,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(name,c['failed'])
# real-browser boot + the Home button, on the full runtime folder (the index.html there is this release.html)
hc=json.loads((e/'homecheck.json').read_text(encoding='utf-8'))
assert hc['passed'] is True and not hc['failed'] and hc['build']==f'cp107/boot{uat}' and (G/'index.html').read_bytes()==h,'real-browser homecheck failed'
assert any(x['name'].endswith('build name') and x['ok'] and x['info']==v['displayName'] for x in hc['results']),'homecheck ran on another build'
out={**u,**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
assert size-len(raw)<1_000_000,('update grew too much',size-len(raw))
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'jsonGrowthBytes':size-len(raw),'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),'checks':names+['homecheck.json'],
   'authorization':f"UAT {uat}: CP-87 Daily puzzles button (Jenny, Nov 18, via PM: \"I think I should get the Codex daily puzzles into the build. Can you, in the build, in the UAT build, make another button for it on the home screen\"; \"We can put all the games in there.\"); PM: UAT only, build after \"channel is free\"; UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
