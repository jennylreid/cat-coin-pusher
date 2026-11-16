from pathlib import Path
p=Path('work/cp25/auto-log');old=p.parent/'two-intervals'
for n in ['publish.ps1','verify.py','verify-cloud.py']:
 s=(old/n).read_text(encoding='utf-8').replace('work/cp25/two-intervals','work/cp25/auto-log').replace('CP-25-evidence/two-intervals','CP-25-evidence/auto-log').replace('UAT18','UAT19')
 (p/n).write_text(s,encoding='utf-8')
