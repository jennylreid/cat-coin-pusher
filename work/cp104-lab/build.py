"""UAT 104 = UAT 103 + CP-83 round 2 (PM, Nov 18: "build round 2 on the published UAT 103 as UAT 104"). CP-83 round 2 build: the published base UAT (which carries UAT 103's CP-83 block) with that block replaced by the round-2
block (work/cp83lab/cp83-lab.js, copied here) + the build name. Usage: python build.py -> release.html"""
from pathlib import Path
import json,hashlib,re,shutil
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
shutil.copyfile(W/'cp83lab'/'cp83-lab.js',p/'cp83-lab.js')
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
old=(W/'cp103'/'cp83-lab.js').read_bytes().decode('utf-8');new=(p/'cp83-lab.js').read_bytes().decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s)
EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName']),(old,new)]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':[]},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
