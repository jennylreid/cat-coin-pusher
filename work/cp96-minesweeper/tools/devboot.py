"""CP-96 scratch runtime for testing the current Sleepy Coins page inside the published UAT build, without touching work/cp124:
work/cp96-minesweeper/devboot = work/cp124/boot124 with index.html = UAT 124's release.html, its Sleepy Coins page swapped for
the current sleepy-coins-uat.html. Delete the folder after testing. Usage: python tools/devboot.py"""
from pathlib import Path
import json, shutil
H = Path(__file__).resolve().parents[1]; W = H.parent
B = W / 'cp124'; D = H / 'devboot'
if D.exists(): shutil.rmtree(D)
shutil.copytree(B / 'boot124', D)
rel = (B / 'release.html').read_bytes().decode('utf-8'); blk = (B / 'cp96-puzzles.js').read_bytes().decode('utf-8')
cur = (H / 'sleepy-coins-uat.html').read_bytes().decode('utf-8')
i = blk.index('const CP87_PAGES='); j = blk.index(';\n', i)
pages = json.loads(blk[i + len('const CP87_PAGES='):j].replace(r'<\/', '</'))
pages['sleepy-coins'] = cur
nb = blk[:i] + 'const CP87_PAGES=' + json.dumps(pages, ensure_ascii=True).replace('</', r'<\/') + blk[j:]
assert rel.count(blk) == 1
(D / 'index.html').write_bytes(rel.replace(blk, nb).encode('utf-8'))
print(D, 'index.html', (D / 'index.html').stat().st_size)
