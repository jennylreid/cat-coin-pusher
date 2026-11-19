# Makes work/prod09/stage.py from work/prod08/stage.py (same method; UAT 105 source, PROD-08 production baseline).
from pathlib import Path
p=Path(__file__).parent;s=(p/'../prod08/stage.py').read_text(encoding='utf-8')
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
i=s.index('# PROD-08 staging');j=s.index('# Usage')
s=s[:i]+("# PROD-09 staging: production game-only update for installed APK17 = UAT 105's 78-file runtime with index.html replaced by\n"
 "# work/prod09/release.html (UAT 105 + the production adaptations). The 69 other files production already has must be production's\n"
 "# byte for byte (they are identical in UAT 105); the 8 new files (CP-75 yawn art) are UAT 105's byte for byte. Envelope fields are\n"
 "# production's (channel catpusher, com.jenny.catpusher, apkVersion 17, apk empty); no UAT field. Native unchanged.\n")+s[j:]
rep("python work/prod08/stage.py   (run work/prod08/checks.cjs, checks-uat89.cjs and the boot check first)","python work/prod09/stage.py   (run work/prod09/checks.cjs, checks-uat105.cjs and the boot check first)")
rep("e = r / 'tickets/PROD-08-evidence'","e = r / 'tickets/PROD-09-evidence'")
rep("pin = json.loads((r / 'work/prod07/publication-manifest.json').read_text())","pin = json.loads((r / 'work/prod08/publication-manifest.json').read_text())")
rep("upin = json.loads((r / 'work/cp89/publication-manifest.json').read_text())","upin = json.loads((r / 'work/cp105/publication-manifest.json').read_text())")
rep("'production is not the published 2026.11.16.2 (PROD-07)'","'production is not the published 2026.11.17 (PROD-08)'")
rep("old['version'] == 20261116235000","old['version'] == 20261117200000")
rep("len(old['files']) == 40","len(old['files']) == 70")
rep("'UAT is not the published UAT 89'","'UAT is not the published UAT 105'")
rep("u['version'] == 20261118000000 and len(u['files']) == 70","u['version'] == 20261118000016 and len(u['files']) == 78")
rep("(r / 'work/cp89/release.html').read_bytes()","(r / 'work/cp105/release.html').read_bytes()")
rep("('checks.json', 'checks-uat89.json', 'bootcheck.json')","('checks.json', 'checks-uat105.json', 'bootcheck.json')")
rep("'a shared runtime file differs between production and UAT 89'","'a shared runtime file differs between production and UAT 105'")
rep("all(k.startswith('img/art/') for k in added) and len(added) == 30","all(k.startswith('img/art/cp75-yawn-') for k in added) and len(added) == 8")
rep("'sourceHTML': 'work/cp89/release.html'","'sourceHTML': 'work/cp105/release.html'")
rep("'addedRuntimeFilesFromUAT89': added","'addedRuntimeFilesFromUAT105': added")
rep("f\"backups/before-PROD-08-{v['version']}\"","f\"backups/before-PROD-09-{v['version']}\"")
rep("'Jenny, Nov 17, 2026: \"CP-62 passes. Production update: go with CP-54, 56, 57, 58, 61, 62, 63, 64, 69.\"'",
    "'Jenny, Nov 18, 2026: \"Let\\'s get this stuff to production before we continue to update UAT.\" (after the PM listed CP-71, 72, 73, 75, 78, 80, 82)'")
rep("if k != 'addedRuntimeFilesFromUAT89'","if k != 'addedRuntimeFilesFromUAT105'")
assert 'UAT 89' not in s and 'cp89' not in s and 'PROD-08-ev' not in s,[l for l in s.split('\n') if 'UAT 89' in l or 'cp89' in l]
(p/'stage.py').write_text(s,encoding='utf-8');print('ok')
