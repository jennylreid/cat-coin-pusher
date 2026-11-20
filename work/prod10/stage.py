# PROD-10 staging (prepared, NOT run against production until Jenny's sign-off via the PM): production game-only update for
# installed APK17 = UAT 134's 76-file runtime with index.html replaced by work/prod10/release.html (UAT 134 + the production
# adaptations). Since PROD-09 the runtime changed in UAT: 11 shared files differ (newer art), 1 added (paw-dance.flac), 3 dropped
# (head-waiting.webp, uat18-soft-paw.png, paw-dance.wav); production takes UAT 134's set byte for byte. Envelope fields are
# production's (channel catpusher, com.jenny.catpusher, apkVersion 17, apk empty); no UAT field. Native unchanged.
# Usage (from the CoinPusher folder): python work/prod10/stage.py   (run work/prod10's production checks and the boot check first)
from pathlib import Path
import json, base64, hashlib, subprocess, sys
r = Path(__file__).resolve().parents[2]; p = Path(__file__).parent; e = r / 'tickets/PROD-10-evidence'; e.mkdir(parents=True, exist_ok=True)
sha = lambda b: hashlib.sha256(b).hexdigest()
v = json.loads((p / 'release-version.json').read_text())
pin = json.loads((r / 'work/prod09/publication-manifest.json').read_text())
upin = json.loads((r / 'work/cp134-bundle/publication-manifest.json').read_text())
OLD_JSON = pin['stagedJSONSHA256']; OLD_APK = pin['productionAPKSHA256']
raw = (r / 'phone/CatCoinPusher-game.json').read_bytes(); apk = (r / 'CatCoinPusher.apk').read_bytes()
assert sha(raw) == OLD_JSON and sha(apk) == OLD_APK, 'production is not the published 2026.11.18 (PROD-09)'
old = json.loads(raw); assert old['version'] == 20261118200000 and old['apkVersion'] == 17 and old['channel'] == 'catpusher' and old['applicationId'] == 'com.jenny.catpusher' and old['apk'] == ''
assert v['version'] > old['version'] and v['apkVersion'] == 17 and len(old['files']) == 78
uraw = (r / 'uat/CatCoinPusher-UAT-game.json').read_bytes(); assert sha(uraw) == upin['stagedJSONSHA256'], 'UAT is not the published UAT 134'
u = json.loads(uraw); assert u['version'] == 20261119000045 and len(u['files']) == 76
assert base64.b64decode(u['files']['index.html']) == (r / 'work/cp134-bundle/release.html').read_bytes()
def build(): subprocess.run([sys.executable, str(p / 'prepare.py')], check=True, capture_output=True); return (p / 'release.html').read_bytes()
h = build(); assert h == build(), 'build not reproducible'
for name in ('checks.json', 'bootcheck.json'):
    c = json.loads((e / name).read_text(encoding='utf-8')); assert c['passed'] is True and not c.get('failed') and Path(c['build']).resolve() == (p / 'release.html').resolve(), 'run the checks first: ' + name
same = [k for k in old['files'] if k != 'index.html' and k in u['files'] and old['files'][k] == u['files'][k]]; dropped = sorted(set(old['files']) - set(u['files'])); changed = sorted(k for k in old['files'] if k != 'index.html' and k in u['files'] and old['files'][k] != u['files'][k])
assert dropped == ['img/art/head-waiting.webp', 'img/art/uat18-soft-paw.png', 'sounds/effects/paw-dance.wav'] and len(changed) == 11, (dropped, changed)
added = sorted(set(u['files']) - set(old['files'])); assert added == ['sounds/effects/paw-dance.flac'], added
files = dict(u['files']); files['index.html'] = base64.b64encode(h).decode()
out = {**old, 'version': v['version'], 'displayName': v['displayName'], 'files': files}
assert set(out) == set(old), 'envelope fields differ from production'
t = p / 'CatCoinPusher-game.json'; t.write_bytes(json.dumps(out, separators=(',', ':')).encode('utf-8')); size = t.stat().st_size; assert size < 60_000_000
m = {**v, 'baselineJSONSHA256': OLD_JSON, 'productionAPKSHA256': OLD_APK, 'uatJSONSHA256': upin['stagedJSONSHA256'], 'uatAPKSHA256': upin['apkSHA256'],
     'stagedJSONSHA256': sha(t.read_bytes()), 'releaseHTMLSHA256': sha(h),
     'sourceHTML': 'work/cp134-bundle/release.html', 'sourceHTMLSHA256': upin['releaseHTMLSHA256'], 'jsonBytes': size, 'runtimeFiles': len(files),
     'changedRuntimeFiles': ['index.html'] + changed, 'addedRuntimeFilesFromUAT134': added, 'droppedRuntimeFiles': dropped, 'unchangedRuntimeFilesMatchProduction': len(same), 'embeddedAPKBytes': 0, 'nativeChange': False,
     'updateURL': 'production (work/prod04/download-url.txt, APK17 assets/update-url.txt)',
     'backup': f"backups/before-PROD-10-{v['version']}", 'evidence': e.relative_to(r).as_posix(),
     'authorization': "Jenny, Nov 20, 2026, via the PM, on UAT 134: 'Hug takes me to Ragdoll on the main board. Pass, we're ready.' (promote UAT 134 to production; Goal boards off by the build name)"}
assert not m['authorization'].startswith('PENDING'), "fill in Jenny's sign-off (her words) before staging"
(p / 'publication-manifest.json').write_text(json.dumps(m, indent=2)); (e / 'package-verification.json').write_text(json.dumps(m, indent=2)); print(json.dumps({k: m[k] for k in m if k != 'addedRuntimeFilesFromUAT134'}, indent=2))
