import sys
from PIL import Image
d=sys.argv[1];idx=[int(x) for x in sys.argv[2].split(',')];out=sys.argv[3];sc=float(sys.argv[4]) if len(sys.argv)>4 else .5
ims=[Image.open(f'{d}/f{i:04d}.png').convert('RGB') for i in idx];W,H=int(412*sc),int(915*sc)
o=Image.new('RGB',(W*len(ims),H))
for k,im in enumerate(ims):o.paste(im.resize((W,H)),(k*W,0))
o.save(out)
