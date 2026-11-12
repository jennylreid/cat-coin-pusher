from pathlib import Path
import json
r=Path(__file__).resolve().parents[2]
m=json.loads((r/'work/cp22/publication-manifest.json').read_text())
cloud=r/'tickets/CP-22-evidence/cloud-verification.json'
verified=cloud.exists()
s=(r/'CODEX_BRIEF.md').read_text(encoding='utf-8')
start=s.index('- UAT:');end=s.index('- Previous UAT:',start)
s=s[:start]+f"- UAT: **{m['displayName']} / APK4**, numeric {m['version']} (CP-22 coin action pass). Source `work/cp22/release.html`, patched from published CP-21 UAT 8. Two smaller physics steps, flat-coin contact constraint, no injected drop spin, supported flat-coin stability and conditional overhead-hit flips; 0.35-second tap limit with gentle feedback. 18/18 no-power wins: Board 1 72–110/220, Board 2 73–92/160, Board 3 93–110/160. Zero lasting overlaps; one one-frame Board 3 sample remains. Backup and local publication verified; fresh cloud hash {'verified' if verified else 'pending'}. Phone UAT/sign-off pending; close-out commit/push follows sign-off per CP-22 brief. See `tickets/CP-22.md`.\n"+s[end:]
s=s.replace('matching HTML is work/cp21/release.html (UAT 3\'s was work/uat18/release.html).','matching HTML is work/cp22/release.html (CP-21 UAT 8 is pinned in work/cp22/baseline.html).')
s=s.replace('- Previous UAT: 2026.10.17 UAT 3 / APK4, numeric 20261017204741 (UAT-18), now the CP-21 baseline.','- Previous UAT: **2026.10.27 UAT 8 / APK4**, numeric 20261027113731 (CP-21 locked layout and solid coins), signed off October 27. Source `work/cp21/release.html`; pinned as the CP-22 baseline.')
(r/'CODEX_BRIEF.md').write_text(s,encoding='utf-8')
s=(r/'DEVELOPER.md').read_text(encoding='utf-8')
start=s.index('## UAT-18 — October 17, 2026') if '## UAT-18 — October 17, 2026' in s else s.index('## Current UAT — CP-22')
end=s.index('## Historical UAT-16',start)
s=s[:start]+f'''## Current UAT — CP-22, October 27, 2026

**{m['displayName']} / APK4**, numeric {m['version']}. Source `work/cp22/release.html`; patch builder `work/cp22/build.py` + `contacts.js` pins CP-21 UAT 8. Do not rebuild from CP-21 integrate.py or the external legacy game directory.

Each 60 Hz game tick solves two 120 Hz physics steps and interpolates the pusher target. Flat currency contact projection preserves vertical order on fast impacts and exchanges horizontal momentum; tilted bodies retain Rapier contacts. The angular controller holds nearly flat supported currency steady, caps unsupported lean at 36 degrees and angular speed at 1 rad/s, and unlocks a flip only for a supported coin leaning over 10 degrees struck from above. Contact normals >=0.97 enter the extra flat-coin constraint. Delivery acceleration resets on actual contact instead of waiting solely for a near-zero vertical speed.

Ordinary drop cooldown is 0.35 seconds of game time, checked before cost/state changes; excess taps are discarded, with a throttled soft clink and existing float-text feedback. No release queue. Paused/slow simulation may reduce the real-time rate. Approved layout and physics dimensions remain as CP-21. See `tickets/CP-22.md` for test evidence and known limits. Backup/local publication verified; cloud {'verified' if verified else 'pending'}. Phone UAT/sign-off pending.

'''+s[end:]
(r/'DEVELOPER.md').write_text(s,encoding='utf-8')
s=(r/'SPEC.md').read_text(encoding='utf-8')
marker='## Coin entry and input'
section='''## Coin action (CP-22 UAT 9, pending phone sign-off)

Ordinary taps release at most one coin per 0.35 seconds (2.86 per second). Excess taps cost no coin and do not queue; brief “Easy taps” feedback and a soft clink acknowledge them. First eligible tap is immediate. The locked CP-21 layout, coin art and dimensions are retained.

Resting flat coins remain steady; coins can lean on uneven support. A full flip is permitted only when an already slanted, supported coin is hit from above. Two smaller physics steps and an extra flat-coin contact constraint reduce pass-through. Desktop checks: zero lasting overlaps, one brief Board 3 sample; 18/18 no-power clears at 0.35/0.4-second cadence. Phone feel and acceptance remain pending. See `tickets/CP-22.md`.

'''
if '## Coin action (CP-22' not in s:s=s.replace(marker,section+marker)
(r/'SPEC.md').write_text(s,encoding='utf-8')
(r/'uat/README.md').write_text(f'''# UAT: {m['displayName']}

CP-22 coin action pass: steadier coins, stronger coin contacts and a 0.35-second tap limit. Extra taps cost nothing and show “Easy taps” with a soft clink. All 18 desktop board checks clear within the current allowances. One brief overlap sample remains; phone acceptance is pending.

Reopen UAT and accept the update, or use Settings → Check for updates. APK4 stays installed. Bottom-left game label should read {m['displayName']}.

Phone UAT: hammer one lane and alternate lanes; pause and watch resting coins; try Quake and all three boards. Judge the rate, feedback, flicker and smoothness. Report: ../tickets/CP-22.md. Numeric game version: {m['version']}.
''',encoding='utf-8')
s=(r/'tickets/CP-22.md').read_text(encoding='utf-8').replace('**Status:** UAT 9 staged; publication verification in progress.','**Status:** Published to UAT 9; '+('fresh cloud hash verified.' if verified else 'fresh cloud verification pending.'))
s=s.replace('Target: **2026.10.27 UAT 9 / APK4**','Published: **2026.10.27 UAT 9 / APK4**').replace('Publication and fresh cloud hash verification pending.','Backup and local publication hash verified; '+('fresh OneDrive download matches the staged SHA-256 and retains the existing shared item. [Publication](CP-22-evidence/publication.json), [cloud verification](CP-22-evidence/cloud-verification.json).' if verified else 'fresh cloud verification pending.'))
if verified:
    s=s.replace('fresh cloud verification pending.','fresh cloud hash verified.')
    s=s.replace('Backup and local publication hash verified; fresh cloud hash verified.','Backup and local publication hash verified; fresh OneDrive download matches the staged SHA-256 and retains the existing shared item. [Publication](CP-22-evidence/publication.json), [cloud verification](CP-22-evidence/cloud-verification.json).')
(r/'tickets/CP-22.md').write_text(s,encoding='utf-8')
