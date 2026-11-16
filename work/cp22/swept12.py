from pathlib import Path
p=Path(__file__).parent
s=(p/'swept-audit.cjs').read_text().replace("work/cp22/release.html","work/cp22/draft.html").replace("'coin','silver','quake'","'coin','silver','quake','item'").replace('uat11-swept.json','uat12-swept.json')
s=s.replace('ids:[x.b.uid,y.b.uid],deepest','ids:[x.b.uid,y.b.uid],kinds:[x.b.kind,y.b.kind],old:[x.p,y.p],now:[{...xp},{...yp}],q:[x.q,y.q,xq,yq],deepest')
(p/'swept12.cjs').write_text(s)
