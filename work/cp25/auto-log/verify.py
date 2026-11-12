from pathlib import Path
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw);b=json.loads((r/m['backup']/'CatCoinPusher-UAT-game.json').read_bytes())
assert u['version']==m['version']>b['version'] and u['displayName']==m['displayName']
assert {k:v for k,v in u.items() if k not in ['version','displayName','files']}=={k:v for k,v in b.items() if k not in ['version','displayName','files']}
assert u['files'].keys()==b['files'].keys();changed=[k for k in u['files'] if u['files'][k]!=b['files'][k]];assert changed==['index.html']
assert base64.b64decode(u['files']['index.html'])==(p/'release.html').read_bytes()
assert hashlib.sha256(raw).hexdigest()==m['stagedJSONSHA256']
(r/'tickets/CP-25-evidence/auto-log/package-verification.json').write_text(json.dumps(dict(version=u['version'],displayName=u['displayName'],baseline=b['displayName'],changedFiles=changed,otherPackageFieldsPreserved=True,sha256=m['stagedJSONSHA256']),indent=2));print('CP-25 UAT19 package verified')
