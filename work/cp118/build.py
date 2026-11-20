"""CP-86 Sonic meow mitts (see setup.py). Build name + three in-place edits to UAT 114's CP-86 mitts block (the held beat).
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-86 held beat (Jenny, Nov 19: "the sound wave should stop, and then there should be a beat where the cat's still in the
# sonic meow pose, and then the cat comes out of the pose."): the block cp86-beat.js, and one edit in the CP-86 update hook
# so floating texts keep waiting through the pose's tail as they wait for the power.
EDITS+=[("for(const f of floats)if(!PGPX)f.cp86seen=1;",
  "for(const f of floats)if(!PGPX&&!CP86T)f.cp86seen=1; /* CP-86 held beat: texts wait through the tail */")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp86-beat.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
