from pathlib import Path
import json
r=Path('.');p=Path('work/cp25/two-intervals');e=r/'tickets/CP-25-evidence/two-intervals';m=json.loads((p/'publication-manifest.json').read_text());cloud=json.loads((e/'cloud-verification.json').read_text());assert cloud['sha256']==m['stagedJSONSHA256']
a=json.loads((e/'physics-audit.json').read_text())['results'];w=json.loads((e/'wins.json').read_text());fixed=json.loads((e/'profile-baseline.json').read_text())['builds'];held=json.loads((e/'readout-hold.json').read_text())['builds'];b=fixed['baseline']['timings'];c=fixed['candidate']['timings']
rows=[]
for board in [1,2,3]:
 def used(label,gap):return next(x['coinsUsed'] for x in w if x['source']==label and x['seed']==42 and x['board']==board and x['gap']==gap)
 values=[x['coinsUsed'] for x in w if x['source']=='candidate' and x['board']==board]
 rows.append(f"| {board} | {used('baseline',.2)} → {used('candidate',.2)} | {used('baseline',.35)} → {used('candidate',.35)} | {min(values)}–{max(values)} |")
report=f'''# CP-25 Stage 4 — UAT18 two-interval trial published (October 30)

**2026.10.30 UAT18 / APK4**, numeric **{m['version']}**, published; backup, package and fresh OneDrive bytes verified. Jenny authorized **“Trial two collision intervals.”** Trial safety/clearability checks pass. **The sustained desktop run still fails steady60 FPS; lag and phone hold-follow remain open.** Pickup work is stopped.

## What changed

Two native collision intervals per1/60-second game tick instead of four (120 Hz instead of240 Hz). Delivery casts cover the matching1/120-second interval, tray interpolation covers both halves and the quiet-coin timer still counts elapsed seconds. CCD, hard-contact repair and launch limiting remain. No travel-speed or drop-rate retuning: the simulation gate stays0.20 seconds. Developer timing row moved into the gap above footer controls so it no longer covers their labels. [Source diff](CP-25-evidence/two-intervals/source-diff.txt), [readout still](CP-25-evidence/two-intervals/developer-readout.png).

## Validation

- [Pass-through / flip / pile-up audit](CP-25-evidence/two-intervals/physics-audit.json): three28-second real-engine scenarios, starting Boards1–3, centre/sweep/left requests every0.20 seconds for20 seconds then8 settling. Normal loop/award progression retained. **{sum(x['substeps'] for x in a):,} native intervals; zero confirmed pass-throughs, zero full/unearned flips, zero table rescues and zero contact samples over0.5 game unit deep.** Worst coin/treat overlap **{max(x['maxPenetration'] for x in a):.3f}** unit; worst tray penetration **{max(x['maxPlatePenetration'] for x in a):.3f}**; largest consecutive resting tilt change **{max(x['maxRestTiltStepDegrees'] for x in a):.3f}°**.
- [Launch audit](CP-25-evidence/two-intervals/launch.json): three30-second runs, zero events above2 m/s; ordinary on-board peaks remain1.20 m/s horizontal and0.35 m/s upward (floating-point tolerance).
- [Functional checks](CP-25-evidence/two-intervals/functional.json):60 fixed ticks execute exactly120 native steps; outer timestep restored; newest raw/coalesced finger sample used by next scheduled coin, stale/other-pointer samples ignored; lifting stops drops; rolling readout arithmetic passes.
- [No-power clearability](CP-25-evidence/two-intervals/wins.json): **18/18 trial clears**, three boards × seeds42/1/2 ×0.20/0.35-second cadence; **6/6 matched UAT17 seed42 baseline clears**. Each starts with the current220-coin purse and stops at first win/loss. No extra supplies or powers.

Coin usage (same target-following script; seed42 columns compare UAT17 → trial):

| Board | 0.20 s | 0.35 s | Trial range, all seeds/cadences |
|---|---:|---:|---:|
{chr(10).join(rows)}

Numerical precision changes do affect board outcomes: Board1 at0.35 seconds became substantially easier in this script (88 →52 coins), while Board2 took more (61 →70). These are disclosed effects of the approved trial, not hidden balance tuning. Jenny must judge landing/pile feel on the phone.

## Performance and limits

[Matched six-second fixed-step profile](CP-25-evidence/two-intervals/profile-baseline.json),15 accepted requests /70 final objects in each: physics **{b['step']['mean']:.2f} → {c['step']['mean']:.2f} ms/tick** (**{100*(1-c['step']['mean']/b['step']['mean']):.0f}% lower**), physics p95 **{b['step']['p95']:.2f} → {c['step']['p95']:.2f} ms**. Drawing **{b['draw']['mean']:.2f} → {c['draw']['mean']:.2f} ms/frame** with different resulting coin poses. Mean step+draw alone remains about17.9 ms, above the16.7 ms60-FPS budget; do not infer a completed fix from the physics saving.

[Twenty-second wall-clock hold/slide](CP-25-evidence/two-intervals/readout-hold.json), Board3 and the same gesture, existing non-pausing Ribbon preference in the harness: actual throughput **{held['baseline']['wallFPS']:.1f} → {held['candidate']['wallFPS']:.1f} FPS** overall, ending rolling readout **{held['baseline']['readout']['fps']:.1f} → {held['candidate']['readout']['fps']:.1f} FPS**. Both stayed playing for20 seconds. Trial physics averaged **{held['candidate']['readout']['physics']:.1f} ms/rendered frame** at the end, with three catch-up ticks and more coins in play; overload/time discard persists. Trials emit62 vs79 coins as simulation time/frame cadence diverges, so this is a real requested-gesture comparison, not matched-state timing. Desktop software canvas/CPU drawing is not phone GPU/FPS evidence.

A [spatial-index contact-scan experiment](CP-25-evidence/two-intervals/profile-two-plain.json) was slower in the dense test (18.1 →19.7 ms/tick) and was rejected before further verification; `two-grid.html` is not shipped. Final `candidate.html` equals the validated `two-plain.html`; builder does not load `grid.js`. No one-interval, freeze or moving-coin-cap change was made.

## Phone UAT — what to try

- [ ] Confirm **UAT18**, then Settings → Developer mode. For an uninterrupted performance comparison, use the existing **Ribbon** pickup setting; the old Paw style intentionally stops a hold. This is test setup, not resumed pickup design work.
- [ ] Hold and slide left/right for15–20 seconds. After three seconds and again near the end, report **FPS / physics ms / draw ms / coin count**, plus whether releases follow your current finger. Target is steady near60 FPS; a short peak or this desktop improvement is not a pass.
- [ ] Lift: drops should stop immediately. Compare the same four readouts after lifting. Watch rapid landings/piles for sinking, unwanted flips or a changed feel that is unacceptable. If FPS becomes steady but coin travel still feels slow, report that separately for a speed decision.

## Publication / pending

Baseline actual published **UAT17**, numeric20261030105723; pinned `work/cp25/two-intervals/baseline.html`. Source `work/cp25/two-intervals/release.html`, builder `build.py`; reproducible HTML hash verified before publication. Only packaged HTML changed. [Package](CP-25-evidence/two-intervals/package-verification.json), [publication](CP-25-evidence/two-intervals/publication.json), [fresh cloud verification](CP-25-evidence/two-intervals/cloud-verification.json). Backup `{m['backup']}`. JSON SHA-256 `{m['stagedJSONSHA256']}`. Existing UAT item/link, APK4 and save schema retained.

**Pending:** phone receipt, sustained FPS, hold-follow and trial feel. This is an approved experiment, not lag sign-off or production approval. PRIZE LOST same-board retry stays. Pickup work stays stopped. Ticket remains open; commit/push close-out follows sign-off.

---

'''
ticket=r/'tickets/CP-25.md';ticket.write_text(report+ticket.read_text(encoding='utf-8'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.30 UAT18 / APK4** ({m['version']}).

CP-25 approved two-collision-interval trial:120 Hz native contacts,60 Hz game clock. Cast horizon/tray interpolation/quiet timer match the new interval. Developer FPS/physics/draw/coin-count row sits above footer buttons. Safety audits pass;18/18 trial no-power clears. Desktop sustained throughput improves14.1 →20.4 FPS but still fails steady60; phone acceptance pending. Use existing Ribbon preference for uninterrupted hold tests; no pickup design/build work resumed.

Source: work/cp25/two-intervals/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Package and fresh cloud bytes verified.
''',encoding='utf-8')
doc=r/'DEVELOPER.md';doc.write_text('''## CP-25 Stage4 — UAT18 two-interval trial (October 30, 2026)

Current source `work/cp25/two-intervals/release.html`, pinned published UAT17 baseline. `build.py` verifies baseline hash and changes all four STEP/4 uses to STEP/2, both substep bounds/interpolation denominator, plus build label/readout-row placement. Thus quiet-time accrual and delivery cast horizon remain consistent; world.timestep returns to STEP after each tick. Simulation/drop gate, contact/rotation/launch rules remain; precision changes can change balance. Jenny authorized two intervals explicitly. `candidate.html`/`two-plain.html` are identical; rejected grid prototype is excluded from builder/publication.

Audit:8,540 intervals across three28-second scenarios at.20-second requests, zero through-crossings/flips/deep contacts/table rescues; max penetration.264 unit, tray.239. Launch caps retained.18/18 trial clears at.20/.35s over3 boards×3 seeds; matched UAT17 seed42 cases6/6. Mean physics12.02→6.58 ms; long native-canvas hold throughput14.1→20.4 FPS, end rolling9.1→11.7, still not steady60. Phone readouts/feel required; diagnostic CPU drawing time is not GPU completion. Developer row moved above footer controls. Existing raw/coalesced pointer sampling from UAT17 retained; old Paw pickup can intentionally stop holding, so performance comparison uses existing Ribbon preference only in the harness. No pickup work resumed. Report/evidence: tickets/CP-25.md and CP-25-evidence/two-intervals/.

'''+doc.read_text(encoding='utf-8'),encoding='utf-8')
print('UAT18 report prepended; current UAT and engineering guidance updated')
