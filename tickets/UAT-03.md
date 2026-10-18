# UAT-03 — Cat fully visible, Waiting paws restored, art cleanup

**Status:** Implemented, desktop-verified, before/after shown, published to UAT. Pixel visual/performance acceptance remains for Jenny’s phone review.

**Release:** UAT game **20261012133717**, APK **2** unchanged. Previous UAT game: 20261012122558. Production stays **20261012120202 / APK14**, untouched.

**Backup:** uat/backups/before-20261012133717. Original source art and HTML also retained under work/uat03-baseline in the game workspace.

## Layout and Waiting paws

- Camera fitting now uses the safe-area HUD bottom plus an 8-game-pixel gap as the upper bound and the button area minus 8 pixels as the lower bound. It includes the full head image extent, not the old ear-clipping approximation.
- Table and head move down together. Render scale is adjusted to fit; horizontal scale is capped at 0.98 so the complete table rails/front corners fit across the canvas. This changes presentation only, not world geometry or physics.
- On the reconstructed 1080×2404 phone profile, the entire head/ears are below the top bar and the complete board fits above the controls. A shorter 400×720 no-cutout profile also passes.
- Waiting uses the original mitt sprite, 280-game-pixel width, centers just outside the screen at x−35 / x435, an inward angle of approximately 0.25 radians and rail-gripping height. Reference is the approved option-4 resting mockup below. Coin/target drawing follows idle paws, so the mitts never paint over coins. This ordering is tested.
- Rest’s UAT-02 drawing branch is byte-identical: no cuffs, same lower placement, inward angle, size and clipping. Its coordinates follow the moved overall layout; it was not redesigned. Quake/Sweep/Recovery timing and gameplay motion parameters are retained.

## Art cleanup and audit

- Existing master images were cleaned with fixed masks and palette corrections; no new generated faces or teeth. All source pixel dimensions remain unchanged.
- Ear and nose interiors use a shared pink palette, main RGB **248,136,155**, with darker ear detail retained. Probes match across Grin, Sweet and Quake; Happy inherits Sweet’s ears/nose.
- Exterior haze was removed while retaining a narrow antialiasing boundary. Quake’s noisy outer alpha was stabilized against the confirmed master silhouette; its expression and teeth were not redrawn.
- Neutral doubled whisker strokes inside the muzzle were corrected using local white-background samples. Actual external whiskers remain. Mouth/teeth regions were protected; intentional nose recoloring and outer-edge cleanup are the exceptions to pixel equality there.
- Unused **head-open.png** was an exact duplicate of head.png. Its unused loader entry and live file were removed.
- Eleven PNGs become ten lossless WebP runtime assets: **15,063,714 → 8,169,342 bytes**, a **45.77%** reduction. No resizing or lossy encoding was used.
- Paw, coin, snacks, table, pusher/tongue, background and pupil art decode with identical visible RGBA pixels to their original PNGs. Only the three heads receive the requested cleanup/color changes. Existing original/reference/backup art elsewhere is preserved.
- Staging now removes obsolete live art filenames, preventing retired PNGs from remaining in the update payload. Android’s existing staged game replacement removes them from the active downloaded game as well; the unchanged APK still retains its older fallback assets.

## Phone-sized comparison

![Before and after](UAT-03-before-after.png)

Both sides are actual game runtime renders at **1080×2404**, using the screenshot-derived cutout/corner profile. They are not generated concept art or new on-device screenshots. Desktop font/emoji rendering differs from Android; no font/emoji code changes are included. Desktop FPS labels are not phone performance measurements.

- [Approved layout reference](UAT-03-reference.png)
- [Waiting before](UAT-03-waiting-before.png)
- [Waiting after](UAT-03-waiting-after.png)
- [Rest after](UAT-03-rest-after.png)
- [Quake after](UAT-03-quake-after.png)
- [Happy after](UAT-03-happy-after.png)
- [Per-asset cleanup/compression audit](UAT-03-art-audit.json)

## Verification

| Board | Cadence | Coins used | Budget | Result |
| --- | --- | --- | --- | --- |
| 1 | 0.4 sec | 86 | 140 | Won |
| 1 | 0.22 sec | 113 | 140 | Won |
| 2 | 0.4 sec | 119 | 160 | Won |
| 2 | 0.22 sec | 127 | 160 | Won |

These match SPEC.md. Fresh-board Quake spills remain **15/45** and **12/51**. No balance adjustment was needed.

Passed: full-head/board bounds, no-cutout layout, coins-after-Waiting-paws draw order, immediate drops in all pusher phases, solid pusher alignment, power exclusion/no coin cost/growl-before-impact/reset, Rest-on-clear and Happy preview-only behavior. Drop/power gameplay source and approved Rest branch are unchanged. All seven non-head assets pass decoded visible-pixel equality; WebP outputs pass lossless round-trip checks.

The staged JSON retains catpusher-uat / com.jenny.catpusher.uat / apkVersion2. All runtime asset references resolve. Sounds/Rapier files and APK bytes are unchanged. Published JSON matches staging; production APK/JSON hashes were checked unchanged after publication.

Reproduction: work/uat03-art-cleanup.py, work/uat03-render.cjs, outputs/uat/game/tests/uat03-layout.cjs, drop-phase-regression.cjs, two-powers-regression.cjs, rest-clear-regression.cjs and two-board-validation.cjs in the existing game workspace.

## Delivery and remaining review

Refresh Cat Pusher UAT’s existing OneDrive game update after sync; no reinstall. No ADB/USB debugging was used. No production promotion. Please review full-head visibility, Waiting grip, face switching/pink consistency, edge cleanup and frame rate on the Pixel. The report and adjacent screenshots are filed for Claude’s review before completion is reported.
