from pathlib import Path
import hashlib
p=Path(__file__).parent
raw=(p/'uat10/release.html').read_bytes()
assert hashlib.sha256(raw).hexdigest()=='2730b37decbfe6970063f05e5eaa182d1400ccab540c71191ca993fd075c46c0'
s=raw.decode()
s=s.replace('if(time-lastDrop<.6-1e-6)', 'if(time-lastDrop<.35-1e-6)')
# Rendering must never mutate the list used by the sequential contact solver.
s=s.replace('bodies.sort((a, b) => a.sortK - b.sortK || a.uid - b.uid);', '// CP-22: draw order is local to the render pass.')
s=s.replace('try{for(const b of bodies)if(!b.danceDown){', 'try{for(const b of coinPaintOrder(bodies))if(!b.danceDown){')
s=s.replace('function __drawBoardBodies(){',(p/'occlusion.js').read_text()+'\nfunction __drawBoardBodies(){')
a=s.index('function __drawBoardBodies(){');b=s.index('const __oldFallOff=fallOff;',a)
s=s[:a]+s[a:b].replace('drawBody(b);','drawCoinOccluded(b);')+s[b:]
(p/'draft.html').write_text(s,encoding='utf-8')
