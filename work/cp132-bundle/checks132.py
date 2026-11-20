"""UAT 132 bundle: the change checks' summary for stage.py (one line per block's check; logs in logs/, evidence in
tickets/CP-100-evidence/uat132). Judged from the logs of the runs on this release.html."""
import json,re,hashlib
from pathlib import Path
p=Path(__file__).parent;e=p.parents[1]/'tickets/CP-100-evidence/uat132';R=[]
def log(n):return (p/'logs'/n).read_text(encoding='utf-8',errors='replace')
def cnt(t):return len(re.findall(r'(?m)^PASS ',t)),len(re.findall(r'(?m)^FAIL ',t))
def ok(n,c,i=None):R.append({'name':n,'ok':bool(c),'info':i})
for n,f,need,allowed in [('CP-71 gutter push, levels','cp71-levels.log',2,[]),('CP-71 gutter push, endless','cp71-endless.log',2,[]),
  ('CP-74 hold (checks 1-5; check 0 = build identity, fails on a bundle by design)','cp74-hold.log',5,['0 ']),('CP-101 body','cp101-body.log',8,[]),
  ('frozen pickup checks64','checks64-final.log',10,[]),('Ragdoll dance checks101r','checks101r.log',12,[]),('CP-102 behaviour','cp102-behaviour.log',6,[]),('CP-102 panel','cp102-panel.log',8,[])]:
    t=log(f);ps,fs=cnt(t);bad=[l for l in re.findall(r'(?m)^FAIL (.*)$',t) if not any(l.startswith(a) for a in allowed)];ok(n,ps>=need and not bad,{'pass':ps,'fail':fs})
for f in ['mineA.log','mineB.log','mineC.log']:
    t=log(f);m=re.search(r'errors (\[.*\])',t);ok('mine '+f+': no page errors',m and m.group(1)=='[]')
t=log('mineA.log');ok('lists stay on touch, both sizes',t.count('"list":"flex","mode":"levels"')>=2 and t.count('"list":"flex","mode":"goals"')>=2 and '"row":{"tapped":"First push' in t)
ok('hit-area audit: no overlaps, both sizes',t.count('"overlaps":[]')==2)
ok('collections reward into the wallet (420 -> 520), both sizes',t.count('"after":{"wallet":520')==2)
t=log('mineB.log');ok('chip: heart does not lock, converts to fish, locks in Pet the cat, both sizes',t.count('"lockWithCoin":false')==2 and t.count('"hearts":0,"fish":[')==2 and t.count('"lockPet":true')==2)
ok('Pet strip beneath the board, peak 3.5, both sizes',t.count('"peak":3.5,"def":3.5,"room"')==2)
t=log('mineC.log');ok('pause: no END ROUND on endless; goal END ROUND ends the round, both sizes',t.count('"finish":{"x":-9999')==2 and t.count('"goalAfterEnd":{"paused":false,"phase":"end"')==2)
f=[r['name'] for r in R if not r['ok']]
for r in R:print(('PASS ' if r['ok'] else 'FAIL ')+r['name'])
(e/'checks132.json').write_text(json.dumps({'build':str((p/'release.html').resolve()),'releaseSHA256':hashlib.sha256((p/'release.html').read_bytes()).hexdigest(),'passed':not f,'passedN':len(R)-len(f),'failed':f,'results':R},indent=1))
