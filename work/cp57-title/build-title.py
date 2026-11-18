# CP-57 regression (Jenny, Nov 17): "it no longer taps once for each letter ... you lost the original intention of the noise."
# Since UAT 71 (CP-54) the title's letter clink played coin-land.mp3 through the landing path: a 0.84 s recording with a 0.09 s
# cooldown and filler, for letters landing 0.09 s apart, so the taps smeared into a coin wash. Production 2026.11.16.2 still plays
# the original: one short code-made clink per letter (steelAt, 0.35 x v, pitch 1-1.4, no cooldown).
# Now: one short REAL coin tap per letter, played exactly when sfx.pg('coin') fires (each letter landing; also the developer-only
# title pile-up, which uses the same call): one of CP-57's 8 coin-on-coin hits (90 ms, voicebosch), never the same take twice in
# a row, at production's pitch range (1-1.4) and production's level (the takes' gain matched to that clink, CP-57 calibration).
# No cooldown, no filler. If the takes haven't decoded yet, production's exact clink plays instead, so no letter is ever silent.
# Nothing else changes. Usage: python build-title.py <base release.html> <its sha256> <out> [version json]
from pathlib import Path
import json, hashlib, sys, re
BASE, PIN, OUT = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline hash mismatch'
if len(sys.argv) > 4:
    v = json.loads(Path(sys.argv[4]).read_text()); m = re.search(r"const BUILD = '([^']*)';", s); s = s.replace(m.group(0), "const BUILD = '%s';" % v['displayName'], 1)
BUMP_GAIN = json.loads((Path(__file__).parent.parent / 'cp57-money/coins/calibration.json').read_text())['sets']['bump']['gain']
def rep(old, new):
    global s
    assert s.count(old) == 1, (old[:80], s.count(old)); s = s.replace(old, new)
rep("else if(kind==='coin'){CP54.coin(.35*v/.8,true);}",
    "else if(kind==='coin'){if(!CP57T.tap(.35*v))this._pgSteel(t,.35*v,1+Math.random()*.4,false);} // CP-57: one real coin tap per letter; production's clink until the takes load")
anchor = "// decode the takes early\n"
assert s.count(anchor) == 1
s = s.replace(anchor, anchor +
  "// CP-57 (Jenny, Nov 17): the title taps once per letter again: one short real coin hit (CP-57's coin-on-coin takes) per call, no\n"
  "// cooldown or filler, at production's pitch range (1-1.4) and level (BUMP_GAIN: the takes matched to sfx.clink(1)).\n"
  "var CP57T={last:-1,G:" + str(BUMP_GAIN) + ",tap(vol){try{if(typeof CP57C!=='object'||S.muted)return false;CP57C.load();const L=CP57C.bufs.bump||[],n=L.length;if(!n)return false;\n"
  " let i=Math.floor(Math.random()*n);if(n>1&&i===this.last)i=(i+1)%n;if(!L[i]){i=L.findIndex((b,k)=>b&&k!==this.last);if(i<0)return false;}this.last=i;\n"
  " return sfx._playBufAt(L[i],vol*this.G,0,1+Math.random()*.4);}catch(e){return false;}}};\n", 1)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
