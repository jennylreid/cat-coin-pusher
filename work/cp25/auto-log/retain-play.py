from pathlib import Path
p=Path('work/cp25/auto-log/logger.js');s=p.read_text(encoding='utf-8');s=s.replace("const saved=JSON.parse(raw),s=saved.current?.samples?.length?saved.current:saved.previous;", "const saved=JSON.parse(raw),recent=saved.current,useful=recent?.drops?.length||recent?.samples?.some(row=>row[12]>0),s=useful?recent:(diagValidSession(saved.previous)?saved.previous:recent);")
p.write_text(s,encoding='utf-8')
p=Path('work/cp25/auto-log/check.cjs');s=p.read_text(encoding='utf-8').replace("again.close();\n// Verify", "again.c.diagFrame(500,1,1,1,false);again.c.diagExport();again.close();const carry=await make({sourceFile:src,storage});assert.equal(JSON.parse(carry.c.diagExport()).previous.drops.length,80);carry.close();\n// Verify")
p.write_text(s,encoding='utf-8')
