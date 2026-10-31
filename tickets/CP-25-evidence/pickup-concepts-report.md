# CP-25 Playable loop v1

**Design review: three static popup directions, preview only.** Jenny rejected UAT10's visual treatment and agreed to compare stills before further animation/publication. **UAT10/APK4 remains current** (20261029110950); no new update published.

## Three popup directions — awaiting choice

[Side-by-side comparison](pickup-concepts/three-directions.png):

- **A — Warm keepsake card:** cream paper, stitched gold detail and a teal ribbon/paw seal. [Full phone still](pickup-concepts/A-warm-card-phone.png).
- **B — Teal paw medallion:** a large paw-shaped teal/brass medallion holding the prize. Strongest CatCoin character. [Full phone still](pickup-concepts/B-paw-medallion-phone.png).
- **C — Scalloped reward badge:** cream scalloped edge, pale mint centre and coral ribbon. Most playful collectible/sticker direction. [Full phone still](pickup-concepts/C-scalloped-badge-phone.png).

Real-game canvas screenshots at1080×2400; same Board3 state and original cheese sprite/scale across all three. Background dimmed consistently. Concepts are code-native UI drawing, not generated images or edits to approved art. No new text in the popup. No animation/sound changes or publication. `work/cp25/pickup-concepts/preview.cjs` overrides drawing in memory only. [Preview notes](pickup-concepts/preview-notes.json) record identical UAT JSON hashes before/after. Choose a visual direction before implementing it.


## Current UAT10 modal — rejected visual draft

- Large rounded translucent popup with light diagonal stripes and a restrained border/shadow, over a dimmed scene. Original full-colour item/pop/glow/sparkles and pickup chime retained. Broad radial rays removed. No generated/repainted art or popup text.
- **Background now pauses and is disabled**, superseding the earlier running-board behavior at Jenny's request. Fixed physics/time and gameplay animation updates stop while a pickup is visible. Held dropping stops at pickup; no deferred drops. Modal timer and wall-clock purse refill continue.
- Sequential1.2-second popups, or tap to dismiss. Dismissal consumes the touch without dropping/opening background controls; closing resumes gameplay. Queue finishes before clear/advance. Inventory credit/save still occurs once at payout, independent of modal presentation.

## Evidence and validation

[Three checks](pickup-modal/checks.json): held stream stops; body positions and simulation time remain frozen; dismissal spends no coin and resumes game; UI timer/queue/chime progresses during pause; front credit persists exactly once; clear/advance waits until modals close.

[Phone-size popup](pickup-modal/overlay-phone.png), [clip with chimes](pickup-modal/pickup-modal.mp4), 540×1200,3.6 seconds. Desktop renderer; existing Board3 prizes moved through actual payout as a UI fixture. Audio is the earlier mathematical render of the same chime at display times, not a phone recording. Phone receipt, perceived transparency/stripe/sound/touch feel and FPS remain Jenny's UAT.

## Retained loop and collections

Water: tuna/shrimp obtainable; sardine/crab/clam/kelp/seahorse future outlines; 100 coins once. Kitchen: cheese obtainable; toy mouse future outline; 50 once. Approved backgrounds, satchel tile and Scene wakes up completion payoff retained. Destination square during placement remains removed. Further Kitchen prize candidates remain proposals in the [Kitchen report](kitchen-report.md).

## Publication and close-out

Baseline Oct29 UAT9. Source `work/cp25/pickup-modal/release.html`; builder `prepare.py` + `awards.js`. Backup `uat/backups/before-CP-25-pickup-modal-20261029110950`. [Package verification](pickup-modal/package-verification.json), [publication](pickup-modal/publication.json), [cloud verification](pickup-modal/cloud-verification.json). Only HTML changed. JSON SHA-256 `fea80ec0f1446bd1ad42e297f185ace156d5f38c6df99507f2998e58ec461f3e`. Existing OneDrive item/link retained; game-only update keeps APK4.

[Previous vignette report](pickup-vignette-report.md) links earlier drafts and scene/loop evidence. Ticket remains open for phone UAT/sign-off; commit/push close-out follows Jenny's sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
