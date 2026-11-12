from pathlib import Path
import difflib
p=Path('work/cp25/two-intervals');a=[x for x in (p/'baseline.html').read_text(encoding='utf-8').splitlines() if x.strip()];b=[x for x in (p/'candidate.html').read_text(encoding='utf-8').splitlines() if x.strip()];print('\n'.join(difflib.unified_diff(a,b,fromfile='UAT17',tofile='two-interval trial',n=1)))
