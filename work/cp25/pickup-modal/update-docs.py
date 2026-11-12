from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
old=(r/'tickets/CP-25.md').read_text(encoding='utf-8');tail=old[old.index('## Retained loop and collections'):]
tail=tail.replace('Baseline Oct29 UAT8','Baseline Oct29 UAT9').replace('work/cp25/pickup-vignette/','work/cp25/pickup-modal/').replace('CP-25-evidence/pickup-vignette/','CP-25-evidence/pickup-modal/').replace('before-CP-25-pickup-vignette-20261029110229',m['backup'].split('/')[-1]).replace('e27e7830418a9a998b839df4ecc2c8af67d9fb50597db4f9306c9bd5e733f981',m['stagedJSONSHA256']).replace('[Previous spotlight report](CP-25-evidence/pickup-spotlight-report.md)', '[Previous vignette report](CP-25-evidence/pickup-vignette-report.md)')
head=f'''# CP-25 Playable loop v1

**2026.10.29 UAT 10 / APK4 published**, numeric **{m['version']}**. Backup/package verified; fresh cloud evidence linked below. Jenny clarified: a partially transparent popup screen, background disabled, with a light diagonal stripe.

## Translucent modal pickup

- Large rounded translucent popup with light diagonal stripes and a restrained border/shadow, over a dimmed scene. Original full-colour item/pop/glow/sparkles and pickup chime retained. Broad radial rays removed. No generated/repainted art or popup text.
- **Background now pauses and is disabled**, superseding the earlier running-board behavior at Jenny's request. Fixed physics/time and gameplay animation updates stop while a pickup is visible. Held dropping stops at pickup; no deferred drops. Modal timer and wall-clock purse refill continue.
- Sequential1.2-second popups, or tap to dismiss. Dismissal consumes the touch without dropping/opening background controls; closing resumes gameplay. Queue finishes before clear/advance. Inventory credit/save still occurs once at payout, independent of modal presentation.

## Evidence and validation

[Three checks](CP-25-evidence/pickup-modal/checks.json): held stream stops; body positions and simulation time remain frozen; dismissal spends no coin and resumes game; UI timer/queue/chime progresses during pause; front credit persists exactly once; clear/advance waits until modals close.

[Phone-size popup](CP-25-evidence/pickup-modal/overlay-phone.png), [clip with chimes](CP-25-evidence/pickup-modal/pickup-modal.mp4), 540×1200,3.6 seconds. Desktop renderer; existing Board3 prizes moved through actual payout as a UI fixture. Audio is the earlier mathematical render of the same chime at display times, not a phone recording. Phone receipt, perceived transparency/stripe/sound/touch feel and FPS remain Jenny's UAT.

'''
(r/'tickets/CP-25.md').write_text(head+tail,encoding='utf-8')
f=r/'tickets/CP-25-evidence/pickup-vignette-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 10 / APK4** ({m['version']}).

CP-25 translucent diagonal-striped pickup popup. Background paused/disabled; hold stops at pickup; dismissal cannot reach underlying controls.1.2-second sequential queue/chime; saved inventory and collection payoff retained.

Source: work/cp25/pickup-modal/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md',f'''## CP-25 translucent modal pickup (October 29, 2026)

Current UAT10/APK4 ({m['version']}) follows Jenny's clarification: partially transparent rounded popup with light diagonal stripes over a dim scrim. Original prize/pop/glow/sparkles/chime remain. Background gameplay is paused and disabled while modal is visible, overriding the earlier running-board requirement. Hold stops at pickup;1.2-second queue progresses; tap dismisses without passing through. Purse wall-clock refill continues; actual inventory credit remains once at payout. Report: tickets/CP-25.md. Earlier checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 translucent modal pickup (October 29, 2026)

Current UAT10 source `work/cp25/pickup-modal/release.html`, pinned to Oct29 UAT9. `prepare.py` replaces radial rays with a clipped translucent336×320 popup and light diagonal strokes. `queueTreatAward` stops hold/drag. `step` returns while award queue is non-empty. `update` advances modal timer, then returns with regen if a modal existed at frame start; gameplay/power/clear timers resume next frame after dismissal/expiry. Pointerdown modal guard consumes dismissal before underlying controls. Saves/physics equations/art assets unchanged. Three checks verify actual body/time freeze, resume, queue/credit persistence and advance ordering. Evidence: tickets/CP-25-evidence/pickup-modal/. Report tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Translucent modal checkpoint recorded')
