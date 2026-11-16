from pathlib import Path
p=Path(__file__).parent;r=p.parents[2]
f=r/'tickets/CP-25.md';t=f.read_text(encoding='utf-8')
t=t.replace('2026.10.29 UAT 3','2026.10.29 UAT 4').replace('20261029073906','20261029074121')
t=t.replace('## Kitchen published','## Kitchen and drag feedback published\n\n- Removed the square destination highlight while dragging in both Water and Kitchen, as requested. The item outline, drag ghost and matching hitbox remain.')
t=t.replace('CP-25-evidence/kitchen/','CP-25-evidence/no-box/').replace('Baseline Oct29 UAT2. Source `work/cp25/kitchen/release.html`; builder `build.py`.', 'Baseline Oct29 UAT3. Source `work/cp25/no-box/release.html`; builder `prepare.py`.')
t=t.replace('before-CP-25-kitchen-','before-CP-25-no-box-').replace('Only HTML, approved kitchen painting and derived cheese outline changed.', 'Only HTML changed to remove the two hover rectangles; approved assets retained.').replace('164d3cc6a62de323d61fe6b11fb7059fbf16281f3db45fa7c49d68d11cb65e30','1a9dacb5016ddb864654adbd737e605edd833f8acacd37ed3e6c4925268464cf')
t=t.replace('[Previous report](CP-25-evidence/seahorse-report.md)', '[Kitchen integration report](CP-25-evidence/kitchen-report.md) and [previous report](CP-25-evidence/seahorse-report.md)')
f.write_text(t,encoding='utf-8')
f=r/'tickets/CP-25-evidence/kitchen-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
for name in ['uat/README.md','DEVELOPER.md','SPEC.md']:
 f=r/name;t=f.read_text(encoding='utf-8').replace('2026.10.29 UAT 3','2026.10.29 UAT 4').replace('Current UAT3','Current UAT4').replace('20261029073906','20261029074121').replace('before-CP-25-kitchen-','before-CP-25-no-box-')
 if name=='uat/README.md':t=t.replace('work/cp25/kitchen/release.html','work/cp25/no-box/release.html')
 if name=='DEVELOPER.md':t=t.replace('Current UAT4 source `work/cp25/kitchen/release.html`, pinned to Oct29 UAT2.', 'Current UAT4 source `work/cp25/no-box/release.html`, pinned to Oct29 UAT3; `prepare.py` removes hover rectangles in Water/Kitchen without changing item outlines or hitboxes. Kitchen integration source is `work/cp25/kitchen/release.html`, pinned to Oct29 UAT2.')
 if name=='SPEC.md':t=t.replace('Further Kitchen items are proposals', 'Square destination highlights during collection drags are removed; item outlines remain. Further Kitchen items are proposals')
 f.write_text(t,encoding='utf-8')
print('Drag feedback correction recorded')
