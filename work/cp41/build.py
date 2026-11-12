# UAT 41: builds release.html from the published UAT 40 source (pinned by hash) for three CP-38 follow-ups:
# 1. Wild 2's own goal card (card41.js): the goal and one icon line per idea, a big TAP TO START; the timer only runs
#    after the countdown.
# 2. Music: the background loop is Jenny's pick "Kawaii bubbly pop" (kawaii41.js, generated from the audition code)
#    at the audition's level as Music volume 100%; the dial goes 0-200%, default 100%. Coin sounds unchanged.
# 3. Pusher rhythm: a distinct chug on each stroke (forward and back); in Turbo the strokes double, a little higher and
#    louder. The Turbo callout says "TURBO PUSHER! 2x SPEED" (both Wild boards).
# Usage: python build.py [baseline release.html]   (default: the UAT 40 source pinned below)
from pathlib import Path
import json, hashlib, sys
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
BASE = Path(sys.argv[1]) if len(sys.argv) > 1 else (p.parent / 'cp40/release.html')
PIN = 'c031ba59cff0c6849a17d86fd36dea750b725b061d0945d27d4ccb213b3c32fe'  # published UAT 40
s = BASE.read_text(encoding='utf-8', newline='')
if PIN and len(sys.argv) == 1:
    assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be UAT 40'
N = '\r\n'


def rep(old, new, count=1):
    global s
    old = old.replace('\n', N); new = new.replace('\n', N)
    assert s.count(old) == count, (old[:90], s.count(old))
    s = s.replace(old, new)


import re
s = re.sub(r"const BUILD = '[^']*';", "const BUILD = '%s';" % v['displayName'], s, count=1)

# --- 1. goal card: Wild 1's card is not drawn on Wild 2 (card41.js draws Wild 2's) ---
rep("if(WILD.phase==='card'){\n  const R=wildCardRects()", "if(WILD.phase==='card'&&!WILD.v2){\n  const R=wildCardRects()")

# --- 2. music mix ---
# dial: 0-200 %, default 100 % (= the audition level). Saved under a new key, so the new default applies on every
# phone; the pusher dial keeps its saved value.
rep("const W2_DEFAULTS=Object.freeze({music:.5,pusher:.5});", "const W2_DEFAULTS=Object.freeze({music:1,pusher:.5}),W2_MAX={music:2,pusher:1},W2_MUSIC_KEY='catpusher.uat.music.v2',MUSIC_BASE=1;")
rep("try{const d=JSON.parse(localStorage.getItem(W2_KEY)||'null');if(d)for(const k in W2_DEFAULTS)if(Number.isFinite(+d[k]))W2[k]=Math.min(1,Math.max(0,+d[k]));}catch(e){}\n"
    "function w2Save(){try{localStorage.setItem(W2_KEY,JSON.stringify(W2));}catch(e){}}",
    "try{const d=JSON.parse(localStorage.getItem(W2_KEY)||'null');if(d&&Number.isFinite(+d.pusher))W2.pusher=Math.min(1,Math.max(0,+d.pusher));\n"
    " const m=JSON.parse(localStorage.getItem(W2_MUSIC_KEY)||'null');if(m&&Number.isFinite(+m.music))W2.music=Math.min(2,Math.max(0,+m.music));}catch(e){}\n"
    "function w2Save(){try{localStorage.setItem(W2_KEY,JSON.stringify({pusher:W2.pusher}));localStorage.setItem(W2_MUSIC_KEY,JSON.stringify({music:W2.music}));}catch(e){}}")
rep("if(BGM.level!==W2.music){BGM.level=W2.music;sfx.bgmBus(W2.music,.35);}", "if(BGM.level!==W2.music){BGM.level=W2.music;sfx.bgmBus(W2.music*MUSIC_BASE,.35);}")
# the kawaii pop notes: a note player on the music bus (the audition's envelope and filter, Web Audio calls the game
# already makes) and the scheduler plays the note list ahead on the audio clock, looping
rep("    bgmBus(level,fade=.3){", """    mus(e,delay){
      if(!this._w2ok())return;const t=ac.currentTime+Math.max(0,delay),B=this._bus(),o=e.o,a=o.a||.005;let src;
      if(e.k===0){src=ac.createOscillator();src.type=e.type;src.frequency.setValueAtTime(e.f,t);if(o.fEnd)src.frequency.exponentialRampToValueAtTime(o.fEnd,t+(o.glide||e.dur));}
      else{src=ac.createBufferSource();src.buffer=noiseBuf;src.loop=true;}
      const g=ac.createGain();g.gain.setValueAtTime(.0001,t);if(o.lin)g.gain.linearRampToValueAtTime(e.vol,t+a);else g.gain.exponentialRampToValueAtTime(e.vol,t+a);
      if(o.hold)g.gain.exponentialRampToValueAtTime(Math.max(1e-4,e.vol*(o.sus??1)),t+Math.max(a+.001,o.hold));g.gain.exponentialRampToValueAtTime(.0001,t+e.dur);
      let out=src;if(o.lp||o.hp||o.bp){const f=ac.createBiquadFilter();f.type=o.lp?'lowpass':o.hp?'highpass':'bandpass';f.frequency.value=o.lp||o.hp||o.bp;f.Q.value=o.q??(o.bp?1:0);src.connect(f);out=f;}
      out.connect(g);g.connect(B);if(e.k===0){src.start(t);src.stop(t+e.dur+.03);}else{src.start(t,e.off);src.stop(t+e.dur+.02);}
    },
    bgmBus(level,fade=.3){""")
rep("if(want&&!BGM.playing){BGM.playing=true;BGM.step=0;BGM.next=now+.1;BGM.level=-1;}", "if(want&&!BGM.playing){BGM.playing=true;BGM.i=0;BGM.t0=now+.1;BGM.level=-1;} // from the top of the loop")
rep(""" if(BGM.next<now-.3)BGM.next=now+.05; // after a stall, carry on rather than catch up
 while(BGM.next-now<.2){bgmStep(BGM.step,BGM.next-now);BGM.step=(BGM.step+1)%BGM_STEPS;BGM.next+=BGM_STEP;}""",
    """ const E=KAWAII.ev;if(BGM.t0+(BGM.i<E.length?E[BGM.i].t:KAWAII.len)<now-.3){BGM.t0=now+.05;BGM.i=0;} // after a stall: from the top, no catch-up burst
 for(let n=0;n<400;n++){if(BGM.i>=E.length){BGM.i=0;BGM.t0+=KAWAII.len;continue;}const e=E[BGM.i],at=BGM.t0+e.t;if(at-now>=.25)break;if(at>=now-.05)sfx.mus(e,at-now);BGM.i++;}""")
rep("W2[k]=Math.min(1,Math.max(0,Math.round((W2[k]+ +btn.dataset.dir*.1)*10)/10));", "W2[k]=Math.min(W2_MAX[k],Math.max(0,Math.round((W2[k]+ +btn.dataset.dir*.1)*10)/10));")
rep("box.querySelector('#w2-dev-reset').onclick=()=>{Object.assign(W2,W2_DEFAULTS);try{localStorage.removeItem(W2_KEY);}catch(e){}reopen();};",
    "box.querySelector('#w2-dev-reset').onclick=()=>{Object.assign(W2,W2_DEFAULTS);try{localStorage.removeItem(W2_KEY);localStorage.removeItem(W2_MUSIC_KEY);}catch(e){}reopen();};")
rep("Sound defaults (music 50%, pusher 50%)", "Sound defaults (music 100%, pusher 50%)")

# --- 3. pusher rhythm and Turbo ---
rep("""    slide(vol,dur,back){
      const v=vol;if(!(v>0)||!this._w2ok())return;const t=ac.currentTime,k=back?.55:1;
      this._mn(t,dur,.035*v*k,back?520:700,.8,master,.18);this._mn(t,dur,.015*v*k,1700,1.5,master,.25);
      this._mt(back?70:85,t+dur-.02,.12,'sine',.12*v*k,master,45);this._mn(t+dur-.02,.05,.05*v*k,420,1.2);
    },""",
"""    // UAT 41: a distinct beat on each stroke: a mechanical "chunk" as the pusher sets off (forward louder, back
    // softer), a light ratchet under the travel and a small knock where it stops. turbo: higher and louder.
    slide(vol,dur,back,turbo){
      const v=vol*(turbo?1.35:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime,k=back?.6:1,p=turbo?1.26:1;
      this._mt(back?78*p:96*p,t,.16,'sine',.42*v*k,master,40*p);this._mn(t,.045,.22*v*k,(back?900:1200)*p,1.4);this._mt((back?520:660)*p,t+.004,.05,'square',.05*v*k,master,(back?300:380)*p);
      this._mn(t+.03,dur-.06,.022*v*k,(back?560:760)*p,.8,master,.12);
      const n=Math.max(2,Math.round(dur/.16));for(let i=1;i<n;i++)this._mn(t+i*dur/n,.018,.035*v*k,2600*p,3);
      this._mt(back?110*p:130*p,t+dur-.03,.08,'sine',.16*v*k,master,60*p);this._mn(t+dur-.03,.03,.08*v*k,700*p,1.4);
    },""")
rep("if(crossed(.08))sfx.slide(W2.pusher,.45*PUSH_PERIOD,false);else if(crossed(.61))sfx.slide(W2.pusher,.39*PUSH_PERIOD,true);",
    "const turbo=WILD.on&&WILD.turbo>0;if(crossed(.08))sfx.slide(W2.pusher,.45*PUSH_PERIOD,false,turbo);else if(crossed(.61))sfx.slide(W2.pusher,.39*PUSH_PERIOD,true,turbo);")
rep("callout('TURBO PUSHER!',{color:'#ff6ad5',dur:1.3});", "callout('TURBO PUSHER! 2× SPEED',{color:'#ff6ad5',dur:1.8});")

a = s.index('// Local UAT diagnostics:')
s = s[:a] + ''.join((p / f).read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N) for f in ('kawaii41.js', 'card41.js')) + s[a:]
out = p / ('release.html' if len(sys.argv) == 1 else 'preview.html')
out.write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s), '->', out.name)
