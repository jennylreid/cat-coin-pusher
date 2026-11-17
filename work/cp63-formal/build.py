# CP-63 prototype build: the UAT 81 game (read-only, work/cp81/release.html, checked by hash) + cp63-formal.js + demo.js
# -> game/proto.html (served beside the UAT 81 runtime files copied into game/). Usage: python build.py
from pathlib import Path
import hashlib
p=Path(__file__).parent;base=(p.parent/'cp81/release.html').read_bytes()
assert hashlib.sha256(base).hexdigest()=='985625c87fd72ae6be6f13741d9320fa13dbf692a9367731f6f4140ed107f6f0'
s=base.decode('utf-8');i=s.rindex('</script>')
add=(p/'cp63-formal.js').read_text(encoding='utf-8')+(p/'demo.js').read_text(encoding='utf-8')
s=s[:i]+add+'\n'+s[i:]
# Prototype-only workaround for a UAT 80/81 boot bug (reported to the PM): loadArt() uses CP62_ART before its const line
# runs, so a browser stops with 'Could not start'. Declare it before the script runs instead. Release files untouched.
assert s.count('const CP62_ART={};')==1;s=s.replace('const CP62_ART={};','',1)
j=s.index('<script>');s=s[:j+8]+'var CP62_ART={};'+s[j+8:]
assert s.count('<title>Cat Pusher UAT</title>')==1
s=s.replace('<title>Cat Pusher UAT</title>','<title>CP-63 Formal inspection prototype</title>',1)
(p/'game/proto.html').write_text(s,encoding='utf-8',newline='');print('game/proto.html',len(s),hashlib.sha256(base).hexdigest())
