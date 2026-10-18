# Current specification checkpoint

The authoritative current design is [SPEC.md](SPEC.md), refreshed after UAT **20261011205433**. Production remains **20261011191602**. Waiting/Rest/Recovery naming, Rest-on-clear, Happy preview-only, retreat perspective and Shower status supersede older descriptions below. Historical notes below do not grant new approval.

# Current art prompts and references

Updated October 11, 2026. Production: **20261011164847 (4:48 PM)**, main APK **13**. UAT: **20261011182423 (6:24 PM)**, UAT APK **1**. These are separate channels. The two-power test and consistent tooth colors are UAT-only; they have not been approved for production.

## Approved art and preserved alternatives

Production uses the angular, friendly black/white tuxedo cat inspired by Jenny's saved original DALL·E image; open golden eyes, pink nose/tongue, straight whiskers, navy/cyan starry background. The normal grin has crowded crooked teeth and eight fitted exits. No lidded eyes, angry eyebrows, body or shoulders. Rejected looming-head experiments are not the approved design.

Paw option **4** is selected: huge rounded white mitts, short black cuffs, four longer angular ivory claws. Use a fixed scale at rest and during the inward overlapping sweep. More of the paws shows at idle with a tiny bob/wobble; they can cover outer rails, while coins are drawn above idle paws. Active paws render above the board. Keep the existing table and pusher proportions.

Keep the shiny coin look. The flatter illustrated-coin mockup was not selected; actual game coin/table/pusher/snack assets were retained. Generated board mockups are visual references, not authoritative physics or precise sprite geometry.

UAT normal and Catquake teeth now share one light ivory color; do not alternate white/yellow teeth. Head sprites have transparent backgrounds. The cosmic background remains unchanged—black around a standalone sprite preview is not a requested game background.

Preserved assets: outputs/cat-style-original-reference (old detailed furry style), outputs/recovered-cat-references/original-dalle-tuxedo-cat.png (Jenny's supplied original), outputs/game-expression-library/sweet-kitty (small mouth/tongue head and separate pupil), outputs/quirky-cat-mockups (design explorations). Never overwrite these originals to implement new expressions.

OneDrive cat-art contains FinTracker SVG exports and their README/provenance. These remain reference material; the FinTracker master and SVGs were not replaced. The recovered Hit-Point inspiration image is a separate existing reference, not Jenny's original DALL·E work or a production sprite.

## Prompt constraints for future edits

- Head: preserve1536x1024 registration, angular tuxedo shape, open empty golden iris fields, pink nose, straight whiskers, white muzzle and current head/table proportions. Add upright pupils in code; no baked pupils or highlights. Do not adopt rejected looming experiments or lidded/angry eyes.
- Normal grin: crowded irregular ivory triangular teeth and pink tongue, with eight custom registered outlets. Geometry changes require outlet remapping and a visual drip preview.
- Sweet expression: preserve saved small-mouth/tongue face. Active in UAT Paw Sweep; do not discard or overwrite the saved source.
- Catquake: registered wild open roaring mouth with many longer crooked/overlapping teeth; keep same eye/head registration and pusher clearance. Goofy rather than threatening.
- Tooth-color edits: **all teeth in every toothy expression share light ivory**, matching the claw palette. No alternating white/yellow teeth or differently colored facets. Preserve shapes/seams and all other pixels. Fully transparent outside silhouette; no black haze or background plate.
- Paw option4: broad round plain white mitts, short black cuff, exactly four longer angular ivory polygon claws; minimal crude detail. One sprite at one fixed scale is used for idle and sweep; do not regenerate a small resting version. Position/mask in code, not by painting new paws over the board.
- Background: starry midnightnavy/deepblue, cyan/teal diamond, gold/white stars and calm interface zones. A black sprite preview is not approval to replace it. Do not edit background while correcting teeth.
- Coins: keep shiny existing circular paw-stamped face, thin darker physical edge and clear overlaps. Flat illustrated-coin concept was not selected. Do not harvest distorted coins from generated board mockups.
- Table/pusher/snacks remain existing assets. Pusher is a rigid plain pink mechanical shelf, separate from decorative tongue. No stretching/wagging/levitating.

Use image generation for raster illustration edits and preserve original/reference files. Use runtime screenshots for final geometry/animation review. FinTracker SVGs can be reused/adapted only within Jenny's requested scope; do not overwrite its master. Previous long prompt catalog is in documentation backups as historical material.
