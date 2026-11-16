from pathlib import Path
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);b=json.loads((r/m['backup']/'CatCoinPusher-UAT-game.json').read_bytes())
assert u['version']==m['version']>b['version'];assert u['displayName']==m['displayName']
for k in b:
 if k not in ['version','displayName','files']:assert u[k]==b[k],k
changed=[k for k in u['files'] if u['files'][k]!=b['files'].get(k)];assert changed==m['changedFiles']
for k in changed:
 source=p/'release.html' if k=='index.html' else p/'art'/Path(k).name
 assert base64.b64decode(u['files'][k])==source.read_bytes()
assert 'img/art/cheese-scene-v1.png' in u['files']
assert hashlib.sha256(raw).hexdigest()==m['stagedJSONSHA256']
(r/'tickets/CP-25-evidence/inventory-grid/package-verification.json').write_text(json.dumps(dict(version=u['version'],changedFiles=changed,otherPackageFieldsPreserved=True,approvedBackgroundBytesMatch=True,approvedKitchenPresent=True,sha256=m['stagedJSONSHA256']),indent=2));print('Water UAT package verified')
