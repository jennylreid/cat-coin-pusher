"""UAT 141 change checks = CP-107 (the Siamese and Tortie dances with the Music pill, work/cp107/cp107-dances.js) + the Collections
test's tap-to-place in three beats with a single tap, and the one-time Collections reset (cp141-coll.js, one edit in blocks.json).
Real headless Chrome with touch emulation (real touch events) on the staged boot141 folder (python stage.py --boot-only first),
412x915 and 360x640; CP-107's own suite (work/cp107/checks107.cjs by the CP-94 engineer) runs on this release.html.
 R  the reset: on a UAT build, once, the test pages empty and their prizes go back to the bag; the old pages' save is untouched;
    a second launch does nothing
 T1 a sideways swipe that ends on another satchel item scrolls and places nothing
 T2 a single tap on the Rose places it once, in three beats (lift, flight, landing); a second tap during the flight does nothing
 T3 a drag-and-drop placement gets the same landing
 D  CP-107's suite passes on this build (dances, faces, off-beat rules, Music pill UAT-only)
 B  Beat A/B (work/beat-ab/beat-ab.js, CP-94 engineer): its suite checks-beat.cjs passes on this build (A unchanged, B drums fade
    to 35%, tap buzz, UAT-only pill)
 G  CP-93 round 3 (work/cp93-towers/cp93-round3.js, last block): its suite (r3checks-on141.cjs, a copy pointed at this build) passes
 Z  no page errors; production and the UAT channel untouched
Usage: python checks141.py"""
from pathlib import Path
import json, os, subprocess, hashlib, re, sys
p = Path(__file__).parent; r = p.parents[1]; sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
ev = r / 'tickets/CP-100-evidence/uat141'; ev.mkdir(parents=True, exist_ok=True)
prodJ, uatJ = r / 'phone/CatCoinPusher-game.json', r / 'uat/CatCoinPusher-UAT-game.json'; h0 = (sha(prodJ), sha(uatJ))
rel = (p / 'release.html').read_bytes(); assert (p / 'boot141/index.html').read_bytes() == rel, 'boot141 is not this release.html: python stage.py --boot-only'
def probe(sc, out, extra={}):
    if os.environ.get('REUSE') and (out / 'probe.json').exists(): return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
    env = {**os.environ, 'SC': sc, 'SIZES': '[[412,915],[360,640]]', **extra}
    subprocess.run(['node', str(p / 'probe-follow.cjs'), str(p / 'boot141'), str(out)], env=env, check=True, timeout=900)
    return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
A = probe('t141', ev)  # stills at the evidence root
passed, failed, res = [], [], {}
def check(n, b, info=None):
    (passed if b else failed).append(n); res[n] = {'pass': bool(b), 'info': info}; print(('PASS ' if b else 'FAIL ') + n, json.dumps(info)[:400])
for z, V in A['t141'].items():
    R = V['reset']
    check('R ' + z, R['placed'] == {} and R['rose'] >= 1 and R['diamond'] >= 1 and R['key'] == '1' and R['oldSame'] and R['again'] == {'Flowers': ['Tulip']}, R)
    check('T1 ' + z, V['swipe']['placed'] == [] and V['swipe']['scroll'][1] != V['swipe']['scroll'][0], V['swipe'])
    T = V['tap']; check('T2 ' + z, T['placed'] == ['Rose'] and T['beats'][:3] == ['lift', 'flight', 'land'] and T['landings'] == 1, T)
    check('T3 ' + z, sorted(V['drag']['placed']) == ['Rose', 'Tulip'] and V['drag']['landing'] == 1, V['drag'])
d = ev / 'cp107'
if not (os.environ.get('REUSE') and (d / 'checks107.json').exists()):
    subprocess.run(['node', str(p.parent / 'cp107/checks107.cjs'), str(d)], env={**os.environ, 'SRC': str(p / 'release.html')}, timeout=1800)
D = json.loads((d / 'checks107.json').read_text(encoding='utf-8'))
check('D CP-107 suite', not D['failed'] and len(D['passed']) > 0, {'passed': len(D['passed']), 'failed': D['failed']})
d = ev / 'beat'
if not (os.environ.get('REUSE') and (d / 'checks-beat.json').exists()):
    subprocess.run(['node', str(p.parent / 'beat-ab/checks-beat.cjs'), str(d)], env={**os.environ, 'SRC': str(p / 'release.html')}, timeout=1800)
Bt = json.loads((d / 'checks-beat.json').read_text(encoding='utf-8'))
check('B Beat A/B suite', not Bt['failed'] and len(Bt['passed']) > 0, {'passed': len(Bt['passed']), 'failed': Bt['failed']})
if not (os.environ.get('REUSE') and (p / 'logs/r3checks.txt').exists()):
    with open(p / 'logs/r3checks.txt', 'w', encoding='utf-8') as fo: subprocess.run(['node', str(p / 'r3checks-on141.cjs')], stdout=fo, timeout=1800)
G = (p / 'logs/r3checks.txt').read_text(encoding='utf-8')
check('G CP-93 round 3 suite', 'FAIL ' not in G and G.count('PASS ') >= 5, {'pass': G.count('PASS '), 'fail': G.count('FAIL ')})
check('Z errors', not A['errors'], A['errors'])
check('Z channels', (sha(prodJ), sha(uatJ)) == h0)
(ev / 'checks141.json').write_text(json.dumps({'build': str(p / 'release.html'), 'releaseSHA256': hashlib.sha256(rel).hexdigest(), 'passed': not failed,
    'passedChecks': passed, 'failed': failed, 'res': res}, indent=1), encoding='utf-8')
print(len(passed), 'passed,', len(failed), 'failed'); sys.exit(1 if failed else 0)
