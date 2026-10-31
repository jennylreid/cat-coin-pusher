# CP-25 Playable loop v1

**2026.10.29 UAT 5 / APK4 published**, numeric **20261029074827**. Backup/package verified; cloud verification linked below. Jenny requested replacing the current collected-item overlay with movement into the satchel and sound. This pickup presentation was developed in CP-25 Stage 2/3.

## Pickup flight replaces centred overlay

- Existing collected sprite appears in the bottom play area after its front fall, arcs into the **existing approved side satchel icon**, shrinks and disappears. Satchel gives a small arrival pulse. No dim backdrop, centred popup, text, card or frame.
- Uses the existing short three-note pickup chime **on arrival**, once per item. Mute/hidden handling retained. No new sound asset.
- About 0.5 seconds for the existing front fall, then 1.2 seconds for appearance/flight/arrival. Multiple wins take turns. Pickup presentation is non-modal: ordinary taps/hold continue; there is no tap-to-dismiss target. Opening inventory pauses presentation until returning to play; credited inventory is available immediately.
- Inventory still credits/saves once at the actual front payout, independent of animation. Presentation is transient and never credits an item itself. Clear/advance waits for queued pickups.
- Direction assumption stated during implementation: from bottom play area to existing side satchel. Jenny was offered bottom-satchel vs existing-side-satchel options; no choice received during this run. The approved icon stays in its position, and no bottom icon was added.

## Evidence and validation

[Six checks](pickup-flight/checks.json): actual payout credits once; arrival-only sound; ordinary input continues; queued items take turns; inventory pause/reopen; original-sprite flight has no backdrop/card/text; endpoint matches satchel; actual chime honors mute/hidden; queue finishes before clear/next board.

[Flight clip with chimes](pickup-flight/pickup-flight.mp4), 540×1200, 5.4 seconds. Desktop game renderer, three existing Board3 prizes moved through the actual front payout path as a presentation fixture. Audio uses the earlier mathematical render of the same chime at arrival times; not a phone recording. [Phone-size mid-flight](pickup-flight/flight-phone.png), [arrival](pickup-flight/arrival-phone.png). Artwork reused as-is. Phone receipt, timing, sound, touch feel and FPS remain Jenny's UAT.

## Retained loop and collections

Water: tuna/shrimp obtainable; sardine/crab/clam/kelp/seahorse future outlines; 100 coins once. Kitchen: cheese obtainable; toy mouse future outline; 50 once. Both approved backgrounds, satchel tile and Scene wakes up completion payoff remain. Destination square during placement remains removed. Additional Kitchen prize candidates remain proposals in the [Kitchen report](kitchen-report.md).

## Publication and close-out

Baseline Oct29 UAT4. Source `work/cp25/pickup-flight/release.html`; builder `build.py` + `awards.js`. Backup `uat/backups/before-CP-25-pickup-flight-20261029074827`. [Package verification](pickup-flight/package-verification.json), [publication](pickup-flight/publication.json), [cloud verification](pickup-flight/cloud-verification.json). Only HTML changed. JSON SHA-256 `c07c2d52672ff55afbd1904234b8dd12d191f4a49d0f5f46b1c76c8499bb13da`; existing OneDrive item/link retained. Game-only update retains APK4.

[Previous report](no-box-report.md) links scene, collection and earlier loop evidence. Ticket remains open for phone UAT/sign-off; commit/push close-out follows Jenny's sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
