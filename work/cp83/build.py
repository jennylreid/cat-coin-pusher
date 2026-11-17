"""CP-58 follow-up (PM, Nov 17): UAT 82 shipped the boot fix fast; its no-prize coin grab took only 1 coin (the coin nearest
the front is usually a lone coin on top; the pile is further back). On pinned published UAT 82, the mitt now aims where
most coins lie together on top of the pile (the front one first on a tie) and takes up to 4 of them. Still only coins
lying on top; the bottom layer is never touched. Nothing else changes. Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent
s=(W/'cp82/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='c3c58b3b336e324f7d46ade777d263f3b3f88491f6e66687e619b17476ad91c8','base is not published UAT 82'
s=s.decode('utf-8');v=json.loads((p/'release-version.json').read_text())
EDITS=[("const BUILD = '2026.11.16 UAT 82';","const BUILD = '%s';"%v['displayName']),
 (" if(!c.length)return [];c.sort((a,d)=>d.z-a.z);const A=c[0];\n return c.filter(o=>Math.hypot(o.x-A.x,o.z-A.z)<=90).sort((a,d)=>Math.hypot(a.x-A.x,a.z-A.z)-Math.hypot(d.x-A.x,d.z-A.z)).slice(0,4).map(o=>o.b);}",
  " if(!c.length)return [];const near=(o,A)=>Math.hypot(o.x-A.x,o.z-A.z)<=70; // UAT 83: where most coins lie together on top (the front one first on a tie)\n"
  " for(const o of c)o.n=c.filter(q=>near(q,o)).length;c.sort((a,d)=>d.n-a.n||d.z-a.z);const A=c[0];\n"
  " return c.filter(o=>near(o,A)).sort((a,d)=>Math.hypot(a.x-A.x,a.z-A.z)-Math.hypot(d.x-A.x,d.z-A.z)).slice(0,4).map(o=>o.b);}")]
for a,b in EDITS:
    if a not in s:a=a.replace('\n','\r\n');b=b.replace('\n','\r\n')
    assert s.count(a)==1,a[:60];s=s.replace(a,b)
out=s.encode('utf-8');(p/'release.html').write_bytes(out);(p/'edits.json').write_text(json.dumps(EDITS))
print(p/'release.html',hashlib.sha256(out).hexdigest())
