from pathlib import Path
p=Path('work/cp25/perf-rework');old=p.parent/'lag'
for n in ['publish.ps1','verify.py','verify-cloud.py']:
 s=(old/n).read_text(encoding='utf-8').replace('work/cp25/lag','work/cp25/perf-rework').replace('CP-25-evidence/lag','CP-25-evidence/perf-rework')
 (p/n).write_text(s,encoding='utf-8')
