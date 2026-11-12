from pathlib import Path
p=Path('work/cp25/auto-log/logger.js');s=p.read_text(encoding='utf-8').replace('}catch(e){/* Logging must never interrupt play or game saves. */}',"}catch(e){diagLastSave=performance.now();diagNeedSave=false;diagSession.storageError=e&&e.name?String(e.name):'unavailable';/* Keep in-memory export available; never retry each frame. */}")
p.write_text(s,encoding='utf-8')
p=Path('work/cp25/auto-log/check.cjs');s=p.read_text(encoding='utf-8').replace("const result={passed:","const blocked=await make({sourceFile:src});let attempts=0;blocked.c.localStorage.setItem=()=>{attempts++;throw new Error('blocked');};blocked.c.diagExport();for(let i=0;i<120;i++)blocked.c.diagFrame(1000/60,1,1,1,false);assert.equal(attempts,1);assert(JSON.parse(blocked.c.diagExport()).current.storageError);blocked.close();\nconst result={passed:")
s=s.replace('Bounded120 samples/80 drops/40 events; no rewards or game-save changes from recording/export','Bounded120 samples/80 drops/40 events; no game-save changes; storage failure cannot cause per-frame retries')
p.write_text(s,encoding='utf-8')
