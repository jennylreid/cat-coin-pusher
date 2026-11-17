"""CP-59 Cascade freeze fix, on pinned published UAT 72. Three lines; no pickup, art or physics changes.
1. The Wild bonus-drop clock doesn't run while a side game (dance, toss, chase, pet, pounce) is on. Those side games
   already held it still by saving and restoring it each frame; when it had less than one frame left, that restore made
   a bonus drop every frame (the endless cascade).
2/3. The Wild 2 dance payoff's 'pour' and 'settle' stages end after 4 s at most, even if coins are still falling."""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent
s=(p.parent/'cp72/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='6e014af852d98a94c150b1969f105017c9a826d9a021748117ba357c2f927e9f'
s=s.decode('utf-8');v=json.loads((p/'release-version.json').read_text())
EDITS=[("const BUILD = '2026.11.16 UAT 72';","const BUILD = '%s';"%v['displayName']),
 ("WILD.nextBonus-=dt;if(WILD.nextBonus<=0){WILD.nextBonus=rand(6,9);wildScheduleBonus();}",
  "if(!(WILD.dance||WILD.toss||WILD.chase||WILD.petGame||WILD.pounce)){WILD.nextBonus-=dt;if(WILD.nextBonus<=0){WILD.nextBonus=rand(6,9);wildScheduleBonus();}} // CP-59: no bonus clock during a side game"),
 ("if(D.stage==='pour'){if(!SKY.length&&D.st>.6)","if(D.stage==='pour'){if((!SKY.length&&D.st>.6)||D.st>4)"),
 ("if(D.stage==='settle'){if(!SKY.length&&D.st>.5)","if(D.stage==='settle'){if((!SKY.length&&D.st>.5)||D.st>4)")]
for a,b in EDITS:
    assert s.count(a)==1,a;s=s.replace(a,b)
out=s.encode('utf-8');(p/'release.html').write_bytes(out)
print(hashlib.sha256(out).hexdigest())
