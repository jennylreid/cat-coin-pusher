"""OPS-04 Package trim, UAT 121 (Jenny, Nov 19; PM go: A+B+C plus the CP-90 removal). On the base in release-version.json:
- CP-90 painted kittens out (Jenny: "The original zoomies are far cuter... I prefer the original zoomies."): the CP-90 block
  (work/cp117/cp90-kittens.js, appended once by UAT 117) is cut out, which gives UAT 116's Zoomies byte for byte.
- The Dance break drums load the sample-identical FLAC copy: 'sounds/effects/paw-dance.wav' -> '.flac' (one path).
- Build name. Nothing else changes.
Usage: python build.py [--base-file path] -> release.html (DEV=1 -> release-dev.html, name 'UAT 121-dev')"""
from pathlib import Path
import json,hashlib,re,os,sys
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());DEV=os.environ.get('DEV')=='1'
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
blk=(W/'cp117/cp90-kittens.js').read_bytes().decode('utf-8')+chr(10)
assert s.count(blk)==1,'CP-90 block not found exactly once';s=s.replace(blk,'')
assert 'CP90' not in s and 'cp90' not in s,'CP-90 references left after the cut'
m=re.search(r"const BUILD = '([^']+)';",s);name=v['displayName']+('-dev' if DEV else '')
EDITS=[(m.group(0),"const BUILD = '%s';"%name),("new Audio('sounds/effects/paw-dance.wav')","new Audio('sounds/effects/paw-dance.flac')")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
assert 'paw-dance.wav' not in s
(p/'edits.json').write_text(json.dumps({'base':str(base),'removedBlock':'work/cp117/cp90-kittens.js','edits':EDITS,'appendedBeforeLastScriptClose':[]},indent=1),encoding='utf-8')
out=s.encode('utf-8');f=p/('release-dev.html' if DEV else 'release.html');f.write_bytes(out);print(f,hashlib.sha256(out).hexdigest())
