r"""CP-87: makes cp87-puzzles.js = cp87-shell.js with the five puzzle pages embedded as strings (byte-for-byte; '</' written
as '<\/' so they can't close the game's script). Usage: python make-block.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent
PAGES={'paw-swat':W/'cp84-puzzles/paw-swat.html','cat-cafe':W/'cp84-puzzles/cat-cafe.html',
 'pocket-pounce':W/'cp85-puzzles/pocket-pounce.html','moon-mint':W/'cp85-puzzles/moon-mint.html','whisker-spark':W/'cp85-puzzles/whisker-spark.html'}
pages={k:f.read_bytes().decode('utf-8') for k,f in PAGES.items()}
js=json.dumps(pages,ensure_ascii=True).replace('</',r'<\/')  # ASCII-only: no raw U+2028/2029 or encoding surprises
shell=(p/'cp87-shell.js').read_text(encoding='utf-8')
assert shell.count('/*CP87_PAGES*/{}')==1
out=shell.replace('/*CP87_PAGES*/{}',js)
(p/'cp87-puzzles.js').write_bytes(out.encode('utf-8'))
(p/'pages.json').write_text(json.dumps({k:{'file':str(f.relative_to(W)),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for k,f in PAGES.items()},indent=1))
print('cp87-puzzles.js',len(out.encode('utf-8')),'bytes')
