from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
report=f'''# CP-25 Playable loop v1

**2026.10.29 UAT 12 / APK4 published**, numeric **{m['version']}**. Backup/package verified; fresh cloud evidence below. Jenny reported Board1 with no prizes/no ending, plus **20 FPS on phone**. She chose “lose the game and restart that board” for lost prizes.

## Endless-board fix and recovery

- Reproduced in UAT11: both required treats removed through side gutters, zero prizes left, board still playing after10 seconds. Root cause: only front collection could finish; CP-25 disabled legacy allowance/time losses without replacing missing-prize failure handling. [Reproduction](CP-25-evidence/loop-repair/reproduction.json).
- If any required, uncollected prize is missing, the round now fails with **PRIZE LOST** and retries **the same board** after a short2-second retry interval. Side loss awards nothing. Existing won inventory, purse/spent coins and collection placements/rewards remain; fresh board prizes return through the existing reset recipe. Power/pickup sequences finish before retry.
- Load reconciles already-stuck UAT saves, so the zero-prize save fails/retries without a manual reset. Legacy saves with all prizes already collected but unfinished status clear normally without re-crediting inventory. Present targets missing the old board-target flag are repaired rather than duplicated.
- Side gutter geometry/physics, front payout rule, recipes and collection economy unchanged. This is failure/retry progression, not gutter rescue or free collection.

## Rendering-speed work

- Desktop profiling found the new icon controls small relative to board rendering. The coin pass retained a full-screen offscreen layer and composite after its rail matte stopped being applied. Removed that redundant layer/copy; original coin paint order, occlusion masks, clipping and low-quality source sampling retained. No simulation equations or timestep changes.
- [Controlled paired cost](CP-25-evidence/loop-repair/paired-render-cost.json): same frozen1080×2400 canvas, alternating old/direct/direct/old,40 draws per block. Board1 mean draw **18.16→5.71ms**, Board3 **27.40→9.16ms**, about67–69% less draw cost in these desktop samples. These are **not phone FPS measurements**. Earlier mixed full-frame profiling is recorded separately ([before](CP-25-evidence/loop-repair/profile-before.json), [exploratory after](CP-25-evidence/loop-repair/profile-after.json)); its variable timings are not used for a phone-speed claim.
- [Visual/physics comparison](CP-25-evidence/loop-repair/visual-comparison.json): same frozen Board1/Board3/Quake states before/after render change. Maximum difference2/255 per channel from alpha-compositing rounding; mean absolute channel difference below0.0013/255. Body transforms/velocities unchanged. [Before Quake render](CP-25-evidence/loop-repair/board3-quake-old.png), [direct render](CP-25-evidence/loop-repair/board3-quake-direct.png). Visually inspected.

## Validation and phone UAT

[Six checks](CP-25-evidence/loop-repair/checks.json): loss/retry on all3 boards; exact stuck-save recovery with purse/inventory/collection flags; mixed front win/side loss; normal win/next-board; ordinary side coin doesn't fail; legacy target flags/all-collected save recovery. No duplicate item credits. [Failure still](CP-25-evidence/loop-repair/prize-lost-phone.png), [same-board restart](CP-25-evidence/loop-repair/same-board-retry-phone.png).

Update UAT while retaining its save. Check that the stuck round retries Board1 with prizes restored and owned treats/purse kept. Then check the FPS during ordinary play and report the phone reading; the existing20 FPS report remains the only device performance evidence so far. Phone receipt, save continuity and actual speed improvement remain Jenny's UAT.

## Publication and close-out

Baseline UAT11 `work/cp25/paw-ui/release.html`. New source `work/cp25/loop-repair/release.html`; builder `build.py` + `progression.js` + `render-direct.js`. Backup `{m['backup']}`. [Package verification](CP-25-evidence/loop-repair/package-verification.json), [publication](CP-25-evidence/loop-repair/publication.json), [cloud verification](CP-25-evidence/loop-repair/cloud-verification.json). Only HTML changed; existing assets, APK4, channel/save key and OneDrive item/link retained. JSON SHA-256 `{m['stagedJSONSHA256']}`.

[Previous report](CP-25-evidence/paw-ui-report.md) records the paw UI and collection/loop history. Ticket remains open for phone UAT/sign-off; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
'''
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
f=r/'tickets/CP-25-evidence/paw-ui-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 12 / APK4** ({m['version']}).

CP-25 missing required prize now fails/retries same board; already-stuck saves recover while keeping purse/inventory/collections. Removes redundant full-screen coin-render composite; desktop cost improved, phone FPS pending. Paw UI/collection art retained.

Source: work/cp25/loop-repair/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md',f'''## CP-25 lost-prize retry (October 29, 2026)

Current UAT12/APK4 ({m['version']}) repairs an endless zero-prize board. Jenny chose loss/restart: any missing uncollected required prize fails the round, then retries the same recipe after a short2-second interval, keeping shared purse/owned treats/collection progress. Side losses do not pay; front wins still advance when all targets collected. Old stuck saves reconcile at load. Existing target geometry and physics retained. Render pass removes a redundant full-screen offscreen composite; desktop draw cost lower, phone20FPS improvement unverified. Report: tickets/CP-25.md. Earlier checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 lost-prize retry/render optimization (October 29, 2026)

Current UAT12 source `work/cp25/loop-repair/release.html`, pinned to UAT11. `build.py` + `progression.js`: reconcile required IDs against credited IDs/live item bodies after restore, each board tick and gutter removal; missing target calls lost/prize-lost, saves, retries same board after2 active seconds once pickup/power sequence ends. Does not award lost prizes or reset shared ledger. Repairs legacy missing boardTarget flags/all-collected unfinished saves. Failure callout finite; retry resets its timer. `render-direct.js` replaces only __drawBoardBodies: same order/masks/clips/source sampling on main canvas, eliminating unused offscreen alpha layer/composite and matte allocation; physics/timestep unchanged. Six progression checks plus paired renderer timings/pixel+body-state comparisons in tickets/CP-25-evidence/loop-repair/. Phone reports20FPS; no new device result yet. Report tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Loss/retry recovery,20FPS report and measured rendering change documented')
