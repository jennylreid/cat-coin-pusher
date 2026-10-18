# UAT-06 — Charming grin, not mean

**Status: Three mouth studies prepared; awaiting Jenny’s pick. Not implemented or published.**

## UAT-04 cancellation and restoration

Jenny cancelled UAT-04. tickets/UAT-04.md is marked CANCELLED. Unpublished HTML and the UAT-04 test/renderer were moved out of the working game into work/uat04-cancelled.

The working UAT runtime was restored directly from the published **20261012133717** JSON, not by reversing selected edits. All **19 runtime files** are byte-identical to that payload. HTML SHA-256:

887bae6a8f72237a937bd8e72658ad7be16dee9b32f597a3f0ae97d61eddc505

No Poised code remains in the working HTML. Both published UAT APK/JSON and production APK/JSON hashes remain unchanged.

## Options for selection

| Option | Teeth | Mouth |
| --- | --- | --- |
| A | Six equal rounded teeth | Soft rose pink |
| B | Four equal soft rectangular teeth | Lighter blush pink |
| C | Four small rounded teeth | Lightest pink, more open space |

All options have fewer teeth than the current Grin and no pointed tooth shapes. No central teeth are enlarged or extended: each option uses equal tooth widths/heights; clipping follows the existing upper lip. The original tongue is retained. The original smile outline is retained rather than altering the head or muzzle.

## Phone-sized comparison

![Current Grin, A, B, C, Sweet](UAT-06-phone-comparison.png)

Each panel is a 1080×2404 actual runtime render using UAT-03’s layout and the screenshot-derived safe-area profile. They are review mockups, not newly installed phone screenshots. Desktop fonts/emoji and FPS labels are not phone measurements.

![Mouth details](UAT-06-mouth-details.png)

- [Current Grin](UAT-06-phone-current.png)
- [A](UAT-06-phone-A.png)
- [B](UAT-06-phone-B.png)
- [C](UAT-06-phone-C.png)
- [Sweet / Rest reference](UAT-06-phone-sweet.png)

The first four panels use the same Waiting pose and board state. Sweet is shown in the existing Rest pose as the expression reference; its pose and artwork have not been edited.

## How mouth-only changes were checked

The three mouths are separate overlays, composited onto a decoded copy of the published Grin. The editing mask is derived from the existing mouth’s colored interior and enclosed tooth-outline gaps, bounded away from the nose, whiskers and other features. It is not a whole-head redraw.

![Highlighted editable mouth mask](UAT-06-mouth-mask.png)

For every variant, a full RGBA array comparison after PNG saving/reloading confirms:

- **0 changed pixels outside the mouth mask**.
- **0 alpha-channel changes anywhere**: the head outline/transparency is exactly fixed.
- Dimensions remain **1536×1024**.
- Actual changed bounding box: **x501–1032, y765–922**.
- The ears, eyes, nose, whiskers and markings are pixel-identical to the published Grin.

Each option changes 31,765 pixels inside the mask. The complete audit and variant hashes are in [UAT-06-pixel-audit.json](UAT-06-pixel-audit.json).

## Alignment with Sweet and Quake

The variants retain the Grin’s original full canvas, alpha and registration. All three heads (Grin, Sweet and Quake) retain their existing 1536×1024 dimensions and the same game draw rectangle: x−10, y−25, width420, height240. No image offsets, scaling, pupil placement or switching code was modified. Thus a selected mouth cannot shift the head when switching to/from the existing Sweet or Quake. Sweet, Quake and Happy source files remain untouched.

## Implementation and gameplay state

All options live only in outputs/uat/uat06 and the review files. They were substituted into isolated renderer memory to take screenshots. No variant was copied into the live art folder and no working game HTML was changed for UAT-06.

The working runtime still matches all 19 published UAT-03 files after rendering. No game version bump, APK build, packaging or publication occurred. Physics and gameplay therefore remain the exact published baseline; no new balance change or substitute physics test is claimed.

Current releases: UAT **20261012133717 / APK2**, production **20261012120202 / APK14**.

## Next step

Wait for Jenny to pick A, B or C, or request revisions. Do not implement a choice before that. Then preserve the selected mouth exactly, verify switching in the real game and update this report with the chosen asset, tests and any approved release. Current subjective phone appeal is pending Jenny’s selection/review.

Reproduction scripts in the existing game workspace: work/uat06-mask.py, work/uat06-mouths.cjs, work/uat06-compose.py and work/uat06-render.cjs. Cancellation/restoration evidence is in work/uat06/baseline.json.
