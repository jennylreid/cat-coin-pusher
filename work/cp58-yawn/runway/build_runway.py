# CP-58 Runway trial build: the prototype (UAT 74 + cp58-yawn.js + demo.js) + runway/runway-face.js
# -> game/proto-runway-1.html (Runway attempt2-3) and game/proto-runway-3.html (attempt1-2). proto.html is not changed.
from pathlib import Path
import hashlib
p=Path(__file__).parent.parent;base=(p.parent/'cp74/release.html').read_bytes()
assert hashlib.sha256(base).hexdigest()==hashlib.sha256((p/'game/index.html').read_bytes()).hexdigest()
s0=base.decode('utf-8');i=s0.rindex('</script>')
for n in ('1','3'):
    add=(p/'cp58-yawn.js').read_text(encoding='utf-8')+(p/'demo.js').read_text(encoding='utf-8')
    add+=f"\nconst CP58_RUNWAY_SRC='runway/yawn-face-{n}.png',CP58_RUNWAY_EYES_SRC='runway/yawn-eyes-{n}.png';\n"+(p/'runway/runway-face.js').read_text(encoding='utf-8')
    s=s0[:i]+add+'\n'+s0[i:]
    s=s.replace('<title>Cat Pusher UAT</title>',f'<title>CP-58 Yawn prototype, Runway face {n}</title>',1)
    out=p/f'game/proto-runway-{n}.html';out.write_text(s,encoding='utf-8',newline='');print(out.name,len(s))
