# UAT 39: builds release.html from published UAT 38 (work/cp38/release.html, pinned by hash) plus the CP-37 fix:
# 1. fix37-backwall.js: coins can't stack up the backstop above the pusher, where they were drawn under the cat's chin
#    and face (any coin whose drawn centre climbs above the chin line is slid forward off the pile).
# 2. fix37-order.js and four edits in coinPaintOrder (towers now ordered too): an overlapping pair keeps its draw order until the geometry
#    clearly changes (the contact normal of nearly touching coins swung frame to frame and flipped their order: flicker).
# Same code on every board (Boards 1-3, Wild, Wild 2). Source patch and tests: work/cp37-bug (apply_fix.py does the same).
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
s = (p.parent / 'cp38/release.html').read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == '8367eef8b18133987007c7f23bf646d76861dbe82fc68bbf9061057b15bbf22c', 'baseline must be UAT 38'
N = '\r\n'
assert 'CP37_BACK_ZONE' not in s


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


def src(name):
    return (p / name).read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N)


rep("const BUILD = '2026.11.12 UAT 38';", "const BUILD = '%s';" % v['displayName'])
rep('pair.distance=hit.distance;}',
    'pair.distance=hit.distance;pair.dn=pair.d/Math.hypot(-(x-200)*p.dg/p.gx,(p.dy-h*LIFT*p.dg)/(LIFT*p.gx),1);}')
rep('  const d=pair.d;', '  const d=__cp37PairSign(a.b.uid,b.b.uid,pair);')
rep('  if(Math.abs(d)<.015)continue;', '  if(!d)continue;')
# towers get an order record too (they had none, so their place among the coins around them changed every frame)
rep('  if(b.danceDown||!contactSolid(b)||__inputInFlight(b))return null;', "  if(b.danceDown||!(contactSolid(b)||b.kind==='stack')||__inputInFlight(b))return null;")
rep('function coinPaintOrder(list){', src('fix37-order.js') + 'function coinPaintOrder(list){' + N + ' __cp37OrderPrune();')
rep('Promise.all([RAPIER.init(), loadArt()])', src('fix37-backwall.js') + 'Promise.all([RAPIER.init(), loadArt()])')
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
