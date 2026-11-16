# UAT 44: builds release.html from published UAT 43 (work/cp43/release.html, pinned by hash). Jenny approved (Nov 12,
# relayed by PM): CP-24 prizes tip off the sides (fix24.js: prizes pass the CP-21 side lip, the game's contact pass
# honours the same collision groups, anything whose centre is past an open side edge keeps moving outward until it
# falls) and CP-40 Paw save on Wild 2 (pawsave40.js). Phase 1 prototype and measurements: work/cp44-bug.
# Usage: python build.py [other baseline release.html -> preview.html]
from pathlib import Path
import json, hashlib, sys, re
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
BASE = Path(sys.argv[1]) if len(sys.argv) > 1 else p.parent / 'cp43/release.html'
PINF = p.parent / 'cp43/publication-manifest.json'  # published UAT 43
PIN = json.loads(PINF.read_text())['releaseHTMLSHA256'] if PINF.exists() else None
s = BASE.read_text(encoding='utf-8', newline='')
if len(sys.argv) == 1: assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be UAT 43'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
def src(name): return (p / name).read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N)
old_build = re.findall(r"const BUILD = '[^']*';", s); assert len(old_build) == 1
rep(old_build[0], "const BUILD = '%s';" % v['displayName'])
rep("for(const s of [-1,1]){const x=200+s*(halfW+COIN_R*0.9),hh=2,len=T.FRONT+100-GUARD_END;world.createCollider(RAPIER.ColliderDesc.cuboid(2*M,hh*M,len/2*M).setTranslation(x*M,hh*M,(GUARD_END+len/2)*M).setFriction(0.2),fixed);}",
    "for(const s of [-1,1]){const x=200+s*(halfW+COIN_R*CP24.lipOut),hh=CP24.lipH/2,len=T.FRONT+100-GUARD_END;world.createCollider(RAPIER.ColliderDesc.cuboid(2*M,hh*M,len/2*M).setTranslation(x*M,hh*M,(GUARD_END+len/2)*M).setFriction(0.2).setCollisionGroups(CP24.lipGroups),fixed);}")
m = re.findall(r'for\(const o of obstacles\)\{\s*const cp=o\.p,e=o\.ext;', s); assert len(m) == 1
rep(m[0], m[0] + 'if(!__cp24Interact(a.c,o.c))continue;')
fix = src('fix24.js').replace('coinTip:0,', 'coinTip:.4,'); assert 'coinTip:.4,' in fix
anchor = "Promise.all([RAPIER.init(), loadArt()])"
rep(anchor, fix + N + src('pawsave40.js') + N + anchor)
rep("    fanfare() {", src('sounds40.js') + "    fanfare() {")
out = p / ('release.html' if len(sys.argv) == 1 else 'preview.html')
out.write_text(s, encoding='utf-8', newline=''); print(out, hashlib.sha256(s.encode('utf-8')).hexdigest())
