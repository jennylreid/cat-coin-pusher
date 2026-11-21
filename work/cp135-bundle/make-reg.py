"""UAT 135 full regression = UAT 134's set (work/cp134-bundle/checks*-reg134.cjs, with every UAT 134 test update) run on this
build. Per copy: check 0 accepts "this release.html is the published UAT 135" (sha = publication-manifest.json's); references
carry this build's name; checks72s's reference also gets this build's block; output tickets/CP-100-evidence/uat135/regression.
Test-only updates for UAT 135's intended changes: listed in UPDATES below. Usage: python make-reg.py"""
from pathlib import Path
import json
p = Path(__file__).parent; S = p.parent / 'cp134-bundle'
E = json.loads((p / 'blocks.json').read_text())
for f in p.glob('checks*-reg135.cjs'): f.unlink()
def rep(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a)); return s.replace(a, b)
UPDATES = {  # file name -> [(old, new), ...]
 # checks133 C4: the reference is this build without H and I (work/cp135-mine = cp134-mine + build name + round-135.js), since the
 # board's Home button (item 4) and the build label changed for every board
 # checks75 3, 4: pixel frames against UAT 94, which draws its own board Home button: that area is blanked in both
 'checks75-reg135.cjs': [('const png=()=>{g.c.draw();', "const png=()=>{g.c.draw();(()=>{const cv=g.c.document.getElementById('cv'),k=cv.width/400,c2=cv.getContext('2d');c2.save();c2.setTransform(1,0,0,1,0,0);c2.fillStyle='#000';c2.fillRect(Math.floor(250*k),Math.floor(28*k),Math.ceil(70*k),Math.ceil(40*k));c2.restore();})(); /* UAT 135: the board's Home button area (gone in this build, drawn by UAT 94) blanked in both */"), ('const HM=()=>{g.c.draw();', "const HM=()=>{g.c.draw();(()=>{const cv=g.c.document.getElementById('cv'),k=cv.width/400,c2=cv.getContext('2d');c2.save();c2.setTransform(1,0,0,1,0,0);c2.fillStyle='#000';c2.fillRect(Math.floor(250*k),Math.floor(28*k),Math.ceil(70*k),Math.ceil(40*k));c2.restore();})(); /* UAT 135: the board's Home button area (gone in this build, drawn by UAT 94) blanked in both */")],
 # checks93 2: power frames against UAT 92, which draws the board's Home button: not drawn in either
 'checks93-reg135.cjs': [('g.run(\'S.dev=false;S.muted=true;if(typeof cp86FloatHold==="function")cp86FloatHold=function(){};\');', 'g.run(\'S.dev=false;S.muted=true;if(typeof cp86FloatHold==="function")cp86FloatHold=function(){};drawWildButton=function(){};\'); /* UAT 135: the board\'s Home button is gone (item 4); not drawn in the reference either */')],
 # checks97s 11: leftovers after the NEW BOARD plow are chance (coins on or behind the pusher, removed at its end); the check now
 # asks for no prize left, coins-only leftovers by the pusher, and the new board with only its own prizes (PM OK, Nov 20)
 'checks97s-reg135.cjs': [('const left0=J(\'END.stats.sweepLeft|0\');const s0=J("{coins:S.coins,pantry:JSON.stringify(PG.items||PG.pantry||{}),key:endKey(),order:endOrder(),pieces:bodies.filter(b=>!b.dead).length}");g.run(\'END.w.meter=END.METER;endStartSweep()\');', 'const left0=J(\'END.stats.sweepLeft|0\');const s0=J("{coins:S.coins,pantry:JSON.stringify(PG.items||PG.pantry||{}),key:endKey(),order:endOrder(),pieces:bodies.filter(b=>!b.dead).length}");g.run("globalThis.__lf=null;{const f=endPlowFree;endPlowFree=function(){__lf=bodies.filter(b=>!b.dead).map(b=>({k:b.kind,id:b.id||null,z:Math.round(b.rb.translation().z/M)}));return f.apply(this,arguments);};}END.w.meter=END.METER;endStartSweep()"); /* UAT 135: what the plow leaves (its last free call, at the sweep\'s end) */'), ('const s1=J("{coins:S.coins,pantry:JSON.stringify(PG.items||PG.pantry||{}),key:endKey(),left:END.stats.sweepLeft|0,pusher:pusherY,phase:WILD.phase,front:T.FRONT}");', 'const s1=J("{coins:S.coins,pantry:JSON.stringify(PG.items||PG.pantry||{}),key:endKey(),left:END.stats.sweepLeft|0,pusher:pusherY,phase:WILD.phase,front:T.FRONT}");const LF=J(\'__lf||[]\'),NI=J("bodies.filter(b=>!b.dead&&b.kind===\'item\').map(b=>b.id).sort()"),LI=J("(PGL_LEVELS[+endKey().slice(1)-1].p||[]).map(x=>x[0]).sort()");const lfOk=LF.every(b=>[\'coin\',\'silver\',\'gold5\'].includes(b.k)&&b.z<=270),newOk=JSON.stringify(NI)===JSON.stringify(LI);'), ("check('11 NEW BOARD: the pusher travels past the front edge, about 4.4 s, pays nothing (wallet, pantry), at most 1 piece left, next board in order, play resumes',", "check('11 (UAT 135) NEW BOARD: the pusher travels past the front edge, about 4.4 s, pays nothing (wallet, pantry), no prize left (any leftovers are coins on or behind the pusher, removed at the end), the new board starts with only its own prizes, next board in order, play resumes',"), ('&&s1.left-left0<=1&&s1.key!==s0.key', '&&lfOk&&newOk&&s1.key!==s0.key'), ('{s0:{...s0,order:undefined},s1,maxZ:', '{s0:{...s0,order:undefined},s1,leftover:LF,newItems:NI,layoutItems:LI,maxZ:')],
 'checks133-reg135.cjs': [("path.resolve(__dirname,'../cp134-mine/release.html')", "path.resolve(__dirname,'../cp135-mine/release.html') /* UAT 135: + round 135 */")],
}
k = 0
for f in sorted(S.glob('checks*-reg134.cjs')):
    s = f.read_text(encoding='utf-8')
    s = s.replace("m.displayName==='2026.11.20 UAT 134'", "m.displayName==='2026.11.20 UAT 135'").replace('/* UAT 134: the published bundle */', '/* UAT 135: the published bundle */')
    s = s.replace('CP-100-evidence/uat134/regression', 'CP-100-evidence/uat135/regression').replace('-reg134.json', '-reg135.json').replace('ref-base-named134.html', 'ref-base-named135.html')
    s = s.replace(".join(\"const BUILD = '2026.11.20 UAT 134';\")", ".join(\"const BUILD = '2026.11.20 UAT 135';\")")
    if f.name == 'checks72s-reg134.cjs':
        a = " /* UAT 134: + this bundle's edits and blocks */"
        lay = ("{const BL=" + json.dumps(E['blocks']) + ";for(const f of BL){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.resolve(__SELF,'..',f),'utf8')+String.fromCharCode(10)+B.slice(i);}}")
        s = rep(s, a, a + lay + " /* UAT 135: + this bundle's block */")
    for a, b in UPDATES.get(f.name.replace('reg134', 'reg135'), []): s = rep(s, a, b)
    (p / f.name.replace('reg134', 'reg135')).write_text(s, encoding='utf-8'); k += 1
print(k)
