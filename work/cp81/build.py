"""CP-62 follow-up: add bowtie A/B/C to UAT 80's existing colour mechanism."""
from pathlib import Path
import json,hashlib,shutil
p=Path(__file__).parent;r=p.parents[1];base=p.parent/'cp80/release.html'
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()=='23a4008c96940a6be753165c55afd2768b04420cfa8da00687bc840f170b4534'
s=s.decode();v=json.loads((p/'release-version.json').read_text());(p/'art').mkdir(exist_ok=True)
anchor="async function image(src) { const im = new Image(); im.src = src; await im.decode(); return im; }"
code='\n // CP-62 follow-up: Jenny added bow ties to random per-prize colours.\n'
for o in 'abc':
    name=f'cp62-bowtie-{o}.png';shutil.copyfile(r/f'tickets/CP-62-evidence/bowtie-{o}.png',p/'art'/name)
    code+=f" CP62_ART.bowtie=CP62_ART.bowtie||[];CP62_ART.bowtie.push(await image('img/art/{name}'));\n"
edits=[("const BUILD = '2026.11.16 UAT 80';",f"const BUILD = '{v['displayName']}';"),(anchor,anchor+code)]
for a,b in edits:
    assert s.count(a)==1;s=s.replace(a,b)
(p/'edits.json').write_text(json.dumps(edits,indent=2));(p/'release.html').write_bytes(s.encode());print(hashlib.sha256(s.encode()).hexdigest())
