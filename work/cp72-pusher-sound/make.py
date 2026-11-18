"""CP-72 add-on: Zoomies pusher sound candidates (Jenny, Nov 18: "replace the turbo rev with the sound of coins being pushed;
2-3 real candidates as a Developer choice next to today's"). Real CC0 recordings (Freesound previews in sources/; originals
via the PM later -> originals/, preferred when present), each made into a 7.0 s bed for Zoomies' double-speed window:
 P1 'several coins on wood top' (776505, nicoproson): coins sliding, rolling and knocking together on wood, 17.8-24.8 s
 P2 'coin push on table' (563265, cupido-1): a pile of coins pushed along a table, dense, 53.0-60.0 s
 P3 'Coins Sliding Off Table' (485770, SpaceJoe): change scraped across a table (2.0-3.05 + 3.3-4.95 s), looped to 7 s
 Not used: 'Money Arcade Game' (261117, a real coin pusher at Manchester Airport): mostly the hall's music and machine
 drone, with only a few coin hits - not 'change being pushed'.
Cleaning: spectral gating against each recording's own steady noise (hum, hiss, room/motor drone: the quietest 15% of
frames per frequency), a high-pass at 90 Hz, short fades; loops crossfade 0.35 s; the last 0.7 s fades out.
Level: every file at RMS -20 dBFS over the sounding part (peaks <= -1 dBFS); today's turbo rev is rendered offline the
same way for reference, and the in-game gain is set so a candidate sits 3 dB under today's burst (it lasts 7 s, not 1.1 s).
Usage: python make.py -> audio/zoomies-sound-{P1,P2,P3,today}.wav (+ .mp3) + audio/info.json"""
from pathlib import Path
import json,subprocess,wave
import numpy as np
from scipy.signal import stft,istft
P=Path(__file__).parent;SR=48000;OUT=P/'audio';OUT.mkdir(exist_ok=True);DUR=7.0
C={'P1':('776505',[(17.8,24.8)]),'P2':('563265',[(53.0,60.0)]),'P3':('485770',[(2.0,3.05),(3.3,4.95)])}
def src(id):
    o=list((P/'originals').glob(id+'*')) if (P/'originals').exists() else []
    return (o[0],'original') if o else (next((P/'sources').glob(id+'*')),'preview')
def load(f,a=None,b=None):
    cmd=['ffmpeg','-v','error']+(['-ss',str(a),'-to',str(b)] if a is not None else [])+['-i',str(f),'-ac','1','-ar',str(SR),'-f','f32le','-']
    return np.frombuffer(subprocess.run(cmd,capture_output=True,check=True).stdout,np.float32).astype(float)
def gate(x,full,over=2.0,floor=.08):
    f,t,Z=stft(full,SR,nperseg=2048,noverlap=1536);M=np.abs(Z);e=M.sum(0);q=np.argsort(e)[:max(8,int(len(e)*.15))]
    N=np.median(M[:,q],axis=1)[:,None]  # the recording's steady noise per frequency
    f,t,X=stft(x,SR,nperseg=2048,noverlap=1536);A=np.abs(X)
    G=np.clip(1-over*N/(A+1e-12),floor,1)
    from scipy.ndimage import uniform_filter
    G=uniform_filter(G,size=(3,5))
    _,y=istft(X*G,SR,nperseg=2048,noverlap=1536);return y[:len(x)]
def hp(x,fc=90):
    w=2*np.pi*fc/SR;al=np.sin(w)/(2*.7071);c=np.cos(w);b=np.array([(1+c)/2,-(1+c),(1+c)/2]);a=np.array([1+al,-2*c,1-al]);b/=a[0];a/=a[0]
    from scipy.signal import lfilter;return lfilter(b,a,x)
def join(parts,xf=.12):
    k=int(xf*SR);y=parts[0]
    for x in parts[1:]:w=np.linspace(0,1,k);y=np.concatenate([y[:-k],y[-k:]*(1-w)+x[:k]*w,x[k:]])
    return y
def loop_to(x,n,xf=.35):
    k=int(xf*SR);y=x.copy()
    while len(y)<n:
        w=np.linspace(0,1,k);y=np.concatenate([y[:-k],y[-k:]*(1-w)+x[:k]*w,x[k:]])
    return y[:n]
def shape(x):
    n=len(x);i=int(.08*SR);o=int(.7*SR);x=x.copy();x[:i]*=np.linspace(0,1,i);x[n-o:]*=np.linspace(1,0,o)**1.3;return x
def rms(x):
    e=np.sqrt(np.convolve(x**2,np.ones(2400)/2400,'same'));m=e>e.max()*.1;return np.sqrt((x[m]**2).mean())
def level(x,db=-20):
    x=x*(10**(db/20)/rms(x));pk=np.abs(x).max();lim=10**(-1/20);return x*(lim/pk) if pk>lim else x
def save(name,x):
    f=OUT/f'zoomies-sound-{name}.wav';w=wave.open(str(f),'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR)
    w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes());w.close()
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(f),'-b:a','128k',str(OUT/f'zoomies-sound-{name}.mp3')],check=True)
def today():  # sfx.wild('turbo',1): 3x (520->980, 980->520 Hz sawtooth 0.18 s at .05) + a 60->140 Hz sawtooth 1.1 s at .06
    n=int(1.25*SR);y=np.zeros(n)
    def tone(f0,t0,d,vol,f1):
        t=np.arange(int((d+.03)*SR))/SR;f=f0*(f1/f0)**np.clip(t/d,0,1);ph=np.cumsum(f/SR)%1;s=2*ph-1
        g=np.where(t<.004,1e-4*(vol/1e-4)**np.clip(t/.004,0,1),vol*(1e-4/vol)**np.clip((t-.004)/(d-.004),0,1));i=int(t0*SR);y[i:i+len(t)]+=(s*g)[:n-i]
    for i in range(3):tone(520,i*.36,.18,.05,980);tone(980,i*.36+.18,.18,.05,520)
    tone(60,0,1.1,.06,140);return y
info={}
ty=today();info['today']={'what':"sfx.wild('turbo') rendered offline",'seconds':round(len(ty)/SR,2),'rawRMS_dBFS':round(20*np.log10(rms(ty)),1)}
for k,(id,segs) in C.items():
    f,kind=src(id);full=load(f);y=join([hp(gate(load(f,a,b),full)) for a,b in segs])
    looped=len(y)<DUR*SR;y=loop_to(y,int(DUR*SR));y=level(shape(y));save(k,y)
    info[k]={'source':f.name,'kind':kind,'segments':segs,'looped':looped,'seconds':DUR}
save('today',level(ty))
g=10**((info['today']['rawRMS_dBFS']-3+20)/20)  # file RMS -20 -> today's raw RMS - 3 dB
info['gameGain']=round(g,3);info['note']='in game: play at gameGain x the wild() volume, stopped when Zoomies ends'
(OUT/'info.json').write_text(json.dumps(info,indent=1));print(json.dumps(info,indent=1))
