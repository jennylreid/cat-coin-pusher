"""CP-64 add-on (Jenny, Nov 17): Jackpot prizes don't fill the Dance meter. UAT 89 on pinned published UAT 88.
One text edit (build label) + the add-on block cp64-meter.js.
Usage: python build.py            (on ../cp88/release.html, sha pinned below)
       python build.py --dev FILE (prep only: on another base, e.g. ../cp86/release.html; not for publishing)"""
from pathlib import Path
import json,hashlib,sys,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
BASE_SHA='71b35eb9ada651b8389a386b8900a87e98876c28e01dac58aa55bb9fefa77c07'  # published UAT 88 (work/cp88/release.html)
dev='--dev' in sys.argv
src=Path(sys.argv[sys.argv.index('--dev')+1]) if dev else W/v['base']/'release.html'
s=src.read_bytes()
if not dev:
    assert BASE_SHA and hashlib.sha256(s).hexdigest()==BASE_SHA,'base is not published UAT 88'
s=s.decode('utf-8')
m=re.findall(r"const BUILD = '[^']*';",s);assert len(m)==1
EDITS=[(m[0],"const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
add=(p/'cp64-meter.js').read_text(encoding='utf-8')
assert 'wildLandBonus' in s and 'function danceFill' in s and 'cp64Drop' in s
i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
out=s.encode('utf-8');name='release-dev.html' if dev else 'release.html'
if not dev:(p/'edits.json').write_text(json.dumps({'base':str(src),'edits':EDITS,'appendedBeforeLastScriptClose':'cp64-meter.js'},indent=1),encoding='utf-8')
(p/name).write_bytes(out)
print(p/name,hashlib.sha256(out).hexdigest())
