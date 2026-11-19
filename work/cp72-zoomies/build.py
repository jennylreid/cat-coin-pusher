# CP-72 prototype build: the UAT 89 game (read-only, work/cp89/release.html, checked by hash) + cp72-zoomies.js + demo.js
# -> game/proto.html; and game/current.html (UAT 89 + demo.js only: today's Zoomies, for the before shots).
# Served beside the UAT 89 runtime files copied into game/. Usage: python build.py
from pathlib import Path
import hashlib
p=Path(__file__).parent;base=(p.parent/'cp89/release.html').read_bytes()
assert hashlib.sha256(base).hexdigest()=='9f0ebf0383d6626f4a7fcdfc03477af4d9218b832358aade21888df79536fe69'
src=base.decode('utf-8');demo=(p/'demo.js').read_text(encoding='utf-8')
def make(name,add,title):
    s=src;i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
    assert s.count('<title>Cat Pusher UAT</title>')==1
    s=s.replace('<title>Cat Pusher UAT</title>','<title>'+title+'</title>',1)
    (p/'game'/name).write_text(s,encoding='utf-8',newline='');print('game/'+name,len(s))
make('proto.html',(p/'cp72-zoomies.js').read_text(encoding='utf-8')+demo,'CP-72 Zoomies prototype')
make('current.html',demo,'CP-72 Zoomies today (UAT 89)')
