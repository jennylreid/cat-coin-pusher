from pathlib import Path
import json,base64,hashlib,re
p=Path(__file__).parent;r=p.parents[1]
m=json.loads((p/'publication-manifest.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes()
assert hashlib.sha256(raw).hexdigest()==m['stagedJSONSHA256']
u=json.loads(raw);old=json.loads((r/m['backup']/'CatCoinPusher-UAT-game.json').read_bytes())
assert u['version']==m['version']>old['version'] and u['apkVersion']==4
assert u['apk']==old['apk']
assert [n for n in u['files'] if u['files'][n]!=old['files'][n]]==['index.html']
h=re.sub(r"const BUILD = '[^']+';",lambda _:f"const BUILD = '{m['displayName']}';",(p/'draft.html').read_text(encoding='utf-8'))
assert h==(p/'release.html').read_text(encoding='utf-8')
assert base64.b64decode(u['files']['index.html'])==(p/'release.html').read_bytes()
result=dict(version=u['version'],builderMatchesRelease=True,publishedHTMLMatchesRelease=True,nonHTMLFilesUnchanged=len(u['files'])-1,apkUnchanged=True)
(r/'tickets/CP-25-evidence/package-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))

