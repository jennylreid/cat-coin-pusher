# UAT 37: builds release.html from published UAT 36 (work/cp36/release.html, pinned by hash).
# CP-36 Dance break on the Wild board: happy meter, music-note coin, dance break with a generated beat, banked coins that
# rain down when the music stops, and Developer dials. Inlines dance37.js (after the Wild board code) and dance-sounds.js
# (sfx.dance). Boards 1-3 never reach any of it.
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
s = (p.parent / 'cp36/release.html').read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == '1e7fdf8431f49d2c5d940be9c77140918731369f66df7a44720b3e01a8d35c71', 'baseline must be UAT 36'
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


rep("const BUILD = '2026.11.12 UAT 36';", "const BUILD = '%s';" % v['displayName'])
rep('    fanfare() {', (p / 'dance-sounds.js').read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N) + '    fanfare() {')
# The performance log carries the Wild and Dance break dial values.
rep("pickupTuning:{...pickupFx},", "pickupTuning:{...pickupFx},wildTuning:{seconds:WILD_SECONDS,coins:WILD_COINS},danceTuning:{...DANCE},danceTuningDefaults:DANCE_DEFAULTS,")
a = s.index('// Local UAT diagnostics:')
s = s[:a] + (p / 'dance37.js').read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N) + s[a:]
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
