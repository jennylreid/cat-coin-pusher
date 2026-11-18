# CP-58 prototype build: the UAT 74 game (read-only, from work/cp74/release.html, checked by hash) + cp58-yawn.js + demo.js
# -> game/proto.html (served beside the extracted UAT 74 files in game/). Usage: python build.py
from pathlib import Path
import hashlib
p=Path(__file__).parent;base=(p.parent/'cp74/release.html').read_bytes()
assert hashlib.sha256(base).hexdigest()==hashlib.sha256((p/'game/index.html').read_bytes()).hexdigest()
s=base.decode('utf-8');i=s.rindex('</script>')
add=(p/'cp58-yawn.js').read_text(encoding='utf-8')+(p/'demo.js').read_text(encoding='utf-8')
s=s[:i]+add+'\n'+s[i:]
s=s.replace('<title>Cat Pusher UAT</title>','<title>CP-58 Yawn prototype</title>',1)
(p/'game/proto.html').write_text(s,encoding='utf-8',newline='');print('game/proto.html',len(s))
