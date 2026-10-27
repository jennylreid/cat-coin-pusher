# CoinPusher: current brief
Updated October 27, 2026. Read this and the assigned ticket; AGENTS.md carries session rules.

## Current releases (recorded in ticket reports)
- UAT: **2026.10.27 UAT 8 / APK4**, numeric 20261027113731 (solid coins: physics as thick as drawn, so dropped coins push instead of sinking through; boards easier, allowances may need tuning; UAT 7 20261026211828: pusher starts at the chin and pushes down with no gap above it; opening rows just past its reach so they stay still until coins are dropped; 9 rows; UAT 6 20261026205627 was a superseded pusher trial, UAT 5 20261026163104 the seam fix): CP-21 layout lock with ledge fall-through fix, coin colour C, camera tilt 0.75 (UAT 2), plus coins always whole, open side gutters with a low lip, and a rescue for coins squeezed through the table (locked numbers in SPEC.md, "Locked layout (CP-21)"). Source work/cp21/release.html (earlier sources in work/cp21/uat1/, uat2/, uat3/, uat4/, uat5/, uat6/, uat7/; UAT 7–8 are hand-patched from UAT 5 (review12.html, then t-thick2.html), not yet folded into integrate.py); backup and fresh OneDrive cloud hash verified; GitHub 84d9515. Jenny is happy with the proportions (UAT 4); Jenny signed off UAT 8 on Oct 27. See tickets/CP-21.md. Promoted with UAT-16 to 19 to production 2026.10.27 on Jenny's sign-off.
- Previous UAT: 2026.10.17 UAT 3 / APK4, numeric 20261017204741 (UAT-18), now the CP-21 baseline.
- Production: **2026.10.27 / APK16** (numeric 20261027120233), signed-off CP-21 UAT 8 batch with UAT-16, UAT-17, UAT-18 and UAT-19. Game-only promotion; 18/18 board results identical to UAT 8. Source/payload: `work/cp21/promotion`; native baseline: `work/prod04/android`. Verified backup and fresh production cloud SHA-256 match. Phone production receipt pending. See tickets/CP-21.md.
- Jenny explicitly signed off everything in UAT 20261015195300 for PROD-03: UAT-08 including rework/continuous-fall, UAT-11 rollback, UAT-12 allowance and UAT-13 messages.
- CP-21 UAT 8 batch promotion explicitly signed off by Jenny Oct 27 and published; future changes need new sign-off. UAT-04 is cancelled; discarded drafts must not ship.

## Baseline and source traps
- For new UAT work, start from latest published UAT payload; matching HTML is work/cp21/release.html (UAT 3's was work/uat18/release.html). Visual tickets: read SPEC.md "Locked layout (CP-21)" first. Current coin textures: work/uat18/art/uat18-coin-faces.png and uat18-small-paw.png (older soft texture retained in payload). Native source: work/ops02/android. The external outputs/uat/game directory is older and must not overwrite this release.
- External workspace: C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an. Legacy production staging is outputs/board-prototype; Current production source/payload are shared `work/cp21/promotion`; APK16 native source remains `work/prod04/android`. Previous production is retained in `work/prod04/hotfix16`. Native projects/packaging scripts are under external work. Pin the appropriate published payload before editing or promoting.
- Root index.html and old root build/publish scripts are legacy; do not assume they publish the current source.

## Current design and next work
- UAT-18 latest revision published: smaller paw emblems, scattered Board 3 prizes, front-centre Quake. All six tested strategies/cadences collect Quake before any prize; target-following no-power wins use all 140 coins, one rapid centre-only run misses cheese. Staggered towers A, soft relief and clear gold edges retained. Signed off Oct 27 as part of the CP-21 UAT 8 batch. Historical source work/uat18/release.html; see tickets/UAT-18.md.
- UAT-16 tower rework published: `work/uat16-rework/release.html`; 48/36-coin towers, approved Tuna retained, 140 coins / 110 seconds. Signed off Oct 27 in the CP-21 UAT 8 batch; towers superseded by straight rows. Historical no-power runs use 126/140 at 0.4-second taps and 140/140 at 0.22-second taps; the fast run wins on its last coin. Evidence and limits in `tickets/UAT-16.md`.
- UAT-17 is now “Dancing pose”; its trigger and Developer-mode Settings preview move in UAT-19.
- UAT-15 phone UAT passed: automatic offer after actual phone reboot, accept/decline without repeat loops, manual Settings discovery, Developer-only ↻ and sound-setting continuity confirmed. One in-place APK3 installation completed. Review baseline resets boards and has no active progress-save hook; actual uninstall/reinstall was not tested. Preserve the OneDrive item/sharing link and verify fresh cloud bytes on future UAT publications. Separate promotion authorization required.
- UAT-13 complete: Jenny signed off message placement, face clearance and readability (“approved/passed”). No separate numeric device FPS measurement supplied.
- UAT-08 continuous-fall is signed off for PROD-03. Initial falls clear the rail; natural backward travel/contact after landing is allowed.
- SPEC.md is the design reference; the assigned ticket and Jenny's latest decisions take precedence.
- Waiting and Sharp Grin are retained separately. Rest is used on clear; Recovery is a transition. Happy stays a six-second Settings preview, usage TBD. Shower and the final power economy are unimplemented.
- Implement only the assigned ticket. Future campaign, special coins, economy, ads and audio ideas are proposals, not authorization.

## Read only when needed
- tickets/<ID>.md and adjacent evidence: change details, approvals and results.
- SPEC.md / DEVELOPER.md: relevant design or engineering details.
- CODEX_BRIEF_ARCHIVE-2026-10-13.md: complete pre-OPS-01 brief, preserved verbatim; old checkpoints and build instructions are historical, not current approval.
- SESSION_HANDOFF.md: legacy duplicated checkpoint log; not routine startup reading.



