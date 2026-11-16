# CP-45 pupils fix (PM OK, Nov 14), as a patch for any build from UAT 50 on:
#   python apply_pupils.py <release.html> [<out.html>]      (in place when <out.html> is left out)
# The cat head drawn by the CP-45 code (pgHead: title, main screen, the floating cat on Kitchen/Porch/Album/Shop, the board
# picker, the win card) drew the code-made pupils only on the calm face, so the eyes went blank yellow whenever the cat
# switched to its sweet face (neither head picture has pupils). The board draws them on every face; this does the same.
# Safe to run twice: an already patched file is left as it is. Fails loudly if the line isn't found exactly once.
import sys, hashlib
from pathlib import Path
OLD = b"if(face==='calm'&&!o.noPupils){"
NEW = b"if((face==='calm'||face==='sweet')&&!o.noPupils){"
src = Path(sys.argv[1]); out = Path(sys.argv[2]) if len(sys.argv) > 2 else src
s = src.read_bytes()  # bytes: line endings and everything else stay exactly as they are
if s.count(NEW) == 1 and s.count(OLD) == 0:
    print('already patched:', src); out.write_bytes(s) if out != src else None; sys.exit(0)
assert s.count(OLD) == 1, f'expected the pgHead pupils line once, found {s.count(OLD)}'
s = s.replace(OLD, NEW)
out.write_bytes(s)
print('patched:', out, hashlib.sha256(s).hexdigest())
