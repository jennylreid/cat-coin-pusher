# UAT-09 — Published approved performance, front-edge and sparkle fixes

**Status: PUBLISHED to UAT, game 20261012220659 / APK2. Jenny reports the updated game seems okay (October13, 2026). Exact Pixel FPS remains unmeasured. October12, 2026.**

Jenny approved the before/after preview and requested publication. This is the exact approved draft, with no further design changes. UAT-08 remains deferred. Production is unchanged.

## Released result and cause

UAT-05 rebuilt/clipped a complex felt path for every body and allocated radial gradients for every sparkle. Some settled coins kept the physics fresh flag, causing lingering foreground glitter. The approved fix uses a reusable coin layer/cached side mask, and a visual airborne check that leaves physics flags untouched. Crisp gold/white comet grains still drift, twinkle and fade throughout the incoming fall, without radial blur over the coin pile.

The centre front wooden rail is now open, retaining side rails/corner posts and a thin felt edge. Tipping coins remain visible, and payout rendering continues from the body's actual fitted position and rotation instead of disappearing behind the rail and restarting under it. The actual physics floor, removal, collection and sound timing are unchanged.

Cat/faces/teeth/mitts/poses, brass pusher appearance, incoming comet path and immediate tap behavior are preserved. Only index.html changed; all existing23 runtime files are included,14 art assets remain byte-identical. No physics/balance, art-file, APK, app-ID, signing-key, save/settings-key or update-path changes. Happy remains preview-only; Rest remains board clear; UAT-04 remains cancelled.

![Approved full-board before and after](UAT-09-before-after.png)

The approved front-edge motion is UAT-09-front-edge-motion.gif. Detailed investigation, controls, source audit, sparkle close-up and test evidence are retained in UAT-09-approved-review.md and its adjacent images/JSON files. Desktop HUD FPS labels are not measurements.

## Verification

The packaged HTML, after normalising its build stamp, equals the approved draft exactly. All23 encoded files match staging; all non-HTML files and the APK match the previous UAT release. Integrated power checks rerun successfully: Quake spills15/45 and12/51, mutual exclusion, no coin cost, roar-before-slam and reset pass. Approved draft board spends86/113 and119/127 remain unchanged, as do60 full-state physics samples over8seconds. Side-mask audit had0 escapes; drawing does not mutate physics fresh flags.

Controlled92-body headless desktop Edge draw/flush averages: pre-UAT-05 baseline69.25ms, published UAT-05 423.49ms, approved final66.92ms. Roughly84% less cost than UAT-05, around the earlier desktop baseline. **This is not a Pixel FPS measurement or a guarantee of120fps. The actual full-board Pixel FPS still needs to be checked after loading this update.** Phone sync/reload is not verified from desktop. No ADB or USB debugging was used.

## Publication and rollback

Published **uat/CatCoinPusher-UAT-game.json**, game 20261012220659, APK2 unchanged, channel catpusher-uat, appID com.jenny.catpusher.uat. Use the existing OneDrive UAT game-update flow after sync; no APK reinstall is required.

Backup made before publication: **uat/backups/before-20261012220659**. Prior UAT JSON/APK/metadata, spec/handoff and approved review report saved; backup JSON matches UAT-05 exactly. Temporary-file replacement and post-copy hashes/decoded-file checks passed. To roll back, republish the saved game with a fresh higher version.

UAT JSON SHA256: `f677431bcbb935bda60b1d291728c0fb48a5d588c81bb1a129fbb75522fd4888`

Unchanged UAT APK SHA256: `43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production stays20261012120202/APK14: JSON `f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`, APK `e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`, verified unchanged before/after.

SPEC release table/current behavior and SESSION_HANDOFF/CODEX_BRIEF updated. Publication verification: UAT-09-release-verification.json; source proof: UAT-09-implementation-proof.json. Remaining acceptance: Pixel full-board FPS, visible front-edge fall and sparkle clarity on the installed updated game.


## Phone feedback — October13, 2026

Jenny reports: "seems okay". Recorded as positive overall feedback on published UAT-09; no exact FPS or separate front-edge/sparkle measurements were supplied. No further changes or production promotion requested.