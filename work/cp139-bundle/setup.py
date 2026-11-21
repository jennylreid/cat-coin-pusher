"""UAT 132 bundle (work/cp133-bundle): point this folder at a published base UAT. Usage: python setup.py <base work folder> <UAT number>
e.g. python setup.py <base folder> 129  -> release-version.json ("2026.11.19 UAT 129", version = base's + (n - base's UAT number)),
art/ copied from the base (the render harness reads runtime art there), then builds."""
from pathlib import Path
import json, hashlib, shutil, subprocess, sys, datetime
p = Path(__file__).parent; W = p.parent; base = sys.argv[1]; N = int(sys.argv[2]); B = W / base
m = json.loads((B / 'publication-manifest.json').read_text())
bh = hashlib.sha256((B / 'release.html').read_bytes()).hexdigest()
assert bh == m['releaseHTMLSHA256'], 'base release.html is not what it published'
bnum = int(m['displayName'].split()[-1]); assert N > bnum, (N, m['displayName'])
day = datetime.date.today().strftime('%Y.%m.%d')
v = {'displayName': '%s UAT %d' % (day, N), 'version': m['version'] + (N - bnum), 'apkVersion': 7, 'base': base, 'baseSHA256': bh}
(p / 'release-version.json').write_text(json.dumps(v), encoding='utf-8')
if (B / 'art').exists(): shutil.copytree(B / 'art', p / 'art', dirs_exist_ok=True)
print(v); subprocess.run([sys.executable, str(p / 'build.py')], check=True)
