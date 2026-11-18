"""CP-73 follow-up (Jenny, Nov 18: "CP-73 Formal inspection: cane shaft goes behind the mitt, crook showing above it, so the
mitt looks like it's holding it. Next UAT."). UAT 93 on pinned published UAT 92: the build name + the block cane-hold.js
(drawing only). Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='520fa87fc67f14c4041b131b2c2be7bc1b2dea94b5eff7a55df95dec76f2ab0c','base is not published UAT 92'
s=s.decode('utf-8')
EDITS=[("const BUILD = '2026.11.18 UAT 92';","const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
add=(p/'cane-hold.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'edits':EDITS,'appendedBeforeLastScriptClose':['cane-hold.js']},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
