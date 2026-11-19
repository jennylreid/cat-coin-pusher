"""CP-75 Step 1 prototype (stills only, not a release): published-UAT-94 source (work/cp94/release.html) + cp75-yawn.js.
art/ = work/cp94/art + the recoloured yawns (recolor.py). Usage: python build.py"""
from pathlib import Path
import shutil
p=Path(__file__).parent;W=p.parent
s=(W/'cp94'/'release.html').read_text(encoding='utf-8')
add=(p/'cp75-yawn.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'proto.html').write_text(s,encoding='utf-8')
for f in (W/'cp94'/'art').iterdir():
    if not (p/'art'/f.name).exists():shutil.copy2(f,p/'art'/f.name)
print('ok')
