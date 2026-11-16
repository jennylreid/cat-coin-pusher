from pathlib import Path
import json,base64,hashlib
p=Path('work/cp25/auto-log');u=json.loads(Path('uat/CatCoinPusher-UAT-game.json').read_bytes());assert u['version']==20261030124245
h=base64.b64decode(u['files']['index.html']);(p/'baseline.html').write_bytes(h);(p/'baseline.json').write_text(json.dumps({'version':u['version'],'displayName':u['displayName'],'htmlSHA256':hashlib.sha256(h).hexdigest()},indent=2))
