# UAT 104: copies UAT 103's three hand-made regression scripts (no check 0 for gen-checks.py), adding the CP-74 blocks to their reference.
from pathlib import Path
d=Path(__file__).resolve().parents[2]/'cp104'
for f in ['72s','72z','80']:
    s=(d.parent/'cp103'/f'checks{f}-on103.cjs').read_text(encoding='utf-8')
    a="['../cp102/cp72-peek.js','cp83-lab.js']";assert s.count(a)==1,f
    s=s.replace(a,"['../cp102/cp72-peek.js','../cp103/cp83-lab.js','cp74-art.js','cp74-hug.js']")
    s=s.replace(f"copied from work/cp102/checks{f}-on102.cjs; the reference adds UAT 102's edits and blocks plus cp83-lab.js.",
     f"copied from work/cp103/checks{f}-on103.cjs (UAT 104, CP-74); the reference adds UAT 102's edits and blocks, cp83-lab.js and the CP-74 blocks.")
    s=s.replace('CP-83-evidence/uat','CP-74-evidence/uat').replace(f'checks{f}-on103.json',f'checks{f}-on104.json')
    print(f,[l[:80] for l in s.splitlines() if 'on103' in l])
    (d/f'checks{f}-on104.cjs').write_text(s,encoding='utf-8')
