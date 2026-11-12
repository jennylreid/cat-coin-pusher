from pathlib import Path
p=Path('work/cp25/lag');old=p.parent/'pickup-options'
for n in ['stage.py','publish.ps1','verify.py','verify-cloud.py']:
 s=(old/n).read_text(encoding='utf-8').replace('pickup-options','lag').replace('2026.10.29 UAT 15','2026.10.30 UAT 16')
 if n=='stage.py':
  s=s.replace("p/'observed-live.html'","p/'baseline.html'").replace("['passed'])==4","['passed'])==2").replace("h=(p/'draft.html').read_bytes();", "h=(p/'release.html').read_bytes();")
  s=s.replace("assert base64.b64decode(u['files']['index.html'])==(p/'baseline.html').read_bytes()", "assert base64.b64decode(u['files']['index.html']).decode().replace(chr(13),str())==(p/'baseline.html').read_text(encoding='utf-8')")
  s=s.replace('Jenny requested cycling pickup options and no tap-to-dismiss; latest UAT14 Calm face preserved; UAT only','Jenny authorized CP-25 Stage 4 lag-only UAT before pickup previews')
 (p/n).write_text(s,encoding='utf-8')
