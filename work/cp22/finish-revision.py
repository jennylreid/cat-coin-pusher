from pathlib import Path
import json
r=Path(__file__).resolve().parents[2];p=r/'work/cp22';e=r/'tickets/CP-22-evidence'
m=json.loads((p/'publication-manifest.json').read_text());pub=(e/'publication.json').exists() and json.loads((e/'publication.json').read_text(encoding='utf-8-sig'))['version']==m['version']
cloud=(e/'cloud-verification.json').exists() and json.loads((e/'cloud-verification.json').read_text())['version']==m['version']
rows=sum([json.loads((p/f'wins-final-{seed}.json').read_text()) for seed in [42,1,2]],[])
assert len(rows)==18 and all(x['result']=='won' for x in rows)
(e/'revision-wins.json').write_text(json.dumps(rows,indent=2))
for name in ['revision-centre.json','revision-left.json','revision-sweep.json','uat9-expanded-audit.json']:
    f=e/name;v=json.loads(f.read_text())
    if 'quietTiltRangeDegrees' in v:v['postTapTiltRangeDegrees']=v.pop('quietTiltRangeDegrees');v['postTapSamples']=v.pop('quietSamples');v['postTapMethod']='Unfiltered tilt range during seconds 24–28; includes moving/settling coins. This is not the resting flicker measure.'
    f.write_text(json.dumps(v,indent=2))
status=('Published; backup and local hash verified. '+('Fresh cloud hash verified.' if cloud else 'Fresh cloud verification pending.')) if pub else 'Staged; not yet published.'
report=f'''# CP-22 Coin action pass

**Status: {m['displayName']} / APK4 — {status}** Phone UAT/sign-off pending.

Jenny rejected UAT 9: shaking, pile-ups, coins slipping through/under one another, and partial disappearance on pusher retraction. The original flat-coin checks missed these failures. [UAT 9 report](../../work/cp22/revision1/report.md) and evidence remain archived in `CP-22-evidence/uat9/`.

## Revision

- Contacts now use the actual rotated 3-D coin shapes, including tilted coins, and the actual table, pusher and back-wall shapes. Fast contacts preserve the previous separation direction. A coin correction cannot leave it inside the plate or underneath the table. Four smaller physics steps per frame; continuous collision detection stays on for currency.
- Removed rotation snaps, repeated wake-ups and post-solver angular-velocity overrides. Flat ground coins stay steady; a damped torque helps raised coins settle flat. A stabilization lock requires support near the coin centre, so an overhanging coin can leave a retracting pusher. Ordinary stacking remains possible.
- Removed the fixed screen-height mask from coins physically clear of the rear wall. It was cutting raised coins near the retracting plate. The physical rear wall and cat still occlude coins normally.
- **Rate reduced to one coin per 0.6 seconds (1.67/second)**: 0.35 seconds allowed too many arrivals in one lane between pushes. Extra taps still cost nothing, queue nothing and receive the existing gentle feedback. Jenny judges the feel on her phone.

Source: `work/cp22/release.html`; builder: `revise.py`, `stable.js`, `solid.js`, pinned to the failed UAT 9 source in `revision1/release.html`. Approved art, coin dimensions and layout are retained.

## Evidence

- [20-second centre-lane clip](CP-22-evidence/revision-pusher.mp4), [GIF](CP-22-evidence/revision-pusher.gif): 12 seconds of 20 tap attempts/second, then seven seconds without taps. Coins advance past the pusher; ordinary short stacks can form. Pusher penetration never exceeded **0.223 game units**, with no sample over 0.5. [Pusher audit](CP-22-evidence/pusher.json).
- All-angle native-shape audits, 28 seconds each, on centre/Board 1, left/Board 2 and moving-lane/Board 3: **zero coin contacts deeper than 0.5 units; maxima 0.180 / 0.296 / 0.199 units**, versus UAT 9's 18.51-unit maximum and 82-frame deep contact. The centre-lane peak landed height falls from 235.5 to 63.6 units. [Centre](CP-22-evidence/revision-centre.json), [left](CP-22-evidence/revision-left.json), [moving lane](CP-22-evidence/revision-sweep.json), [failed UAT 9](CP-22-evidence/uat9-expanded-audit.json).
- The same CP-21 approximate overlap predicate still flags 6 / 3 / 4 leaning pairs, one per board over ten sampled frames. Actual-shape checks of **every flagged sample** found only 0.149 / 0.126 / 0.147-unit contact tolerance, not coins intersecting by multiple units. This explains why the old centre-distance/tilt predicate alone cannot validate these contacts. [Verified legacy measure](CP-22-evidence/legacy-verified.json).
- Flicker: **76,700 consecutive resting samples**, maximum tilt step **0.057 degrees**, **zero full-flip crossings** in the 28-second centre-lane run. Resting means linear speed below 0.005 m/s and angular speed below 0.03 rad/s. This includes raised coins, not just the table layer. [Motion audit](CP-22-evidence/revision-motion.json). Physical settling while coins are still moving is recorded separately, not counted as resting flicker.
- **18/18 no-power wins**, all three boards and seeds 42, 1, 2. Accepted gaps are 0.6 and 0.8 seconds: the former is the new fastest rate; attempting every old 0.4 seconds admits every second tap, equivalent to 0.8 seconds. Slowest clear: **48.5 seconds**. [All runs](CP-22-evidence/revision-wins.json).

| Board | CP-21 UAT 8 used | UAT 10 used | Allowance |
|---|---:|---:|---:|
| 1 | 66–91 | 29–49 | 220 |
| 2 | 74–100 | 24–70 | 160 |
| 3 | 75–107 | 52–70 | 160 |

## Publication and limits

Game version **{m['version']}**; backup `{m['backup']}`. {status} [Manifest](CP-22-evidence/staging.json), [publication](CP-22-evidence/publication.json), [cloud verification](CP-22-evidence/cloud-verification.json).

Small contact tolerances remain; desktop samples do not prove every possible collision or phone rendering/performance. The legacy heuristic still has the flagged cases described above. Added contact work increases desktop median physics time from 2.75 ms to 8.00 ms in the centre-lane sample (95th percentile 11.10 ms); this is not a phone FPS measurement. [Timing](CP-22-evidence/revision-physics-time.json). No phone acceptance is claimed.

On the phone: confirm **UAT 10**, hammer one lane, stop tapping and watch the pile, then watch a coin through a full pusher extension/retraction. Check that it leaves the plate, stays visible, and pushes forward. Judge the slower rate and try all three boards.

**Pending:** Jenny's UAT sign-off, then the CP-22 commit/push in `C:/Users/jenny/GitHub/cat-coin-pusher`. No production promotion is authorized.
'''
(r/'tickets/CP-22.md').write_text(report,encoding='utf-8')
if pub:
    s=(r/'CODEX_BRIEF.md').read_text(encoding='utf-8');a=s.index('- UAT:');b=s.index('- Production:',a)
    s=s[:a]+f"- UAT: **{m['displayName']} / APK4**, numeric {m['version']} (CP-22 revision after failed phone UAT 9). Source `work/cp22/release.html`; builder `revise.py` + `stable.js` + `solid.js`, pinned to `work/cp22/revision1/release.html`. Actual 3-D coin/pusher contacts, steady supported coins, overhang release and rear-mask correction; 0.6-second tap limit. 18/18 no-power clears at accepted 0.6/0.8 s rates, 29–49 / 24–70 / 52–70 coins across Boards 1–3. All-angle deep-contact samples zero at the 0.5-unit threshold; small tolerances remain. Backup/local publication verified; fresh cloud {'verified' if cloud else 'pending'}. Phone UAT/sign-off pending. See `tickets/CP-22.md`.\n- Previous UAT: **2026.10.27 UAT 9 / APK4**, numeric 20261027152935, rejected by Jenny for shaking, pile-ups, pass-through and pusher retraction clipping. Archived source: `work/cp22/revision1/release.html`.\n"+s[b:]
    (r/'CODEX_BRIEF.md').write_text(s,encoding='utf-8')
    s=(r/'DEVELOPER.md').read_text(encoding='utf-8');a=s.index('## Current UAT — CP-22');b=s.index('## Historical UAT-16',a)
    s=s[:a]+f'''## Current UAT — CP-22 revision, October 27, 2026

**{m['displayName']} / APK4**, numeric {m['version']}. Source `work/cp22/release.html`; builder `revise.py` + `stable.js` + `solid.js`, pinned to UAT 9 in `revision1/release.html`. UAT 9 failed phone UAT and is superseded; do not run the older `build.py`/`contacts.js` as the current builder.

Four physics substeps at 240 Hz interpolate the locked pusher stroke. Actual shape contacts cover tilted currency and fixed/kinematic obstacles; no flat-only shortcut. Separation projects only errors beyond 0.15 game units, with up to three contact passes, retaining approach direction and resolving supporting geometry as well as coin pairs. CCD remains enabled for currency after landing. The angular controller runs before the solver, changes locks only when needed, clears its accumulated torque each step, and checks centred support before locking raised nearly flat coins. A damped restoring torque replaces orientation snaps and post-solver velocity caps. Supported slanted overhead hits can open a brief rotation window; flips are not forced.

Coins physically clear of the rear wall bypass the old fixed screen-height matte. Eligible ordinary drops are immediate, at most one per 0.6 seconds of game time. Excess taps cost nothing and do not queue; feedback cooldown resets on restart. Old 0.4-second attempts effectively admit at 0.8 seconds. Native APK4 and channel identity retained. Backup/local publication verified; fresh cloud {'verified' if cloud else 'pending'}. Phone UAT/sign-off pending. Evidence/known limits: `tickets/CP-22.md`.

'''+s[b:];(r/'DEVELOPER.md').write_text(s,encoding='utf-8')
    s=(r/'SPEC.md').read_text(encoding='utf-8');a=s.index('## Coin action (CP-22');b=s.index('## Coin entry and input',a)
    s=s[:a]+'''## Coin action (CP-22 UAT 10, pending phone sign-off)

Ordinary taps release at most one coin per 0.6 seconds (1.67 per second). Excess taps cost no coin and do not queue; brief “Easy taps” feedback and a soft clink acknowledge them. First eligible tap is immediate. UAT 9's 0.35-second rate and flat-only corrections failed phone UAT and are superseded.

Flat resting coins stay steady; coins can lean and stack on uneven support. New 3-D contact checks include tilted coins and the pusher. Raised coins lose their stabilization lock when support moves away from the centre, allowing them to leave the retracting plate. The rear mask no longer cuts coins physically clear of the back wall. The CP-21 art, dimensions and layout remain locked. Desktop: 18/18 no-power clears at accepted 0.6/0.8-second rates; deep contact samples over 0.5 units zero in the recorded audits. Small contact tolerances and phone UAT remain pending; see `tickets/CP-22.md`.

'''+s[b:]
    s=s.replace('Exactly one immediate coin per ordinary tap.', 'Exactly one immediate coin per eligible ordinary tap, subject to the CP-22 cooldown above.')
    s=s.replace('Underlying release positions, tilt and drop physics remain unchanged to preserve board balance;', 'Release positions remain registered to the existing lanes; current coin action and timing follow CP-22 above;')
    (r/'SPEC.md').write_text(s,encoding='utf-8')
    (r/'uat/README.md').write_text(f'''# UAT: {m['displayName']}

CP-22 revision: actual tilted-coin/pusher contacts, steadier coins, support release on pusher retraction, and no false rear-mask clipping. One coin per 0.6 seconds; extra taps cost nothing and receive gentle feedback. All 18 no-power board checks pass. Phone acceptance pending.

Reopen UAT and accept the update, or use Settings → Check for updates. APK4 stays installed. Confirm {m['displayName']} at bottom left. Hammer one lane, stop and watch, then follow a coin through a full pusher cycle. Check forward pushing, visibility, shake and the slower tap rate; play all three boards.

Report: ../tickets/CP-22.md. Numeric game version: {m['version']}.
''',encoding='utf-8')
print(status)
