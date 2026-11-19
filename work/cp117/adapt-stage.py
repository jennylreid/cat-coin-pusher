# Makes work/cp117/stage.py from work/cp116/stage.py: CP-90 evidence folder, this ticket's checks and real-Chrome check, and
# the 3 added art files (lossless WebP in art/, checked pixel for pixel against work/cp90-kittens/*.png). Usage: python adapt-stage.py
from pathlib import Path
p=Path(__file__).parent;s=(p/'../cp116/stage.py').read_text(encoding='utf-8')
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
i=s.index('# CP-86 Sonic meow mitts final UAT 116 staging');j=s.index('from pathlib import Path')
s=s[:i]+("# CP-90 Zoomies painted kittens UAT 117 staging (from work/cp116/stage.py): complete game-only update for installed APK7, on the\n"
 "# base in release-version.json. index.html changes and 3 art files are added (img/art/cp90-*.webp from art/, lossless copies of\n"
 "# work/cp90-kittens/*.png); the other runtime files are carried over byte for byte from the published UAT 116 JSON.\n"
 "#   python stage.py --boot-only ; (checks + real Chrome kitcheck.cjs) ; python stage.py\n")+s[j:]
rep("e=r/(f'tickets/CP-86-evidence/uat{uat}'","e=r/(f'tickets/CP-90-evidence/uat{uat}'")
rep("files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()",
    "files=dict(u['files']);files['index.html']=base64.b64encode(h).decode()\n"
    "from PIL import Image\n"
    "ADDED={}\n"
    "for n in ['ginger-run','cream-run','ginger-peek']:\n"
    "    k='img/art/cp90-'+n+'.webp';assert k not in u['files'],k;b=(p/'art'/('cp90-'+n+'.webp')).read_bytes()\n"
    "    assert Image.open(p/'art'/('cp90-'+n+'.webp')).convert('RGBA').tobytes()==Image.open(p.parent/'cp90-kittens'/(n+'.png')).convert('RGBA').tobytes(),'art not pixel-identical: '+n\n"
    "    files[k]=base64.b64encode(b).decode();ADDED[k]=sha(b)")
rep("names=sorted(f.name for f in e.glob('checks*-on116.json'))+['checks86m.json']","names=sorted(f.name for f in e.glob('checks*-on117.json'))+['checks90.json']")
i=s.index("NEED=[");j=s.index("\n",i)
s=s[:i]+"NEED=['checks90.json','checks64-on117.json','checks72-on117.json','checks94-on117.json'] # this ticket's checks + the frozen pickup + the Zoomies suites; the rest run after publication"+s[j:]
i=s.index("import glob");j=s.index("out={**u,",i)
s=s[:i]+("kc=json.loads((e/'real-browser-boot.json').read_text().strip().splitlines()[-1])\n"
 "assert kc['title'] and kc['play'] and not kc['errors'] and kc['build']==v['displayName'] and kc.get('cp90'),'real-browser boot / Zoomies kittens check failed'\n")+s[j:]
rep("'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':[]","'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':ADDED")
i=s.index("'authorization':f\"");j=s.index("}\n",i)
s=s[:i]+("'authorization':f\"UAT {uat}: CP-90 Zoomies painted kittens as a Developer choice, Painted default, the puff original (PM, Nov 19, Jenny's words: \\\"I prefer the original Ginger Puff cat.\\\" / \\\"I need to see both. I need to see them in action as well.\\\"; PM: \\\"Do (UAT 117, on UAT 116)\\\"); UAT only\"")+s[j:]
assert 'CP-86' not in s and 'cp86' not in s.lower().replace('cp86m',''),[l[:90] for l in s.split('\n') if 'CP-86' in l or 'cp86' in l.lower()]
(p/'stage.py').write_text(s,encoding='utf-8')
for n in ['publish.ps1','verify-cloud.py']:
    t=(p/'../cp116'/n).read_text(encoding='utf-8').replace('work/cp116','work/cp117').replace('cp116verify','cp117verify');(p/n).write_text(t,encoding='utf-8')
print('ok')
