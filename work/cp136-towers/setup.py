"""CP-93 Tower physics, UAT build (PM, Nov 20: "wait for 135 and build on it; you'll be UAT 136").
Usage: python setup.py <published base work folder> <UAT number>     e.g. python setup.py cp135-bundle 136
 - checks the base's release.html is what it published (publication-manifest.json)
 - release-version.json: "<date> UAT <n>", version = the base's + (n - the base's UAT number)
 - copies work/cp93-towers/cp93-physics.js here and builds release.html (build.py)
 DEV=1: no manifest check (an unpublished base for a dev build), name 'UAT <n>-dev'"""
from pathlib import Path
import json,hashlib,shutil,subprocess,sys,os
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];N=int(sys.argv[2]);B=W/base;DEV=os.environ.get('DEV')=='1'
bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
if DEV:m=json.loads((B/'release-version.json').read_text());m['releaseHTMLSHA256']=bh
else:m=json.loads((B/'publication-manifest.json').read_text());assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1]);assert N>bnum,(N,bn)
(p/'release-version.json').write_text(json.dumps({'displayName':'2026.11.20 UAT %d'%N+('-dev' if DEV else ''),'version':m['version']+(N-bnum),'apkVersion':7,'base':base,'baseSHA256':bh}),encoding='utf-8')
if (B/'art').is_dir():shutil.copytree(B/'art',p/'art',dirs_exist_ok=True)
shutil.copyfile(W/'cp93-towers'/'cp93-physics.js',p/'cp93-physics.js')
subprocess.run([sys.executable,str(p/'build.py')],check=True)
