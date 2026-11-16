from pathlib import Path
p=Path(__file__).parent
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'loop-repair'/name).read_text(encoding='utf-8').replace('work/cp25/loop-repair','work/cp25/inventory-grid').replace('CP-25-evidence/loop-repair','CP-25-evidence/inventory-grid')
 if name=='stage.py':
  t=t.replace("p.parent/'paw-ui/release.html'","p.parent/'loop-repair/release.html'").replace("['passed'])==6","['passed'])==2")
  t=t.replace("h=(p/'draft.html').read_bytes();", "h=(p/'draft.html').read_bytes().replace(b\"const BUILD = 'CP-25 INVENTORY PREVIEW';\",b\"const BUILD = '2026.10.29 UAT 13';\");assert b\"const BUILD = '2026.10.29 UAT 13';\" in h;")
  t=t.replace('2026.10.29 UAT 12','2026.10.29 UAT 13').replace('before-CP-25-loop-repair-','before-CP-25-inventory-grid-').replace('Jenny reported zero-prize endless board and20FPS; explicitly chose failure/restart of same board; UAT fix/recovery and render optimization','Jenny approved compact Inventory with power counts and contrasting doily Collections tile; UAT only')
 (p/name).write_text(t,encoding='utf-8')
print('Prepared approved compact Inventory UAT publication')
