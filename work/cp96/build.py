"""CP-72 rework of the poof (Jenny, Nov 18, on UAT 94: "the puffed kitten hangs about 1 s at the top of its final leap,
about 1.5x bigger during the hang. Next UAT."). One edit (the final leap) + the block cp72-hang.js.
Usage: python build.py          -> release.html on the base in release-version.json (UAT 95, pinned once it is out)
       DEV=1 python build.py    -> release-dev.html on published UAT 94 (preparation only, never published)"""
from pathlib import Path
import json,hashlib,os
p=Path(__file__).parent;W=p.parent;DEV=os.environ.get('DEV')=='1'
v=json.loads((p/'release-version.json').read_text())
if DEV:base,pin,outn=W/'cp94'/'release.html','1378c839b4c8aaa5c84744c98e6a65e8d502d7d6024af790747891ed2dd36f48','release-dev.html'
else:base,pin,outn=W/v['base']/'release.html',v['baseSHA256'],'release.html'
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,('base changed',base);s=s.decode('utf-8')
LEAP="segs.push({k:'leap',d:.4,f:u=>({x:at.x,z:zF+4+u*60,h:40*Math.sin(Math.min(1,u)*Math.PI*.8),grow:1+u*.9,fade:Math.max(0,1-u),dir:1,pose:'leap',puff:k.id===0?Math.min(1,u/.12):0})}); /* CP-72 add-on: poof */"
NEW=("if(k.id===0){const H=Z72.leapHang,L={...H,dx:Math.max(-H.edge,Math.min(H.edge,at.x-200))+200-at.x},o0=L.top,top=o=>({x:at.x,z:zF+4+o*60,h:40*Math.sin(Math.min(1,o)*Math.PI*.8),grow:1+o*.9,dir:1,pose:'leap',puff:Math.min(1,o/.12)}); /* CP-72 rework: the poof hangs */\n"
 "  segs.push({k:'leap',d:.4*o0,f:u=>({...top(u*o0),fade:1})});\n"
 "  segs.push({k:'leap',d:L.hang,f:u=>{const P=top(o0),e=z72E(u/.18);return {...P,x:P.x+L.dx*e,h:P.h+3*Math.sin(u*Math.PI*4),grow:P.grow*(1+(L.big-1)*e),fade:1};}});\n"
 "  segs.push({k:'leap',d:.4*(1-o0),f:u=>{const P=top(o0+u*(1-o0)),e=1-z72E(u/.6);return {...P,x:P.x+L.dx*e,grow:P.grow*(1+(L.big-1)*e),fade:Math.max(0,1-u)};}});}\n"
 " else segs.push({k:'leap',d:.4,f:u=>({x:at.x,z:zF+4+u*60,h:40*Math.sin(Math.min(1,u)*Math.PI*.8),grow:1+u*.9,fade:Math.max(0,1-u),dir:1,pose:'leap',puff:0})});")
EDITS=[(LEAP,NEW)]
if not DEV:
    import re;m=re.search(r"const BUILD = '([^']+)';",s);EDITS.insert(0,(m.group(0),"const BUILD = '%s';"%v['displayName']))
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
add=(p/'cp72-hang.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/('edits-dev.json' if DEV else 'edits.json')).write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':['cp72-hang.js']},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out);print(p/outn,hashlib.sha256(out).hexdigest())
