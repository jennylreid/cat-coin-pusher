# CP-93 UAT 122: real-Chrome boot of the UAT 122 runtime folder compared with the published UAT 121 boot folder (work/ops04/boot121).
# Only index.html changes, so the same files should be requested and no new errors appear. Writes real-browser-probe.json.
import json,subprocess,re
from pathlib import Path
p=Path(__file__).parent;r=p.parents[1];v=json.loads((p/'release-version.json').read_text());N=v['displayName'].split()[-1]
G=p/('boot'+N);e=r/('tickets/CP-93-evidence/uat'+N);e.mkdir(parents=True,exist_ok=True);(p/'shots').mkdir(exist_ok=True)
bf=p/('logs/probe-base-%s.json'%v['base'])
if not bf.exists():bf.write_text(subprocess.run(['node',str(p/'probe.cjs'),str(p.parent/v['base']/'boot121'),'20'],capture_output=True,text=True,check=True).stdout.strip().splitlines()[-1])
base=json.loads(bf.read_text())
o=json.loads(subprocess.run(['node',str(p/'probe.cjs'),str(G),'20'],capture_output=True,text=True,check=True).stdout.strip().splitlines()[-1])
strip=lambda s:re.sub(r'http://127\.0\.0\.1:\d+/','',s)
eb={strip(x) for x in base['errors']};o['errorsNew']=[x for x in o['errors'] if strip(x) not in eb]
o['missingNew']=[x for x in o['missing'] if x not in base['missing']]
o['notRequestedAnyMore']=sorted(set(base['served'])-set(o['served']));o['newlyRequested']=sorted(set(o['served'])-set(base['served']))
o['requestsAsExpected']=not o['notRequestedAnyMore'] and not o['newlyRequested']
o['dir']=str(G.resolve());o['passed']=bool(o['title']) and not o['errorsNew'] and not o['missingNew'] and o['requestsAsExpected']
(e/'real-browser-probe.json').write_text(json.dumps(o,indent=1));print(json.dumps({k:o[k] for k in ('title','errorsNew','missingNew','notRequestedAnyMore','newlyRequested','passed')}))
