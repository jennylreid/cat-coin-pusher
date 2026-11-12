from pathlib import Path
p=Path(__file__).parent
f=p/'frame12.cjs';s=(p/'frame-audit.cjs').read_text();s=s.replace('drawRestMitt(130);','drawRestMitt(130); __prizeRuns("cheese"); __prizeRuns("shrimp"); __prizeRuns("tuna");').replace("'coin','silver','quake'","'coin','silver','quake','item'");f.write_text(s)
f=p/'prize-video12.cjs';s=f.read_text().replace('revision-frames','prize12-frames').replace('revision-final.png','uat12-final.png').replace('pusher.json','uat12-pusher.json').replace('a.tryDrop({x:200})',"a.tryDrop({x:(a.bodies.find(b=>b.boardTarget)?.rb.translation().x||2)*100})");f.write_text(s)
