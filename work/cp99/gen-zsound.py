"""Re-embeds the Zoomies sounds (work/cp72-pusher-sound/audio/zoomies-game-P1..P3.mp3, made by make.py) into cp72-zsound.js;
the code is unchanged, only the three base64 strings and the gain (from audio/info.json). Usage: python gen-zsound.py"""
import base64,json,re
from pathlib import Path
p=Path(__file__).parent;A=p.parent/'cp72-pusher-sound'/'audio';f=p/'cp72-zsound.js';s=f.read_bytes().decode()
for k in ('P1','P2','P3'):
    b=base64.b64encode((A/f'zoomies-game-{k}.mp3').read_bytes()).decode()
    s,n=re.subn(k+r':"[A-Za-z0-9+/=]+"',lambda _:k+':"'+b+'"',s,count=1);assert n==1,k
g=json.loads((A/'info.json').read_text())['gameGain'];s,n=re.subn(r'gain:[0-9.]+,bufs',f'gain:{g},bufs',s,count=1);assert n==1
f.write_bytes(s.encode());print('ok',len(s))
