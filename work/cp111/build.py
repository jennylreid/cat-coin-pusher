"""CP-88 Bank side-game coins (see setup.py). Build name + the laser hint moved right of the slot + the block cp88-bank.js.
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# the laser board's hint ("LASER COIN SOON" / "LASER x n") sits where the slot goes: while the slot shows, it is drawn right of
# it without its dot (the slot shows the laser coin); during a laser chase the slot hides and the chase's bar shows as before
a="else{laserDotGlyph(x0+12,y,6,1);ctx.font='bold 11px system-ui';ctx.fillStyle='#ffc8c8';ctx.fillText(WILD.chases?'LASER \u00d7'+WILD.chaseKnocked:'LASER COIN SOON',x0+24,y+1,100);}"
EDITS.append((a,"else{const cp88=typeof cp88Shown==='function'&&cp88Shown();if(!cp88)laserDotGlyph(x0+12,y,6,1);ctx.font='bold 11px system-ui';ctx.fillStyle='#ffc8c8';ctx.fillText(WILD.chases?'LASER \u00d7'+WILD.chaseKnocked:'LASER COIN SOON',cp88?x0+50:x0+24,y+1,cp88?74:100);} /* CP-88 */"))
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp88-bank.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
