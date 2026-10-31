# CP-25 Playable loop v1

**2026.10.29 UAT 13 / APK4 published**, numeric **20261029183045**. Jenny approved the reviewed compact Inventory and doily Collections tile. Backup/package verified; cloud evidence below.

## Published changes

- Inventory now uses64×64 thumbnail cells with small lower-right number badges. Existing cheese/shrimp/tuna art is reused, with Quake (lightning circle) and Paw Sweep (paw) alongside their current charge counts. Compact treat/power sections; no large rows or repeated × counts.
- Removed the Inventory Collections link and all Collections wording from the Inventory view. No placement or power activation is added inside Inventory; it is a view of existing owned items/current power counters. Existing power earning/reset rules are unchanged, with Board3 Quake using earned charges.
- Collections tile is a **cream/gold scalloped doily**, with dark-teal stacked-card/bookmark symbol for contrast. Paw pickup popup remains unchanged. On the reviewed phone aspect the doily sits beside Inventory below the table; compact screens use an above-table header fallback. Same44×44 hit size; table/cat/camera remain fixed.
- UAT12's missing-prize loss/retry/save recovery and direct coin renderer are retained in the draft.

## Stills and validation

[Board + Inventory comparison](inventory-grid/layout-and-inventory.png), [full phone board](inventory-grid/board-phone.png), [full phone Inventory](inventory-grid/inventory-phone.png). Actual-game renders at1080×2400 each; example counts12 cheese/3 shrimp/1 tuna/4 Quake/2 Sweep are screenshot fixtures, not new grants. New tile is code-native UI; no generated artwork.

[Two grouped checks](inventory-grid/checks.json): tile hitbox stays outside projected tabletop at400-wide portrait heights711/889/1000, separate from Inventory; thumbnail entries/corner counts match existing counters; Inventory no longer navigates to Collections from its former link area; doily opens Collections without dropping a coin; Board3 earned Quake count retained. [Layout lock](inventory-grid/layout-lock.json) includes unchanged published JSON hashes before/after preview.

Source `work/cp25/inventory-grid/release.html`, builder `build.py` + `ui.js`, checks/rendering `check.cjs`; publication scripts prepared by `prepare-publication.py`. Baseline UAT12 `work/cp25/loop-repair/release.html`. Reviewed draft differs from the release only by its build label. Phone receipt/touch/readability/safe-area fit await Jenny’s UAT.

## Publication and phone UAT

Open the bottom satchel: check compact treat/power thumbnails and corner counts, with no Collections link or wording. Use the separate cream doily to open collections; check it stays clear of the table. Existing loss/retry recovery and faster direct renderer remain from UAT12.

Backup `uat/backups/before-CP-25-inventory-grid-20261029183045`. [Package verification](inventory-grid/package-verification.json), [publication](inventory-grid/publication.json), [cloud verification](inventory-grid/cloud-verification.json). Only HTML changed; no new image assets or APK. APK4, channel/save key and existing OneDrive item/link retained. JSON SHA-256 `a850234fdf653caa91434cd159158c0a9306911605778981772a97bb02c99c4d`.

[Approved preview report](inventory-grid-preview-report.md) records the design decision; [UAT12 report](loop-repair-report.md) records bug recovery/performance work. Jenny's20FPS report remains the last phone measurement; a post-optimization device reading is still pending. Ticket remains open for phone UAT/sign-off; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
