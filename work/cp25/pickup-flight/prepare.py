from pathlib import Path
p=Path(__file__).parent
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'no-box'/name).read_text(encoding='utf-8').replace('work/cp25/no-box','work/cp25/pickup-flight').replace('CP-25-evidence/no-box','CP-25-evidence/pickup-flight')
 if name=='stage.py':t=t.replace("p.parent/'kitchen/release.html'","p.parent/'no-box/release.html'").replace("['passed'])==4","['passed'])==6").replace('2026.10.29 UAT 4','2026.10.29 UAT 5').replace('before-CP-25-no-box-','before-CP-25-pickup-flight-').replace('Jenny requested no square highlight when dragging to collection slots; UAT only','Jenny requested replacing pickup overlay with item flight to satchel and sound; UAT only')
 (p/name).write_text(t,encoding='utf-8')
