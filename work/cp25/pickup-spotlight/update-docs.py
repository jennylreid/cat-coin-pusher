from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
old=(r/'tickets/CP-25.md').read_text(encoding='utf-8');tail=old[old.index('## Retained loop and collections'):]
tail=tail.replace('Baseline Oct29 UAT6','Baseline Oct29 UAT7').replace('work/cp25/pickup-frame/','work/cp25/pickup-spotlight/').replace('CP-25-evidence/pickup-frame/','CP-25-evidence/pickup-spotlight/').replace('before-CP-25-pickup-frame-20261029082920',m['backup'].split('/')[-1]).replace('34fe70fbd9f0d85bb13ae13519e54ba5d79b9d4c2c481d04b5aaa6fffb6e7b19',m['stagedJSONSHA256'])
tail=tail.replace('[Previous motion report](CP-25-evidence/pickup-pop-report.md)', '[Previous frame report](CP-25-evidence/pickup-frame-report.md)')
head=f'''# CP-25 Playable loop v1

**2026.10.29 UAT 8 / APK4 published**, numeric **{m['version']}**. Backup/package verified; fresh cloud evidence linked below. Jenny requested trying the proposed soft spotlight after rejecting the framed draft.

## Soft spotlight trial

- No frame/panel/text. Board is gently dimmed (28% neutral-dark veil), retaining its colour. A feathered warm radial glow sits behind the existing prize, with a restrained pop-in and three small staggered sparkles.
- About1.2 seconds per item, including fade-in/out; one item at a time. Existing pickup chime plays once as each item appears. Tap-away consumes the touch and stops an existing hold; automatic expiry permits an existing hold to continue.
- Original prize art reused; no generated or repainted assets. Actual front payout still credits/saves inventory once independently of presentation; board continues underneath, and clear/advance waits for the queue.

## Evidence and validation

[Four checks](CP-25-evidence/pickup-spotlight/checks.json): queue/timing/chime count; zero-coin dismissal; actual payout once; board continuing; soft dim/glow and three sparkles with no frame/desaturation/text; save/reopen; clear/advance waits for queue.

[Phone-size spotlight](CP-25-evidence/pickup-spotlight/overlay-phone.png), [clip with chimes](CP-25-evidence/pickup-spotlight/pickup-spotlight.mp4), 540×1200, 3.6 seconds. Desktop renderer with three existing Board3 prizes moved through actual payout as a UI fixture; audio is the earlier mathematical render of the same chime at display times, not a phone recording. Phone receipt, perceived appearance/sound/touch feel and FPS remain Jenny's UAT.

'''
(r/'tickets/CP-25.md').write_text(head+tail,encoding='utf-8')
f=r/'tickets/CP-25-evidence/pickup-frame-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 8 / APK4** ({m['version']}).

CP-25 soft spotlight pickup trial: warm glow, small pop and three sparkles, gentle board dim; no frame or desaturation. About1.2 seconds, sequential queue, pickup chime and zero-coin tap-dismiss. Approved collections/completion payoff retained.

Source: work/cp25/pickup-spotlight/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md',f'''## CP-25 soft spotlight pickup (October 29, 2026)

Current UAT8/APK4 ({m['version']}) trials Jenny's selected soft spotlight: gentle dark veil retains board colour; warm feathered glow behind original prize, small pop-in and three subtle sparkles. No frame, panel, text or desaturation. About1.2 seconds including fades; sequential queue, one pickup chime per display, zero-coin tap-dismiss. Inventory/clear ordering and approved collections/completion payoff retained. Report: tickets/CP-25.md. Earlier checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 soft spotlight pickup (October 29, 2026)

Current UAT8 source `work/cp25/pickup-spotlight/release.html`, pinned to Oct29 UAT7. `prepare.py` + `awards.js` replace framed/desaturated draw with 28% neutral dim, feathered radial warm glow, restrained back-eased sprite scale0.78–1.0 and three staggered four-point sparkles. Duration1.2s, fades0.1/0.2s. Queue, sound method, pointer dismissal, saves and clear ordering retained. No asset or physics changes. Four checks/package/cloud/clip: tickets/CP-25-evidence/pickup-spotlight/. Report tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Soft spotlight trial recorded')
