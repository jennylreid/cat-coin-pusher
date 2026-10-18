# UAT-08 rework — Coin landing timing

Status: **PUBLISHED to UAT 20261015172100 / APK2**, October 15, 2026. Jenny approved the continuous-fall preview with “yes.” Phone receipt and landing UAT for this follow-up remain pending. The previous 20261015164930 release failed phone landing UAT.

## Phone evidence and diagnosis

Jenny reports every coin pauses at the rear rail with a clink and sparkle, including after closing/reloading. Her recording is preserved beside this report: [phone failure](UAT-08-rework-phone-failure.mp4). Cropped frame sequences are in `work/uat08-rework/phone-evidence`.

The recording shows a hesitation while the coin crosses the rear rail, followed by continued travel to the supporting surface. The code has two separate motions: a fast screen-entry lift fades to zero at 0.28 seconds, then the slower physical fall continues. Measured centre-lane speed around the rail falls to approximately 103–120 game units/second in the published build. This is a rendering handoff that the earlier physical-contact checks did not test. The exact pause/clink/sparkle presentation still requires Jenny's phone confirmation after an approved follow-up.

Jenny's clarification stands: **initial falls must clear the rail; natural backward travel and rail contact after landing are wanted.**

## Follow-up change

Pinned the exact published payload. Draft: `work/uat08-rework/followup/draft.html`.

The physical body now starts at the existing top-of-screen entry point. Release gravity is scaled for the added height to retain approximately the existing arrival timing. Its rendered position follows that body throughout, so the former independent entry lift contributes effectively zero offset. Release spin lets it rotate toward flat before contact rather than drive a tilted edge into the ledge at the increased impact speed. Continuous collision detection is enabled during delivery, then disabled on the existing landing event; the out-of-bounds height guard allows the higher starting point.

Sparkle rendering, aiming and ledge drawing sections are byte-identical to the baseline. Natural friction/contact behavior and Board 1's 220 allowance remain. The higher physical fall changes impact energy and therefore pile outcomes; this is a physics change, not a claim of identical gameplay.

## Revised phone-sized motion

![Continuous fall: retracted tap to table, extended tap to ledge](UAT-08-rework-continuous-isolated-motion.gif)

Actual game/Rapier frames, 540 × 1202, Android safe-area inputs, 15 sampled frames/second. Empty-board fixture makes the contacts visible. [Populated Board 1 motion](UAT-08-rework-continuous-board-motion.gif). Silent desktop previews; the baseline build and test-runner FPS labels do not establish a new release or phone performance.

## Validation

448 drops across seven horizontal positions and the stroke, including every simulation frame around extended dwell: zero initial-fall rail contacts; all 28 fully retracted cases first land on the table; all 112 fully extended cases first catch the ledge, with at least 17 support steps (0.283 s). Natural rail contacts occur after landing. Centre-lane kinematic checks confirm the independent display offset stays below 0.001 game units and downward motion continues until landing.

Same seeded target-following bot, no powers; all four runs win within 90 seconds and pass settled-idle checks:

| Board | Tap interval | Previous used | Follow-up used / allowance | Follow-up spare | Follow-up clear |
|---|---:|---:|---:|---:|---:|
| 1 | 0.4 s | 103 | 118 / 220 | 102 | 46.98 s |
| 1 | 0.22 s | 118 | 99 / 220 | 121 | 21.58 s |
| 2 | 0.4 s | 118 | 88 / 160 | 72 | 34.82 s |
| 2 | 0.22 s | 128 | 113 / 160 | 47 | 24.75 s |

Evidence and reproduction under `work/uat08-rework/followup`: `prepare.cjs`, `verify.cjs`, `verification.json`, `boards.cjs`, `board-results-draft.json`, `kinematics.cjs`, `entry-kinematics.json`, `render.cjs`, `render-traces.json`, `gif.py`, `scope.cjs`, `scope-verification.json`. Rendering uses bundled NODE_PATH packages and bundled Python. Draft SHA256: `f99923e68afb46c2accacbc598b7c1397ad2cea801be1c9a88076631e73cde6e`.

## Publication and pending decision

Jenny approved this exact revised motion with “yes” in response to the UAT publication question. Published **20261015172100 / APK2** with only the BUILD label changed from the approved draft. Verified all 23 runtime files, payload identity and post-publication hash. Current matching HTML: `work/uat08-rework/followup/release.html`.

Backup: `uat/backups/before-20261015172100`. Payload SHA256: `9e7ec078acd444e9a104b7a7cf36780a1e51fe01da3930be651476efe6f08a12`. Evidence: `UAT-08-rework-continuous-release-verification.json`; publication script: `work/uat08-rework/followup/publish.cjs`.

After OneDrive sync, refresh the existing UAT app and accept **20261015172100**; no reinstall. Phone landing feel, sound and full-board FPS require Jenny's UAT; finite desktop tests do not prove every piled-board collision. No production promotion authorized.

Previous publication: Jenny approved the first preview; UAT 20261015164930 shipped its exact draft with the BUILD label updated. Backup: `uat/backups/before-20261015164930`. Payload SHA256 remains `9544eccc5b12c7a8345b2f5fd78d41f07f43028dd371ce7e623e9a03c2ebad22`. Publication evidence: `UAT-08-rework-release-verification.json`. Earlier report retained in `work/uat08-rework/followup/report-before-followup.md`; this phone failure supersedes its pending-acceptance status.

## Phone follow-up — October 15, 2026

After publication of UAT 20261015172100, Jenny reports “much better.” Phone improvement feedback is confirmed. This message does not separately establish both endpoint landing cases, sound acceptance, full-board FPS or final ticket sign-off. No additional publication or promotion requested.
