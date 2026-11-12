from pathlib import Path
import json
p=Path('tickets/CP-25.md');s=p.read_text(encoding='utf-8');note='''# CP-25 Stage 4 investigation — physics regression identified; decision pending

**UAT16 failed on Jenny's phone: about 13 FPS holding, no usable slide-follow. Pickup work stopped.** Updated brief read and PRIZE LOST decision recorded: keep same-board retry; no change.

[Identical four-build comparison](CP-25-evidence/perf-rework/profile-production.json): Board1, seed42, 360 fixed ticks, 15 identical requests 0.4 seconds apart over the same 130–270 sweep, 400×889 CSS / DPR2, draw every tick, first60 ticks excluded from timing. Pinned versions/hashes: `work/cp25/perf-rework/baselines.json`. All runs accept15 drops and end at70 objects.

| Build | Physics ms/tick | Drawing ms/frame |
|---|---:|---:|
| Production 2026.10.27 | 2.86 | 66.98 |
| CP-22 2026.10.28 UAT1 | 38.02 | 57.90 |
| UAT16 | 35.53 | 27.28 |

**The physics regression is already present in CP-22**, before CP-25's purse, Inventory or hold input: four solver intervals per tick versus production's one, each with full pairwise hard-contact projection, rotation control and swept delivery checks. UAT16 cost breakdown: native solver10.46 ms/tick, `solidCoinContacts`16.45, rotation3.53, delivery2.71; most of the remaining time is body reads/setup. `save()` averages1.48 ms per call,13 calls in the measured five-second section: not the dominant cost. Drawing has improved since production (older full-screen offscreen/matte/compositing and contact-order drawing costs differ). **Do not claim an overall production-to-UAT frame-rate regression from this software renderer:** production drawing is slower here. It identifies a large physics-cost regression plus a separate drawing cost, not a phone GPU measurement.

CPU sampling (`work/cp25/perf-rework/uat16.cpuprofile`) identifies contact queries/native wrappers, pair repair and polygon overlap testing. A native query/pose caching experiment preserved sampled results but did not improve the final matched physics timing reliably (37.72 vs35.53 ms/tick); rejected and excluded from the candidate. It will not ship merely because it is complicated. A simpler convex overlap drawing test is being retained only after equality/pixel checks. Physics rules and four intervals remain unchanged in the diagnostic candidate.

## Larger options — Jenny's decision before feel changes

| Option | Likely benefit | What could feel different |
|---|---|---|
| **Two collision intervals instead of four — recommended next trial** | Reduces repeated solver/contact work; actual gain must be measured, not assumed to halve | Landings, pile compression and stack stability can change. Keep current gravity, friction, damping, CCD, drop rate and layout; rerun CP-22 pass-through/flip/pile checks before any UAT |
| More aggressive sleep/freeze until nearby contact | Less work when most coins are still | Delayed waking could make a pile feel stiff or initially unresponsive; normal Rapier sleeping already exists |
| Cached/coarser coin drawing | Less drawing work | Approximate angles could change visible tilt/edge detail; an exact equivalent overlap test is the safe first change |
| Cap the number of moving coins | Hard upper bound on work | Coins may stop unnaturally or pushes may propagate poorly; not recommended as the first trial |

## Finger follow and phone diagnostics

[UAT16 scripted follow](CP-25-evidence/perf-rework/finger-baseline.json) at60/13/5 FPS: every emitted coin matches the latest delivered move; no separate stale-position bug reproduced. However, capping elapsed simulation time at0.05 seconds makes the stream slow as frames fall behind: over three seconds the test produces15/10/4 drops respectively. A blocked main thread also delays delivery of touch events. This is **not** proof the phone's finger-follow passes. Candidate uses newest raw/coalesced input, ignores stale/other-pointer samples and updates aim immediately, retaining pointermove fallback and the .20-second simulation gate. [Functional checks](CP-25-evidence/perf-rework/functional.json).

Developer candidate readout adds **physics ms/frame, drawing ms/frame and physical coin count** alongside rolling FPS. Physics includes all catch-up ticks in a rendered frame; figures average over three seconds, refresh twice per second and reset after app visibility transitions. Diagnostic candidate/reviewable source: `work/cp25/perf-rework/candidate.html`, builder `build.py` with `frame.js`, `input.js`, `overlap.js`. Source assertions retain the entire contact/step implementation byte-for-byte from UAT16.

**Current publication remains failed UAT16 while final diagnostic validation runs.** Planned UAT17 is explicitly a diagnostic/no-feel drawing/input build, not a claim of fixed lag. Await Jenny's approval before reducing solver intervals or changing how resting/moving coins behave. Pickup art/builds remain stopped.

---

''';p.write_text(note+s,encoding='utf-8')
