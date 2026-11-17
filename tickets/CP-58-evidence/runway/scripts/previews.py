import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

CP = r'C:/Users/jenny/OneDrive/work/CoinPusher'
R = CP + '/tickets/CP-58-evidence/runway'
HEAD = Image.open(CP + '/work/cp33/assets/img/art/head-calm.png').convert('RGBA')
W, H = HEAD.size
NAMES = ['attempt2-3', 'attempt2-1', 'attempt1-2']
try:
    F = ImageFont.truetype('arialbd.ttf', 40); FS = ImageFont.truetype('arialbd.ttf', 16)
except Exception:
    F = FS = ImageFont.load_default()


def on_bg(im, col=(235, 238, 242)):
    b = Image.new('RGBA', im.size, col + (255,)); b.alpha_composite(im); return b.convert('RGB')


def bmask(im):
    a = np.asarray(im).astype(int)
    return (a[..., :3].sum(2) < 150) & (a[..., 3] > 128)


# 1. side by side: approved | candidate | outline overlay (cyan = approved, magenta = candidate)
rows = []
ref_m = bmask(HEAD)
for n in NAMES:
    c = Image.open(f'{R}/fit-{n}.png').convert('RGBA')
    cm = bmask(c)
    ov = np.full((H, W, 3), 255, np.uint8)
    ov[ref_m] = (0, 190, 220); ov[cm] = (220, 0, 160); ov[ref_m & cm] = (40, 40, 40)
    row = Image.new('RGB', (W*3, H+70), 'white')
    row.paste(on_bg(HEAD), (0, 70)); row.paste(on_bg(c), (W, 70)); row.paste(Image.fromarray(ov), (W*2, 70))
    d = ImageDraw.Draw(row)
    d.text((20, 15), 'Approved head (Calm)', fill='black', font=F)
    d.text((W+20, 15), f'Runway {n}, fitted on the same canvas', fill='black', font=F)
    d.text((2*W+20, 15), 'Black lines: grey = same, cyan = approved only, magenta = Runway only', fill='black', font=F)
    rows.append(row)
sheet = Image.new('RGB', (W*3, sum(r.size[1] for r in rows)), 'white')
y = 0
for r in rows: sheet.paste(r, (0, y)); y += r.size[1]
sheet.resize((sheet.size[0]//3, sheet.size[1]//3), Image.LANCZOS).save(f'{R}/preview-side-by-side.png')

# 2. over the board at 412x915: find where the head is drawn in the real-game frame
board = Image.open(CP + '/tickets/CP-58-evidence/L1-1-before.png').convert('RGB')
bw, bh = board.size
B = np.asarray(board).astype(int)
bblack = B.sum(2) < 90
best=(0,1,2,112)
iou, k, x0, y0 = best
tw, th = 406, 252  # measured: head drawn 406x252 at (2,112) in the 412x915 frame
calm_px = np.asarray(HEAD.resize((tw, th)).convert('RGBA')).astype(int)


def board_with(face):
    # whole yawn head over the in-game head, then the frame's own mitt corners (claws) put back on top
    f = face.resize((tw, th), Image.LANCZOS)
    out = board.copy().convert('RGBA')
    out.alpha_composite(f, (max(0, x0), y0)) if x0 >= 0 else out.paste(f, (x0, y0), f)
    o = np.asarray(out).copy()
    yb = y0 + int(th*0.80)
    for X0, X1 in [(0, 120), (292, bw)]:
        o[yb:, X0:X1, :3] = B[yb:, X0:X1]
    o[y0+th:, :, :3] = np.where((np.asarray(f)[-1:, :, 3] > 0).any() and False, 0, B[y0+th:, :])
    return Image.fromarray(o.astype(np.uint8)).convert('RGB')


panels = [('Game now (UAT 74)', board)]
proto = Image.open(CP + '/tickets/CP-58-evidence/L1-2-yawn.png').convert('RGB')
panels.append(('Prototype stand-in', proto))
for n in NAMES:
    img = board_with(Image.open(f'{R}/fit-{n}.png').convert('RGBA'))
    img.save(f'{R}/board-{n}.png')
    panels.append((n, img))
gap = 12
sheet = Image.new('RGB', (len(panels)*(bw+gap)-gap, bh+30), 'white')
d = ImageDraw.Draw(sheet)
for i, (t, p) in enumerate(panels):
    sheet.paste(p, (i*(bw+gap), 30)); d.text((i*(bw+gap)+6, 6), t, fill='black', font=FS)
sheet.save(f'{R}/preview-board-412x915.png')
# crop of the head area, bigger
crop = sheet.crop((0, 30+max(0, y0-10), sheet.size[0], 30+min(bh, y0+th+60)))
crop.save(f'{R}/preview-board-head-crop.png')
