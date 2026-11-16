from pathlib import Path
import json,hashlib,shutil,base64
p=Path('work/cp25/log-file');r=Path('.');src=Path('C:/Users/jenny/.codex/attachments/c223e4ae-79ff-4f25-a5bc-0a3c8eab1de3/Pasted text.txt');raw=src.read_bytes();log=json.loads(raw.decode('utf-8-sig'));(r/'tickets/CP-25-evidence/log-file/UAT19-phone.json').write_text(json.dumps(log,indent=2),encoding='utf-8')
s=log['current'];late=[v for v in s['samples'] if 17<=v[0]<=21.2 and v[12]];hf=sum(v[12] for v in late);hm=sum(v[13] for v in late);hp=sum(v[14] for v in late);hd=sum(v[15] for v in late)
analysis={'build':s['build'],'device':s['environment'],'heldSummary':s['summary'],'lateHeld':{'frames':hf,'seconds':hm/1000,'fps':hf*1000/hm,'physicsMs':hp/hf,'drawMs':hd/hf},'maxRightClampCanvasGap':max(v[1]-v[4] for v in s['drops'] if v[1] is not None),'requestedVsActualWorldMaxError':max(abs(v[2]-v[3]) for v in s['drops'])};(r/'tickets/CP-25-evidence/log-file/phone-analysis.json').write_text(json.dumps(analysis,indent=2));print(json.dumps(analysis,indent=2))
uRaw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(uRaw);assert u['version']==20261030154817
(p/'baseline.html').write_bytes(base64.b64decode(u['files']['index.html']));(p/'baseline-pin.json').write_text(json.dumps({'version':u['version'],'sha256':hashlib.sha256(uRaw).hexdigest(),'apkSHA256':hashlib.sha256((r/'uat/CatCoinPusher-UAT.apk').read_bytes()).hexdigest()},indent=2))
shutil.copytree(r/'work/ops02/android',p/'android',ignore=shutil.ignore_patterns('.gradle','build'),dirs_exist_ok=True)
# Existing file allows one-time OPEN_DOCUMENT write access; do not rely on OneDrive create-document support.
sink=r/'uat/diagnostics/CatCoin-UAT-performance.json'
if not sink.exists():sink.write_text(json.dumps({'sink':'catcoin-uat-diagnostic-sink-v1','format':'CatCoin UAT performance log v1','state':'Awaiting phone connection'},indent=2),encoding='utf-8')
