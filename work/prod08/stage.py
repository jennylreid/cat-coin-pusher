# PROD-08 staging: production game-only update for installed APK17 = UAT 89's 70-file runtime with index.html replaced by
# work/prod08/release.html (UAT 89 + the production adaptations). The 40 files production already has must be production's
# byte for byte (they are identical in UAT 89); the 30 new art files are UAT 89's byte for byte. Envelope fields are
# production's (channel catpusher, com.jenny.catpusher, apkVersion 17, apk empty); no UAT field. Native unchanged.
# Usage (from the CoinPusher folder): python work/prod08/stage.py   (run work/prod08/checks.cjs, checks-uat89.cjs and the boot check first)
from pathlib import Path
import json, base64, hashlib, subprocess, sys
r = Path(__file__).resolve().parents[2]; p = Path(__file__).parent; e = r / 'tickets/PROD-08-evidence'; e.mkdir(parents=True, exist_ok=True)
sha = lambda b: hashlib.sha256(b).hexdigest()
v = json.loads((p / 'release-version.json').read_text())
pin = json.loads((r / 'work/prod07/publication-manifest.json').read_text())
upin = json.loads((r / 'work/cp89/publication-manifest.json').read_text())
OLD_JSON = pin['stagedJSONSHA256']; OLD_APK = pin['productionAPKSHA256']
raw = (r / 'phone/CatCoinPusher-game.json').read_bytes(); apk = (r / 'CatCoinPusher.apk').read_bytes()
assert sha(raw) == OLD_JSON and sha(apk) == OLD_APK, 'production is not the published 2026.11.16.2 (PROD-07)'
old = json.loads(raw); assert old['version'] == 20261116235000 and old['apkVersion'] == 17 and old['channel'] == 'catpusher' and old['applicationId'] == 'com.jenny.catpusher' and old['apk'] == ''
assert v['version'] > old['version'] and v['apkVersion'] == 17 and len(old['files']) == 40
uraw = (r / 'uat/CatCoinPusher-UAT-game.json').read_bytes(); assert sha(uraw) == upin['stagedJSONSHA256'], 'UAT is not the published UAT 89'
u = json.loads(uraw); assert u['version'] == 20261118000000 and len(u['files']) == 70
assert base64.b64decode(u['files']['index.html']) == (r / 'work/cp89/release.html').read_bytes()
def build(): subprocess.run([sys.executable, str(p / 'prepare.py')], check=True, capture_output=True); return (p / 'release.html').read_bytes()
h = build(); assert h == build(), 'build not reproducible'
for name in ('checks.json', 'checks-uat89.json', 'bootcheck.json'):
    c = json.loads((e / name).read_text(encoding='utf-8')); assert c['passed'] is True and not c.get('failed') and Path(c['build']).resolve() == (p / 'release.html').resolve(), 'run the checks first: ' + name
same = [k for k in old['files'] if k != 'index.html']; assert all(old['files'][k] == u['files'][k] for k in same), 'a shared runtime file differs between production and UAT 89'
added = sorted(set(u['files']) - set(old['files'])); assert all(k.startswith('img/art/') for k in added) and len(added) == 30
files = dict(u['files']); files['index.html'] = base64.b64encode(h).decode()
out = {**old, 'version': v['version'], 'displayName': v['displayName'], 'files': files}
assert set(out) == set(old), 'envelope fields differ from production'
t = p / 'CatCoinPusher-game.json'; t.write_bytes(json.dumps(out, separators=(',', ':')).encode('utf-8')); size = t.stat().st_size; assert size < 60_000_000
m = {**v, 'baselineJSONSHA256': OLD_JSON, 'productionAPKSHA256': OLD_APK, 'uatJSONSHA256': upin['stagedJSONSHA256'], 'uatAPKSHA256': upin['apkSHA256'],
     'stagedJSONSHA256': sha(t.read_bytes()), 'releaseHTMLSHA256': sha(h),
     'sourceHTML': 'work/cp89/release.html', 'sourceHTMLSHA256': upin['releaseHTMLSHA256'], 'jsonBytes': size, 'runtimeFiles': len(files),
     'changedRuntimeFiles': ['index.html'], 'addedRuntimeFilesFromUAT89': added, 'unchangedRuntimeFilesMatchProduction': len(same), 'embeddedAPKBytes': 0, 'nativeChange': False,
     'updateURL': 'production (work/prod04/download-url.txt, APK17 assets/update-url.txt)',
     'backup': f"backups/before-PROD-08-{v['version']}", 'evidence': e.relative_to(r).as_posix(),
     'authorization': 'Jenny, Nov 17, 2026: "CP-62 passes. Production update: go with CP-54, 56, 57, 58, 61, 62, 63, 64, 69."'}
(p / 'publication-manifest.json').write_text(json.dumps(m, indent=2)); (e / 'package-verification.json').write_text(json.dumps(m, indent=2)); print(json.dumps({k: m[k] for k in m if k != 'addedRuntimeFilesFromUAT89'}, indent=2))
