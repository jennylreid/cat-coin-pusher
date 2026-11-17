# CP-58 Yawn face: Runway trial report (Claude engineer, Nov 16)

**Verdict: worth pursuing.** Runway (Nano Banana Pro image edit, our approved Calm head as the reference) kept our cat on
model far better than earlier attempts: ears, outline, forehead stripe, whiskers and colours line up with the approved
head almost pixel for pixel. Two images (attempt2-3 and attempt1-2) could become the **yawn frame** as a whole head,
not just a lower-face overlay. Nothing in the game, UAT, production or other tickets was touched.

**Credits: 160** (2 attempts × 4 images, 80 each; balance 3,021 → 2,861). 8 images, within budget.

## Decision (Jenny, Nov 16): the round yawn
Jenny picked the round yawn (attempt1-2, `yawn-runway-3.mp4`); the big one "looks more like a yell than a yawn" and is
dropped (its files stay as evidence). `yawn-runway-3.mp4` (21:27) already has Runway's eyes for every closed-eye moment
through the end: the yawn face, then the squint while eating and chewing until the eating ends (~4.6 s). After that, the eyes open
in the game's normal Calm face, as in the prototype. Checked frame by frame; no re-render was needed.
`yawn-compare.mp4` (Big | Round, in sync) had already been made before the pick and can be ignored.

## Update 4 (Jenny, Nov 16): Runway's eyes while eating too
- The closed eyes while eating and chewing are now Runway's own squinting eyes, cut from the same Runway image (yellow
  lines and crease ticks only) and placed where they sit on the head canvas, on the prototype's black eye patches.
  Files: `work\cp58-yawn\game\runway\yawn-eyes-1.png` / `-3.png` (+ copies in `game\art\`). Preview on our head:
  `runway\eyes-runway-1-on-head.png`, `-3-on-head.png`. The chewing mouth is unchanged.
- **The side-eye stays as it was:** that beat has the eyes open with the game's pupils looking away, and Runway's closed
  eyes don't fit it.
- The eyes now come from Runway through the whole moment: in the yawn face, then while eating. The only other eyes are the game's open
  eyes before, during the side-eye and after.
- Re-rendered `yawn-runway-1.mp4` and `yawn-runway-3.mp4`. New stills: `yawn-runway-1-eating.png`, `-3-eating.png`.
  No frame errors; shrimp and cheese grabbed and returned. No new generations.

## Update 3 (Jenny's pick, Nov 16): Runway's own face in the Yawn prototype
Jenny chose option A (Runway's whole yawn face, its own eyes), and either attempt2-3 or attempt1-2.
- **Videos** (real game, Level 1, 412×915, 30 fps, no sound): `runway\yawn-runway-1.mp4` (attempt2-3, big yawn) and
  `runway\yawn-runway-3.mp4` (attempt1-2, round yawn). Stills at the yawn's peak: `yawn-runway-1-peak.png`, `-3-peak.png`.
- **What changed:** during the yawn the Runway face fades in over the normal face (0.05–0.30 s), holds while the head
  tips back and the mitts stretch, and fades out at 1.25–1.47 s. That's the prototype's own yawn timing, ending just before the
  side-eye. It moves with the head. The code-drawn yawn eyes and mouth are no longer drawn. The normal face keeps its
  pupils under the fade. Stretch, side-eye, grab, eat and chewing are the prototype unchanged; both runs grabbed and
  returned the shrimp and cheese, no frame errors.
- **Mid-fade:** for about a tenth of a second both faces show at half strength (the mouth outline ghosts in). That's what a plain
  crossfade does. A quicker fade or a hard cut is a one-number change (`cp58RunwayK` in the script).
- **Files:** `work\cp58-yawn\runway\runway-face.js` (the change), `build_runway.py` (builds
  `game\proto-runway-1.html` and `proto-runway-3.html`; `proto.html` is unchanged), `frames_runway.cjs` (renders the
  frames). The faces are `game\runway\yawn-face-1.png` and `yawn-face-3.png`, copied into `game\art\` for the desktop
  renderer. UAT, production and the game's own files are not touched. Frames were deleted after encoding.

## Update 2 (PM, Nov 16): v2 previews, eyes on black fur
`runway\overlay-v2-side-by-side.png`, numbered: 1 approved head; 2 big yawn, Runway's whole face with its own
eyes; 3 big yawn, Runway jaw + prototype eyes; 4 round yawn, Runway's whole face; 5 round yawn, Runway jaw + prototype
eyes. Heads alone: `overlay-v2-attempt2-3.png`, `overlay-v2-attempt1-2.png` (2 and 4 are `fit-*.png`).
- **2 and 4:** Runway's own frame unchanged; its eyes were drawn with that jaw, so they fit.
- **3:** Runway's white muzzle reaches up past the inner eye corners. From the nose down, its edges are pulled in
  (42 px, tapering to nothing by mid-cheek), so the closing eyes sit on black fur. The big nose now starts the muzzle
  right between the eyes. It reads a little abrupt up close.
- **5:** the round yawn's muzzle already matches our blaze at eye level, so nothing was narrowed. It's the cleanest composite.
- Script: `scripts\overlay_v2.py`. No new generations.

## Update (PM, Nov 16): lower face only, with the prototype's eyes
Jenny keeps the prototype's closing eyes, so Runway supplies only the jaw and mouth.
- **Previews:** `runway\overlay-side-by-side.png` (approved Calm | prototype now | the two Runway jaws) and
  `runway\overlay-board-head-crop.png` / `overlay-board-412x915.png` (the real 412×915 frame). Heads alone:
  `overlay-attempt2-3.png`, `overlay-attempt1-2.png` (1536×1024 head canvas, transparent). Script: `scripts\overlay.py`.
- **How it's built:** approved Sweet head (what the prototype shows during the yawn); below a cut line, the fitted
  Runway face; on top, the prototype's eyes, drawn with the same shapes as `cp58Face()`.
- **Runway's nose comes too:** Runway moved the nose and mouth about 130 px higher on the canvas, so our own nose can't be kept.
  It either covers the top of the mouth or gives two noses. So the cut sits at eye level (470; 390 for attempt2-3), and
  the prototype's black eye shapes hide the seam. Result: during the yawn the nose is a bit smaller and sits a little
  higher, between the eyes. At phone size it reads as the muzzle stretching. It's the one visible difference from the
  approved face.
- **Both work as an overlay:** attempt1-2 is the cleanest join (round yawn, chin stays inside the outline).
  attempt2-3 is the bigger yawn: the chin drops below the outline onto the top of the table back.
- For the game: one overlay image (lower face) drawn on the head during the yawn, replacing the code-drawn mouth. The eyes stay
  as they are. No new generations needed for this.

## What I did in Runway
- Jenny's Chrome, new tab. Tool → Image, model **Nano Banana Pro** (Runway's default), 4 images, aspect Auto, 1K.
- Reference: `runway/refs/ref-head-calm.png` (approved `head-calm.png` on white), referred to as "Image 1".
- The first Generate failed with "no explore mode access" (no credits used): the top-bar mode chip was on
  Unlimited. I switched it to Credits for this session only ("save this setting" left unticked). No account
  settings changed, nothing bought or shared.
- Attempt 1 prompt: same head, framing, style and colours; change only the expression to a huge yawn (jaw drops, muzzle
  stretches, open mouth, tongue, two fangs, eyes squeezed shut as curved yellow lines).
- Attempt 2: the same, pushing harder on the chin dropping below the outline, a taller mouth, top and bottom fangs and
  tighter squeezed eyes with crease marks.
- Runway did not add a separate "character" step: the image model's reference input was enough here.

## Images (`tickets\CP-58-evidence\runway\`)
- `attempt1-1..4.png`, `attempt2-1..4.png` (1264×848, Runway's originals); contact sheets `sheet-attempt1.png`,
  `sheet-attempt2.png`.
- Fitted on the head canvas (1536×1024, transparent): `fit-attempt2-3.png`, `fit-attempt2-1.png`, `fit-attempt1-2.png`.
  All three register to the approved head at the same scale (×1.21, +4 px), ears/forehead overlap 93–97%.
- Previews: `preview-side-by-side.png` (approved | Runway | line overlay: grey same, cyan approved only, magenta
  Runway only); `preview-board-412x915.png` and `preview-board-head-crop.png` (game now | prototype stand-in | the three
  Runway faces on the real 412×915 frame); `board-<name>.png` for each.
- Scripts: `runway/scripts/fit.py` (cut out + register), `previews.py`.

## How on-model each is
| | Outline, ears, whiskers | Colours | Eyes (squeezed) | Mouth / jaw | Use |
|---|---|---|---|---|---|
| **attempt2-3** (best) | Same as approved | Same | Yellow arcs with small crease ticks; reads as squeezed shut | Tall open mouth, dark red, curled tongue, 4 fangs; chin bulges just below the outline | Yawn frame (whole head) |
| **attempt1-2** | Same as approved; closest overall (97%) | Same | Smooth yellow arcs, like the Happy face | Tall oval mouth, darker inside; chin barely drops | Yawn frame, or a softer early-yawn frame |
| **attempt2-1** | Same, but the chin outline gets a lumpy double curve | Same | Arcs with crease ticks | Very wide mouth; the lower lip line looks odd | Not recommended |

Small drifts on all of them: the white blaze is a little narrower where it meets the muzzle, and the nose is slightly
smaller and rounder. Eyes are new art (the brief asked for squeezed shut), in our yellow, and look like our style.
The rest of the head matches; no restyling of lines or colours.

## Limits and next steps (for the PM)
- The dropped chin in attempt2-3 sits a few pixels below the head's normal outline; in the game frame that overlaps
  the top of the table back. Fine for a moment, but check it in-game.
- These are Runway's 1K outputs upscaled ×1.21 to the head canvas: slightly softer than the approved art at full size;
  at phone size the difference isn't visible. A 2K/4K regenerate of the chosen one would cost more credits.
- Not wired into the game (out of scope). To use one: add it as the yawn head (whole-head swap during the yawn) in the
  CP-58 prototype, replacing the code-drawn mouth and squeezed eyes. Jenny would approve the face in-game on her phone.
- Pending decision for Jenny: pick attempt2-3, attempt1-2, or neither.
