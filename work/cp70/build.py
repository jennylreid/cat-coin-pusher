# CP-51 fix (UAT 70, Jenny tested UAT 69 on Nov 16, via PM): the Pause pop-up's "FINISH ROUND" button is now "END ROUND"
# (label only), and Level 1's cheese and shrimp go back to the original production spots of the Oct 31 board
# (production PRIZES {id:'cheese',x:140,y:610},{id:'shrimp',x:260,y:690}). Nothing else changes; CP-52's art untouched.
# On the published UAT 69 (work/cp69/release.html, pinned by hash). Usage: python build.py   Output: release.html
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
BASE = p.parent / 'cp69/release.html'
PIN = '88110b8cf989104239030682a2b1ff50476079507e712050f1ae7f567950ac08'  # UAT 69 release.html (publication-manifest)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be the published UAT 69'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("const BUILD = '2026.11.16 UAT 69';", "const BUILD = '%s';" % v['displayName'])
rep("wildButtonDraw(R.finish,'FINISH ROUND',", "wildButtonDraw(R.finish,'END ROUND',")
rep("p:[['cheese',110,610],['shrimp',290,575]]", "p:[['cheese',140,610],['shrimp',260,690]]")
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
