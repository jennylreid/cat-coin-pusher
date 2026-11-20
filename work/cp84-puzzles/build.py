"""CP-84: build single-file pages (assets inlined as data URIs). Run: python build.py"""
import base64, json, pathlib

HERE = pathlib.Path(__file__).parent
A = HERE / 'assets'

def uri(name, mime):
    return f'data:{mime};base64,' + base64.b64encode((A / name).read_bytes()).decode()

imgs = {
    'wait': uri('head-waiting.webp', 'image/webp'),
    'sweet': uri('head-sweet.webp', 'image/webp'),
    'wild': uri('head-wild.webp', 'image/webp'),
    'paw': uri('paw.webp', 'image/webp'),
}
sounds = {k: uri(k + '.mp3', 'audio/mpeg') for k in ('tick', 'land', 'spill')}
assets = 'window.IMGS=' + json.dumps(imgs) + ';window.SOUNDS=' + json.dumps(sounds) + ';'
common = (HERE / 'src' / 'common.js').read_text(encoding='utf-8')

for name in ('paw-swat', 'cat-cafe'):
    src = HERE / 'src' / (name + '.html')
    if not src.exists():
        continue
    html = src.read_text(encoding='utf-8')
    html = html.replace('/*ASSETS*/', assets, 1).replace('/*COMMON*/', common, 1)
    out = HERE / (name + '.html')
    out.write_text(html, encoding='utf-8')
    print(out.name, round(out.stat().st_size / 1024), 'KB')
