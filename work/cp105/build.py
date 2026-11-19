"""UAT 105 = CP-72 Zoomies ending, final (Jenny, Nov 18: "only peek-a-boo. Kitten stays small: the puffed one hangs back and
peeks at normal size (at most a little bigger), no blow-up and no screen-sized cat. Remove the other ending choices.")
+ the "Zoomies sound" choice removed (today's sound stays) + the stale "Test this build / UAT 62" label shows this build.
Edits + the block cp72-small.js.
Usage: python build.py          -> release.html on the base in release-version.json (UAT 104, pinned once it is out)
       DEV=1 python build.py    -> release-dev.html on published UAT 103 (preparation only, never published)"""
from pathlib import Path
import json,hashlib,os,re
p=Path(__file__).parent;W=p.parent;DEV=os.environ.get('DEV')=='1'
v=json.loads((p/'release-version.json').read_text())
if DEV:base,pin,outn,name=W/'cp103'/'release.html','8d9eee781044fceded19dd719a119cc3ae4c8ee498e8d667116705fe699beba6','release-dev.html','2026.11.18 UAT 105 (dev on UAT 103)'
else:base,pin,outn,name=W/v['base']/'release.html',v['baseSHA256'],'release.html',v['displayName']
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%name)]
EDITS+=[
 # Zoomies sound: only today's (a P1-P3 pick saved on a phone is no longer valid, so today's plays); its Engineer tools box goes
 ("const KEY='catpusher.uat.cp72zsound.v1',CHOICES=['today','P1','P2','P3'],",
  "const KEY='catpusher.uat.cp72zsound.v1',CHOICES=['today'], /* CP-72 (UAT 105): P1-P3 dropped, today's sound stays */"),
 ("if(!S.dev||!eng||eng.querySelector('#cp72-zsound'))return r;",
  "if(CP72Z.CHOICES.length<2||!S.dev||!eng||eng.querySelector('#cp72-zsound'))return r; /* CP-72 (UAT 105): no choice to show */"),
 # Zoomies ending: only Peek-a-boo; its Engineer tools box goes
 ("CHOICES=['peek','short','hang'],","CHOICES=['peek'], /* CP-72 (UAT 105): only Peek-a-boo */"),
 ("if(!S.dev||!eng||eng.querySelector('#cp72-ending'))return r;",
  "if(CP72E.CHOICES.length<2||!S.dev||!eng||eng.querySelector('#cp72-ending'))return r; /* CP-72 (UAT 105): no choice to show */"),
 # stale label: "Test this build" showed "UAT 62"; it now shows this build's number
 ("<h3><span>Test this build</span><span>UAT 62</span></h3>'",
  "<h3><span>Test this build</span><span>'+BUILD.split(' ').slice(-2).join(' ')+'</span></h3>'"),
]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp72-small.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/('edits-dev.json' if DEV else 'edits.json')).write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out);print(p/outn,hashlib.sha256(out).hexdigest())
