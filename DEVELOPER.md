## UAT-18 — October 17, 2026

Current published UAT: **2026.10.17 UAT 3 / APK4** (20261017204741); matching source `work/uat18/release.html`. Jenny approved smaller paw artwork, scattered Board 3 prizes and front-centre Quake placement. Game-only update adds `img/art/uat18-small-paw.png`; existing assets and APK4 retained. Verified backup: `uat/backups/before-UAT-18-accessible-20261017204741`. Fresh OneDrive download matches staged SHA-256; original shared item retained. Phone UAT pending. Both target-following no-power wins use all 140 coins. See tickets/UAT-18.md.

## Historical UAT-16 tower rework

Previous UAT: **2026.10.16 UAT 6 / APK4** (20261016235419); matching source work/uat16-rework/release.html. Preview publication approved by Jenny; fresh OneDrive bytes verified and existing shared item preserved. Verified backup: uat/backups/before-UAT-16-rework-20261016235419. Tuna, budget 140 and timer 110 retained. Phone UAT pending. See tickets/UAT-16.md for tighter balance margins and evidence. Earlier UAT 5 sign-off/report: tickets/UAT-16-evidence/uat5-report.md.

## Historical UAT-16 release checkpoint

## UAT-16 — October 16, 2026

Current UAT game: **2026.10.16 UAT 5 / APK4**, numeric 20261016203354. Board 3 coin stacks and rounded-3D Tuna. Source: work/uat16/release.html; new packaged asset img/art/tuna.png is staged at work/uat16/art/tuna.png. Native source remains work/ops02/android. Existing shared OneDrive item retained and fresh cloud hash verified. Jenny approved Board 3 on phone (“found it and it looks good. approved”); UAT-16 complete. Numeric device FPS was not supplied. Production promotion remains separate. See tickets/UAT-16.md.

## UAT-17 — October 16, 2026

Current UAT game: **2026.10.16 UAT 1 / APK4**, numeric 20261016020438. Game-only resting-paw dance/drums; source work/uat17/draft.html, staging and publication evidence alongside it. Native source remains work/ops02/android. Phone UAT pending. See tickets/UAT-17.md.

## PROD-04 startup hotfix — October 16, 2026

Current production **2026.10.16 / APK16**. APK15 failed phone launch; DEX inspection confirmed missing app classes. APK16 rebuilt with fresh outputs, cache disabled and all tasks rerun. All DEX startup/bridge/updater classes, identity/signing, bundled files and cloud bytes verified. Jenny accepted the repaired production release on October 16, 2026; PROD-04 complete. Current payload: work/prod04/hotfix16; native source: work/prod04/android. Earlier APK15 claims below are historical. Future APK checks must assert manifest startup Activity and supporting classes across all DEX files; compile/lint alone missed this defect.

# Ticket completion reporting

For every ticket, write OneDrive/work/CoinPusher/tickets/<ticket ID>.md with screenshots next to it before reporting completion. Include scope, versions, changes, verification, backup and remaining phone checks. Claude reviews those files.

# Current release and source checkpoint — October 15, 2026

Production **2026.10.15.2 / APK15**, numeric 20261015232124, is PROD-04's authorized promotion of current signed-off UAT 2026.10.15 UAT 1 / APK4. Direct production cloud bytes verified; one in-place APK installation pending. See tickets/PROD-04.md and adjacent evidence.

Current published payloads are authoritative: phone/CatCoinPusher-game.json and uat/CatCoinPusher-UAT-game.json. Current production source, native project, staged artifacts and checks are under shared work/prod04; UAT source is work/ops02/draft.html; UAT native source is work/ops02/android. Production preserves identity/signing, storage keys and Developer gates; APK15 uses production-only direct HTTPS and explicit channel/applicationId validation; do not overwrite it from external outputs/board-prototype or external outputs/uat/game. Old packaging scripts and promotion pins below are historical and must not publish these releases. Pin published payloads before future edits.

UAT-15: **20261015214424 / APK3**, phone UAT passed (Jenny: “yes, all good”); PM review pending. APK3 bundles 20261015210806; one in-place APK installation is required, without uninstalling. Startup and Settings check the same existing UAT OneDrive JSON over HTTPS, with ETag validation and one persisted offer per release. The Android document URI remains stored. A manual check can retry a declined release. ↻ is Developer-only. See tickets/UAT-15.md for evidence and remaining device checks.

UAT publication must preserve the existing cloud item and sharing link: use exclusive in-place writes, not delete/recreate or rename-over replacement, then verify the served JSON hash after sync. Game-only updates retain APK3; native changes need a higher signed APK with the same signing certificate. The URL is configured in the native assets; do not copy the UAT link into another channel. Native builds support UAT15_BUILD_DIR for outputs outside OneDrive; keep signing keys outside the shared project.

OPS-02 current UAT: **2026.10.15 UAT 1 / APK4**; preview and publication approved, phone UAT pending. Human-facing names use JSON `displayName`, canvas BUILD and APK versionName consistently. Hidden numeric `version` still controls order and strictly increases. Naming/staging tools: work/ops02. Future UAT releases increment the sequence per date; production names are YYYY.MM.DD then YYYY.MM.DD.2, .3. Allocate name and numeric ID together; game-only updates retain APK4. For native releases, bundle matching HTML and numeric version. See tickets/OPS-02.md.

## Historical engineering reference (superseded release/source claims below)

# Current specification checkpoint

The authoritative current design is [SPEC.md](SPEC.md), refreshed after UAT **20261011205433**. Production remains **20261011191602**. Waiting/Rest/Recovery naming, Rest-on-clear, Happy preview-only, retreat perspective and Shower status supersede older descriptions below. Historical notes below do not grant new approval.

# Developer guide

Updated October 11, 2026. Production: **20261011164847 (4:48 PM)**, main APK **13**. UAT: **20261011182423 (6:24 PM)**, UAT APK **1**. These are separate channels. The two-power test and consistent tooth colors are UAT-only; they have not been approved for production.

## Files and channels

| Channel | App | OneDrive update | APK |
|---|---|---|---|
| Production | Cat Coin Pusher; com.jenny.catpusher | work/CoinPusher/phone/CatCoinPusher-game.json | work/CoinPusher/CatCoinPusher.apk; version 13 |
| UAT | Cat Pusher UAT; com.jenny.catpusher.uat | work/CoinPusher/uat/CatCoinPusher-UAT-game.json | work/CoinPusher/uat/CatCoinPusher-UAT.apk; version 1 |

Install each app once. Game-only changes use its own JSON; no APK reinstall is needed. The APK's bundled game is older than the latest JSON, so connect the appropriate file even after a first install. Wait for OneDrive sync, reopen the app or tap the refresh control, and accept the game update. Never choose UAT's JSON in the main app. UAT rejects the regular file and keeps private saves/settings/update URI separate.

Current source is in **C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/board-prototype** (production) and **C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game** (UAT). Native projects and packaging scripts are under **C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/work**. OneDrive's root index.html and old publishing/build scripts are legacy; do not use them to publish the current game without explicitly updating their source paths.

## Build, UAT and promotion

Game-only UAT: edit outputs/uat/game, run relevant tests, then work/package-uat.ps1 and work/make-uat-update.cjs. Verify staged files and channel/applicationId, retain APK version 1 for game-only edits, then work/deploy-uat.ps1. That script publishes only to OneDrive/work/CoinPusher/uat and verifies main APK/JSON hashes remain unchanged.

Production game-only: use outputs/board-prototype with work/package-apk.ps1, work/make-update.cjs, work/verify-apk.py, then work/deploy-apk.ps1 -GameOnly. Production retains APK version 13 and its existing storage/settings keys. A game version must strictly increase. No need to rebuild/install an APK for HTML/art/audio changes.

Promotion requires Jenny's explicit approval of a specific UAT release. Promote the **same tested game/art**, changing only production storage keys and release label. Do not copy the UAT APK or whole UAT JSON into main: package ID, apkVersion and APK bytes differ. work/promote-approved-uat.cjs currently pins the previously approved UAT release **20261011161833**; update that pin only for a newly approved release. **Before promoting the new powers**, production staging must include head-sweet.png and head-wild.png (the current production art list does not yet include them). Verify all runtime assets before publishing.

Native updater changes require a rebuilt APK with matching package ID, incremented versionCode/payload apkVersion and retained signing certificate. UAT native project is work/android-uat; main is work/android-build. Use installed JDK 17, Android SDK and Gradle 8.10.2. Never copy a signing keystore into the shared project. The current debug-signed APKs are local test distribution, not store release artifacts.

Back up before every publication. Main backups live under OneDrive/work/CoinPusher/backups; UAT backups under uat/backups. An extra previous-main JSON is under outputs/production-backups. Roll back by republishing saved game files with a fresh higher version stamp; selecting a lower-version JSON will not downgrade the updater. Preserve historical backups instead of rewriting their docs.

## Code and art registration

The current game is a single-file HTML/JS application; Rapier is bundled in lib/rapier.js. BOARDS has two entries; BOARD is the selected getter; reset/select/next rebuild deterministic layouts. Legacy special-coin/quest/economy helpers remain in the file but normal tryDrop emits ordinary coins only. Do not mistake dormant definitions for active features.

Table coordinates: L30/R370/BACK190/FRONT640; M=0.01. Pusher half-width170, fixed half-height9, depth205..275, period3.2 seconds, always-solid tongueContact and disabled tongueRest. No old phase/slot input gate or resting-ledge load handoff. Input starts at zero translation velocity and lip-projected height; gravity scale 9.81/30 during the fall returns to 1 at first contact. Stable pile gravity30; COIN_FRICTION0.45 with Min combining, effective shelf0.035/pusher0.05. The renderer's local projection Jacobian makes coin faces fit their actual board plane. Do not bring back an independent coin-flight curve or perspective growth animation.

MOUTH_EXITS contains eight hand-registered source points with unique lip masks and tilts. Head PNG canvas1536x1024; displayed(-10,-25,420,240). Source exits: (518,797), (582,840), (666,863), (728,874), (803,874), (881,862), (947,835), (1009,799). Aiming snaps to the nearest projected exit; body X/Z stay constant until collision. Recheck every exit if tooth/lip geometry changes.

Pupils are separate upright sprites; source eye centers(500,515)/(1060,532), radius118x108, crop(483,107,289,1041), display75x180 source-relative. Tracking translates horizontally with a downward bias. Keep expression sprites registered so eyes do not jump.

Paw width280 is fixed in both poses; height follows asset aspect. Idle centers-70 andW+70; sweep centers100 andW-100. Idle bob2 units and rotation0.018 radians, sweep inward angle-0.35 radians before mirroring. Idle paws draw after table/before coins; active paws draw above them. Paw Sweep uses a moving CCD contact plus forward assistance; no teleport or automatic deletion.

UAT expression selector uses head.png for ordinary drops, head-sweet.png for Paw Sweep/after powers, head-wild.png for Catquake. Catquake crossfades0.18 seconds, hits0.73 and returns by2.3. A new tap clears the sweet expression and restores normal registered outlets. Catquake applies spatially weighted physical impulses; targets get half the direct forward impulse. Repeated shake jolts are smaller than legacy lightning. The 5-second spill report is useful UAT feedback, not a fixed payout rule. Keep powers mutually exclusive and reset all their state.

No APK source change is necessary for the latest UAT color-only update. Its normal/Catquake teeth use one light ivory palette. Preserve PNG alpha; inspect on the real cosmic plate, not only a dark sprite viewer. Both-board bots and per-feature regressions run through tests/pusher-runtime.cjs. Tests/outputs are not shipped assets. Dormant music/old machine source files should remain excluded from packaging.

## Verification and limits

Runtime tests execute the shipped HTML and Rapier 0.14, not substitute physics. Latest no-power bot checks: Board 1 used 86/140 at 0.4-second cadence and 113/140 at 0.22; Board 2 used 119/160 and 127/160 respectively. Each board has a demonstrated strategy with at least 25% budget above spend. Every strategy need not achieve that same efficiency.

Checks cover immediate drops in every pusher phase, one coin per pointer tap, no hold stream, all eight custom exit registrations, straight rendered/physical fall, pile grip/toppling, upright tracking pupils, fixed paw scale/idle visibility, sweep completion, power charges/exclusion/reset, roar-before-slam, physical spill counts, audio routing/mute, and collection-before-clear sequencing. Native-canvas PNG/GIF previews show real rendered game frames; generated mockups are separate. Preview GIFs are silent.

APK identity/signature and ZIP integrity, JSON/asset round trips, required expression files, transparency and background preservation were checked. Latest UAT is an asset-only color correction; previous gameplay checks remain valid. Test audio stubs verify routing, not acoustic quality. Android installation, OneDrive provider behavior, sound quality and device FPS require Jenny's phone review. Do not claim Play Store readiness or phone verification from desktop tests.


UAT-15 correction 20261015213629: active Settings now exposes Check for updates and Developer mode. The collection-menu implementation is disabled and must not be used as evidence for active Settings. Current review baseline load resets boards and its progress-save hook is a no-op; preserve that approved behavior unless a ticket changes it.
