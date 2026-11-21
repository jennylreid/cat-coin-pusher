"""UAT 138 change checks (work/cp138-bundle: cp138-catjam.js, cp138-collections.js), real headless Chrome on the staged boot138
folder (python stage.py --boot-only first), 412x915 and 360x640.
 P1 new prize fixes: the six-view prizes keep one view while they fall and settle (no spinning); the diamond is always the
    side view; the new prizes are drawn bigger to the shrimp's size (stills v138-sizes-*: beside the shrimp, cheese, egg, sardine)
 P2 on-board pills (UAT only): Art Real|First and Towers Today|A|C|A+C switch live (art mode, CP-93 tower physics), a tap
    there drops no coin, and they're hidden on a production-named build (stills v138-pills-*)
 Y1 the no-food Yawn: with a prize in the middle of the board (sock, not food) it pushes the prize into a side gutter; with no
    special coin or prize it pushes plain coins (stills v138-yawn-*)
 J1 Cat Jam: the page in the Daily puzzles pages is work/cp104-cat-jam/cat-jam-v4.html byte for byte; the menu lists it after the
    three puzzles; tapping it opens it in the frame and it draws (a canvas)
 K1 Collections test: Home's COLLECTIONS opens the test screen (on by default on UAT); stills of all seven pages empty
 K2 a prize dropped off its outline goes back (nothing placed, bag unchanged); dragging the sunflower onto its outline places it
    and takes one from the bag; placement payoff still (glow) and after
 K3 completing Flowers by dragging the last flower (dropped between its blooms: drops are forgiving) plays the completion payoff and shows "Collection complete"
 K4 drags also place on a painting page (Cozy: owl) and the first-pass pages (Jewelry: diamond, Water: crab)
 K6 old pages (reached by "Old pages" while the test is on): Water has a spot for tuna, shrimp, sardine, crab, seahorse and the
    oyster (kelp scenery); the satchel shows the page's own prizes; dragging the crab (Water) and the hot dog (Kitchen) from the satchel places them
    and takes them from the bag; Kitchen has cheese, hot dog, milk, egg and fish biscuit (no toy-mouse outline)
 K7 leaving Cat Jam by its Home button, or by Puzzles then Home, removes the puzzle frame and Home takes taps again
    (COLLECTIONS opens, PLAY starts the board)
 K5 a production-named build: the test is off and COLLECTIONS opens today's Collections
 Z  no page errors; production and the UAT channel untouched
Usage: python checks138.py  (writes tickets/CP-100-evidence/uat138/checks138.json and the stills)"""
from pathlib import Path
import json, os, subprocess, hashlib, re, sys
p = Path(__file__).parent; r = p.parents[1]; sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
ev = r / 'tickets/CP-100-evidence/uat138'; ev.mkdir(parents=True, exist_ok=True)
prodJ, uatJ = r / 'phone/CatCoinPusher-game.json', r / 'uat/CatCoinPusher-UAT-game.json'; h0 = (sha(prodJ), sha(uatJ))
rel = (p / 'release.html').read_bytes(); assert (p / 'boot138/index.html').read_bytes() == rel, 'boot138 is not this release.html: python stage.py --boot-only'
prod = p / 'prod-named.html'; s = rel.decode('utf-8'); m = re.search(r"const BUILD = '([^']+)';", s)
prod.write_bytes(s.replace(m.group(0), "const BUILD = '2026.11.20';").encode('utf-8'))
def probe(sc, out, extra={}):
    if os.environ.get('REUSE') and (out / 'probe.json').exists(): return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
    env = {**os.environ, 'SC': sc, 'SIZES': '[[412,915],[360,640]]', **extra}
    subprocess.run(['node', str(p / 'probe-follow.cjs'), str(p / 'boot138'), str(out)], env=env, check=True, timeout=600)
    return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
A = probe('v138,exit138', ev / 'v138'); B = probe('prod138', ev / 'prod138', {'INDEX': str(prod)})
passed, failed, res = [], [], {}
def check(n, b, info=None):
    (passed if b else failed).append(n); res[n] = {'pass': bool(b), 'info': info}; print(('PASS ' if b else 'FAIL ') + n, json.dumps(info)[:400])
for z, V in A['v138'].items():
    P = B['prod138'][z]
    vf = V['viewsWhileFalling']
    check('P1 ' + z, len(vf) >= 3 and all(len(v) == 1 for v in vf.values()) and all(v == ['side'] for k, v in vf.items() if k.startswith('diamond')) and V['scale'].get('tulip', 1) > 1.3, {'views': vf, 'scale': V['scale']})
    Pl = V['pills']
    check('P2 ' + z, Pl['on'] and Pl['rects'] == ['real', 'first', 'today', 'a', 'c', 'ac'] and V['artAfter'] == 'first' and V['towersAfter'] == 'a' and V['back'] == ['real', 'today'] and all(t and t['coins'] == 0 for t in (V['tapFirst'], V['tapA'], V['tapToday'], V['tapReal'])) and B['prod138'][z]['pills'] is False,
          {'pills': Pl, 'art': V['artAfter'], 'towers': V['towersAfter'], 'back': V['back'], 'prodPills': B['prod138'][z]['pills']})
    yp, yq = V['yawnPrize'], V['yawnPlain']
    check('Y1 ' + z, yp['stats']['prizes'] == 1 and yp['sock'] == 0 and yp['gutter'] >= 1 and yq['stats']['plain'] == 1 and yq['stats']['prizes'] == 0, {'prize': yp, 'plain': yq})
    check('J1 ' + z, V['catjamSame'] and V['menu'][-1] == 'cat-jam' and len(V['menu']) == 4 and V.get('catjam', {}).get('frame') and V['catjam'].get('canvas') and V['catjam'].get('cur') == 'cat-jam', {'same': V['catjamSame'], 'bytes': V['catjamBytes'], 'menu': V['menu'], 'play': V.get('catjam')})
    check('K1 ' + z, V['opened']['on'] and V['opened']['shown'] and not V['opened']['inv'], V['opened'])
    check('K2 ' + z, V['miss']['placed'] == [] and V['dragFlower'].get('ok') and V['afterFlower']['placed'] == ['Sunflower'] and V['afterFlower']['bagAfter'] == V['afterFlower']['bagBefore'] - 1, {'miss': V['miss'], 'drag': V['afterFlower']})
    check('K3 ' + z, V['dragLast'].get('ok') and V['complete']['placed'] == 6 and V['complete']['status'] == 'Collection complete', V['complete'])
    check('K4 ' + z, V['cozy'] == ['Owl'] and V['jewelry'] == ['Diamond'] and V['water'] == ['Crab'], {'cozy': V['cozy'], 'jewelry': V['jewelry'], 'water': V['water']})
    O = V['old']
    check('K6 ' + z, O['inv'] and O['screen'] == 'water' and set(O['slots']) == {'tuna', 'shrimp', 'sardine', 'crab', 'oyster', 'seahorse', 'kelp(scenery)'} and 'crab' in O['satchel'] and O['placeCrab'] == 'dragged' and O['crab'][1] == O['crab'][0] - 1 and O['crab'][2] and O['placeHotdog'] == 'dragged' and O['hotdog'][1] == O['hotdog'][0] - 1 and O['hotdog'][2] and set(O['kitchenSatchel']) <= {'cheese', 'hot_dog', 'milk', 'egg', 'biscuit'} and set(O['kitchen']) == {'cheese', 'hot_dog', 'milk', 'egg', 'biscuit'}, O)
    X = A['exit138'][z]
    check('K7 ' + z, all(X[k]['playing'] == 'cat-jam' and X[k]['after']['ol'] == ['water'] and X[k]['after']['test'] and X[k]['after']['frames'] == 0 and not X[k]['after']['open'] for k in ('home', 'puzzles-then-home')) and X['play']['end'] and X['play']['screen'] == 'board', X)
    check('K5 ' + z, P['on'] is False and not P['after']['test'] and P['after']['inv'], P)
check('Z errors', not A['errors'] and not B['errors'], A['errors'] + B['errors'])
check('Z channels', (sha(prodJ), sha(uatJ)) == h0)
prod.unlink()
(ev / 'checks138.json').write_text(json.dumps({'build': str(p / 'release.html'), 'releaseSHA256': hashlib.sha256(rel).hexdigest(), 'passed': not failed,
    'passedChecks': passed, 'failed': failed, 'res': res}, indent=1), encoding='utf-8')
print(len(passed), 'passed,', len(failed), 'failed'); sys.exit(1 if failed else 0)
