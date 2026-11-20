# CP-74 prototype build: the UAT 91 game (read-only, work/cp91/release.html, checked by hash) + cp74-hug.js + demo.js
# -> game/proto.html; and game/current.html (UAT 91 + demo.js only: today's Hug, for the before shots).
# Served beside the UAT 91 runtime files copied into game/ (UAT 89's assets; UAT 90/91 changed index.html only).
# Usage: python build.py
from pathlib import Path
import hashlib
p=Path(__file__).parent;base=(p.parent/'cp91/release.html').read_bytes()
assert hashlib.sha256(base).hexdigest()=='9ea4cef276468b6c66c4339d9147d5e0cbbd6f98753d8703ba5920824ac1137b'
src=base.decode('utf-8');demo=(p/'demo.js').read_text(encoding='utf-8')
def make(name,add,title):
    s=src;i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
    assert s.count('<title>Cat Pusher UAT</title>')==1
    s=s.replace('<title>Cat Pusher UAT</title>','<title>'+title+'</title>',1)
    (p/'game'/name).write_text(s,encoding='utf-8',newline='');print('game/'+name,len(s))
make('proto.html',(p/'cp74-hug.js').read_text(encoding='utf-8')+demo,'CP-74 Hug prototype')
make('current.html',demo,'CP-74 Hug today (UAT 91)')
