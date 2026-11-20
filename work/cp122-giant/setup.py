"""CP-93 Giant tower board, UAT build (PM, Nov 19: "You're UAT 122 ... build on 121 once it's published, and rebuild then").
Usage: python setup.py <published base work folder> <UAT number>     e.g. python setup.py cp121 122
 - checks the base's release.html is what it published (publication-manifest.json)
 - release-version.json: "2026.11.19 UAT <n>", version = the base's + (n - the base's UAT number)
 - copies work/cp93-tower/cp93-giant.js here and builds release.html (build.py)
(This folder is cp122-giant: work/cp122 is another ticket's folder.)"""
from pathlib import Path
import json,hashlib,shutil,subprocess,sys
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];N=int(sys.argv[2]);B=W/base
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1]);assert N>bnum,(N,bn)
(p/'release-version.json').write_text(json.dumps({'displayName':'2026.11.19 UAT %d'%N,'version':m['version']+(N-bnum),'apkVersion':7,'base':base,'baseSHA256':bh}),encoding='utf-8')
if (B/'art').is_dir():shutil.copytree(B/'art',p/'art',dirs_exist_ok=True)
shutil.copyfile(W/'cp93-tower'/'cp93-giant.js',p/'cp93-giant.js')
subprocess.run([sys.executable,str(p/'build.py')],check=True)
