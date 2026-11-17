"""CP-63 (Jenny via PM, Nov 17: "push it to UAT tonight"): the Tuxedo's power becomes Formal inspection (replaces its
YAWN power), on the pinned published UAT named in release-version.json "base". A monocle drops onto the cat's eye, a lens
lights up to 5 of the most valuable pieces (at most 2 prizes; coins only if lying on top of the pile), then the right
mitt sweeps them over the front edge with a cane. Stand-in monocle and cane drawn in code. The wheel's YAWN slices stay
CP-58's; a wheel Yawn waits while an inspection plays. Nothing else changes. Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
PINS={'cp82':'c3c58b3b336e324f7d46ade777d263f3b3f88491f6e66687e619b17476ad91c8','cp83':'02019ccecd271fd1beeec5b66cac5ce4ef74170cb92d473f226c822ff487ba02'} # published UATs this can build on
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()==PINS[v['base']],'base is not the pinned published UAT'
s=s.decode('utf-8');old=s[s.index("const BUILD = '"):].split("'")[1]
EDITS=[("const BUILD = '%s';"%old,"const BUILD = '%s';"%v['displayName']),
 ("if(W2_YAWN&&!W2_YAWN.cp58)return;","if((W2_YAWN&&!W2_YAWN.cp58)||CP63X)return; /* CP-63: the wheel's Yawn waits for an inspection */")]
for a,b in EDITS:
    assert s.count(a)==1,a;s=s.replace(a,b)
i=s.rindex('</script>');s=s[:i]+(p/'cp63-added.js').read_text(encoding='utf-8')+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps(EDITS,indent=1),encoding='utf-8')
(p/'release.html').write_bytes(s.encode('utf-8'));print(hashlib.sha256(s.encode()).hexdigest(),len(s))
