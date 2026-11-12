from pathlib import Path
p=Path('work/cp25/log-file');old=Path('work/cp25/two-intervals')
for name in ['audit.cjs','launch.cjs','wins.cjs']:
 s=(old/name).read_text(encoding='utf-8').replace('work/cp25/two-intervals/','work/cp25/log-file/').replace('CP-25-evidence/two-intervals/','CP-25-evidence/log-file/');(p/name).write_text(s,encoding='utf-8')
