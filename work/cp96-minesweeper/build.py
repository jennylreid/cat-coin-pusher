"""CP-96: build the Sleepy Coins pages. Run: python build.py
- sleepy-coins.html      standalone, everything inlined (scaled copies in assets/), for a private link or a PC browser.
- sleepy-coins-uat.html  for the UAT build's Daily puzzles menu: no copies inside; it uses the game's own files
  (img/art/coin.webp, head-calm.png + cp58-yawn-eyes.png, cp58-yawn-face.webp, head-sweet.webp, head.webp, pupil.webp;
  sounds/effects/coin-drop.mp3, coin-land.mp3, coin-spill.mp3), cropped/trimmed at run time the same way as the copies."""
import base64, json, pathlib

HERE = pathlib.Path(__file__).parent
A = HERE / 'assets'
src = (HERE / 'src' / 'index.html').read_text(encoding='utf-8')

def uri(name, mime):
    return f'data:{mime};base64,' + base64.b64encode((A / name).read_bytes()).decode()

def write(name, imgs, sounds):
    html = src.replace('/*ASSETS*/', 'window.IMGS=' + json.dumps(imgs) + ';window.SOUNDS=' + json.dumps(sounds) + ';', 1)
    out = HERE / name
    out.write_bytes(html.encode('utf-8'))
    print(out.name, out.stat().st_size, 'bytes')

# Open-eyed heads get the game's pupil layer on top, as the game draws it (drawTrackingPupils); see src/index.html drawPupils.
PUPIL_RECT = [483, 107, 289, 1041]  # the pupil inside img/art/pupil.webp
HEAD = [8, 22, 1520, 963]  # bounding box of head-calm.png / head.webp (and the calm head + closed eyes)
SWEET = [11, 9, 1513, 978]
PUP = uri('pupil.webp', 'image/webp')  # assets/pupil.webp = PUPIL_RECT cut from the game's pupil.webp, scaled to 72x260

def copy(k, crop):  # scaled copy (300 px wide, cut to crop) + pupils mapped from head-art pixels into the copy
    from PIL import Image
    w, h = Image.open(A / (k + '.webp')).size
    return {'src': uri(k + '.webp', 'image/webp'), 'crop': [0, 0, w, h], 'w': w,
            'pupils': {'src': PUP, 'rect': [0, 0, 72, 260], 'frame': [crop[0], crop[1], w / crop[2]]}}

write('sleepy-coins.html',
      dict({k: uri(k + '.webp', 'image/webp') for k in ('coin', 'sleep', 'yawn')},
           sweet=copy('sweet', SWEET), grin=copy('grin', HEAD), calm=copy('calm', HEAD)),
      {k: uri(k + '.mp3', 'audio/mpeg') for k in ('tick', 'land', 'spill')})

ART = 'img/art/'
PUPILS = {'src': ART + 'pupil.webp', 'rect': PUPIL_RECT}
write('sleepy-coins-uat.html',
      {'coin': {'src': ART + 'coin.webp', 'crop': [0, 0, 1254, 1254], 'w': 144},
       'sleep': {'src': ART + 'head-calm.png', 'over': ART + 'cp58-yawn-eyes.png', 'crop': HEAD, 'w': 300},
       'yawn': {'src': ART + 'cp58-yawn-face.webp', 'crop': [4, 0, 1529, 1024], 'w': 300},
       'sweet': {'src': ART + 'head-sweet.webp', 'crop': SWEET, 'w': 300, 'pupils': PUPILS},
       'grin': {'src': ART + 'head.webp', 'crop': HEAD, 'w': 300, 'pupils': PUPILS},
       'calm': {'src': ART + 'head-calm.png', 'crop': HEAD, 'w': 300, 'pupils': PUPILS}},
      # offsets/lengths measured against the inlined trims (cross-correlation; same takes, fade over the last 40%)
      {'tick': {'src': 'sounds/effects/coin-drop.mp3', 'off': 0.042, 'dur': 0.45},
       'land': {'src': 'sounds/effects/coin-land.mp3', 'off': 0.025, 'dur': 0.6},
       'spill': {'src': 'sounds/effects/coin-spill.mp3', 'off': 0.591, 'dur': 1.6}})
