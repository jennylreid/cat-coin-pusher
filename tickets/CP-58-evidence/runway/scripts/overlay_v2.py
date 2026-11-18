"""v2 previews: (A) Runway's full yawn face; (B) composite with the closing eyes kept on black fur."""
import numpy as np
from PIL import Image, ImageDraw
import overlay as ov  # builds the v1 overlays on import (same files, unchanged)

R, W, H = ov.R, ov.W, ov.H

# eye zones: the prototype's yellow strokes, padded; inside them Runway's white becomes black fur
EYE_PAD = 45


def eye_zone():
    z = Image.new('L', (W, H), 0); d = ImageDraw.Draw(z)
    for side in (-1, 1):
        c = 768 + side*205
        x0, x1 = min(c-105, c-side*100) - EYE_PAD, max(c+105, c-side*100) + EYE_PAD
        # stroke spans y 440..~535 (+ half width); pad all round
        d.rounded_rectangle([x0, 440-15-EYE_PAD, x1, 535+15+EYE_PAD], radius=60, fill=255)
    return np.asarray(z) > 0


ZONE = eye_zone()
Y_START = {"attempt2-3": 455}  # from its nose down; above that the blaze stays as drawn
NARROW = {'attempt2-3': (42, 560, 650)}  # max inset px, full inset down to y, taper ends at y


def composite_v2(name):
    run = Image.open(f'{R}/fit-{name}.png').convert('RGBA')
    cy = ov.CUTS.get(name, ov.CUT_Y)
    ramp = np.clip((np.arange(H) - (cy - ov.FEATHER/2)) / ov.FEATHER, 0, 1)
    low = np.asarray(run).astype(float); base = np.asarray(ov.BASE).astype(float)
    a = ((low[..., 3]/255) * ramp[:, None])[..., None]; ba = base[..., 3:]/255
    rgb = (low[..., :3]*a + base[..., :3]*(1-a)*ba) / np.maximum(1e-6, a + (1-a)*ba)
    al = a[..., 0] + (1-a[..., 0])*ba[..., 0]
    o = np.dstack([rgb, al*255]).clip(0, 255)
    # narrow the white muzzle near the eyes: per row, pull the white wedge's edges inward by d(y) (smooth taper),
    # so the closing eyes' inner ends sit on black fur. Only where the wedge reaches the eyes (big yawn).
    if name in NARROW:
        dmax, y_full, y_end = NARROW[name]
        light = (o[..., :3].min(2) > 150) & (o[..., 3] > 0)
        for y in range(Y_START.get(name, 380), y_end):
            d = dmax if y <= y_full else dmax*(1 - (y - y_full)/(y_end - y_full))
            row = np.where(light[y, 560:976])[0]
            if not len(row): continue
            L, Rr = row.min()+560, row.max()+560
            xs = np.arange(W)
            outside = ((xs < L + d) | (xs > Rr - d)) & (xs >= L) & (xs <= Rr)
            # soft 2px edge
            o[y, outside & light[y], :3] = 0
    img = Image.fromarray(o.astype(np.uint8), 'RGBA')
    return ov.proto_eyes(img)


def on_bg(im, col=(235, 238, 242)):
    b = Image.new('RGBA', im.size, col + (255,)); b.alpha_composite(im); return b.convert('RGB')


panels = [('1  Approved head', ov.CALM)]
labels = {'attempt2-3': 'big yawn', 'attempt1-2': 'round yawn'}
n = 2
for name in ['attempt2-3', 'attempt1-2']:
    full = Image.open(f'{R}/fit-{name}.png').convert('RGBA')
    comp = composite_v2(name); comp.save(f'{R}/overlay-v2-{name}.png')
    panels.append((f'{n}  {labels[name].capitalize()}: Runway face, its own eyes', full)); n += 1
    panels.append((f'{n}  {labels[name].capitalize()}: Runway jaw + prototype eyes', comp)); n += 1

cols = 3
rows = (len(panels) + cols - 1)//cols
sheet = Image.new('RGB', (W*cols, (H+70)*rows), 'white'); d = ImageDraw.Draw(sheet)
for i, (t, im) in enumerate(panels):
    x, y = (i % cols)*W, (i//cols)*(H+70)
    sheet.paste(on_bg(im), (x, y+70)); d.text((x+20, y+12), t, fill='black', font=ov.F)
sheet.resize((sheet.size[0]//2, sheet.size[1]//2), Image.LANCZOS).save(f'{R}/overlay-v2-side-by-side.png')
