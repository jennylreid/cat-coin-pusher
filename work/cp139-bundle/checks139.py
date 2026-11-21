"""UAT 139 change checks (work/cp139-bundle/round-139.js + 5 edits), real headless Chrome on the staged boot139 folder (python
stage.py --boot-only first), 412x915 and 360x640.
 B1 Prize art B: every new prize's art loads; the revised prizes use the first-version art except the rainbow and diamond (A);
    the diamond takes a tilted view (left or right) with its twinkle, nothing else has views; no art file is missing
 B2 sizes and the Star: stills of every new prize beside the shrimp and cheese (v139-prizes-*); the Star drawn at 2.7x
    (about 1.15 coins) with its brighter core (v139-star-zoom*)
 S1 paw save: a prize tipping over a side, tapped in time, is batted toward the middle of the pile and stays on the board
    (x within 90 of the centre), three times out of three
 C1 Body B (item 26): the Body pill switches it on; the crouching body draws for all five cats (stills v139-body-*); the pill row
    ends above the build label
 D1 DANCE AGAIN at most once in a row: right after a DANCE AGAIN, 2,000 spins never land on it; on a later dance it comes up
    at its usual odds (about 17%)
 B3 the pills: Towers (A | B | C | D) and Body (A | B) on UAT; none on a production-named build
 Z  no page errors; production and the UAT channel untouched
Usage: python checks139.py"""
from pathlib import Path
import json, os, subprocess, hashlib, re, sys
p = Path(__file__).parent; r = p.parents[1]; sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
ev = r / 'tickets/CP-100-evidence/uat139'; ev.mkdir(parents=True, exist_ok=True)
prodJ, uatJ = r / 'phone/CatCoinPusher-game.json', r / 'uat/CatCoinPusher-UAT-game.json'; h0 = (sha(prodJ), sha(uatJ))
rel = (p / 'release.html').read_bytes(); assert (p / 'boot139/index.html').read_bytes() == rel, 'boot139 is not this release.html: python stage.py --boot-only'
prod = p / 'prod-named.html'; s = rel.decode('utf-8'); m = re.search(r"const BUILD = '([^']+)';", s)
prod.write_bytes(s.replace(m.group(0), "const BUILD = '2026.11.20';").encode('utf-8'))
def probe(sc, out, extra={}):
    if os.environ.get('REUSE') and (out / 'probe.json').exists(): return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
    env = {**os.environ, 'SC': sc, 'SIZES': '[[412,915],[360,640]]', **extra}
    subprocess.run(['node', str(p / 'probe-follow.cjs'), str(p / 'boot139'), str(out)], env=env, check=True, timeout=600)
    return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
A = probe('v139', ev / 'v139'); B = probe('prod138', ev / 'prod139', {'INDEX': str(prod)})
passed, failed, res = [], [], {}
def check(n, b, info=None):
    (passed if b else failed).append(n); res[n] = {'pass': bool(b), 'info': info}; print(('PASS ' if b else 'FAIL ') + n, json.dumps(info)[:400])
FIRST = {'balloon_animal','cornflower','daisy','hydrangea','owl','oyster','rose','sunflower','tulip'}
for z, V in A['v139'].items():
    a = V['art']
    check('B1 ' + z, not a['bad'] and set(a['first']) == FIRST and a['views'] == 1 and V['missing'] == [] and V['drawn'].get('balloon_animal') == 'cp138/first/balloon_animal.png' and set(V['diamondViews']) <= {'tilt-left', 'tilt-right'} and len(set(V['diamondViews'])) == 2, {'art': a, 'missing': V['missing'], 'drawn': V['drawn']})
    ps = V['pawsave']
    check('S1 ' + z, all(r['tipped'] and r['res']['alive'] and abs(r['res']['x'] - 200) <= 90 for r in ps) and ps[-1]['res']['bats'] >= 3, ps)
    Bd = V['body']
    check('C1 ' + z, Bd['mode'] == 'b' and all(c['drawn'] and not c['err'] for c in Bd['cats'].values()) and Bd['row'] + 20 <= Bd['label'], Bd)
    Ag = V['again']
    check('D1 ' + z, Ag['setTo'] == 5 and Ag['afterAgain'] == 0 and 230 <= Ag['later'] <= 460, Ag)
    check('B2 ' + z, a['starK'] == 2.7, {'starK': a['starK']})
    check('B3 ' + z, V['pills']['on'] and V['pills']['rects'] == ['today', 'a', 'c', 'ac', 'a', 'b'] and B['prod138'][z]['pills'] is False, {'uat': V['pills'], 'prod': B['prod138'][z]['pills']})
check('Z errors', not A['errors'] and not B['errors'], A['errors'] + B['errors'])
check('Z channels', (sha(prodJ), sha(uatJ)) == h0)
prod.unlink()
(ev / 'checks139.json').write_text(json.dumps({'build': str(p / 'release.html'), 'releaseSHA256': hashlib.sha256(rel).hexdigest(), 'passed': not failed,
    'passedChecks': passed, 'failed': failed, 'res': res}, indent=1), encoding='utf-8')
print(len(passed), 'passed,', len(failed), 'failed'); sys.exit(1 if failed else 0)
