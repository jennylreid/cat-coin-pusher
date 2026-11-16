# Frame sheet for the UAT 50 report: title -> board home -> buttons -> screens -> back to the board.
from PIL import Image, ImageDraw
from pathlib import Path
E = Path(__file__).resolve().parents[2] / 'tickets/CP-45-evidence'
names = ['title', 'board-home', 'board-level2', 'kitchen', 'porch-visit', 'tuxedo-end', 'ate-message-on-board', 'orange-board-card', 'board-picker-level3', 'board-home-inset']
ims = [Image.open(E / 'uat50' / (n + '.png')).convert('RGB') for n in names]
w, h = 200, int(ims[0].height * 200 / ims[0].width); cols = 5
sheet = Image.new('RGB', (cols * (w + 8) + 8, 2 * (h + 26) + 8), (24, 14, 34)); d = ImageDraw.Draw(sheet)
for i, (n, im) in enumerate(zip(names, ims)):
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 26)
    sheet.paste(im.resize((w, h)), (x, y)); d.text((x, y + h + 6), f'{i+1}. {n}', fill=(255, 224, 138))
sheet.save(E / 'cp45-uat50-sheet.png'); print(sheet.size)
