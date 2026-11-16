from pathlib import Path
p=Path('work/cp25/pickup-preview');s=(p/'render.cjs').read_text(encoding='utf-8').replace("pickup-preview/concepts.js","pickup-preview/frame.js").replace("['halo','moon','bloom']","['frame']");s=s[:s.index('g.close();')]+ 'g.close();})();\n';(p/'render-frame.cjs').write_text(s,encoding='utf-8')
