# CP-25 Playable loop v1

**2026.10.29 UAT 6 / APK4 published**, numeric **20261029081406**. Backup/package verified; cloud verification linked below. Jenny confirmed bottom-to-existing-side-satchel direction, rejected the first motion draft and asked for a larger-then-smaller, more elegant pickup. This pickup presentation was developed in CP-25 Stage 2/3.

## Pickup flight replaces centred overlay

- Existing sprite pops from small to a larger 1.65-scale prize near bottom centre, with restrained overshoot/tilt, then pauses briefly for recognition. It follows a cubic curved path with smooth acceleration and shrinks into the **existing approved side satchel opening**. Satchel gives a soft bounce and three small gold glints on arrival. No dim backdrop, centred popup, text, card or frame.
- Uses the existing short three-note pickup chime **on arrival**, once per item. Mute/hidden handling retained. No new sound asset.
- About 0.5 seconds for the existing front fall, then 1.6 seconds: pop 0–0.28, recognition hold to 0.48, curved flight/shrink to 1.25, satchel catch to 1.6. Multiple wins take turns. Pickup presentation is non-modal: ordinary taps/hold continue; there is no tap-to-dismiss target. Opening inventory pauses presentation until returning to play; credited inventory is available immediately.
- Inventory still credits/saves once at the actual front payout, independent of animation. Presentation is transient and never credits an item itself. Clear/advance waits for queued pickups.
- Bottom-to-side-satchel direction explicitly confirmed by Jenny. No new art generated; approved sprites reused.

## Evidence and validation

[Six checks](pickup-pop/checks.json): actual payout credits once; arrival-only sound; ordinary input continues; queued items take turns; inventory pause/reopen; original-sprite flight has no backdrop/card/text; endpoint matches satchel; actual chime honors mute/hidden; queue finishes before clear/next board.

[Flight clip with chimes](pickup-pop/pickup-pop.mp4), 540×1200, 6.6 seconds. Desktop game renderer, three existing Board3 prizes moved through the actual front payout path as a presentation fixture. Audio uses the earlier mathematical render of the same chime at arrival times; not a phone recording. [Phone-size mid-flight](pickup-pop/flight-phone.png), [arrival](pickup-pop/arrival-phone.png). Artwork reused as-is. Phone receipt, timing, sound, touch feel and FPS remain Jenny's UAT.

## Retained loop and collections

Water: tuna/shrimp obtainable; sardine/crab/clam/kelp/seahorse future outlines; 100 coins once. Kitchen: cheese obtainable; toy mouse future outline; 50 once. Both approved backgrounds, satchel tile and Scene wakes up completion payoff remain. Destination square during placement remains removed. Additional Kitchen prize candidates remain proposals in the [Kitchen report](kitchen-report.md).

## Publication and close-out

Baseline Oct29 UAT5. Source `work/cp25/pickup-pop/release.html`; builder `prepare.py` + `awards.js`. Backup `uat/backups/before-CP-25-pickup-pop-20261029081406`. [Package verification](pickup-pop/package-verification.json), [publication](pickup-pop/publication.json), [cloud verification](pickup-pop/cloud-verification.json). Only HTML changed. JSON SHA-256 `2f406d2fdfa058580beb3ba4943e7a25e08473075ed519d2fdb1f55f8c772370`; existing OneDrive item/link retained. Game-only update retains APK4.

[Previous motion report](pickup-flight-report.md) and [scene report](no-box-report.md) links scene, collection and earlier loop evidence. Ticket remains open for phone UAT/sign-off; commit/push close-out follows Jenny's sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
