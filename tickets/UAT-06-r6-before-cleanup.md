# UAT-06 — Revision 6: enlarge the four original teeth proportionally

**Status: NEEDS FIX; superseded by corrected revision 6. Jenny accepted the bigger-fang idea but rejected thick fuzzy outlines and pale spill below the lip. Do not ship this initial revision 6 asset.**

Revision 5 is **discarded**: lengthening made the teeth slim and pointy. Its record is UAT-06-r5-discarded.md; do not ship it. Earlier revisions remain rejected/superseded history. Sharp Grin remains separately approved, future use TBD, and still appears in the unchanged published game pending approval of a Waiting replacement.

## Current result

This revision starts from the exact Sharp Grin file, SHA256 `54fd9c2513770e46850fdfc34b5e1103860e5a40e8c45cc46f618000eec606e9`. No generated teeth, prior mockup teeth, redraw, procedural geometry or one-axis stretch is used. Jenny explicitly requested enlarging the existing teeth themselves rather than redrawing them; this revision therefore uses direct original-art cutouts and ordinary uniform scaling.

The same four are selected: the middle two bottom teeth beside the tongue, and the top teeth just outside those. Fourteen original tooth interiors were found, matching the original10 upper/4 lower count. The other ten teeth remain in the unchanged original head underlay. The enlarged four can cover neighbours, as Jenny explicitly allowed; this is occlusion, not an edit to the neighbours’ original artwork.

| Mark | Original tooth | Scale in both axes | Original width×height → enlarged width×height |
| --- | --- | --- | --- |
| 1 | Fourth upper tooth from left | 1.35× | 60×47 → 81×63.45 |
| 2 | Eighth upper tooth from left | 1.35× | 62×46 → 83.7×62.1 |
| 3 | Second bottom tooth from left, next to tongue | 3.4× | 24×17 → 81.6×57.8 |
| 4 | Third bottom tooth from left, next to tongue | 2.7× | 30×26 → 81×70.2 |

These dimensions describe original ivory bounds and uniform transform fitting, before overlap/lip/tongue clipping; black outlines are included in the actual original cutouts. Each tooth retains its original aspect ratio, lean, ivory texture and outline, with scaleX exactly equal to scaleY. The small bottom pair gets more enlargement to reach approximately the same width as the upper pair. Roots stay anchored to their original upper/lower positions.

Layer order is original head, enlarged bottom pair, then enlarged top pair. Where upper and lower fangs overlap, **upper is in front**. Original tongue and its outline are protected; the overlay is clipped to the original mouth interior so the outer lip stays fixed. Small original bottom raster pieces are resampled when enlarged, so their edges appear softer in the zoomed close-up; no new illustration or sharpening changes their shape.

## Review images

![Sharp Grin beside proposed Waiting at phone size](UAT-06-r6-phone-comparison.png)

Each panel is1080×2404, rendered from unchanged UAT-03 with identical seed, board state, pose and reconstructed safe-area insets (left/right/bottom37, top164). Only isolated renderer memory uses the proposed face. These are desktop runtime mockups, not installed phone captures; fonts/emoji and FPS labels are not phone measurements.

![Close-up marking the four original and enlarged teeth](UAT-06-r6-mouth-close-up-marked.png)

Marks1/2 are upper teeth (cyan). Marks3/4 are bottom teeth (gold). The visible bottom fang areas are partly behind the top pair. Unmarked art comparison: UAT-06-r6-mouth-close-up.png. Labels and leaders are separate annotations, not part of the proposed face asset.

## Checks

The four original cutouts are saved alongside this report as UAT-06-r6-original-tooth-1.png through -4.png; all pixels come from the unchanged original Sharp Grin. The scaled-only overlay is UAT-06-r6-enlarged-teeth-layer.png.

Audit UAT-06-r6-pixel-audit.json records each original bounding box, fixed root anchor, scaleX/scaleY, target fitting bounds, draw order and channel hashes. Checks confirm:

- Uniform scale in both axes for all four teeth; aspect ratios preserved.
- **3,725 clipped overlap pixels** between upper and lower layers; the upper layer is composited last.
- **0 changed pixels outside the enlarged-tooth overlays.**
- **0 changed protected tongue pixels.**
- **0 alpha changes**; original head silhouette and dimensions remain1536×1024.
- 14,002 changed pixels under the tooth overlays; bounds [617, 799, 934, 914] (right/bottom exclusive).

All non-overlaid original pixels remain exact. Neighbouring tooth pixels covered by the enlarged fangs are the authorised visible difference; no neighbour-source edits were made. The head outline, ears, eyes, nose, whiskers, markings, surrounding muzzle and outer lips remain unchanged. Sweet, Quake, Happy and paw files remain unchanged. Game draw registration remains x−10,y−25,width420,height240, preserving alignment to the other faces. Final encoded-asset and animated-switch checks follow only if approved.

Reproduction: work/uat06-r6-render.cjs and work/uat06-r6-mark.cjs in the game workspace.

## Source and publication state

All **19 working runtime files** are still byte-identical to published UAT-03 **20261012133717 / APK2**, including the original Sharp Grin. Poses, timing, gameplay, physics and balance remain the exact published baseline. No changed regression numbers are claimed for a review-only tooth overlay.

UAT JSON/APK SHA256, unchanged:

`77272942bb95226970a6862cb89c508d5f255b258cff827105675cb3d3f672ef`

`43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production remains **20261012120202 / APK14**, JSON/APK SHA256 unchanged:

`f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

`e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

No live game source replacement, version bump, packaging, APK build or publication. No ADB/USB debugging. UAT-04 remains cancelled. Release-channel table remains unchanged.

## Next step

Wait for Jenny’s explicit OK on revision 6 before implementing or publishing to UAT. Revision 5 is discarded and must not be shipped. Sharp Grin remains separately approved, future use TBD. No production promotion authorized.
