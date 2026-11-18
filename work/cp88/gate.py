from pathlib import Path
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-69-evidence/uat88'
for name in ['checks63-tail.json','checks64-tail.json','checks-title-restore.json']:
 c=json.loads((e/name).read_text(encoding='utf-8'));assert c['passed'] is True and not c['failed'],(name,c['failed']);assert Path(c['build'])==(p/'release.html').resolve()
observed=json.loads((e/'behavior-console-results.json').read_text());assert observed['CP63']['passed'] and observed['CP64']['passed']
m=json.loads((p/'publication-manifest.json').read_text());sha=lambda b:hashlib.sha256(b).hexdigest()
assert sha((p/'release.html').read_bytes())==m['releaseHTMLSHA256']
assert sha((p/'CatCoinPusher-UAT-game.json').read_bytes())==m['stagedJSONSHA256']
assert sha((r/'uat/CatCoinPusher-UAT-game.json').read_bytes())==m['baselineJSONSHA256']
old=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());new=json.loads((p/'CatCoinPusher-UAT-game.json').read_bytes())
assert new['version']>old['version'] and new['apkVersion']==old['apkVersion']==7 and not new['apk']
assert len(new['files'])==70 and len(old['files'])==66
assert all(new['files'][k]==v for k,v in old['files'].items() if k!='index.html')
a=json.loads((e/'scope-audit.json').read_text());assert a['passed'] and a['releaseSHA256']==m['releaseHTMLSHA256']
assert all(json.loads((e/'developer-handlers.json').read_text()).values())
assert (e/'inspection.mp4').stat().st_size>10000
print('Publication gate: PASS (CP-63, CP-64, title, scope, browser, handlers, exact package)')
