# UAT 74 = UAT 73 (CP-59 fix, unchanged) + CP-57 Money sounds. The recipe lives in work/cp57-money/build.py; this runs it on
# the published UAT 73 (pinned by hash) and puts the result here. Usage: python build.py   Output: release.html
from pathlib import Path
import subprocess, shutil, json, hashlib
p = Path(__file__).parent; M = p.parent / 'cp57-money'
pin = json.loads((p.parent / 'cp73/publication-manifest.json').read_text())['releaseHTMLSHA256']
shutil.copyfile(p / 'release-version.json', M / 'release-version.json')
subprocess.run(['python', str(M / 'build.py'), str(p.parent / 'cp73/release.html'), pin], check=True, capture_output=True)
shutil.copyfile(M / 'release.html', p / 'release.html')
print(p / 'release.html', hashlib.sha256((p / 'release.html').read_bytes()).hexdigest())
