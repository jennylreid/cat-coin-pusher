# Summarise the CP-51 bot runs (bot/*.out) per level and configuration.
import json,glob,collections
R=collections.defaultdict(list)
for f in glob.glob('bot/*.out'):
    import os;cfg=os.path.basename(f).rsplit('-',1)[0]
    for l in open(f):
        if l.startswith('{'):R[cfg].append(json.loads(l))
cfgs=['u67-hold','u68-hold40','u67-tap','u68-tap']
print('| Level | '+' | '.join(cfgs)+' |');print('|---'*(len(cfgs)+1)+'|')
for n in range(1,11):
    row=[]
    for c in cfgs:
        rs=[r for r in R[c] if r['n']==n]
        if not rs:row.append('-');continue
        w=sum(r['win'] for r in rs);pk=[r['peak'] for r in rs];fs=[r['fullSecs'] for r in rs];lt=[r['left'] for r in rs if r['win']]
        row.append(f"{w}/{len(rs)} wins, peak {min(pk)}-{max(pk)}, full {max(fs)} s"+(f", {min(lt)}-{max(lt)} s left" if lt else ''))
    print(f'| {n} | '+' | '.join(row)+' |')
for c in cfgs:
    rs=R[c];print(c,'total',sum(r['win'] for r in rs),'/',len(rs),'max peak',max([r['peak'] for r in rs] or [0]),'max bodies',max([r['peakBodies'] for r in rs] or [0]),'bank empty',sum(1 for r in rs if r['bank']<=0))
