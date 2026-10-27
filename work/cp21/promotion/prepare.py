"""Pin signed-off UAT 8 and stage a game-only production promotion."""
from pathlib import Path
from datetime import datetime, timezone, timedelta
import base64, hashlib, json, shutil

r = Path(__file__).resolve().parents[3]
p = Path(__file__).resolve().parent
e = r / 'tickets/CP-21-evidence'
sha = lambda b: hashlib.sha256(b).hexdigest()
raw = (r / 'uat/CatCoinPusher-UAT-game.json').read_bytes()
u = json.loads(raw)
oldraw = (r / 'phone/CatCoinPusher-game.json').read_bytes()
old = json.loads(oldraw)
assert u['version'] == 20261027113731
assert sha(raw) == '144b731fa4db9fae7bb467d99eb23cb64b00c28019e997eda6ef6716b5c7de49'
h = base64.b64decode(u['files']['index.html']).decode()
assert h == (r / 'work/cp21/release.html').read_bytes().decode()
version = int(datetime.now(timezone(timedelta(hours=-4))).strftime('%Y%m%d%H%M%S'))
assert version > max(old['version'], u['version'])
name = '2026.10.27'
adapt = [
    ('<title>Cat Pusher UAT</title>', '<title>Cat Coin Pusher</title>'),
    ("const BUILD = '2026.10.27 UAT 8';", f"const BUILD = '{name}';"),
    ('catpusher.uat.audio.v1', 'catpusher.audio.v1'),
    ('<h2>UAT Settings</h2>', '<h2>Settings</h2>'),
    ("+'<button id=\"safe-guides\" class=\"wide\">Show/hide safe-area guides</button><button id=\"happy-test\" class=\"wide\">Preview Happy (6 seconds)</button>'", "+(S.dev?'<button id=\"safe-guides\" class=\"wide\">Show/hide safe-area guides</button><button id=\"happy-test\" class=\"wide\">Preview Happy (6 seconds)</button>':'')"),
    ("panel.querySelector('#safe-guides').onclick=", "const guides=panel.querySelector('#safe-guides');if(guides)guides.onclick="),
    ("panel.querySelector('#happy-test').onclick=", "const happy=panel.querySelector('#happy-test');if(happy)happy.onclick="),
]
for a, b in adapt:
    assert a in h, a
    h = h.replace(a, b)
backup = r / f'backups/before-CP-21-production-{version}'
backup.mkdir()
files = ['phone/CatCoinPusher-game.json', 'CatCoinPusher.apk', 'CODEX_BRIEF.md', 'DEVELOPER.md', 'tickets/CP-21.md']
hashes = {}
for f in files:
    target = backup / Path(f).name
    shutil.copy2(r / f, target)
    hashes[f] = sha((r / f).read_bytes())
    assert sha(target.read_bytes()) == hashes[f]
out = {**old, 'version': version, 'displayName': name, 'files': {**u['files'], 'index.html': base64.b64encode(h.encode()).decode()}}
assert out['apkVersion'] == 16 and out['apk'] == old['apk']
(p / 'release.html').write_bytes(h.encode())
(p / 'CatCoinPusher-game.json').write_text(json.dumps(out, separators=(',', ':')), encoding='utf-8')
manifest = dict(version=version, displayName=name, apkVersion=16, backup=str(backup.relative_to(r)), backupHashes=hashes,
    uatJSONSHA256=sha(raw), uatAPKSHA256=sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes()),
    stagedJSONSHA256=sha((p/'CatCoinPusher-game.json').read_bytes()), releaseHTMLSHA256=sha(h.encode()),
    nonHTMLFilesByteIdenticalToUAT=len(u['files'])-1, newAPKRequired=False,
    authorization='Jenny Oct 27 sign-off; tickets/CP-21-promotion-brief.md',
    adaptations=[dict(before=a, after=b) for a,b in adapt])
(p/'manifest.json').write_text(json.dumps(manifest, indent=2))
(e/'production-manifest.json').write_text(json.dumps(manifest, indent=2))
print(json.dumps({k:v for k,v in manifest.items() if k not in ['adaptations','backupHashes']}, indent=2))
