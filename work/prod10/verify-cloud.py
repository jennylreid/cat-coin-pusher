# PROD-10 (production update, UAT 134 scope): download phone/CatCoinPusher-game.json fresh from the production share link and check it is what was published.
import urllib.request, hashlib, json, time, base64
from pathlib import Path
root = Path(__file__).resolve().parents[2]; stage = Path(__file__).parent
m = json.loads((stage / 'publication-manifest.json').read_text())
url = (root / 'work/prod04/download-url.txt').read_text().strip()
url += ('&' if '?' in url else '?') + 'prod10verify=' + str(time.time_ns())
req = urllib.request.Request(url, headers={'Cache-Control': 'no-cache, no-store, max-age=0'})
with urllib.request.urlopen(req, timeout=60) as resp:
    raw = resp.read(); digest = hashlib.sha256(raw).hexdigest(); etag = resp.headers.get('ETag', '')
    if digest != m['stagedJSONSHA256']:
        print(json.dumps({'status': 'cloud bytes not yet current', 'observedSHA256': digest, 'expected': m['stagedJSONSHA256'], 'bytes': len(raw), 'etag': etag})); raise SystemExit(2)
    o = json.loads(raw)
    # the production app's own checks (CloudUpdate.read, UpdatePolicy.decide, unpackGame)
    assert o['channel'] == 'catpusher' and o['applicationId'] == 'com.jenny.catpusher' and o['apkVersion'] == 17 and o['version'] == m['version'] and o["version"] > 20261118200000
    assert 'index.html' in o['files'] and 'lib/rapier.js' in o['files'] and len(o['files']) == 76 and all(k in o['files'] for k in m['addedRuntimeFilesFromUAT134']) and not any(k in o['files'] for k in m['droppedRuntimeFiles']) and o['apk'] == ''
    html = base64.b64decode(o['files']['index.html']); assert hashlib.sha256(html).hexdigest() == m['releaseHTMLSHA256']
    ev = {'httpStatus': resp.status, 'etag': etag, 'bytes': len(raw), 'sha256': digest, 'version': o['version'], 'displayName': o['displayName'],
          'channel': o['channel'], 'applicationId': o['applicationId'], 'apkVersion': o['apkVersion'], 'runtimeFiles': len(o['files']),
          'indexHTMLSHA256': hashlib.sha256(html).hexdigest(), 'productionAppAction': 'GAME (apkVersion 17 = installed APK17, version newer than 20261118200000)',
          'anonymousDownload': True, 'checkedAt': time.strftime('%Y-%m-%dT%H:%M:%S'), 'phoneEvidence': 'pending Jenny'}
    (root / m['evidence'] / 'cloud-verification.json').write_text(json.dumps(ev, indent=2)); print(json.dumps(ev, indent=2))
