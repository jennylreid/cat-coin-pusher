# UAT-06 — Revision 3: Sharp Grin retained; new Waiting mouth

**Status: Review mockup prepared; awaiting Jenny’s explicit OK. Not implemented or published.**

## Approved face and current direction

The existing sharp-toothed face is approved and named **Sharp Grin**. Its future use is TBD. It is no longer the intended Waiting expression. The published UAT-03 build still displays it during Waiting until Jenny approves a replacement; no live change is implied by this naming decision.

Revision 1 A/B/C was rejected. Revision 2 rectangular teeth is superseded by revision 3. Preserve both as history, not approved alternatives.

For Waiting, the new mouth has two upper canine fangs, two lower canine fangs, and smaller incisors between them, keeping a playful tongue and the original wide grin footprint. The rest of the cat remains fixed.

## Phone-sized comparison

![Approved Sharp Grin beside proposed Waiting](UAT-06-r3-phone-comparison.png)

Both panels are 1080×2404 renders of the shipped UAT-03 runtime with the same seed, board state, pose and reconstructed safe-area profile (left/right/bottom37, top164). The proposed head is substituted only in isolated renderer memory. These are desktop runtime mockups, not installed phone captures; desktop emoji/font rendering and the FPS label are not phone measurements.

![Mouth close-up](UAT-06-r3-mouth-close-up.png)

## Image-tool artwork and mouth-only checks

The built-in image-generation tool drew the teeth and mouth. Three tool passes produced a four-fang concept, a close-up matched to the original lip shape, and a refinement reducing the central upper tooth. The selected generated close-up is retained unchanged as UAT-06-r3-generated-mouth.png, with prompts in UAT-06-r3-prompts.md.

For review placement, the generated close-up is resized to the original crop (x440,y730,width650,height230) and clipped to the existing mouth mask. This is ordinary layer placement/masking; no tooth shapes, fillings, mouth colors or tongue graphics were drawn or repainted by code. The original outer lip and all pixels outside the mouth mask stay fixed.

The same canvas pipeline compares the fixed original head with the review composite:

- **0 changed pixels outside the mouth mask.**
- **0 alpha-channel changes.**
- 38,869 changed pixels inside the mouth; bounds [501, 765, 1033, 923] (exclusive right/bottom).
- Head remains 1536×1024. Original game draw placement remains x−10,y−25,width420,height240.
- Head outline, ears, eyes, nose, whiskers and markings stay fixed. Sweet, Quake, Happy and paw files are unchanged.

These registration and alpha invariants keep the proposed head aligned to existing Sweet and Quake. Approval would be followed by final encoded-asset and animated-switch checks in UAT before publication.

See UAT-06-r3-pixel-audit.json for exact bounds, source identity and channel hashes. The renderer is work/uat06-r3-render.cjs in the game workspace.

## Live game and release checks

All **19 runtime files** still match published UAT-03 **20261012133717 / APK2**, byte-for-byte, including the current Sharp Grin file. The preserved approved face copy also matches that file. Gameplay, poses, physics and balance remain the identical shipped code/assets; no new regression numbers are claimed for a review-only mouth.

UAT JSON SHA256: `77272942bb95226970a6862cb89c508d5f255b258cff827105675cb3d3f672ef`

UAT APK SHA256: `43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production stays **20261012120202 / APK14**, with unchanged JSON/APK hashes:

`f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

`e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

No source replacement, version bump, packaging, APK build or publication. UAT-04 remains cancelled. No USB debugging or ADB used.

## Next step

Wait for Jenny’s explicit OK on this exact mouth before implementing or publishing to UAT. Sharp Grin remains approved separately, future use TBD. No production promotion is authorized.
