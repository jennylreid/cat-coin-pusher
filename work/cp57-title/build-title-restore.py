# CP-57 title (Jenny, Nov 17): the real coin-tap version "doesn't sound good"; restore production 2026.11.16.2's title sound exactly.
# The only difference in UAT 86 is sfx.pg('coin'): since UAT 71 (CP-54) it went through the coin-landing path (CP54.coin). This puts
# back production's line byte for byte: one code-made clink per call (steelAt, 0.35 x v, pitch 1-1.4, no cooldown). Everything the
# title's sound depends on (the letter timing, pgSfx, the sfx.pg volume line, _pgSteel, steelAt, tone, noise, the master) is already
# identical to production's. Nothing else changes. (Supersedes build-title.py.)
# Usage: python build-title-restore.py <base release.html> <its sha256> <out> [version json]
from pathlib import Path
import json, hashlib, sys, re
BASE, PIN, OUT = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline hash mismatch'
if len(sys.argv) > 4:
    v = json.loads(Path(sys.argv[4]).read_text()); m = re.search(r"const BUILD = '([^']*)';", s); s = s.replace(m.group(0), "const BUILD = '%s';" % v['displayName'], 1)
old = "else if(kind==='coin'){CP54.coin(.35*v/.8,true);}"
new = "else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}"   # production 2026.11.16.2, byte for byte
assert s.count(old) == 1 and s.count(new) == 0
s = s.replace(old, new)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
