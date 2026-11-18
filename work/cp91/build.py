"""CP-72 (Jenny, Nov 18: "CP-72 Zoomies v2: approved; no hold at the edge (an occasional second prize is fine). Step 2 go,
into the next UAT."). UAT 91 on pinned published UAT 90. The Orange cat's power, Zoomies, is rebuilt: two kittens with the
zoomies (play-bow, zigzag sprint, circle, arched hop, spook jump, flip, leap off the front) shove what they run into over
the front edge (at most 1 prize per use); double-speed pusher for 7 s. One text edit (the build name) + the block
cp72-added.js (from work/cp72-zoomies/cp72-zoomies.js, the approved prototype).
Usage: python build.py             (on ../cp90/release.html, sha pinned below once UAT 90 is published)
       python build.py --dev FILE  (prep only, on another base, e.g. ../cp89/release.html -> release-dev.html; never published)"""
from pathlib import Path
import json,hashlib,sys,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
BASE_SHA=''  # published UAT 90 (work/cp90/release.html): fill in when the PM says "UAT 90 is out"
dev='--dev' in sys.argv
src=Path(sys.argv[sys.argv.index('--dev')+1]) if dev else W/v['base']/'release.html'
s=src.read_bytes()
if not dev:
    assert BASE_SHA and hashlib.sha256(s).hexdigest()==BASE_SHA,'base is not published UAT 90'
s=s.decode('utf-8')
m=re.findall(r"const BUILD = '[^']*';",s);assert len(m)==1
EDITS=[(m[0],"const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
# what the block hooks must exist in the base
for need in ("function pgpUse(","function pgpTick(","function pgpEnd(","function pgpDraw(","function pgpSideGame(","slide(vol,dur,back,turbo){","orange:{id:'zoomies'","function fallOff("):
    assert need in s,need
add=(p/'cp72-added.js').read_text(encoding='utf-8')
i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
out=s.encode('utf-8');name='release-dev.html' if dev else 'release.html'
if not dev:(p/'edits.json').write_text(json.dumps({'base':str(src),'edits':EDITS,'appendedBeforeLastScriptClose':'cp72-added.js'},indent=1),encoding='utf-8')
(p/name).write_bytes(out)
print(p/name,hashlib.sha256(out).hexdigest())
