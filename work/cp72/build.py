"""CP-56: selected prize paintings, on pinned published UAT 71. No draw/physics/pickup changes."""
from pathlib import Path
import json,hashlib,shutil
p=Path(__file__).parent;r=p.parents[1]
s=(p.parent/'cp71/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='8a2f76bb0dce3888eb55ddf24a7a7a435ea2f22f70233b471a59e47c41375a8a'
s=s.decode();v=json.loads((p/'release-version.json').read_text())
old="const BUILD = '2026.11.16 UAT 71';"
assert s.count(old)==1;s=s.replace(old,"const BUILD = '%s';"%v['displayName'])
anchor="async function image(src) { const im = new Image(); im.src = src; await im.decode(); return im; }"
assert s.count(anchor)==1
code="\n // CP-56: preload approved 128px prize canvases into the existing shared art cache.\n"
(p/'art').mkdir(exist_ok=True)
for id,option in [('sock','b'),('biscuit','a'),('sardine','b'),('egg','b'),('box','a')]:
    name=f'cp56-{id}.png'
    shutil.copyfile(r/f'tickets/CP-56-evidence/{id}-{option}.png',p/'art'/name)
    code+=f" WILD_ART['{id}']=await image('img/art/{name}');WILD_ART['{id}'].pgl=1;\n"
s=s.replace(anchor,anchor+code)
(p/'release.html').write_bytes(s.encode())
print(hashlib.sha256(s.encode()).hexdigest())
