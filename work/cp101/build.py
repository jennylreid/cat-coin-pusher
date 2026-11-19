"""UAT 101 = CP-82 Power titles first, for Sonic meow and Tortitude (Jenny, Nov 18: "For all the powers, the rule should be
the words appear before the action is taken, because signs like meow and tortitude, in order to see them clearly, you want the
words out of the way. Hug, it probably doesn't matter as much."). As Formal inspection (CP-73) and Zoomies (CP-72) do: the big
name alone first, then the action with no words over it. Build name + "2x REACH" no longer drawn + the block cp82-titles.js.
Usage: python build.py -> release.html on published UAT 100"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s)
EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName']),
 # no words over Sonic meow's rings
 ("wildText('2× REACH',200,w43ChinY()+28,26,'#6ad8ff','#0b2a3e',5);}","/* CP-82: no \"2× REACH\" over the rings */}")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp82-titles.js','cp72-zfix.js']  # cp72-zfix.js: made by gen-zfix.py (Zoomies sound fix, PM's go Nov 18)
# the actions in the block are UAT 100's own pgpUse lines, byte for byte
blk=(p/'cp82-titles.js').read_bytes().decode('utf-8')
son=re.search(r"\n sonic\(\)\{(.*?)\},\n",blk,re.S).group(1)
tor=re.search(r"\n tortitude\(\)\{(.*?)\}\};\n",blk,re.S).group(1)
assert s.count(" if(P.id==='sonic'){"+son+"}\n")==1,'sonic action differs from UAT 100'
assert s.count(" if(P.id==='tortitude'){"+tor+"}}\nfunction pgpEnd(")==1,'tortitude action differs from UAT 100'
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
