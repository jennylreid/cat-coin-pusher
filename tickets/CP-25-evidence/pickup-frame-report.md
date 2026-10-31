# CP-25 Playable loop v1

**2026.10.29 UAT 7 / APK4 published**, numeric **20261029082920**. Backup/package verified; fresh cloud evidence linked below. Jenny rejected the moving pickup drafts and requested the earlier overlay with a frame and briefly grayed background.

## Framed overlay replaces pickup flight

- Original collected prize shown large and in full colour inside a thin champagne rounded double-line frame with a translucent interior. No text/name/card copy. Background board is desaturated and lightly veiled in neutral grey while it remains visible and running.
- Duration about 1.8 seconds, with short fade-in/out. One item at a time; existing short pickup chime plays once when each item appears. Mute/background sound handling retained. No flight, shrinking or satchel bounce.
- Tap-away restored: dismissal stops an existing hold and consumes the touch, so it cannot drop a coin. Automatic expiry lets an existing hold continue. Queue finishes before board-clear feedback and next-board advance.
- Actual front payout still credits and saves inventory once, before presentation. Reopening retains inventory without replaying transient overlays. No approved artwork changed or generated.

## Evidence and validation

[Four checks](pickup-frame/checks.json): queue/timing/chime count; zero-coin dismissal; actual payout counted once; board running beneath; neutral saturation layer and rounded frame; full-colour original sprite/no text; save/reopen; clear/advance waits for queue.

[Phone-size overlay](pickup-frame/overlay-phone.png). [Clip with chimes](pickup-frame/pickup-frame.mp4), 540×1200, 5.6 seconds, desktop renderer. Three existing Board3 prizes moved through the actual payout path as a UI fixture; audio is the earlier mathematical render of the same pickup chime at display times, not a phone recording. Phone receipt, perceived greying/framing, sound/touch feel and FPS remain Jenny's UAT.

## Retained loop and collections

Water: tuna/shrimp obtainable; sardine/crab/clam/kelp/seahorse future outlines; 100 coins once. Kitchen: cheese obtainable; toy mouse future outline; 50 once. Approved backgrounds, satchel tile and Scene wakes up completion payoff retained. Destination square during placement remains removed. Further Kitchen prize candidates remain proposals in the [Kitchen report](kitchen-report.md).

## Publication and close-out

Baseline Oct29 UAT6. Source `work/cp25/pickup-frame/release.html`; builder `prepare.py` + `awards.js`. Backup `uat/backups/before-CP-25-pickup-frame-20261029082920`. [Package verification](pickup-frame/package-verification.json), [publication](pickup-frame/publication.json), [cloud verification](pickup-frame/cloud-verification.json). Only HTML changed. JSON SHA-256 `34fe70fbd9f0d85bb13ae13519e54ba5d79b9d4c2c481d04b5aaa6fffb6e7b19`. Existing OneDrive item/link retained; game-only update keeps APK4.

[Previous motion report](pickup-pop-report.md) links earlier drafts and scene/loop evidence. Ticket remains open for phone UAT/sign-off; commit/push close-out follows Jenny's sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
