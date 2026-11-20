"""UAT 130 (folder work/cp130) = published UAT 129 + build name + the Pet the cat default peak 3.5 -> 2.5 + cp100-ghost.js and
cp130-fixes.js appended before the last </script>. Nothing else changes. Usage: python setup.py <base work folder> <UAT number> (writes release-version.json), then python build.py"""
from pathlib import Path
import json, hashlib, re, sys
p = Path(__file__).parent; W = p.parent
v = json.loads((p / 'release-version.json').read_text())
base = W / v['base'] / 'release.html'; s = base.read_bytes()
assert hashlib.sha256(s).hexdigest() == v['baseSHA256'], ('base changed', base); s = s.decode('utf-8')
m = re.search(r"const BUILD = '([^']+)';", s)
EDITS = [(m.group(0), "const BUILD = '%s';" % v['displayName']),
         ('const PET_DEFAULTS=Object.freeze({len:9,peak:3.5,grace:1.2});', 'const PET_DEFAULTS=Object.freeze({len:9,peak:2.5,grace:1.2}); /* UAT 130: was 3.5 */')]
for a, b in EDITS:
    n = s.count(a); assert n == 1, (a[:60], n); s = s.replace(a, b)
blk = (p / 'cp100-ghost.js').read_bytes().decode('utf-8') + chr(10) + (p / 'cp130-fixes.js').read_bytes().decode('utf-8')
i = s.rindex('</script>'); s = s[:i] + '\n' + blk + '\n' + s[i:]
(p / 'edits.json').write_text(json.dumps({'base': str(base), 'edits': EDITS, 'appended': ['work/cp130/cp100-ghost.js', 'work/cp130/cp130-fixes.js']}, indent=1), encoding='utf-8')
out = s.encode('utf-8'); (p / 'release.html').write_bytes(out)
print(p / 'release.html', len(out), hashlib.sha256(out).hexdigest())
