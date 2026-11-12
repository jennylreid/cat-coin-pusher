# UAT 48: builds release.html from published UAT 47 (work/cp47/release.html, pinned by hash). CP-44 Tower wall (Jenny's
# idea, build approved via PM Nov 12 "go ahead and build"): a TOWER WALL mode in the MODES picker (tower48.js). Prototype
# and measurements: work/cp48-bug. Usage: python build.py [other baseline release.html -> preview.html]
from pathlib import Path
import json, hashlib, sys, re
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
BASE = Path(sys.argv[1]) if len(sys.argv) > 1 else p.parent / 'cp47/release.html'
PIN = json.loads((p.parent / 'cp47/publication-manifest.json').read_text())['releaseHTMLSHA256']  # published UAT 47
s = BASE.read_text(encoding='utf-8', newline='')
if len(sys.argv) == 1: assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be UAT 47'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
old_build = re.findall(r"const BUILD = '[^']*';", s); assert len(old_build) == 1
rep(old_build[0], "const BUILD = '%s';" % v['displayName'])
anchor = "Promise.all([RAPIER.init(), loadArt()])"
rep(anchor, (p / 'tower48.js').read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N) + N + anchor)
out = p / ('release.html' if len(sys.argv) == 1 else 'preview.html')
out.write_text(s, encoding='utf-8', newline=''); print(out, hashlib.sha256(s.encode('utf-8')).hexdigest())
