from pathlib import Path
import json
r=Path('.');m=json.loads(Path('work/cp25/lag/publication-manifest.json').read_text());cloud=json.loads(Path('tickets/CP-25-evidence/lag/cloud-verification.json').read_text())
report=f'''# CP-25 Stage 4 — UAT 16 lag candidate; pickup stills awaiting approval

**October 30: 2026.10.30 UAT 16 / APK4 published**, numeric **{m['version']}**. Backup, local package and fresh cloud bytes verified. **Lag acceptance remains open:** this reduces workload and fixes misleading instrumentation; steady 60 FPS on Jenny's phone has not been demonstrated. Board loop passes; Collections pass for now. Hold-to-drop awaits this phone check. PRIZE LOST retry is unchanged and remains Jenny's decision.

## Phone UAT — lag build only

- [ ] Open the UAT update and confirm **UAT 16**. Settings → Developer mode enables the header readout.
- [ ] Hold to drop and move left/right for 15–20 seconds. Coins should follow without hesitation; release should stop the stream. Report whether travel still *feels slow* separately from visible stutter.
- [ ] After three seconds, report **FPS and “slow” count**, both while holding and after release. Target: near 60 FPS with zero/very few slow frames, staying steady. “Slow” counts intervals over 25 ms in the rolling three-second window; repeated large counts fail the smoothness goal. The figure updates twice per second. App background time is excluded on return.
- [ ] Note any softness in the scene: backing resolution is capped at 2 pixels per CSS pixel, while displayed dimensions, positions and original art files remain fixed.

## What changed / evidence

Baseline: actual published **UAT 15**, pinned `work/cp25/lag/baseline.html`. Removed redundant repeated sleeping-state queries in contact pair loops and reused shape objects within each contact interval. Same pair order, solver steps, corrections, physics constants, input/drop timing and layout. At device ratio 2.7 the 2x backing-store cap shades **45% fewer pixels**. A trial backdrop cache was rejected after profiling; it is absent from this release.

The old readout averaged reciprocal, capped intervals; long stalls could be concealed. The new readout divides frame count by actual elapsed time over three seconds, includes stalls and starts at zero. [Readout checks and exact-state comparison](CP-25-evidence/lag/checks.json): 900 fixed steps / 75 drops matched UAT15 positions, rotations, velocities and sleeping states every 30 steps. Synthetic steady intervals produce 60 FPS at 16.67 ms, or 20 FPS / 60 slow frames at 50 ms.

[Before CPU profile](CP-25-evidence/lag/profile-before.json) / [after](CP-25-evidence/lag/profile-after.json), desktop native-canvas harness, 240 frames with 20 drops: mean draw **8.67 → 8.52 ms**, mean fixed-step **10.31 → 9.74 ms** (small desktop change, not proof of a phone fix). [Actual game frame/readout run](CP-25-evidence/lag/readout-desktop.json), six seconds holding per version: baseline old readout **21.1**, measured frame throughput **25.1 FPS**; candidate rolling readout **19.2**, throughput **26.8 FPS**, ending with **58 slow frames**. Different windows/readout formulas explain why these figures are not interchangeable. **This harness does not meet 60 FPS** and is not Android/WebView. Phone cause and before/after frame pacing still require device evidence; UAT15's reported 60 peak is not a steady baseline. No coin-travel tuning was made.

[Package](CP-25-evidence/lag/package-verification.json), [publication](CP-25-evidence/lag/publication.json), [fresh cloud verification](CP-25-evidence/lag/cloud-verification.json). Source `work/cp25/lag/release.html`; reproducible builder `build.py` with `contacts.js` / `frame.js`. Only packaged HTML changed. Backup `{m['backup']}`; shared OneDrive item retained. SHA-256 `{cloud['sha256']}`. Phone receipt, FPS and sound remain pending.

## Three replacement pickup concepts — stills only, no pickup build

The rejected Ribbon / Satchel bubble / Paw designs and cycle are retired from the proposed replacement. **UAT16 keeps UAT15 presentation unchanged to isolate lag.** Their removal and the new Settings choices belong to the next build, after Jenny approves the stills.

[Three phone-size concepts](CP-25-evidence/pickup-preview/three-concepts.png): **A Golden halo** — fine gold rings and warm drifting sparks; **B Moonlit orbit** — teal/pearl elliptical trails; **C Starlight bloom** — soft radial petals and scattered starlight. Individual 1080×2400 stills: [A](CP-25-evidence/pickup-preview/halo-phone.png), [B](CP-25-evidence/pickup-preview/moon-phone.png), [C](CP-25-evidence/pickup-preview/bloom-phone.png).

These are renderer-made design stills over the actual UAT16 game, with approved cheese art reused. No generated art or layout change. Preview source `work/cp25/pickup-preview/concepts.js` / `render.cjs` is not packaged. All propose a **0.35-second fade in, brief hold, 0.5-second fade out** (2.5 seconds total) with brief scene blur, no text, one chime per displayed pickup, no tap dismissal and a one-at-a-time queue. The stills show full visibility; timing, sound and Settings are not implemented/validated by them. Approved implementation will retain direct style selection and no-reward preview, remove cycle, and use bounded cached blur so the effect does not reinstate heavy full-resolution per-frame filtering.

**Pending:** Jenny's lag UAT result and approval of the three visual concepts before any replacement pickup build. Ticket remains open. Commit/push close-out follows sign-off as specified in the brief. Production and CODEX_BRIEF.md remain outside this iteration (CP-22 promotion reservation).

---

'''
# Correct the CPU value directly from saved evidence.
before=json.loads(Path('tickets/CP-25-evidence/lag/profile-before.json').read_text(encoding='utf-8-sig'));report=report.replace('10.31 → 9.74',f"{before['step']['mean']:.2f} → 9.74")
p=Path('tickets/CP-25.md');p.write_text(report+p.read_text(encoding='utf-8'),encoding='utf-8')
p=Path('uat/README.md');p.write_text(f'''# CatCoin UAT

Current: **2026.10.30 UAT 16 / APK4** ({m['version']}).

CP-25 Stage 4 lag-only candidate: 2x canvas backing-store cap, repeated contact query reduction, rolling three-second FPS and slow-frame count. Phone smoothness/hold-to-drop acceptance pending; desktop harness does not establish steady 60 FPS. UAT15 pickup presentation is retained in this isolated build; replacement stills await approval.

Source: work/cp25/lag/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Local/cloud bytes verified.
''',encoding='utf-8')
p=Path('DEVELOPER.md');p.write_text('''## CP-25 Stage 4 lag candidate — UAT16 (October 30, 2026)

Current UAT16 source `work/cp25/lag/release.html`, pinned UAT15 baseline. Rebuild with `build.py`, `contacts.js`, `frame.js`; exact published HTML reproducibility verified. renderPixelRatio caps canvas backing density at 2; use it consistently for drawing transforms/caches/resize, while CSS geometry and pointer mapping stay fixed. No source artwork changes. Contacts cache sleeping flags inside each interval and mark moved bodies awake; shape values are interval-local; all original solver equations/order retained. FPS counts raw frame intervals over three seconds, publishes every 500 ms, and counts intervals over 25 ms. Visibility transition resets sampling and frame accumulator. Native-canvas baseline comparison: 900 steps / 75 drops exact state match. Desktop performance gain is modest; phone smoothness remains open. Preview-only pickup drawings are under `work/cp25/pickup-preview/`, excluded from UAT16; existing pickup behavior remains for lag isolation. Report/evidence: tickets/CP-25.md and tickets/CP-25-evidence/lag/.

'''+p.read_text(encoding='utf-8'),encoding='utf-8')
print('Report prepended; UAT/engineering source guidance current')
