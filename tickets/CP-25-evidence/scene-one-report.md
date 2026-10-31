# CP-25 Playable loop v1

**2026.10.28 UAT 6 / APK4 published**, numeric **20261028222309**. Backup, local package and fresh cloud hash verified. Jenny approved the satchel tile and selected **Scene wakes up**. Water art below awaits approval; Cheese has not been painted.

## Published changes

- Approved leather satchel tile replaces the placeholder at its existing 44×44 bounds beside the table.
- Completion now wakes the scene with Water ripples/bubbles or a warm Cheese glow, plays the existing fanfare, and arcs 12 copies of the approved coin into the satchel purse counter. The counter catches up over about two seconds; the full reward is credited and saved atomically at placement, so closing early cannot lose or duplicate coins.
- Returning to the board plays 4.4 seconds of the existing approved cat dance, without its table-shake option or long drum track. Ordinary input can interrupt it. A saved pending flag preserves an unplayed return reaction across reopening.
- Water still pays 100 once for tuna + shrimp; Cheese pays 50 once for cheese. Future slots do not block. The illustrated scenes remain approval previews, so UAT6 uses the prior placeholder collection layout with the new payoff.
- UAT5's item-only translucent pickup overlay, short pickup chime, queue and tap-away remain. [Prior report](stage3-report.md) includes audio preview, overlay evidence and earlier stage links.

## Validation and phone UAT

[Payoff checks](scene-one/checks.json): once-only saved reward, cosmetic counter, no physical bodies added, timed approved dance, table-shake restoration and reload continuity. Existing drag/award/advance interaction checks also passed against the new source. [Package verification](scene-one/package-verification.json): only HTML plus the approved tile changed; other package fields retained; Water art absent.

Phone-size evidence: [coin payoff](scene-one/payoff-phone.png), [return dance](scene-one/return-dance-phone.png). Try finishing a collection, watch coins enter the purse, close Collections, and check the cat reaction. If both collections were already paid, they remain paid and do not replay. Phone receipt, perceived sound, touch feel, Android lifecycle and FPS remain Jenny's UAT.

## Water art — approval preview only

Layout locked in the actual game before painting: tuna left/open water, sardine upper right, shrimp near right seagrass, crab on the sand. Frame, tabs and bottom satchel keep their fixed bounds. [Layout lock](scene-one/water-layout-lock.json), [real-game template](scene-one/water-layout-phone.png), [painting template](../../work/cp25/scene-one/art/water-layout-template.png).

One new background painting: sunlit turquoise cove, rocky borders, seagrass and golden sand. No prize art was generated. Frozen tuna/shrimp sprites and their derived contours are drawn by the runtime; future sardine/crab remain outlines. [Phone-size empty scene](scene-one/water-art-phone.png), [placed-item preview](scene-one/water-filled-phone.png), [inline still](scene-one/water-art-inline.png).

Built-in imagegen tool; [exact prompt](../../work/cp25/scene-one/art/water-prompt.txt); [saved asset](../../work/cp25/scene-one/art/water-scene-v1.png). Original generated file preserved. Approval renderer: `work/cp25/scene-one/water-preview.cjs`; its geometry and painting are not in UAT6. Waiting for Jenny's Water OK before integration, then lock and paint Cheese separately. Required approval comes from the brief's Stage 3 art process: “Show each piece as a phone-size still and wait for Jenny's OK before building it into the game.”

## Publication and close-out

Baseline UAT5. Source `work/cp25/scene-one/release.html`; builder `build.py` + `payoff.js`. Backup `uat/backups/before-CP-25-scene-one-20261028222309`. [Publication](scene-one/publication.json), [cloud verification](scene-one/cloud-verification.json). JSON SHA-256 `3e8958fa5a20504b7385c90305095161d99bada6289135241f86fbaaa5f26b76`; same OneDrive item/link, revision35; game-only APK4 update.

Commit/push close-out follows Jenny's ticket sign-off. CODEX_BRIEF.md remains reserved while the separate CP-22 promotion report is absent. This report is the current UAT checkpoint. Production remains outside scope.
