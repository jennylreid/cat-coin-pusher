from pathlib import Path
import hashlib,json
p=Path(__file__).parent;raw=(p/'baseline.html').read_bytes();m=json.loads((p/'baseline.json').read_text())
assert hashlib.sha256(raw).hexdigest()==m['htmlSHA256']
s=raw.decode().replace(chr(13),'');assert s.count('STEP/4')==4 and s.count('sub<=4')==1 and s.count('sub/4')==1
s=s.replace('STEP/4','STEP/2').replace('sub<=4','sub<=2').replace('sub/4','sub/2').replace("const BUILD = '2026.10.30 UAT 17';","const BUILD = '2026.10.30 UAT 18';")
s=s.replace('// CP-22: resolve fast delivery and the moving tray at two contact intervals.','// CP-25: two contact intervals per tick, approved trial; CCD and repair remain.')
s=s.replace('hud.settingsY-32,W-hud.left-hud.right-4,15','hud.bottomY-29,W-hud.left-hud.right-4,15').replace("hud.left+8,hud.settingsY-24);","hud.left+8,hud.bottomY-21);")
(p/'candidate.html').write_text(s,encoding='utf-8')
print('Built approved two-interval trial from pinned UAT17')
