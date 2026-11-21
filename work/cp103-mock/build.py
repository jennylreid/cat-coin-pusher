"""Make a standalone Shop mock-up from the published UAT 134 runtime."""
from base64 import b64decode
import json
from pathlib import Path
import sys

root = Path(__file__).resolve().parent
payload_path = Path(sys.argv[1]) if len(sys.argv) > 1 else root / '../../uat/CatCoinPusher-UAT-game.json'
payload = json.loads(payload_path.read_bytes())
assert payload['version'] == 20261119000045, 'Expected the published UAT 134 baseline'
for name, encoded in payload['files'].items():
    path = root / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b64decode(encoded))

index = root / 'index.html'
baseline = index.read_bytes()
(root / 'before.html').write_bytes(baseline)
start = baseline.index(b'function pgShopTabs(){')
end = baseline.index(b'function pgShopTap(r)', start)
original_hit = b"['kitchen','porch','album','shop'].includes(sc)&&contains(pgScreenCatRect(),p)"
new_hit = b"['kitchen','porch','album'].includes(sc)&&contains(pgScreenCatRect(),p)"
old_feedback = b"pgFloat('+1 '+pgName(r.id),r.x+150,r.y,'#7dff6a')"
new_feedback = b"pgFloat('+1 '+pgName(r.id),r.x+r.w/2,r.y+22,'#7dff6a')"
assert baseline.count(original_hit) == 1
assert baseline.count(old_feedback) == 1
index.write_bytes(
    (baseline[:start] + (root / 'shop.js').read_bytes() + baseline[end:])
    .replace(original_hit, new_hit)
    .replace(old_feedback, new_feedback)
)
