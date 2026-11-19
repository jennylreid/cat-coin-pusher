# CP-90: the painted kittens as lossless WebP (exact: transparent pixels kept too), checked pixel for pixel against Codex's PNGs.
# Usage: python make-art.py -> art/cp90-ginger-run.webp, cp90-cream-run.webp, cp90-ginger-peek.webp
from PIL import Image
from pathlib import Path
p=Path(__file__).parent
for n in ['ginger-run','cream-run','ginger-peek']:
    im=Image.open(p/'../cp90-kittens'/(n+'.png')).convert('RGBA');out=p/'art'/('cp90-'+n+'.webp')
    im.save(out,'WEBP',lossless=True,quality=100,method=6,exact=True)
    assert Image.open(out).convert('RGBA').tobytes()==im.tobytes(),n
    print(out.name,out.stat().st_size)
