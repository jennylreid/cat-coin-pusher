# CP-25 Playable loop v1

**2026.10.29 UAT 9 / APK4 published**, numeric **20261029110229**. Backup/package verified; fresh cloud evidence linked below. Jenny approved the spotlight motion and requested a larger overlay pattern to dim the background scene.

## Patterned spotlight overlay

- No frame/panel/text. Full-screen neutral-dark veil increased to52%, with a broad edge vignette and16 low-contrast warm radial rays behind the prize. The background scene is more subdued while remaining visible. A feathered warm radial glow sits behind the existing prize, with a restrained pop-in and three small staggered sparkles.
- About1.2 seconds per item, including fade-in/out; one item at a time. Existing pickup chime plays once as each item appears. Tap-away consumes the touch and stops an existing hold; automatic expiry permits an existing hold to continue.
- Original prize art reused; no generated or repainted assets. Actual front payout still credits/saves inventory once independently of presentation; board continues underneath, and clear/advance waits for the queue.

## Evidence and validation

[Four checks](pickup-vignette/checks.json): queue/timing/chime count; zero-coin dismissal; actual payout once; board continuing; full-screen patterned vignette/glow and three sparkles with no frame/desaturation/text; save/reopen; clear/advance waits for queue.

[Phone-size spotlight](pickup-vignette/overlay-phone.png), [clip with chimes](pickup-vignette/pickup-vignette.mp4), 540×1200, 3.6 seconds. Desktop renderer with three existing Board3 prizes moved through actual payout as a UI fixture; audio is the earlier mathematical render of the same chime at display times, not a phone recording. Phone receipt, perceived appearance/sound/touch feel and FPS remain Jenny's UAT.

## Retained loop and collections

Water: tuna/shrimp obtainable; sardine/crab/clam/kelp/seahorse future outlines; 100 coins once. Kitchen: cheese obtainable; toy mouse future outline; 50 once. Approved backgrounds, satchel tile and Scene wakes up completion payoff retained. Destination square during placement remains removed. Further Kitchen prize candidates remain proposals in the [Kitchen report](kitchen-report.md).

## Publication and close-out

Baseline Oct29 UAT8. Source `work/cp25/pickup-vignette/release.html`; builder `prepare.py` + `awards.js`. Backup `uat/backups/before-CP-25-pickup-vignette-20261029110229`. [Package verification](pickup-vignette/package-verification.json), [publication](pickup-vignette/publication.json), [cloud verification](pickup-vignette/cloud-verification.json). Only HTML changed. JSON SHA-256 `e27e7830418a9a998b839df4ecc2c8af67d9fb50597db4f9306c9bd5e733f981`. Existing OneDrive item/link retained; game-only update keeps APK4.

[Previous spotlight report](pickup-spotlight-report.md) links earlier drafts and scene/loop evidence. Ticket remains open for phone UAT/sign-off; commit/push close-out follows Jenny's sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
