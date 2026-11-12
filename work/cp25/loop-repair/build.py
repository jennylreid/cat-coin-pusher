from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];h=(p.parent/'paw-ui/release.html').read_text(encoding='utf-8');u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==(p.parent/'paw-ui/release.html').read_bytes()
def rep(a,b):
 global h
 assert a in h,a[:90]
 h=h.replace(a,b)
rep("const BUILD = '2026.10.29 UAT 11';","const BUILD = '2026.10.29 UAT 12';")
start=h.index('function boardTick(dt)');end=h.index('function selectBoard(',start);h=h[:start]+(p/'progression.js').read_text(encoding='utf-8')+'\n'+h[end:]
rep('function resetBoard() {','function resetBoard() {\n retryWait=0;')
rep("else {sfx.empty();callouts=[];callout('TRY AGAIN', {color:'#ffb98b',dur:Infinity});}", "else {sfx.empty();callouts=[];callout(reason==='prize-lost'?'PRIZE LOST':'TRY AGAIN', {color:'#ffb98b',dur:1.4});}")
start=h.index('function load(){');end=h.index('function save(){',start);part=h[start:end];pos=part.rfind(' regen();');assert pos>=0;part=part[:pos]+" reconcileBoardTargets();\n if(board.status==='lost')callout('RETRYING BOARD '+(boardIndex+1),{color:'#ffb98b',dur:1.4});\n"+part[pos:];h=h[:start]+part+h[end:]
start=h.index('function gutterOff(');end=h.index('// Lightning coin:',start);part=h[start:end];part=part.replace('function gutterOff(b,x){','function gutterOff(b,x){\n if(b.dead)return;');part=part.replace(' removeCoin(b);',' removeCoin(b);\n reconcileBoardTargets();');h=h[:start]+part+h[end:]
rep("board.status==='won'?'Next board soon…':board.status==='ready'?", "board.status==='won'?'Next board soon…':board.status==='lost'?'Retrying this board…':board.status==='ready'?")
rep('powerCount, powerEnabled, queueTreatAward,','powerCount, powerEnabled, reconcileBoardTargets, retryBoard, queueTreatAward,')
start=h.index('function __drawBoardBodies(){');end=h.index('const __oldFallOff=',start);h=h[:start]+(p/'render-direct.js').read_text(encoding='utf-8')+'\n'+h[end:]
(p/'draft.html').write_text(h,encoding='utf-8');print('Built missing-prize failure/retry and stuck-save recovery')
