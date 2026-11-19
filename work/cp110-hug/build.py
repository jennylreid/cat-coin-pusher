"""UAT 110 = UAT 109 + CP-74 Hug try 8 (PM review with Jenny's delegated approval, Nov 19: "Try 8: approved for UAT").
Two edits on the published UAT 109: the build name, and the Hug block (try 6, work/cp106-hug/cp74-hug.js, exactly once) replaced by
try 8 (work/cp74-hug/release/cp74-hug.js, copied here). The art block (cp74-art.js) is already in UAT 106+ and unchanged.
Usage: python build.py -> release.html"""
from pathlib import Path
import json,hashlib,re,shutil
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
shutil.copyfile(W/'cp74-hug'/'release'/'cp74-hug.js',p/'cp74-hug.js')
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s)
EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName']),((W/'cp106-hug'/'cp74-hug.js').read_text(encoding='utf-8'),(p/'cp74-hug.js').read_text(encoding='utf-8'))]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':[]},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
