"""UAT 135 change checks (work/cp135-bundle/round-135.js), real headless Chrome on the staged boot135 folder (python stage.py
--boot-only first), 412x915, 392x874 (Jenny's Pixel) and 360x640.
 R1 prize refill: with the prizes cleared from the endless board (a level board, and the gentle First push, which has no
    bonus prizes of its own), refill drops come (the existing bonus-prize drop-in), at
    least 6 s apart, only while fewer than 3 are on the board or falling in; the board then holds prizes
 R2 never the same board twice in a row: PLAY from Home x5 then NEW BOARD x6, no board twice in a row; a fresh player's first
    board is still the gentle First push (L1), the next PLAY another board
 R3 Level boards are UAT only: UAT has the button; a production-named build has neither the button nor the list
 R4 the board's own Home button is gone (not drawn; a tap there stays on the board); the pause menu's Home still goes Home;
    top-bar stills for the Tuxedo, Siamese, Ragdoll and Orange at every size
 Z  no page errors; production and the UAT channel untouched
Usage: python checks135.py  (writes tickets/CP-100-evidence/uat135/checks135.json and the stills)"""
from pathlib import Path
import json, os, subprocess, hashlib, re, sys
p = Path(__file__).parent; r = p.parents[1]; sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
ev = r / 'tickets/CP-100-evidence/uat135'; ev.mkdir(parents=True, exist_ok=True)
prodJ, uatJ = r / 'phone/CatCoinPusher-game.json', r / 'uat/CatCoinPusher-UAT-game.json'; h0 = (sha(prodJ), sha(uatJ))
rel = (p / 'release.html').read_bytes(); assert (p / 'boot135/index.html').read_bytes() == rel, 'boot135 is not this release.html: python stage.py --boot-only'
prod = p / 'prod-named.html'; s = rel.decode('utf-8'); m = re.search(r"const BUILD = '([^']+)';", s)
prod.write_bytes(s.replace(m.group(0), "const BUILD = '2026.11.20';").encode('utf-8'))
def probe(sc, out, extra={}):
    if os.environ.get('REUSE') and (out / 'probe.json').exists(): return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
    env = {**os.environ, 'SC': sc, 'SIZES': '[[412,915],[392,874],[360,640]]', **extra}
    subprocess.run(['node', str(p / 'probe-follow.cjs'), str(p / 'boot135'), str(out)], env=env, check=True, timeout=600)
    return json.loads((out / 'probe.json').read_text(encoding='utf-8'))
A = probe('fresh135,v135', ev / 'v135'); B = probe('prod135', ev / 'prod135', {'INDEX': str(prod)})
passed, failed, res = [], [], {}
def check(n, b, info=None):
    (passed if b else failed).append(n); res[n] = {'pass': bool(b), 'info': info}; print(('PASS ' if b else 'FAIL ') + n, json.dumps(info)[:400])
for z, V in A['v135'].items():
    m = V['refill']['mine']; gaps = [round(b - a, 2) for a, b in zip(m, m[1:])]; tl = V['refill']['timeline']
    Gn = A['gentle135'][z]; gm = Gn['refills']; gg = [round(b - a, 2) for a, b in zip(gm, gm[1:])]
    check('R1 ' + z, len(m) >= 1 and all(g >= 5.9 for g in gaps) and tl[-1]['on'] >= 3 and len(gm) >= 1 and all(g >= 5.9 for g in gg) and Gn['timeline'][-1]['on'] + Gn['timeline'][-1]['inc'] >= 3,
          {'levelBoard': {'refills': m, 'end': tl[-1]}, 'gentleFirstPush': {'refills': gm, 'gaps': gg, 'end': Gn['timeline'][-1], 'ids': Gn['ids']}})
    F = A['fresh135'][z]
    check('R2 ' + z, not V['repeat'] and F[0].startswith('L1') and len({f.split()[0] for f in F[:2]}) == 2, {'seq': V['seq'], 'fresh': F})
    P = B['prod135'][z]
    check('R3 ' + z, V['levelBtn'] and P['home']['levelBtn'] is None and P['home']['goalBtn'] is None and P['list'] in ('', 'none') and P['home']['build'] == '2026.11.20', {'uat': V['levelBtn'], 'prod': P})
    check('R4 ' + z, all(V['top_' + c]['gone'] for c in ('tuxedo', 'siamese', 'ragdoll', 'orange')) and V['homeTap']['screen'] == 'board' and V['homeTap']['end'] and V['pauseHome']['screen'] == 'main', {'tap': V['homeTap'], 'pauseHome': V['pauseHome']})
check('Z errors', not A['errors'] and not B['errors'], A['errors'] + B['errors'])
check('Z channels', (sha(prodJ), sha(uatJ)) == h0)
prod.unlink()
(ev / 'checks135.json').write_text(json.dumps({'build': str(p / 'release.html'), 'releaseSHA256': hashlib.sha256(rel).hexdigest(), 'passed': not failed,
    'passedChecks': passed, 'failed': failed, 'res': res}, indent=1), encoding='utf-8')
print(len(passed), 'passed,', len(failed), 'failed'); sys.exit(1 if failed else 0)
