from pathlib import Path
import json,hashlib
p=Path(__file__).parent;raw=(p/'baseline.html').read_bytes();assert hashlib.sha256(raw).hexdigest()==json.loads((p/'baseline.json').read_text())['htmlSHA256']
s=raw.decode().replace(chr(13),'')
def rep(a,b):
 global s
 assert a in s,a[:100];s=s.replace(a,b)
rep("const BUILD = '2026.10.30 UAT 18';","const BUILD = '2026.10.30 UAT 19';")
pos=s.index('Promise.all([RAPIER.init(), loadArt()])');s=s[:pos]+(p/'logger.js').read_text(encoding='utf-8')+'\n'+s[pos:]
rep('let n=0;const physicsStart=performance.now();','const diagWasHolding=holding;let n=0;const physicsStart=performance.now();')
rep('recordFrame(frameElapsed,physics,drawing,n);','recordFrame(frameElapsed,physics,drawing,n);diagFrame(frameElapsed,physics,drawing,n,diagWasHolding);')
rep('function stopDrops(){holding=false;streamPointer=null;}',"function stopDrops(reason='stop'){diagEndHold(reason);holding=false;streamPointer=null;}")
rep('streamPointer=e.pointerId;streamSampleTime=-Infinity;holding = true; holdPos = aimFromScreen(p.x); aim = holdPos; aimShow = 1;', 'streamPointer=e.pointerId;streamSampleTime=-Infinity;holding = true; holdPos = aimFromScreen(p.x); aim = holdPos; aimShow = 1;diagBeginHold(p.x,e.timeStamp);')
rep('holdPos=aimFromScreen(toGame(latest).x);aim=holdPos;aimShow=1;', 'const diagPoint=toGame(latest);diagInput(diagPoint.x,stamp);holdPos=aimFromScreen(diagPoint.x);aim=holdPos;aimShow=1;')
rep('if(e.pointerId===streamPointer)stopDrops();','if(e.pointerId===streamPointer)stopDrops(ev);')
rep('b.mouthExit=exit.id;sfx.drop();save();return true;', 'b.mouthExit=exit.id;diagDrop(at.x,b.rb.translation().x/M,200+(p.x-200)*VIEW.z);sfx.drop();save();return true;')
rep('<h2>UAT Settings</h2>','<h2>UAT Settings</h2><button id="copy-perf-log" class="wide">Copy performance log</button>')
rep("panel.querySelector('#sound-test').onclick=", "panel.querySelector('#copy-perf-log').onclick=diagCopyLog;\n panel.querySelector('#sound-test').onclick=")
# Full collision/step implementation remains byte-identical to UAT18.
base=raw.decode().replace(chr(13),'')
a='function coinRotationContacts';b='function update('
assert s[s.index(a):s.index(b,s.index(a))]==base[base.index(a):base.index(b,base.index(a))]
(p/'candidate.html').write_text(s,encoding='utf-8')
