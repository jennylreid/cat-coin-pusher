# CP-25 Playable loop v1

**2026.10.29 UAT 11 / APK4 published**, numeric **20261029135316**. Backup/package verified; cloud evidence below. Jenny explicitly requested UAT publication of the reviewed layout. Jenny agreed with direction **B — teal paw medallion**, then requested a matching Collections tile, bottom Inventory satchel, and power icon/count buttons above the cat.

## Published changes

- **Pickup popup:** selected B paw-shaped medallion, original collected prize inside. Existing modal pause/disabled background, queue, sound and tap-away retained.
- **Collections:** same paw shape at the existing side tile position/44×44 bounds, with a larger three-stacked-cards/bookmark symbol. Opens Water/Kitchen collections.
- **Inventory:** approved satchel image moved to bottom centre at44×44; opens a dedicated owned-treat inventory. Inventory has a Collections link; collection scenes retain their bottom drag satchel. Old bottom-right Inventory text removed.
- **Powers:** Paw Sweep (paw) and Quake (circle/lightning bolt) above the cat in the existing header, with available-charge badges. Old bottom power bars removed. Board number and target checklist moved into the freed footer space. Header bounds, cat/table/camera geometry and original artwork stay fixed.
- Buttons show/use the existing available charges. Zero charges are inactive; the former free ready-screen Sweep preview is no longer the main power button's action. Existing power functions/earning/physics are retained; Board3's non-Developer Quake icon uses earned Quake charges. No new earning economy.

## Review stills and checks

[Layout and paw pickup comparison](paw-ui/layout-and-popup.png), [full phone board](paw-ui/board-phone.png), [full phone popup](paw-ui/popup-phone.png), [Inventory screen](paw-ui/inventory-phone.png).

Screenshots are actual-game renders,1080×2400 each. Board1 screenshot uses a **layout fixture of1 Sweep /2 Quakes**, not changed starting amounts. Popup is triggered through the real front payout path. No generated artwork.

[Checks](paw-ui/checks.json): header hitboxes above the cat; zero charges do nothing; charged buttons consume exactly one existing power/no coin; Board3 earned Quake count/action; distinct Inventory/Collections navigation without dropping. [Layout lock/preview manifest](paw-ui/layout-lock.json) records the fixed bounds and identical published UAT JSON hashes before/after.

Source `work/cp25/paw-ui/release.html`; builder `build.py` + `ui.js`; publication scripts prepared by `prepare-publication.py`. Checks/rendering use `check.cjs`. Baseline UAT10 `work/cp25/pickup-modal/release.html`. Staged release differs from the reviewed draft only in its build label. Phone receipt, touch feel, safe-area fit, sound and performance await Jenny’s UAT.

## Publication and phone UAT

Try the paw Collections tile beside the table; the bottom satchel opens Inventory. Use the top power icons and check their charge badges; collect a treat to see the chosen paw pickup. Zero-charge powers stay inactive. Current awarded/test charges and Board3 earned Quake behavior are retained.

Backup `uat/backups/before-CP-25-paw-ui-20261029135316`. [Package verification](paw-ui/package-verification.json), [publication](paw-ui/publication.json), [fresh cloud verification](paw-ui/cloud-verification.json). Only HTML changed; game-only update retains APK4 and the existing OneDrive item/link. JSON SHA-256 `4c715880f3388418697a6f9868a20342447f5f9ab6ea2d86b3346ebe9dbb8b0c`.

[Approved layout report](paw-ui-preview-report.md) links the prior design decisions and UAT10 baseline. UAT11 now supersedes that preview and the striped-popup draft. Ticket remains open for phone UAT/sign-off; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
