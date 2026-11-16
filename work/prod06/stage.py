# PROD-06 staging: production game-only update for installed APK17. Complete 40-file runtime in `files`: index.html is
# work/prod06/release.html (UAT 70 + the PROD-05 production adaptations); 36 files are production APK17's own assets,
# byte for byte (also identical to UAT 70's); the 3 CP-52 prize paintings (img/art/cp52-*.png) come from the published
# UAT 70 JSON byte for byte. Envelope fields are production's (channel catpusher, com.jenny.catpusher); no UAT field is
# carried. No embedded APK: the native app does not change (APK17's unpackGame writes any file listed in `files`).
# Usage (from the CoinPusher folder): python work/prod06/stage.py   (run work/prod06/checks.cjs first)
from pathlib import Path
import json, base64, hashlib, zipfile, subprocess, sys
r = Path(__file__).resolve().parents[2]; p = Path(__file__).parent; e = r / 'tickets/PROD-06-evidence'; e.mkdir(exist_ok=True)
sha = lambda b: hashlib.sha256(b).hexdigest()
v = json.loads((p / 'release-version.json').read_text())
OLD_JSON = '3b598d444a2fe2d8dad59fbded64215b2dfe392e1a6ec4d555506ed413a4f8dc'; OLD_APK = 'df205863d0bf755276f7f4acf301b3c573788ccef09b8f8bc0cd0263121e8e45'
UAT70_JSON = '0307ee8e7909a762c66d96a10c725fc7f121d22d719e2e3980ccc3b5a9104afd'
ART = ['img/art/cp52-ball.png', 'img/art/cp52-cushion.png', 'img/art/cp52-feather.png']
raw = (r / 'phone/CatCoinPusher-game.json').read_bytes(); apk = (r / 'CatCoinPusher.apk').read_bytes()
assert sha(raw) == OLD_JSON and sha(apk) == OLD_APK, 'production is not the 2026.11.15 release (PROD-05)'
old = json.loads(raw); assert old['version'] == 20261115224800 and old['apkVersion'] == 17 and old['channel'] == 'catpusher' and old['applicationId'] == 'com.jenny.catpusher'
assert v['version'] > old['version'] and v['apkVersion'] == 17
uraw = (r / 'uat/CatCoinPusher-UAT-game.json').read_bytes(); assert sha(uraw) == UAT70_JSON, 'UAT channel is not UAT 70'
u = json.loads(uraw); assert u['version'] == 20261116200000 and len(u['files']) == 40
def build(): subprocess.run([sys.executable, str(p / 'prepare.py')], check=True); return (p / 'release.html').read_bytes()
h = build(); assert h == build(), 'build not reproducible'
c = json.loads((e / 'checks.json').read_text(encoding='utf-8')); assert c['passed'] is True and not c['failed'] and Path(c['build']) == (p / 'release.html').resolve(), 'run checks.cjs first'
with zipfile.ZipFile(r / 'CatCoinPusher.apk') as z:
    assets = {n[7:]: z.read(n) for n in z.namelist() if n.startswith('assets/') and not n.endswith('/') and n[7:] not in ('version.txt', 'update-url.txt')}
    url = z.read('assets/update-url.txt').decode().strip()
assert len(assets) == 37 and sorted(list(assets) + ART) == sorted(u['files'])
assert url == (r / 'work/prod04/download-url.txt').read_text().strip()
for n in assets:
    if n != 'index.html': assert base64.b64decode(u['files'][n]) == assets[n], n
for n in ART: assert base64.b64decode(u['files'][n]) == (p / 'art' / Path(n).name).read_bytes(), n
files = {n: (base64.b64encode(h).decode() if n == 'index.html' else base64.b64encode(assets[n]).decode() if n in assets else u['files'][n]) for n in u['files']}
out = {'version': v['version'], 'files': files, 'apkVersion': 17, 'apk': '', 'displayName': v['displayName'], 'channel': 'catpusher', 'applicationId': 'com.jenny.catpusher'}
assert set(out) == set(old), 'envelope fields differ from production'
t = p / 'CatCoinPusher-game.json'; t.write_bytes(json.dumps(out, separators=(',', ':')).encode('utf-8')); size = t.stat().st_size; assert size < 60_000_000
m = {**v, 'baselineJSONSHA256': OLD_JSON, 'productionAPKSHA256': OLD_APK, 'uat70JSONSHA256': UAT70_JSON, 'stagedJSONSHA256': sha(t.read_bytes()), 'releaseHTMLSHA256': sha(h),
     'sourceHTML': 'work/cp70/release.html', 'sourceHTMLSHA256': '8cf3e466bb221d5481ad958380d924e767f9687d549dab0cd09c19135757c91f', 'jsonBytes': size, 'runtimeFiles': len(files),
     'changedRuntimeFiles': ['index.html'], 'addedRuntimeFiles': ART, 'addedFilesSHA256': {n: sha(base64.b64decode(u['files'][n])) for n in ART},
     'unchangedRuntimeFilesMatchAPK17AndUAT70': 36, 'embeddedAPKBytes': 0, 'nativeChange': False, 'updateURL': 'production (work/prod04/download-url.txt, APK17 assets/update-url.txt)',
     'backup': f"backups/before-PROD-06-{v['version']}", 'evidence': e.relative_to(r).as_posix(),
     'authorization': 'Jenny, Nov 16, 2026: "promote CP-49, CP-50, CP-51, CP-52 to production." = UAT 70 (20261116200000) on Baseline 1'}
(p / 'publication-manifest.json').write_text(json.dumps(m, indent=2)); (e / 'package-verification.json').write_text(json.dumps(m, indent=2)); print(json.dumps(m, indent=2))
