from pathlib import Path
import json,hashlib
p=Path(__file__).parent;s=(p/'baseline.html').read_text(encoding='utf-8')
def rep(a,b):
 global s
 assert a in s,a[:100];s=s.replace(a,b)
rep("const BUILD = '2026.10.30 UAT 19';","const BUILD = '2026.10.30 UAT 20';")
# Approved one-interval trial: keep every dependent timer/cast/tray term consistent.
assert s.count('STEP/2')==4 and s.count('sub<=2')==1 and s.count('sub/2')==1
s=s.replace('STEP/2','STEP').replace('sub<=2','sub<=1').replace('sub/2','sub')
s=s.replace('// CP-25: two contact intervals per tick, approved trial; CCD and repair remain.','// CP-25: one contact interval per tick, approved trial; CCD and repair remain.')
rep('for(let pass=0;pass<3;pass++){','for(let pass=0;pass<4;pass++){')
# Input coordinates are projected at the actual release depth, not the old fixed depth.
rep('y: DROP_Y, lookX };','y: DROP_Y, lookX, screenX:sx };')
rep('y:DROP_Y,lookX};','y:DROP_Y,lookX,screenX:sx};')
rep('const x=Math.max(200-PUSH_HALF+COIN_R,Math.min(200+PUSH_HALF-COIN_R,at.x)),exit=mouthExit(proj(x,depth).x);','const requestedX=Number.isFinite(at.screenX)?200+(screenToGameX(at.screenX)-200)/__plane(depth).gx:at.x;\n const x=Math.max(200-PUSH_HALF+COIN_R,Math.min(200+PUSH_HALF-COIN_R,requestedX)),exit=mouthExit(proj(x,depth).x);')
rep('diagDrop(at.x,b.rb.translation().x/M,200+(p.x-200)*VIEW.z);', 'const diagWorldX=b.rb.translation().x/M;diagDrop(requestedX,diagWorldX,200+(screenOf(diagWorldX,depth,entryHeight).x-200)*VIEW.z);')
rep('renderPixelRatio},samples:[]','renderPixelRatio},releaseProjection:\'fitted-camera\',samples:[]')
rep('function frame(now){', 'function frame(now){\n if(diagNativeSuspended){last=now;requestAnimationFrame(frame);return;}')
# Native transport shares the same bounded snapshot; no clipboard transfer required.
a=s.index('function diagExport(){');b=s.index('function diagCopyLog(){',a)
old=s[a:b];payload=old.replace('function diagExport(){','function diagPayload(){',1).replace(" diagFlush('export');\n",'')
s=s[:a]+payload+"function diagExport(){diagFlush('export');return diagPayload();}\n"+(p/'file-bridge.js').read_text(encoding='utf-8')+'\n'+s[b:]
a=s.index('function diagPersist(');b=s.index('function diagFrame(',a);part=s[a:b];pos=part.rfind('}')
part=part[:pos]+" try{if(diagnosticFileBridge())Android.savePerformanceLog(diagPayload());}catch(e){}\n"+part[pos:];s=s[:a]+part+s[b:]
rep('Stored locally; no automatic upload.','Written to the user-connected log file, or shared as a JSON file on request.')
rep('<h2>UAT Settings</h2><button id="copy-perf-log" class="wide">Copy performance log</button>', '<h2>UAT Settings</h2><button id="diag-send-file" class="wide">Send performance log</button><button id="diag-link-file" class="wide">Connect log file to OneDrive</button><button id="diag-share-file" class="wide">Share log file to OneDrive</button><p id="diag-file-status"></p>')
rep("panel.querySelector('#copy-perf-log').onclick=diagCopyLog;", "panel.querySelector('#diag-send-file').onclick=diagSendFile;\n panel.querySelector('#diag-link-file').onclick=()=>{diagFlush('link-file');if(diagnosticFileBridge())Android.connectDiagnosticFile();};\n panel.querySelector('#diag-share-file').onclick=diagShareFile;\n onDiagnosticStatus(diagnosticFileStatus());\n diagFlush('settings');")
(p/'candidate.html').write_text(s,encoding='utf-8')
print('UAT20: approved one interval, depth-correct finger projection, native file transport')
