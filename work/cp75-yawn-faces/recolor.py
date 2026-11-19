"""CP-75: each cat's Yawn face and squinting eyes, made from the approved Tuxedo yawn the same way the other cats' heads
are made from the Tuxedo head: a Python port of the game's pgRecolor (release.html) with PG_CAT's colours.
Grey pixels (max-min <= 46) become fur..light by brightness; coloured pixels (yellow eyes, pink ears/nose/tongue) stay.
Tortie's second fur uses the same sine pattern on the same canvas, so its patches line up with its normal head.
One addition: the open mouth (dark interior, outline, the line up to the nose) is kept as painted, so it isn't fur-tinted.
Full 1536x1024 canvas (the game's copies are 900 wide; drawn at the same size and place).
Usage: python recolor.py -> art/cp75-yawn-face-<cat>.webp, art/cp75-yawn-eyes-<cat>.png"""
from pathlib import Path
import numpy as np
from PIL import Image
P=Path(__file__).parent;SRC=P.parent/'cp94'/'art'
CAT={'orange':('#ee8a2c',None,'#fff1dc'),'ragdoll':('#8f7d6e',None,'#fbf6ee'),'siamese':('#4e3626',None,'#f3e6cf'),
     'tortie':('#231c1a','#d9782e','#f6e2c8')}
hx=lambda h:np.array([int(h[i:i+2],16) for i in (1,3,5)],float)
def mouth_mask(Hd,Wd):
    y,x=np.mgrid[0:Hd,0:Wd]
    m=((x-762)/132.0)**2+((y-795)/168.0)**2<=1          # the open mouth with its outline
    m|=(abs(x-767)<=9)&(y>=590)&(y<=650)                  # the line from the nose to the lip
    return m
def recolor(img,cat,keep=None):
    fur,fur2,light=CAT[cat];a=np.asarray(img.convert('RGBA')).astype(float);Hd,Wd=a.shape[:2]
    r,g,b,al=a[...,0],a[...,1],a[...,2],a[...,3];mx=np.maximum(np.maximum(r,g),b);mn=np.minimum(np.minimum(r,g),b)
    sel=(al>=6)&(mx-mn<=46)
    if keep is not None:sel&=~keep
    L=(r+g+b)/765.0;f=np.broadcast_to(hx(fur),a.shape[:2]+(3,)).copy()
    if fur2:
        y,x=np.mgrid[0:Hd,0:Wd];u=x/Wd;v=y/Hd
        s=np.sin(u*9.1+v*3.7)+np.sin(u*4.3-v*8.2+1.3)+np.sin((u+v)*6.1+2.1)>.55;f[s]=hx(fur2)
    out=f+(hx(light)-f)*L[...,None]
    a[...,:3][sel]=out[sel]
    return Image.fromarray(np.clip(np.round(a),0,255).astype(np.uint8),'RGBA')
face=Image.open(SRC/'cp58-yawn-face.webp');eyes=Image.open(SRC/'cp58-yawn-eyes.png')
km=mouth_mask(face.height,face.width)
for c in CAT:
    recolor(face,c,km).save(P/'art'/f'cp75-yawn-face-{c}.webp',lossless=True,quality=100)
    recolor(eyes,c).save(P/'art'/f'cp75-yawn-eyes-{c}.png',optimize=True)
    print(c)
