# UAT-18 Quake coin

Status: **published 2026.10.17 UAT 2 / APK4**, numeric **20261017160959**. Jenny selected **A** and authorized publication: “okay, stick with A and publish to UAT thanks.” Phone UAT pending for this revision.

Source: `work/uat18/release.html`; reviewed candidate: `work/uat18/draft.html`. Baseline: UAT 1, numeric 20261017154958. Original implementation and earlier approvals: [prior report](UAT-18-evidence/uat1/report-before-uat2.md).

## Published changes
- **A: staggered stacks retained.** Clearer gold sidewalls with darker lower lips distinguish individual layers. Straight-stack B remains an unpublished comparison.
- Softer, shallower-looking regular paw relief reduces harsh shadows and highlights while retaining the approved satin gold finish and crisp texture. New cached asset: `work/uat18/art/uat18-soft-paw.png`.
- Gold Quake with blue ceramic bolt, ring and edge band, its earned-charge UI, and the density-aware tower cache remain as published in UAT 1.

## Evidence and validation
- [Reviewed A/B comparison](UAT-18-evidence/stack-alignment-comparison.png) · [selected A full board](UAT-18-evidence/stack-edge-board3-hires.png) · [selected A detail](UAT-18-evidence/stack-edge-board3-hires-detail.png).
- Actual game renderer at DPR 3 loads the new paw asset successfully. Quake face remains byte-identical. Edge shading reuses the same two rim draws; this revision changes no geometry, physics or gameplay.
- Prior Board 3 no-power runs remain applicable: 126/140 coins at 0.22-second taps, 125/140 at 0.4-second taps. [Collection/use clip](UAT-18-evidence/quake-ceramic.mp4) and [trace](UAT-18-evidence/capture-ceramic.json) validate the existing charge behavior.
- Artwork refinement used built-in ImageGen: soften only the regular paw relief/shadows/highlights while preserving gold finish and rim; extract the left tile and retain the original Quake atlas. Runners and source are under `work/uat18`.

## Publication
Game-only update retains APK4. Preserved existing payload assets, replacing only `index.html` and adding `img/art/uat18-soft-paw.png`. Reviewed candidate differs from release only in the displayed build name. Verified backup: `uat/backups/before-UAT-18-A-20261017160959`. Existing OneDrive item and sharing link retained. Fresh anonymous OneDrive download verified: HTTP 200, SHA-256 `50945e0334b3cd391c673a854799edf9d922757f63000fefbdf5630a3697aa9a` matches staged bytes. [Cloud record](UAT-18-evidence/cloud-verification.json). [Publication record](UAT-18-evidence/publication.json).

## Pending phone UAT
Judge softer paws/prize visibility and edge separation on full piles; collect the Board 3 Quake, see 1 charge, use it and confirm 0. Receipt of UAT 1 and love of its gold finish were confirmed; UAT 2 receipt, sound, smoothness and gameplay sign-off still require phone evidence. Production promotion is outside this authorization.

## Smaller paws, scattered prizes and accessible Quake — preview pending
Phone feedback: Jenny wants smaller paw prints, reports prizes clear before Quake can be collected, and requests prizes scattered rather than in a row. Draft is pinned to published UAT 2 before these changes.

- Paw emblem reduced to roughly two-thirds of its previous width/height in a new cached texture, `work/uat18/art/uat18-small-paw.png`. Coin size, gentle relief, gold finish and clear rim style retained. Built-in ImageGen edit of the approved soft paw: shrink the five-pad emblem, fill the surrounding gold field, preserve the outer rim and transparency.
- Board 3 Quake moves from rear centre (200,365) to front centre (200,595), spawning above the ordinary coin layer and settling naturally onto it. Idle check: it remains on the board and earns nothing before play. Charge rules and CatQuake are unchanged.
- Fixed scattered prize positions: cheese (96,515), shrimp (288,555), Tuna (210,465). Towers, budget 140, timer 110 and Boards 1/2 definitions retained. No prize is required to wait for Quake, and Quake is still optional for board clear.
- [Full Board 3](UAT-18-evidence/accessible-quake-board3-hires.png) · [detail](UAT-18-evidence/accessible-quake-board3-hires-detail.png). Actual DPR-3 renderer.

Validation: target-following, centre-only and Quake-following drops at 0.4/0.22-second cadence all collect Quake **before any prize**, while the board is playing (6/6). Collection ranges from 6.05 to 22.37 seconds. Target-following no-power runs both win using 140/140 coins, at 55.82 and 31.53 seconds. Centre-only rapid tapping fails to collect cheese in one run; the other five runs win. These establish accessible Quake and viable no-power clears, not wins for every strategy. [Detailed results](UAT-18-evidence/accessibility-results.json). This changes landing/layout, so these supersede earlier balance evidence for this draft. Not published; UAT 2 remains current, pending Jenny’s review.

Updated [collection/use clip](UAT-18-evidence/quake-accessible.mp4), captured in the actual renderer at DPR 2 (silent): normal target-following drops collect Quake at 22.37 seconds with **zero prizes collected**, then the UI button starts CatQuake at 23.88 seconds and shows zero charges. The board is still playing after the effect, with Tuna remaining. [Trace](UAT-18-evidence/capture-accessible.json). No reward injection, object repositioning during play or special test powers.
