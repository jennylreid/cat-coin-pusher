# PROD-05 staging: production game-only update for installed APK17. Complete 37-file runtime in `files`: index.html is
# work/prod05/release.html (UAT 64 + production adaptations); the other 36 files are production APK17's own assets,
# byte for byte (also identical to UAT 64's). Envelope fields come from the current production JSON (channel catpusher,
# com.jenny.catpusher); no UAT field is carried. No embedded APK: the native app does not change.
# Usage (from the CoinPusher folder): python work/prod05/stage.py
from pathlib import Path
import json, base64, hashlib, zipfile, subprocess, sys
r = Path(__file__).resolve().parents[2]; p = Path(__file__).parent; e = r / 'tickets/PROD-05-evidence'; e.mkdir(exist_ok=True)
sha = lambda b: hashlib.sha256(b).hexdigest()
v = json.loads((p / 'release-version.json').read_text())
OLD_JSON = '0f4177067aef5fb39f1fa82a8c2bc1e39d70634166f2bcfa3366998b3a9a145b'; OLD_APK = 'df205863d0bf755276f7f4acf301b3c573788ccef09b8f8bc0cd0263121e8e45'
UAT64_JSON = 'eeb5a40bc486ae10986dcedfe0c878c23ba0e32a2f4c5f50bf4b92c52e317607'
raw = (r / 'phone/CatCoinPusher-game.json').read_bytes(); apk = (r / 'CatCoinPusher.apk').read_bytes()
assert sha(raw) == OLD_JSON and sha(apk) == OLD_APK, 'production is not the Oct 31 release'
old = json.loads(raw); assert old['version'] == 20261031103610 and old['apkVersion'] == 17 and old['channel'] == 'catpusher' and old['applicationId'] == 'com.jenny.catpusher'
assert v['version'] > old['version'] and v['apkVersion'] == 17
uraw = (r / 'uat/CatCoinPusher-UAT-game.json').read_bytes(); assert sha(uraw) == UAT64_JSON, 'UAT channel is not UAT 64'
u = json.loads(uraw)
def build(): subprocess.run([sys.executable, str(p / 'prepare.py')], check=True); return (p / 'release.html').read_bytes()
h = build(); assert h == build(), 'build not reproducible'
c = json.loads((e / 'checks.json').read_text(encoding='utf-8')); assert c['passed'] is True and not c['failed'] and Path(c['build']) == (p / 'release.html').resolve(), 'run checks.cjs first'
with zipfile.ZipFile(r / 'CatCoinPusher.apk') as z:
    assets = {n[7:]: z.read(n) for n in z.namelist() if n.startswith('assets/') and not n.endswith('/') and n[7:] not in ('version.txt', 'update-url.txt')}
    url = z.read('assets/update-url.txt').decode().strip()
assert sorted(assets) == sorted(u['files']) and len(assets) == 37
assert url == (r / 'work/prod04/download-url.txt').read_text().strip()
for n in assets:
    if n != 'index.html': assert base64.b64decode(u['files'][n]) == assets[n], n
files = {n: base64.b64encode(h if n == 'index.html' else assets[n]).decode() for n in sorted(u['files'], key=list(u['files']).index)}
out = {'version': v['version'], 'files': files, 'apkVersion': 17, 'apk': '', 'displayName': v['displayName'], 'channel': 'catpusher', 'applicationId': 'com.jenny.catpusher'}
t = p / 'CatCoinPusher-game.json'; t.write_bytes(json.dumps(out, separators=(',', ':')).encode('utf-8')); size = t.stat().st_size; assert size < 60_000_000
m = {**v, 'baselineJSONSHA256': OLD_JSON, 'productionAPKSHA256': OLD_APK, 'uat64JSONSHA256': UAT64_JSON, 'stagedJSONSHA256': sha(t.read_bytes()), 'releaseHTMLSHA256': sha(h),
     'sourceHTMLSHA256': '230a9d7ee2b5259820cfe09678f0854524f6228970a4bc27585c66482238987d', 'jsonBytes': size, 'runtimeFiles': len(files), 'changedRuntimeFiles': ['index.html'],
     'unchangedRuntimeFilesMatchAPK17AndUAT64': 36, 'embeddedAPKBytes': 0, 'nativeChange': False, 'updateURL': 'production (work/prod04/download-url.txt, APK17 assets/update-url.txt)',
     'backup': f"backups/before-PROD-05-{v['version']}", 'evidence': e.relative_to(r).as_posix(),
     'authorization': 'Jenny, Nov 15, 2026: "Go: promote UAT 64 to production as is." Baseline 1 = UAT 64 (20261115190000): CP-24, CP-33 to CP-38, CP-40 to CP-48'}
(p / 'publication-manifest.json').write_text(json.dumps(m, indent=2)); (e / 'package-verification.json').write_text(json.dumps(m, indent=2)); print(json.dumps(m, indent=2))
