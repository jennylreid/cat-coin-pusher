# UAT 76 = UAT 75 (CP-61, unchanged) + the CP-57 follow-up: every plain coin over the ledge is heard (real recordings).
# The patch lives in work/cp57-money/build-edge.py; this runs it on the published UAT 75 (pinned by hash). Usage: python build.py
from pathlib import Path
import subprocess, shutil, json, hashlib
p = Path(__file__).parent; M = p.parent / 'cp57-money'
pin = json.loads((p.parent / 'cp75/publication-manifest.json').read_text())['releaseHTMLSHA256']
shutil.copyfile(p / 'release-version.json', M / 'release-version.json')
subprocess.run(['python', str(M / 'build-edge.py'), str(p.parent / 'cp75/release.html'), pin, str(p / 'release.html')], check=True, capture_output=True)
print(p / 'release.html', hashlib.sha256((p / 'release.html').read_bytes()).hexdigest())
