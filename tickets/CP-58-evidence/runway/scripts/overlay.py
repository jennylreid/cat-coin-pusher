"""Runway lower face (jaw + mouth) over the approved head, with the prototype's closing eyes on top."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CP = r'C:/Users/jenny/OneDrive/work/CoinPusher'
R = CP + '/tickets/CP-58-evidence/runway'
ART = CP + '/work/cp33/assets/img/art/'
CALM = Image.open(ART + 'head-calm.png').convert('RGBA')
BASE = Image.open(ART + 'head-sweet.webp').convert('RGBA')  # the prototype shows Sweet during the yawn
W, H = BASE.size
NAMES = ['attempt2-3', 'attempt1-2']
CUT_Y, FEATHER = 470, 40  # mid-eye: Runway's nose and mouth stay together (its nose sits ~130 px higher than ours); the prototype's eye shapes cover the seam at the sides
KEEP_OUR_NOSE = False
CUTS = {'attempt2-3': 390}  # its nose sits higher still
try:
    F = ImageFont.truetype('arialbd.ttf', 40); FS = ImageFont.truetype('arialbd.ttf', 16)
except Exception:
    F = FS = ImageFont.load_default()


def proto_eyes(img):
    """Same drawing as cp58Face() in work/cp58-yawn/cp58-yawn.js (yawn phase), in head-canvas pixels."""
    S = 4
    big = Image.new('RGBA', (W*S, H*S), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
    for c in (480, 1056):
        d.ellipse([(c-183)*S, (525-148)*S, (c+183)*S, (525+148)*S], fill=(0, 0, 0, 255))

    def quad(p0, p1, p2, n=40):
        return [((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0], (1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]) for t in np.linspace(0, 1, n)]
    col, lw = (255, 218, 53, 255), 30
    for side in (-1, 1):
        c = 768 + side*205
        for seg in (quad((c-105, 505), (c, 560), (c+105, 505)), [(c-side*60, 470), (c-side*100, 440)]):
            pts = [(x*S, y*S) for x, y in seg]
            d.line(pts, fill=col, width=lw*S)
            for x, y in (pts[0], pts[-1]):
                r = lw*S/2; d.ellipse([x-r, y-r, x+r, y+r], fill=col)
    img.alpha_composite(big.resize((W, H), Image.LANCZOS))
    return img


def yawn_head(name):
    run = Image.open(f'{R}/fit-{name}.png').convert('RGBA')
    cy = CUTS.get(name, CUT_Y)
    ramp = np.clip((np.arange(H) - (cy - FEATHER/2)) / FEATHER, 0, 1)
    m = (np.asarray(run)[..., 3] / 255.0) * ramp[:, None]
    low = np.asarray(run).astype(float)
    base = np.asarray(BASE).astype(float)
    a = m[..., None]
    out_rgb = (low[..., :3]*a + base[..., :3]*(1-a)*(base[..., 3:]/255)) / np.maximum(1e-6, a + (1-a)*(base[..., 3:]/255))
    out_a = a[..., 0] + (1-a[..., 0])*base[..., 3]/255
    # where only Runway contributes (the dropped chin below our outline), rgb = runway
    out = np.dstack([np.where(out_a[..., None] > 0, out_rgb, 0), out_a*255]).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(out, 'RGBA')
    # our approved nose back on top (pink pixels of the base head, nose area only)
    b = np.asarray(BASE).astype(int); o = np.asarray(img).copy()
    pink = (b[..., 0] > 200) & (b[..., 1] < 190) & (b[..., 2] > 120) & (b[..., 3] > 200)
    nose = np.zeros_like(pink); nose[600:760, 640:900] = True
    if KEEP_OUR_NOSE: o[pink & nose] = b[pink & nose].astype(np.uint8)
    return proto_eyes(Image.fromarray(o, 'RGBA'))


def on_bg(im, col=(235, 238, 242)):
    b = Image.new('RGBA', im.size, col + (255,)); b.alpha_composite(im); return b.convert('RGB')


heads = {n: yawn_head(n) for n in NAMES}
for n, h in heads.items():
    h.save(f'{R}/overlay-{n}.png')

# side by side: approved Calm | prototype stand-in (eyes + code mouth) | each Runway lower-face overlay
row = Image.new('RGB', (W*(2+len(NAMES)), H+70), 'white'); d = ImageDraw.Draw(row)
row.paste(on_bg(CALM), (0, 70)); d.text((20, 15), 'Approved head (Calm)', fill='black', font=F)
stand = proto_eyes(BASE.copy()); sd = ImageDraw.Draw(stand)
w_, h_, top = 180, 280, 812  # prototype's code mouth at full yawn
sd.ellipse([766-w_/2, top, 766+w_/2, top+h_], fill='#3a0b14', outline='black', width=12)
sd.ellipse([766-w_*.34, top+h_*.78-h_*.17, 766+w_*.34, top+h_*.78+h_*.17], fill='#ff8fa3')
row.paste(on_bg(stand), (W, 70)); d.text((W+20, 15), 'Prototype now (code-drawn mouth)', fill='black', font=F)
for i, n in enumerate(NAMES):
    row.paste(on_bg(heads[n]), (W*(2+i), 70)); d.text((W*(2+i)+20, 15), f'Runway {n} jaw + prototype eyes', fill='black', font=F)
row.resize((row.size[0]//3, row.size[1]//3), Image.LANCZOS).save(f'{R}/overlay-side-by-side.png')

# on the board at 412x915 (head drawn 406x252 at (2,112), measured from the UAT 74 frame)
board = Image.open(CP + '/tickets/CP-58-evidence/L1-1-before.png').convert('RGB')
B = np.asarray(board); bw, bh = board.size
x0, y0, tw, th = 2, 112, 406, 252


def board_with(face):
    f = face.resize((tw, th), Image.LANCZOS)
    out = board.copy().convert('RGBA'); out.alpha_composite(f, (x0, y0))
    o = np.asarray(out).copy(); yb = y0 + int(th*0.80)
    for X0, X1 in [(0, 120), (292, bw)]:
        o[yb:, X0:X1, :3] = B[yb:, X0:X1]  # the mitts' claws stay in front
    o[y0+th:, :, :3] = B[y0+th:, :]
    return Image.fromarray(o).convert('RGB')


panels = [('Game now (UAT 74)', board),
          ('Prototype stand-in', Image.open(CP + '/tickets/CP-58-evidence/L1-2-yawn.png').convert('RGB'))]
for n in NAMES:
    p = board_with(heads[n]); p.save(f'{R}/overlay-board-{n}.png'); panels.append((f'Runway {n} jaw', p))
gap = 12
sheet = Image.new('RGB', (len(panels)*(bw+gap)-gap, bh+30), 'white'); d = ImageDraw.Draw(sheet)
for i, (t, p) in enumerate(panels):
    sheet.paste(p, (i*(bw+gap), 30)); d.text((i*(bw+gap)+6, 6), t, fill='black', font=FS)
sheet.save(f'{R}/overlay-board-412x915.png')
sheet.crop((0, 30+y0-10, sheet.size[0], 30+y0+th+60)).save(f'{R}/overlay-board-head-crop.png')
