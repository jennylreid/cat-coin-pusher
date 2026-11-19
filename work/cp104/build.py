"""UAT 104 = UAT 103 + CP-74 Hug with Codex's art (Jenny, Nov 18: "CP-74 Hug layout: approved. Title first, then the hug with
no words over it; small phones arms only is fine. Then Codex art." and "go ahead and get started on that. I think it looks decent.").
Build name + the blocks cp74-art.js (art as WebP data URIs, from work/cp74-hug/release/gen-art.py) and cp74-hug.js (source of
truth: work/cp74-hug/release/, copied here). Usage: python build.py -> release.html on published UAT 103"""
from pathlib import Path
import json,hashlib,re,shutil
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
ADD=['cp74-art.js','cp74-hug.js']
for f in ADD:shutil.copyfile(W/'cp74-hug'/'release'/f,p/f)
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s)
EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
