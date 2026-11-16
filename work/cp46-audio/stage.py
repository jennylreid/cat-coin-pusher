# CP-46 staging: the new coin sounds and the warm whoosh pusher on top of the published UAT, as a game-only UAT update for
# installed APK7 (UAT 58's recipe: complete 37-file runtime in `files`, no embedded APK; UAT 24's runtime from its APK assets).
# Usage: python stage.py BASE_DIR   e.g. python stage.py ../cp59   (BASE_DIR holds the published base's release.html and
# publication-manifest.json). Version and name come from release-version.json here.
from pathlib import Path
import json,base64,hashlib,zipfile,subprocess,sys
p=Path(__file__).parent;r=p.parents[1];B=(p/sys.argv[1]).resolve()
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1];e=r/f'tickets/CP-46-evidence/uat{uat}';e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
pin=json.loads((B/'publication-manifest.json').read_text())  # the base is the published UAT now on the channel
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not the base build'
assert u['version']==pin['version'] and u['apkVersion']==7 and len(u['files'])==37 and v['version']>u['version'] and v['apkVersion']==7
rel=p/'release.html'
def build():subprocess.run(['python',str(p/'patch.py'),str(B/'release.html'),str(rel),v['displayName'],pin['releaseHTMLSHA256']],check=True);return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
c=json.loads((e/'checks-cp46.json').read_text(encoding='utf-8'));assert c['passed'] is True and not c['failed'] and c['build']==str(rel.resolve()),'run checks-cp46.cjs on this release.html first'
names=list(json.loads((r/'work/cp25/update-recovery/runtime-manifest.json').read_text()))
with zipfile.ZipFile(r/'uat/CatCoinPusher-UAT.apk') as z:
 assert z.read('assets/index.html')==(r/'work/cp25/installer-fix/release.html').read_bytes()
 assets=sorted(n[7:] for n in z.namelist() if n.startswith('assets/') and n[7:] not in ('version.txt','update-url.txt'))
 assert sorted(names)==assets and len(names)==37,(len(names),len(assets))
 files={n:base64.b64encode(h if n=='index.html' else z.read('assets/'+n)).decode() for n in names}
# every runtime file except index.html is the base's, byte for byte
for n in names:
 if n!='index.html':assert files[n]==u['files'][n],n
out={**u,**v,'apk':'','files':files};t=p/'CatCoinPusher-UAT-game.json'
t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<55_000_000
m={**v,'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),'jsonBytes':size,
   'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],
   'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':str(e.relative_to(r)).replace('\\','/'),
   'authorization':f"UAT {uat}: CP-46 Jenny's picks (Nov 14, via PM): all new coin sound sets in rotation at the auditioned levels; the warm whoosh (w5) replaces the pusher sound and its beat layer, 10 dB under the music, faster in Turbo; pickup sounds and music untouched; on {pin['displayName']}; UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
