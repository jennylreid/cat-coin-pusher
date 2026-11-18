"""CP-64 Jackpot cascade (Jenny, Nov 17), UAT 86 on pinned published UAT 85 (CP-58 add-on, unchanged).
The wheel's JACKPOT slice (now about 2%, was JACKPOT 25 at 5%) starts an ~9 s timed, capped cascade of bonus drops
(mostly prizes) with the round timer held, instead of 25 coins. Developer: "Start a Jackpot now".
Two text edits (build label, the wheel's result text) + the add-on block cp64-jackpot.js.
Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='c537df933e0a80989a416e9173817945e79532a3adcfdfbde2da5c11ef91df80','base is not published UAT 85'
s=s.decode('utf-8')
EDITS=[("const BUILD = '2026.11.17 UAT 85';","const BUILD = '%s';"%v['displayName']),
 ("prize:'A PRIZE YOU NEED!',jackpot:'JACKPOT 25!',again:'DANCE AGAIN!'","prize:'A PRIZE YOU NEED!',jackpot:'JACKPOT!',again:'DANCE AGAIN!'")]
for a,b in EDITS:
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
add=(p/'cp64-jackpot.js').read_text(encoding='utf-8')
i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'edits':EDITS,'appendedBeforeLastScriptClose':'cp64-jackpot.js'},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out)
print(p/'release.html',hashlib.sha256(out).hexdigest())
