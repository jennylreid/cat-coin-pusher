# UAT-18 Quake coin

Status: revised gold paw / blue ceramic Board 3 preview ready; awaiting Jenny’s review before UAT publication.

Baseline: published UAT 6, numeric 20261016235419 (`work/uat16-rework/release.html`). Preview: `work/uat18/draft.html`. No UAT publication performed.

## Changes
- Exactly one gold Quake coin with blue ceramic lightning, face ring and side band at Board 3’s reserved rear-centre position (x=200, depth=365). Quake is 8% wider and 30% thicker than an ordinary coin, including its collider; the ordinary coin geometry stays unchanged.
- Jenny expanded the art scope: regular paw coins now use the selected natural satin gold finish and raised paw design. Both faces come from a locally stored ImageGen atlas (`work/uat18/art/uat18-coin-faces.png`), loaded and cached once. Physical Quake side band is drawn around its thickness.
- Collecting it through the front tray awards one earned Quake. A normal-player button changes from “QUAKE · 0” to “USE QUAKE · 1”; tapping runs the existing CatQuake and shows zero left. It is optional for board clear. Restart resets this board-local charge and respawns the coin.
- Board definitions, budgets, timer, towers, targets and existing CatQuake implementation are unchanged. Developer tools retain their existing inventory and controls.

## Evidence and validation
- Current art: [400 × 889 Board 3 screenshot](gold-ceramic-board3.png) and [enlarged board detail](gold-ceramic-board3-detail.png), captured from the actual game renderer.
- Earlier cyan prototype: [start screenshot](board3-start.png).
- Earlier cyan prototype [collection and use clip](quake.mp4): normal pushes aimed at the moving Quake coin; collected at game second 50.43, button tapped at 52.45. One charge becomes zero and the real CatQuake moves the board. No injected reward or repositioned coin. Clip starts at game second 48.4, runs at actual speed, and is silent.
- Screenshot and clip use the actual renderer and Rapier in a desktop phone-sized harness with Developer mode off. They are not device evidence.
- Board 3 wins without powers at both tested cadences: 126/140 coins at 0.22-second taps (27.68 seconds), 125/140 at 0.4-second taps (49.98 seconds), with the revised Quake dimensions. Same target-following strategy as UAT-16; these establish viable strategies, not guaranteed wins.
- Empty-charge tapping, optional-target behavior, one-coin placement and reset checks pass. Collection/use trace: [capture.json](capture.json). Runners and detailed results are in `work/uat18`.

## Limits and pending decision
Jenny’s preview OK is required before publication. Phone receipt, usability, sound and FPS remain device UAT. Inventory is board-local, consistent with the current reset-based game; no cross-board power economy or save system was added.

## Coin design selection
Four renderer-based options requested by Jenny: A Electric cyan (current preview), B Violet storm, C Hot coral, D Midnight charge. [Comparison sheet](coin-options/four-quake-coins.png). Full-board images and face sprites are adjacent; generator: work/uat18/coin-options.cjs. Selection pending; gameplay draft and publication remain unchanged.

Jenny clarified that selection must vary physical texture, size, thickness and shape, rather than only face graphics. [Revised form/material concepts](coin-options/form-material-concepts.png), generated with built-in ImageGen: A hammered silver medallion, B faceted cyan crystal hexagon, C thick volcanic triangular stone, D scalloped ceramic arcade chip. Concept art only; pictured size labels are proposals, with illustrative scale references. No game geometry changed. Selection pending.

## Revised gold and ceramic direction
Jenny authorizes the ordinary gold paw coin to adopt the natural gold reference finish from the concept poster. Quake should remain a matching gold coin, modestly thicker and possibly wider, with a blue ceramic lightning-bolt inlay. Jenny also requests a ceramic outer band or another edge pattern; next preview uses a slim blue ceramic ring with a visible gold rim. Art preview pending, no gameplay/art replacement or publication yet.

Built-in ImageGen previews: [gold paw + blue ceramic bolt](coin-options/gold-ceramic-pair.png), followed by [ceramic ring and edge band](coin-options/gold-ceramic-banded-pair.png). Prompt direction: retain the poster's ordinary gold reference finish; raised gold cat paw on regular coin; modestly wider/thicker matching Quake coin with blue glazed ceramic lightning inlay; second pass adds ceramic annulus and matching side band framed in gold. Concepts only, awaiting review.

## Applied art preview
Jenny approved the gold/ceramic concept including the band, and requested a full Board 3 preview before UAT. The new shared gold paw texture and ceramic Quake are now in the draft; physical Quake radius is 28.08 (ordinary 26), half-thickness 2.6 (ordinary 2). The high-resolution atlas is sampled into small cached faces; new edge detail is limited to the single Quake coin. Preview runner: `work/uat18/art-preview.cjs`. Art prompt: top-down transparent atlas matching approved gold paw and gold/blue ceramic pair; raised paw, fine satin gold grain, polished rim, blue glazed lightning and blue annular inlay. Built-in ImageGen used. No publication.
