"""UAT 102 = CP-72 peek-a-boo ending (Jenny, Nov 18: "keep this small jump, but before leaving the screen, pause at the edge
of the screen with just the eyes showing, just for a moment." / "go with the peekaboo ending also."): 4 edits to the
"Zoomies ending" choice (Peek-a-boo added and made the default; saved under a new key so every phone starts on it)
+ the block cp72-peek.js.
Usage: python build.py          -> release.html on the base in release-version.json (UAT 101, pinned once it is out)
       DEV=1 python build.py    -> release-dev.html on published UAT 100 (preparation only, never published)"""
from pathlib import Path
import json,hashlib,os,re
p=Path(__file__).parent;W=p.parent;DEV=os.environ.get('DEV')=='1'
v=json.loads((p/'release-version.json').read_text())
if DEV:base,pin,outn,name=W/'cp100'/'release.html','57f3dad50eb6ef644183f27db5056bda96a3ac9f395e8a4249d3edf14c0d4618','release-dev.html','2026.11.18 UAT 102 (dev on UAT 100)'
else:base,pin,outn,name=W/v['base']/'release.html',v['baseSHA256'],'release.html',v['displayName']
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%name)]
EDITS+=[("const KEY='catpusher.uat.cp72ending.v1',CHOICES=['short','hang'],NAMES={short:'Short close-up',hang:'Hang'},hold=.4;",
         "const KEY='catpusher.uat.cp72ending.v2',CHOICES=['peek','short','hang'],NAMES={peek:'Peek-a-boo',short:'Short close-up',hang:'Hang'},hold=.4; /* CP-72 peek-a-boo (UAT 102) */"),
        (" let pick='short';try{const v=localStorage.getItem(KEY);"," let pick='peek';try{const v=localStorage.getItem(KEY);"),
        (" const apply=()=>{L.style=pick==='hang'?'still':'crazy';};apply();"," const apply=()=>{L.style=pick==='hang'?'still':pick==='peek'?'peek':'crazy';};apply();"),
        # CP-72 Level 7 (Jenny, Nov 18: "nudge prizes only while they're sliding toward a side; resting edge prizes stay put."):
        # Zoomies' side guard eases a piece back only while it is moving toward the nearer side (faster than CP72G.out m/s)
        ("if(Math.abs(x-200)>edge){const v=b.rb.linvel(),d=x<200?1:-1;b.rb.wakeUp();b.rb.setLinvel({x:d*Math.max(1.6,d*v.x),y:v.y,z:v.z},true);",
         "if(Math.abs(x-200)>edge){const v=b.rb.linvel(),d=x<200?1:-1;if(-d*v.x<=CP72G.out)continue; /* CP-72 Level 7: only while sliding toward the side, and only enough to stop it */b.rb.wakeUp();b.rb.setLinvel({x:d*CP72G.back,y:v.y,z:v.z},true);")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp72-peek.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/('edits-dev.json' if DEV else 'edits.json')).write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out);print(p/outn,hashlib.sha256(out).hexdigest())
