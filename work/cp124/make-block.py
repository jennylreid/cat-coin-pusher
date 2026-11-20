r"""CP-96 (UAT 124): makes cp96-puzzles.js = UAT 107's CP-87 block (work/cp107/cp87-puzzles.js, as it sits in every UAT since)
with the menu changed to Paw Swat, Cat Café and Sleepy Coins (Jenny, Nov 19: "Let's add that one to the daily puzzles."
"You can keep Paw Swat and Cat Cafe for now."). Pocket Pounce, Moon Mint and Whisker Spark (CP-85) are dropped.
Only two things change in the block: the embedded pages (byte for byte, written the same way as make-block.py in cp107) and
the menu list. Usage: python make-block.py"""
from pathlib import Path
import json, hashlib
p = Path(__file__).parent; W = p.parent
OLD = (W / 'cp107' / 'cp87-puzzles.js').read_bytes().decode('utf-8')
PAGES = {'sleepy-coins': W / 'cp96-minesweeper/sleepy-coins-uat.html',  # uses the game's own art and sounds
         'paw-swat': W / 'cp84-puzzles/paw-swat.html', 'cat-cafe': W / 'cp84-puzzles/cat-cafe.html'}
pages = {k: f.read_bytes().decode('utf-8') for k, f in PAGES.items()}

i = OLD.index('const CP87_PAGES='); j = OLD.index(';\nconst CP87_LIST=[')
new = OLD[:i] + 'const CP87_PAGES=' + json.dumps(pages, ensure_ascii=True).replace('</', r'<\/') + OLD[j:]

a = new.index('const CP87_LIST=['); b = new.index('];\n', a) + 3
LIST = ("// CP-96 (UAT 124): Sleepy Coins added; Pocket Pounce, Moon Mint and Whisker Spark (CP-85) removed.\n"
        "const CP87_LIST=[\n"
        " {id:'sleepy-coins',name:'Sleepy Coins',line:'Pick up every coin without waking a sleeping cat. Numbers count the cats next door.'},\n"
        " {id:'paw-swat',name:'Paw Swat',line:'Swat coins up into a hanging wall. Clear 3 of a colour and what hangs below falls.'},\n"
        " {id:'cat-cafe',name:'Cat Café',line:'Serve the cats in the right order. Each bowl pulls in its colour.'},\n"
        "];\n")
new = new[:a] + LIST + new[b:]
out = new.encode('utf-8')
(p / 'cp96-puzzles.js').write_bytes(out)
(p / 'pages.json').write_text(json.dumps({k: {'file': str(f.relative_to(W)), 'bytes': f.stat().st_size,
    'sha256': hashlib.sha256(f.read_bytes()).hexdigest()} for k, f in PAGES.items()}, indent=1))
print('cp96-puzzles.js', len(out), 'bytes (UAT 107 block', len(OLD.encode('utf-8')), ')')
