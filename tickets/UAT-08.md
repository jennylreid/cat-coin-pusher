# UAT-08 — Timing-based coin landing

Status: PUBLISHED to UAT 20261013164950 / APK2, including the approved visible sparkle correction. October13,2026. Phone120fps acceptance remains pending.

Started from the decoded, exact published UAT 20261012220659 / APK2 payload. Approved implementation: `work/uat08/draft.html`; baseline: `work/uat08/baseline.html`. Production 20261013160516 and both APKs remain untouched.

## Change

Every tap creates and charges for one coin immediately. Only horizontal position is selected; tap depth is ignored. The landing line is fixed at depth 247, 28 game units behind the fully extended ledge front (275). Horizontal aiming is continuous, clamped to the existing side boundaries, rather than snapped to a mouth exit. The existing exit registration still supplies the release tilt and height.

Rapier's existing solid moving ledge, friction and backstop provide the two-tier behavior: a supported coin rides the ledge; retraction and the backstop strip it over the front onto the lower table. An arrival with the ledge behind the line falls onto the lower table. Arrival phase matters after the fall, so players can learn the advance to give their taps. Edge arrivals can tip across the ledge front naturally.

Only three source replacements: fixed DROP_Y, removal of phase-dependent release depth, and continuous horizontal release. Cat/faces/poses, sparkle fall renderer, brass art/drawing, layout, cached rendering and UAT-09 front-edge payout fixes are unchanged. No new per-frame processing, assets, effects or allocations were added.

## Phone-size motion

![Real game motion, ledge landing then table landing](UAT-08-phone-motion.gif)

540×1202 preview uses actual game frames with the existing Android safe-area inputs, not a generated mockup. First sequence: ledge catch and transfer; second: direct lower-table arrival. Silent GIF, 10 sampled frames/second; HUD FPS is a test-runner label, not a device measurement. Full trajectory evidence is UAT-08-motion-trace.json. A sparse-board trace additionally isolates the ride and stripping without pile occlusion.

## Gameplay comparison

Same seeded boards, target-following bot and 0.4 / 0.22-second cadences; no powers. All four runs won within the timer.

| Check | UAT-09 baseline | UAT-08 draft | Change |
|---|---:|---:|---:|
| Board 1 spend, 0.4 s | 86 / 140 | 109 / 140 | +23 |
| Board 1 spend, 0.22 s | 113 / 140 | 140 / 140 | +27 |
| Board 2 spend, 0.4 s | 119 / 160 | 117 / 160 | −2 |
| Board 2 spend, 0.22 s | 127 / 160 | 129 / 160 | +2 |
| Board 1 Quake | 15 / 45 | 15 / 45 | unchanged |
| Board 2 Quake | 12 / 51 | 12 / 51 | unchanged |

The old release always placed the coin in front of the moving ledge. The new fixed line can feed the upper tier, delaying its contribution to the lower pile until transfer. Continuous horizontal aim also changes pile contacts. These two intentional changes alter deterministic collisions and target progress; the numbers do not isolate their individual contributions. Board 1 is less efficient at these unchanged cadences. Its faster run spends every coin (no spare allowance); its slower demonstrated win retains31, a28.4% allowance-over-spend margin. Board 2's slower win retains43, a36.8% margin. Clear times43.57/41.05s and46.48/28.23s. No board budget, timer, seed, target, power strength or pile physics tuning changed.

## Verification and remaining acceptance

Immediate spawn/cost and exact requested X at80/200/320 pass across five phases, with identical247 depth despite supplied tap Y600. Sparse-board traces verify top height around20, travel with the ledge on retraction, then table height around2; the retracted arrival lands at table height. Fresh-board Quake remains15/45 and12/51. Board runs retain the existing collider/drawn-front alignment and settled idle checks.

Desktop native-canvas comparison at540×1202, twelve rapid inputs,90 simulation/draw samples: baseline draw13.44ms / step0.568ms; draft draw12.66ms / step0.693ms. Both end with50 bodies. This is a limited desktop smoke comparison, not phone FPS, browser throughput or full-board capacity proof. Renderer source is unchanged. **120fps acceptance remains pending on Jenny's phone after an approved UAT update.** No USB/ADB used.

Evidence: UAT-08-board-results.json, UAT-08-verification.json (pin, immediate drops, Quake and channel hashes), UAT-08-motion-trace.json and UAT-08-desktop-performance.json. Reproducible prepare/board/motion/verification/render scripts live in work/uat08. Report and preview are filed before requesting approval.

## Publication

## Landing feedback follow-up — published

Jenny reports improved timing, but a gold tinkle makes direct-table arrivals look like ledge hits. The falling dust renderer retained a fixed TONGUE_H cutoff from UAT-05. Draft correction in `work/uat08/landing-feedback/draft.html` selects ledge height18 when the fixed line is supported by the current ledge, otherwise table height0. Gold/white grain style, fade, twinkle, physical contact ring/sound, all gameplay and cached rendering remain unchanged. This addresses the visible trail ending prematurely at ledge height; Jenny was also asked whether “tinkle” refers to the visual, sound, or both.

Real phone-size preview: UAT-08-landing-feedback-motion.gif. Physics verification:60 full-state samples over8s with rapid drops are identical to published UAT-08; evidence UAT-08-landing-feedback-verification.json. Previous board/Quake results therefore remain applicable. Actual phone120fps still requires review. Jenny clarified “Visible sparkle/flash,” then explicitly approved publication with “okay go.” Published exact preview draft as UAT20261013164950/APK2, only build label updated. Sound remains unchanged. All23 runtime files verified,22 non-HTML files and both APKs unchanged. Production unchanged. Backup: uat/backups/before-20261013164950. Payload SHA256: 211cd01cd8ef5bad054a30017a000dabfa2781894d96072c100f98ea30203e5c. Evidence: UAT-08-landing-feedback-release.json. Existing OneDrive UAT update; no reinstall. Current source: published payload or work/uat08/landing-feedback/draft.html. Phone receipt/120fps pending.

## Initial publication

Jenny's “yep” approved the shown motion and UAT publication. Published `uat/CatCoinPusher-UAT-game.json`, version20261013163120, APK2, channel catpusher-uat, applicationId com.jenny.catpusher.uat. Exact approved draft shipped with only its build label updated. All23 runtime files decoded and verified;22 non-HTML files and embedded APK bytes are identical to the pinned baseline. Publication used a staged payload, temporary-file replacement and post-copy hash verification.

Backup: `uat/backups/before-20261013163120`. Payload SHA256: `0ed7fd1760b52d9f16851bc905feb830cde8e2260ed8721c1f4864a0c33d4611`. Production JSON/APK and UAT APK hashes remain unchanged; evidence: UAT-08-release-verification.json. Local release payload/source are in work/uat08; the older external outputs/uat/game source was not changed. Future work must start from this published payload or this approved draft rather than that older source.

Load the existing UAT OneDrive update after sync; no APK reinstall. Phone review should check full-board120fps, catch/ride/transfer feel and both no-power wins. Phone receipt and120fps are not verified from desktop. No production promotion is authorized by this ticket. Rollback requires republishing the backed-up payload with a fresh higher game version.

## Phone follow-up — October13,2026

Jenny confirmed accepting UAT20261013164950 (“accepted, thanks”). Update acceptance is confirmed; separate visual-fix approval and exact phone120fps measurement were not supplied in this message. No additional publication or production promotion requested.
