"""UAT 137 change checks (work/cp137-bundle/round-137.js + 4 edits), real headless Chrome on the staged boot137 folder (python
stage.py --boot-only first), 412x915 and 360x640.
 A1 the 18 new prizes' art loads (the 17 and the Star); "New prizes" is on by default on UAT and off on a production-named build
 A2 landing views: dropped viewed prizes settle in different views (at least 4 different views over the drops); the diamond
    twinkles (its frame advances); stills of every new prize on the board and the rainbow beside the cheese (v137-prizes-*)
 A3 drop-in: a new board drops two new prizes once; about half the bonus prizes landing on the endless board are new ones
 A4 a collected new prize goes to the bag and sells in the Shop for 1 Catnip, with its name
 B1 Mouse pounce: never more than 3 mice running at once; its meter just under the pusher; the mice run below it
 C1 top bar: one button, Settings (Home's gear icon) in the top-right corner; no tap reaches the Developer update check or
    toggles sound (the sound icon is gone; Settings has Sound effects); the gear opens Settings
 D1 the cat chip works on a Goal board: unlocked in play, all five cats, the switch to the Ragdoll works and the board stays
 Z  no page errors; production and the UAT channel untouched
Usage: python checks137.py  (writes tickets/CP-100-evidence/uat137/checks137.json and the stills)"""
from pathlib import Path
import json, os, subprocess, hashlib, re, sys
p = Path(__file__).parent; r = p.parents[1]; sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
ev = r / 'tickets/CP-100-evidence/uat137'; ev.mkdir(parents=True, exist_ok=True)
prodJ, uatJ = r / 'phone/CatCoinPusher-game.json', r / 'uat/CatCoinPusher-UAT-game.json'; h0 = (sha(prodJ), sha(uatJ))
rel = (p / 'release.html').read_bytes(); assert (p / 'boot137/index.html').read_bytes() == rel, 'boot137 is not this release.html: python stage.py --boot-only'
prod = p / 'prod-named.html'; s = rel.decode('utf-8'); m = re.search(r"const BUILD = '([^']+)';", s)
prod.write_bytes(s.replace(m.group(0), "const BUILD = '2026.11.20';").encode('utf-8'))
def probe(sc, out, extra={}):
    if os.environ.get('REUSE') and (out / 'probe.json').exists(): return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
    env = {**os.environ, 'SC': sc, 'SIZES': '[[412,915],[360,640]]', **extra}
    subprocess.run(['node', str(p / 'probe-follow.cjs'), str(p / 'boot137'), str(out)], env=env, check=True, timeout=600)
    return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
A = probe('v137', ev / 'v137'); B = probe('prod137', ev / 'prod137', {'INDEX': str(prod)})
passed, failed, res = [], [], {}
def check(n, b, info=None):
    (passed if b else failed).append(n); res[n] = {'pass': bool(b), 'info': info}; print(('PASS ' if b else 'FAIL ') + n, json.dumps(info)[:400])
for z, V in A['v137'].items():
    P = B['prod137'][z]
    check('A1 ' + z, V['loaded'] == 18 and V['on'] is True and P['on'] is False, {'loaded': V['loaded'], 'uat': V['on'], 'prod': P})
    views = {x.split(':')[1] for x in V['landings']}
    check('A2 ' + z, len(views) >= 4 and 'none' not in views and V['twinkle'] is not None and V['twinkle']['frames'][0] != V['twinkle']['frames'][1], {'landings': V['landings'], 'twinkle': V['twinkle']})
    sh = V['bonusShare']['newOnes'] / V['bonusShare']['landed']
    check('A3 ' + z, V['boardDrops']['flag'] and len(V['boardDrops']['newOnBoard']) >= 2 and .25 <= sh <= .75, {'boardDrops': V['boardDrops'], 'bonusShare': V['bonusShare']})
    check('A4 ' + z, V['shop']['inBag'] == 1 and V['shop']['sellRow'] and V['shop']['price'] == 1 and V['shop']['name'] == 'Diamond', V['shop'])
    Pn = V['pounce']
    check('B1 ' + z, Pn['maxRunning'] <= 3 and Pn['pusherFront'] < Pn['meterY'] <= Pn['pusherFront'] + 40 and Pn['miceY'][0] >= Pn['meterY'] + 30 and Pn['miceY'][1] <= Pn['front'], Pn)
    T = V['topbar']['taps']
    check('C1 ' + z, all(t['cu'] == 0 and not t['muteChanged'] for t in T.values()) and all(T[k]['settings'] == 'block' for k in ('x362', 'x378', 'x390')), V['topbar'])
    Gd = V['goal']
    check('D1 ' + z, Gd['lab'] and Gd['on'] and not Gd['locked'] and len(Gd['cats']) == 5 and Gd['rowOpen'] and Gd['after']['cat'] == 'ragdoll' and Gd['after']['lab'] and Gd['after']['phase'] == 'play', Gd)
check('Z errors', not A['errors'] and not B['errors'], A['errors'] + B['errors'])
check('Z channels', (sha(prodJ), sha(uatJ)) == h0)
prod.unlink()
(ev / 'checks137.json').write_text(json.dumps({'build': str(p / 'release.html'), 'releaseSHA256': hashlib.sha256(rel).hexdigest(), 'passed': not failed,
    'passedChecks': passed, 'failed': failed, 'res': res}, indent=1), encoding='utf-8')
print(len(passed), 'passed,', len(failed), 'failed'); sys.exit(1 if failed else 0)
