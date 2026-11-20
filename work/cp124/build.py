"""CP-96 (folder work/cp124: UAT 124) = Daily puzzles menu: Sleepy Coins added, the three CP-85 puzzles removed (UAT only).
The base's CP-87 block (UAT 107's work/cp107/cp87-puzzles.js, present byte for byte) is swapped for cp96-puzzles.js
(made by make-block.py), and the build name is set. Nothing else changes.
Usage: python setup.py <base work folder> <UAT number>   (writes release-version.json), then python build.py -> release.html"""
from pathlib import Path
import json, hashlib, re, subprocess, sys
p = Path(__file__).parent; W = p.parent
subprocess.run([sys.executable, str(p / 'make-block.py')], check=True, stdout=subprocess.DEVNULL)
v = json.loads((p / 'release-version.json').read_text())
base = W / v['base'] / 'release.html'; s = base.read_bytes()
assert hashlib.sha256(s).hexdigest() == v['baseSHA256'], ('base changed', base); s = s.decode('utf-8')
m = re.search(r"const BUILD = '([^']+)';", s)
OLD = (W / 'cp107' / 'cp87-puzzles.js').read_bytes().decode('utf-8')
NEW = (p / 'cp96-puzzles.js').read_bytes().decode('utf-8')
EDITS = [(m.group(0), "const BUILD = '%s';" % v['displayName'])]
for a, b in EDITS + [(OLD, NEW)]:
    n = s.count(a); assert n == 1, (a[:60], n); s = s.replace(a, b)
(p / 'edits.json').write_text(json.dumps({'base': str(base), 'edits': EDITS,
    'replacedBlock': {'old': 'work/cp107/cp87-puzzles.js', 'new': 'work/cp124/cp96-puzzles.js'}}, indent=1), encoding='utf-8')
out = s.encode('utf-8'); (p / 'release.html').write_bytes(out)
print(p / 'release.html', len(out), hashlib.sha256(out).hexdigest())
