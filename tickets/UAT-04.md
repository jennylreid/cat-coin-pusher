# UAT-04 — CANCELLED

Jenny cancelled UAT-04. Do not publish or pursue the Poised pose. Nothing from UAT-04 was published. Working game files were restored directly from published UAT-03 game20261012133717: all19 runtime files byte-identical, including HTML. Unpublished HTML archived under work/uat04-cancelled. Existing screenshots are retained only as cancelled design history.

---

# UAT-04 — Poised to pounce when a Quake is ready

**Status: Prepared and tested, awaiting Jenny’s OK. NOT published.**

Current installed UAT remains **20261012133717 / APK2**. Production remains **20261012120202 / APK14**. Both channels’ APK and JSON hashes are unchanged. No game version has been bumped or update packaged for this ticket.

## Proposal

- No available Catquake: the approved UAT-03 Waiting mitts beside/gripping the board rails.
- Catquake available: the same 280px mitts rise 65 game pixels, move 15 pixels inward per side and turn farther inward (−0.50 radians versus Waiting’s −0.25). This is a playful lifted anticipation pose, with existing face/teeth/paw art unchanged.
- Availability follows the existing charge and usable board state: ready, playing or settling with quakes > 0. Active powers, board end states and Sweet/Rest take precedence. A Sweet Rest after a power stays Rest until an ordinary drop returns to the normal playing face; this preserves the approved Rest behavior.
- Poised paws use the same idle render layer as Waiting, below coins/targets and the head. They cannot paint over the coins the player needs to see. Quake’s active covering behavior is unchanged.

## Transition details for approval

- Idle changes between Waiting, Poised and Rest use a 0.38-second smoothstep. The first frame starts with a small movement and zero endpoint velocity, not an immediate position/size jump.
- Pressing Quake captures the current displayed paw state and visually joins it to the existing wind-up over the first **0.18 seconds**. This connection is the only adjustment to Quake entry rendering; the existing path is unchanged thereafter. The impact frame, 0.73-second slam, recovery, total 3.6-second timing, sounds and impulses are unchanged.
- Quake’s recovery reaches the exact existing Rest endpoint, without snapping back to the saved Poised pose.
- No charge economy, input blocking, coin costs, timers, world geometry or physics are changed.

## Phone-sized comparison

![Waiting versus Poised](UAT-04-waiting-vs-poised.png)

- [Waiting: no Quake](UAT-04-waiting.png)
- [Poised: Quake ready](UAT-04-poised.png)

Each phone panel is a 1080×2404 real runtime render with the same board/coin state and UAT-03 layout, using the screenshot-derived safe-area profile. They are desktop renders, not new Pixel captures. Fonts/emoji/FPS labels are desktop artifacts; no font or emoji code changes are included.

## Verification

- Settled Waiting, Quake impact and Rest before/after renders are pixel-identical to UAT-03.
- Poised uses the same sprite/size, rises exactly 65px and moves inward 15px; charge disappearance restores Waiting.
- The first idle transition step is less than 1 game pixel vertically. The Quake entry blend starts under 3% of its join, preventing a start-position jump. Rest-to-play transition starts without a paw-size pop.
- Readiness predicate, eased transitions, Quake handoff, Rest endpoint and reset tests pass.
- Power exclusion/no coin cost/growl-before-impact/reset tests pass. Quake spills remain 15/45 and 12/51.
- Board1 spends 86/140 at 0.4-second cadence and 113/140 at 0.22. Board2 spends 119/160 and 127/160. All win; these match SPEC.md.
- All published non-HTML asset files match the working source byte-for-byte. Faces, teeth, paw art, layout and sounds are unchanged.
- Published UAT and production APK/JSON hashes were verified unchanged. No ADB/USB debugging used.

## Files and next step

Working source: outputs/uat/game/index.html. Baseline: work/uat04-baseline/index.html. Tests: outputs/uat/game/tests/uat04-regression.cjs, two-powers-regression.cjs and two-board-validation.cjs. Renderer: work/uat04-render.cjs, in the existing game workspace.

Await Jenny’s explicit OK on the poised appearance and transition before running packaging/deployment. After approval, publish a game-only UAT update with a fresh version and backup, keep APK2, verify production unchanged, and update this report with the actual release/backup. Claude reviews this file and adjacent screenshots in tickets.
