# UAT-18 Quake coin

Status: **published 2026.10.17 UAT 3 / APK4**, numeric **20261017204741**, on Jenny’s instruction “please sent to UAT.” Phone UAT pending.

Source: `work/uat18/release.html`; reviewed candidate: `work/uat18/draft.html`. Baseline: UAT 2, numeric 20261017160959. [Earlier report and approvals](UAT-18-evidence/uat2/report-before-uat3.md).

## Changes
- Smaller ordinary paw emblem, approximately two-thirds of its former width/height, with the approved soft relief, satin gold finish and clear edges. New cached asset: `work/uat18/art/uat18-small-paw.png`. Built-in ImageGen edit of the approved soft paw; shrink only the emblem and fill surrounding gold field.
- Quake moves from rear centre (200,365) to front centre (200,595), settling naturally on the coin layer. It stays visible and stable before play; no charge is earned while idle.
- Board 3 prizes are scattered across lanes/depths: cheese (96,515), shrimp (288,555), Tuna (210,465). This addresses phone feedback that all prizes previously fell before Quake could be earned.
- Staggered towers A, 140-coin budget, 110-second timer, Quake charge rules and existing CatQuake retained. Boards 1/2 geometry retained.

## Evidence and validation
- [Full Board 3](UAT-18-evidence/accessible-quake-board3-hires.png) · [detail](UAT-18-evidence/accessible-quake-board3-hires-detail.png). Actual renderer at DPR 3.
- [Collection/use clip](UAT-18-evidence/quake-accessible.mp4): normal target-following drops collect Quake at 22.37 seconds **before any prize**, then the button starts CatQuake at 23.88 seconds and shows zero charges. Board remains playing afterward, with Tuna still to collect. DPR-2 desktop recording, silent; no injected reward or repositioning during play. [Trace](UAT-18-evidence/capture-accessible.json).
- Target-following, centre-only and Quake-following drops at 0.4/0.22-second cadence all earn Quake before any prize (6/6), in 6.05–22.37 seconds. [Detailed results](UAT-18-evidence/accessibility-results.json).
- Both target-following no-power runs win using **140/140 coins** (55.82 and 31.53 seconds). Five of six strategies win; rapid centre-only tapping misses cheese in one run. These demonstrate viable clears with tight margins, not guaranteed wins for every strategy.
- Ten seconds idle leaves Quake uncollected and stable. New art loads correctly in the actual high-density renderer. Runners/results are under `work/uat18`.

## Publication
Game-only update, retaining APK4. Only `index.html` changes in existing payload files; `img/art/uat18-small-paw.png` is added. Reviewed source differs from release only in the build label. Verified backup: `uat/backups/before-UAT-18-accessible-20261017204741`. Existing OneDrive item and update link preserved. Fresh OneDrive download verified (HTTP 200), matching staged SHA-256 `a72abf38bdd29bf7417b1d61093dc6c42e9f2346a411555dcaa80a58030a6116`. [Publication record](UAT-18-evidence/publication.json).

## Pending phone UAT
Confirm new build receipt, smaller paw readability, scattered prize placement, early Quake collection/use, sound and smoothness. Desktop previews do not establish phone performance. Production promotion requires separate approval.
