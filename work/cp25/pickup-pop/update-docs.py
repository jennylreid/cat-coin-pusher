from pathlib import Path
p=Path(__file__).parent;r=p.parents[2]
f=r/'tickets/CP-25.md';t=f.read_text(encoding='utf-8')
t=t.replace('2026.10.29 UAT 5','2026.10.29 UAT 6').replace('20261029074827','20261029081406')
t=t.replace('Jenny requested replacing the current collected-item overlay with movement into the satchel and sound.', 'Jenny confirmed bottom-to-existing-side-satchel direction, rejected the first motion draft and asked for a larger-then-smaller, more elegant pickup.')
t=t.replace('Existing collected sprite appears in the bottom play area after its front fall, arcs into the **existing approved side satchel icon**, shrinks and disappears. Satchel gives a small arrival pulse.', 'Existing sprite pops from small to a larger 1.65-scale prize near bottom centre, with restrained overshoot/tilt, then pauses briefly for recognition. It follows a cubic curved path with smooth acceleration and shrinks into the **existing approved side satchel opening**. Satchel gives a soft bounce and three small gold glints on arrival.')
t=t.replace('then 1.2 seconds for appearance/flight/arrival.', 'then 1.6 seconds: pop 0–0.28, recognition hold to 0.48, curved flight/shrink to 1.25, satchel catch to 1.6.')
start=t.index('- Direction assumption stated');end=t.index('\n\n## Evidence',start);t=t[:start]+'- Bottom-to-side-satchel direction explicitly confirmed by Jenny. No new art generated; approved sprites reused.'+t[end:]
t=t.replace('CP-25-evidence/pickup-flight/','CP-25-evidence/pickup-pop/').replace('pickup-flight.mp4','pickup-pop.mp4').replace('5.4 seconds','6.6 seconds')
t=t.replace('Baseline Oct29 UAT4. Source `work/cp25/pickup-flight/release.html`; builder `build.py` + `awards.js`.', 'Baseline Oct29 UAT5. Source `work/cp25/pickup-pop/release.html`; builder `prepare.py` + `awards.js`.')
t=t.replace('before-CP-25-pickup-flight-','before-CP-25-pickup-pop-').replace('c07c2d52672ff55afbd1904234b8dd12d191f4a49d0f5f46b1c76c8499bb13da','2f406d2fdfa058580beb3ba4943e7a25e08473075ed519d2fdb1f55f8c772370')
t=t.replace('[Previous report](CP-25-evidence/no-box-report.md)', '[Previous motion report](CP-25-evidence/pickup-flight-report.md) and [scene report](CP-25-evidence/no-box-report.md)')
f.write_text(t,encoding='utf-8')
f=r/'tickets/CP-25-evidence/pickup-flight-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
f=r/'uat/README.md';t=f.read_text(encoding='utf-8').replace('2026.10.29 UAT 5','2026.10.29 UAT 6').replace('20261029074827','20261029081406').replace('work/cp25/pickup-flight/','work/cp25/pickup-pop/').replace('before-CP-25-pickup-flight-','before-CP-25-pickup-pop-').replace('with a flight from bottom play area into the existing side satchel, shrinking on arrival with the pickup chime.', 'with a larger prize pop and recognition pause, then smooth curved flight/shrink into the existing side satchel, finishing with a soft bounce/glints and pickup chime.');f.write_text(t,encoding='utf-8')
for name,note in [('SPEC.md','''## CP-25 pickup pop and stow (October 29, 2026)

Current UAT6/APK4 (20261029081406) refines pickup motion after Jenny confirmed bottom-to-existing-side-satchel direction. Original prize pops larger with slight overshoot/tilt near bottom centre, pauses for recognition, then accelerates smoothly along a cubic curve while shrinking into the satchel opening. Chime, soft satchel bounce and three gold glints mark arrival. After the front fall, presentation lasts 1.6 seconds per queued item. No backdrop/card/text; ordinary play continues, inventory credit remains once at payout. Approved collections/art and completion payoff retained. Preview/report: tickets/CP-25.md. Earlier checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 pickup pop and stow (October 29, 2026)

Current UAT6 source `work/cp25/pickup-pop/release.html`, pinned to Oct29 UAT5. Builder `prepare.py` + `awards.js`. No save/physics/asset changes. Queue still starts at -0.5s for front fall. t0–0.28 pop to 1.65 scale with restrained back-easing; hold to0.48; quintic smooth progress drives cubic path/shrink to1.25; arrival chime once and satchel bounce/glints until1.6. Endpoint uses satchel opening at38% height. Non-modal input, inventory pause and clear-after-queue behavior retained; six checks pass. Clip/report: tickets/CP-25-evidence/pickup-pop/, tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Refined pickup movement and publication recorded')
