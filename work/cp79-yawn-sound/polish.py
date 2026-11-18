"""CP-79 Step 1b: clean, clear, game-ready versions from the full-quality originals (originals/).
Method (no noise can survive it): each cat's own voice is measured from the recording, frame by frame (5 ms):
its pitch line (f0) and the strength of each harmonic. The sound is then rebuilt from those harmonics alone
(a sinusoidal resynthesis), so hiss, phone noise and background hum, which sit between the harmonics, are gone,
while the pitch movement and timbre are the cat's. Then a light polish: upper harmonics +2-3 dB (brighter, sweeter),
the lowest three a touch up (fuller), A raised 2 semitones (cuter), and a little soft breath (A only, clean filtered noise
following the voice). Levelled like today's file (RMS -20 dBFS over the sounding part, peaks <= -1 dBFS).
Versions: A2 = A cleaned; B2 = B's yawning mew cleaned; AB = B's mew gliding into A's falling squeak ending.
Usage: python polish.py -> audio/yawn-sound-{A2,B2,AB}.wav/.mp3 + audio/polish-info.json"""
from pathlib import Path
import json,subprocess,wave
import numpy as np
from scipy.signal import medfilt
from scipy.ndimage import uniform_filter1d
P=Path(__file__).parent;O=P/'originals';OUT=P/'audio';SR=48000;HOP=240;NFFT=4096
def load(name,a,b):
    f=next(O.glob(name+'*.wav'))
    r=subprocess.run(['ffmpeg','-v','error','-ss',str(a),'-to',str(b),'-i',str(f),'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True)
    return np.frombuffer(r.stdout,np.float32).astype(float)
def analyse(x,fmin,fmax,nh=24):
    win=np.hanning(NFFT);pad=np.concatenate([np.zeros(NFFT//2),x,np.zeros(NFFT//2)]);fr=np.fft.rfftfreq(NFFT,1/SR)
    nfr=len(x)//HOP;F0=np.zeros(nfr);AMP=np.zeros((nfr,nh));VO=np.zeros(nfr);cands=np.arange(fmin,fmax,2.0)
    for i in range(nfr):
        s=pad[i*HOP:i*HOP+NFFT]*win;M=np.abs(np.fft.rfft(s))*2/win.sum()
        L=np.log1p(M*1e4)
        sc=[sum(L[int(round(k*c*NFFT/SR))] for k in range(1,7) if k*c<SR/2-200) for c in cands]
        c=cands[int(np.argmax(sc))]
        b=int(round(c*NFFT/SR));j=b-3+int(np.argmax(M[b-3:b+4]))  # refine on the fundamental's peak
        if 0<j<len(M)-1:
            a0,a1,a2=np.log(M[j-1]+1e-12),np.log(M[j]+1e-12),np.log(M[j+1]+1e-12);d=.5*(a0-a2)/(a0-2*a1+a2+1e-12);c2=(j+d)*SR/NFFT
            if abs(c2-c)<c*.06:c=c2
        F0[i]=c
        for k in range(nh):
            hb=(k+1)*c*NFFT/SR
            if hb>=len(M)-3:break
            b=int(round(hb));AMP[i,k]=M[b-2:b+3].max()
        harm=sum(AMP[i,k]**2 for k in range(nh));tot=(M**2).sum()+1e-12;VO[i]=harm/tot*(nh/ (NFFT/2))**0 # harmonic share
    VO=uniform_filter1d(VO,5);ok=VO>np.percentile(VO,35)
    if ok.sum()>3:F0=np.exp(np.interp(np.arange(len(F0)),np.where(ok)[0],np.log(F0[ok])))
    F0=medfilt(F0,9)
    for i in range(1,len(F0)):  # no jumps over 8% between 5 ms frames
        r=F0[i]/F0[i-1]
        if r>1.08 or r<1/1.08:F0[i]=F0[i-1]*np.clip(r,1/1.08,1.08)
    F0=uniform_filter1d(F0,5)
    return F0,AMP,VO
def synth(F0,AMP,gate,semis=0,tilt=0.0,full=0.0):
    n=len(F0)*HOP;t=np.arange(n);fi=np.arange(len(F0))*HOP
    f0=np.interp(t,fi,F0)*2**(semis/12);y=np.zeros(n);ph=np.cumsum(2*np.pi*f0/SR)
    AMPs=uniform_filter1d(AMP,11,axis=0);tot=np.sqrt((AMPs**2).sum(1));lo=np.percentile(tot[gate>.5],60) if (gate>.5).any() else 0
    AMPs=AMPs*(np.maximum(tot,lo*.55)/(tot+1e-12))[:,None]*gate[:,None]  # the dip is lifted to >=55% of the voice
    for k in range(AMP.shape[1]):
        fk=(k+1)*f0
        g=(1+k)**tilt*(10**(full/20) if k<3 else 1)
        a=np.interp(t,fi,AMPs[:,k])*g*(fk<15000)
        y+=a*np.sin((k+1)*ph)
    return y,np.interp(t,fi,uniform_filter1d(AMPs.sum(1),9))
def gate_from(VO,thr,smooth=9,floor=.45):
    g=np.clip((VO-thr)/(thr*.6),0,1);v=np.where(g>.5)[0]
    if len(v):g[v[0]:v[-1]]=np.maximum(g[v[0]:v[-1]],floor)
    return uniform_filter1d(g,smooth)
def breath(env,lo=1800,hi=6500,level=.12,seed=3):
    rng=np.random.default_rng(seed);nz=rng.standard_normal(len(env));N=np.fft.rfft(nz);f=np.fft.rfftfreq(len(nz),1/SR)
    N[(f<lo)|(f>hi)]=0;N*=np.where((f>=lo)&(f<=hi),1/np.sqrt(np.maximum(f,1)/lo),0);nz=np.fft.irfft(N,len(nz));nz/=np.abs(nz).max()+1e-12
    return nz*env/ (env.max()+1e-12)*level
def fade(x,fi=.015,fo=.12):
    x=x.copy();i=int(fi*SR);o=int(fo*SR);x[:i]*=np.linspace(0,1,i);x[-o:]*=np.linspace(1,0,o)**1.5;return x
def level(x):
    e=np.sqrt(np.convolve(x**2,np.ones(2400)/2400,'same'));m=e>e.max()*.1;r=np.sqrt((x[m]**2).mean());x=x*(10**(-20/20)/r)
    pk=np.abs(x).max();lim=10**(-1/20);return x*(lim/pk) if pk>lim else x
def trim(x,thr=.02):
    e=np.abs(x);idx=np.where(e>e.max()*thr)[0];a=max(0,idx[0]-int(.01*SR));b=min(len(x),idx[-1]+int(.03*SR));return x[a:b]
def save(name,x):
    f=OUT/f'yawn-sound-{name}.wav';w=wave.open(str(f),'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR)
    w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes());w.close()
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(f),'-b:a','128k',str(OUT/f'yawn-sound-{name}.mp3')],check=True);return f
info={}
# --- A: the close-up yawn (voiced 0.27-1.56 s; the loud handling/air bursts at 0-0.2 and 1.7 s are left out)
xa=load('A-841188',0.24,1.60);FA,AA,VA=analyse(xa,380,800);ga=gate_from(VA,np.percentile(VA,40))
ya,ea=synth(FA,AA,ga,semis=2,tilt=.18,full=2);ya=ya+breath(ea,level=.10)*np.abs(ya).max()
A2=level(fade(trim(ya)));save('A2',A2);info['A2']={'from':'originals/A-841188 0.24-1.60 s','f0_Hz':[int(np.percentile(FA[ga>.5],5)),int(np.percentile(FA[ga>.5],95))],'semitones':2,'seconds':round(len(A2)/SR,3)}
# --- B: the kitten's yawning mew (3rd call, 2.85-4.25 s)
xb=load('B-764743',2.85,4.25);FB,AB_,VB=analyse(xb,600,1400);gb=gate_from(VB,np.percentile(VB,30))
yb,eb=synth(FB,AB_,gb,semis=0,tilt=.12,full=2.5)
B2=level(fade(trim(yb)));save('B2',B2);info['B2']={'from':'originals/B-764743 2.85-4.25 s','f0_Hz':[int(np.percentile(FB[gb>.5],5)),int(np.percentile(FB[gb>.5],95))],'seconds':round(len(B2)/SR,3)}
# --- AB: B's mew (its first ~0.85 s) gliding (0.12 s) into A's falling squeak ending (A from 0.95 s), pitch-matched
vb=np.where(gb>.5)[0];ib0=vb[0];ib1=ib0+int(.85*SR/HOP)
va=np.where(ga>.5)[0];ia0=int((0.95-0.24)*SR/HOP);ia1=va[-1]+8
fa_shift=2**(5/12) # A's ending raised 5 semitones so it continues from the kitten's pitch rather than dropping an octave
segB=FB[ib0:ib1];segA=FA[ia0:ia1]*fa_shift;nx=int(.12*SR/HOP)
glide=np.exp(np.linspace(np.log(segB[-1]),np.log(segA[0]),nx))
F=np.concatenate([segB,glide,segA])
# harmonic strengths: each side normalised to its own loudness, crossfaded over the glide
nb=AB_[ib0:ib1]/ (np.sqrt((AB_[ib0:ib1]**2).sum(1)).mean()+1e-12);na=AA[ia0:ia1]/(np.sqrt((AA[ia0:ia1]**2).sum(1)).mean()+1e-12)
w=np.linspace(0,1,nx)[:,None];mid=nb[-1][None,:]*(1-w)+na[0][None,:]*w
AMP=np.concatenate([nb,mid,na]);G=np.concatenate([gb[ib0:ib1],np.ones(nx),ga[ia0:ia1]])
G[:4]*=np.linspace(0,1,4)
yab,eab=synth(F,AMP,G,tilt=.15,full=2.5);yab=yab+breath(eab,level=.06)*np.abs(yab).max()
ABv=level(fade(trim(yab)));save('AB',ABv);info['AB']={'from':'B 2.85 s + 0.85 s, 0.12 s glide, A from 0.95 s (+5 semitones)','seconds':round(len(ABv)/SR,3)}
# today's raw render level (for the in-game gain): same RMS measure as level()
r=subprocess.run(['ffmpeg','-v','error','-i',str(OUT/'yawn-sound-today.wav'),'-f','f32le','-'],capture_output=True,check=True)
info['note']='all files levelled to the same RMS (-20 dBFS over the sounding part) as yawn-sound-today.wav'
(OUT/'polish-info.json').write_text(json.dumps(info,indent=1));print(json.dumps(info,indent=1))
