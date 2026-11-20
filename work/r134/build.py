"""UAT 134 round blocks H and I (integrated by the CP-92 engineer): release.html = the published UAT 133 page
(work/cp133-published) + cp134-shoulders.js (H) + cp134-start.js (I), each appended as-is before the
last </script>; no text edits. ONLY=name.js builds with that block alone. Also writes boot/ for real-Chrome checks.
Usage: python build.py"""
from pathlib import Path
import json,hashlib,os,shutil
p=Path(__file__).parent;W=p.parent;B=W/'cp133-published';v=json.loads((B/'release-version.json').read_text())
s=(B/'release.html').read_bytes();assert hashlib.sha256(s).hexdigest()==v['releaseHTMLSHA256'],'base changed';s=s.decode('utf-8')
ADD=[os.environ['ONLY']] if os.environ.get('ONLY') else ['cp134-shoulders.js','cp134-start.js']
for f in ADD:
    b=(p/f).read_bytes();assert b'\r\n' not in b,(f,'CRLF');i=s.rindex('</script>');s=s[:i]+b.decode('utf-8')+chr(10)+s[i:]
outn='release.html' if not os.environ.get('ONLY') else 'release-'+ADD[0].replace('.js','.html')
(p/'edits.json').write_text(json.dumps({'base':str(B/'release.html'),'edits':[],'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out)
json.dump({'displayName':v['displayName'],'version':v['version'],'apkVersion':7,'base':'cp133-published','baseSHA256':v['releaseHTMLSHA256']},open(p/'release-version.json','w'))
if not (p/'art').exists():shutil.copytree(B/'art',p/'art')
if not os.environ.get('ONLY'):
    if not (p/'boot').exists():shutil.copytree(B/'boot',p/'boot')
    (p/'boot'/'index.html').write_bytes(out)
print(outn,hashlib.sha256(out).hexdigest())
