# Frame sheet for the UAT 51 report.
from PIL import Image, ImageDraw
from pathlib import Path
E = Path(__file__).resolve().parents[2] / 'tickets/CP-45-evidence'
names = ['board-play', 'bar-developer-off', 'bar-developer-on', 'modes-picker', 'board-home-inset', 'kitchen-cat', 'porch-cat', 'album-cat', 'shop-cat', 'tuxedo-end']
ims = [Image.open(E / 'uat51' / (n + '.png')).convert('RGB') for n in names]
w, h = 200, int(ims[0].height * 200 / ims[0].width); cols = 5
sheet = Image.new('RGB', (cols * (w + 8) + 8, 2 * (h + 26) + 8), (24, 14, 34)); d = ImageDraw.Draw(sheet)
for i, (n, im) in enumerate(zip(names, ims)):
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 26)
    sheet.paste(im.resize((w, h)), (x, y)); d.text((x, y + h + 6), f'{i+1}. {n}', fill=(255, 224, 138))
sheet.save(E / 'cp45-uat51-sheet.png'); print(sheet.size)
