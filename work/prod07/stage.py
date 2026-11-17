# PROD-07 (CP-59 hotfix) staging: production game-only update for installed APK17. The published production 2026.11.16
# JSON (PROD-06) with only index.html replaced by work/prod07/release.html (PROD-06's index.html + the CP-59 fix).
# The other 39 runtime files are carried over byte for byte. Envelope fields are production's (channel catpusher,
# com.jenny.catpusher); no UAT field. No embedded APK: the native app does not change.
# Usage (from the CoinPusher folder): python work/prod07/stage.py   (run work/prod07/checks.cjs and checks-cp59.cjs first)
from pathlib import Path
import json, base64, hashlib, subprocess, sys
r = Path(__file__).resolve().parents[2]; p = Path(__file__).parent; e = r / 'tickets/CP-59-evidence/prod07'; e.mkdir(parents=True, exist_ok=True)
sha = lambda b: hashlib.sha256(b).hexdigest()
v = json.loads((p / 'release-version.json').read_text())
pin = json.loads((r / 'work/prod06/publication-manifest.json').read_text())
OLD_JSON = pin['stagedJSONSHA256']; OLD_APK = pin['productionAPKSHA256']
raw = (r / 'phone/CatCoinPusher-game.json').read_bytes(); apk = (r / 'CatCoinPusher.apk').read_bytes()
assert sha(raw) == OLD_JSON and sha(apk) == OLD_APK, 'production is not the published 2026.11.16 (PROD-06)'
old = json.loads(raw); assert old['version'] == 20261116171500 and old['apkVersion'] == 17 and old['channel'] == 'catpusher' and old['applicationId'] == 'com.jenny.catpusher'
assert v['version'] > old['version'] and v['apkVersion'] == 17 and len(old['files']) == 40
assert base64.b64decode(old['files']['index.html']) == (r / 'work/prod06/release.html').read_bytes(), 'published index.html is not work/prod06/release.html'
def build(): subprocess.run([sys.executable, str(p / 'prepare.py')], check=True); return (p / 'release.html').read_bytes()
h = build(); assert h == build(), 'build not reproducible'
for name in ('checks.json', 'checks-cp59.json'):
    c = json.loads((e / name).read_text(encoding='utf-8')); assert c['passed'] is True and not c['failed'] and Path(c['build']) == (p / 'release.html').resolve(), 'run the checks first: ' + name
files = dict(old['files']); files['index.html'] = base64.b64encode(h).decode()
out = {**old, 'version': v['version'], 'displayName': v['displayName'], 'files': files}
assert set(out) == set(old), 'envelope fields differ from production'
t = p / 'CatCoinPusher-game.json'; t.write_bytes(json.dumps(out, separators=(',', ':')).encode('utf-8')); size = t.stat().st_size; assert size < 60_000_000
m = {**v, 'baselineJSONSHA256': OLD_JSON, 'productionAPKSHA256': OLD_APK, 'stagedJSONSHA256': sha(t.read_bytes()), 'releaseHTMLSHA256': sha(h),
     'sourceHTML': 'work/prod06/release.html', 'sourceHTMLSHA256': pin['releaseHTMLSHA256'], 'jsonBytes': size, 'runtimeFiles': len(files),
     'changedRuntimeFiles': ['index.html'], 'unchangedRuntimeFilesMatchProduction20261116': len(files) - 1, 'embeddedAPKBytes': 0, 'nativeChange': False,
     'updateURL': 'production (work/prod04/download-url.txt, APK17 assets/update-url.txt)',
     'backup': f"backups/before-PROD-07-{v['version']}", 'evidence': e.relative_to(r).as_posix(),
     'authorization': 'Jenny, Nov 16, 2026 (via PM): "CP-59: fix it now in UAT, then hotfix production with only the fix."; UAT sign-off on UAT 74 (includes UAT 73\'s fix): "Dance break looks good."'}
(p / 'publication-manifest.json').write_text(json.dumps(m, indent=2)); (e / 'package-verification.json').write_text(json.dumps(m, indent=2)); print(json.dumps(m, indent=2))
