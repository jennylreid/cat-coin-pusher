# CP-48 (UAT 63): freeze fix (coin cap ~100 with a "Board full" hint, better logging) and Level 1 back to production's
# 9-row, tower-free board, on the published UAT 62 (work/cp47-levels/release.html, pinned by hash). Output: release.html
# Usage: python build.py
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
BASE = p.parent / 'cp47-levels/release.html'
PIN = 'e54cec09dedc6617000db5864511f2875d0bc6b887c8931116f2322ef59011bc'  # UAT 62 release.html (publication-manifest)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be the published UAT 62'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("const BUILD = '2026.11.14 UAT 62';", "const BUILD = '%s';" % v['displayName'])
# 2. Level 1 = production's Board 1 layout: no towers (their spots filled with carpet coins), all 9 rows (cp48.js adds the
#    front row Wild 2 leaves out). Goal, prizes, rain coins, Quake and tag unchanged.
rep("towers:'default',rain:[['rain10',200,705],['rain5',200,440]],quake:[140,545]}",
    "towers:[],rain:[['rain10',200,705],['rain5',200,440]],quake:[140,545]}")
# 3. Scope add (Jenny, Nov 15, via PM): every level has the full 9-row grid (cp48.js) with its towers standing on top, and
#    each level starts at about 80 coins or fewer: towers shortened (same positions and shape, tallest stays tallest).
rep("wall:[13,18,23,18,13],rain:[['rain10',200,650],['rain5',200,718]]", "wall:[4,5,7,5,4],rain:[['rain10',200,650],['rain5',200,718]]")  # 5 Tower wall
rep("wall:[13,18,23,18,13],rain:[['rain10',200,650]],quake:[110,640]", "wall:[4,5,7,5,4],rain:[['rain10',200,650]],quake:[110,640]")  # 8 Wall and back
rep("wall:[16,21,23,21,16]", "wall:[4,6,7,6,4]")  # 10 The vault
rep("blocks:[[[200,417,10],[147,470,10],[200,470,13],[253,470,10],[200,523,10]]]", "blocks:[[[200,417,5],[147,470,5],[200,470,7],[253,470,5],[200,523,5]]]")  # 6 Tower block
rep("blocks:[[[173,415,9],[227,415,9],[173,468,9],[227,468,9],[200,370,12]]]", "blocks:[[[173,415,5],[227,415,5],[173,468,5],[227,468,5],[200,370,7]]]")  # 9 Prize party
# 1. The rain/pour budget (UAT 43) starts at the same 100 plain coins as the player's drop cap (was 130).
rep("const W43_COIN_CAP=130;", "const W43_COIN_CAP=100;")
# 1. Logging: keep the last 200 events (was 40), also from the previous session's copy.
rep("diagSession.events,[diagAt(),kind,data],40)", "diagSession.events,[diagAt(),kind,data],200)")
rep("events:s.events.slice(-40)", "events:s.events.slice(-200),taps:Array.isArray(s.taps)?s.taps.slice(-10):[]")
rep("raw.length<150000", "raw.length<400000")
anchor = "Promise.all([RAPIER.init(), loadArt()])"
code = (p / 'cp48.js').read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N)
rep(anchor, code + N + anchor)
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
