from pathlib import Path
p=Path('work/cp25/log-file/build.py');s=p.read_text(encoding='utf-8');s=s.replace("# Input coordinates", "rep('for(let pass=0;pass<3;pass++){','for(let pass=0;pass<4;pass++){')\n# Input coordinates");p.write_text(s,encoding='utf-8')
