## CP-52 prize artwork — UAT 69, November 16, 2026

`work/cp69/build.py` pins published UAT 68 and preloads three approved 128×128 PNGs into `WILD_ART` during `loadArt`: `img/art/cp52-feather.png` (D), `cp52-ball.png` (C), `cp52-cushion.png` (C). The `.pgl` cache flag lets the existing ball branch reuse its PNG. All existing `wildPrizeArt`/`drawPrize` consumers use them; no size, aspect, opaque-share, collider or pickup code changes. Game-only APK7 payload now contains 40 files: the previous 37 plus these three PNGs. Future staging must preserve these files rather than rebuilding non-HTML assets solely from APK7. Source PNG copies live in `work/cp69/art/`; approved originals and options in `tickets/CP-52-evidence/`. Checks and phone-size screenshots: `tickets/CP-52-evidence/uat69/`. Production unchanged.

## PROD-05 production baseline — November 15, 2026

Production **2026.11.15 / APK17**, numeric 20261115224800 = Baseline 1 (UAT 64, 20261115190000, as is). Game-only: `phone/CatCoinPusher-game.json` carries the complete 37-file runtime in `files` (`apk` empty, apkVersion 17, channel `catpusher`, com.jenny.catpusher); index.html is `work/prod05/release.html`, the other 36 files are APK17's assets byte for byte. Build: `work/prod05/prepare.py` (pinned UAT 64 source, 17 recorded adaptations in `adaptations.json`): BUILD `2026.11.15`, title CatCoin, `catpusher.uat.*` -> `catpusher.*`, Settings heading "Settings" without the three log-file buttons (APK17 has no log bridge), safe-area/Happy previews and the faces note only with Developer on, the local performance log (`diagEvent`, `diagFrame`, `diagPersist`...) a no-op with Developer off. The UAT Developer default-on is keyed on "UAT" in BUILD, so it never applies. Then `stage.py`, `publish.ps1`, `verify-cloud.py`; checks `checks.cjs` (Developer-off screens, Oct 31 save upgrade, parity with UAT 64). First open of an Oct 31 save: `pgInit` migrates `catpusher.loop.v1` coins and treats (cap 9, extras as coins) into `catpusher.progress.v1`, Level 1. Future production builds start from `work/prod05/release.html` or repeat `prepare.py` on the next signed-off UAT source.

## GitHub WIP checkpoint (November 12, 2026)

After publishing a UAT, run `python work/checkpoint.py`. It copies the published UAT runtime, the work/cpNN build sources, ticket reports and text evidence (and .png evidence from CP-33 on) and the main docs into the cat-coin-pusher repo, commits on branch `wip/uat` (never main) and pushes. `--dry-run` shows what would change.

## CP-25 production baseline — November 1, 2026

Production **2026.10.31 / APK17**, numeric20261031103610, promoted from UAT24 with Jenny's release and migration approvals. Source/native/staging `work/cp25/promotion`. Full37-file runtime is in APK assets, with an APK-only JSON envelope (`files:{}`); never extract a future baseline from that empty object. All36 non-HTML assets match UAT24; production changes are labels/keys, Developer gates and diagnostic omission. APK17 uses generated `BuildConfig.VERSION_CODE`; production update policy/identity/preferences/signing/URI retained. No native OneDrive diagnostic bridge/provider; local diagnostic entry points require Developer mode.

Old production never saved current board or per-board allowance. Approved first open is Board1/220 coins, preserving `catpusher.audio.v1`; subsequent full loop saves use `catpusher.loop.v1`. UAT storage stays separate. Fresh signed build/lint, DEX startup/signature, old-reader compatibility, save checks and18/18 exact UAT24 board comparisons pass. Verified backup `backups/before-CP-25-promotion-20261031103610`; fresh cloud JSON and embedded installer hashes match stage. Phone production installation/sound/progress/performance remain Jenny's checks. Report/evidence: tickets/CP-25.md and CP-25-evidence/promotion/.

## CP-25 — UAT24 / APK7 installer correction (October30, 2026)

Current source work/cp25/installer-fix/release.html; native work/cp25/installer-fix/android; version20261030205840. Full37-file runtime is inside APK assets; JSON files object intentionally empty. Runtime matches UAT23 except label. Complete APK7 installer in49.5-MB app-only envelope supports APK4/5/6 without duplicate runtime. BuildConfig generation enabled; versionCode() returns BuildConfig.VERSION_CODE (manifest7), eliminating PackageManager exception→0 false APK requirement. Actual policy tests12 cases and existing signer verified. Missing-installer phone cause is not proven, but latest raw log's first object shows UAT23/APK6, so don't assume old native installed.

DiagnosticPolicy.documentBytes produces fixed131072-byte remote document, UTF8 JSON + ASCII spaces. Native connected-file writes use it to overwrite stale suffix where provider wt didn't truncate. Private cache/Share remain ordinary JSON; read limit/marker guard unchanged. Simulated non-truncating overwrite/Unicode/limit tests pass; phone confirmation pending. Malformed original phone log preserved under CP-25-evidence/installer-fix; latest parser should tolerate trailing whitespace, never salvage unrelated files. Future publication must supply installer when advertising a newer native version; APK-only complete same-version bundle avoids old updater memory duplication. Fresh cloud hash verified, ETag60; phone retry pending. Report tickets/CP-25.md; cloud and phone evidence under CP-25-evidence/installer-fix/.

## CP-25 — UAT23 clear/Rest order (October30, 2026)

Current game source work/cp25/clear-order/release.html, builder build.py, numeric20261030183741, APK6 unchanged. powerFace holds normal during queued/displayed BOARD CLEAR on won boards when no active sweep/Quake; Rest begins after message expiry, then unchanged2-second next-board wait. Covers saved-won restoration; five runtime sequence checks pass. No physics change. Full37-file game-only JSON restored as current runtime baseline; apk field empty avoids double runtime memory. Native source remains work/cp25/update-recovery/android. OldAPK4/5 need standalone APK6 installation; current Jenny phone APK6 verified. Report/evidence tickets/CP-25.md, CP-25-evidence/clear-order/. Fresh cloud bytes verified, ETag59; Windows cloud metadata in sync. Phone order check pending. UAT21 smoothness/hold-follow and log handoff passed.

## CP-25 — UAT21 / APK6 update recovery (October30, 2026)

Jenny reports crashes before successfulUAT20 delivery, phone stillUAT19. Leading hypothesis: APK4 whole-buffer JSON/string/parse allocations with new100.9-MB package. Recovery uses APK-only envelope, `files:{}`, same full runtime once in APK6,49.5-MB JSON. OldAPK4/5 UpdatePolicy selects APK; APK6 bundles same version20261030172415 and never applies empty files. New version6 forces a fresh offer. Signature unchanged;37 runtime files matchUAT20 except label. Actual policy cases/build/package pass; fresh cloud bytes verified (ETag58), phone recovery pending, no crash stack. Direct OneDrive UAT APK install over existing app bypasses old updater if startup still crashes; never require uninstall.

Current HTML work/cp25/update-recovery/release.html; native work/cp25/update-recovery/android. **Full runtime baseline is APK assets, not the now-empty JSON files object.** runtime-manifest.json pins37 file hashes. APK-only envelopes require complete same-version bundled runtime; future game-only release needs complete files object. Preserve latest source instead of using old JSON extraction/staging scripts. Same trial and log controls; no gameplay change. Report/evidence tickets/CP-25.md and CP-25-evidence/update-recovery/.

## CP-25 — UAT20 / APK5 (October30, 2026)

Current source `work/cp25/log-file/release.html`, builder `build.py`, pinned publishedUAT19; native project `work/cp25/log-file/android`. One approved native interval/tick with matching cast horizon/tray/quiet timing and four hard separation iterations. Actual-release-depth fitted-camera finger projection; launch bounds116–284 retained. Phone19's legacy-projection screen-gap estimate is invalid; new logs mark fitted-camera. Timing/world evidence valid. Desktop throughput20.3→26.1 FPS still fails steady60; safety8,015 intervals pass,18/18 clears with changed balance. See tickets/CP-25.md.

APK5 adds separate diagnosticUri.v1 SAF OPEN_DOCUMENT permission for precreated `uat/diagnostics/CatCoin-UAT-performance.json`. Marker+format, content scheme, write flag and128KB guards; validate destination before each write. Atomic private cache, latest-only worker queue; Share uses separate worker/read-only grant provider at `/performance.json`. No broad storage permission; update URI unchanged. JS Send/Connect/Share controls replace Copy UI; idle/end/pause snapshots skip held play, native pause resets timing/simulation. One-time user selection, provider write/persistence and actual OneDrive sync need phone evidence. Existing UAT signer, versionCode5, matching full37-file bundled game20. Package <128MiB. Native guard/queue/policy tests pass. Publication manifest and cloud proof under tickets/CP-25-evidence/log-file/. Pickup work stopped; phone performance/feel and log handoff pending.

## CP-25 — UAT 19 automatic diagnostic log (October 30, 2026)

Current source `work/cp25/auto-log/release.html`, pinned UAT 18. Builder `build.py` injects `logger.js`, hooks frame/input/drop/end-hold boundaries and adds Copy performance log immediately below Settings heading. No native bridge added; APK4. Full collision/step implementation asserts byte-identical to UAT 18. Instrumented 600-frame comparison yields identical game/physics/payout states.

UAT-only key `catpusher.uat.diagnostics.v1`; schema1, bounded current session plus prior useful saved play session. Metric buckets cap120, drops80, events40. Arrays carry column names in exported JSON. Raw frame intervals include stalls, exclude background via existing visibility clock reset. Held totals use pre-step holding flag plus active-play/nonmodal state; paused/settings frames are identifiable. Input timestamps are feature-checked for compatible monotonic clock before dispatch-lag values are retained. No RNG calls, no game-save serialization, no network. Automatic diagnostic writes defer while holding; idle/end/background/export flush, failed storage throttles instead of retrying per frame. Explicit export may write immediately.

Copy uses a readonly selectable textarea and synchronous execCommand within the button gesture. Returns Copied only if the browser reports success; failure leaves text available for tap-and-hold. DOM-stub paths tested; Android clipboard still needs device evidence. Current/prior log can be pasted to CP-25 for analysis after play; no manual readout collection requested. UAT 18 physics trial/lag acceptance remains open. Report/evidence: tickets/CP-25.md and CP-25-evidence/auto-log/.

## CP-25 Stage4 — UAT 18 two-interval trial (October 30, 2026)

Current source `work/cp25/two-intervals/release.html`, pinned published UAT 17 baseline. `build.py` verifies baseline hash and changes all four STEP/4 uses to STEP/2, both substep bounds/interpolation denominator, plus build label/readout-row placement. Thus quiet-time accrual and delivery cast horizon remain consistent; world.timestep returns to STEP after each tick. Simulation/drop gate, contact/rotation/launch rules remain; precision changes can change balance. Jenny authorized two intervals explicitly. `candidate.html`/`two-plain.html` are identical; rejected grid prototype is excluded from builder/publication.

Audit:8,540 intervals across three 28-second scenarios at.20-second requests, zero through-crossings/flips/deep contacts/table rescues; max penetration.264 unit, tray.239. Launch caps retained.18/18 trial clears at.20/.35s over3 boards×3 seeds; matched UAT 17 seed42 cases6/6. Mean physics12.02→6.58 ms; long native-canvas hold throughput14.1→20.4 FPS, end rolling9.1→11.7, still not steady 60. Phone readouts/feel required; diagnostic CPU drawing time is not GPU completion. Developer row moved above footer controls. Existing raw/coalesced pointer sampling from UAT 17 retained; old Paw pickup can intentionally stop holding, so performance comparison uses existing Ribbon preference only in the harness. No pickup work resumed. Report/evidence: tickets/CP-25.md and CP-25-evidence/two-intervals/.

## CP-25 Stage4 — UAT17 diagnostic, lag unresolved (October 30, 2026)

Current UAT17 source `work/cp25/perf-rework/release.html`, pinned actual UAT16 package under `uat16/`. Rebuild `build.py` with `overlap.js`, `frame.js`, `input.js`, stage `stage.py`. Builder asserts coin contact/step code byte-for-byte identical to UAT16; four native intervals retained. Convex SAT uses inward edge half-planes, with original projection fallback near tangency;720-step physics equivalence,12 identical coin-render samples and5,115 identical overlap decisions. Private native-query/pose caching experiment was rejected for no reliable physics speedup and is NOT loaded by the builder.

Frame diagnostics average raw frame intervals and total physics/drawing CPU time per rendered frame over3 seconds, refreshing every500 ms; physics includes all catch-up ticks. Footer shows FPS, physics ms, drawing ms and coinSolid body count only in Developer mode. Drawing time is submission CPU time, not GPU completion. Visibility resets timing/accumulator. Existing .05-second cap and maximum3 catch-up ticks remain; overload can therefore execute12 native intervals/frame and discard elapsed time. This explains slow real-time travel/streaming without travel-rule tuning. Raw pointer updates/coalesced samples choose newest timestamp; stale/other-pointer samples ignored, pointermove fallback retained, no drops in move handlers. .20-second simulation gate unchanged.

Matched production/CP22/UAT16 comparison identifies the large physics-cost increase in CP22's four intervals and hard pairwise contact repair; CP25 save calls are not the dominant cost. UAT17 is diagnostic, not a passed lag fix. Two-interval trial needs Jenny's approval before implementation, then CP22 pass-through/flip/pile checks. Full report/evidence: tickets/CP-25.md and CP-25-evidence/perf-rework/. Pickup work stopped. PRIZE LOST same-board retry retained per Jenny's October30 decision.

## CP-25 Stage 4 lag candidate — UAT16 (October 30, 2026)

Current UAT16 source `work/cp25/lag/release.html`, pinned UAT15 baseline. Rebuild with `build.py`, `contacts.js`, `frame.js`; exact published HTML reproducibility verified. renderPixelRatio caps canvas backing density at 2; use it consistently for drawing transforms/caches/resize, while CSS geometry and pointer mapping stay fixed. No source artwork changes. Contacts cache sleeping flags inside each interval and mark moved bodies awake; shape values are interval-local; all original solver equations/order retained. FPS counts raw frame intervals over three seconds, publishes every 500 ms, and counts intervals over 25 ms. Visibility transition resets sampling and frame accumulator. Native-canvas baseline comparison: 900 steps / 75 drops exact state match. Desktop performance gain is modest; phone smoothness remains open. Preview-only pickup drawings are under `work/cp25/pickup-preview/`, excluded from UAT16; existing pickup behavior remains for lag isolation. Report/evidence: tickets/CP-25.md and tickets/CP-25-evidence/lag/.

## CP-25 pickup trials (October 29, 2026)

Current UAT15 source work/cp25/pickup-options/release.html, pinned to actual published UAT14 (CP-26 Calm face). build.py/awards.js add style-specific pickupBlocksPlay and durations, never tap dismissal. Settings cycle/previews persist only preference/next style under catpusher.uat.pickup.v1; actual item ledger unchanged. Ribbon/Satchel continue input/physics; Paw stops hold and consumes input for full timed display. Presentation hides/pauses while Inventory or Settings is visible. Style is selected once per queue entry; chime once per visible head. Four checks and package/cloud/stills: tickets/CP-25-evidence/pickup-options/. All non-HTML payload fields/files retained from UAT14, including Calm asset. Fixed STEP/frame scheduler/coin/pusher pace unchanged. Report tickets/CP-25.md.

## CP-25 compact Inventory/doily published (October 29, 2026)

Current UAT13 source `work/cp25/inventory-grid/release.html`, pinned to UAT12. `build.py` + `ui.js` replace Inventory-only list with64×64 treat/power cells and corner counts, remove Inventory Collections navigation, and replace/reposition only the Collections tile. Grid reads S.got and powerCount (Board3 earned Quakes included), no saved fields/earning change. Tile uses existing44×44 hitbox: footer if clear of projected table front, otherwise header above tabletop; doily drawing stays inside bounds. No added images. UAT12 reconciliation/retry and direct ordered/masked coin rendering retained. Checks/stills/package/cloud: tickets/CP-25-evidence/inventory-grid/. Publication prepared by prepare-publication.py; only release label differs from approved draft. Report tickets/CP-25.md; phone UAT pending.

## CP-25 Stage 3 overlay/sound (October 28, 2026)

UAT 5 / APK4 source: `work/cp25/stage3/release.html`, pinned to published UAT 4. `build.py` replaces only the award renderer/queue sound start and adds `sfx.itemCollected`: 659.25/830.61/1318.51 Hz sine notes over ~0.4 seconds, existing master gain, mute/hidden/background guards. Queue entries track `sounded`; head starts once when visible, not on every draw, and the old immediate target `special` call is removed (Quake retained). The item-only renderer draws a 28%-alpha backdrop plus the approved sprite at alpha 1. Art preview scripts and generated candidate live under `stage3/art*`; they are not referenced by the shipped source/package. `art-preview.cjs` renders a temporary in-memory tile override only, checks zero pixel changes outside the existing tile, and outputs the approval still. See `tickets/CP-25.md` for pending art/payoff choices and publication evidence. CODEX_BRIEF.md remains reserved by the separate promotion instruction.
## CP-25 collection layout / award revision (October 28, 2026)

Current UAT source: `work/cp25/layout/release.html`, pinned to UAT 3. Builder `build.py` + `collections.js` (existing economy), `ui.js` (full-screen frame/satchel and pointer-owned drag), `awards.js` (side tile/award queue); existing future outlines reused. Placement occurs only on a moved source gesture released in its matching slot; cancel/blur/resize/hidden retain the item. The saved schema/key and placement/reward flags stay the same. Front payout credits inventory once, then queues transient two-second awards. The overlay's pointerdown handler precedes ordinary input and consumes dismissal; auto expiry permits an existing stream to continue. Award queue is not saved; credited inventory is. Clear callout/auto advance wait until queued cards finish. Collection view pauses simulation and bypasses hidden board drawing. Source, tests, screenshots and interaction clip: `tickets/CP-25.md`, `tickets/CP-25-evidence/layout/`. Phone sign-off pending.
## CP-25 Stage 2 UAT (October 28, 2026)

Source: `work/cp25/stage2/release.html`; builder `build.py` + `collections.js`, pinned to published Stage 1 `work/cp25/release.html`. Game-only UAT3/APK4. Stage 1 `catpusher.uat.loop.v1` schema 1 remains, with additive known-ID `placements` and collection-ID `collectionPaid` flags; absent fields default false. `placeItem` consumes an owned item once, pays Water 100 / Cheese 50 once, and saves the entire operation together. Future sardine/crab/mouse IDs are UI outlines only. `DROP_INTERVAL=.20`; pointerdown is immediate, fixed `step` schedules subsequent held releases against `lastDrop`, never a catch-up loop. The tracked pointer owns the stream. Release/cancel/lost capture, blur, hidden/pagehide and screen opening stop it. Developer-only `emptyPurse` saves zero balance and a new refill epoch. CP-22 physics functions are retained. Stage 2 report/publication evidence: `tickets/CP-25.md`, `tickets/CP-25-evidence/stage2/`. Phone acceptance pending.
## CP-25 Stage 1 UAT (October 28, 2026)

Source: `work/cp25/release.html`, built from pinned CP-22 UAT 1 by `work/cp25/build.py`; package staging: `stage.py`, publication: `publish.ps1`. Purse, refill epoch, inventory and board/body snapshots use UAT-only `catpusher.uat.loop.v1`, schema 1; audio retains `catpusher.uat.audio.v1`. Saves occur on drops/payouts/advance and periodic/background/pagehide checkpoints. Load reconstructs the current bodies, transforms and velocities; an interrupted power animation is not resumed. Default purse 220, 20-second refill, refill cap 300; front coin wins may exceed cap. Board allowances/time expiry are inactive; 1–3 loop after collection/clear feedback plus two seconds. Inventory uses the existing sprites and pauses simulation. Stage 2 waits for Jenny's approval. See `tickets/CP-25.md` for publication status and evidence. Do not rebuild from legacy source directories.
## Current production — CP-21 batch, October 27, 2026

Production **2026.10.27 / APK16**, numeric 20261027120233. Jenny signed off CP-21 UAT 8 with UAT-16–19; game-only promotion from the published UAT payload, not an integration-script rebuild. Source and staged payload: `work/cp21/promotion`. Native baseline stays `work/prod04/android`; no new APK. Production channel, app ID, APK bytes, audio storage key and update URL retained. Date footer and update `displayName` agree. Happy, dance and paw outline tests are Developer-only. All 18 board results exactly match UAT 8. See `tickets/CP-21.md` for backup, cloud evidence and phone steps. Earlier release checkpoints below are historical.

## Current UAT — CP-22 impact energy, October 28, 2026

**2026.10.28 UAT 1 / APK4**, numeric 20261028102427. Source `work/cp22/release.html`; builder `revise13.py` + `impact13.js`, pinned to UAT 12. Published; backup/local hash verified; cloud hash verified. Phone acceptance pending.

Accelerated delivery energy must not enter pile contacts. `deliveryImpact()` shape-casts incoming currency over the next physics interval, advances to first impact, restores normal gravity and enters contact at -1.2 m/s. After native contacts and separation correction, `dampCoinImpacts()` bounds residual ordinary on-board currency speed to 1.2 m/s horizontally and +0.35 m/s vertically. Free delivery, active powers and off-board payout are exempt. These explicit gameplay limits supplement zero restitution. Keep the 0.35-second input gate. Preserve `contactSolid` coin/item CCD and separation, `coinSolid` rotation control and render ordering without simulation-list mutation. Future physics checks need launch trajectories as well as penetration and mixed treat pairs; previous overlap-only checks missed the bounce failure.

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

## CP-33 prize feedback (November 9, 2026)

Source work/cp33/release.html, built by work/cp33/build.py from UAT 24's runtime (APK assets). The CP-25 Paw/ribbon/satchel styles, pickupBlocksPlay and the Pickup style setting are removed; catpusher.uat.pickup.v1 is no longer read. Collected prize (credit/save unchanged in fallOff): pooled flight objects in treatAwards fly a quadratic Bezier (ease-in-out cubic) from screenOf(x, T.FRONT, 0), mapped through the board view transform, to the Inventory tile centre, shrinking to endScale, emitting sparkles from a fixed 24-slot pool; arrival starts the tile spring (inventoryTileScale) and the existing itemCollected chime (throttled to one per 120 ms). The front-fall sprite for prizes is not drawn. Lost prize: gutterOff for kind 'item' queues a pooled grey (ctx.filter grayscale) sink with a dark ripple at the table edge, then the existing prize-lost rule. The later fallOff wrapper only annotates a falling entry its call added. Nothing pauses step/update or consumes input. Tuning (flight, endScale, sparkles, bounce, bounceTime, sink) persists in catpusher.uat.pickupfx.v1, shows under Settings > Developer mode with previews, and is written to the performance log as pickupTuning. Checks: work/cp33/check.cjs; clip: clip.cjs; desktop timing: perf.cjs; lost probes: lostprobe.cjs, pushprobe.cjs.

UAT 26 (CP-33 round 2): tuning key is now catpusher.uat.pickupfx.v2 (fresh defaults; v1 ignored). New keys arcHeight (exact peak rise in CSS px above the front-edge start, 30-200; control point solved by arcControlY bisection once per pickup) and arcSide (-1..1, control x offset 150 px per unit). Defaults flight .7, endScale .5, arcHeight 160, arcSide 0, sparkles 10 (cap 24, life .55 s, outlined star with white core).

UAT 27 (CP-33 round 3 + CP-34): the pickup module lives in work/cp33/module27.js (build.py inlines it). Flights in treatAwards have kind 'item' or 'quake' and three phases (tr rise, tm middle, td final); pickupPoint(f,t) returns position, size and flip (horizontal scale = cos of the flip angle). Prize: rise to pickupCentre (200, 0.52H) with easeOutBack growth to midSize, flip turns = round(spin*middle), radial sparkle burst plus chime on reaching the middle, swoop to the Inventory tile. Quake: one phase to the powerButtons().quake centre, 2 flips, sfx.special and quakeBounceT on landing; shownPowerCount hides in-flight earned Quakes (non-dev Board 3); the QUAKE +1 itemToasts banner is no longer pushed. Key catpusher.uat.pickupfx.v3; sparkle pool 32 with velocity/drag, drawn above flights. Checks: check.cjs (13); renders: clip27.cjs; UAT 26 builder kept as build-uat26.py.
UAT 28 (CP-33 round 4): module28.js (build.py inlines it; build-uat27.py keeps UAT 27's build). Item flights add a settle phase ts after the middle (end = tr+tm+ts+td) and per-flight draws: tilt (flip axis lean, rotate/scale/unrotate in drawFlight), dir, flipK (flip completes within flipK*tm), turns, wamp (in-plane rock at 3 Hz, decays over the settle). Randomness 0 makes the draws fixed; Tilt, Randomness, Wobble and Settle all 0 reproduce UAT 27 exactly (check compares against release27.html). Sequential: a new item flight starts at t = -(time until the last queued item leaves the middle) and hovers at its start point; from the 3rd queued (2 ahead) tr/tm/ts are halved and turns = 1. Pickup tuning key stays catpusher.uat.pickupfx.v3. Checks: check.cjs (16); clips: clip28.cjs.
UAT 29 (CP-33 round 5): module29.js (build.py inlines it; build-uat28.py keeps UAT 28's build). Item flights: rise-and-grow tr, held tm (no flip; position/size/rot fixed), ts=0, bag td. f.ms = size*400/prizeWidth(id,1), where prizeWidth uses the opaque share of the art (PRIZE_OPAQUE). Per pickup: f.rot (6-14 deg at Turn 14, random sign), f.mx/f.my offset (Off-centre * 400; sideways capped so the turned box spills at most EDGE_SPILL 8 px beyond what it already does). Burst of 14 large sparkles and a radial-gradient glow (pickupPoint .glow) on arrival; sparkle cap 36. Queue as UAT 28 (3rd+ halved). Tuning key catpusher.uat.pickupfx.v4 (v3 ignored). Checks: check.cjs (16); clips: clip29.cjs.
UAT 30 (CP-33 round 6 + CP-34): module30.js (build-uat29.py keeps UAT 29's build). Prizes and the Quake coin share one queue and one motion (rise/grow tr, held tm, then td = toBag or quakeFlight; Quake flips twice on its final flight and lands on the button). Size default .7. Backdrop: backdropLevel() (1 while any pickup is rising-after-queue, held or waiting; fades over 0.3 s as the last leaves) drives drawBackdrop(): a grey-violet fill at Fade and a cached 14 px diagonal stripe pattern at Stripes*0.3, both under the flights, over the whole screen. Sparkles draw a cached radial glint with a twinkle (no stars); Burst and Trail default 0. bigQuakeSprite() renders craftedGoldSprite at 4x by swapping makeSprite once. Key catpusher.uat.pickupfx.v5 (v4 ignored). Checks: check.cjs (18); clips: clip30.cjs; desktop draw cost: perf30.cjs.
UAT 31: module31.js = module30.js without the held glow (pickupPoint no longer returns glow; drawFlight draws no radial gradient). build-uat30.py keeps UAT 30's build. Checks: check.cjs (19, adds the no-glow/shadow/filter render check); held frames: frames31.cjs.
UAT 32: module32.js. Backdrop is a pop-up panel: per flight f.px/f.py/f.pw/f.phh = upright box around the turned visible art (panelHalf: width w, height w*PRIZE_ASPECT) plus panelPad, clamped inside the screen with PANEL_MARGIN 12; the side offset is capped against that box. PANEL (tickPanel) follows the pickup in front, snapping when it appears and easing (1-exp(-14 dt)) between pickups. drawBackdrop fills a rounded path (radius 10) with the grey and the cached stripe pattern, then a 1 px light stroke. quakeSize sets the Quake coin's held size; key still catpusher.uat.pickupfx.v5. build-uat31.py keeps UAT 31's build. Checks: check.cjs (19); frames: frames32.cjs.
UAT 33: module33.js (+ pickup-sounds.js injected into sfx before fanfare). Prize spin is the Quake coin's flip (P.flip=cos): f.spinIn turns during the rise (cos(2π·n·(1-easeOut(u))), facing front at full size) and f.turns during the leave; both = pickupFx.spin for prizes, Quake keeps spinIn 0 and turns 2. Sounds: sfx.pickup(kind 'full'|'land', variant 1-3, vol) called by pickupChime (reveal) and pickupLandSound (bag arrival); uses tone/noise/bell/steelAt, respects S.muted and background. Dials spin, sound, volume; held default 0.7. Key catpusher.uat.pickupfx.v6; on first run v5 values migrate except PICKUP_FX_NEW_DEFAULTS (held). build-uat32.py keeps UAT 32's build. Checks: check.cjs (20); frames: frames33.cjs; sounds: render-sounds.cjs (offline Web Audio stand-in, WAVs); perf: perf33.cjs.
UAT 34: module34.js. Sounds: sfx.pickup('bell'|'thump', vol, delay) from pickup-sounds.js (pickup-sounds-uat33.js keeps UAT 33's three sets). ledgeBell() is called in queueTreatAward for prizes (the payout / ledge moment, previews too); bells in one burst are spaced LEDGE_BELL_GAP 100 ms (scheduled on the audio clock via delay) at LEDGE_BELL_LEVEL 1/.7/.5, a 4th is skipped; spacing uses game time and resets if time restarts. pickupLandSound() plays the thump on bag arrival. The 'sound' dial is gone (a saved value is ignored). Checks: check.cjs (20); sounds: render-sounds.cjs; audition source: audition.cjs.


## Developer off = production view (Jenny, Nov 14, 2026)
With Developer off, a UAT build must show exactly what a production player would see: no MODES button, debug or performance readouts, test chips or dials. All of it stays reachable with Developer on. Check every screen with Developer off before publishing.
The UAT app starts with Developer ON by default (her saved choice wins once she changes it). Production never has it on.

## Pickup (frozen, Jenny, Nov 14, 2026)
The prize and coin pickup that came with the new version (the "Pop", UAT 42 onward; the default in UAT 52) is approved and frozen (AGENTS.md). Do not change its look, sizes, timing, sounds or line without an explicit ticket. Code: `queueTreatAward` (the `f.pop` branch), `popSpot`, `popPoint`, `drawPopShadow`, `ledgeBell`, `pickupLandSound`, `tickTreatAwards` in the game source. From UAT 53 every piece uses it (`f.pop=true` always). `work/cp53/checks53.cjs` sections 1–2 trace it frame for frame against UAT 52; run them after any change near it.

**Which pieces:** all prizes (cheese, shrimp, tuna, yarn, duck, mouse, bell, bowtie, notes, cushion, biscuit, milk, egg, feather, sardine, the star prize), rain coins 5/10/25, the music-note, fish, laser and heart coins, and (from UAT 53) the Quake coin. No pickup animation, by design: cat coins (board-open moment), recipe coins ("RECIPE: …!" banner), the gold 5-coin ("+5", ka-ching) and plain coins.

**One piece, step by step** (screen 400 px wide):
1. **Ledge bell** the moment it goes over the front edge (`ledgeBell`).
2. **Rise, 0.2 s** (`POP_RISE`): from where it went over to a spot near it (`popSpot`): up to 28 px sideways, 150–240 px up, tilted 4–15° either way at random, kept 10 px inside the screen and below y 96. It grows from its board size with a slight overshoot; a soft shadow sits under it (no panel or box).
3. **Hold, 0.25 s** (`popHold`), still.
4. **Leave, 0.45 s** (`popShrink`): it swoops to its target, spinning flat once (Spin dial, direction by its tilt), shrinking to half its board size (`endScale` .5).
   - The target is the bag (`pickupTarget`); on the cat boards that is off screen (top-left), so it flies off the screen.
   - The Quake coin's target is the Quake button, and it shrinks to a 26 px coin there.
5. **Arrival:**
   - a prize or coin: the landing thump (`pickupLandSound`, at least 0.12 s apart) and the bag tile's bounce (0.15 s);
   - the Quake coin: its chime (`sfx.special`), the Quake button bounces and its count goes up.
6. Total about 0.9 s, plus any wait in line. No glints by default (Burst and Sparkles dials are 0).

**Sizes:** every piece aims for the same peak: visible width = `popPeak` (.3) × 400 = 120 px. Visible width is computed with a fixed "solid share" per art (`PRIZE_OPAQUE`: cheese .87, shrimp .826, tuna .928; the code-drawn prizes .86; coins .87), so what the eye sees varies with each picture's shape. Measured at the peak:

| Piece | Visible width at the peak |
|---|---|
| bell, milk, egg | 86 px |
| duck, notes | 96–98 px |
| feather, biscuit | 101–110 px |
| yarn, sardine, shrimp, cushion, tuna | 116–120 px |
| cheese, bowtie | 122–123 px |
| mouse | 128 px |
| every coin (rain, note, fish, laser, heart, Quake) | 120 px |

Nothing else changes the size: not the queue, not randomness, not the board. Only the spot and the tilt are random, from the pickup's own random stream (`popRand`), so the board's physics draws the same numbers with or without pickups.

**Many at once (the busy, noisy feel Jenny approved):**
- **Bells:** each piece rings as it goes over, spaced 0.1 s apart. The 1st is full volume, the 2nd .7, the 3rd .5; a 4th or later in the same burst is skipped. Since CP-51 (UAT 68, Jenny: "far too loud") every bell plays at `CP51_BELL` = .5 of that; nothing else in the pickup changed.
- **The line:** pickups take turns. A new one waits, bobbing on the ledge at board size, until every one ahead has left its peak, then rises.
  - The next starts rising as the one ahead starts leaving, so up to 3 are in the air at once (one rising, one or two leaving), at spots kept apart (`popSpot` tries up to 8 spots and keeps the farthest from the others).
  - From the 3rd in line on, the hold is halved (0.125 s), so a pop starts every 0.33 s after the first two (0.45 s each).
  - Measured, 7 prizes at once: starts at 0, 0.45, 0.9, 1.225, 1.55, 1.875 and 2.2 s; 3 bells; 7 thumps.
- **Thumps** follow as each one lands, at least 0.12 s apart.
- **On the Wild boards** each prize also shows its board text ("2 / 5", "REPEAT +5 COINS", "COLLECTION!"); a rain coin starts its rain once its pickup is 60% through the hold.

**Removed in UAT 53 (do not bring back):** the older UAT 34 pickup style (rise to the middle of the screen, 70% size, grey pinstriped panel, 0.7 s hold), which only the Quake coin still used, and its Developer switch.

## Design rules (Jenny)
GAMEPLAY_DESIGN.md "Design rules" 1-12 apply to every ticket. Rules 8-12 (Nov 14): one clear main action per screen; you can always find your way (buttons name their destination, never "Exit"); every element earns its place; nothing overlaps; one word, one meaning; 13: every sound comes from something you can see happen.

## Test switches (Jenny, Nov 14, 2026)
Each UAT build puts the switches Jenny should try in that build in a "Test this build" panel at the top of Settings, with plain names. When she picks an option, remove the losing option and its switch in the next build. Old Developer dials are cleaned up after the sign-off pass.

## Coin and pusher sounds (CP-46, UAT 60, Jenny's picks Nov 14, 2026)
Module `C46` (`work/cp60/sounds60.js`, applied by `work/cp60/patch.py`). The new coin sounds come from the CP-46 audition's own code (`work/cp60/coins-from-audition.js`, cut from `work/cp46-audition/make-audition.cjs`). They are recorded into note lists at start-up, with the audition's set gains baked in (`tickets/CP-46-evidence/audition/levels.json` `coinGroupGains`). They play a little ahead on the audio clock through `sfx.fx46`, which is `sfx.mus`'s recipe on the effects master; `C46.drain()` runs from `update`.
- **Coins: added, nothing removed (Jenny).** Each event picks at random from the current sound plus the new variants, never the same pick twice in a row (`C46.pick`).
  - A coin dropped onto the board: `sfx.land()` or one of 4 drops on pile.
  - A coin knocking another: `sfx.clink(v)` or one of 4 clinks.
  - A rain coin's first landing: clink or a drop on pile. A gold coin's first landing: clink, gold drop or gold clink.
  - Coins over the front edge: a single coin calls `recordedSfx.edge()` as before. 3 within 0.35 s: the current edge sound or one of 4 spills. 10 within 1 s: the current edge sound or one of 3 cascades.
  - Prizes and other pieces: `recordedSfx.edge()` unchanged. Gold paid at the front: ka-ching, plus the gold shimmer every other time.
- **Pusher: replaced.** `sfx.slide` is the warm whoosh (audition option w5): band-passed noise only, one per stroke, the return at 35%, 1.2× higher in Turbo. Pusher sound 50% (the default) is the auditioned level, 10 dB under the music above 250 Hz. The recorded `pusher.mp3` no longer plays. `pusherSoundTick`'s timing is unchanged.
- **Not touched:** the ledge bell and landing thump (frozen pickup), the music, ka-ching, the mouth drop, the coin roll, the stack tumble, and the Board 3 spill recording. `checks-cp46.cjs` compares their code with the base build.

## Levels, cats and powers (CP-47, UAT 61, Jenny's model Nov 14, 2026)
Modules `work/cp47-levels/levels47.js` and `powers47.js`, inserted after the CP-45 module by `work/cp47-levels/build.py` on pinned UAT 60 (plus a few text swaps listed in build.py). Saved inside `catpusher.uat.progress.v1`: `PG.lv = {passed, sel, stars}`, `PG.shown`, `PG.seenScr`, `PG.powers`.
- **A level is a layout; a cat is a mode.** `PGL_LEVELS` holds the ten levels: prize spots (`p`), tower-wall prizes (`top`, slot 0-4), towers (`'default'`, a list, or a `wall` of heights), rain coins, Quake, coins, seconds, goal (each kind once, common prizes only) and tag. `wildPrefill` builds Wild 2's start rows, then the level replaces the prizes, rain, Quake and towers. A cat's mode (`PG_CAT[cat].mode`) brings its side game; `wildFeature('towerwall')` comes from the level. `pglOn()` is true on a cat's board only: Developer MODES (`PGL.dev`), the old boards and `pgHomeOff` play without levels, as before.
- **Same start:** the layout is fixed and seeded; the physics settle leaves pieces within about 0.1 units (Level 4 about 0.4) between replays and between cats (`checks61.cjs` 1.5-1.6). Avoid placing rain coins or prizes where the start rows have a gap (they slide during the settle).
- **A cat's prizes** never sit in a layout: two scheduled sky drops per round (10 s and 32 s after GO, `PGL_CAT_DROPS`) plus about half of the random bonus prize drops that aren't replacing a lost goal prize.
- **Unlocks:** no XP (`pgAddXP` is a no-op). Recipes open after Level `r.level`. A side button appears when its screen is needed (`pglScreenNeed`) and stays; "!" until first visited.
- **Powers:** the button is the paw-sweep slot (`powerButtons().sweep`, empty on Wild boards). A perfect side game (`sfx.wild2('perfect')`, or a laser chase with no misses) sets `WILD.pgpEarn`; the power is awarded once no side game is running. Sonic meow multiplies the pusher stroke by `pglReach()` (1 otherwise, so every other frame is unchanged). Hug adds two world colliders along the open gutters and removes them after 6 s. Every power uses existing sounds only.
- **Mouse pounce** (`WILD.pounce`, the Tortoiseshell's mode `pounce`) follows Treat toss's pattern: a mouse coin replaces one bonus drop, the timer holds, a win waits, taps go to the pounce.
- **UAT 62:** levels can have tower blocks (`blocks`: stacks packed together, `btop`: a prize on one of them). They're stood back up on their spots after the settle (`pglStandBlocks`). "Test this build" (`pglTestPanel`) is added to Settings after `openCredits` builds it. `PG_AB` is forced to 'A'. The release is built by `make.py` (build.py, then CP-45's pupils patch, then CP-46's fix A).

## Goal icons and the goal row (CP-50, UAT 67, Nov 16, 2026)
Source `work/cp67/build.py` (text swaps) + `cp50.js` on pinned UAT 66.
- `wildIcon(id, x, y, w, got)` now takes the circle's **centre and diameter** (`cp50Icon`): the prize at full colour on a cream circle, a green rim and a check top right when collected (no dimming); the star prize's star sits top left (`__w43Icon`). Every goal list goes through it: Home goal line (`cp50HomeRow`), end card (`cp50EndRow`, `CP50_END`), goal cards, the in-round row.
- In a round on a level, the goal row is drawn by `cp50DrawRow` from a `drawMachine` wrapper: after the machine, **before the cat's head**, so the cat always stays on top. `cp50RowLayout()` fits it between `hudLayout().headerBottom` and the forehead (`VIEW.y + 57*VIEW.zy`, measured on four phone sizes; keep 6 px), and between the ears (x 103..297, wider for a shorter row). 7-8 prizes shrink to about 26/23 px. The bottom-left "Collection n / N" remains only for Developer modes without a level. Check with `work/cp67/headmask.cjs` (head pixel mask) / `checks67.cjs` 6 after any change to the head, HUD or VIEW.
- Level 1 is the shrimp and cheese (`star: null`); `cp50Lv1()` turns bonus prize drops into a rain 5 (except a lost goal prize coming back) and switches off the cat's sky-drop prizes. The Dance wheel's "PRIZE YOU NEED" slice still works on Level 1.
- Back buttons that go to the Home screen (`pgHeader` side screens, the round's top button) read "Home".

## Coin limit and freeze logging (CP-48, UAT 64, Nov 15, 2026)
- Own-coin limit (Jenny's option A): `cp48Own()` counts the player's dropped coins (`b.input`) still on the board. At `CP48_OWN` = 45, `tryDrop` allows one drop per `CP48_SLOW` = 1 s and shows "Board full" (front float plus `wildMessage`). Grid, tower, rain and prize pieces don't count.
- Rain budget: `w43Budget` is overridden to start at `CP48_RAIN` = 100 plain coins (rain, pours and sky coins past it land as one gold 5 in five). `W43_COIN_CAP` (merging resting coins) stays 130.
- A hard stop at 100 plain coins was tried in UAT 63's development and jams the board (no new coins, nothing falls): it made Levels 3/6/7/10 unwinnable. Re-run the test player (`work/cp63/simcap.cjs`) after any limit change.
- Levels (`cp48.js`): `cp48Grid()` rebuilds production's 9-row grid (53 coins) after every level prefill; `cp48Lift()` stands towers and blocks on the grid (base at `COIN_HALF*2+.1`). It runs after `twPlacePrizes` and `pglStandBlocks`, which put towers back on the table. Each level starts at 80 coins or fewer (grid plus tower coins); keep new levels within that.
- Logging: 200-event ring; `first-error` save; local save every 5 s in a round; `long-frame` (>100 ms), `frame-gap`, `screen`, `round-end`, `board-full` events; `diagSession.taps` (last 10, with target) and `peakCoins`. Native crash/stall handling (onRenderProcessGone, watchdog) still needs an APK.

## Drop speed, coin backstop and Pause (CP-51, UAT 68, Nov 16, 2026)
Module `work/cp68/cp51.js`, inserted by `work/cp68/build.py` on pinned UAT 67; checks `work/cp68/checks68.cjs`; balance bot `work/cp68/bot68.cjs` (real pointer events; MODE=hold or tap; `table.py` sums it).
- Drop speed: `DROP_INTERVAL` (0.20 s since CP-25 UAT 3, Oct 28, for both hold and taps) is no longer used for drops. Holding repeats every `CP51.hold` = 0.40 s (`cp51StepDrops`, called from `step()`); a new press drops at once if `CP51.tap` = 0.25 s have passed since the last drop, otherwise one early tap waits (`CP51.q`, max 0.6 s) and drops when the gap opens; a second early tap gets "Easy taps".
- Coin limit: CP-48's 45 own-coin limit is retired. `cp48Full()` now means `cp51Pieces()` (plain coins + silver + gold 5s) >= `CP51_BACKSTOP` = 120, using CP-48's slow-down (one drop per `CP48_SLOW` = 1 s, "Board full"). A hard block at 120 was tried and made non-stop tapping lose far more (11/30 vs 19/30). Rain budget (100) and merging (130) unchanged.
- Pause: `cp51Paused`. Appended to the 12 existing `inventoryOpen||panel.style.display==='block'` pause checks (not `drawTreatAward`, so a pickup stays on screen); `step` and `update` wrappers skip physics and the game update while paused but still call `wildTick` (side games keep their own pause bookkeeping, e.g. the dance shifts its beat clock) and `bgmTick` (`bgmWanted` is false while paused). Button: a pill around the round timer (`cp51Btn`, hud.left+5, bannerY±15), only in a round in play. Pop-up `cp51Rects`/`cp51DrawPop`, taps in `wildPointer` (outermost). Finish = `wildFinish(false,'finish')` (end card "ROUND OVER"; prizes and coins kept by `pgRoundEnd`), or a win if every prize is in. Home = the round's top Home button's own tap path. Auto-pause: `window.appPaused(true)` (native onPause, screen off) and `visibilitychange` hidden. Diag events `pause`/`resume`.
- Level 1 is the intro: `PGL_LEVELS[0]` has no rain coins and no Quake; its bonus drops are plain `coin` (a missing goal prize still comes back as itself). Since UAT 70 its cheese and shrimp are back at production's Oct 31 spots, `['cheese',140,610],['shrimp',260,690]`, and the pop-up's Finish button reads END ROUND (same behaviour).


## CP-56 Phase B (UAT 72, November 16, 2026)
Pinned UAT 71 plus sock B, biscuit A, sardine B, egg B, box A. work/cp72/build.py preloads 128px PNGs into WILD_ART for all shared consumers; same size/collider and frozen pickup. Validation: checks72.cjs; package/publication: stage.py, publish.ps1, verify-cloud.py. Complete 45-file game-only update; report tickets/CP-56.md.
