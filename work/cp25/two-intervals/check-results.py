from pathlib import Path
import json
p=Path('tickets/CP-25-evidence/two-intervals');w=json.loads((p/'wins.json').read_text());print({'baseline':sum(x['source']=='baseline' and x['result']=='won' for x in w),'trial':sum(x['source']=='candidate' and x['result']=='won' for x in w),'trialRuns':sum(x['source']=='candidate' for x in w)});a=json.loads((p/'physics-audit.json').read_text());assert all(x['confirmedThroughCrossings']==x['unearnedFlips']==x['deepSamplesOverHalfUnit']==0 for x in a['results']);print('Requested physics checks pass')
