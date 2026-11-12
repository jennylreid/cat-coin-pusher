from pathlib import Path
p=Path(__file__).parent
for name in ['check.cjs','stage.py','publish.ps1','verify-cloud.py','verify.py']:
 text=(p.parent/'water'/name).read_text(encoding='utf-8')
 text=text.replace('work/cp25/water','work/cp25/seahorse').replace('CP-25-evidence/water','CP-25-evidence/seahorse')
 if name=='check.cjs':
  text=text.replace("assert(geo.slots.find(r=>r.id==='clam').future);", "assert(geo.slots.find(r=>r.id==='seahorse').future);assert(!a.placeItem('seahorse'));assert.equal(geo.slots.length,7);assert(geo.slots.find(r=>r.id==='clam').future);")
  text=text.replace("newFutureOutlines:['clam','kelp']", "newFutureOutlines:['seahorse']")
 if name=='stage.py':
  text=text.replace("p.parent/'scene-one/release.html'", "p.parent/'water/release.html'").replace("added=['water-scene-v1.png','tuna-outline.png','shrimp-outline.png']",'added=[]')
  text=text.replace('2026.10.29 UAT 1','2026.10.29 UAT 2').replace('before-CP-25-water-','before-CP-25-seahorse-').replace('Jenny approved Water painting and requested clam/kelp future outlines; UAT only','Jenny explicitly selected Include seahorse now; future outline only; UAT')
 (p/name).write_text(text,encoding='utf-8')
