from pathlib import Path
import json,base64
p=Path('work/cp25/log-file');u=json.loads(Path('uat/CatCoinPusher-UAT-game.json').read_bytes());v=json.loads((p/'release-version.json').read_text());a=p/'android/app/src/main/assets';a.mkdir(exist_ok=True,parents=True)
for name,encoded in u['files'].items():
 t=a/name;t.parent.mkdir(parents=True,exist_ok=True);data=(p/'candidate.html').read_bytes() if name=='index.html' else base64.b64decode(encoded)
 if not t.exists() or t.read_bytes()!=data:t.write_bytes(data)
(a/'version.txt').write_text(str(v['version']));(a/'update-url.txt').write_bytes(Path('work/uat15/download-url.txt').read_bytes())
print('APK5 assets pinned to current runtime, matching UAT20 HTML/version')
