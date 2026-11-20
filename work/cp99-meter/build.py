"""CP-99 Treat toss meter out of the way (Jenny, Nov 19: "the measuring stick that displays how much you've captured. It's
actually in the way of the capturing. So I'd like it to be moved elsewhere on the board so that it's not in the middle of the
game." Then: "I think it'd be better beneath the board."). Only the meter bar moves: beneath the table's front edge, above
the bottom corner text, scaled down evenly to fit that gap; where there is no room (short screens such as 360x640, where the
table reaches the bottom) just under the top bar, above the highest treat. The TREAT TOSS! title, the end words, the treats
and the timing are unchanged. Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# the meter block of tossDraw: its own y (M) instead of the toss's y (Y)
a0="const D=WILD.toss,Y=TOSS_HUD_Y;ctx.save();"
EDITS.append((a0,"const D=WILD.toss,Y=TOSS_HUD_Y,M=cp99MeterY();ctx.save(); /* CP-99 */"))
i=s.index("  uiRound(16,Y-20,368,40,18,");j=s.index("  if(D.phase==='intro')",i);blk=s[i:j]
assert s.count(blk)==1 and len(re.findall(r'\bY\b',blk))==5,re.findall(r'\bY\b',blk)
# scaled evenly about its centre to fit the gap under the table (cp99MeterK)
EDITS.append((blk,"  ctx.save();{const K=cp99MeterK();ctx.translate(200,M);ctx.scale(K,K);ctx.translate(-200,-M);} /* CP-99 */\n"+re.sub(r'\bY\b','M',blk)+"  ctx.restore();\n"))
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp99-meter.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
