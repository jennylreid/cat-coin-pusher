"""CP-52: selected prize paintings, on pinned published UAT 68. No draw/physics/pickup changes."""
from pathlib import Path
import json,hashlib,shutil
p=Path(__file__).parent;r=p.parents[1]
s=(p.parent/'cp68/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='e7aa691b0b996b3863773e8920e03f448ebef37ef7710227e6463979fbfa3231'
s=s.decode();v=json.loads((p/'release-version.json').read_text())
old="const BUILD = '2026.11.16 UAT 68';"
assert s.count(old)==1;s=s.replace(old,"const BUILD = '%s';"%v['displayName'])
anchor="async function image(src) { const im = new Image(); im.src = src; await im.decode(); return im; }"
assert s.count(anchor)==1
code="\n // CP-52: preload approved 128px prize canvases into the existing shared art cache.\n"
(p/'art').mkdir(exist_ok=True)
for id,option in [('feather','d'),('ball','c'),('cushion','c')]:
    name=f'cp52-{id}.png'
    shutil.copyfile(r/f'tickets/CP-52-evidence/{id}-{option}.png',p/'art'/name)
    code+=f" WILD_ART['{id}']=await image('img/art/{name}');WILD_ART['{id}'].pgl=1;\n"
s=s.replace(anchor,anchor+code)
(p/'release.html').write_bytes(s.encode())
print(hashlib.sha256(s.encode()).hexdigest())
