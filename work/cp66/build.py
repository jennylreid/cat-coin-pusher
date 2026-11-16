# CP-49 section 3 (UAT 66): the end card's "Main screen" button reads "Home" (Jenny, Nov 16, via PM). Same button, same
# behaviour. On the published UAT 65 (work/cp65/release.html, pinned by hash). Usage: python build.py  Output: release.html
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
BASE = p.parent / 'cp65/release.html'
PIN = 'eaf380f58a1768c695c1bb16451682a44aa5f69cb56fcbea4fe53ec891948ef3'  # UAT 65 release.html (publication-manifest)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be the published UAT 65'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("const BUILD = '2026.11.16 UAT 65';", "const BUILD = '%s';" % v['displayName'])
rep("pgBackText=function(){return pglActive()?'Main screen':__pglBackText();};",
    "pgBackText=function(){return pglActive()?'Home':__pglBackText();}; // CP-49 (Jenny, Nov 16): was \"Main screen\"")
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
