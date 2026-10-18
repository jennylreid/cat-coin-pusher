# CoinPusher: current brief
Updated October 17, 2026. Read this and the assigned ticket; AGENTS.md carries session rules.

## Current releases (recorded in ticket reports)
- UAT: **2026.10.17 UAT 3 / APK4**, numeric 20261017204741: UAT-18 smaller paws, scattered Board 3 prizes, Quake moved to front centre for collection before board clear. Jenny approved publication; backup and fresh OneDrive cloud hash verified. Phone UAT pending. See tickets/UAT-18.md.
- Production: **2026.10.16 / APK16** (numeric 20261016005411), PROD-04 startup hotfix. APK15 failed phone launch because executable classes were missing; fresh APK16 build verifies all DEX classes and cloud hash. Jenny accepted the repaired production release on October 16, 2026; PROD-04 complete. See tickets/PROD-04.md.
- Jenny explicitly signed off everything in UAT 20261015195300 for PROD-03: UAT-08 including rework/continuous-fall, UAT-11 rollback, UAT-12 allowance and UAT-13 messages.
- PROD-04 direct production publication is authorized and fulfilled; any subsequent promotion needs new sign-off. UAT-04 is cancelled; discarded drafts must not ship.

## Baseline and source traps
- For new UAT work, start from latest published UAT payload; matching HTML is work/uat18/release.html. Current coin textures: work/uat18/art/uat18-coin-faces.png and uat18-small-paw.png (older soft texture retained in payload). Native source: work/ops02/android. The external outputs/uat/game directory is older and must not overwrite this release.
- External workspace: C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an. Legacy production staging is outputs/board-prototype; Current PROD-04 production source/payload/native project are shared work/prod04 (current hotfix16/release.html and JSON/APK; android/ native source). Native projects/packaging scripts are under external work. Pin the appropriate published payload before editing or promoting.
- Root index.html and old root build/publish scripts are legacy; do not assume they publish the current source.

## Current design and next work
- UAT-18 latest revision published: smaller paw emblems, scattered Board 3 prizes, front-centre Quake. All six tested strategies/cadences collect Quake before any prize; target-following no-power wins use all 140 coins, one rapid centre-only run misses cheese. Staggered towers A, soft relief and clear gold edges retained. Phone UAT pending. Source work/uat18/release.html; see tickets/UAT-18.md.
- UAT-16 tower rework published: `work/uat16-rework/release.html`; 48/36-coin towers, approved Tuna retained, 140 coins / 110 seconds. Phone UAT pending. No-power runs use 126/140 at 0.4-second taps and 140/140 at 0.22-second taps; the fast run wins on its last coin. Evidence and limits in `tickets/UAT-16.md`.
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



