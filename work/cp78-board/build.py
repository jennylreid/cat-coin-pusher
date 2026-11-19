"""CP-78 Board clean-up (Jenny, Nov 18): "behind and beside the cat only stars and background art: no gold band, gold rail or
teal side blocks ... Board edges solid and clean. Pusher unchanged."
Drawing only. Applies EDITS to a base release.html (default: work/cp94/release.html, UAT 94) and lays the after-runtime
out in rt-after/ (the other 69 files copied from rt-before/, i.e. UAT 94's JSON) for the screenshot harness shots.cjs.
Usage: python build.py [base release.html] [out html]"""
from pathlib import Path
import sys,shutil,hashlib
p=Path(__file__).parent
base=Path(sys.argv[1]) if len(sys.argv)>1 else p.parent/'cp94'/'release.html'
out=Path(sys.argv[2]) if len(sys.argv)>2 else p/'rt-after'/'index.html'
s=base.read_bytes().decode('utf-8')
EDITS=[
 # 1. the armrests (brass top = the wide gold band, teal inner side and front = the teal side blocks) are no longer drawn;
 #    a solid rim is drawn round the board instead (cp78-rim.js). Mitt rest positions (mittRest, ARM_H) are unchanged.
 ("drawArmrests();drawTongue();","cp78Rim();drawTongue(); /* CP-78: no armrests; solid board rim */"),
 # 3. the table art's wooden-rail slivers inside the board clip are repainted teal once, before the table is first drawn
 ("ctx.clip(__cachedBoardPath());ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();",
  "ctx.clip(__cachedBoardPath());if(!__cp78TableDone)cp78CleanTable();ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();"),
 # 2. the rest-pose gold rail backing (Yawn, Rest, tickle, paw dance) is no longer drawn: the stars show through
 ("const restBlend=restPoseBlend();if(restBlend>0){ctx.save();ctx.globalAlpha=restBlend;const g=ctx.createLinearGradient(0,199,0,219);g.addColorStop(0,'#bd7b20');g.addColorStop(.5,'#ffc856');g.addColorStop(1,'#b8791c');ctx.fillStyle=g;ctx.fillRect(76,199,248,20);ctx.restore();}",
  "/* CP-78: no rest-pose gold rail backing */"),
]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:70],n);s=s.replace(a,b)
add=(p/'cp78-rim.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
b=s.encode('utf-8');out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(b)
if out.parent.name=='rt-after':
    src=p/'rt-before'
    for f in src.rglob('*'):
        if f.is_file() and f.name!='index.html' or (f.is_file() and f.parent!=src):
            t=out.parent/f.relative_to(src)
            if not t.exists():t.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,t)
print(out,hashlib.sha256(b).hexdigest())
