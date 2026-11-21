"""Dance beat A/B, a block for the CP-92 integrator: release.html = the published UAT 140 page (work/cp140-published) +
beat-ab.js, appended as-is before the last </script>; no text edits. Also builds, for checks only, base107.html (UAT 140 +
CP-107's block, work/cp107/cp107-dances.js) and release107.html (the same + beat-ab.js), so all five dances can be tested
(CP-107 isn't in UAT 140). boot/ is the full build for real-Chrome checks. Usage: python build.py"""
from pathlib import Path
import json,hashlib,shutil
p=Path(__file__).parent;W=p.parent;B=W/'cp140-published';v=json.loads((B/'release-version.json').read_text())
s0=(B/'release.html').read_bytes();assert hashlib.sha256(s0).hexdigest()==v['releaseHTMLSHA256'],'base changed';s0=s0.decode('utf-8')
def add(s,f):
    b=Path(f).read_bytes();assert b'\r\n' not in b and bytes([8]) not in b,(f,'CRLF or control byte');i=s.rindex('</script>');return s[:i]+b.decode('utf-8')+chr(10)+s[i:]
out={'release.html':add(s0,p/'beat-ab.js'),'base107.html':add(s0,W/'cp107'/'cp107-dances.js')}
out['release107.html']=add(out['base107.html'],p/'beat-ab.js')
for n,s in out.items():(p/n).write_bytes(s.encode('utf-8'));print(n,hashlib.sha256(s.encode('utf-8')).hexdigest())
(p/'edits.json').write_text(json.dumps({'base':str(B/'release.html'),'edits':[],'appendedBeforeLastScriptClose':['beat-ab.js']},indent=1),encoding='utf-8')
json.dump({'displayName':v['displayName'],'version':v['version'],'apkVersion':v['apkVersion'],'base':'cp140-published','baseSHA256':v['releaseHTMLSHA256']},open(p/'release-version.json','w'))
if not (p/'boot').exists():shutil.copytree(B/'boot',p/'boot')
(p/'boot'/'index.html').write_bytes(out['release107.html'].encode('utf-8'))
