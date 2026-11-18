"""CP-79 Step 1: the 3 yawn-sound candidates (real recordings, Freesound previews in sources/) trimmed, cleaned and
levelled, plus today's code-made yawn (sfx.wild2('yawn'), release.html) rendered offline for comparison.
Each file is mono 48 kHz, one version per file: audio/yawn-sound-{A,B,C,today}.wav (+ .mp3 for A-C, the game's format).
Levelling: the same RMS over the sounding part (-20 dBFS), peaks capped at -1 dBFS. Usage: python make_audio.py"""
from pathlib import Path
import subprocess,json,wave
import numpy as np
P=Path(__file__).parent;SRC=P/'sources';OUT=P/'audio';OUT.mkdir(exist_ok=True);SR=48000
CAND={ # file, start, end (s), high-pass (Hz), fade in/out (s)
 'A':('841188-designerschoice-cat-yawn-closeup.mp3',0.26,1.64,150,.02,.15),   # close-up yawn: voiced, pitch falling ~600->250 Hz
 'B':('764743-242011vee-cat-yawning-and-meow.mp3',2.85,4.25,250,.02,.12),     # kitten's yawning mew (3rd call, falling ~1.1 kHz)
 'C':('875658-timmysdecals-my-cat-waking-up.mp3',3.00,4.60,80,.15,.10)}       # low yawn-groan on waking (its natural end)
def load(f,a,b):
    r=subprocess.run(['ffmpeg','-v','error','-ss',str(a),'-to',str(b),'-i',str(f),'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True)
    return np.frombuffer(r.stdout,np.float32).astype(float)
def hp(x,fc):  # 2nd-order Butterworth high-pass (RBJ biquad)
    w=2*np.pi*fc/SR;al=np.sin(w)/(2*0.7071);c=np.cos(w);b=np.array([(1+c)/2,-(1+c),(1+c)/2]);a=np.array([1+al,-2*c,1-al]);b/=a[0];a/=a[0]
    y=np.zeros_like(x);x1=x2=y1=y2=0.
    for i,v in enumerate(x):o=b[0]*v+b[1]*x1+b[2]*x2-a[1]*y1-a[2]*y2;x2,x1,y2,y1=x1,v,y1,o;y[i]=o
    return y
def fade(x,fi,fo):
    n=len(x);i=int(fi*SR);o=int(fo*SR);x=x.copy();x[:i]*=np.linspace(0,1,i);x[n-o:]*=np.linspace(1,0,o)**1.5;return x
def level(x):
    e=np.sqrt(np.convolve(x**2,np.ones(2400)/2400,'same'));m=e>e.max()*.1;r=np.sqrt((x[m]**2).mean())
    x=x*(10**(-20/20)/r);pk=np.abs(x).max();lim=10**(-1/20)
    if pk>lim:x=x*(lim/pk)
    return x
def save(name,x):
    f=OUT/f'yawn-sound-{name}.wav';w=wave.open(str(f),'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR)
    w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes());w.close();return f
def today():  # sfx.wild2('yawn'): sawtooth 420->560 (0.35 s)->240 Hz (1.5 s); lowpass 700->1600 (0.4)->500 (1.5); gain envelope
    t=np.arange(int(1.65*SR))/SR;L=lambda pts:np.interp(t,[p[0] for p in pts],[p[1] for p in pts])
    f=L([(0,420),(.35,560),(1.5,240),(1.65,240)]);ph=np.cumsum(f/SR)%1;saw=2*ph-1
    fc=L([(0,700),(.4,1600),(1.5,500),(1.65,500)]);g=L([(0,.0001),(.15,.08),(1.2,.06),(1.6,.0001),(1.65,.0001)])
    y=np.zeros_like(saw);x1=x2=y1=y2=0.
    for i,v in enumerate(saw):  # WebAudio lowpass biquad, Q=1
        w=2*np.pi*fc[i]/SR;al=np.sin(w)/2;c=np.cos(w);a0=1+al;b0=(1-c)/2/a0;b1=(1-c)/a0;a1=-2*c/a0;a2=(1-al)/a0
        o=b0*v+b1*x1+b0*x2-a1*y1-a2*y2;x2,x1,y2,y1=x1,v,y1,o;y[i]=o
    return y*g
info={}
for k,(f,a,b,h,fi,fo) in CAND.items():
    x=level(fade(hp(load(SRC/f,a,b),h),fi,fo));w=save(k,x)
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(w),'-b:a','128k',str(OUT/f'yawn-sound-{k}.mp3')],check=True)
    info[k]={'source':f,'from':a,'to':b,'seconds':round(len(x)/SR,3),'peak_dBFS':round(20*np.log10(np.abs(x).max()),1)}
x=level(today());save('today',x);info['today']={'source':"code-made sfx.wild2('yawn') (UAT 95), rendered offline",'seconds':round(len(x)/SR,3)}
(P/'audio'/'audio-info.json').write_text(json.dumps(info,indent=1));print(json.dumps(info,indent=1))
