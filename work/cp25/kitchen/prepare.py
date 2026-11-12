from pathlib import Path
p=Path(__file__).parent
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'seahorse'/name).read_text(encoding='utf-8').replace('work/cp25/seahorse','work/cp25/kitchen').replace('CP-25-evidence/seahorse','CP-25-evidence/kitchen')
 if name=='stage.py':
  t=t.replace("p.parent/'water/release.html'","p.parent/'seahorse/release.html'").replace('added=[]',"added=['cheese-scene-v1.png','cheese-outline.png']").replace('2026.10.29 UAT 2','2026.10.29 UAT 3').replace('before-CP-25-seahorse-','before-CP-25-kitchen-').replace('Jenny explicitly selected Include seahorse now; future outline only; UAT','Jenny approved kitchen painting and renamed Cheese collection Kitchen; UAT only')
 if name=='verify.py':t=t.replace("assert not any('cheese-scene' in k for k in u['files'])", "assert 'img/art/cheese-scene-v1.png' in u['files']").replace('unapprovedCheeseAbsent=True','approvedKitchenPresent=True')
 (p/name).write_text(t,encoding='utf-8')
