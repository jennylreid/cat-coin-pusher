# UAT-06 — Revision 5: original Sharp Grin, four longer teeth

**Status: DISCARDED by Jenny in revision 6: lengthened teeth were slim and pointy, like needles. Do not implement or publish this revision. Historical record only.**

Revision 4 is **discarded**: too many needle teeth. Its images are historical only; see UAT-06-r4-discarded.md. Sharp Grin remains separately approved, future use TBD. The working and published game still uses the unchanged original Sharp Grin until a Waiting replacement is approved and implemented.

## Four selected teeth

Started from the original Sharp Grin, not revision 4. The original 14 teeth (10 upper, 4 lower) remain. The marked four are:

1. Upper-left: fourth upper tooth from the left, just outside the left inner bottom tooth.
2. Upper-right: eighth upper tooth from the left, just outside the right inner bottom tooth.
3. Lower-left: second bottom tooth from the left, immediately beside the tongue.
4. Lower-right: third bottom tooth from the left, immediately beside the tongue.

The two top tips extend downward; the two inner bottom tips extend upward. Roots and widths are fitted to the original ones. No other tooth is replaced, added or removed. The tongue, lips and surrounding mouth remain from the original image.

Fitting bounds in the original1536×1024 canvas (right/bottom exclusive; ivory bounds, not black outline):

| Mark | Original bounds | Proposed fitting bounds | Width retained | Height before → after |
| --- | --- | --- | --- | --- |
| 1 | x631–691,y803–850 | x631–691,y803–869 | 60px | 47→66px |
| 2 | x855–917,y804–850 | x855–917,y804–869 | 62px | 46→65px |
| 3 | x677–701,y874–891 | x677–701,y857–891 | 24px | 17→34px |
| 4 | x846–876,y861–887 | x846–876,y835–887 | 30px | 26→52px |

These are the selected review lengths, not new gameplay geometry. The widths/root alignment are controlled in layer placement; tooth graphics retain the image-tool drawn ivory and black angular style.

## Review images

![Original Sharp Grin next to proposed Waiting at phone size](UAT-06-r5-phone-comparison.png)

Each panel is 1080×2404, rendered from unchanged UAT-03 with the same seed, board state, pose and reconstructed safe-area insets (left/right/bottom37, top164). Only an isolated renderer’s in-memory head is substituted. These are desktop runtime mockups, not installed Pixel screenshots; desktop emoji/font differences and FPS labels are not phone measurements.

![Four marked teeth](UAT-06-r5-mouth-close-up-marked.png)

Unmarked close-up: UAT-06-r5-mouth-close-up.png. Annotation circles/numbers are separate review graphics, not part of the proposed face asset.

## Artwork and preservation checks

The built-in image-generation tool was given the original Sharp Grin close-up plus a four-target numbered guide. Its unchanged output is archived as UAT-06-r5-generated-mouth.png; prompt in UAT-06-r5-prompts.md. No previous replacement-mouth revision is used as art input.

Only the four selected tooth crops are used from that output. Standard cutout placement fits them to original widths/roots and longer heights. Masks protect the other ten original teeth and outlines, the tongue and its outline, and the outer lip. Only ivory tooth artwork and its black outline are composited; generated burgundy background is excluded. No new tooth geometry or painting is drawn by code. This avoids using the image tool’s incidental changes elsewhere in the mouth.

Same-pipeline pixel comparison confirms:

- **0 changes to the other ten teeth and protected outlines.**
- **0 changed protected tongue pixels.**
- **0 changed pixels outside the four tooth-edit regions.**
- **0 changes outside the mouth**, and **0 alpha changes**.
- 7,796 changed pixels inside the selected regions; bounds [633, 803, 921, 891] (right/bottom exclusive).
- Canvas1536×1024 and existing game registration x−10,y−25,width420,height240 retained.

The head, ears, eyes, nose, markings, whiskers, Sweet/Quake/Happy faces and paw artwork remain unchanged. Alignment with the other faces uses the original dimensions and registration. Final lossless-encoding and animated-switch checks follow only if this revision is approved.

Audit: UAT-06-r5-pixel-audit.json. Allowed region image: UAT-06-r5-tooth-edit-mask.png. Reproduction scripts: work/uat06-r5-render.cjs and work/uat06-r5-mark.cjs in the game workspace.

## Source and publication checks

All **19 working runtime files** remain byte-identical to published UAT-03 **20261012133717 / APK2**. Physics, gameplay, balance, poses and timing are the exact published source; no new physics outcomes are claimed for a review mockup.

UAT JSON/APK SHA256, unchanged:

`77272942bb95226970a6862cb89c508d5f255b258cff827105675cb3d3f672ef`

`43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production stays **20261012120202 / APK14**, JSON/APK SHA256 unchanged:

`f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

`e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

No live source replacement, version bump, packaging, APK build or publication. No ADB or USB debugging. UAT-04 remains cancelled.

## Next step

Wait for Jenny’s OK on revision 5 before implementing or publishing to UAT. Revision 4 is discarded and must not be shipped. Sharp Grin stays approved separately; its future use is TBD. No production promotion authorized.
