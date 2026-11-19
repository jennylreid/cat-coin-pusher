"""CP-75 Yawn faces (Jenny, Nov 18: "CP-75 Yawn faces: approved. Eyes stay yellow; Siamese as is; mitts tinted per cat.
Into the next UAT.") on published UAT 94: each cat yawns with its own recoloured copy of the approved Tuxedo yawn face and
squinting eyes (work/cp75-yawn-faces/recolor.py; art/cp75-yawn-*). The Tuxedo keeps the originals.
Build name + the block cp75-yawn.js (exactly the Step 1 prototype). Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='1378c839b4c8aaa5c84744c98e6a65e8d502d7d6024af790747891ed2dd36f48','base is not published UAT 94'
s=s.decode('utf-8')
EDITS=[("const BUILD = '2026.11.18 UAT 94';","const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
add=(p/'cp75-yawn.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'edits':EDITS,'appendedBeforeLastScriptClose':['cp75-yawn.js']},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
