# CP-57 title, final (Jenny, Nov 17, on her phone with UAT 87: "The production title is still the best."): the title uses D,
# production 2026.11.16.2's exact sound, fixed. This removes the UAT 87 pick switch: sfx.pg('coin') gets production's line back
# byte for byte, and the CP57T block (the A/B/C taps, the saved choice, the Developer "Title sound" and "Replay title" buttons)
# is removed entirely. Everything else the title sound uses was already identical to production. Applies on UAT 87 or any later
# UAT that still has the switch. Usage: python build-title-final.py <base release.html> <its sha256> <out> [version json]
from pathlib import Path
import json, hashlib, sys, re
BASE, PIN, OUT = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline hash mismatch'
if len(sys.argv) > 4:
    v = json.loads(Path(sys.argv[4]).read_text()); m = re.search(r"const BUILD = '([^']*)';", s); s = s.replace(m.group(0), "const BUILD = '%s';" % v['displayName'], 1)
old = "else if(kind==='coin'){if(!CP57T.tap(v))this._pgSteel(t,.35*v,1+Math.random()*.4,false);} // CP-57: Title sound A/B/C (real coin clinks); D = production's clink"
new = "else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}"   # production 2026.11.16.2, byte for byte
assert s.count(old) == 1, s.count(old)
s = s.replace(old, new)
m = re.search(r"// CP-57 \(Jenny, Nov 17\): the title's letter sound, picked on the phone.*?PGU\.screen='title';\};\};\}\n", s, re.S)
assert m and s.count("// CP-57 (Jenny, Nov 17): the title's letter sound, picked on the phone") == 1
s = s[:m.start()] + s[m.end():]
assert 'CP57T' not in s and 'pg-tsnd' not in s and 'pg-treplay' not in s
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
