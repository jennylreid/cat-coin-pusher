from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
f=r/'tickets/CP-25.md';t=f.read_text(encoding='utf-8')
t=t.replace('**Local UI layout preview ready; no new publication. UAT10/APK4 remains current** (20261029110950).',f"**2026.10.29 UAT 11 / APK4 published**, numeric **{m['version']}**. Backup/package verified; cloud evidence below. Jenny explicitly requested UAT publication of the reviewed layout.")
t=t.replace('## Draft changes','## Published changes').replace('Local source `work/cp25/paw-ui/draft.html`; builder `build.py` + `ui.js`; renderer/checks `check.cjs`. Baseline: current UAT10 `work/cp25/pickup-modal/release.html`. Draft is not packaged or published. Phone feel/safe-area fit and device performance await UAT after approval.', 'Source `work/cp25/paw-ui/release.html`; builder `build.py` + `ui.js`; publication scripts prepared by `prepare-publication.py`. Checks/rendering use `check.cjs`. Baseline UAT10 `work/cp25/pickup-modal/release.html`. Staged release differs from the reviewed draft only in its build label. Phone receipt, touch feel, safe-area fit, sound and performance await Jenny’s UAT.')
start=t.index('## Pending approval and close-out')
t=t[:start]+f'''## Publication and phone UAT

Try the paw Collections tile beside the table; the bottom satchel opens Inventory. Use the top power icons and check their charge badges; collect a treat to see the chosen paw pickup. Zero-charge powers stay inactive. Current awarded/test charges and Board3 earned Quake behavior are retained.

Backup `{m['backup']}`. [Package verification](CP-25-evidence/paw-ui/package-verification.json), [publication](CP-25-evidence/paw-ui/publication.json), [fresh cloud verification](CP-25-evidence/paw-ui/cloud-verification.json). Only HTML changed; game-only update retains APK4 and the existing OneDrive item/link. JSON SHA-256 `{m['stagedJSONSHA256']}`.

[Approved layout report](CP-25-evidence/paw-ui-preview-report.md) links the prior design decisions and UAT10 baseline. UAT11 now supersedes that preview and the striped-popup draft. Ticket remains open for phone UAT/sign-off; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
'''
f.write_text(t,encoding='utf-8')
f=r/'tickets/CP-25-evidence/paw-ui-preview-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 11 / APK4** ({m['version']}).

CP-25 chosen paw pickup popup; matching Collections paw with stacked-card symbol; bottom satchel opens dedicated Inventory; Paw Sweep/Quake icon buttons and charge badges above cat. Modal pauses/disables background; zero-charge powers inactive. Existing collection art and rewards retained.

Source: work/cp25/paw-ui/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md',f'''## CP-25 paw UI published (October 29, 2026)

Current UAT11/APK4 ({m['version']}): chosen B paw medallion pickup; matching side Collections paw with stacked-card symbol; approved satchel at bottom for dedicated Inventory. Paw Sweep/Quake icons above cat show available charges, zero inactive. Board number/checklist moved to footer; locked header dimensions/cat/table/camera retained. Modal pause/queue/chime/tap-away and existing collection art/requirements/rewards retained. No new earning economy. Report: tickets/CP-25.md. Earlier release checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 paw UI published (October 29, 2026)

Current UAT11 source `work/cp25/paw-ui/release.html`, pinned to UAT10. `build.py` + `ui.js` implement reviewed paw popup/tile, bottom satchel Inventory navigation and above-head power icons/counts; no added assets. `powerCount`/`powerTap` map Board3 non-Developer Quake to earned charges, others to existing counters. Zero-charge buttons inactive; main Sweep no longer grants a free ready preview. Existing power functions/earning unchanged. Header bounds unchanged; board/checklist move to footer. Inventory has its own list and Collections link; collection drag satchel retained. Existing modal guard/save schema retained. Three checks plus package/cloud evidence: tickets/CP-25-evidence/paw-ui/. Publication prepared by prepare-publication.py; reviewed draft differs only by build label. Phone UAT pending; report tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Paw UI UAT publication recorded')
