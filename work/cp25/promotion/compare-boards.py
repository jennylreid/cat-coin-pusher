from pathlib import Path
import json
p=Path(__file__).resolve().parents[3]/'tickets/CP-25-evidence/promotion'
a=json.loads((p/'wins-UAT24.json').read_text());b=json.loads((p/'wins-production.json').read_text());assert len(a)==len(b)==18
rows=[]
for x,y in zip(a,b):
 x={k:v for k,v in x.items() if k!='source'};y={k:v for k,v in y.items() if k!='source'};assert x==y,(x,y);assert y['result']=='won';rows.append(y)
r={'UAT24Clears':18,'productionClears':18,'all18Match':True,'comparison':'Exact seed, board, gap, coinsUsed, simulation seconds and collected order','runs':rows}
(p/'board-comparison.json').write_text(json.dumps(r,indent=2));print('PASS: production18/18 clears; exact results match UAT24 in all18 runs')
