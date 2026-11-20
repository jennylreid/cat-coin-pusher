"""CP-92 rework 2 (plow sweep) + endless HUD fix. Build = a published base UAT + build name + 3 HUD edits + cp92-plow.js appended.
Usage: python build.py <base work folder> <UAT number>   e.g. python build.py cp116 119
Writes release-version.json, edits.json and release.html here (art/ is copied from the base for the render harness)."""
from pathlib import Path
import json,hashlib,re,shutil,sys
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];N=int(sys.argv[2]);B=W/base
m=json.loads((B/'publication-manifest.json').read_text());s=(B/'release.html').read_bytes();bh=hashlib.sha256(s).hexdigest()
assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1]);assert N>bnum,(N,bn)
v={'displayName':'2026.11.19 UAT %d'%N,'version':m['version']+(N-bnum),'apkVersion':7,'base':base,'baseSHA256':bh}
(p/'release-version.json').write_text(json.dumps(v),encoding='utf-8')
if (B/'art').exists():shutil.copytree(B/'art',p/'art',dirs_exist_ok=True)
s=s.decode('utf-8');mm=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(mm.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-92 HUD fix (Jenny, Nov 19: once the wallet clock counts minutes "the pause button is hidden by the time"): on the endless
# board only, the pause pill is wider, its two bars move right, and the clock text is held to the room left before them
EN="(typeof endActive==='function'&&endActive())"
EDITS+=[("function cp51Btn(hud){hud=hud||hudLayout();return {x:hud.left+5,y:hud.bannerY-15,w:91,h:30};}","function cp51Btn(hud){hud=hud||hudLayout();return {x:hud.left+5,y:hud.bannerY-15,w:"+EN+"?115:91,h:30};} /* CP-92 HUD */"),
 ("const x=hud.left+78,y=hud.bannerY;ctx.fillRect(x,y-6,3.5,12);","const x=hud.left+("+EN+"?102:78),y=hud.bannerY;ctx.fillRect(x,y-6,3.5,12); /* CP-92 HUD */"),
 ("ctx.fillText(wildClock(),hud.left+31,hud.bannerY);","ctx.fillText(wildClock(),hud.left+31,hud.bannerY,"+EN+"?66:1e4); /* CP-92 HUD */")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp92-plow.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(B/'release.html'),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',v['displayName'],hashlib.sha256(out).hexdigest())
