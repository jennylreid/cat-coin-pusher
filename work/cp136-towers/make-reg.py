"""UAT 136 full regression (covers UAT 135 + 136; PM, Nov 20: "publish as UAT 136 ... then run the full regression") =
UAT 134's set (work/cp134-bundle/checks*-reg134.cjs, with its test updates) run on this build. Per copy: check 0 accepts "this
release.html is the published UAT 136" (sha = publication-manifest.json's); references carry this build's name; checks72s's
reference also gets UAT 135's block and this build's block; output tickets/CP-93-evidence/uat136/regression.
Tower physics stays "Today" in every suite (the default), so these suites see today's towers.
Usage: python make-reg.py"""
from pathlib import Path
import json
p = Path(__file__).parent; S = p.parent / 'cp134-bundle'
for f in p.glob('checks*-reg136.cjs'): f.unlink()
def rep(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a)); return s.replace(a, b)
B135 = json.loads((p.parent / 'cp135-bundle' / 'blocks.json').read_text())
k = 0
for f in sorted(S.glob('checks*-reg134.cjs')):
    s = f.read_text(encoding='utf-8')
    s = s.replace("m.displayName==='2026.11.20 UAT 134'", "m.displayName==='2026.11.20 UAT 136'").replace('/* UAT 134: the published bundle */', '/* UAT 136: the published build */')
    s = s.replace('CP-100-evidence/uat134/regression', 'CP-93-evidence/uat136/regression').replace('-reg134.json', '-reg136.json').replace('ref-base-named134.html', 'ref-base-named136.html')
    s = s.replace(".join(\"const BUILD = '2026.11.20 UAT 134';\")", ".join(\"const BUILD = '2026.11.20 UAT 136';\")")
    if f.name == 'checks72s-reg134.cjs':
        a = " /* UAT 134: + this bundle's edits and blocks */"
        lay = ("{const EE=" + json.dumps(B135.get('edits', []), ensure_ascii=True) + ";for(const [a,b] of EE){if(B.split(a).length!==2)throw new Error('edit-135 '+a.slice(0,50));B=B.split(a).join(b);}"
               "const BL=" + json.dumps(B135['blocks'] + ['cp136-towers/cp93-physics.js']) + ";for(const f of BL){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.resolve(__SELF,'..',f),'utf8')+String.fromCharCode(10)+B.slice(i);}}")
        s = rep(s, a, a + lay + " /* UAT 136: + UAT 135's block and this build's block */")
    (p / f.name.replace('reg134', 'reg136')).write_text('// UAT 136 regression copy of work/cp134-bundle/' + f.name + ' (make-reg.py).\n' + s, encoding='utf-8'); k += 1
print(k)
