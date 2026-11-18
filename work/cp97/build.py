"""CP-78 Board clean-up (Jenny, Nov 18: "behind and beside the cat only stars and background art: no gold band, gold rail or
teal side blocks ... Board edges solid and clean. Pusher unchanged." Approved Step 1: "CP-78 Board clean-up: approved.
Mitts stay where they are. Into the next UAT.") on published UAT 96. Drawing only: three edits + the block cp78-rim.js
(Step 1 source: work/cp78-board/). Usage: python build.py -> release.html (+ edits.json)
Also importable: patch(html) applies only the CP-78 edits + block (used by gen-checks.py for the check references)."""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent
CP78=[
 # the armrests (brass top = the wide gold band; teal inner side and front = the teal side blocks) are no longer drawn;
 # a solid rim is drawn round the board instead. Mitt rest positions (mittRest, ARM_H) unchanged.
 ("drawArmrests();drawTongue();","cp78Rim();drawTongue(); /* CP-78: no armrests; solid board rim */"),
 # the table art's wooden-rail slivers inside the board clip are repainted teal once (normally already done on the title)
 ("ctx.clip(__cachedBoardPath());ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();",
  "ctx.clip(__cachedBoardPath());if(!__cp78TableDone)cp78CleanTable();ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();"),
 # the rest-pose gold rail backing (Yawn, Rest, tickle, paw dance) is no longer drawn: the stars show through
 ("const restBlend=restPoseBlend();if(restBlend>0){ctx.save();ctx.globalAlpha=restBlend;const g=ctx.createLinearGradient(0,199,0,219);g.addColorStop(0,'#bd7b20');g.addColorStop(.5,'#ffc856');g.addColorStop(1,'#b8791c');ctx.fillStyle=g;ctx.fillRect(76,199,248,20);ctx.restore();}",
  "/* CP-78: no rest-pose gold rail backing */"),
]
BLOCK=(p/'cp78-rim.js').read_text(encoding='utf-8')
def patch(s,edits=CP78):
    for a,b in edits:
        n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
    i=s.rindex('</script>');return s[:i]+BLOCK+'\n'+s[i:]
if __name__=='__main__':
    v=json.loads((p/'release-version.json').read_text());base=W/v['base']/'release.html'
    s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
    m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]+CP78
    s=patch(s,EDITS)
    (p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':['cp78-rim.js']},indent=1),encoding='utf-8')
    out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
