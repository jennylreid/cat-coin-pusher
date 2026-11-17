"""CP-61 follow-up (Jenny, Nov 16: "Tuxedo Yawn power: same limit (a few top items, just not bottom layer)"), on pinned
published UAT 76. Tuxedo's YAWN power now uses the wheel Yawn's limit: same animation, but it only knocks off up to 6 coins
lying on top of the pile; the bottom layer is never pushed. JACKPOT 25 stays. Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent
s=(p.parent/'cp76/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='73781b4dcec613a056f0bc353b806f0435a8bdf4cfb7e991af4f8bd1a3b834cc','base is not published UAT 76'
s=s.decode('utf-8');v=json.loads((p/'release-version.json').read_text())
EDITS=[("const BUILD = '2026.11.16 UAT 76';","const BUILD = '%s';"%v['displayName']),
 ("const power=typeof PGPX!=='undefined'&&PGPX&&PGPX.id==='yawn';if(!power&&!Y.pick)Y.pick=cp61YawnPick(); // CP-61: the wheel's Yawn: top coins only",
  "if(!Y.pick)Y.pick=cp61YawnPick(); // CP-61: the wheel's Yawn and the YAWN power: top coins only"),
 ("for(const b of (power?bodies:Y.pick)){","for(const b of Y.pick){")]
for a,b in EDITS:
    assert s.count(a)==1,(s.count(a),a);s=s.replace(a,b)
out=s.encode('utf-8');(p/'release.html').write_bytes(out);(p/'edits.json').write_text(json.dumps(EDITS))
print(p/'release.html',hashlib.sha256(out).hexdigest())
