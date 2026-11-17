# Measurement-only variants of the CP-61 build (not for release): CP-48's gold-5 merge of resting coins starts earlier.
from pathlib import Path
p=Path(__file__).parent;s=(p.parent/'release.html').read_text(encoding='utf-8')
for n in (110,100):
    a="const W43_COIN_CAP=130;";assert s.count(a)==1
    d=p/f'm{n}';d.mkdir(exist_ok=True);(d/'release.html').write_text(s.replace(a,f"const W43_COIN_CAP={n}; // CP-61 variant"),encoding='utf-8')
print('ok')
