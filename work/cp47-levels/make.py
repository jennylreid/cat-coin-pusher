# UAT 62 build: build.py (levels, cats, powers on pinned UAT 60) -> the CP-45 pupils patch -> CP-46's drop-sound fix A.
# The two patches are other engineers' scripts, run as they are (work/cp45-pupils, work/cp46-audio). Output: release.html
from pathlib import Path
import json, subprocess, hashlib
p = Path(__file__).parent; w = p.parent; v = json.loads((p / 'release-version.json').read_text())
pre, mid, out = p / 'build-pre.html', p / 'build-mid.html', p / 'release.html'
subprocess.run(['python', str(p / 'build.py'), str(w / 'cp60/release.html'), str(pre)], check=True)
assert hashlib.sha256((w / 'cp60/release.html').read_bytes()).hexdigest() == (p / 'base-pin.txt').read_text().strip(), 'base must be UAT 60'
subprocess.run(['python', str(w / 'cp45-pupils/apply_pupils.py'), str(pre), str(mid)], check=True)
subprocess.run(['python', str(w / 'cp46-audio/patch-fixdrop.py'), str(mid), str(out), v['displayName']], check=True)
pre.unlink(); mid.unlink(); print(out, hashlib.sha256(out.read_bytes()).hexdigest())
