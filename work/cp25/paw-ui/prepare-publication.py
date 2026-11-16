from pathlib import Path
p=Path(__file__).parent
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'pickup-modal'/name).read_text(encoding='utf-8').replace('work/cp25/pickup-modal','work/cp25/paw-ui').replace('CP-25-evidence/pickup-modal','CP-25-evidence/paw-ui')
 if name=='stage.py':
  t=t.replace("p.parent/'pickup-vignette/release.html'","p.parent/'pickup-modal/release.html'")
  t=t.replace("h=(p/'draft.html').read_bytes();", "h=(p/'draft.html').read_bytes().replace(b\"const BUILD = 'CP-25 LAYOUT PREVIEW';\",b\"const BUILD = '2026.10.29 UAT 11';\");assert b\"const BUILD = '2026.10.29 UAT 11';\" in h;")
  t=t.replace('2026.10.29 UAT 10','2026.10.29 UAT 11').replace('before-CP-25-pickup-modal-','before-CP-25-paw-ui-').replace('Jenny clarified translucent modal popup with light diagonal stripes and disabled background; UAT only','Jenny selected B paw medallion, requested matching Collections tile, bottom Inventory satchel and top power buttons; explicitly requested UAT publication')
 (p/name).write_text(t,encoding='utf-8')
print('Prepared approved paw layout publication scripts')
