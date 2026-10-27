# CP-21 PUBLISHED — 20261026205627 / APK4 (2026.10.26 UAT 6 trial; UAT 5 20261026163104, UAT 4 20261026141443, UAT 3 20261026134357, UAT 2 20261026113204, UAT 1 20261026100613)

Layout lock. The locked numbers are in "Locked layout (CP-21)" below and supersede older board geometry. Source: work/cp21/release.html. Report: tickets/CP-21.md. Phone UAT pending.

# UAT-12 PUBLISHED — 20261015163000 / APK2

Current UAT: 20261015163000 / APK2 (UAT-12, October 15, 2026). Board 1 allowance is 220 coins; current matching source is work/uat12/release.html. This supersedes historical allowance and source notes below. Phone UAT pending.

UAT-10 rear widening is backed out as Jenny requested. Exact UAT-08 release 20261013164950 restored except version/build label. Wider table deferred to the art pass. Historical UAT-11 source: work/uat11/release.html. Phone appearance/play acceptance pending. Report: tickets/UAT-11.md. Earlier checkpoints below are historical.

# UAT-08 landing sparkle correction PUBLISHED — 20261013164950 / APK2

Jenny clarified visible sparkle/flash and approved publication. Exact shown correction shipped: dust cutoff follows ledge height when supported and table height otherwise; sound, timing physics, cat, poses, brass, layout and UAT-09 renderer/front edge retained.60 physics samples identical; existing board and Quake results apply. Phone120fps/receipt pending. Backup uat/backups/before-20261013164950; report tickets/UAT-08.md and release evidence tickets/UAT-08-landing-feedback-release.json. Production and both APK hashes unchanged. Current UAT source is published payload or work/uat08/landing-feedback/draft.html; external outputs/uat/game is older and must not overwrite it. Earlier checkpoints below historical.

# UAT-08 PUBLISHED — 20261013163120 / APK2

Jenny approved the phone-size motion and UAT publication on October13,2026. Exact approved timing draft shipped from pinned UAT20261012220659, only build label updated. Fixed landing line247 and continuous horizontal input; existing Rapier ledge ride/retraction transfer. Cat/poses/sparkle/brass/layout/UAT-09 renderer/front edge retained. No-power spends109/140 and140/140 versus86/113;117/160 and129/160 versus119/127. All won; Quake15/45 and12/51 unchanged. Phone120fps/receipt pending. Report/evidence tickets/UAT-08.md; backup uat/backups/before-20261013163120. All23 runtime files verified,22 non-HTML unchanged. Production20261013160516 and both APKs unchanged. Current UAT source is published payload or work/uat08/draft.html; external outputs/uat/game still holds prior UAT09 and must not overwrite this release. No USB/ADB. Earlier pending notes below superseded.

# UAT-09 PUBLISHED — 20261012220659 / APK2; Pixel FPS pending

Jenny approved preview/publication. Exact approved draft shipped: cached side matte/reusable coin layer, visual flight-state separation without physics mutations, crisp gold-white comet/no radial halos, open front centre rail and continuous real-tip payout position/rotation. Only HTML changed; all23 runtime files/14 art assets and APK2 retained. Approved source/package/decode/hash checks pass; power smoke Quake15/12 matches, spends86/113 and119/127 unchanged. Desktop92-body draw+flush final~67ms/pre05~69ms/published05~423ms; NOT phone FPS. Pixel120fps/full-board acceptance and phone sync/reload PENDING. Backup uat/backups/before-20261012220659; tickets/UAT-09.md filed before completion. Production20261012120202/APK14 unchanged. No ADB/USB. UAT-08 deferred. Earlier awaiting-OK notes superseded; this approval covered UAT-09 only.

# UAT-09 review ready — WAIT for Jenny's OK, before UAT-08

Published UAT remains20261012204534/APK2 and production20261012120202/APK14. Isolated draft: work/uat09/after.html; live23 files match published UAT-05, no version/package/update/APK changes. Causes: per-body586-segment clipping, per-particle radial gradients, lingering fresh flags causing settled-coin glitter, closed front rail/front clipping and mismatched payout projection. Proposed: reusable board layer/cached side matte, smaller cached inset polygon/open front, crisp bounded airborne comet glints without blur, visual flight-state separation (physics flags untouched), continuous tipping position/rotation into payout. Cat/brass look/incoming comet path/core physics and assets unchanged. Desktop92-body mean draw+flush pre05~69ms, published~423ms, final~67ms (84%lower); not Pixel FPS. Real phone120fps acceptance PENDING. Full-board before/after and real-edge tipping motion plus report/evidence filed tickets/UAT-09.md. Physics60samples/8s identical, spends86/113 and119/127, Quake15/12; side-matte audit0 escapes, draw flags untouched. Buffer/mask resize cache rebuilds on dimensions/density. No ADB/USB. Do not integrate/publish before explicit OK. UAT-08 deferred. Earlier release checkpoints historical; UAT-05 stays current published version.

# UAT-05 PUBLISHED — 20261012204534 / APK2

Jenny approved final B comet revision and publication. Brass pusher/contact slot, coins fitted/clipped inside rails, immediate foreground top-screen fall with drifting/twinkling gold-white trail; no aim line/target circle or carriage. Only HTML/new brass-pusher.png; all original assets/cat/poses/global layout/physics/sounds unchanged. Actual loader renders match3 approved phone frames exactly. Released regressions86/113 and119/127; Quake15/12. Final300-frame rapid-drop/Quake containment passes.23 runtime files/14 art assets. Backup uat/backups/before-20261012204534; report tickets/UAT-05.md, publication/decode/hash checks pass. Existing UAT APK2/appID/signing/save/settings/update keys retained; game-only OneDrive update, no reinstall. Production20261012120202/APK14 unchanged. Happy remains preview-only; UAT-04 cancelled. No ADB/USB; phone sync/reload/FPS unverified. Earlier pending UAT-05 checkpoints are historical and superseded.

# UAT-05 B comet revision — awaiting explicit OK

Target circle/dotted aim line removed entirely. Foreground coin fall now sheds bright gold/warm-white dust and scattered twinkling glints throughout its entire fall; interpolated emission180Hz/four grains, particles drift and fade220–350ms, stop emitting at landing. Prior static/tiny glitter preview superseded. Native1080×2404 phone motion/GIF/report filed in tickets/UAT-05.md. Immediate spawn/coin cost before any tick verified; brass pusher/board and exit clips/display plane/cat/layout/physics unchanged. Final300-frame rapid-drop/Quake audit zero overlap/unclipped calls, Rapier60-sample trajectories match baseline. Existing B spends86/113 and119/127, Quake15/12 unchanged by graphics. Live22 runtime files match UAT-07; UAT20261012184647/APK2 and production20261012120202/APK14 unchanged. WAIT for Jenny's OK before integrating/publishing. No build/publication/ADB/USB; phone particle FPS unmeasured. Older UAT-05 previews historical where superseded.

# UAT-05 B selected — foreground/glitter preview awaiting OK

Jenny picked B, then requested full top-of-screen fall in front of the head and a short fading warm gold/white dust tail instead of pale crosses. Revised isolated B preview and final audit/report filed in tickets/UAT-05.md; native1080×2404 frames, phone-aspect GIF540×1202. Foreground delivery drawn after head/HUD, deterministic48-grain tail fades120ms after landing; no gameplay random calls or drop delay. Brass pusher/board containment/projection/aim guide/drop wrapper identical to prior B. Original sky clip extended upward and to felt for continuous airborne fall. Revised300-frame rapid-drop/Quake containment passes, physics trajectories identical, spends86/113 and119/127, Quake15/12. Immediate spawn before any tick verified. Cat/functions/art/layout unchanged. WAIT for Jenny's explicit OK on revised B before integrating/publishing. Live22 runtime files still match UAT-07; UAT20261012184647/APK2 and production20261012120202/APK14 unchanged. No build/publication/ADB/USB. Earlier A/B-pick checkpoint superseded; A historical only.

# UAT-05 A/B review ready — awaiting Jenny's pick

Final saved drafts passed containment: 300 frames per variant with rapid drops every5 ticks and Quake, zero currency pixels outside audited regions, zero unclipped draws. A/B/baseline Rapier hashes identical at60 samples over6seconds. Board spends86/113 and119/127, Quake spills15/12, power checks unchanged. A=120ms cosmetic brass carriage (no release queue/delay); B=top fall with sparkles, visual offset only. Shared display fit/clipping keeps coins off rails; brass pusher rests on felt with original collider/stroke. Cat/poses/global layout/assets untouched. Report and phone-sized comparisons filed in tickets/UAT-05.md. WAIT for pick before integrating/publishing. All22 working runtime files still match published UAT-07 (BUILD stamp normalised). UAT stays20261012184647/APK2; production20261012120202/APK14 unchanged. No build, publication, ADB or USB. Earlier checkpoints historical where superseded.

# UAT-07 published — 20261012184647 / APK2

Approved Happy refinement active in manual six-second preview only. Other faces/poses and production unchanged. Backup uat/backups/before-20261012184647; report tickets/UAT-07.md. Earlier checkpoints historical where superseded.

# UAT-06 published — 20261012180042 / APK2

Approved corrected Waiting active; Sharp Grin retained separately. Production unchanged. Happy UAT-07 preview only, awaiting approval before any future publication. Backup uat/backups/before-20261012180042.

# UAT-03 checkpoint — October 12, 2026

UAT **20261012133717 / APK2** published. Full head/ears fit below the safe-area HUD; view fitting lowers table/head and keeps entire board above controls. Horizontal render scale capped0.98, vertical fitted to available space; physics/world geometry untouched. Waiting mitts grip outer rails (centers−35/435, inward0.25rad), with coins painted above idle paws. Approved Rest branch unchanged.

Head cleanup: shared pink248,136,155; exterior halo/haze removed, ghost muzzle strokes cleaned with local background sampling, Quake outer alpha stabilized to master silhouette. No expression/teeth redraw. Ten lossless WebP assets replace eleven PNGs, retaining dimensions and all non-head visible pixels. Exact duplicate unused head-open removed; originals archived. Art15,063,714→8,169,342 bytes (45.77% smaller). Sounds/Rapier/APK unchanged. Spends86/113 and119/127 and Quake spills15/12 match spec. Production remains20261012120202/APK14; hashes unchanged. Backup: uat/backups/before-20261012133717. Phone visual/performance review pending. Report/screenshots: tickets/UAT-03.md, written before completion report.

# UAT-02 checkpoint — October 12, 2026

UAT **20261012122558 / APK2** published. Rest-only cuff rendering clipped; original paw and Sweet images unchanged, claws remain extended. Rest mitts lower by45 game pixels and tilt inward0.12rad; existing recovery blends to this placement/clip without timing changes. Rest-only rail backing closes cyan chin/rail seam. Waiting, Quake impact, Sweep and Happy are unchanged. Power and board results match spec. Phone-sized comparison shown before publishing. Production remains20261012120202/APK14; hashes unchanged. Backup: uat/backups/before-20261012122558.

Required review report: tickets/UAT-02.md with screenshots beside it. For EVERY future ticket, write tickets/<ticket ID>.md and adjacent screenshots before telling Jenny the ticket is done. Claude reviews files there. Phone review pending.

# PROD-01 checkpoint — October 12, 2026

Jenny approved only UAT-01 safe-area handling based on Pixel screenshot Screenshot_20261012-115200.png (1080×2404, observed UAT120fps). Production **20261012120202**, APK **14**, published with same package com.jenny.catpusher and signing certificate. Production title/update messages remain Cat Coin Pusher; state keys and update file retained. WindowInsets cutout/corner bridge and HUD positions/hit targets copied only. Guides available only under Settings → Developer mode. No other UAT art/poses/physics/sounds or coin rail promoted.

Backup: backups/before-board-apk-20261012120202. All non-HTML files hash-identical to previous production. Pre-HUD gameplay/physics/pose/drawing code byte-identical; strategy spends86/113 and119/127 match spec, Quake spills15/12 match. Reconstructed screenshot tests show about50.6px extra top header above board, 0px extra board coverage; no-cutout fallback and dev-only guide controls pass. Actual production phone screenshot and installer confirmation pending. APK14 embedded in OneDrive JSON for existing automatic App update → Install flow. No ADB/USB debugging used. Published production hashes verified; UAT APK/JSON unchanged.

# UAT-01 checkpoint — October 12, 2026

UAT game **20261012113759**, APK **2**, published with prior signing certificate and com.jenny.catpusher.uat. Real WindowInsets cutout bounds/insets and rounded-corner geometry are passed to HTML; HUD positions and hit targets honor them. Background remains edge to edge. Page title and native game/app-update message names now say Cat Pusher UAT. make-uat-update.cjs reads apkVersion from build.gradle. New wrapper prioritizes App update.

Backup: uat/backups/before-20261012113759. Non-HTML game assets unchanged; no head/paw/board/physics/pose/sound changes. Production stays 20261011191602, APK13, hashes unchanged. Native build/signature/package/version and bundled ZIP/JSON checks pass, simulated HUD/fallback/hit targets and power/Rest regressions pass.

Ticket acceptance still pending: real Pixel WindowInsets, measured screen-size screenshot, extra HUD coverage measurement if any, and on-phone automatic Install prompt. Jenny authorized phone verification later. Simulated 1344×2992 /140px top fixture adds 0px board coverage; it is not a measured Pixel profile. Settings → Show/hide safe-area guides marks cutout red and corner geometry yellow for later screenshots. Original version-1 wrapper may retain old popup wording until version2 installation.

# CoinPusher current specification

Updated October12, 2026, after approved UAT-09 publication. This is the current specification; earlier notes and mockups are historical unless explicitly approved.

## Release channels

| Channel | Current game version | APK | Application ID | OneDrive update |
| --- | --- | --- | --- | --- |
| Production | 20261013160516 | 14 | com.jenny.catpusher | phone/CatCoinPusher-game.json |
| UAT | 20261013215900 | 2 | com.jenny.catpusher.uat | uat/CatCoinPusher-UAT-game.json |

Production has Paw Sweep, Catquake, power expressions and consistent ivory teeth, with testing behind Settings → Developer mode. Production does not yet contain tonight’s lowered Quake head, recovery perspective, Rest-on-clear, revised Happy or separate visual coin rail. These changes are UAT only. Do not promote UAT without Jenny’s explicit approval of the specific release. Keep package IDs, save/settings keys, update URIs and backups separate. Both APK byte sets remain unchanged for tonight’s game-only updates.

## Locked character and assets

Jenny owns design decisions. Continue the existing game; no rebuilding or unrelated geometry changes. The confirmed Sweet head is the master: wide angular black/white tuxedo silhouette, large widely spaced triangular pink ears, white forehead blaze/muzzle, pink nose/tongue, straight whiskers, golden eyes. Keep head outline, scale, markings, ears, nose and whiskers fixed across expressions. Pupils are separate upright tracking layers for open eyes. No body, shoulders, angry eyebrows or narrowing into an angry expression. Toothy expressions should read as goofy.

Keep the navy/cyan cosmic background, shiny coin art, teal/gold table, cheese/shrimp assets and existing board proportions. Production keeps its rigid pink pusher; approved UAT-05 renders the same physical pusher in brass/gold, flush on the felt from a rear slot. Generated mockups show intent; their altered geometry is not authoritative. Never overwrite original/reference art to make expressions.

## Approved faces and work in progress

| Face | Status | Definition |
| --- | --- | --- |
| Sweet (master) | Approved artwork | Small smile and tongue out; confirmed master head. |
| Sharp Grin (formerly Goofy Grin) | Approved artwork; future use TBD | Original sharp-toothed grin preserved; no longer intended for Waiting. Preserved as head.webp and ART.headSharp; new approved Waiting is active in UAT-06. |
| Waiting (UAT-06) | Approved; active in UAT | Corrected chunky four-fang face; crisp normal-weight outlines and contained roots. head-waiting.webp; original Sharp Grin retained separately as head.webp/headSharp. |
| Quake | Approved artwork | Extra-toothy goofy expression for Catquake. |
| Shower (formerly Spray) | Approved artwork; not implemented | Even longer overlapping upper/lower teeth sticking out at silly angles. Original saved filename is spray-v1.png. |
| Happy (UAT-07) | Approved; UAT manual preview only, usage TBD | Closed golden eyes retained. Clawless Rest-derived mitts lower on back edge; Sweet mouth/tongue with slightly lower bottom lip. Six-second Settings preview; not automatic board clear. |

Softer upper smile-edge studies remain work in progress and do not replace approved Grin/Quake artwork. Intended refinement is a shallow rounded transition beneath the nose, relaxed corners, goofy rather than angry. No approval is inferred from saving a mockup or testing it in UAT.

## Pose names and behavior (latest UAT)

UAT-07 Happy refinement is approved and published. It remains a manual six-second preview; board clear stays Rest.

- **Waiting:** approved side mitt placement during ordinary play. Published UAT-03 still uses Sharp Grin; UAT-06 uses the approved Waiting face with chunky crisp fangs and contained roots. Sharp Grin remains approved for a future use TBD. Adding a coin rail must not redesign the head, paws or table.
- **Quake impact:** existing full-size impact mitt shape, scale and table reach preserved. Whole head additionally lowers up to 48 game units over the upper board, without enlarging or adding a body. Growl precedes paw slam at 0.73 seconds; slam triggers impact/rattle, visual shake and existing physical impulses.
- **Recovery:** the action returning from Quake to Rest, not a pose name. After impact, the same mitts retreat beside the head and shrink smoothly to 65% of impact size to suggest depth. Head rises back. UAT Quake sequence lasts 3.6 seconds, including recovery.
- **Rest:** Sweet face with the same mitts raised beside the head at the reduced size. Endpoint after powers and board-clear pose. A new ordinary drop/reset returns to Waiting.
- **Happy:** approved closed golden eyes, Sweet-derived mouth/tongue with bottom lip lowered slightly, and clawless Rest-derived mitts on the back edge. Usage TBD. Settings → Preview Happy lasts six seconds; it is not the automatic board-clear pose.

## Locked paws

Existing option-4 gameplay mitts are authoritative: huge rounded white palms, short black cuffs, four long angular ivory claws. Preserve sprite shape and proportions. Waiting placement is finalized; Quake impact and Paw Sweep retain their existing full size and paths. Recovery perspective scaling is explicitly authorized. Rest uses the same gameplay sprite; do not replace it with generated paws. Happy’s rounded cheek-side paws are a separate design and do not replace gameplay mitts. Idle coins render over side paws; active mitts render over the board. Avoid duplicate paws when changing poses.

## Locked layout (CP-21, Jenny, Oct 26, 2026)

Layout first, art second: new art fills this layout and does not change it. Template screenshots (1080x2400 phone): [Board 1](tickets/CP-21-evidence/CP-21-template-board1-phone-res.png), [Board 3](tickets/CP-21-evidence/CP-21-template-board3-phone-res.png). Game units are the 400-wide game canvas; the source is work/cp21/release.html, built by `work/cp21/integrate.py` (argument list in tickets/CP-21.md).

- **Layers:** the background is fixed to the screen (cover-fit; never moves or scales with the scene). The cat, mitts, ledge, table and coins form the scene, placed by the view. Table dimensions are locked; the table's look may change per cat. Cat head and paw sizes are locked.
- **Canvas and view:** 400 game units wide. The cat's ear tips sit just under the HUD (HUD bottom + 8 px); the scene is anchored at the top, so any spare height is below the table, above the buttons.
- **Camera:** flatter, lower camera. CAM_K 0.25 (how much the table narrows toward the back), CAM_TILT 0.75 (UAT 2; UAT 1 was 0.65, Jenny found the coins too slanted; UAT 3's view was steeper). Row size on screen is that of the 640-deep table: a longer table adds rows further down, never squeezes them.
- **Drop:** a tapped coin's physical fall starts from the screen top the view had before the lock (tilt 0.65, table width 330), whatever the layout. A lower, slower start let about 1 in 10 coins pass through the moving ledge (UAT 1 bug).
- **Table:** T = {L 30, R 370, BACK 190, FRONT 760}. Front edge drawn at TABLE_W 350 (UAT 2; 392 = full screen width in UAT 1). Narrow back: 110 either side of centre up to depth 225, widening to full width at 315, giving rows of 4, 4, 5, 6 coins, then full width. No wood rails. Fallback on file: FRONT 720 (one row fewer), `work/cp21/layout-7rows-fallback.html`.
- **Start:** ordered single layer of straight rows from just in front of the pulled-back pusher to 70 units (START_CLEAR) from the front edge: 9 rows, 8 showing with the pusher forward; 51 coins on the table at the start on every board. No towers on any board (Board 3's towers dropped; tower topple physics kept). Prizes and Board 3's Quake coin rest on top of the rows; their depths moved 120 units forward with the longer table.
- **Cat:** head drawn at HEAD_Z 0.94 of the screen fit, chin on the table's back edge (CHIN_Y 215). Head art unchanged.
- **Mitts:** "tucked" pose for Waiting: mitts behind the cheeks, claws hooked 30 units over the inner front corner of each armrest (MITT_HOOK 30, MITT_D 228, MITT_LIFT 30, MITT_W 182), no cuffs or black arms showing. Teal/brass armrests either side of the narrow back (ARM_H 70, ARM_FRONT 240). "Reaching" (mitts out at the corners with arms) is kept as a second pose for later use.
- **Coins:** approved big-paw face, colour C: contrast 1.3 / saturation 0.9, a lighter, softer gold (UAT 2; UAT 1 was 1.6 / 1.25, too yellow); drawn twice as thick as the physics (COIN_LOOK 2); dark gold sides, bright faces. COIN_R 26 (physics unchanged).
- **Quake coin:** 20% wider than a paw coin (QUAKE_R 1.2, physics too), same thickness as paw coins, dark gold side with a blue band matching the face's dark blue.
- **Coins always whole (UAT 3):** coins are only hidden when they slide under the back wall (in front of the ledge's slot everything shows), fall off an edge, or are behind art. The old picture's felt outline no longer masks them.
- **Side gutters (UAT 3–4, Jenny):** the side wall stays up from where the table reaches full width along the first two full-width rows (depth 315 to 431, UAT 4: the first push used to shove their outer coins far over the edges); from there to the front coins can slide over the left and right edges. The funnel walls beside the ledge stay. A low invisible lip, one coin thick, runs 0.9 coin radius outside each edge, so a coin hangs most of its width over the edge, while coins riding on others can tip off. A coin or prize dropping off a side is lost and doesn't pay. Pure physics without the lip lost over half the coins (0/18 wins). A later tree mode (like Bear Coin) may block the gutters.
- **Rescue:** a coin squeezed down through the table well inside its edges (about 1 in 1,000 taps) is put back on top of the table instead of vanishing.
- **Balance (desktop, Oct 26, UAT 4):** 18/18 no-power wins over 3 boards, 3 seeds, 0.22/0.4 s taps. Coins used: Board 1 72–119 of 220, Board 2 74–130 of 160, Board 3 106–149 of 160 (tightest). 1 of 1,879 coins and no prizes went off the sides (UAT 3: 13 of 1,988) (tickets/CP-21-evidence/wins-uat4.log).
- **Table front (UAT 5):** the front-edge trim (dark line plus thin gold line) is drawn at the real front edge (760). The felt below the old painted front is filled by mirroring the last 50 painted felt rows, so there is no seam or streaking on an empty board. Drawing only.
- **Pusher (UAT 6 trial, Jenny):** pusher moved back toward the cat by its stroke: PUSH_MIN 135, PUSH_MAX 205 (was 205/275), LEDGE_BACK 135; start rows unchanged (first row at 233). The opening board stays still until dropped coins reach the rows. Trial only: desktop balance got harder (15/18 wins, Board 3 lost 3 of 6; tickets/CP-21-evidence/wins-pusher-back-test.log). Keep, adjust or revert after Jenny's phone look; UAT 5 values are the fallback.
- **Next (art pass, not layout):** rounder cat head or chin fluff to fill the gap between chin and ledge; ledge look; Jenny prefers the Rest face to the Waiting face, so Waiting will change later.

## Coin entry and input

Exactly one immediate coin per ordinary tap. No hold-repeat, no aiming ring. Horizontal aim still chooses among eight existing release lanes, with vertical falls and no visual homing. Production still displays mouth drips. Latest UAT-05 removes the gold feed band, target circle and dotted aim line. Coins fall visibly from the screen top in front of the head/HUD, shedding bright drifting/twinkling gold-white particles throughout the fall; UAT-09 uses crisp grains without radial halos, fading190–290ms and stopping on landing. A cached side matte keeps board currency inside side rails while the front centre is open; visible tipping payout continues from the physical body’s fitted position/rotation. The brass pusher rests on the felt from a rear slot. Underlying release positions, tilt and drop physics remain unchanged to preserve board balance; legacy mouth-exit names remain in code as registration data.

**Shower** is the proposed separate press-and-hold coin-stream power, previously discussed as Coin Shower/Spray. Do not dispense coins from the cat’s mouth. Artwork is approved, but earning, inventory, activation, duration, rate and coin cost remain undefined. No active Shower power is implemented. Ordinary input remains single-tap regardless.

## Shared game rules

Two seeded boards: Board 1 has 220 coins/90 seconds; Board 2 has 160 coins/110 seconds. Cheese and shrimp must fall to clear. First ordinary tap starts timer. Coin falls do not refill allowance. Both targets clear the board; Board 1 offers NEXT BOARD, Board 2 ends the two-board session. Replay resets selected board. Time expiry or exhaustion after settling can lose; loss reason remains visible. No ads are required to win.

Coins use real Rapier physics, with pile grip and separate bodies able to slide/stack/topple; decorative towers break into coins when disturbed. Preserve rigid solid pusher/contact/alignment. Collection messages run sequentially before clear feedback and its existing favorite sound. UAT waits for active power animations before clear celebration. Rest is the board-clear pose; Happy is not.

## Board recipes

| Board | Seed | Coins | Seconds | Targets (x, depth) | Towers (x, depth, count) |
|---|---:|---:|---:|---|---|
| snack-shelf | 42 | 220 | 90 | Cheese(140,490); shrimp(260,570) | (200,420,10) |
| twin-towers | 137 | 160 | 110 | Cheese(260,510); shrimp(132,580) | (115,465,8); (285,390,12) |

Boards begin with a thin packed coin shelf plus these decorative structures and targets. No target may be made permanently uncollectable by an offscreen loss/gutter. Settling can end an exhausted round before the timer expires. Ordinary coin falls are spectacle, not allowance refill or cash redemption.


## Powers and test controls

Paw Sweep uses Sweet and the original enormous inward overlapping mitt sweep. Rumble remains; roar belongs to Quake. UAT first target grants a sweep and ready-screen preview is available. UAT gives one Catquake test charge per board. Production exposes test grants only with Developer mode on; disabling clears unused charges and blocks power use. These are testing provisions, not a finalized economy.

Powers cannot overlap, cost no ordinary drop coins and block new drops while active. Restart clears motion, charges/test state and Happy preview. Quake moves real coins through impulses/collisions, never deleting a fixed percentage. Targets receive weaker direct impulse but may still fall. Fresh-board regression outcomes remain 15/45 coins on Board 1 and 12/51 on Board 2; layout and timing vary.

Effects only; background music remains off. No announcer or unrequested speech/TTS. Keep board-clear sound and growl. Phone review is required for perceived timing, loudness, clipping and performance.

## Source, packaging and publication

Workspace: C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an. Production source outputs/board-prototype; UAT source outputs/uat/game. Scripts/native projects under work. OneDrive root index.html and old publishing scripts are legacy and not current source.

Game-only UAT: package-uat.ps1 → make-uat-update.cjs → verify assets/channel/version/tests → deploy-uat.ps1. Production: package-apk.ps1 → make-update.cjs → verify-apk.py → deploy-apk.ps1 -GameOnly. Version must strictly increase. No APK reinstall for game-only updates. Native changes require matching package identity, incremented APK version and retained signing certificate. Never share signing keystores.

Back up before publication. Production backups are in backups; UAT backups in uat/backups. Latest UAT backup: uat/backups/before-20261012113759. Rollback needs a saved game republished with a higher version. Never overwrite historical backups. Promotion must package production keys/identity and include all runtime assets; do not copy UAT APK/JSON wholesale.

## Verification and remaining review

Final tests covered original full impact size, retreat scaling, Rest endpoint, Rest-on-clear, Happy preview-only/timing, reset, power exclusion/no coin cost, growl-before-slam and real spill outcomes. Runtime PNG frames were visually inspected. Asset/JSON round trip and channel/identity verified; original head/paw PNGs and UAT APK unchanged. Deployment verified production APK/JSON hashes unchanged.

No-power Board 1 bots on UAT-12 spend 109/220 at 0.4-second cadence and 156/220 at 0.22, leaving 111 and 64 coins; clear times 43.57 and 34.17 seconds. See tickets/UAT-12.md.

Current runtime previews: UAT-rest-preview.png (legacy filename, now Waiting), UAT-quake-impact-preview.png, UAT-recovery-preview.png, UAT-board-clear-preview.png (Rest), UAT-happy-preview.png. Existing GIFs are historical; they were not refreshed tonight. Desktop checks do not establish phone installation/provider behavior, sound quality, FPS or store readiness.

## Next steps and remaining requirements

1. Jenny reviews the latest UAT Waiting/Quake/Recovery/Rest/Happy poses, rail, readability, sound and motion on the phone. Refine only requested details; any promotion to production requires explicit approval of a specific release.
2. Define how powers are earned, inventory limits, target-item impact, and per-board balance. Test poor-aim/no-input/exhaustion strategies as well as a successful bot so boards can meaningfully lose. Remove free UAT testing grants before any finalized economy.
3. Expand clearable seeded board recipes with decorative coin towers, prominent fewer special targets, fixed allowance/time, difficulty progression and campaign completion. Keep every board beatable without ads with measured slack.
4. Design special-coin reactions. Candidate ideas: rainbow visual chain, lightning awards a Catquake charge, clover gives a small lucky nudge, thicker colored chips change physical weight, clown produces a comic reaction, do-over retries a recent drop with explicitly designed state rules, magnet bunches nearby coins, ice briefly reduces surface grip, golden paw awards Paw Sweep, and Coin Shower grants a temporary hold stream. These are proposals, not active implemented drops.
5. Add further targets (mouse, crown and others), appropriate art and distinctive action feedback. The current prize renderer/snack atlas is only cheese and shrimp; expand it before introducing new IDs.
6. Session/retention design should be rewarding with an explicit stopping point, optional return goals and no pressure to stay indefinitely. The two-board ending is the current endpoint; wider campaign, cosmetics/sets and daily goals are future work.
7. Optional rewarded ads for extra coins are future work, never required for a board to clear. Final monetization/platform compliance, store/API rules, licensing, privacy and release signing must be reviewed when planning distribution; do not rely on old archived policy claims.
8. Background music remains off unless Jenny chooses to revisit it. No announcer/voice production is currently requested. Refine effects from phone feedback, especially power roar/impact and coin push/collection.

Do not rebuild from scratch. Current direction is reworking the existing game and preserving approved art/geometry/physics unless the requested change requires adjustment.
