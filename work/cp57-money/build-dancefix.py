# CP-57 bug (Jenny, UAT 77: "the music beat no longer matches the tapping"). Cause: CP-61 (UAT 75) put its comment in front of
# `D.bank[kind]++;` on the Dance break's hit line ("// CP-61: half as many rain coins, Rain 5 onlyD.bank[kind]++;"), so a hit on
# the beat banks nothing: the big coin counter under the lane stays at 0 and the payoff pays 0 coins, so on-beat taps look like
# they don't count. The music itself is on the beat (UAT 73/74/75/77 identical, every kick within 0.04 ms; judging unchanged).
# Fix: the bank line runs again (CP-61's "half as many rain coins, Rain 5 only" kept). Nothing else changes.
# Usage: python build-dancefix.py <base release.html> <its sha256> <out> [version json]
from pathlib import Path
import json, hashlib, sys, re
BASE, PIN, OUT = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline hash mismatch'
if len(sys.argv) > 4:
    v = json.loads(Path(sys.argv[4]).read_text()); m = re.search(r"const BUILD = '([^']*)';", s); s = s.replace(m.group(0), "const BUILD = '%s';" % v['displayName'], 1)
old = "const r=Math.random(),kind=r<D.rainChance*.5?'rain5':'coin'; // CP-61: half as many rain coins, Rain 5 onlyD.bank[kind]++;"
new = "const r=Math.random(),kind=r<D.rainChance*.5?'rain5':'coin';D.bank[kind]++; // CP-61: half as many rain coins, Rain 5 only (CP-57 fix: the bank line runs again)"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, new)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
