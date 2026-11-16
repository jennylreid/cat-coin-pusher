from pathlib import Path
import wave,math,struct,json
sr=44100;notes=[(659.25,0,.17,.065),(830.61,.055,.20,.055),(1318.51,.11,.27,.05)]
samples=[]
for i in range(int(sr*.45)):
 t=i/sr;s=0
 for f,start,d,vol in notes:
  at=t-start
  if at<0 or at>d+.03:continue
  gain=.0001*(vol/.0001)**(at/.004) if at<.004 else vol*(.0001/vol)**((at-.004)/(d-.004)) if at<d else .0001
  s+=.55*gain*math.sin(2*math.pi*f*at)
 samples.append(s)
p=Path(__file__).resolve().parents[3]/'tickets/CP-25-evidence/stage3'
with wave.open(str(p/'item-collected.wav'),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(b''.join(struct.pack('<h',round(max(-1,min(1,s))*32767)) for s in samples))
(p/'sound-preview.json').write_text(json.dumps(dict(description='Mathematical render of the shipped three sine notes, Web Audio exponential envelope and 0.55 master gain; actual game synthesizes the sound',duration=.45,sampleRate=sr,peak=max(abs(s) for s in samples),notes=notes),indent=2))
print('Pickup sound preview rendered')
