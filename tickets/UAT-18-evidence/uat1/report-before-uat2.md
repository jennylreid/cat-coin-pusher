# UAT-18 Quake coin

Status: **published to 2026.10.17 UAT 1 / APK4**, numeric **20261017154958**, on Jenny’s instruction “Okay, let’s see this one in UAT.” Phone update receipt confirmed; gameplay and performance UAT pending.

Baseline: published UAT 6, numeric 20261016235419 (`work/uat16-rework/release.html`). Reviewed draft: `work/uat18/draft.html`; matching release: `work/uat18/release.html`.

## Scope and changes
- One gold Quake coin at Board 3’s reserved rear-centre position (x=200, depth=365). Blue ceramic lightning, face ring and side band framed in gold. Its radius is 28.08 versus ordinary 26; full thickness 5.2 versus ordinary 4. Render and collider agree.
- Front-tray collection awards one board-local Quake. Normal-player button shows “USE QUAKE · 1”; tapping runs the existing CatQuake and shows zero left. Empty tapping does nothing. Restart resets the charge and respawns the single coin; board clear does not require it.
- Jenny explicitly expanded the art scope to the regular paw coins: natural satin gold texture, raised paw and a polished bevel. Ordinary coin geometry and physics are retained. Existing gold-looking silver coins share the new face, as they shared the old one.
- Board definitions, stacks, targets, budgets, timer and CatQuake implementation stay intact. Developer controls retain their separate inventory.

## Current preview
- Current [full Board 3, 1200 × 2667](UAT-18-evidence/gold-ceramic-board3-hires.png): 400 × 889 logical phone viewport rendered at DPR 3.
- [Crowded board during normal play](UAT-18-evidence/gold-ceramic-board3-crowded.png).
- Current [sharp board detail](UAT-18-evidence/gold-ceramic-board3-hires-detail.png), sampled down from the high-density render. Earlier 1× screenshot and enlarged crop remain historical evidence.
- [Updated collection/use clip](UAT-18-evidence/quake-ceramic.mp4): normal centre-lane drops at 0.22-second cadence collect the Quake at game second 27.78; a pointer tap at 29.00 starts CatQuake and changes the charge from 1 to 0. Clip starts at 25.77 seconds and is silent; no injected reward or repositioned coin. [Event trace](UAT-18-evidence/capture-ceramic.json).
- Actual game renderer and Rapier, Developer mode off. Desktop previews at phone size; not phone evidence.
- Art uses a locally stored ImageGen atlas, `work/uat18/art/uat18-coin-faces.png`, cropped into small cached coin faces on load. Source art and earlier directions: [design review history](UAT-18-evidence/design-review-history.md). Final atlas prompt: top-down circular gold paw and gold/blue ceramic coin fronts, matching the approved concept; fine satin grain, shallow relief, gold bezels and opaque glazed blue inlay. Built-in ImageGen used.

## Validation
- Board 3 wins without powers with the final Quake dimensions: 126/140 coins at 0.22-second taps (27.68 seconds); 125/140 at 0.4-second taps (49.98 seconds). Same target-following strategy as UAT-16; viable strategies, not guaranteed wins.
- Empty-charge tapping, one-coin placement, optional-target behavior and reset checks pass. Runners/results: `work/uat18`.

## Pending
Jenny’s publication approval is fulfilled. Phone receipt, sound, readability, feel and FPS require device UAT. No cross-board power economy or save system was added.

## Crispness correction
Jenny reported pixelated coins. The earlier harness captured only 400 × 889 physical pixels at DPR 1 and enlarged that bitmap for the detail image. Upright towers also used a fixed 160 × 320 cache on every display density. The draft now renders tower caches at display density (capped at 3×), includes density in cache invalidation, and applies high-quality image filtering once when sampling the atlas, while retaining the inexpensive per-frame filter. The phone-sized preview is captured natively at DPR 3; its detail is downsampled rather than enlarged. This is a drawing-only correction; gameplay and geometry are unchanged from the gold/ceramic preview. Runner: `work/uat18/quality-preview.cjs`. Actual phone crispness/performance still needs device evidence. Included in this approved UAT publication.

## Publication
Game-only release, retaining APK4. The reviewed preview differs from release only in its displayed build name. Existing payload files were retained except `index.html`; added `img/art/uat18-coin-faces.png`. Backup verified at `uat/backups/before-UAT-18-20261017154958` before writing the existing shared OneDrive item in place. Fresh anonymous cloud download: HTTP 200, SHA-256 `c548ecbf5466b47d3ced3282eeebda262713a93a80c5cb057b48e3331dc3fc4d` matches staged bytes; original shared item preserved. [Publication record](UAT-18-evidence/publication.json) · [cloud verification](UAT-18-evidence/cloud-verification.json). Production promotion is outside this approval.

## Phone update receipt
After initially seeing an older build, Jenny retried updating and reported “It looks right now.” This confirms the updated appearance reached the phone; Quake collection/use, no-power clear, sound and smoothness are not yet signed off. A fresh cloud recheck also matched the published payload.

## Softer paw revision — preview pending
Jenny loves the coin finish but reports that stark paw shadows make prize items harder to see in piles. The draft now uses a shallower-looking paw with gentler shadows and highlights; gold finish, rim and paw silhouette are retained. Only the left paw tile from the ImageGen edit is consumed, via `work/uat18/art/uat18-soft-paw.png`; the Quake continues to use its original atlas. No geometry, physics or gameplay changes.

[Full high-density Board 3](UAT-18-evidence/soft-paw-board3-hires.png) · [board detail](UAT-18-evidence/soft-paw-board3-hires-detail.png). Actual renderer at DPR 3; successful load verifies the new asset path and cache. New artwork was created with built-in ImageGen using the original atlas as edit target; prompt requested shallow relief, substantially reduced dark paw-edge shadows and subdued bright ridges while preserving the gold finish. Atlas tile extraction and preview runners are in `work/uat18`. This revision is not published; UAT 1 remains current pending Jenny’s preview review.

## Stack-edge refinement — preview pending
Jenny requested more distinct coin edges in stacks. The renderer now gives ordinary gold coin sidewalls a darker lower lip and lighter middle, so adjacent layers separate clearly. Softened paw faces are retained. This reuses the same two rim draws per coin; dimensions, stack geometry and physics are unchanged. [Full board](UAT-18-evidence/stack-edge-board3-hires.png) · [board detail](UAT-18-evidence/stack-edge-board3-hires-detail.png). Verified in the actual DPR-3 renderer. No publication; this and the soft-paw revision await preview review. Runner: `work/uat18/stack-edge-preview.cjs`.

## Straight-stack comparison — selection pending
Jenny requested perfectly straight stacks to compare before choosing. Alternate source: `work/uat18/straight-stacks.html`, retaining the soft paw and distinct stack rims, with Board 3 coin centres aligned instead of the 2.2-unit spiral offset. Current candidate `draft.html` retains the staggered layout. [Side-by-side A/B](UAT-18-evidence/stack-alignment-comparison.png) · [straight-stack full board](UAT-18-evidence/straight-stack-board3-hires.png). Actual static DPR-3 renders; no publication. If selected, aligned breakup positions need the relevant gameplay validation before release. Comparison runners: `straight-stack-preview.cjs` and `compare-stacks.cjs` under `work/uat18`.
