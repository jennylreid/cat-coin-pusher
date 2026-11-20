"""UAT 134 full regression = UAT 133's set (work/cp133-bundle/checks*-reg133.cjs, with every UAT 133 test update) run on this
build, plus CP-94's checks133 (work/cp133-round/checks133.cjs). Per copy: check 0 accepts "this release.html is the published
UAT 134" (sha = publication-manifest.json's); references carry this build's name; checks72s's reference also gets this build's
edits and blocks; output tickets/CP-100-evidence/uat134/regression.
Test-only updates for UAT 134's intended changes (PM, Nov 20):
 - checks102d 1, 2 (item I): every Developer start-now button (side game or power) starts on the endless board with that game's
   or power's own cat, from every board and Home (was: the board kept / the endless board only when already on it).
 - checks133 C2 (item H): the Ragdoll's Dance break draws the grey shoulders with the white chest (was: no grey shoulders);
   C3: the chest check stays for the Hug; the dance's board-rim change by the grey shoulders is CP-94's checks134 H1;
   C4: compared with this build without H and I (work/cp134-mine; was published UAT 132, whose build label differs);
   P1, P3, P4 (item I): the endless board with the own cat (Hug -> Ragdoll from every board; Laser on the Siamese's endless
   board, no switch, the round goes on; Treat toss from the Tuxedo -> the Orange on the endless board).
Usage: python make-reg.py"""
from pathlib import Path
import json
p = Path(__file__).parent; S = p.parent / 'cp133-bundle'
E = json.loads((p / 'blocks.json').read_text())
for f in p.glob('checks*-reg134.cjs'): f.unlink()
def rep(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a)); return s.replace(a, b)
k = 0
for f in sorted(S.glob('checks*-reg133.cjs')):
    s = f.read_text(encoding='utf-8')
    s = s.replace("m.displayName==='2026.11.20 UAT 133'", "m.displayName==='2026.11.20 UAT 134'").replace('/* UAT 133: the published bundle */', '/* UAT 134: the published bundle */')
    s = s.replace('CP-100-evidence/uat133/regression', 'CP-100-evidence/uat134/regression').replace('-reg133.json', '-reg134.json').replace('ref-base-named133.html', 'ref-base-named134.html')
    s = s.replace(".join(\"const BUILD = '2026.11.20 UAT 133';\")", ".join(\"const BUILD = '2026.11.20 UAT 134';\")")
    if f.name == 'checks72s-reg133.cjs':
        a = " /* UAT 133: + this bundle's edits and blocks */"
        lay = ("{const EE=" + json.dumps(E['edits'], ensure_ascii=True) + ";for(const [a,b] of EE){if(B.split(a).length!==2)throw new Error('edit-134 '+a.slice(0,50));B=B.split(a).join(b);}"
               "const BL=" + json.dumps(E['blocks']) + ";for(const f of BL){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.resolve(__SELF,'..',f),'utf8')+String.fromCharCode(10)+B.slice(i);}}")
        s = rep(s, a, a + lay + " /* UAT 134: + this bundle's edits and blocks */")
    if f.name == 'checks102d-reg133.cjs':
        s = rep(s, "const want=w.startsWith('home')?w.split(':')[1]:a.cat,good=!!st&&st.cat===want&&(w.startsWith('endless')?st.end:!st.end)&&",
                "const want={toss:'orange',chase:'siamese',pet:'ragdoll',pounce:'tortie'}[id],good=!!st&&st.cat===want&&st.end&& /* UAT 134 (item I): the endless board with the game's own cat */")
        s = rep(s, "check('1 every Side game button starts its game on every board (endless, each cat, from Home), no coin used, the board kept'",
                "check('1 (UAT 134) every Side game button starts its game on the endless board with its own cat, from every board and Home, no coin used'")
        s = rep(s, "const want=c,good=!!st&&st.cat===want&&(w.startsWith('endless')?st.end:true)&&", "const want=c,good=!!st&&st.cat===want&&st.end&& /* UAT 134 (item I): always the endless board */")
        s = rep(s, "check(\"2 (UAT 133) every Power button switches to that power's cat and starts its power on every board (the endless board stays on);",
                "check(\"2 (UAT 134) every Power button starts its power on the endless board with that power's cat, from every board and Home;")
    (p / f.name.replace('reg133', 'reg134')).write_text(s, encoding='utf-8'); k += 1
# CP-94's checks133 on this build
s = (p.parent / 'cp133-round/checks133.cjs').read_text(encoding='utf-8')
s = rep(s, "path.join(__dirname,'../../tickets/CP-101-evidence/round133')", "path.join(__dirname,'../../tickets/CP-100-evidence/uat134/regression/checks133')")
s = rep(s, "path.join(out,'checks133.json')", "path.join(out,'checks133-reg134.json')")
s = rep(s, "rows.dance.grey===0&&", "rows.dance.grey>0&& /* UAT 134 (item H): grey shoulders with the white chest */")
s = rep(s, ": during the Ragdoll's flop no gold and no dark rim line under the head; no grey shoulders`", ": (UAT 134) during the Ragdoll's flop no gold and no dark rim line under the head; the grey shoulders draw with the chest`")
s = rep(s, "rows.hug.inside===0&&rows.dance.inside===0", "rows.hug.inside===0 /* UAT 134: the dance's rim change by the grey shoulders is checks134 H1 */")
s = rep(s, ": the chest never changes a pixel inside the board below its back edge`", ": (UAT 134) during the Hug the chest never changes a pixel inside the board below its back edge`")
a = "{const fr={};for(const [n,f] of [['base',base],['new',src]]){let g=await game(f,'level:ragdoll',{render:true});"
s = rep(s, a, "{const fr={};for(const [n,f] of [['base',path.resolve(__dirname,'../cp134-mine/release.html')],['new',src]]){let g=await game(f,'level:ragdoll',{render:true}); /* UAT 134: vs this build without H and I */")
s = rep(s, "check(\"C4 the Ragdoll's board (no Hug, no dance) and the Tuxedo's dance are pixel-identical to the base\"", "check(\"C4 (UAT 134) the Ragdoll's board (no Hug, no dance) and the Tuxedo's dance are pixel-identical to this build without H and I\"")
s = rep(s, "(w.startsWith('endless')?x.st.end:!x.st.end)", "x.st.end /* UAT 134 (item I) */")
s = rep(s, "endless board and Home: switches to the Ragdoll, the Hug plays, stock unchanged, endless stays on\"", "endless board and Home: (UAT 134) the endless board with the Ragdoll, the Hug plays, stock unchanged\"")
s = rep(s, "{const g=await game(src,'level:siamese');g.run('WILD.left=77;');const l0=+g.run('WILD.left');", "{const g=await game(src,'endless:siamese');const l0=0; /* UAT 134: on its own cat's endless board */")
s = rep(s, "st&&s.cat==='siamese'&&s.phase==='play'&&s.left<=l0&&s.left>l0-15&&!g.errs().length", "st&&s.cat==='siamese'&&s.phase==='play'&&s.end&&!g.errs().length")
s = rep(s, "JSON.stringify({cat:PGU.boardCat,phase:WILD.phase,left:WILD.left})", "JSON.stringify({cat:PGU.boardCat,phase:WILD.phase,end:typeof endActive==='function'&&endActive()})")
s = rep(s, "\"P3 a power on its own cat's board: no switch, the round goes on\"", "\"P3 (UAT 134) a power on its own cat's endless board: no switch, the round goes on\"")
s = rep(s, "st&&g.run('PGU.boardCat')==='tuxedo'", "st&&g.run('PGU.boardCat')==='orange'&&g.run(\"typeof endActive==='function'&&endActive()\")")
s = rep(s, "\"P4 side game buttons are unchanged: Treat toss from the Tuxedo's board starts there\"", "\"P4 (UAT 134) Treat toss from the Tuxedo's board starts on the endless board with the Orange\"")
(p / 'checks133-reg134.cjs').write_text('// UAT 134 regression copy of work/cp133-round/checks133.cjs (make-reg.py); test-only updates marked UAT 134.\n' + s, encoding='utf-8')
print(k + 1)
