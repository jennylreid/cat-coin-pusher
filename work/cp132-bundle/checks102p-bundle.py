"""CP-102 panel checks, in real Chrome (panelshot.cjs on boot131 = published UAT 131, and boot = UAT 131 + cp102-dev.js), every
fold open, at 412x915 and 360x640. Needs the local server on 8797. Usage: python checks102p.py
1 Developer is: Endless board, Start now (Start Dance break now first; 4 side games; 5 powers; wheel, Jackpot, Cat visits), Basics
2 removed (hidden): the level buttons, Give all cats / cat coins, +1,000 coins, the duplicates, the old per-game start buttons
  (Treat toss, Laser chase, Pet the cat, Mouse pounce x2)
3 kept: Give powers, Give 3 of every prize + 300 coins, the Ragdoll's and the Orange's music, Yawn sound, Dance tuning
4 every element ID of today's panel is still there (nothing deleted, only moved or hidden); no page errors
-> tickets/CP-102-evidence/bundle132/checks102p.json + panel stills"""
import json,subprocess,os,shutil
from pathlib import Path
p=Path(__file__).parent.parent/'cp102-dev';E=Path(__file__).resolve().parents[2]/'tickets/CP-100-evidence/uat132/cp102';E.mkdir(parents=True,exist_ok=True)
def dump(d,tag,w,h):
    env=dict(os.environ,DIR=d,OPEN='1',TAG=tag,OUT=str(E/'shots-panel'),VW=str(w),VH=str(h))
    r=subprocess.run(['node','panelshot.cjs'],cwd=p,env=env,capture_output=True,text=True,timeout=240);return json.loads(r.stdout.strip().splitlines()[-1])
res={};passed=[];failed=[]
def check(n,b,info=None):
    (passed if b else failed).append(n);res[n]={'pass':bool(b),'info':info};print(('PASS ' if b else 'FAIL ')+n+(' '+json.dumps(info)[:600] if info is not None else ''))
for w,h in [(412,915),(360,640)]:
    sz=f'{w}x{h}';base=dump('boot131','base',w,h);new=dump('../cp132-bundle/boot132','new',w,h)
    vis=[i for i in new['items'] if i['v']];ids={i['id'] for i in new['items'] if i['id']};vid={i['id'] for i in vis if i['id']}
    main=[];inmain=False
    for i in new['items']:
        if i['id']=='cp70-main':inmain=True;continue
        if i['k']=='fold':inmain=False
        if inmain and i['v'] and i['k'] in ('h3','btn'):main.append((i['k'],i['id'],i['t']))
    heads=[t for k,_,t in main if k=='h3'];order=[heads.index(x) if x in heads else -1 for x in ('Endless board','Start now','Side games','Powers','Basics')]
    btns=[(i,t) for k,i,t in main if k=='btn'];si=heads and [n for n,(k,_,t) in enumerate(main) if k=='h3' and t=='Start now']
    first=main[si[0]+1] if si else None
    games=[x for x in ('cp102-game-toss','cp102-game-chase','cp102-game-pet','cp102-game-pounce') if x in vid];pows=[x for x in vid if x.startswith('cp102-power-')]
    check(f'1 {sz}: Developer = Endless board, Start now (Dance break first, 4 side games, 5 powers, wheel, Jackpot, Cat visits), Basics',
          order==sorted(order) and -1 not in order and first and first[1]=='dance-now' and first[2]=='Start Dance break now' and len(games)==4 and len(pows)==5 and {'w2-spin','cp64-now','pg-visit'}<=vid,
          {'heads':heads,'first':first,'games':games,'powers':sorted(pows)})
    gone=['toss-now','laser-now','pet-now','pgp-pounce','pgt-pounce','pgl-all','pgl-pass','pgt-reset','pgt-cats','pg-coins','pgl-reset','pgt-title','pgt-tc','pgp-give']
    shown_gone=[x for x in gone if x in vid];k1000=[i for i in vis if i['k']=='btn' and i['t']=='+1,000 coins'];lev=[i for i in vis if i['k']=='h3' and (i['t'].startswith('Levels') or i['t'].startswith('Powers (CP-47)'))]
    check(f'2 {sz}: removed buttons are hidden (levels, give all cats/cat coins, +1,000 coins, duplicates, the old Treat toss/Laser/Pet/Mouse pounce start buttons)',not shown_gone and not k1000 and not lev,{'still shown':shown_gone,'+1000':len(k1000),'level heads':[i['t'] for i in lev]})
    keep=['pgt-powers','pg-give','cp101-music','cp94-music','cp79-yawn','dance-dev','cp92-endless','pfx','tw-start','paw40-tip','w2-visitor','pg-reset','empty-purse']
    check(f'3 {sz}: kept and shown: Give powers, Give prizes + 300 coins, Ragdoll and Orange music, Yawn sound, Dance tuning, Endless board, the rest',all(x in vid for x in keep),[x for x in keep if x not in vid])
    bid={i['id'] for i in base['items'] if i['id']}
    check(f'4 {sz}: every element ID of the UAT 131 panel is still there; no page errors',bid<=ids and not new['errors'] and not base['errors'],{'missing':sorted(bid-ids),'errors':new['errors']+base['errors'],'scroll':[base['scroll'],new['scroll']]})
    for f in (p/'shots-panel').glob(f'new-0[0-2]-{sz}.png'):shutil.copy(f,E/('panel-'+f.name))
    for f in (p/'shots-panel').glob(f'base-0[0-1]-{sz}.png'):shutil.copy(f,E/('panel-'+f.name))
(E/'checks102p.json').write_text(json.dumps({'build':str((p/'release.html').resolve()),'passed':not failed,'passedChecks':passed,'failed':failed,'res':res},indent=1))
print(len(passed),'passed,',len(failed),'failed');raise SystemExit(1 if failed else 0)
