# UAT-05 — Published approved B comet delivery

**Status: PUBLISHED to UAT, game 20261012204534 / APK2, October12, 2026.**

Jenny approved the final continuous-comet motion and requested publication. Production is unchanged. Earlier A/B and glitter revision reports are archived in UAT-05-approved-review.md; A and superseded glitter drafts are not shipped.

## Released behavior

- Coins render inside the existing felt/rails, including rapid drops and Quake. Shared board and payout clipping remain as approved.
- The pusher is brass/gold, resting on the felt and emerging from a rear slot, with the original physical slab, stroke and timing.
- B drops a coin immediately at the tapped accepted lane. The full fall is visible in front of the cat, starting at the screen top. No carriage, target circle or dotted aim line.
- Gold/warm-white grains and scattered glints are shed throughout the airborne fall. Emission positions interpolate between frames; particles drift, twinkle and fade220–350ms behind the coin. Emission stops at landing; existing grains finish fading.
- Cat/faces/teeth/mitts/poses/layout/sounds and gameplay balance remain unchanged. Happy stays the six-second Settings preview, usage TBD; board clear stays Rest. Waiting and Sharp Grin are retained.

![Released-source phone render](UAT-05-released-preview.png)

The approved phone-size motion remains UAT-05-B-comet-motion.gif beside this report. Native desktop-runtime frames are1080×2404 with reconstructed safe-area insets; GIF540×1202 at30fps. These are not installed phone captures or phone FPS measurements.

## Implementation and checks

Only index.html and the new approved material **img/art/brass-pusher.png** differ from UAT-07. Every existing non-HTML asset is byte-identical. The approved B source is unchanged except for loading that same PNG through the normal asset loader and packaging the build stamp. Three released-source frames (idle, coin crossing the face, and coin above the pusher) are **pixel-identical** to the approved preview, zero changed pixels. There are23 runtime files and14 art assets.

The original world projection used by physics/paws, Rapier body dimensions/masses/walls/pusher, drop spawn/velocity/contact timing and eight-lane quantisation remain unchanged. Display-only coin fitting and aim inversion match the felt. Airborne coins cross the rear entry area; settled coin drawings and payout drawings retain the approved containment guards. Trail particles use a local hash, not gameplay randomness. A tap creates and charges the coin before any tick.

Final approved-draft containment:300 frames with rapid drops every5 ticks and Quake,14,658,970 currency pixels checked, zero outside audited sky/felt/front-exit bounds and zero unclipped currency calls. A one-game-unit antialias allowance remains inside the six-source-pixel felt inset. The full Rapier state hashes match baseline at60 samples over6seconds. This is sampled validation plus guarded draw paths, not exhaustive future-frame or device-performance proof.

Released-source board regressions rerun: Board1 spends86/113 at0.40/0.22s; Board2 spends119/127, all won, settled idle falls0. Released-source Quake rerun:15/45 and12/51; exclusion/no-cost/roar-before-slam/reset pass. Cat drawing functions remain unchanged. Evidence: UAT-05-release-verification.json, UAT-05-render-verification.json, UAT-05-implementation-proof.json, UAT-05-release-board-results.json and UAT-05-release-powers.json.

## Delivery and rollback

Published **uat/CatCoinPusher-UAT-game.json**, channel catpusher-uat, applicationId com.jenny.catpusher.uat. All23 encoded files match staging, packaged game stamp 20261012204534. The APK bytes, APK version2, signing key, app ID, save/settings keys and update path are unchanged. This is a **game-only update** through the existing OneDrive UAT update flow; no APK reinstall is needed.

Backup made before publishing: **uat/backups/before-20261012204534**. Previous UAT JSON/APK/metadata, spec/handoff and approved ticket report are saved; backup JSON matches published UAT-07 exactly. Publication used temporary-file replacement followed by hash and decoded-payload checks. Rollback requires republishing the saved game with a fresh higher version.

UAT update JSON SHA256: `691d9e860ebc19e5e10e9a284845174599080e65c26d680fd63a5068cea95d9d`

Unchanged UAT APK SHA256: `43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production remains20261012120202/APK14. JSON SHA256 `f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`; APK SHA256 `e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`. Both checked unchanged before and after publication.

SPEC release-channel table and current UAT behavior, SESSION_HANDOFF and CODEX_BRIEF updated. No ADB/USB debugging used. OneDrive file publication is verified; phone sync, reload, visuals and particle performance remain unverified from desktop.
