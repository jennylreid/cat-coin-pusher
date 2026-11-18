# CP-72 "more" prototype (no UAT): the published UAT 98 game (work/cp98/release.html, checked against the UAT 98 package)
# + cp72-more.js (pounce crouch, 'eyes' ending) + demo.js (demo controls) -> game/proto.html, with UAT 98's runtime files
# extracted into game/ so the page plays as in the app. URL knobs: ?style=eyes|crazy|still  &crouch=0|1. Usage: python build.py
from pathlib import Path
import hashlib,json,base64
p=Path(__file__).parent;G=p/'game'
base=(p.parent/'cp98/release.html').read_bytes()
d=json.load(open(p.parent/'cp98/CatCoinPusher-UAT-game.json',encoding='utf-8'))
assert d['version']==20261118000009
idx=d['files']['index.html'];idx=base64.b64decode(idx) if not idx.lstrip().startswith('<') else idx.encode('utf-8')
assert hashlib.sha256(base).hexdigest()==hashlib.sha256(idx).hexdigest(),'release.html is not the published UAT 98'
for k,v in d['files'].items():
    if k=='index.html':continue
    f=G/k;f.parent.mkdir(parents=True,exist_ok=True)
    if not f.exists():f.write_bytes(base64.b64decode(v))
src=base.decode('utf-8');add=(p/'cp72-more.js').read_text(encoding='utf-8')+(p/'demo.js').read_text(encoding='utf-8')
i=src.rindex('</script>');s=src[:i]+add+'\n'+src[i:]
(G/'proto.html').write_text(s,encoding='utf-8',newline='');print('game/proto.html',len(s),hashlib.sha256(base).hexdigest()[:12])
