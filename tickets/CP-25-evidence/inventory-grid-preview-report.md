# CP-25 Playable loop v1

**Revised Inventory / doily Collections preview ready; no new publication. UAT12/APK4 remains current** (20261029141116). Jenny requested compact Inventory thumbnails/corner counts including powers, no Collections wording/link inside Inventory, and a contrasting flower/doily Collections tile clear of the table.

## Local changes for review

- Inventory now uses64×64 thumbnail cells with small lower-right number badges. Existing cheese/shrimp/tuna art is reused, with Quake (lightning circle) and Paw Sweep (paw) alongside their current charge counts. Compact treat/power sections; no large rows or repeated × counts.
- Removed the Inventory Collections link and all Collections wording from the Inventory view. No placement or power activation is added inside Inventory; it is a view of existing owned items/current power counters. Existing power earning/reset rules are unchanged, with Board3 Quake using earned charges.
- Collections tile is a **cream/gold scalloped doily**, with dark-teal stacked-card/bookmark symbol for contrast. Paw pickup popup remains unchanged. On the reviewed phone aspect the doily sits beside Inventory below the table; compact screens use an above-table header fallback. Same44×44 hit size; table/cat/camera remain fixed.
- UAT12's missing-prize loss/retry/save recovery and direct coin renderer are retained in the draft.

## Stills and validation

[Board + Inventory comparison](inventory-grid/layout-and-inventory.png), [full phone board](inventory-grid/board-phone.png), [full phone Inventory](inventory-grid/inventory-phone.png). Actual-game renders at1080×2400 each; example counts12 cheese/3 shrimp/1 tuna/4 Quake/2 Sweep are screenshot fixtures, not new grants. New tile is code-native UI; no generated artwork.

[Two grouped checks](inventory-grid/checks.json): tile hitbox stays outside projected tabletop at400-wide portrait heights711/889/1000, separate from Inventory; thumbnail entries/corner counts match existing counters; Inventory no longer navigates to Collections from its former link area; doily opens Collections without dropping a coin; Board3 earned Quake count retained. [Layout lock](inventory-grid/layout-lock.json) includes unchanged published JSON hashes before/after preview.

Source `work/cp25/inventory-grid/draft.html`, builder `build.py` + `ui.js`, checks/rendering `check.cjs`. Baseline published UAT12 `work/cp25/loop-repair/release.html`. Draft is unshipped; phone touch/readability await UAT after visual approval.

## Pending approval / current UAT

Waiting for Jenny's visual OK on the new doily tile/layout before publication, following Stage3's phone-still approval step. [Current UAT12 report](loop-repair-report.md) records published bug recovery/performance work and cloud evidence. Jenny's20FPS phone report remains the last device measurement; no post-UAT12 device reading supplied yet.

Ticket remains open; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
