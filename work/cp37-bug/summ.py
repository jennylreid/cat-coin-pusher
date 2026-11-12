import json,glob,re,os
rows={}
for f in glob.glob('out/f-*-s[456].log'):
    m=re.match(r'f-(\w+)-(\w+)-s(\d)\.log',os.path.basename(f))
    try: d=json.loads(open(f,encoding='utf-8-sig').read().splitlines()[0])
    except Exception: rows[(m[1],m[2],m[3])]='ERR';continue
    rows[(m[1],m[2],m[3])]=(d['abaEvents'],d['stillAbaEvents'],d['flickerEvents'],d['maskToggles'])
print('(blinks>=150px, still-coin blinks>=40px, dips, mask on/off)')
for b in ['wild','b3']:
  for t in ['before','after','fix2']:
    print(b,t,[rows.get((t,b,s)) for s in '456'])
