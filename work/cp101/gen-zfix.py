"""Embeds work/cp72-pusher-sound/audio/zoomies-game-P*-v2.mp3 into cp72-zfix.src.js -> cp72-zfix.js. Usage: python gen-zfix.py"""
from pathlib import Path
import base64
p=Path(__file__).parent;A=p.parent/'cp72-pusher-sound/audio';s=(p/'cp72-zfix.src.js').read_text(encoding='utf-8')
for k in ['P1','P2','P3']:
    m='@%s@'%k;assert s.count(m)==1;s=s.replace(m,base64.b64encode((A/f'zoomies-game-{k}-v2.mp3').read_bytes()).decode())
(p/'cp72-zfix.js').write_bytes(s.replace('\r\n','\n').encode('utf-8'));print('cp72-zfix.js',len(s))
