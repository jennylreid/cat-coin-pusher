from pathlib import Path
p=Path(__file__).parent
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'inventory-grid'/name).read_text(encoding='utf-8').replace('work/cp25/inventory-grid','work/cp25/pickup-options').replace('CP-25-evidence/inventory-grid','CP-25-evidence/pickup-options')
 if name=='stage.py':
  t=t.replace("p.parent/'loop-repair/release.html'","p/'observed-live.html'").replace("['passed'])==2","['passed'])==4")
  start=t.index("h=(p/'draft.html').read_bytes()");end=t.index('\nfiles=',start);t=t[:start]+"h=(p/'draft.html').read_bytes();assert b\"const BUILD = '2026.10.29 UAT 15';\" in h;(p/'release.html').write_bytes(h)"+t[end:]
  t=t.replace('2026.10.29 UAT 13','2026.10.29 UAT 15').replace('before-CP-25-inventory-grid-','before-CP-25-pickup-options-').replace('Jenny approved compact Inventory with power counts and contrasting doily Collections tile; UAT only','Jenny requested cycling pickup options and no tap-to-dismiss; latest UAT14 Calm face preserved; UAT only')
 (p/name).write_text(t,encoding='utf-8')
print('Prepared UAT15 against published UAT14; all non-HTML files preserved')
