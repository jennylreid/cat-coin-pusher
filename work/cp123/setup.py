"""CP-97 Switch cats + CP-92 sweep rework, UAT build (PM, Nov 19: "Rebase on 122, then run your pre-publish checks").
Usage: python setup.py <published base work folder> <UAT number>     e.g. python setup.py cp122-giant 123
 - checks the base's release.html is what it published; release-version.json; copies the two blocks from work/cp97-switch; builds"""
from pathlib import Path
import json,hashlib,shutil,subprocess,sys
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];N=int(sys.argv[2]);B=W/base
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1]);assert N>bnum,(N,bn)
(p/'release-version.json').write_text(json.dumps({'displayName':'2026.11.19 UAT %d'%N,'version':m['version']+(N-bnum),'apkVersion':7,'base':base,'baseSHA256':bh}),encoding='utf-8')
if (B/'art').is_dir():shutil.copytree(B/'art',p/'art',dirs_exist_ok=True)
for f in ('cp92-sweep2.js','cp97-switch.js'):shutil.copyfile(W/'cp97-switch'/f,p/f)
subprocess.run([sys.executable,str(p/'build.py')],check=True)
