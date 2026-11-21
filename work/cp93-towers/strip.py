# Frame strip: python strip.py out.png "label" a.png b.png ...  (crops the board area, labels each frame with its time)
import sys,re
from PIL import Image,ImageDraw
out,label,files=sys.argv[1],sys.argv[2],sys.argv[3:]
ims=[Image.open(f).convert('RGB') for f in files];w,h=ims[0].size;top,bot=int(h*.2),int(h*.82)
cw,ch=w//2,(bot-top)//2;S=Image.new('RGB',(cw*len(ims),ch+44),(20,20,28));d=ImageDraw.Draw(S)
d.text((6,4),label,fill=(255,255,255))
for i,(f,im) in enumerate(zip(files,ims)):
    S.paste(im.crop((0,top,w,bot)).resize((cw,ch)),(i*cw,44));m=re.search(r't(\d+\.\d)',f);d.text((i*cw+6,26),('%s s'%float(m.group(1))) if m else f,fill=(255,230,120))
S.save(out);print(out,S.size)
