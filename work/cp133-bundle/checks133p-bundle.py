"""UAT 133 bundle: the CP-94 round's panel check (as tickets/CP-101-evidence/round133/checks133p.json) on boot133, in real Chrome
via work/cp102-dev/panelshot.cjs (local server on 8797): the Orange and Ragdoll music menus hidden; Yawn sound, Dance tuning and
the Start now group (power buttons) shown; no page errors. Both sizes."""
import json,subprocess,os
from pathlib import Path
p=Path(__file__).parent;C=p.parent/'cp102-dev';E=p.parents[1]/'tickets/CP-100-evidence/uat133/cp94';E.mkdir(parents=True,exist_ok=True)
res={};ok=True
for w,h in [(412,915),(360,640)]:
    env=dict(os.environ,DIR='../cp133-bundle/boot133',OPEN='1',TAG='u133',OUT=str(E/'shots-panel'),VW=str(w),VH=str(h))
    r=subprocess.run(['node','panelshot.cjs'],cwd=C,env=env,capture_output=True,text=True,timeout=240);d=json.loads(r.stdout.strip().splitlines()[-1])
    vis={i['id']:i['v'] for i in d['items'] if i.get('id')}
    want={'cp94-music':False,'cp101-music':False,'cp79-yawn':True,'dance-dev':True,'cp102-start':True,'cp102-power-ragdoll':True}
    got={k:vis.get(k) for k in want};good=all(bool(got[k])==v for k,v in want.items()) and not d.get('errors')
    res[f'{w}x{h}']={'got':got,'errors':d.get('errors',[])};ok=ok and good;print(('PASS ' if good else 'FAIL ')+f'{w}x{h} panel: music menus hidden; yawn, dance tuning, Start now shown; no errors',json.dumps(got))
(E/'checks133p.json').write_text(json.dumps({'passed':ok,'results':res},indent=1))
