# UAT 40: the UAT 38 dance-break freeze fix, built on published UAT 39 (work/cp39/release.html, checked against its
# publication manifest). See fix_crash.py for the three changes. Nothing else changes.
from pathlib import Path
import json, hashlib, re, subprocess, sys
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
base = p.parent / 'cp39/release.html'
man = json.loads((p.parent / 'cp39/publication-manifest.json').read_text())
assert hashlib.sha256(base.read_bytes()).hexdigest() == man['releaseHTMLSHA256'], 'baseline must be published UAT 39'
subprocess.run([sys.executable, str(p / 'fix_crash.py'), str(base), str(p / 'release.html')], check=True)
s = (p / 'release.html').read_text(encoding='utf-8', newline='')
s, n = re.subn(r"const BUILD = '[^']*';", "const BUILD = '%s';" % v['displayName'], s, count=1); assert n == 1
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
