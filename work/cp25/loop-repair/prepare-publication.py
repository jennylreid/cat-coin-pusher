from pathlib import Path
p=Path(__file__).parent
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'pickup-modal'/name).read_text(encoding='utf-8').replace('work/cp25/pickup-modal','work/cp25/loop-repair').replace('CP-25-evidence/pickup-modal','CP-25-evidence/loop-repair')
 if name=='stage.py':t=t.replace("p.parent/'pickup-vignette/release.html'","p.parent/'paw-ui/release.html'").replace("['passed'])==3","['passed'])==6").replace('2026.10.29 UAT 10','2026.10.29 UAT 12').replace('before-CP-25-pickup-modal-','before-CP-25-loop-repair-').replace('Jenny clarified translucent modal popup with light diagonal stripes and disabled background; UAT only','Jenny reported zero-prize endless board and20FPS; explicitly chose failure/restart of same board; UAT fix/recovery and render optimization')
 (p/name).write_text(t,encoding='utf-8')
