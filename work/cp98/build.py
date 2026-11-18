"""CP-72 hang rework (Jenny, Nov 18, on UAT 96: "During the hang the ginger kitten moves toward the middle of the screen and
tilts about 20 degrees, for extra crazy energy. Rest unchanged. Next UAT after 97."; then "It knows it's cute, so it kind of
puts itself right in your face for a second." "Showing off is a good way to frame it."). Two edits to UAT 96's hang (z72Path),
one to the kitten's drawing (z72Draw) + the block cp72-crazy.js (Z72.leapHang.style: 'crazy' = showing off, 'still' = UAT 96).
Usage: python build.py          -> release.html on the base in release-version.json (UAT 97, pinned once it is out)
       DEV=1 python build.py    -> release-dev.html on published UAT 96 (preparation only, never published)"""
from pathlib import Path
import json,hashlib,os,re
p=Path(__file__).parent;W=p.parent;DEV=os.environ.get('DEV')=='1'
v=json.loads((p/'release-version.json').read_text())
if DEV:base,pin,outn=W/'cp96'/'release.html','074e79157437c99d3ac78316421c22431c658bb526513d9ebf3ed3e0d02fa243','release-dev.html'
else:base,pin,outn=W/v['base']/'release.html',v['baseSHA256'],'release.html'
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,('base changed',base);s=s.decode('utf-8')
EDITS=[("if(k.id===0){const H=Z72.leapHang,L={...H,dx:Math.max(-H.edge,Math.min(H.edge,at.x-200))+200-at.x},o0=L.top,",
  "if(k.id===0){const H=Z72.leapHang,show=H.style==='crazy',L={...H,dx:Math.max(-H.edge,Math.min(H.edge,at.x-200))+200-at.x,hang:show?H.faceHang:H.hang,tilt:show?(at.x>200?-1:1)*H.tilt:0,face:show},o0=L.top, /* CP-72 hang rework: showing off */"),
 ("segs.push({k:'leap',d:L.hang,f:u=>{const P=top(o0),e=z72E(u/.18);return {...P,x:P.x+L.dx*e,h:P.h+3*Math.sin(u*Math.PI*4),grow:P.grow*(1+(L.big-1)*e),fade:1};}});",
  "segs.push({k:'leap',d:L.hang,f:u=>{const P=top(o0),e=z72E(u/.18),F=L.face?z72E(u*L.hang/L.faceIn)*(1-z72E((u*L.hang-L.hang+L.faceOut)/L.faceOut)):0;return {...P,x:P.x+L.dx*e,lean:L.tilt*F||undefined,face:F||undefined,h:P.h+3*Math.sin(u*Math.PI*4),grow:P.grow*(1+(L.big-1)*e),fade:1};}});"),
 ("const p=skyScreen(P.x,P.z,P.h);z72Kitten(p.x,p.y,s,","const p0=skyScreen(P.x,P.z,P.h),p=P.face?cp72Face(p0,s,P.face,P.lean):{x:p0.x,y:p0.y,s};z72Kitten(p.x,p.y,p.s, /* CP-72 hang rework: the close-up */")]
if not DEV:
    m=re.search(r"const BUILD = '([^']+)';",s);EDITS.insert(0,(m.group(0),"const BUILD = '%s';"%v['displayName']))
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
add=(p/'cp72-crazy.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/('edits-dev.json' if DEV else 'edits.json')).write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':['cp72-crazy.js']},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out);print(p/outn,hashlib.sha256(out).hexdigest())
