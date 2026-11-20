"""Dev build for CP-93: a base release.html + the CP-93 block appended before the last </script>. Usage: python build-dev.py <base folder>"""
from pathlib import Path
import sys,hashlib
p=Path(__file__).parent;W=p.parent;base=sys.argv[1] if len(sys.argv)>1 else 'cp117'
s=(W/base/'release.html').read_bytes().decode('utf-8');add=(p/'cp93-giant.js').read_bytes().decode('utf-8')
assert 'LABH_ROUNDS' in s
i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest()[:12])
