# UAT-06 — Revision 6 corrected: crisp fangs, original lower lip

**Status: Corrected review mockup prepared. Await Jenny’s explicit OK before implementing or publishing.**

Jenny accepted the bigger-fang direction but requested fixes before approval: the scaled tooth outlines were thick and fuzzy, and a pale band appeared below the lip. Initial revision6 is superseded and must not be shipped; see UAT-06-r6-before-cleanup.md. Revisions4/5 remain discarded. Sharp Grin remains separately approved, future use TBD.

## Correction

The four broad fang shapes remain the direction: top teeth4/8 and inner bottom teeth12/13, numbered1–4 in the close-up. The top pair remains in front where it overlaps the bottom pair. No slim or one-axis stretched fangs are introduced.

Used Jenny’s permitted option of **cleaning/redrawing the four outlines at normal thickness**. The built-in image-generation tool used the unmarked revision6 mouth as its shape reference and original Sharp Grin as its line-weight/sharpness reference. The selected generated cleanup is archived unchanged as UAT-06-r6-fix-generated-cleanup.png; exact prompt in UAT-06-r6-fix-prompt.md. This replaces the enlarged blurry ink edges, rather than enlarging the original tiny bottom outlines again.

Only the existing four-fang footprint plus4 pixels for edge cleanup is composited into the fixed Sharp Grin head. The original mouth mask is inset1 pixel to preserve the original lip and edge antialiasing; the original tongue/outline is protected. Whole-head geometry and other face details do not come from the image tool. The lower fang roots stop behind the original lower lip. Uncovered original teeth stay unchanged; authorised overlap may still cover neighbouring teeth.

## Close-up and phone-size comparison

![Original Sharp Grin and corrected Waiting close-up](UAT-06-r6-fix-mouth-close-up.png)

![Four marked fangs](UAT-06-r6-fix-mouth-close-up-marked.png)

![Phone-size Sharp Grin beside corrected Waiting](UAT-06-r6-fix-phone-comparison.png)

Both panels are1080×2404 runtime renders with identical seed, board state, pose and reconstructed safe-area profile (left/right/bottom37, top164). The correction is substituted only in isolated renderer memory. These are desktop mockups, not installed phone captures; desktop fonts/emoji and FPS labels are not phone measurements.

## Outline and clipping checks

Visual review of the final saved close-up and phone render confirms crisp edges, normal fine outline weight, broad fang proportions and top-in-front overlap. The lower lip is continuous; the enlarged ivory is contained by the original mouth and lip edge.

Read-only horizontal scans of the original and final images, black core defined as RGB maximum below50, provide a representative outline comparison away from junctions:

| Original canvas row | Original selected top tooth left edge | Corrected enlarged top fang left edge |
| --- | --- | --- |
| y835 | x642–646: 4px | x631–635: 4px |
| y840 | x645–650: 5px | x634–638: 4px |

These sample isolated side strokes, not every contour location or the combined black regions at overlap junctions. Lower fang quality is checked in the saved close-up; no global constant-width assertion is made for hand-drawn outlines.

The previous outside-overlay audit did not validate edge quality or explicitly protect the lip border. This correction adds a dedicated lip guard and below-mouth check. Full same-pipeline comparison confirms:

- **0 changed pixels outside the fang cleanup region.**
- **0 changed original lip-guard pixels.**
- **0 changed pixels outside the original mouth**, including the area below the lower lip.
- **0 changed protected tongue pixels.**
- **0 alpha changes**, with canvas1536×1024 retained.
- 15,054 changes inside the fang cleanup region, bounds [613, 799, 938, 891] (right/bottom exclusive).

The original head outline, ears, eyes, nose, whiskers, markings, surrounding muzzle and lip border stay fixed. Sweet/Quake/Happy/paw files remain unchanged. Original game draw registration x−10,y−25,width420,height240 is retained. Final encoded-asset/animated-switch checks remain conditional on approval.

Audit: UAT-06-r6-fix-pixel-audit.json. Mask: UAT-06-r6-fix-cleanup-region-mask.png. Reproduction: work/uat06-r6-fix-render.cjs, work/uat06-r6-fix-mark.cjs and read-only work/uat06-r6-fix-edge-inspect.cjs in the game workspace.

## Live source and release state

All **19 working runtime files** remain byte-identical to published UAT-03 **20261012133717 / APK2**. The original Sharp Grin still appears in the live game until an explicitly approved replacement is implemented. Poses, timing, physics, gameplay and balance are unchanged published source. No new physics outcomes are claimed for a review-only art correction.

UAT JSON/APK SHA256 unchanged:

`77272942bb95226970a6862cb89c508d5f255b258cff827105675cb3d3f672ef`

`43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production remains **20261012120202 / APK14**, JSON/APK SHA256 unchanged:

`f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

`e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

No source replacement, version bump, package, APK build or publication. No ADB/USB debugging. UAT-04 cancelled; release-channel table unchanged.

## Next step

Wait for Jenny’s explicit OK on the **corrected revision6** shown here before implementing or publishing to UAT. Do not ship the initial fuzzy revision6 or discarded revisions4/5. No production promotion authorised.
