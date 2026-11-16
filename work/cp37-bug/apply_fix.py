"""CP-37: apply the fix to a release.html (any current UAT source). Usage: python apply_fix.py <in.html> <out.html>
1. fix37-backwall.js: coins can't stack up the backstop under the cat's chin and face.
2. fix37-order.js + four small edits in coinPaintOrder (towers included): a pair's draw order is held until the geometry clearly changes."""
import sys, pathlib
here = pathlib.Path(__file__).parent
src, dst = map(pathlib.Path, sys.argv[1:3])
html = src.read_bytes().decode('utf-8')
nl = '\r\n' if '\r\n' in html else '\n'
assert 'CP37_BACK_ZONE' not in html, 'already applied'
def once(old, new):
    global html
    assert html.count(old) == 1, 'anchor not found exactly once: ' + old[:60]
    html = html.replace(old, new, 1)
block = lambda f: (here / f).read_text(encoding='utf-8').replace('\n', nl)
# order: normalised d (cosine between the contact normal and the view direction) for the clear-change test
once('pair.distance=hit.distance;}',
     'pair.distance=hit.distance;pair.dn=pair.d/Math.hypot(-(x-200)*p.dg/p.gx,(p.dy-h*LIFT*p.dg)/(LIFT*p.gx),1);}')
once('  const d=pair.d;', '  const d=__cp37PairSign(a.b.uid,b.b.uid,pair);')
once('  if(Math.abs(d)<.015)continue;', '  if(!d)continue;')
# towers get an order record too (they had none, so their place among the coins around them changed every frame)
once('  if(b.danceDown||!contactSolid(b)||__inputInFlight(b))return null;', "  if(b.danceDown||!(contactSolid(b)||b.kind==='stack')||__inputInFlight(b))return null;")
once('function coinPaintOrder(list){', block('fix37-order.js') + 'function coinPaintOrder(list){' + nl + ' __cp37OrderPrune();')
once('Promise.all([RAPIER.init(), loadArt()])', block('fix37-backwall.js') + 'Promise.all([RAPIER.init(), loadArt()])')
dst.write_bytes(html.encode('utf-8'))
print('applied', dst)
