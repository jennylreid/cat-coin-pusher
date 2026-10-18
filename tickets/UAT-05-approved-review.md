# UAT-05 — Continuous comet trail; aim guide removed

**Status: revised B motion ready for review, NOT published. October12, 2026.**

Jenny requested removal of the target circle and dotted aiming line, and a bright comet/Tinker Bell trail visible throughout the fall. This revision supersedes the first foreground/glitter preview.

![Phone-sized continuous comet trail](UAT-05-B-comet-motion.gif)

![Foreground coin and trail](UAT-05-B-comet-phone.png)

## Result

The aiming-guide function and its call are removed entirely: no target ellipse and no dotted aiming line. Normal landing-impact feedback is unchanged. Aiming still maps the tap immediately to the same accepted physical lane; the visible coin fall now supplies the lane feedback.

The coin sheds bright gold and warm-white dust/glints during the entire airborne period. Emission positions are interpolated between rendered frames at180 samples/second, four grains per sample, so fast movement forms a continuous flowing trail rather than isolated clusters. Particles remain behind at their emitted positions, drift sideways/upward, twinkle individually and fade over220–350ms. Emission stops at landing, while existing particles finish fading. This replaces the earlier small grains attached to the coin. Fine glints have restrained local halos for visibility against the head and sky; no head/table artwork or its edges changed.

The foreground fall still starts at the actual screen top and remains in front of the head/HUD. Taps still spawn and charge the coin synchronously before any tick, with no queue or extra delay. The brass pusher, board/exit containment wrappers, display projection, physics, input mapping, cat/faces/paws/poses, global layout and sounds are unchanged from the selected B candidate. The emitter uses a local integer hash and no gameplay random calls. Removed-body trail entries are discarded.

## Verification and limits

The final revised draft passed the300-frame rapid-drop/Quake containment audit with zero overlap pixels and zero unclipped currency calls. Full Rapier trajectory hashes match baseline at60 samples over6seconds, including drops and Quake. Cat functions and all live runtime art remain unchanged. See UAT-05-B-comet-verification.json and UAT-05-B-comet-checks.json beside this report.

The existing B board results86/113 and119/127 and Quake15/45 and12/51 remain the baseline for this graphics-only revision; no physics, timings or balance code changed. The earlier detailed regression results remain archived below. Native render frames are1080×2404 with the same reconstructed safe-area profile; the looping phone-aspect GIF is540×1202 at30fps. This is a desktop game-runtime preview, not an installed phone capture or a phone performance measurement. Actual phone particle-performance review remains pending.

Published UAT remains20261012184647/APK2; production remains20261012120202/APK14. All22 live runtime files still match published UAT-07 (BUILD stamp normalised). Update/APK hashes are unchanged. No build, packaging, publication, ADB or USB debugging was performed.

**Wait for Jenny's explicit OK on this motion before integrating or publishing.**

---

Earlier foreground/glitter and A/B reports below are historical where superseded.


# UAT-05 — Selected B, foreground fall and glitter revision

**Status: revised B preview prepared; awaiting Jenny's explicit OK before publication. October 12, 2026.**

Jenny selected B and requested a fully visible fall in front of the cat, with a short warm gold/white glitter tail replacing the pale cross sparkles. This supersedes the earlier A/B selection request. A is retained only as historical review evidence.

![Phone-sized revised B motion](UAT-05-B-foreground-glitter-motion.gif)

![Coin and glitter crossing the face](UAT-05-B-phone-foreground-glitter.png)

The animation shows two immediate taps in different accepted lanes. Native frames are1080×2404 with the same reconstructed safe-area profile; the looping GIF is540×1202 at30fps for a manageable phone-aspect preview. These are desktop runtime renders, not installed phone captures.

## Change and boundaries

- The airborne coin is now drawn after the head and HUD, so it remains visible from the actual screen top, briefly crossing the face, down onto the pusher. Its screen-space top origin accounts for the unchanged fitted view.
- A compact tail of48 irregular fine gold, pale-gold and warm-white grains replaces the crosses. The tail narrows toward the coin and fades along its length. It remains while the coin falls and fades over120ms after landing. No cyan dust or evenly spaced cross marks remain.
- Particle grain is generated with a local integer hash; it consumes no gameplay random numbers. Decoration and landing-fade bookkeeping do not change Rapier state, input or timing.
- The brass pusher function, board and payout containment wrappers, display projection, aiming guide and synchronous drop wrapper are identical to the selected B draft. Only the sky portion of the airborne clip extends to the screen top and meets the felt boundary to allow the complete fall. Settled currency remains clipped inside the rails.
- A tap synchronously creates the fresh coin and deducts its cost before any tick, verified directly. There is no queue, carriage or added release delay.
- Cat art, expressions, mitts, poses, global layout and sounds remain unchanged. The glitter tail is a code-native canvas effect, using existing warm star colours; no new cat or table art is generated.

## Checks

The full-body Rapier trajectory comparison matches baseline and prior drafts. Revised B board regressions remain86/113 (Board1) and119/127 (Board2), all won with zero settled idle falls. Quake spills remain15/45 and12/51, and power exclusion/no-cost/roar-before-slam/reset checks pass. The final300-frame revised-B rapid-drop and Quake audit is recorded in UAT-05-B-glitter-verification.json, with zero coin pixels outside the allowed sky/felt/front-exit regions and zero unguarded currency draws. As before, the audit includes a one-game-unit antialias margin within the felt's six-source-pixel inset.

The audit mask fills its allowed sky/felt regions separately so their antialias overlap forms a union; initial mask winding cancellation was a harness issue, corrected without relaxing the felt boundary. Cat-function comparisons normalise line endings only. Immediate spawn, foreground draw order and unchanged shared functions are recorded in UAT-05-B-revision-checks.json. Original A/B artifacts remain archived.

## Publication state

Only isolated review sources were changed. The22 working runtime files still match published UAT-07 (HTML build stamp normalised); UAT stays20261012184647/APK2 and production20261012120202/APK14. Published update/APK hashes remain those in the earlier report below. No packaging, build, update payload publication, ADB or USB debugging was performed. Phone visual/performance review is still pending.

**Next: wait for Jenny's OK on this revised B motion, then integrate only the approved UAT-05 graphics into UAT and back up before publishing.**

---

The original A/B review below is historical. B has been selected; its earlier behind-head fall and cross sparkles are superseded.


# UAT-05 — Brass pusher, containment and A/B coin delivery

**Status: review prepared; awaiting Jenny's A/B pick. NOT published. October 12, 2026.**

The saved A/B drafts were resumed after the connection interruption. Final containment checks, physics comparison and regression tests passed. These are isolated review drafts; the working game still matches published UAT-07, **20261012184647 / APK 2**. Production remains **20261012120202 / APK 14**. No APK, game update payload or release version was changed.

## Phone-sized comparison

Both panels use the same board state, viewport **1080 × 2404**, and reconstructed safe-area insets (37 pixels horizontal, 164 top). These are renders from the game runtime, not captures from an installed phone. The early frame shows B's coin above the head; the release frame and motion preview show its travel toward the table.

![A sliding brass dropper versus B falling coin with sparkle trail](UAT-05-A-vs-B-from-top.png)

![A versus B at release](UAT-05-A-vs-B.png)

[Motion comparison](UAT-05-A-vs-B-motion.gif) · [Mechanism close-up](UAT-05-mechanism-close-up.png)

## Shared changes in the review drafts

- Coin rendering fits the existing felt interior rather than extending over the raised rails. Coin centres and drawn scale follow this fitted plane; original coin sprites, physical radius, mass and wall colliders remain unchanged.
- Board coins are clipped to a traced felt boundary, inset six source-image pixels. Airborne coins use the sky/felt opening; payout coins pass behind the front frame until below it. Every currency draw path is guarded by its containment clip.
- The pink pusher and old gold feed band are replaced in the drafts by a brushed-brass slab, contact shadow and rear slot. The slab's lower face is at felt height zero. Its physical 18-unit thickness, width, length, stroke, collider and timing remain unchanged.
- Both versions show the accepted lane using a dashed guide and landing ellipse. The original eight-lane drop quantisation remains to preserve gameplay balance; screen aiming is mapped to the fitted display plane.

**A:** a small brass carriage slides toward the accepted lane over 120 ms. This movement is cosmetic; it introduces no release queue, input delay or new drop limit. During rapid taps, earlier airborne coins continue on their original physics while the carriage heads to the latest lane.

**B:** the coin appears falling from the top with a deterministic sparkle trail. Its display offset fades to zero by 0.28 seconds, before landing. It passes behind the cat so it does not obscure the face. Actual coin spawn, velocity and contact timing remain unchanged.

The head, faces, mitts, poses, sounds, global view/layout and table artwork are unchanged. The original `proj` function remains intact, including its use by paw rendering; only coin/pusher display mapping and decorative delivery are changed. All existing runtime assets remain byte-identical. Brass material is a new review-only image-tool asset; the prompt is archived in brass-material-prompt.txt.

## Containment verification

Final drafts were checked for **300 rendered frames each**, with rapid drops every five ticks (0.0833 seconds) and Quake during the run. Transparent coin-only renders were compared against the allowed sky/felt/front-exit regions, using the recorded camera transform.

| Check | A | B |
| --- | ---: | ---: |
| Frames tested | 300 | 300 |
| Coin pixels checked | 14,224,633 | 14,503,184 |
| Pixels outside allowed regions | 0 | 0 |
| Frames with an overlap | 0 | 0 |
| Unclipped currency draw calls | 0 | 0 |

The audit allows a one-game-unit antialias fringe around the permitted boundary, inside the six-source-pixel safety inset. This is a sampled stress test plus draw-path containment guards, not a claim that every possible future frame was exhaustively tested. Phone visual/performance acceptance remains pending.

## Regression results

Full Rapier body positions, rotations, linear/angular velocities, board counters and pusher state were hashed at **60 samples over six seconds** for published baseline, A and B, including five drops and Quake. All three trajectories match exactly.

| Board / strategy | SPEC spend | A | B |
| --- | ---: | ---: | ---: |
| Board 1, 0.40-second cadence | 86 | 86 | 86 |
| Board 1, 0.22-second cadence | 113 | 113 | 113 |
| Board 2, 0.40-second cadence | 119 | 119 | 119 |
| Board 2, 0.22-second cadence | 127 | 127 | 127 |

All strategies won; settled idle falls were zero. Budget/timer checks passed. Fresh Quake spilled **15 of 45** coins on Board 1 and **12 of 51** on Board 2 for both versions, matching the baseline. Power exclusion, no coin cost, roar-before-slam and reset checks passed. No physics or gameplay-balance differences were found.

Cat functions `drawRestMitt`, `drawPaws`, `drawHappyFeatures`, `drawHappyPaws`, `powerFace`, `previewHappy` and `quakeHeadOffset` are byte-identical. All 22 live runtime files match the published UAT payload after normalising only the HTML build-label stamp. The only differences are the proposed graphics described above.

Evidence: UAT-05-verification.json, UAT-05-board-results-A.json / B.json and UAT-05-power-results-A.json / B.json, beside this report. Reproducible review sources and material are retained in the chat's outputs/UAT-05 and the original workspace's work/uat05 / outputs/uat/uat05.

## Channel integrity

Verified SHA-256 values remain:

- UAT update JSON: `8f4991f4b48e693959eb88347ea529d1762c3dd38537eac12e2f506f0affb817`
- Production update JSON: `f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`
- Production APK: `e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

No ADB or USB debugging was used. No build or publication was performed. Wait for Jenny's pick before integrating/publishing UAT-05; production is outside this ticket. The release-channel table stays unchanged.
