"""CP-86 Sonic meow mitts (see setup.py). Build name + three in-place edits to UAT 114's CP-86 mitts block (choices D, E, F).
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-86 mitts D, E, F (Jenny, Nov 19: "another option where the mitts come out and in front of the face, a little bit like the
# pose after a board is won"; "What if they start at dancing pose and then move up to yawn pose as the animation? So when the
# eyes open, by the time the eyes open, the mitts are above the head... and vice versa"). D: the Dancing pose's place and turn
# (the centre of its bob: cp58Rest + 12 inward, 30 up, no turn of its own). E: Dancing pose, then travels up to Above the head
# between 3.0 s and the eyes opening (3.75 s); F: the reverse. All drawn in front of the head (as the Dancing pose and the Yawn
# are), so the layer changes only on the face's own switch frames. Above the head (default), B and C unchanged.
EDITS+=[("CHOICES=['head','B','C'],NAMES={head:'Above the head',B:'B: forward and out',C:'C: pointing forward'};",
  "CHOICES=['head','B','C','D','E','F'],NAMES={head:'Above the head',B:'B: forward and out',C:'C: pointing forward',D:'D: Dancing pose',E:'E: Dancing, then above the head',F:'F: Above the head, then Dancing'}; /* CP-86 mitts D E F */"),
 ("POSE:{head:{dx:48,dy:-185,a:.43},B:{dx:13,dy:163.4,a:.35},C:{dx:-85,dy:203.4,a:-.35}}",
  "POSE:{head:{dx:48,dy:-185,a:.43},B:{dx:13,dy:163.4,a:.35},C:{dx:-85,dy:203.4,a:-.35},D:{dx:-12,dy:-30,a:-.12},E:{seq:['D','head']},F:{seq:['head','D']}},swap:[3,3.75] /* CP-86 mitts D E F: E and F travel from the first pose to the second between swap[0] and swap[1] s (the eyes open at 3.75 s) */"),
 ("function cp86MTarget(side){const P=CP86M.POSE[cp86MPick()]||CP86M.POSE.head,R=cp58Rest(side);",
  "function cp86MTarget(side){let P=CP86M.POSE[cp86MPick()]||CP86M.POSE.head;if(P.seq){const A=CP86M.POSE[P.seq[0]],B=CP86M.POSE[P.seq[1]],t=PGPX?PGPX.t:0,k=cp58Ease((t-CP86M.swap[0])/(CP86M.swap[1]-CP86M.swap[0]));P={dx:A.dx+(B.dx-A.dx)*k,dy:A.dy+(B.dy-A.dy)*k,a:A.a+(B.a-A.a)*k};}const R=cp58Rest(side); /* CP-86 mitts D E F */"),
 ("function cp86MOnTop(){return cp86K()>0&&cp86MPick()==='head'&&",
  "function cp86MOnTop(){return cp86K()>0&&cp86MPick()!=='B'&&cp86MPick()!=='C' /* CP-86 mitts D E F: in front of the head for Above the head, D, E, F */&&")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=[]
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
