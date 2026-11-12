from pathlib import Path
p=Path('work/cp25/perf-rework/build.py');s=p.read_text(encoding='utf-8').replace("+' ms | '+bodies.length+' coins'", "+' ms | '+bodies.filter(coinSolid).length+' coins'");p.write_text(s,encoding='utf-8')
# Remove the empty try/finally left by the initial allocation experiment.
p=Path('work/cp25/perf-rework/queries.js');s=p.read_text(encoding='utf-8').replace('try{const hit=nativeShape(shape).contactShape(rp,rq,nativeShape(other),ro,rot,prediction);if(!hit)return null;', 'const hit=nativeShape(shape).contactShape(rp,rq,nativeShape(other),ro,rot,prediction);if(!hit)return null;').replace('finally{hit.free();}\n }\n finally{}','finally{hit.free();}');p.write_text(s,encoding='utf-8')
