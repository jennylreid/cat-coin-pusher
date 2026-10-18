# UAT-06 — Revision 2: current wonky grin, rectangular teeth

**Status: Review mockup prepared. WAIT for Jenny’s OK before implementing or publishing.**

Jenny rejected options A/B/C because their teeth were too tidy and evenly spaced. Those studies are superseded; see UAT-06-r1-rejected.md for history. The current direction is the existing Waiting grin, changing only tooth shapes while retaining the original count, lengths and crowded, overlapping arrangement.

## Result

The source has **14 teeth: 10 upper and 4 lower**. Each tooth was identified separately from the actual published Grin. Its original image-coordinate bounding box, relative position, size and crooked direction were used to fit a rectangle; no evenly spaced replacement row was introduced.

Widths/heights and projected bounds were solved from each original tooth’s extents. Short teeth remain short, long teeth remain long, and existing bounding-box overlaps and spacing remain. The original lip still occludes tooth roots as before. The geometry table for all 14 teeth is in the audit.

Ivory is sampled from each original tooth. Only old/new tooth shapes and their outlines are edited. Where a pointed edge disappears, its background is restored from neighbouring existing dark mouth pixels. There is no pink-mouth recoloring, new tongue or lip redesign.

## Phone-sized before/after

![Current versus rectangular teeth](UAT-06-r2-phone-comparison.png)

Each panel is a 1080×2404 real runtime render, with identical UAT-03 layout, pose and board state. Proposed art is substituted only into isolated renderer memory. These are not installed Pixel screenshots; desktop fonts/emoji/FPS labels are not phone measurements.

![Mouth close-up](UAT-06-r2-mouth-close-up.png)

[Individual proposed phone render](UAT-06-r2-phone.png).

## Exact-change checks

![Allowed tooth-edit regions](UAT-06-r2-tooth-mask.png)

Full RGBA comparison after saving/reloading confirms:

- Original and new counts: **14**, with the same 10 upper / 4 lower grouping.
- **0 changed pixels outside the old/new tooth-edit regions.**
- **0 alpha-channel changes anywhere.**
- **0 tongue-pixel changes.**
- Head canvas remains **1536×1024**, with unchanged game registration.
- 23,257 pixels change within tooth regions; changed bounds are x501–1029, y765–890.

All original head-outline, ear, eye, nose, whisker and marking pixels remain exact. Mouth pixels outside tooth-edit regions, the lip and tongue remain exact. No Sweet, Quake or Happy files are changed.

[Pixel audit and all 14 original/replacement geometries](UAT-06-r2-pixel-audit.json).

## Live source and publication state

UAT-04 remains cancelled. The working game still matches **all 19 files** from published UAT-03 **20261012133717 / APK2**, byte-for-byte. UAT and production APK/JSON hashes remain unchanged; production stays **20261012120202 / APK14**.

No option has been copied into the live game, no game version was bumped, and no packaging, APK build or publication occurred. Poses, gameplay, physics and other faces remain the exact published baseline.

The face canvas and draw rectangle remain the original ones: x−10, y−25, width420, height240. With unchanged alpha and pixels outside the teeth, switching to/from existing Sweet and Quake remains registered to the original head.

## Next step

Wait for Jenny’s explicit OK before applying this revision to UAT. If approved, use this exact asset, verify its lossless encoding and runtime switching, package a new game-only version with backup and production hash checks, and update this report with release details.

Reproduction scripts: work/uat06-rect-teeth.py, work/uat06-rect-layer.cjs, work/uat06-rect-compose.py and work/uat06-rect-render.cjs in the existing game workspace. Prior A/B/C review remains rejected history only.

