"""CP-87 (folder work/cp107: UAT 107) = Home > "Daily puzzles" (UAT only): the build name + the block cp87-puzzles.js (made by make-block.py from
cp87-shell.js and the five puzzle pages), appended before the last </script>. Nothing else changes.
Usage: python build.py          -> release.html on the base in release-version.json (the UAT published when the PM frees the channel)
       DEV=1 python build.py    -> release-dev.html on published UAT 105 (preparation only, never published)"""
from pathlib import Path
import json,hashlib,os,re,subprocess,sys
p=Path(__file__).parent;W=p.parent;DEV=os.environ.get('DEV')=='1'
subprocess.run([sys.executable,str(p/'make-block.py')],check=True,stdout=subprocess.DEVNULL)
if DEV:base,pin,outn,name=W/'cp105'/'release.html','d08597d1a6e355071a67742cd070a687156b7dd40ea791d3d71b1f57b4e6db39','release-dev.html','2026.11.18 UAT 1xx (CP-87 dev on UAT 105)'
else:
    v=json.loads((p/'release-version.json').read_text());base,pin,outn,name=W/v['base']/'release.html',v['baseSHA256'],'release.html',v['displayName']
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%name)]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp87-puzzles.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/('edits-dev.json' if DEV else 'edits.json')).write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out);print(p/outn,len(out),hashlib.sha256(out).hexdigest())
