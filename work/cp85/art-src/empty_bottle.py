"""CP-58 add-on (UAT 85): the empty milk bottle, made from Jenny's milk B (CP-62) with the milk gone. Only the milk's
pixels change: each one becomes see-through glass (a faint blue tint over whatever is behind it), keeping the milk's
light and shade as the glass's own thickness and highlights. Outline, cap, glass edges and alpha are untouched.
Usage: python empty_bottle.py  -> milk-empty-master.png (1254 px, same canvas as milk-b.png)"""
from PIL import Image
import numpy as np, sys
src=r'C:/Users/jenny/OneDrive/work/CoinPusher/tickets/CP-62-evidence/masters/milk-b.png'
a=np.asarray(Image.open(src).convert('RGBA')).astype(float)
R,G,B,A=a[...,0],a[...,1],a[...,2],a[...,3]
H,W=A.shape;yy,xx=np.mgrid[0:H,0:W]
milk=(A>200)&(R>150)&(B<=R+8)&(yy>380)&(yy<1150)   # warm/neutral light pixels inside the bottle body = the milk
L=(R+G+B)/3
# Empty glass is see-through: the board shows through a faint blue tint. The milk's shading becomes the glass:
# its darker sides become thicker-looking glass, its bright streaks stay as highlights on the glass.
hl=np.clip((L-243)/12,0,1);edge=np.clip((228-L)/40,0,1)
glass=np.array([120,168,196.]);shine=np.array([240,250,255.])
col=glass+(shine-glass)*hl[...,None]
alpha=np.clip(55+130*edge+190*hl,0,253)
out=a.copy();out[...,:3][milk]=col[milk];out[...,3][milk]=alpha[milk]
Image.fromarray(out.round().astype(np.uint8),'RGBA').save('milk-empty-master.png')
print('milk pixels changed',int(milk.sum()))
