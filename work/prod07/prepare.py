# PROD-07 (CP-59 hotfix): production 2026.11.16 (PROD-06, published) plus ONLY the CP-59 Cascade freeze fix.
# Jenny, Nov 16 (via PM): "CP-59: fix it now in UAT, then hotfix production with only the fix."; UAT signed off on
# UAT 74 ("Dance break looks good"). Nothing else from UAT 71-74 goes to production.
# Source: work/prod06/release.html (the published production index.html), pinned by hash. Changes: the release name and
# the three CP-59 lines (identical to work/cp73/build.py). Output: work/prod07/release.html
# Usage (from the CoinPusher folder): python work/prod07/prepare.py
from pathlib import Path
import json, hashlib
r = Path(__file__).resolve().parents[2]; p = Path(__file__).parent
SRC = r / 'work/prod06/release.html'
PIN = '828684ac3e42e96a5298999f9724b62c75b244abfdc165d1e4c533d71e88150e'  # PROD-06 releaseHTMLSHA256
v = json.loads((p / 'release-version.json').read_text())
h = SRC.read_bytes(); assert hashlib.sha256(h).hexdigest() == PIN, 'source must be the published production 2026.11.16'
h = h.decode('utf-8')
EDITS = [("const BUILD = '2026.11.16';", "const BUILD = '%s';" % v['displayName']),
 ("WILD.nextBonus-=dt;if(WILD.nextBonus<=0){WILD.nextBonus=rand(6,9);wildScheduleBonus();}",
  "if(!(WILD.dance||WILD.toss||WILD.chase||WILD.petGame||WILD.pounce)){WILD.nextBonus-=dt;if(WILD.nextBonus<=0){WILD.nextBonus=rand(6,9);wildScheduleBonus();}} // CP-59: no bonus clock during a side game"),
 ("if(D.stage==='pour'){if(!SKY.length&&D.st>.6)", "if(D.stage==='pour'){if((!SKY.length&&D.st>.6)||D.st>4)"),
 ("if(D.stage==='settle'){if(!SKY.length&&D.st>.5)", "if(D.stage==='settle'){if((!SKY.length&&D.st>.5)||D.st>4)")]
for a, b in EDITS:
    assert h.count(a) == 1, a; h = h.replace(a, b)
out = h.encode('utf-8'); (p / 'release.html').write_bytes(out)
m = {**v, 'sourceHTML': 'work/prod06/release.html', 'sourceHTMLSHA256': PIN, 'releaseHTMLSHA256': hashlib.sha256(out).hexdigest(),
     'changes': [{'before': a, 'after': b} for a, b in EDITS]}
(p / 'adaptations.json').write_text(json.dumps(m, indent=2)); print(m['releaseHTMLSHA256'])
