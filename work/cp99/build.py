"""UAT 99 = CP-79 Yawn sound as a Developer choice + CP-80 the Developer wheel on the Siamese board (edit + cp80-wheel.js).
CP-79 Yawn sound as a Developer choice (Jenny, Nov 18: "put today, A2, B2 and AB in the next UAT as a Developer choice
(today's is the default). I'll pick on my phone."). Build name + the block cp79-yawn.js (the 3 cleaned sounds embedded).
Usage: python build.py          -> release.html on the base in release-version.json (published UAT 98, pinned once it is out)
       DEV=1 python build.py    -> release-dev.html on published UAT 96 (preparation only, never published)"""
from pathlib import Path
import json,hashlib,os,re
p=Path(__file__).parent;W=p.parent;DEV=os.environ.get('DEV')=='1'
v=json.loads((p/'release-version.json').read_text())
if DEV:base,pin,outn,name=W/'cp96'/'release.html',json.loads((W/'cp96'/'publication-manifest.json').read_text())['releaseHTMLSHA256'],'release-dev.html','2026.11.18 UAT 99 (dev on UAT 96)'
else:base,pin,outn,name=W/v['base']/'release.html',v['baseSHA256'],'release.html',v['displayName']
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%name)]
# CP-80: the laser board's danceStart lets the Developer-forced wheel through (cp80-wheel.js sets W2_DEV_WHEEL)
EDITS.append(("danceStart=function(){if(WILD.laser||WILD.chase)return;return __laserDanceStart();};",
              "danceStart=function(){if((WILD.laser&&!W2_DEV_WHEEL)||WILD.chase)return;return __laserDanceStart();}; /* CP-80 */"))
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp79-yawn.js','cp80-wheel.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/('edits-dev.json' if DEV else 'edits.json')).write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out);print(p/outn,hashlib.sha256(out).hexdigest())
