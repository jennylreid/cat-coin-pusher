from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
f=r/'tickets/CP-25.md';t=f.read_text(encoding='utf-8');start=t.index('**Revised Inventory');end=t.index('\n\n## Local',start)
t=t[:start]+f"**2026.10.29 UAT 13 / APK4 published**, numeric **{m['version']}**. Jenny approved the reviewed compact Inventory and doily Collections tile. Backup/package verified; cloud evidence below."+t[end:]
t=t.replace('## Local changes for review','## Published changes')
t=t.replace('Source `work/cp25/inventory-grid/draft.html`, builder `build.py` + `ui.js`, checks/rendering `check.cjs`. Baseline published UAT12 `work/cp25/loop-repair/release.html`. Draft is unshipped; phone touch/readability await UAT after visual approval.', 'Source `work/cp25/inventory-grid/release.html`, builder `build.py` + `ui.js`, checks/rendering `check.cjs`; publication scripts prepared by `prepare-publication.py`. Baseline UAT12 `work/cp25/loop-repair/release.html`. Reviewed draft differs from the release only by its build label. Phone receipt/touch/readability/safe-area fit await Jenny’s UAT.')
start=t.index('## Pending approval / current UAT');t=t[:start]+f'''## Publication and phone UAT

Open the bottom satchel: check compact treat/power thumbnails and corner counts, with no Collections link or wording. Use the separate cream doily to open collections; check it stays clear of the table. Existing loss/retry recovery and faster direct renderer remain from UAT12.

Backup `{m['backup']}`. [Package verification](CP-25-evidence/inventory-grid/package-verification.json), [publication](CP-25-evidence/inventory-grid/publication.json), [cloud verification](CP-25-evidence/inventory-grid/cloud-verification.json). Only HTML changed; no new image assets or APK. APK4, channel/save key and existing OneDrive item/link retained. JSON SHA-256 `{m['stagedJSONSHA256']}`.

[Approved preview report](CP-25-evidence/inventory-grid-preview-report.md) records the design decision; [UAT12 report](CP-25-evidence/loop-repair-report.md) records bug recovery/performance work. Jenny's20FPS report remains the last phone measurement; a post-optimization device reading is still pending. Ticket remains open for phone UAT/sign-off; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
'''
f.write_text(t,encoding='utf-8')
f=r/'tickets/CP-25-evidence/inventory-grid-preview-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 13 / APK4** ({m['version']}).

CP-25 approved compact Inventory: item/power thumbnails with corner counts, no Collections wording/link. Contrasting cream/gold doily tile opens Collections clear of tabletop; bottom satchel remains Inventory. UAT12 loss/retry recovery and direct renderer retained.

Source: work/cp25/inventory-grid/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md',f'''## CP-25 compact Inventory/doily published (October 29, 2026)

Current UAT13/APK4 ({m['version']}) integrates Jenny's approved small treat/power thumbnails with corner count badges; no Collections wording/link inside Inventory. Existing Quake/Paw Sweep counters shown, no economy change. Cream/gold doily Collections tile contrasts background and clears table; footer beside Inventory on tall phone layout, compact header fallback when needed. Satchel remains bottom Inventory. Paw pickup, collection scenes/rewards, required-prize failure/retry/save recovery and direct renderer retained. Phone UAT/FPS reading pending. Report: tickets/CP-25.md. Earlier checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 compact Inventory/doily published (October 29, 2026)

Current UAT13 source `work/cp25/inventory-grid/release.html`, pinned to UAT12. `build.py` + `ui.js` replace Inventory-only list with64×64 treat/power cells and corner counts, remove Inventory Collections navigation, and replace/reposition only the Collections tile. Grid reads S.got and powerCount (Board3 earned Quakes included), no saved fields/earning change. Tile uses existing44×44 hitbox: footer if clear of projected table front, otherwise header above tabletop; doily drawing stays inside bounds. No added images. UAT12 reconciliation/retry and direct ordered/masked coin rendering retained. Checks/stills/package/cloud: tickets/CP-25-evidence/inventory-grid/. Publication prepared by prepare-publication.py; only release label differs from approved draft. Report tickets/CP-25.md; phone UAT pending.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Approved Inventory/doily publication recorded')
