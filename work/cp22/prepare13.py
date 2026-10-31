from pathlib import Path
p=Path(__file__).parent
s=(p/'swept12.cjs').read_text().replace('uat12-swept.json','uat13-swept.json');(p/'swept13.cjs').write_text(s)
s=(p/'motion-audit.cjs').read_text().replace('revision-motion.json','uat13-motion.json');(p/'motion13.cjs').write_text(s)
s=(p/'performance12.cjs').read_text().replace('uat11/release.html','uat12/release.html').replace('UAT 11','UAT 12').replace('uat12-paint-performance.json','uat13-paint-performance.json');(p/'performance13.cjs').write_text(s)
