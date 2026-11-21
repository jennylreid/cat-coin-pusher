"""UAT 140 change checks (work/cp140-bundle/round-140.js), real headless Chrome with touch emulation (real touch events) on the
staged boot140 folder (python stage.py --boot-only first), 412x915 and 360x640.
 T1 a touch drag from the satchel up onto its outline places the prize (it did nothing on UAT 139: the satchel's scroll took it)
 T2 a sideways swipe on the satchel scrolls it and places nothing
 T3 a double-tap on a satchel item flies it to its spot and places it (still t140-fly)
 T4 the old pages by touch: dragging the crab from the old satchel onto its spot places it
 Z  no page errors; production and the UAT channel untouched
Usage: python checks140.py"""
from pathlib import Path
import json, os, subprocess, hashlib, re, sys
p = Path(__file__).parent; r = p.parents[1]; sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
ev = r / 'tickets/CP-100-evidence/uat140'; ev.mkdir(parents=True, exist_ok=True)
prodJ, uatJ = r / 'phone/CatCoinPusher-game.json', r / 'uat/CatCoinPusher-UAT-game.json'; h0 = (sha(prodJ), sha(uatJ))
rel = (p / 'release.html').read_bytes(); assert (p / 'boot140/index.html').read_bytes() == rel, 'boot140 is not this release.html: python stage.py --boot-only'
prod = p / 'prod-named.html'; s = rel.decode('utf-8'); m = re.search(r"const BUILD = '([^']+)';", s)
prod.write_bytes(s.replace(m.group(0), "const BUILD = '2026.11.20';").encode('utf-8'))
def probe(sc, out, extra={}):
    if os.environ.get('REUSE') and (out / 'probe.json').exists(): return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
    env = {**os.environ, 'SC': sc, 'SIZES': '[[412,915],[360,640]]', **extra}
    subprocess.run(['node', str(p / 'probe-follow.cjs'), str(p / 'boot140'), str(out)], env=env, check=True, timeout=600)
    return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
A = probe('touch140', ev / 't140')
passed, failed, res = [], [], {}
def check(n, b, info=None):
    (passed if b else failed).append(n); res[n] = {'pass': bool(b), 'info': info}; print(('PASS ' if b else 'FAIL ') + n, json.dumps(info)[:400])
B = {'errors': []}
for z, V in A['touch140'].items():
    check('T1 ' + z, V['drag'] == ['Sunflower'], V['drag'])
    check('T2 ' + z, V['swipe']['placed'] == ['Sunflower'] and V['swipe']['scroll'][1] > V['swipe']['scroll'][0], V['swipe'])
    check('T3 ' + z, V['dbl'] == ['Sunflower', 'Rose'], V['dbl'])
    check('T4 ' + z, V['old']['placed'], V['old'])
check('Z errors', not A['errors'] and not B['errors'], A['errors'] + B['errors'])
check('Z channels', (sha(prodJ), sha(uatJ)) == h0)
prod.unlink()
(ev / 'checks140.json').write_text(json.dumps({'build': str(p / 'release.html'), 'releaseSHA256': hashlib.sha256(rel).hexdigest(), 'passed': not failed,
    'passedChecks': passed, 'failed': failed, 'res': res}, indent=1), encoding='utf-8')
print(len(passed), 'passed,', len(failed), 'failed'); sys.exit(1 if failed else 0)
