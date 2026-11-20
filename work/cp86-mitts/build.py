"""CP-86 Sonic meow mitts (see setup.py). Build name + three hook edits in the CP-86 block + the block cp86-mitts.js.
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-86 mitts: the mitts are drawn two ways (the rest pose through pawMotion, the idle mitts through mittRest + drawMittArm);
# each hook now tells cp86MittOff which and its own resting place, so a pose lands on the same spot and turn either way
EDITS+=[("pawMotion=function(side=0){const m=__cp86Paw(side);if(!side)return m;const o=cp86MittOff(side);",
  "pawMotion=function(side=0){const m=__cp86Paw(side);if(!side)return m;const o=cp86MittOff(side,'rest',m); /* CP-86 mitts */"),
 ("mittRest=function(side){const r=__cp86MittRest(side);CP86.side=side;const o=cp86MittOff(side);",
  "mittRest=function(side){const r=__cp86MittRest(side);CP86.side=side;const o=cp86MittOff(side,'wait',r); /* CP-86 mitts */"),
 ("drawMittArm=function(w,h){const o=CP86.side?cp86MittOff(CP86.side):null;",
  "drawMittArm=function(w,h){const o=CP86.side?cp86MittOff(CP86.side,'wait',__cp86MittRest(CP86.side)):null; /* CP-86 mitts */"),
 # while the meow face shows, the idle mitts are drawn where the rest pose draws them (after the head, as in the wheel's Yawn),
 # so a mitt raised beside the head is in front of it; the change of layer happens on the face's own switch frames
 ("if(sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose()){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);drawPaws();ctx.restore();}",
  "if(sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose()&&!(typeof cp86MOnTop==='function'&&cp86MOnTop())){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);drawPaws();ctx.restore();} /* CP-86 mitts */"),
 ("if(sweepTime>0||catquakeTime>0||isRestPose())drawPaws();drawPawTouchGuides();",
  "if(sweepTime>0||catquakeTime>0||isRestPose()||(typeof cp86MOnTop==='function'&&cp86MOnTop()))drawPaws();drawPawTouchGuides(); /* CP-86 mitts */")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp86-mitts.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
