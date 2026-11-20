"""Nov 20 follow-up on UAT 130 (built on published UAT 131): light checks judged from the real-Chrome run on the staged folder
with a returning-player save (levels passed, Board lab played and won, Developer on, wallet 420, Catnip): probe-follow.cjs,
evidence tickets/CP-100-evidence/follow-up/probe.json (412x915, 360x640)."""
import json
from pathlib import Path
p=Path(__file__).parent;e=p.parents[1]/'tickets/CP-100-evidence/follow-up';A=json.loads((e/'probe.json').read_text())
rel=(p/'release.html').read_text(encoding='utf-8');R=[];ok=lambda n,c,i=None:R.append({'name':n,'ok':bool(c),'info':i})
ok('0 build: base + build name + Pet peak 3.5 again + the Pet strip at petHudY() + pet-follow.js','peak:3.5,grace:1.2}); /* Nov 20 follow-up' in rel and 'Y=petHudY();ctx.save();' in rel and 'function petHudY()' in rel and 'y:petHudY()-19' in rel)
for z in ('412x915','360x640'):
    T=A['sizes'][z]['touch-touch'];U=A['u130'][z];P=A['pet'][z];Au=A['audit'][z];names=[r.split(' ')[0] for r in [x['n'] for x in Au['R']]]
    ok(f'a {z} Pet the cat peak 3.5 s, Developer default 3.5',P['peak']==3.5 and P['def']==3.5,P)
    ok(f'b {z} Pet the cat strip beneath the board (centre at or below the board front - 20), DONE moves with it and a real tap on it stops',P['on'] and P['y']>=P['front']-20 and abs(P['done']['y']-(P['y']-19))<.01 and P.get('doneTap')=='end',P)
    ok(f'c {z} Home hit areas: no overlaps between tappable areas; every drawn button has its area; Board lab, the old Daily and UAT 119 Endless board have none',
       not Au['overlaps'] and all(any(n.startswith(k) for n in [x['n'] for x in Au['R']]) for k in ['dock.gear','dock.coll','dock.inv','PGA.L.play','PGA.L.help','endBtn','cp100GoalBtn','cp100DailyBtn','side kitchen','side shop']) and not any(x['n'].startswith(('cp87Btn','labhBtn')) for x in Au['R']),Au['overlaps'])
    ok(f'returning player {z}: Level boards and Goal boards lists open and stay on real touch; a row starts its board',T['lv']['list']=='flex' and T['lv']['row']['endKey']=='L1' and T['goal']['list']=='flex' and T['goal']['row']['lab'])
    ok(f'UAT 130 items still right {z}: chip row of 5, heart in front, toss meter beneath, a prize lost',len(U['row']['cats'])==5 and U['row']['open'] and 600<=U['heart']['landDepth']<=680 and U['toss']['y']>=U['toss']['front']-15 and U['lost']['lostN']>=1,U)
ok('d stills: the two top-right buttons circled, and what each opens',all((e/f).exists() for f in ['home-top-buttons-circled-412x915.png','home-top-buttons-circled-360x640.png','opens-inventory-412x915.png','opens-collections-412x915.png']))
ok('no page errors',not A['errors'],A['errors'])
f=[r['name'] for r in R if not r['ok']]
for r in R:print(('PASS ' if r['ok'] else 'FAIL ')+r['name'])
(e/'checks-follow.json').write_text(json.dumps({'build':str((p/'release.html').resolve()),'passed':not f,'passedN':len(R)-len(f),'failed':f,'results':R},indent=1))
