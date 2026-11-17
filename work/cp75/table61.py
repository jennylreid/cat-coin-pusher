# Summarise the CP-61 bot runs (bot/*.out): per level and mode, UAT 73 (cp73) vs the new build (cp75).
import json,glob,os,collections,sys
d=os.path.dirname(os.path.abspath(__file__))
R=collections.defaultdict(list)
for f in glob.glob(os.path.join(d,'bot','*.out')):
    for l in open(f):
        if l.startswith('{'):
            r=json.loads(l);R[(r['build'],r['mode'],r['n'])].append(r)
avg=lambda a:sum(a)/len(a) if a else 0
def cell(rs):
    if not rs:return '-'
    w=sum(r['win'] for r in rs);lt=[r['left'] for r in rs if r['win']]
    return f"{w}/{len(rs)} · {round(avg(lt)) if lt else '-'} s · {max(r['peak'] for r in rs)} · {avg([r['msAtPeak'] for r in rs]):.1f} ms · {round(avg([r['rainCoinsSky'] for r in rs]))} rain · {avg([r['fullSecs'] for r in rs]):.0f} s full"
for mode in ('hold','tap'):
    print(f'\n**{mode}** (wins · avg time left in wins · peak pieces · physics ms/tick at the peak · rain coins from the sky per round · Board full s)\n')
    print('| Level | UAT 73 | New |');print('|---|---|---|')
    for n in range(1,11):print(f"| {n} | {cell(R[('cp73',mode,n)])} | {cell(R[('cp75',mode,n)])} |")
    for b in ('cp73','cp75'):
        rs=[r for k,v in R.items() if k[0]==b and k[1]==mode for r in v]
        if not rs:continue
        print(f"{b} {mode}: wins {sum(r['win'] for r in rs)}/{len(rs)}, max peak {max(r['peak'] for r in rs)}, avg peak {avg([r['peak'] for r in rs]):.0f}, ms at peak {avg([r['msAtPeak'] for r in rs]):.1f} (max 10-tick avg {max(r['maxMs10'] for r in rs)}), rain/round {avg([r['rainCoinsSky'] for r in rs]):.1f}, gold5 {avg([r['rainLandedGold5'] for r in rs]):.1f}, vanished {avg([r['rainVanished'] for r in rs]):.1f}, drops {avg([r['drops'] for r in rs]):.0f}, sleep {avg([r['sleepAtPeak'] for r in rs]):.2f}, bonus rain tokens {avg([sum(v for k,v in r['bonus'].items() if k.startswith('rain')) for r in rs]):.1f}")
