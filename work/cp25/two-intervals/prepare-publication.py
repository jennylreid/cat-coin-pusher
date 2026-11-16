from pathlib import Path
p=Path('work/cp25/two-intervals');old=p.parent/'perf-rework'
for n in ['publish.ps1','verify.py','verify-cloud.py']:
 s=(old/n).read_text(encoding='utf-8').replace('work/cp25/perf-rework','work/cp25/two-intervals').replace('CP-25-evidence/perf-rework','CP-25-evidence/two-intervals').replace('UAT17','UAT18')
 (p/n).write_text(s,encoding='utf-8')
