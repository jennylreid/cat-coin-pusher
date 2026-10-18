# UAT-06 — Revision 4: crowded angular teeth

**Status: DISCARDED by Jenny in revision 5: too many needle teeth. Do not implement or publish this revision. Historical record only.**

Sharp Grin remains approved, with future use TBD. The published UAT-03 still uses it in Waiting until a replacement is approved and implemented. Revision 3’s curved fangs are superseded because they did not match the art style; revisions 1 and 2 also remain historical studies.

## Requested tooth layout

Started from the original Sharp Grin close-up, not revision 3. The new Waiting layout uses two upper fangs, two lower fangs and smaller straight-edged pointed teeth. Teeth crowd together, touch, overlap and lean slightly. Upper and lower fang pairs sit toward the sides; the small lower teeth sit between the fangs and original tongue. All tooth artwork comes from the built-in image-generation tool, matching the angular teeth/claw style.

## Review images

![Sharp Grin and proposed Waiting at phone size](UAT-06-r4-phone-comparison.png)

Each panel is 1080×2404, rendered from the unchanged UAT-03 runtime with identical seed, board state, pose and reconstructed safe-area insets (left/right/bottom37, top164). The proposed head is loaded only into isolated renderer memory. These are desktop runtime mockups, not installed Pixel screenshots; desktop emoji/font differences and FPS labels are not phone measurements.

![Mouth close-up](UAT-06-r4-mouth-close-up.png)

## Preservation checks

The generated close-up is archived unchanged as UAT-06-r4-generated-mouth.png. The two image-tool prompts are in UAT-06-r4-prompts.md.

Standard layer placement fits the generated crop to x440,y730,width650,height230. A clipping mask selects the original/new ivory tooth regions and their outlines, bounded by the original mouth interior. The original tongue and its outline are protected. This masks image-tool artwork; no procedural tooth geometry, tooth painting or mouth recoloring is used. Generated background is used only where the tooth layout changes, including the space exposed by removing an old tooth. Original mouth pixels outside those tooth-edit regions remain fixed.

Pixel comparison in the same canvas pipeline confirms:

- **0 changed pixels outside tooth-edit regions.**
- **0 changed tongue pixels**, including the protected black outline.
- **0 changed pixels outside the mouth.**
- **0 alpha changes.**
- 31,200 changed pixels, bounds [501, 765, 1033, 892] (right/bottom exclusive).
- Canvas1536×1024 and game draw registration x−10,y−25,width420,height240 retained.

The outer mouth outline, surrounding muzzle, head outline, eyes, ears, nose, whiskers and markings stay fixed. Sweet, Quake, Happy and paw assets are unchanged. Unchanged registration preserves face alignment; if approved, final encoded-asset and animated-switch verification will follow before UAT publication.

See UAT-06-r4-pixel-audit.json and UAT-06-r4-tooth-edit-mask.png. Reproduction: work/uat06-r4-render.cjs in the existing game workspace.

## Source and publication checks

All **19 working runtime files** are still byte-identical to published UAT-03 **20261012133717 / APK2**, including the approved Sharp Grin. No game code/art files, poses, gameplay, physics or balance changed. Published production remains **20261012120202 / APK14**.

UAT JSON/APK SHA256, unchanged from the baseline:

`77272942bb95226970a6862cb89c508d5f255b258cff827105675cb3d3f672ef`

`43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production JSON/APK SHA256, unchanged from the baseline:

`f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

`e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

No version bump, package, APK build or publication. No USB debugging/ADB. UAT-04 remains cancelled.

## Next step

Wait for Jenny’s OK on this exact revision before implementing or publishing to UAT. No production promotion is authorized. Sharp Grin remains separately approved for future use TBD.
