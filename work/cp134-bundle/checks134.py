"""UAT 134 change checks for items A, B, D, E, F, G (work/cp134-bundle/round-134.js + the edits in blocks.json), real headless
Chrome on the staged boot134 folder (python stage.py --boot-only first), 412x915 and 360x640.
 A1 the Pet the cat strip is over the board (between its back and front edges), below the title's hint lines; DONE ends the game
 B1 a side game (Pet the cat, Dance) draws its own bars and the white pause bars stay off; on the wide pill the bars sit at +102
 D1 no MODES on Home (Developer on)
 E1 a swipe left/right on the cat's face switches cat (no hearts); a tap still gives hearts; five swipes go round all five cats
 E2 a cat not opened yet plays the endless board from Home and stays unopened
 F1 "New board: <name>" shows when a new board starts and is gone after about 3 s
 G1 UAT: the Goal boards button shows; a production-named build (BUILD without "UAT"): no button and the list never shows goals
 J1 a tap on the Home cat sends 8 hearts out in every direction (all four quarters); a swipe sends none
 Z  no page errors; production and the UAT channel untouched
Usage: python checks134.py  (writes tickets/CP-100-evidence/uat134/checks134.json and the stills)"""
from pathlib import Path
import json, os, subprocess, hashlib, re, sys
p = Path(__file__).parent; r = p.parents[1]; sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
ev = r / 'tickets/CP-100-evidence/uat134'; ev.mkdir(parents=True, exist_ok=True)
prodJ, uatJ = r / 'phone/CatCoinPusher-game.json', r / 'uat/CatCoinPusher-UAT-game.json'; h0 = (sha(prodJ), sha(uatJ))
rel = (p / 'release.html').read_bytes(); assert (p / 'boot134/index.html').read_bytes() == rel, 'boot134 is not this release.html: python stage.py --boot-only'
prod = p / 'prod-named.html'; s = rel.decode('utf-8'); m = re.search(r"const BUILD = '([^']+)';", s)
prod.write_bytes(s.replace(m.group(0), "const BUILD = '2026.11.20';").encode('utf-8'))
def probe(sc, out, extra={}):
    env = {**os.environ, 'SC': sc, 'SIZES': '[[412,915],[360,640]]', **extra}
    subprocess.run(['node', str(p / 'probe-follow.cjs'), str(p / 'boot134'), str(out)], env=env, check=True, timeout=600)
    return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
A = probe('v134', ev / 'v134'); B = probe('prod134', ev / 'prod134', {'INDEX': str(prod)})
passed, failed, res = [], [], {}
def check(n, b, info=None):
    (passed if b else failed).append(n); res[n] = {'pass': bool(b), 'info': info}; print(('PASS ' if b else 'FAIL ') + n, json.dumps(info)[:400])
for z, V in A['v134'].items():
    g = V['geo']
    check('A1 ' + z, g['back'] < g['strip'] < g['front'] - 20 and g['strip'] - 22 >= g['hud'] + 128 and V['doneTap'] == 'end', g)
    check('B1 ' + z, g['own'] and g['wide'] and g['bars'] == 102 and V['dance']['own'], {'pet': g['own'], 'dance': V['dance'], 'bars': g['bars']})
    check('D1 ' + z, V['home']['modes'] is None, V['home'])
    loop = [V['loop%d' % i] for i in range(5)]
    check('E1 ' + z, V['swipeL']['cat'] == 'orange' and V['swipeL']['hearts'] == 0 and V['swipeR']['cat'] == 'tuxedo' and V['tapHead']['hearts'] > 0
          and V['tapHead']['cat'] == 'tuxedo' and loop == ['orange', 'ragdoll', 'siamese', 'tortie', 'tuxedo'], {'L': V['swipeL'], 'R': V['swipeR'], 'tap': V['tapHead'], 'loop': loop})
    t = V['tapHead']; check('J1 ' + z, t['radial'] == 8 and t['quads'] == 'LD,LU,RD,RU' and V['swipeL']['hearts'] == 0, t)
    q = V['playSiamese']; check('E2 ' + z, V['toSiamese']['cat'] == 'siamese' and q['end'] and q['cat'] == 'siamese' and q['mode'] == 'laser' and not q['open'], q)
    check('F1 ' + z, V['nb1']['pending'] and V['nb1']['name'] and not V['nb2']['pending'], {'at1s': V['nb1'], 'at4.7s': V['nb2']})
    P = B['prod134'][z]
    check('G1 ' + z, V['home']['goals'] and V['home']['goalBtn'] and not P['home']['goals'] and P['home']['goalBtn'] is None and P['home']['lv']
          and P['list']['mode'] == 'levels' and P['list']['goalRows'] == 0 and P['list']['rows'] > 0, {'uat': V['home']['goalBtn'], 'prod': P})
check('Z errors', not A['errors'] and not B['errors'], A['errors'] + B['errors'])
check('Z channels', (sha(prodJ), sha(uatJ)) == h0)
prod.unlink()
(ev / 'checks134.json').write_text(json.dumps({'build': str(p / 'release.html'), 'releaseSHA256': hashlib.sha256(rel).hexdigest(), 'passed': not failed,
    'passedChecks': passed, 'failed': failed, 'res': res}, indent=1), encoding='utf-8')
print(len(passed), 'passed,', len(failed), 'failed'); sys.exit(1 if failed else 0)
