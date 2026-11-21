"""UAT 138 full regression = UAT 137's set (work/cp137-bundle/checks*-reg137.cjs, with every earlier test update) run on this
build. Per copy: check 0 accepts "this release.html is the published UAT 138" (sha = publication-manifest.json's); references
carry this build's name; checks72s's reference also gets this build's edits and blocks; checks133 C4's reference is
work/cp138-mine (cp137-mine + this build's name, edits and blocks); output tickets/CP-100-evidence/uat138/regression.
Test-only updates for UAT 138's intended changes: listed in UPDATES below. Usage: python make-reg.py"""
from pathlib import Path
import json
p = Path(__file__).parent; S = p.parent / 'cp137-bundle'
E = json.loads((p / 'blocks.json').read_text())
for f in p.glob('checks*-reg138.cjs'): f.unlink()
def rep(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a)); return s.replace(a, b)
UPDATES = {  # file name -> [(old, new[, count]), ...]
 # checks75, checks93: pixel frames against old builds: the UAT-only comparison pills (bottom left of every board) are off
 # checks71 1 (Jenny's Yawn rule): with toys (prizes) on the board, the Yawn's first pick is a toy or a special coin nearer its side; a picked toy goes to the gutter
 'checks71-reg138.cjs': [("pick.every(c=>c[0]!=='item')&&oneSide", "(mode==='toys'?(pick[0]&&!['coin','silver','gold5'].includes(pick[0][0])&&pick.slice(1).every(c=>c[0]!=='item')):pick.every(c=>c[0]!=='item'))&&oneSide /* UAT 138: with a prize (or a special coin nearer its side) on the board, that goes first */"), ("(mode!=='toys'||toysLeft===3)", "(mode!=='toys'||toysLeft===(pick[0]&&pick[0][0]==='item'?2:3)) /* UAT 138: a toy picked first goes to the gutter */")],
 'checks75-reg138.cjs': [('g.run(\'S.dev=false;S.muted=true;if(typeof cp88Shown==="function")cp88Shown=function(){return false;};\');', 'g.run(\'S.dev=false;S.muted=true;if(typeof cp88Shown==="function")cp88Shown=function(){return false;};globalThis.cp138Pills=function(){return false};\'); /* UAT 138: the on-board comparison pills off (not in the reference) */')],
 'checks93-reg138.cjs': [('g.run(\'S.dev=false;S.muted=true;if(typeof cp86FloatHold==="function")cp86FloatHold=function(){};drawWildButton=function(){};\');', 'g.run(\'S.dev=false;S.muted=true;if(typeof cp86FloatHold==="function")cp86FloatHold=function(){};drawWildButton=function(){};globalThis.cp138Pills=function(){return false};\'); /* UAT 138: pills off */')],
}
k = 0
for f in sorted(S.glob('checks*-reg137.cjs')):
    s = f.read_text(encoding='utf-8')
    s = s.replace("m.displayName==='2026.11.20 UAT 137'", "m.displayName==='2026.11.20 UAT 138'").replace('/* UAT 137: the published build */', '/* UAT 138: the published build */')
    s = s.replace('CP-100-evidence/uat137/regression', 'CP-100-evidence/uat138/regression').replace('-reg137.json', '-reg138.json').replace('ref-base-named137.html', 'ref-base-named138.html')
    s = s.replace(".join(\"const BUILD = '2026.11.20 UAT 137';\")", ".join(\"const BUILD = '2026.11.20 UAT 138';\")")
    if f.name == 'checks72s-reg137.cjs':
        a = " /* UAT 137: + this build's edits and block */"
        lay = ("{const EE=" + json.dumps(E['edits'], ensure_ascii=True) + ";for(const [a,b] of EE){if(B.split(a).length!==2)throw new Error('edit-138 '+a.slice(0,50));B=B.split(a).join(b);}"
               "const BL=" + json.dumps(E['blocks']) + ";{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+String.fromCharCode(10)+BL.map(f=>fs.readFileSync(path.resolve(__SELF,'..',f),'utf8')).join(String.fromCharCode(10))+String.fromCharCode(10)+B.slice(i);}}")
        s = rep(s, a, a + lay + " /* UAT 138: + this build's edits and blocks */")
    if f.name == 'checks133-reg137.cjs':
        s = rep(s, "path.resolve(__dirname,'../cp137-mine/release.html')", "path.resolve(__dirname,'../cp138-mine/release.html') /* UAT 138: + this build's name, edits and blocks */")
    for u in UPDATES.get(f.name.replace('reg137', 'reg138'), []): s = rep(s, *u)
    (p / f.name.replace('reg137', 'reg138')).write_text('// UAT 138 regression copy of work/cp137-bundle/' + f.name + ' (make-reg.py).\n' + s, encoding='utf-8'); k += 1
print(k)
