from pathlib import Path
p=Path('work/cp25/log-file');old=Path('work/cp25/two-intervals')
for n in ['compare.cjs','readout.cjs']:
 s=(old/n).read_text(encoding='utf-8').replace('work/cp25/two-intervals/','work/cp25/log-file/').replace('CP-25-evidence/two-intervals/','CP-25-evidence/log-file/');(p/n).write_text(s,encoding='utf-8')
