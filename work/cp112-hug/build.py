"""UAT 112 = UAT 111 + CP-74 Hug try 9 (Jenny, Nov 19: "let's pass hug try number 9. It doesn't mean we won't further iterate, but for now we'll let it pass.").
Two edits on the published UAT 111: the build name, and the Hug block (try 8, work/cp110-hug/cp74-hug.js, exactly once) replaced by
try 9 (work/cp74-hug/release/cp74-hug-try9.js, copied here as cp74-hug.js). The art block (cp74-art.js) is already in UAT 106+ and unchanged.
Usage: python build.py -> release.html"""
from pathlib import Path
import json,hashlib,re,shutil
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
shutil.copyfile(W/'cp74-hug'/'release'/'cp74-hug-try9.js',p/'cp74-hug.js')
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s)
EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName']),((W/'cp110-hug'/'cp74-hug.js').read_text(encoding='utf-8'),(p/'cp74-hug.js').read_text(encoding='utf-8'))]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':[]},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
