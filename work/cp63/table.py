import json,glob,collections
def load(pat):
    d=collections.defaultdict(list)
    for f in glob.glob(pat):
        for l in open(f):
            if l.startswith('{'):r=json.loads(l);d[r['n']].append(r)
    return d
a,b=load('b62-*.out'),load('b64-*.out')
for n in range(1,11):
    A,B=a[n],b[n]
    print(n,'62: %d/%d left %s peak %s'%(sum(r['win'] for r in A),len(A),[r['left'] for r in A],[r['peak'] for r in A]),'| 64: %d/%d left %s peak %s atlimit %s'%(sum(r['win'] for r in B),len(B),[r['left'] for r in B],[r['peak'] for r in B],[r['blocked'] for r in B]))
