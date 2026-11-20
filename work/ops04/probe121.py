# OPS-04: real-Chrome boot of the UAT 121 runtime folder compared with the published base's boot folder (logs/probe-base-<base>.json, made on first run).
# Expected request differences: the 3 CP-90 art files no longer requested, paw-dance.wav -> paw-dance.flac. Writes real-browser-probe.json.
# Usage: python probe121.py [dev]
import json,subprocess,sys
from pathlib import Path
p=Path(__file__).parent;r=p.parents[1];DEV='dev' in sys.argv;v=json.loads((p/'release-version.json').read_text());N=v['displayName'].split()[-1]
G=p/('boot'+N+('dev' if DEV else ''));e=r/('tickets/OPS-04-evidence/uat'+N+('-dev' if DEV else ''));e.mkdir(parents=True,exist_ok=True)
bf=p/('logs/probe-base-%s.json'%v['base'])
if not bf.exists():bf.write_text(subprocess.run(['node',str(p/'probe.cjs'),str(p.parent/v['base']/('boot'+v['base'].replace('cp',''))),'20'],capture_output=True,text=True,check=True).stdout.strip().splitlines()[-1])
base=json.loads(bf.read_text())
o=json.loads(subprocess.run(['node',str(p/'probe.cjs'),str(G),'20'],capture_output=True,text=True,check=True).stdout.strip().splitlines()[-1])
norm=lambda xs:{x.split('/',3)[-1] if x.startswith(('log:','404')) is False else x for x in xs}
import re
strip=lambda s:re.sub(r'http://127\.0\.0\.1:\d+/','',s)
eb={strip(x) for x in base['errors']};o['errorsNew']=[x for x in o['errors'] if strip(x) not in eb]
o['missingNew']=[x for x in o['missing'] if x not in base['missing']]
gone=sorted(set(base['served'])-set(o['served']));new=sorted(set(o['served'])-set(base['served']))
o['notRequestedAnyMore']=gone;o['newlyRequested']=new
exp_gone={'img/art/cp90-ginger-run.webp','img/art/cp90-cream-run.webp','img/art/cp90-ginger-peek.webp','sounds/effects/paw-dance.wav'}
o['requestsAsExpected']=set(gone)<=exp_gone and new==['sounds/effects/paw-dance.flac']
o['dir']=str(G.resolve());o['passed']=bool(o['title']) and not o['errorsNew'] and not o['missingNew'] and o['requestsAsExpected']
(e/'real-browser-probe.json').write_text(json.dumps(o,indent=1));print(json.dumps({k:o[k] for k in ('title','errorsNew','missingNew','notRequestedAnyMore','newlyRequested','requestsAsExpected','passed')}))
