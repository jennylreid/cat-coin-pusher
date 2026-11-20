import sys,json
rows=[json.loads(l) for l in sys.stdin if l.startswith('{')]
sp=[w for r in rows for w in r['when'] if w>=0]
print(' towers spilled:',len(sp)+sum(r['early'] for r in rows),'of',3*len(rows),'| early',sum(r['early'] for r in rows),'| seeds with any:',sum(1 for r in rows if r['early'] or any(w>=0 for w in r['when'])),'| times',sorted(sp),'| bodies max',max(r['bodies'] for r in rows))
