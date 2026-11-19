"""UAT 103 = UAT 102 + CP-83 Board lab (Jenny, Nov 18: "CP-83 Board lab: 5-6 board setups (tower, edge pile, staircase,
wall, mouse hunt, colour challenge with stand-in coins) in the real game, chosen with a Developer picker. I play them and pick
the fun ones."). Build name + the block cp83-lab.js (source of truth: work/cp83lab/cp83-lab.js, copied here).
Usage: python build.py -> release.html on published UAT 102"""
from pathlib import Path
import json,hashlib,re,shutil
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
shutil.copyfile(W/'cp83lab'/'cp83-lab.js',p/'cp83-lab.js')
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s)
EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp83-lab.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
