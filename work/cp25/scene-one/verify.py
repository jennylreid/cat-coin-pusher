from pathlib import Path
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[2]
m=json.loads((p/'publication-manifest.json').read_text());u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());b=json.loads((r/m['backup']/'CatCoinPusher-UAT-game.json').read_bytes())
assert u['version']==m['version']>b['version']
assert u['displayName']==m['displayName']
for k in b:
 if k not in ['version','displayName','files']:assert u[k]==b[k],k
changed=[k for k in u['files'] if u['files'][k]!=b['files'].get(k)]
assert changed==m['changedFiles']
assert base64.b64decode(u['files']['index.html'])==(p/'release.html').read_bytes()
assert base64.b64decode(u['files']['img/art/collections-satchel-v1.png'])==(p/'art/collections-satchel-v1.png').read_bytes()
assert not any('water-scene' in k for k in u['files'])
assert hashlib.sha256((r/'uat/CatCoinPusher-UAT-game.json').read_bytes()).hexdigest()==m['stagedJSONSHA256']
(r/'tickets/CP-25-evidence/scene-one/package-verification.json').write_text(json.dumps(dict(version=u['version'],changedFiles=changed,allOtherPackageFieldsPreserved=True,approvedTileBytesMatch=True,unapprovedWaterAbsent=True,sha256=m['stagedJSONSHA256']),indent=2));print('UAT6 package verified')
