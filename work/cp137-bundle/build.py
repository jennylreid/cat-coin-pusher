"""UAT 137 bundle (folder work/cp137-bundle) = published UAT 136 (work/cp136-towers) + build name + the edits, swaps and blocks in
blocks.json, in order. Usage: python setup.py cp132-bundle 133, then python build.py"""
from pathlib import Path
import json, hashlib, re
p = Path(__file__).parent; W = p.parent
v = json.loads((p / 'release-version.json').read_text())
base = W / v['base'] / 'release.html'; s = base.read_bytes()
assert hashlib.sha256(s).hexdigest() == v['baseSHA256'], ('base changed', base); s = s.decode('utf-8')
m = re.search(r"const BUILD = '([^']+)';", s)
EDITS = [(m.group(0), "const BUILD = '%s';" % v['displayName'])]
EDITS += [tuple(e) for e in json.loads((p / 'blocks.json').read_text()).get('edits', [])]
for a, b in EDITS:
    n = s.count(a); assert n == 1, (a[:60], n); s = s.replace(a, b)
SW = json.loads((p / 'blocks.json').read_text()).get('swaps', [])
for o, n in SW:  # another engineer's block replacing one already in the base, byte for byte
    O = (W / o).read_bytes().decode('utf-8'); N = (W / n).read_bytes().decode('utf-8'); k = s.count(O); assert k == 1, (o, k); s = s.replace(O, N)
B = json.loads((p / 'blocks.json').read_text())['blocks']
blk = chr(10).join((W / f).read_bytes().decode('utf-8') for f in B)
i = s.rindex('</script>'); s = s[:i] + '\n' + blk + '\n' + s[i:]
(p / 'edits.json').write_text(json.dumps({'base': str(base), 'edits': EDITS, 'appended': B, 'swapped': SW}, indent=1), encoding='utf-8')
out = s.encode('utf-8'); (p / 'release.html').write_bytes(out)
print(p / 'release.html', len(out), hashlib.sha256(out).hexdigest())
