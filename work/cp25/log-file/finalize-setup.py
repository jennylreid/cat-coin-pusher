from pathlib import Path
p=Path('work/cp25/log-file/build.py');s=p.read_text(encoding='utf-8').replace("rep('<h2>UAT Settings", "rep('Stored locally; no automatic upload.','Written to the user-connected log file, or shared as a JSON file on request.')\nrep('<h2>UAT Settings");p.write_text(s,encoding='utf-8')
p=Path('work/cp25/log-file/android/app/src/main/java/com/jenny/catpusher/uat/MainActivity.java');s=p.read_text(encoding='utf-8').replace('Log kept locally; reconnect the file or use Share log','Could not save the log file; reconnect or try Share log').replace('window.appPaused && appPaused(true)',"window.appPaused && appPaused(true); window.diagFlush && diagFlush('native-pause')")
p.write_text(s,encoding='utf-8')
# Give the APK its matching game version and actual current runtime, not the old OPS-02 assets.
from datetime import datetime,timezone,timedelta
import json,base64
p=Path('work/cp25/log-file');u=json.loads(Path('uat/CatCoinPusher-UAT-game.json').read_bytes());v=int(datetime.now(timezone(timedelta(hours=-4))).strftime('%Y%m%d%H%M%S'));assert v>u['version'];(p/'release-version.json').write_text(json.dumps({'version':v,'displayName':'2026.10.30 UAT 20','apkVersion':5},indent=2))
