"""UAT 133 bundle: the change checks' summary for stage.py, judged from the logs of the runs on this release.html."""
import json,re,hashlib
from pathlib import Path
p=Path(__file__).parent;e=p.parents[1]/'tickets/CP-100-evidence/uat133';R=[]
def log(n):return (p/'logs'/n).read_text(encoding='utf-8',errors='replace')
def ok(n,c,i=None):R.append({'name':n,'ok':bool(c),'info':i})
for n,f,need in [('CP-94 round (music, chest, powers)','cp94-round.log',17),('frozen pickup checks64','checks64.log',10)]:
    t=log(f);ps=len(re.findall(r'(?m)^PASS ',t));fs=len(re.findall(r'(?m)^FAIL ',t));ok(n,ps>=need and fs==0,{'pass':ps,'fail':fs})
pj=json.loads((e/'cp94/checks133p.json').read_text());ok('CP-94 panel in real Chrome, both sizes',pj['passed'])
A,B,C=log('mineA.log'),log('mineB.log'),log('mineC.log')
for n,t in [('mineA',A),('mineB',B),('mineC',C)]:m=re.search(r'errors (\[.*\])',t);ok(n+': no page errors',m and m.group(1)=='[]')
ok('lists stay on touch and a row starts its board',A.count('"list":"flex","mode":"levels"')>=2 and '"row":{"tapped":"First push' in A)
ok('hit-area audit: no overlaps, both sizes',A.count('"overlaps":[]')==2)
ok('Collections reward into the wallet',A.count('"after":{"wallet":520')==2)
ok('item 5: the two top-right icons have no tap area; a tap where they were opens nothing, both sizes',B.count('"oldIconTaps":{"opened":0,"screen":"main"')==2)
ok('item 3: Pet the cat runs with the ring; DONE ends it, both sizes',B.count('"doneTap":"end"')==2)
ok('item 1: goal boards: wide pill, drops only, both sizes',B.count('"wide":true,"clock":"18 drops"')==2)
ok('item 7: banner = board name only',B.count('"banner":"At the back"')==2)
ok('chip decision still right, both sizes',B.count('"lockWithCoin":false')==2 and B.count('"lockPet":true')==2)
ok('pause: no END ROUND on endless; goal END ROUND ends the round',C.count('"finish":{"x":-9999')==2 and C.count('"goalAfterEnd":{"paused":false,"phase":"end"')==2)
s=(p/'release.html').read_text(encoding='utf-8');ok('item 7: no ENDLESS text left for players',"ENDLESS" not in s)
f=[r['name'] for r in R if not r['ok']]
for r in R:print(('PASS ' if r['ok'] else 'FAIL ')+r['name'])
(e/'checks133.json').write_text(json.dumps({'build':str((p/'release.html').resolve()),'releaseSHA256':hashlib.sha256((p/'release.html').read_bytes()).hexdigest(),'passed':not f,'passedN':len(R)-len(f),'failed':f,'results':R},indent=1))
