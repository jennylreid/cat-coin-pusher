from pathlib import Path
import json
r=Path(__file__).resolve().parents[2];p=r/'work/cp22';e=r/'tickets/CP-22-evidence'
m=json.loads((p/'publication-manifest.json').read_text())
def matches(name):
 f=e/name
 return f.exists() and json.loads(f.read_text(encoding='utf-8-sig')).get('version')==m['version']
published=matches('publication.json');cloud=matches('cloud-verification.json')
status=('Published; backup and local hash verified; cloud '+('hash verified.' if cloud else 'verification pending.')) if published else 'Staged; publication pending.'
rows=json.loads((e/'uat12-wins.json').read_text());assert len(rows)==18 and all(x['result']=='won' for x in rows)
render=json.loads((e/'uat12-render-final.json').read_text());sweep=json.loads((e/'uat12-swept.json').read_text());contacts=json.loads((e/'uat12-treat-contacts.json').read_text())
table='\n'.join(f"| {b} | {min(x['coinsUsed'] for x in rows if x['board']==b)}–{max(x['coinsUsed'] for x in rows if x['board']==b)} | {next(x['of'] for x in rows if x['board']==b)} |" for b in [1,2,3])
report=f'''# CP-22 Coin action pass

**{m['displayName']} / APK4 — {status}** Phone UAT/sign-off pending. CP-22 remains open.

Jenny reported cheese and shrimp disappearing underneath coins in UAT 11. That build failed phone UAT; its coin-only checks missed the treat interactions. UAT 9 and 10 also failed. Earlier sources/reports are preserved in `work/cp22/revision1/`, `uat10/`, and `uat11/`.

## Changes

- Extend native CCD and the extra 3-D contact protection to treats, including coin–treat and treat–pusher contacts. Keep the coin-only rotation controller off treats. Art, dimensions and placements stay fixed.
- Include the approved treat billboards in physical overlap ordering. Previously the painter could put a supporting coin over the cheese/shrimp. Cyclic overlaps use cached silhouettes sampled from the approved art's alpha; transparent image corners do not hide coins.
- A swept check caught a brief coin-edge intersection during post-solver correction. The correction now stops at the first shape impact when separate bodies exchange vertical order, rather than checking only final positions.
- Retain Jenny's **0.35-second tap limit**. Pile-ups are a collision/pushing issue; slower tapping is not the fix. Retain free excess-tap feedback and no queue.

Rebuild: `work/cp22/revise12.py`, `occlusion12.js`, `sweep12.js`, pinned to the exact UAT 11 source in `work/cp22/uat11/release.html`. Current source: `work/cp22/release.html`.

## Relevant validation

- Identical physical support fixture: [before](CP-22-evidence/uat12-treat-before-detail.png), [after](CP-22-evidence/uat12-treat-after-detail.png). Only drawing order changes; the cheese no longer appears inside the supporting coin. [Fixture](CP-22-evidence/uat12-treat-fixture.json).
- The rendered audit found {render['occlusion']['treatLegacyWrong']:,} treat–coin pair/frame decisions where the old painter key put the wrong body in front; the new graph includes these relations.
- Treat-specific 28-second pressure run: maximum penetration **{contacts['maxPenetrationGameUnits']:.3f} game units**, **{contacts['deepContactSamplesOverHalfUnit']} samples over 0.5 units**, longest deep contact {contacts['longestDeepContactFrames']} frames. [Contacts](CP-22-evidence/uat12-treat-contacts.json). Small solver tolerances remain.
- Coin and treat trajectory hashes match with and without rendering; **{render['renderReorderedPhysicsFrames']} render-induced body-order changes**, **{render['deepSamples']} contacts over 0.5 units**, maximum {render['maxPenetration']:.3f} units. [Rendered](CP-22-evidence/uat12-render-final.json), [headless](CP-22-evidence/uat12-no-render-final.json).
- Motion audit: zero full flips in the 28-second sample; maximum consecutive resting tilt change 0.040 degrees over 60,785 resting samples. [Motion](CP-22-evidence/uat12-motion-audit.json).
- Swept shapes across **{sweep['substeps']} substeps**: **{sweep['sweptShapeHits']} swept hits and {sweep['confirmedThroughCrossings']} confirmed crossings** among the tested separate-body height exchanges. Includes treats. [Swept check](CP-22-evidence/uat12-swept.json).
- **18/18 no-power clears**, Boards 1–3 × seeds 42/1/2 × 0.35/0.4-second taps; slowest {max(x['seconds'] for x in rows):.1f} seconds. Fast case uses the preferred limit rather than 0.22 seconds. [Results](CP-22-evidence/uat12-wins.json).

| Board | Coins used | Allowance |
|---|---:|---:|
{table}

Desktop drawing timing: [same-pose comparison](CP-22-evidence/uat12-paint-performance.json). It is not a phone FPS measurement.

CP-21 UAT 8 comparison: Board 1 used 66–91, Board 2 74–100, Board 3 75–107; the new runs remain within the unchanged allowances. [Rapid aimed drops, pushing and pause clip](CP-22-evidence/uat12-treat-motion.mp4).

## Publication and limits

Numeric version **{m['version']}**. Backup `{m['backup']}`. {status} APK4 retained. [Manifest](CP-22-evidence/staging.json), [publication](CP-22-evidence/publication.json), [cloud](CP-22-evidence/cloud-verification.json).

Desktop tests establish the recorded cases, not phone acceptance or a universal no-pass-through guarantee. Jenny should confirm the new version and watch cheese/shrimp through repeated pushes, plus newly landed coins and a full pusher retraction. Phone receipt, motion and FPS remain unverified. Production promotion is unauthorized.

**Pending:** Jenny's UAT sign-off, then the CP-22 close-out commit and push to `C:/Users/jenny/GitHub/cat-coin-pusher`.
'''
(r/'tickets/CP-22.md').write_text(report,encoding='utf-8')
if published:
 s=(r/'CODEX_BRIEF.md').read_text(encoding='utf-8');a=s.index('- UAT:');b=s.index('- Production:',a)
 s=s[:a]+f"- UAT: **{m['displayName']} / APK4**, numeric {m['version']} (CP-22 treat contacts/occlusion and swept correction). Source `work/cp22/release.html`; builder `revise12.py` + `occlusion12.js` + `sweep12.js`, pinned to `work/cp22/uat11/release.html`. Treats now included in CCD, contact protection and overlap ordering. **Keep Jenny's 0.35-second tap limit; do not slow taps to address pile-ups.** 18/18 no-power checks pass. {status} Phone UAT/sign-off pending; CP-22 remains open. See `tickets/CP-22.md`.\n- Previous UAT: **2026.10.27 UAT 11 / APK4**, numeric 20261027165021, failed phone UAT: cheese/shrimp disappeared beneath coins. UAT 9/10 also failed. Previous source/report archived in `work/cp22/uat11/`.\n"+s[b:];(r/'CODEX_BRIEF.md').write_text(s,encoding='utf-8')
 s=(r/'DEVELOPER.md').read_text(encoding='utf-8');a=s.index('## Current UAT — CP-22');b=s.index('## Historical UAT-16',a)
 s=s[:a]+f'''## Current UAT — CP-22 treat contacts, October 27, 2026

**{m['displayName']} / APK4**, numeric {m['version']}. Source `work/cp22/release.html`; builder `revise12.py` + `occlusion12.js` + `sweep12.js`, pinned to archived UAT 11. {status} Phone acceptance pending.

`contactSolid` includes currency and item bodies; it controls CCD, pre-step position capture and 3-D correction. `coinSolid` remains currency-only for rotation control. Post-correction separate-body vertical exchanges get a swept shape check and stop at first impact. Preserve the simulation body's order; render a separate list. Treat draw records use their unchanged billboard bounds and physical separating normals. Cycle masks use approved image alpha runs, cached by treat ID. Include mixed coin–treat pairs and poses in future contact/trajectory audits; currency-only tests missed this failure. Keep the 0.35-second tap limit.

'''+s[b:];(r/'DEVELOPER.md').write_text(s,encoding='utf-8')
 s=(r/'SPEC.md').read_text(encoding='utf-8');a=s.index('## Coin action (CP-22');b=s.index('## Coin entry and input',a)
 s=s[:a]+'''## Coin action (CP-22 UAT 12, pending phone sign-off)

Jenny's preferred ordinary tap limit is **0.35 seconds** (2.86 per second). Extra taps cost no coin, do not queue and receive gentle feedback. First eligible tap is immediate. Solve pile-ups through collision/pushing behavior, not slower taps.

UAT 12 extends the coin contact protection and overlap ordering to cheese, shrimp and tuna, and guards correction paths against swept edge intersections. Retain artwork, dimensions, placement and the locked layout. Desktop 18 no-power checks pass at 0.35/0.4 seconds; phone acceptance remains pending. See `tickets/CP-22.md`.

'''+s[b:];(r/'SPEC.md').write_text(s,encoding='utf-8')
 (r/'uat/README.md').write_text(f'''# UAT: {m['displayName']}

CP-22 treat contact/overlap correction. Keep the 0.35-second tap limit. Phone acceptance pending.

Reopen UAT and accept the update, or use Settings → Check for updates. APK4 retained. Confirm UAT 12; watch cheese and shrimp during repeated pushes, plus coin landings and pusher retraction.

Report: ../tickets/CP-22.md. Numeric version: {m['version']}.
''',encoding='utf-8')
print(status)
