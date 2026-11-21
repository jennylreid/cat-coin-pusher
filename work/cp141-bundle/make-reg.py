"""UAT 141 full regression = UAT 140's set (work/cp140-bundle/checks*-reg140.cjs, with every earlier test update) run on this
build. Per copy: check 0 accepts "this release.html is the published UAT 141"; references carry this build's name; checks72s's
reference also gets this build's edit and blocks; checks133 C4's reference is work/cp141-mine (cp140-mine + this build's name,
edit and blocks); output tickets/CP-100-evidence/uat141/regression. Test-only updates: UPDATES below. Usage: python make-reg.py"""
from pathlib import Path
import json
p = Path(__file__).parent; S = p.parent / 'cp140-bundle'
E = json.loads((p / 'blocks.json').read_text())
for f in p.glob('checks*-reg141.cjs'): f.unlink()
def rep(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a)); return s.replace(a, b)
UPDATES = {  # file name -> [(old, new[, count]), ...]
 # checks101r 9: CP-107 (in UAT 141) gives the Siamese and the Tortie their Dance breaks
 'checks101r-reg141.cjs': [("check('9 the Siamese and the Tortie still have no Dance break',!res.siamese&&!res.tortie,res);", "check('9 the Siamese and the Tortie have their Dance breaks (UAT 141: CP-107)',res.siamese&&res.tortie,res);")],
 # checks102d 3: with CP-107, "Start Dance break now" on the Siamese's and the Tortie's boards starts their own dance (no note)
 # checks75 4: with CP-107 the Siamese and the Tortie have a Dance meter too: blanked like the Orange's and the Ragdoll's
 'checks75-reg141.cjs': [("FR=()=>(cat==='orange'||cat==='ragdoll')?HM():H(png())", "FR=()=>(cat==='orange'||cat==='ragdoll'||cat==='siamese'||cat==='tortie' /* UAT 141: CP-107 Dance meters */)?HM():H(png())"), ("x0=Math.floor((cat==='ragdoll'?255:300)*k)", "x0=Math.floor((cat==='ragdoll'?255:(cat==='siamese'||cat==='tortie')?250:300 /* UAT 141: their meter sits right of the banked side-game coin (CP-107), like the Ragdoll's */)*k)")],
 # checks88 2: with CP-107 a Siamese/Tortie Dance break can start meanwhile; their side game waits for it (CP-107), so the tap comes after it
 'checks88-reg141.cjs': [("for(let i=0;i<60*8&&g.run('!!W2_YAWN');i++)tk();for(let i=0;i<30;i++)tk();", "for(let i=0;i<60*8&&g.run('!!W2_YAWN');i++)tk();for(let i=0;i<60*60&&g.run('!!WILD.dance');i++)tk() /* UAT 141: CP-107, the side game waits for the cat's Dance break */;for(let i=0;i<30;i++)tk();")],
 'checks102d-reg141.cjs': [("!R['level:siamese'].dance&&!R['level:siamese'].want&&!R['level:tortie'].dance&&!R['level:tortie'].want&&", "R['level:siamese'].dance&&R['level:siamese'].cat==='siamese'&&R['level:tortie'].dance&&R['level:tortie'].cat==='tortie' /* UAT 141: CP-107 gives them their dances */&&"),
   ("Siamese and Tortie get the note, no dance\",ok,R);", "Siamese and Tortie get their own dance (UAT 141: CP-107)\",ok,R);")],
}
k = 0
for f in sorted(S.glob('checks*-reg140.cjs')):
    s = f.read_text(encoding='utf-8')
    s = s.replace("m.displayName==='2026.11.21 UAT 140'", "m.displayName==='2026.11.21 UAT 141'").replace('/* UAT 140: the published build */', '/* UAT 141: the published build */')
    s = s.replace('CP-100-evidence/uat140/regression', 'CP-100-evidence/uat141/regression').replace('-reg140.json', '-reg141.json').replace('ref-base-named140.html', 'ref-base-named141.html')
    s = s.replace(".join(\"const BUILD = '2026.11.21 UAT 140';\")", ".join(\"const BUILD = '2026.11.21 UAT 141';\")")
    if f.name == 'checks72s-reg140.cjs':
        a = " /* UAT 139 + 140: edits and blocks */"
        lay = ("{const EE=" + json.dumps(E['edits'], ensure_ascii=True) + ";for(const [a,b] of EE){if(B.split(a).length!==2)throw new Error('edit-141 '+a.slice(0,50));B=B.split(a).join(b);}"
               "const BL=" + json.dumps(E['blocks']) + ";{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+String.fromCharCode(10)+BL.map(f=>fs.readFileSync(path.resolve(__SELF,'..',f),'utf8')).join(String.fromCharCode(10))+String.fromCharCode(10)+B.slice(i);}}")
        s = rep(s, a, a + lay + " /* UAT 141: edit and blocks */")
    if f.name == 'checks133-reg140.cjs':
        s = rep(s, "path.resolve(__dirname,'../cp140-mine/release.html') /* UAT 140: + 139 and 140 */", "path.resolve(__dirname,'../cp141-mine/release.html') /* UAT 141: + 139, 140 and 141 */")
    for u in UPDATES.get(f.name.replace('reg140', 'reg141'), []): s = rep(s, *u)
    (p / f.name.replace('reg140', 'reg141')).write_text('// UAT 141 regression copy of work/cp140-bundle/' + f.name + ' (make-reg.py).' + chr(10) + s, encoding='utf-8'); k += 1
print(k)
