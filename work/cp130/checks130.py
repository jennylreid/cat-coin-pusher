"""UAT 130 light checks, judged from the real-Chrome runs on boot130 (probe129.cjs; touch input, real taps):
evidence tickets/CP-100-evidence/uat130/probe.json (412x915 + 360x640) and run360/probe.json (360x640 chip rerun, longer play)."""
import json
from pathlib import Path
p=Path(__file__).parent;e=p.parents[1]/'tickets/CP-100-evidence/uat130'
A=json.loads((e/'probe.json').read_text());B=json.loads((e/'run360/probe.json').read_text())
R=[];ok=lambda n,c,i=None:R.append({'name':n,'ok':bool(c),'info':i})
rel=(p/'release.html').read_text(encoding='utf-8');ok('0 build is UAT 129 + build name + Pet peak default + the two blocks',"const BUILD = '2026.11.20 UAT 130';" in rel and 'peak:2.5,grace:1.2}); /* UAT 130' in rel and 'CP100G' in rel and 'u130Bonus' in rel)
for z in ('412x915','360x640'):
    T=A['sizes'][z]['touch-touch'];U=(B if z=='360x640' else A)['u130'][z];F=A['u130'][z]
    ok(f'1 {z} touch: Level boards list opens and stays; a touch on Board 1 starts it',T['lv']['list']=='flex' and T['lv']['row']['endKey']=='L1',T['lv'])
    ok(f'1 {z} touch: Goal boards list opens and stays; a touch on Cup shot starts it',T['goal']['list']=='flex' and T['goal']['row']['lab'],T['goal'])
    ok(f'2 {z} heart coin lands in the front (depth 600-680) and leaves; then the chip opens a row of all 5 cats; switching to a cat not yet open works and does not open it',
       600<=U['heart']['landDepth']<=680 and U['heart']['secondsLockedByHeart'] and U['row']['open'] and len(U['row']['cats'])==5 and U['switched']['cat']=='siamese' and not U['switched']['siameseOpen'] and not U['switched']['saved'].get('siamese'),U)
    ok(f'3 {z} Treat toss meter is below the board front (or over its last strip on 360x640)',F['toss']['on'] and F['toss']['y']>=F['toss']['front']-15,F['toss'])
    ok(f'5 {z} Pet the cat peak 2.5 s',F['pet']['peak']==2.5,F['pet'])
ok('4 no red rail flash: w43LostDraw draws no stroke (stills flash-lost-both-sides-*)','strokeStyle' not in rel[rel.index('w43LostDraw=function(){for(const L of W43_LOST)'):rel.index('// 5. Pet the cat')])
ok('no page errors',not A['errors'] and not B['errors'],A['errors']+B['errors'])
f=[r['name'] for r in R if not r['ok']]
for r in R:print(('PASS ' if r['ok'] else 'FAIL ')+r['name'])
(e/'checks130.json').write_text(json.dumps({'build':str((p/'release.html').resolve()),'passed':not f,'passedN':len(R)-len(f),'failed':f,'results':R},indent=1))
