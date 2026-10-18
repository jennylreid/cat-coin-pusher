# UAT-09 — Performance, open front edge and crisp comet sparkles

**Status: REVIEW DRAFT; awaiting Jenny's OK before publishing. Pixel FPS acceptance remains pending. October12, 2026. UAT-09 takes priority over UAT-08.**

Published UAT remains20261012204534/APK2. Production remains20261012120202/APK14. The changes are isolated in work/uat09/after.html; all23 live runtime files still match the published UAT-05 payload after normalising its build stamp. No packaging, version bump or publication was performed.

## Before and after

![Full board, published UAT-05 versus UAT-09 draft](UAT-09-before-after.png)

![Real tipping coin at the front edge, before and after](UAT-09-front-edge-motion.gif)

![Rear coins and sparkle detail](UAT-09-sparkle-close-up.png)

The original Pixel evidence is UAT-09-original-phone.webp (copied from Screenshots/uat05-published-26fps-front-rail.webp). It shows26fps, the closed front wooden rail, cropped front coins and white/gold haze over the rear pile. The matching full-board comparison above is a desktop browser runtime render,1080×2404, using the same seeded92-body scene and simulated tap sequence for both versions. HUD60fps is a dormant/default value in the controlled test, not a measured frame rate. The32-frame motion comparison uses the same actual Rapier coin placed partly over the physical front edge with the same velocity, making the tipping/exit visibility easy to inspect; it is a diagnostic fixture, not a gameplay change. No installed-phone after capture exists yet.

## What caused the regression

1. UAT-05 rebuilt the approximately586-segment felt outline and applied a complex clip separately for each rendered body, every frame. In the controlled120-frame full-board run, the published version made about9.0million main-context line calls and13,942 clip calls.
2. The comet emitted many particles and created a radial gradient and halo for every live particle on every frame:757,133 radial gradients in the same120-frame test. Some settled coins keep the physics `fresh` flag until its impact-condition bookkeeping fires, so using that flag alone allowed continued glitter and foreground rendering on coins already resting in the pile. That prolonged the cost and caused the blurry blobs.
3. The board draw clip ended at the felt front, although the physics floor is open. Payout rendering was then hidden above game-y600, behind the drawn wooden rail. The payout also started with the old projection rather than the UAT-05 fitted coin position. These display choices chopped tipping coins, hid their transition and made them appear to pass beneath the rail.

## Proposed fixes

- Draw board bodies without a complex per-body clip into one reusable coin layer. Apply a cached side-rail alpha mask once to that layer and composite it onto the game. The mask follows the traced side boundary with a small inward allowance; its front is open. Buffers/mask are reused and rebuilt only when viewport size/density changes. This keeps settled coins inside the side rails without rebuilding/clipping hundreds of path points for each coin.
- Use a visual airborne predicate for the incoming coin and trail, based on first descent, elapsed flight and actual vertical motion. Once descending stops, the trail cannot restart for that coin. A render-only surrogate returns lingering-`fresh` coins to normal board draw order; the real body/physics `fresh` flag is untouched. Trails are cleared on reset and removed-body entries are discarded.
- Keep the same foreground top-to-pusher comet path and immediate tap spawn. Gold/warm-white dots and scattered sharp glints still drift, twinkle and fade; the expensive radial halos are removed. Emission is reduced from180samples/sec×4grains to120×2, with190–290ms lifetimes. Dust is restricted to the airborne region above the pusher, keeping it off settled coin faces.
- Render the centre front wooden rail open, retaining the existing side rails and corner posts. A thin underside edge marks the felt. The original table image is not edited; only the front centre is masked during drawing. No cat, paw or brass-pusher artwork changes.
- At actual physics removal, capture the body's fitted screen position and rotation. Continue the payout drawing from that position/rotation instead of hiding it until below the rail or restarting at the old projection. A visual tumble carries that tipping rotation into the fall. Physical removal, collection, quest, sound and payout timings remain identical.

## Desktop performance evidence

Same viewport1080×2404,92 bodies, deterministic taps,120 measured frames per case. Timings include game drawing and a synchronous raster flush in isolated headless desktop Edge. This environment is much slower than the Pixel's normal GPU rendering; these numbers are comparative renderer timings, **not device FPS or a120fps guarantee**.

| Runtime | Mean draw/flush ms | Median ms | p95 ms |
| --- | ---: | ---: | ---: |
| Pre-UAT-05 / UAT-07 baseline | 69.25 | 61.10 | 144.50 |
| Published UAT-05 | 423.49 | 370.10 | 657.90 |
| Final UAT-09 review renderer | 66.92 | 63.80 | 90.30 |

The final mean is about84% lower than published UAT-05 and approximately back to the earlier desktop baseline; its median is about4% higher and p95 lower. Earlier intermediate drafts were still slower than baseline; they are not the proposed result. The final renderer removes all comet radial gradients and per-body board clips. Raw logs and the authoritative comparison are UAT-09-performance-summary.json, UAT-09-browser-performance.json and UAT-09-browser-performance-final-after.json. Main-context counters do not include the final offscreen-layer operations, so their reduced totals are not presented as a full-workload comparison.

**The actual Pixel smoothness/120fps acceptance cannot be confirmed from these desktop tests. It needs a full-board phone check after an approved UAT update. No ADB or USB debugging was used.**

## Preservation and tests

- Before/after Rapier translations, rotations, velocities, board counters, status and pusher position match at60 samples over8seconds, including rapid drops and Quake.
- Board1 spends86/113 and Board2 spends119/127 at0.40/0.22-second cadence; all won, settled idle falls0. Quake spills15/45 and12/51; exclusion/no coin cost/roar-before-slam/reset pass.
- Core `step`, `update`, `tryDrop`, `fallOff` and `loadArt` function bodies are unchanged. The added fallOff wrapper captures display metadata only. Cat/Rest/Happy paw functions, brass `drawTongue` and incoming `__fallDisplay` are byte-identical.
- Drawing does not change body `fresh` flags. Twelve side-mask pixel audits during rapid drops/Quake checked636,820 visible coin-layer pixels: zero outside the traced side bounds with a one-game-unit antialias allowance. Reset empties visual trails.
- All existing art files remain byte-identical, including the cat and brass PNG. No mass/radius/gravity/friction/wall/pusher/cost/rate/budget/target/physics changes. The only altered table appearance is the requested open centre front edge. Incoming comet trajectory and immediate taps are retained; its sparkle rendering is made crisp and cheaper.

Evidence beside this report: UAT-09-native-verification.json, UAT-09-source-and-containment-audit.json, UAT-09-front-continuity.json, UAT-09-board-results.json and UAT-09-power-results.json. Reproducible before/after source copies are retained in the chat outputs/UAT-09.

Published UAT JSON SHA256 remains `691d9e860ebc19e5e10e9a284845174599080e65c26d680fd63a5068cea95d9d`. Production JSON remains `f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`. No update/APK files have been written during this ticket. SPEC release-channel table remains unchanged; handoff/spec checkpoint records this review-only state.

**Next: Jenny reviews these before/after visuals and motion. Wait for her explicit OK before integrating/publishing UAT-09; then verify the full-board FPS on her Pixel. UAT-08 remains deferred.**
