from pathlib import Path
import json
r=Path(__file__).resolve().parents[2];p=r/'work/cp22';e=r/'tickets/CP-22-evidence';m=json.loads((p/'publication-manifest.json').read_text())
def matches(name):
 f=e/name
 return f.exists() and json.loads(f.read_text(encoding='utf-8-sig')).get('version')==m['version']
published=matches('publication.json');cloud=matches('cloud-verification.json')
status=('Published; backup/local hash verified; cloud '+('hash verified.' if cloud else 'verification pending.')) if published else 'Staged; publication pending.'
rows=json.loads((e/'uat13-wins.json').read_text());assert len(rows)==18 and all(x['result']=='won' for x in rows)
render=json.loads((e/'uat13-render-final.json').read_text());motion=json.loads((e/'uat13-motion.json').read_text());swept=json.loads((e/'uat13-swept.json').read_text())
launch=[json.loads((e/f'uat13-launch-final-{mode}.json').read_text()) for mode in ['centre','sweep','left']]
table='\n'.join(f"| {b} | {min(x['coinsUsed'] for x in rows if x['board']==b)}–{max(x['coinsUsed'] for x in rows if x['board']==b)} | {next(x['of'] for x in rows if x['board']==b)} |" for b in [1,2,3])
report=f'''# CP-22 Coin action pass

**{m['displayName']} / APK4 — {status}** Phone UAT/sign-off pending; CP-22 remains open.

Jenny sees improvement in October 27 UAT 12, but coins can now bounce across the board. This is a failed acceptance criterion, not sign-off. Previous sources/reports are archived in `work/cp22/revision1/`, `uat10/`, `uat11/`, and `uat12/`.

## Cause and correction

Restitution was already zero. The accelerated gravity used for the approved screen-top delivery fed excessive energy into oblique contacts; crowded contact corrections could add further kicks. The baseline 30-second run recorded horizontal speed **1,077 game units/s** and upward speed **271 units/s**. [Baseline](CP-22-evidence/uat13-launch-before.json).

- Sweep the incoming shape to its first impact point, dissipate the screen-delivery energy there, restore ordinary gravity and enter contact with a 120-unit/s downward speed. Keep the existing free fall until impact.
- Damp residual ordinary contact launches at each physics interval: horizontal speed at most 120 units/s and upward speed at most 35 units/s while on the board. These are explicit gameplay limits for heavy coins; there is no global change to restitution. Active Quake/sweep, free delivery and off-board payout are excluded from this damping.
- Keep the **0.35-second tap limit**, contact separation, treat occlusion and locked layout. Slower taps are not the solution.

Source `work/cp22/release.html`; builder `revise13.py` + `impact13.js`, pinned to the exact UAT 12 archive. Engineering revision 13 is labelled **October 28 UAT 1**, the first release of the new day.

## Evidence

- Three 30-second runs: Board 1 centre, Board 2 sweep and Board 3 left taps, 20 seconds tapping then 10 seconds settling. **Zero recorded events above 200 units/s horizontally or upward**. Peak upward speed {max(x['peakUpwardSpeed'] for x in launch)*100:.1f} units/s. Overall peak horizontal speed {max(x['peakHorizontalSpeed'] for x in launch)*100:.1f} units/s includes bodies outside the damping region. [Centre](CP-22-evidence/uat13-launch-final-centre.json), [sweep](CP-22-evidence/uat13-launch-final-sweep.json), [left](CP-22-evidence/uat13-launch-final-left.json). These differ in board/aim from the baseline; they are recorded scenarios, not a universal guarantee.
- [20-second real-game clip](CP-22-evidence/uat13-motion.mp4): rapid centre taps, a pile and pusher cycles, then a pause. [Pushing](CP-22-evidence/uat13-pushing.png), [settled](CP-22-evidence/uat13-settled.png). Recorded from the tested candidate before updating its build label.
- Coin/treat audit: **{render['deepSamples']} contacts over 0.5 units**, maximum penetration {render['maxPenetration']:.3f} units; identical trajectory hashes with rendering enabled/disabled and no render-induced list changes. [Rendered](CP-22-evidence/uat13-render-final.json), [headless](CP-22-evidence/uat13-no-render-final.json).
- Swept audit: {swept['substeps']} substeps, **{swept['confirmedThroughCrossings']} confirmed crossings**. [Swept shapes](CP-22-evidence/uat13-swept.json).
- Motion sample: {motion['unearnedFlipCrossings']} unearned full flips; maximum consecutive resting tilt change {motion['maxRestTiltStepDegrees']:.3f} degrees over {motion['consecutiveRestSamples']:,} samples. [Motion audit](CP-22-evidence/uat13-motion.json).
- **18/18 no-power clears**, 3 boards × seeds 42/1/2 × 0.35/0.4-second taps. Slowest {max(x['seconds'] for x in rows):.1f} seconds. [Results](CP-22-evidence/uat13-wins.json).

| Board | Coins used | Allowance |
|---|---:|---:|
{table}

CP-21 UAT 8 comparison: 66–91 / 74–100 / 75–107 coins. October 27 UAT 12: 42–74 / 34–65 / 66–83. All new runs clear within the existing allowances.

## Publication and limits

Numeric version **{m['version']}**; backup `{m['backup']}`. {status} [Manifest](CP-22-evidence/staging.json), [publication](CP-22-evidence/publication.json), [cloud](CP-22-evidence/cloud-verification.json). APK4 retained. UAT only.

Desktop results cover the listed scenarios and retain small contact tolerances. Phone receipt, motion, sound and FPS remain unverified. Confirm **2026.10.28 UAT 1** and watch rapid landings and crowded pusher contacts for board-crossing bounces, merging or disappearing treats. Phone acceptance remains Jenny's decision.

**Pending:** Jenny's UAT sign-off, then the CP-22 commit/push to `C:/Users/jenny/GitHub/cat-coin-pusher`. Production promotion remains unauthorized.
'''
(r/'tickets/CP-22.md').write_text(report,encoding='utf-8')
if published:
 s=(r/'CODEX_BRIEF.md').read_text(encoding='utf-8');s=s.replace('Updated October 27, 2026.','Updated October 28, 2026.');a=s.index('- UAT:');b=s.index('- Production:',a)
 s=s[:a]+f"- UAT: **{m['displayName']} / APK4**, numeric {m['version']} (CP-22 bounce correction). Source `work/cp22/release.html`; builder `revise13.py` + `impact13.js`, pinned to `work/cp22/uat12/release.html`. Swept first-impact energy dissipation plus ordinary contact launch damping; prior coin/treat separation and overlap fixes retained. **Keep 0.35-second taps.** 18/18 no-power checks pass. {status} Phone UAT/sign-off pending; CP-22 remains open. See `tickets/CP-22.md`.\n- Previous UAT: **2026.10.27 UAT 12 / APK4**, numeric 20261027174348: Jenny saw improvement but rejected unexpected board-crossing bounces. Archived source/report `work/cp22/uat12/`. Earlier candidates also failed phone UAT.\n"+s[b:];(r/'CODEX_BRIEF.md').write_text(s,encoding='utf-8')
 s=(r/'DEVELOPER.md').read_text(encoding='utf-8');a=s.index('## Current UAT — CP-22');b=s.index('## Historical UAT-16',a)
 s=s[:a]+f'''## Current UAT — CP-22 impact energy, October 28, 2026

**{m['displayName']} / APK4**, numeric {m['version']}. Source `work/cp22/release.html`; builder `revise13.py` + `impact13.js`, pinned to UAT 12. {status} Phone acceptance pending.

Accelerated delivery energy must not enter pile contacts. `deliveryImpact()` shape-casts incoming currency over the next physics interval, advances to first impact, restores normal gravity and enters contact at -1.2 m/s. After native contacts and separation correction, `dampCoinImpacts()` bounds residual ordinary on-board currency speed to 1.2 m/s horizontally and +0.35 m/s vertically. Free delivery, active powers and off-board payout are exempt. These explicit gameplay limits supplement zero restitution. Keep the 0.35-second input gate. Preserve `contactSolid` coin/item CCD and separation, `coinSolid` rotation control and render ordering without simulation-list mutation. Future physics checks need launch trajectories as well as penetration and mixed treat pairs; previous overlap-only checks missed the bounce failure.

'''+s[b:];(r/'DEVELOPER.md').write_text(s,encoding='utf-8')
 s=(r/'SPEC.md').read_text(encoding='utf-8');a=s.index('## Coin action (CP-22');b=s.index('## Coin entry and input',a)
 s=s[:a]+'''## Coin action (CP-22 October 28 UAT 1, pending phone sign-off)

Keep Jenny's **0.35-second** ordinary tap limit. Extra taps are free, acknowledged and unqueued. Coins should feel heavy: no ordinary board-crossing bounces. Dissipate accelerated delivery energy at first impact and damp residual ordinary contact launches; preserve Quake/sweep behavior and natural payout falls. Prior coin/treat separation and correct overlap ordering remain required. Artwork, placement, dimensions and locked layout remain fixed. Desktop 18 no-power checks pass; phone acceptance pending. See `tickets/CP-22.md`.

'''+s[b:];(r/'SPEC.md').write_text(s,encoding='utf-8')
 (r/'uat/README.md').write_text(f'''# UAT: {m['displayName']}

CP-22 bounce correction. Keep 0.35-second taps. First-impact energy dissipation and ordinary contact damping retain the coin/treat contact fixes. 18 desktop clears pass; phone acceptance pending.

Reopen UAT and accept the update, or use Settings → Check for updates. APK4 retained. Confirm **2026.10.28 UAT 1**; watch rapid landings and crowded pusher contacts for board-crossing bounces, merging and disappearing treats.

Report: ../tickets/CP-22.md. Numeric version: {m['version']}.
''',encoding='utf-8')
print(status)
