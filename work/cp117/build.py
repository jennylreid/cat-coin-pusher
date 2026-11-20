"""UAT 117 = CP-90 Zoomies painted kittens (Jenny, Nov 19: "I prefer the original Ginger Puff cat." / "I need to see both. I
need to see them in action as well."): a Developer choice "Zoomies kittens: Painted (default) / Original". Build name + the
block cp90-kittens.js; the stage adds 3 art files (img/art/cp90-ginger-run.webp, cp90-cream-run.webp, cp90-ginger-peek.webp: lossless WebP copies of
work/cp90-kittens/*.png, every pixel identical incl. transparent ones (exact), made by make-art.py; the UAT package has no room
for the PNGs under its 60 MB limit; the painted puff is not used: the puff stays the original code drawing).
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp90-kittens.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
ART={'img/art/cp90-ginger-run.webp':'ginger-run.png','img/art/cp90-cream-run.webp':'cream-run.png','img/art/cp90-ginger-peek.webp':'ginger-peek.png'}
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD,'addedRuntimeFiles':{k:'work/cp90-kittens/'+f+' (lossless WebP, art/'+k.split('/')[-1]+')' for k,f in ART.items()}},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
