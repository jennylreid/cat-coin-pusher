import json,collections
from pathlib import Path
p=json.loads(Path('work/cp25/perf-rework/uat16.cpuprofile').read_text());nodes={n['id']:n for n in p['nodes']};c=collections.Counter();by=collections.Counter()
for ident,delta in zip(p['samples'],p['timeDeltas']):
 n=nodes[ident];f=n['callFrame'];name=f['functionName'];c[(name,f['url'],f['lineNumber'])]+=delta
for (name,url,line),us in c.most_common(32):print(f'{us/1000:9.1f} ms  {name:45} {url[-55:]}:{line+1}')
