import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

CP = r'C:/Users/jenny/OneDrive/work/CoinPusher'
R = CP + '/tickets/CP-58-evidence/runway'
HEAD = Image.open(CP + '/work/cp33/assets/img/art/head-calm.png').convert('RGBA')
W, H = HEAD.size  # 1536x1024


def black_mask(im):
    a = np.asarray(im.convert('RGB')).astype(int)
    return (a.sum(2) < 150)


def cutout(im):
    """Near-white background connected to the border becomes transparent."""
    a = np.asarray(im.convert('RGB')).astype(int)
    white = (a.min(2) > 225)
    lab, n = ndimage.label(white)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    bg = ndimage.binary_opening(bg, iterations=1)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # soften edge 1px
    alpha = ndimage.uniform_filter(alpha.astype(float), 3).astype(np.uint8)
    out = im.convert('RGBA')
    out.putalpha(Image.fromarray(alpha))
    return out


# reference black mask on white, upper part only (ears + forehead: unchanged by the yawn)
refw = Image.new('RGBA', HEAD.size, 'white'); refw.alpha_composite(HEAD)
SC = 0.25
ref_small = black_mask(refw.resize((int(W*SC), int(H*SC))))
upper = int(H*SC*0.45)
ref_up = ref_small[:upper]


def register(gen):
    """Find scale s, offset (dx,dy) so gen placed at s*size,(dx,dy) on the head canvas matches the ears/forehead."""
    gw, gh = gen.size
    best = None
    for s in np.arange(1.16, 1.28, 0.005):
        tw, th = int(gw*s*SC), int(gh*s*SC)
        gm = black_mask(Image.new('RGB', (1, 1)) if False else gen.convert('RGB').resize((tw, th)))
        for dx in range(-12, 13):
            for dy in range(-12, 13):
                canvas = np.zeros_like(ref_small)
                x0, y0 = dx, dy
                xs, ys = max(0, x0), max(0, y0)
                xe, ye = min(canvas.shape[1], x0+tw), min(canvas.shape[0], y0+th)
                canvas[ys:ye, xs:xe] = gm[ys-y0:ye-y0, xs-x0:xe-x0]
                c = canvas[:upper]
                iou = (c & ref_up).sum() / max(1, (c | ref_up).sum())
                if best is None or iou > best[0]:
                    best = (iou, s, dx/SC, dy/SC)
    return best


def on_canvas(gen, s, dx, dy):
    cut = cutout(gen)
    cut = cut.resize((round(gen.size[0]*s), round(gen.size[1]*s)), Image.LANCZOS)
    c = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    c.alpha_composite(cut, (int(round(dx)), int(round(dy)))) if dx >= 0 and dy >= 0 else c.paste(cut, (int(round(dx)), int(round(dy))), cut)
    return c


if __name__ == '__main__':
    import sys, json
    res = {}
    for name in sys.argv[1:]:
        gen = Image.open(f'{R}/{name}.png')
        iou, s, dx, dy = register(gen)
        res[name] = dict(iou=round(float(iou), 3), s=round(float(s), 3), dx=dx, dy=dy)
        print(name, res[name], flush=True)
        on_canvas(gen, s, dx, dy).save(f'{R}/fit-{name}.png')
    json.dump(res, open(f'{R}/fit-registration.json', 'w'), indent=1)
