"""CP-75 evidence sheets from raw/ (shots75.cjs): per cat and size, today vs new at the yawn and while eating;
plus all cats (new) at each size. Top half of the screen (where the head is); full frames stay in raw/."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
E=Path(__file__).resolve().parents[2]/'tickets'/'CP-75-evidence';R=E/'raw'
F=ImageFont.truetype('arialbd.ttf',30);NAME={'tuxedo':'Tuxedo','orange':'Orange','ragdoll':'Ragdoll','siamese':'Siamese','tortie':'Tortie'}
def crop(f):im=Image.open(f).convert('RGB');w,h=im.size;return im.crop((0,0,w,int(h*.56)))
def grid(cells,cols,title,out):
    cw,ch=cells[0][1].size;rows=(len(cells)+cols-1)//cols;S=Image.new('RGB',(cols*cw+(cols+1)*12,70+rows*(ch+56)),(28,20,40));d=ImageDraw.Draw(S)
    d.text((14,18),title,font=F,fill=(255,210,63))
    for i,(lab,im) in enumerate(cells):x=12+(i%cols)*(cw+12);y=70+(i//cols)*(ch+56);d.text((x,y+8),lab,font=F,fill=(255,255,255));S.paste(im,(x,y+48))
    S.save(out,optimize=True);print(out.name,S.size)
for sz in ['412x915','360x640']:
    for c in ['orange','ragdoll','siamese','tortie']:
        grid([(f'TODAY  yawn',crop(R/f'today-{c}-yawn-{sz}.png')),(f'NEW  yawn',crop(R/f'new-{c}-yawn-{sz}.png')),
              (f'TODAY  eating',crop(R/f'today-{c}-eat-{sz}.png')),(f'NEW  eating',crop(R/f'new-{c}-eat-{sz}.png'))],4,
             f'CP-75  {NAME[c]}  {sz}: today (Tuxedo yawn) vs new (own colours)',E/f'{c}-{sz}.png')
    cats=['tuxedo','orange','ragdoll','siamese','tortie']
    grid([(f'{NAME[c]}  yawn',crop(R/f"{'today' if c=='tuxedo' else 'new'}-{c}-yawn-{sz}.png")) for c in cats]+
         [(f'{NAME[c]}  eating',crop(R/f"{'today' if c=='tuxedo' else 'new'}-{c}-eat-{sz}.png")) for c in cats],5,
         f'CP-75  all cats, new  {sz}  (Tuxedo unchanged)',E/f'all-cats-{sz}.png')
