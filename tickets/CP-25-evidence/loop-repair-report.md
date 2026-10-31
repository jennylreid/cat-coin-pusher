# CP-25 Playable loop v1

**2026.10.29 UAT 12 / APK4 published**, numeric **20261029141116**. Backup/package verified; fresh cloud evidence below. Jenny reported Board1 with no prizes/no ending, plus **20 FPS on phone**. She chose “lose the game and restart that board” for lost prizes.

## Endless-board fix and recovery

- Reproduced in UAT11: both required treats removed through side gutters, zero prizes left, board still playing after10 seconds. Root cause: only front collection could finish; CP-25 disabled legacy allowance/time losses without replacing missing-prize failure handling. [Reproduction](loop-repair/reproduction.json).
- If any required, uncollected prize is missing, the round now fails with **PRIZE LOST** and retries **the same board** after a short2-second retry interval. Side loss awards nothing. Existing won inventory, purse/spent coins and collection placements/rewards remain; fresh board prizes return through the existing reset recipe. Power/pickup sequences finish before retry.
- Load reconciles already-stuck UAT saves, so the zero-prize save fails/retries without a manual reset. Legacy saves with all prizes already collected but unfinished status clear normally without re-crediting inventory. Present targets missing the old board-target flag are repaired rather than duplicated.
- Side gutter geometry/physics, front payout rule, recipes and collection economy unchanged. This is failure/retry progression, not gutter rescue or free collection.

## Rendering-speed work

- Desktop profiling found the new icon controls small relative to board rendering. The coin pass retained a full-screen offscreen layer and composite after its rail matte stopped being applied. Removed that redundant layer/copy; original coin paint order, occlusion masks, clipping and low-quality source sampling retained. No simulation equations or timestep changes.
- [Controlled paired cost](loop-repair/paired-render-cost.json): same frozen1080×2400 canvas, alternating old/direct/direct/old,40 draws per block. Board1 mean draw **18.16→5.71ms**, Board3 **27.40→9.16ms**, about67–69% less draw cost in these desktop samples. These are **not phone FPS measurements**. Earlier mixed full-frame profiling is recorded separately ([before](loop-repair/profile-before.json), [exploratory after](loop-repair/profile-after.json)); its variable timings are not used for a phone-speed claim.
- [Visual/physics comparison](loop-repair/visual-comparison.json): same frozen Board1/Board3/Quake states before/after render change. Maximum difference2/255 per channel from alpha-compositing rounding; mean absolute channel difference below0.0013/255. Body transforms/velocities unchanged. [Before Quake render](loop-repair/board3-quake-old.png), [direct render](loop-repair/board3-quake-direct.png). Visually inspected.

## Validation and phone UAT

[Six checks](loop-repair/checks.json): loss/retry on all3 boards; exact stuck-save recovery with purse/inventory/collection flags; mixed front win/side loss; normal win/next-board; ordinary side coin doesn't fail; legacy target flags/all-collected save recovery. No duplicate item credits. [Failure still](loop-repair/prize-lost-phone.png), [same-board restart](loop-repair/same-board-retry-phone.png).

Update UAT while retaining its save. Check that the stuck round retries Board1 with prizes restored and owned treats/purse kept. Then check the FPS during ordinary play and report the phone reading; the existing20 FPS report remains the only device performance evidence so far. Phone receipt, save continuity and actual speed improvement remain Jenny's UAT.

## Publication and close-out

Baseline UAT11 `work/cp25/paw-ui/release.html`. New source `work/cp25/loop-repair/release.html`; builder `build.py` + `progression.js` + `render-direct.js`. Backup `uat/backups/before-CP-25-loop-repair-20261029141116`. [Package verification](loop-repair/package-verification.json), [publication](loop-repair/publication.json), [cloud verification](loop-repair/cloud-verification.json). Only HTML changed; existing assets, APK4, channel/save key and OneDrive item/link retained. JSON SHA-256 `16a60e262b30bbfb6fe64a26407c4d067e55419c82a8d2062dbd8b2632154d3b`.

[Previous report](paw-ui-report.md) records the paw UI and collection/loop history. Ticket remains open for phone UAT/sign-off; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
