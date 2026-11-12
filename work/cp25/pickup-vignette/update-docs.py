from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
f=r/'tickets/CP-25.md';t=f.read_text(encoding='utf-8')
t=t.replace('2026.10.29 UAT 8','2026.10.29 UAT 9').replace('20261029105357',str(m['version'])).replace('Jenny requested trying the proposed soft spotlight after rejecting the framed draft.', 'Jenny approved the spotlight motion and requested a larger overlay pattern to dim the background scene.')
t=t.replace('## Soft spotlight trial','## Patterned spotlight overlay')
t=t.replace('Board is gently dimmed (28% neutral-dark veil), retaining its colour.', 'Full-screen neutral-dark veil increased to52%, with a broad edge vignette and16 low-contrast warm radial rays behind the prize. The background scene is more subdued while remaining visible.')
t=t.replace('soft dim/glow and three sparkles', 'full-screen patterned vignette/glow and three sparkles')
t=t.replace('CP-25-evidence/pickup-spotlight/','CP-25-evidence/pickup-vignette/').replace('pickup-spotlight.mp4','pickup-vignette.mp4').replace('Baseline Oct29 UAT7','Baseline Oct29 UAT8').replace('work/cp25/pickup-spotlight/','work/cp25/pickup-vignette/').replace('before-CP-25-pickup-spotlight-','before-CP-25-pickup-vignette-').replace('b8462b8c359e22cbff433ca9c9468efe4ab022b0196f1b6ff069530c40c9a8cf',m['stagedJSONSHA256'])
t=t.replace('[Previous frame report](CP-25-evidence/pickup-frame-report.md)', '[Previous spotlight report](CP-25-evidence/pickup-spotlight-report.md)')
f.write_text(t,encoding='utf-8')
f=r/'tickets/CP-25-evidence/pickup-spotlight-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 9 / APK4** ({m['version']}).

CP-25 approved spotlight motion retained; backdrop now has a stronger full-screen dim, broad vignette and radial pattern. Warm glow/pop/three sparkles,1.2-second queue, chime and zero-coin dismissal retained. Collections and completion payoff retained.

Source: work/cp25/pickup-vignette/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md',f'''## CP-25 patterned spotlight (October 29, 2026)

Current UAT9/APK4 ({m['version']}) retains Jenny's approved spotlight motion but broadens/strengthens its backdrop:52% neutral-dark veil, edge vignette and16 low-contrast warm radial rays across the screen. Original prize, warm glow/pop, three sparkles,1.2-second timing/chime/tap-away remain. No frame/text/desaturation. Report: tickets/CP-25.md. Earlier checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 patterned spotlight (October 29, 2026)

Current UAT9 source `work/cp25/pickup-vignette/release.html`, pinned to Oct29 UAT8. `prepare.py` changes only the pickup backdrop and build label: neutral veil0.52, radial dark edge vignette to0.28,16 static radial wedges with feathered length gradient (peak0.075). No readback/new assets; approved spotlight sprite/pop/sparkles/timing, queue/input/sound and saves unchanged. Four relevant checks/package/cloud/clip: tickets/CP-25-evidence/pickup-vignette/. Report tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Patterned backdrop checkpoint recorded')
