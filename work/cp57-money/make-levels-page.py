# CP-57: builds tickets/CP-57-evidence/levels.html, an offline (OfflineAudioContext) level check in a real browser, so the
# Dance break bus's soft limiter is real. It runs each build's own sfx code: UAT base (before) and the CP-57 build (after).
# Measures peak, loudest 100 ms above 250 Hz and the average over the music, for: the 16-beat Dance break music (109 BPM,
# danceSchedule's exact calls), the ledge bell at today's level, the register takes at that level, the coin landing recording.
import json,base64,sys
from pathlib import Path
p=Path(__file__).parent;root=p.parents[1]
base=Path(sys.argv[1]) if len(sys.argv)>1 else p.parent/'cp71/release.html'
def block(f):s=f.read_text(encoding='utf-8');i=s.index('const sfx = (() => {');j=s.index('})();',i)+5;return s[i:j]
cal=json.loads((p/'register/calibration.json').read_text())
regs={k:base64.b64encode((p/'register'/f'{k}.mp3').read_bytes()).decode() for k in ['reg1','reg2','reg3','reg4','reg6']}
land=base64.b64encode((root/'tickets/CP-54-evidence/sounds/today-coin-land.mp3').read_bytes()).decode()
html='''<!doctype html><meta charset="utf-8"><title>CP-57 levels</title><body style="font:14px system-ui;background:#fff;color:#000"><pre id="o">running…</pre><script>
const BEFORE=%s,AFTER=%s,REGS=%s,LAND=%s,REG_GAIN=%s,DANCE_MUSIC_GAIN=3.1623;
const DANCE_BASS=[[130.81,196],[110,164.81],[87.31,130.81],[98,146.83]],DANCE_LEAD=[[523.25,659.25,783.99,659.25],[440,523.25,659.25,523.25],[349.23,440,523.25,440],[392,493.88,587.33,493.88]];
function mk(code,dur){const c=new OfflineAudioContext(1,Math.ceil(44100*dur),44100);const f=new Function('S','inBackground','pickupFx','window','DANCE_MUSIC_GAIN','document',code+';return sfx;');
 const sfx=f({muted:false},false,{volume:1},{AudioContext:function(){return c;}},DANCE_MUSIC_GAIN,{hidden:false,visibilityState:'visible'});sfx.unlock();return {c,sfx};}
function b64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;}
function meas(d){const sr=44100,w=sr*.1;// 2nd-order highpass 250 Hz (RBJ, Q .707)
 const w0=2*Math.PI*250/sr,al=Math.sin(w0)/(2*.7071),cs=Math.cos(w0),a0=1+al,b=[(1+cs)/2/a0,-(1+cs)/a0,(1+cs)/2/a0],a=[-2*cs/a0,(1-al)/a0];
 let x1=0,x2=0,y1=0,y2=0,acc=0,best=0,sum=0,peak=0;const y=new Float32Array(d.length);
 for(let i=0;i<d.length;i++){const o=b[0]*d[i]+b[1]*x1+b[2]*x2-a[0]*y1-a[1]*y2;x2=x1;x1=d[i];y2=y1;y1=o;y[i]=o;peak=Math.max(peak,Math.abs(d[i]));sum+=o*o;
  acc+=o*o;if(i>=w)acc-=y[i-w]*y[i-w];if(i>=w-1)best=Math.max(best,acc/w);}
 const db=x=>+(10*Math.log10(x+1e-12)).toFixed(1);return {peak:+peak.toFixed(3),loudest100msDb:db(best),averageDb:db(sum/d.length)};}
async function dance(code,loud){const beat=60/109,n=16,dur=(n+3)*beat+2;const {c,sfx}=mk(code,dur);const P=loud&&sfx.danceLoud?'danceLoud':'dance',h=beat/2;
 for(let k=-2;k<=n;k++){const d=.05+(k+2)*beat;
  if(k<0){sfx[P]('count',1,d,k===-1?1600:1200);sfx[P]('hat',.8,d+h);continue;}
  if(k===n){sfx[P]('stop',1,d);continue;}
  const b=k%%4,bar=(k/4|0)%%4;sfx[P]('kick',1,d);if(k===0)sfx[P]('crash',.8,d);
  if(b===1||b===3){sfx[P]('snare',1,d);if(k>=4)sfx[P]('clap',.7,d);}
  sfx[P]('hat',1,d+h);if(k>=8){sfx[P]('hat',.5,d+h/2);sfx[P]('hat',.5,d+h*1.5);}
  sfx[P]('bass',1,d,DANCE_BASS[bar][b%%2]);
  if(k>=4){const m=DANCE_LEAD[bar];sfx[P]('lead',1,d,m[b]);if(b!==3)sfx[P]('lead',.8,d+h,m[(b+1)%%4]*(k>=12?2:1));}}
 const r=await c.startRendering();const all=r.getChannelData(0);return {whole:meas(all),music:meas(all.slice(Math.round(44100*(.05+6*beat)),Math.round(44100*(.05+18*beat))))};}
async function one(fn,dur=2){const {c,sfx}=mk(BEFORE,dur);await fn(c,sfx);return meas((await c.startRendering()).getChannelData(0));}
(async()=>{const R={};
 R.danceBefore=await dance(BEFORE,false);R.danceAfter=await dance(AFTER,true);
 R.bellAtTodaysLevel=await one((c,s)=>s.pickup('bell',.5,.02));
 R.registerAtBellLevel={};for(const [k,v] of Object.entries(REGS))R.registerAtBellLevel[k]=await one(async(c,s)=>{const b=await c.decodeAudioData(b64(v));const src=c.createBufferSource(),g=c.createGain(),m=c.createGain();m.gain.value=.55;g.gain.value=.5*REG_GAIN;src.buffer=b;src.connect(g);g.connect(m);m.connect(c.destination);src.start(.02);});
 R.coinLandingRecording=await one(async(c,s)=>{const b=await c.decodeAudioData(b64(LAND));const src=c.createBufferSource(),g=c.createGain();g.gain.value=.25;src.buffer=b;src.connect(g);g.connect(c.destination);src.start(.02);src.stop(.86);});
 window.R=R;document.getElementById('o').textContent=JSON.stringify(R,null,1);})().catch(e=>{document.getElementById('o').textContent='ERR '+e.stack;});
</script>'''%(json.dumps(block(base)),json.dumps(block(p/'release.html')),json.dumps(regs),json.dumps(land),cal['REG_GAIN'])
out=root/'tickets/CP-57-evidence/levels.html';out.write_text(html,encoding='utf-8');print(out,len(html))
