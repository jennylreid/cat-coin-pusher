# UAT-07 — Happy refinement: review mockup

**Status: PREVIEW PREPARED; awaiting Jenny’s explicit OK before implementing or publishing.**

UAT-06 is already published as **20261012180042 / APK2**, with both approved Waiting and preserved Sharp Grin. This ticket is separate: no UAT-07 art/code has been copied into the working runtime or published update.

## Proposed Happy

The existing closed golden eyes and star accents remain. The paws use the original **Rest mitt asset** as their base, with ivory claws tucked/removed and the exposed palm edge repaired. They move down to the rear board edge, leaving the whiskers and face clear. The upper black cuff is hidden by the same existing Rest-palm clipping routine; no new wrists or body.

Happy’s mouth starts from the actual Sweet/Rest mouth. Its upper curved lip, original tongue interior/central cleft and placement are preserved; only the lower-lip area opens a little more. The lower midpoint’s last dark pixel moves from sourcey870 to y878 (**8 source pixels**, about5.4 pixels in this1080-wide phone render). There is no old dark-red cavern mouth and no additional curved underline/crease in the tongue.

Happy remains a manual six-second preview, with gameplay usage TBD. Board clear still uses Rest. Other faces, paws in other poses, layout, physics, timing and gameplay are not edited.

## Phone-size comparison

![Unchanged Rest next to proposed Happy](UAT-07-happy-vs-rest.png)

Each panel is1080×2404, with identical reconstructed Pixel safe-area insets (left/right/bottom37, top164) and the same controlled cleared-board state. Left is the current Rest rendered from unchanged UAT-06; right is the proposed Happy in isolated renderer memory. The setup removes bodies/sets won only to show the poses on an empty board; it is not a gameplay change. These are desktop runtime mockups, not installed phone captures; fonts/emoji and FPS labels are not phone measurements.

![Sweet mouth next to proposed Happy mouth](UAT-07-sweet-mouth-vs-happy.png)

Current Happy versus proposed is also saved as UAT-07-happy-before-after.png. Individual full-size panels are UAT-07-rest-phone.png and UAT-07-happy-phone.png.

## Art and exact-change checks

Image-tool studies used the original Sweet mouth crop and original paw.webp. The first mouth study added a curved mark below the tongue; that study was superseded. The selected cleanup removes the extra mark. The unchanged selected generated files and exact prompts are adjacent to this report. Only intended local parts are used by ordinary layer placement/masking.

Mouth:

- The fixed base is original head-sweet.webp, not the current Happy dark-mouth drawing.
- **0 changed upper-lip pixels.**
- **0 changes to protected original tongue interior and cleft.** The old black lower-lip boundary and its antialiasing move as part of the requested opening; those boundary pixels are not described as unchanged tongue artwork.
- **0 changes outside the allowed lower-mouth region** in the Sweet-derived mouth asset.
- The head outline, ears, nose, whiskers and markings remain the actual unchanged Sweet head. No generated head replacement is used.

Mitts:

- Original pawn sprite upper795 rows retain exact RGBA in the same canvas pipeline: **0 changes**. The lower claw-root/tip region is repaired into a clawless palm; the original runtime paw asset remains untouched.
- **0 ivory claw-colour pixels** in the proposed mitt.
- Existing Rest palm clipping profiles match the original and proposed mitt in every column: **0 differing columns**. This keeps the same approved upper palm/cuff treatment.
- Happy uses a uniformly scaled130-unit full sprite versus Rest’s182, at machinecentres x65/335,y235, with the same inward0.12-radian tilt. This footprint fits at the back corners without covering the face; it does not change Rest’s scale or placement.
- A paw-only render comparison against a no-mitt Happy frame, intersected with the original full head alpha (including whiskers), gives **0 head/whisker pixels covered**. Top visible mitt contribution is screeny971 in the1080×2404 image.

Eyes and preview:

- The existing eye-drawing block is retained **byte-for-byte**, including its blackout ellipses and closed golden arches.
- The rendered golden-eye band (screeny450–779) has **0 changed pixels** between current and proposed Happy. The band ends above the old raised paws; their removal is an authorised difference lower down.
- The preview still expires after six seconds and returns to Sweet/Rest in this cleared-board setup. Mitt rendering restores the original ART.paw immediately, and the Rest routine is not replaced.

Audit: UAT-07-audit.json. The isolated renderer overrides are UAT-07-preview-overrides.js, reproduced by work/uat07-mockup.cjs plus work/uat07-final-audit.cjs and the read-only work/uat07-palm-profile.cjs in the game workspace. No proposed files are in the20-file runtime payload.

## Release/gameplay separation

All20 current runtime files match published UAT-06 (only the working-versus-packaged BUILD label is normalised for HTML). UAT-07 has no working-source changes, version bump, package, APK build or publication. Physics/gameplay code is identical to the release whose spends86/113 and119/127 and Quake spills15/12 were just verified; no redundant physics run or changed outcomes are claimed for an isolated art preview.

UAT-06 JSON remains `81a7e58f92659c6accf782899c1d03c8f102c448ad67693378d71261ed97d0ab`.

Production stays **20261012120202 / APK14**, unchanged:

JSON `f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

APK `e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

No ADB or USB debugging used. UAT-06’s release report/backup remains intact. Happy remains preview-only even if its art is later approved.

## Next step

Show this Happy beside Rest to Jenny and **wait for her explicit OK** before implementation/publication. If revised, preserve the untouched original Rest, Sweet, Waiting, Sharp Grin and Quake assets and keep Happy’s usage TBD.
