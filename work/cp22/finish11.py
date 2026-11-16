from pathlib import Path
import json
r=Path(__file__).resolve().parents[2];p=r/'work/cp22';e=r/'tickets/CP-22-evidence'
m=json.loads((p/'publication-manifest.json').read_text())
def matches(name):
    f=e/name
    return f.exists() and json.loads(f.read_text(encoding='utf-8-sig')).get('version')==m['version']
published=matches('publication.json');cloud=matches('cloud-verification.json')
status=('Published; backup/local hash verified; '+('fresh cloud hash verified.' if cloud else 'fresh cloud verification pending.')) if published else 'Staged; publication pending.'
rows=json.loads((e/'uat11-wins.json').read_text());assert len(rows)==18 and all(x['result']=='won' for x in rows)
report=f'''# CP-22 Coin action pass

**{m['displayName']} / APK4 — {status}** CP-22 remains open for Jenny's phone UAT/sign-off.

Jenny rejected UAT 10 because coins still visibly merge/pass through each other. **Restore and retain the preferred 0.35-second tap limit. Pile-ups are a collision/pushing problem; do not slow tapping as a workaround.** Earlier rejected reports and evidence are archived in `work/cp22/revision1/`, `work/cp22/uat10/`, and the matching evidence subfolders.

## Root causes and changes

1. **Drawing changed physics.** The renderer sorted the live `bodies` array, which the sequential collision correction also iterates. UAT 10 reordered it in 572 of 1,440 rendered test frames. The earlier checks without drawing missed this difference. Rendering now uses a separate list and leaves simulation order alone.
2. **Wrong coin occlusion.** The old centre-depth/height key painted some upper coins behind the lower coins supporting them. This reproduced a visible merge even with separate physical shapes. Overlapping coins now use their actual separating plane and the locked camera to determine which is in front. Cyclic overlaps get local silhouette masks; a later-painted rear coin cannot overwrite an earlier foreground coin. Geometry/pair results are cached.
3. **0.35 seconds restored**, with the same immediate eligible drop, gentle excess-tap feedback, no cost for rejected taps and no queue. The coin artwork, dimensions, camera and layout are retained. The approved coin drawing function is reused.

Source: `work/cp22/release.html`. Builder: `work/cp22/revise11.py` + `occlusion.js`, pinned to UAT 10 in `work/cp22/uat10/release.html`.

## Evidence and validation

- Identical physical two-coin fixture: [before](CP-22-evidence/occlusion-before-detail.png), [after](CP-22-evidence/occlusion-after-detail.png). The physical gap is unchanged (0.00000459 m); the upper coin now paints above its support. [Fixture data](CP-22-evidence/occlusion-fixture.json).
- [20-second real-game clip](CP-22-evidence/uat11-motion.mp4), [GIF](CP-22-evidence/uat11-motion.gif): rapid centre taps at the restored limit, then a pause. Inspected phone-resolution frames and the isolated contact fixture.
- **Identical physical trajectory hashes** with drawing disabled and with 20, 60 and 120 renders/second. **Zero render-induced simulation-list changes.** The 24-second run has no contacts deeper than 0.5 game units; maximum measured tolerance 0.244 units. [No rendering](CP-22-evidence/uat11-no-render.json), [20 fps](CP-22-evidence/uat11-render-20.json), [60 fps](CP-22-evidence/uat11-render-60.json), [120 fps](CP-22-evidence/uat11-render-120.json). These are simulation/render-cadence checks, not phone FPS measurements.
- The 60-fps ordering audit identifies **25,882 pair/frame decisions** where the old painter key put the wrong coin in front. The corrected ordering handles those relations; silhouette clipping handles the 281 cyclic cases in this sample.
- Swept-shape check across **4,800 physics substeps**: 14 separated coins changed centre-height order, but none crossed through the other's swept shape. **Zero confirmed through-crossings** in this 20-second run. [Swept audit](CP-22-evidence/uat11-swept.json).
- **18/18 no-power wins**, Boards 1–3 × seeds 42, 1, 2 × 0.35/0.4-second gaps. Slowest clear 38.5 seconds. [All results](CP-22-evidence/uat11-wins.json).

| Board | CP-21 UAT 8 used | UAT 11 used | Allowance |
|---|---:|---:|---:|
| 1 | 66–91 | 42–72 | 220 |
| 2 | 74–100 | 42–110 | 160 |
| 3 | 75–107 | 64–89 | 160 |

- Input check: 20 attempts in one second admit/charge 3 coins; pausing queues no later coin. Restart restores immediate input and feedback. [Rate check](CP-22-evidence/uat11-rate.json).
- Same 79-body pose at phone resolution: desktop median draw 22.1 ms before / 21.1 ms corrected, with caches warmed. [Drawing test](CP-22-evidence/paint-performance.json).

## Publication, limits and phone UAT

Numeric version **{m['version']}**. Backup `{m['backup']}`. {status} [Manifest](CP-22-evidence/staging.json), [publication](CP-22-evidence/publication.json), [cloud](CP-22-evidence/cloud-verification.json).

The fixture proves a real drawing error; desktop tests cover the recorded cases and retain small contact tolerances. Phone merging/pass-through, perceived motion and performance still require Jenny's UAT. The previous desktop-only success claims did not establish phone acceptance.

Reopen UAT, accept the update and confirm **UAT 11**. Use the preferred tap speed and watch newly landed coins, stacked/leaning contacts, and a full pusher cycle. CP-22 stays open until the phone action is acceptable.

**Pending:** Jenny's UAT sign-off, then the CP-22 close-out commit/push in `C:/Users/jenny/GitHub/cat-coin-pusher`. Production promotion remains unauthorized.
'''
(r/'tickets/CP-22.md').write_text(report,encoding='utf-8')
if published:
    s=(r/'CODEX_BRIEF.md').read_text(encoding='utf-8');a=s.index('- UAT:');b=s.index('- Production:',a)
    s=s[:a]+f"- UAT: **{m['displayName']} / APK4**, numeric {m['version']} (CP-22 render/physics ordering correction). Source `work/cp22/release.html`; builder `revise11.py` + `occlusion.js`, pinned to `work/cp22/uat10/release.html`. Rendering no longer reorders the simulation list; correct upper/lower coin occlusion with cyclic-overlap masks. **Jenny's preferred 0.35-second limit restored; do not slow taps to address pile-ups.** 18/18 no-power clears at 0.35/0.4 s. Physical trajectories identical with no rendering and 20/60/120 render cadence. Backup/local publication verified; cloud {'verified' if cloud else 'pending'}. Phone UAT/sign-off pending; CP-22 remains open. See `tickets/CP-22.md`.\n- Previous UAT: **2026.10.27 UAT 10 / APK4**, numeric 20261027161026, rejected for continuing visible merging/pass-through. UAT 9 also failed phone UAT. UAT 10 source/report archived in `work/cp22/uat10/`.\n"+s[b:];(r/'CODEX_BRIEF.md').write_text(s,encoding='utf-8')
    s=(r/'DEVELOPER.md').read_text(encoding='utf-8');a=s.index('## Current UAT — CP-22');b=s.index('## Historical UAT-16',a)
    s=s[:a]+f'''## Current UAT — CP-22 render/physics correction, October 27, 2026

**{m['displayName']} / APK4**, numeric {m['version']}. Source `work/cp22/release.html`. Rebuild with `revise11.py` + `occlusion.js`, pinned to `work/cp22/uat10/release.html`; earlier builders reproduce superseded candidates. Backup/local publication verified; cloud {'verified' if cloud else 'pending'}. Phone UAT/sign-off pending.

Rendering must never sort or otherwise reorder the live `bodies` array. The sequential 3-D contact correction depends on its order; testing only step/update without draw missed this bug. Draw a separate list. `coinPaintOrder` uses projected convex footprints and actual shape separation normals against the locked camera, with silhouette-complement clips for cyclic overlaps. Cached records, pair relations and unchanged render passes avoid repeated geometry work. Coin textures and drawing functions remain in place. Hidden/dance-down and delivery coins are excluded from board occlusion.

UAT 10's four physics substeps, currency CCD and 3-D contact correction remain. Contact tolerance is small, not mathematically zero. Ordinary taps use **0.35 seconds**, Jenny's explicit preferred rate; do not change it to address pile-ups. Excess taps are free, unqueued, and acknowledged. Mandatory render/physics check: no draw versus 20/60/120 render cadence must produce identical trajectory hashes and never mutate body order. Validation/evidence: `tickets/CP-22.md`.

'''+s[b:];(r/'DEVELOPER.md').write_text(s,encoding='utf-8')
    s=(r/'SPEC.md').read_text(encoding='utf-8');a=s.index('## Coin action (CP-22');b=s.index('## Coin entry and input',a)
    s=s[:a]+'''## Coin action (CP-22 UAT 11, pending phone sign-off)

Jenny's preferred ordinary tap limit is **0.35 seconds** (2.86 per second). Extra taps cost no coin and do not queue; gentle feedback acknowledges them. First eligible tap is immediate. Pile-ups must be solved through collision/pushing behavior, not by slowing the tap rate. UAT 10's 0.6-second rate is superseded.

UAT 11 separates rendering from simulation order and fixes upper/lower coin occlusion. Existing 3-D contacts, currency CCD and pusher-retraction fixes remain. Artwork, coin dimensions and locked layout are retained. The recorded 18 no-power checks pass at 0.35/0.4 seconds; phone action and acceptance remain pending. See `tickets/CP-22.md`.

'''+s[b:];(r/'SPEC.md').write_text(s,encoding='utf-8')
    (r/'uat/README.md').write_text(f'''# UAT: {m['displayName']}

CP-22 revision: the preferred 0.35-second tap limit is restored. Rendering uses a separate list from physics and corrects which stacked/leaning coin appears in front, including cyclic overlaps. All 18 board checks pass; phone acceptance remains pending.

Reopen UAT and accept the update, or use Settings → Check for updates. APK4 stays installed. Confirm UAT 11, use the preferred tapping speed, and watch newly landed/stacked coins through a full pusher cycle. Check for merging, pass-through and smoothness.

Report: ../tickets/CP-22.md. Numeric version: {m['version']}.
''',encoding='utf-8')
print(status)
