from pathlib import Path
p=Path(__file__).parent
s=(p/'paint-performance.cjs').read_text().replace('uat10/release.html','uat11/release.html').replace('UAT 10','UAT 11').replace('paint-performance.json','uat12-paint-performance.json')
(p/'performance12.cjs').write_text(s)
