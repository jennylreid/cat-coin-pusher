# CP-46 sound patch (Jenny's picks, Nov 14): the new coin sounds in rotation and the warm whoosh pusher (no beat).
# Applies work/cp46-audio/sounds60.js on top of a built game. Its coin code is the CP-46 audition's (coins-from-audition.js,
# cut from work/cp46-audition/make-audition.cjs) and its levels come from the audition's levels files.
# Usage: python patch.py BASE_release.html OUT_release.html "DISPLAY NAME" [BASE_SHA256]
from pathlib import Path
import json, hashlib, sys, re
p = Path(__file__).parent; w = p.parent; r = w.parent
BASE, OUT, NAME = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
s = BASE.read_text(encoding='utf-8', newline='')
if len(sys.argv) > 4: assert hashlib.sha256(s.encode('utf-8')).hexdigest() == sys.argv[4], 'baseline hash differs'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
old_build = re.findall(r"const BUILD = '[^']*';", s); assert len(old_build) == 1
rep(old_build[0], "const BUILD = '%s';" % NAME)
# sfx.fx46: one note of an effect from a note list (sfx.mus's recipe), on the effects master, volume scaled by sc
FX46 = """    // UAT CP-46: one note of an effect from a note list (like mus), on the effects master; sc scales its volume
    fx46(e,delay,sc){
      if(!this._w2ok())return;const vol=e.vol*sc;if(!(vol>0)||!Number.isFinite(vol))return;const t=ac.currentTime+Math.max(0,delay),o=e.o,a=o.a||.005;let src;
      if(e.k===0){src=ac.createOscillator();src.type=e.type;src.frequency.setValueAtTime(e.f,t);if(o.fEnd)src.frequency.exponentialRampToValueAtTime(o.fEnd,t+(o.glide||e.dur));}
      else{src=ac.createBufferSource();src.buffer=noiseBuf;src.loop=true;}
      const g=ac.createGain();g.gain.setValueAtTime(.0001,t);if(o.lin)g.gain.linearRampToValueAtTime(vol,t+a);else g.gain.exponentialRampToValueAtTime(vol,t+a);
      if(o.hold)g.gain.exponentialRampToValueAtTime(Math.max(1e-4,vol*(o.sus??1)),t+Math.max(a+.001,o.hold));g.gain.exponentialRampToValueAtTime(.0001,t+e.dur);
      let out=src;if(o.lp||o.hp||o.bp){const f=ac.createBiquadFilter();f.type=o.lp?'lowpass':o.hp?'highpass':'bandpass';f.frequency.value=o.lp||o.hp||o.bp;f.Q.value=o.q??(o.bp?1:0);src.connect(f);out=f;}
      out.connect(g);g.connect(master);if(e.k===0){src.start(t);src.stop(t+e.dur+.03);}else{src.start(t,e.off);src.stop(t+e.dur+.02);}
    },
""".replace('\n', N)
a = "    bgmBus(level,fade=.3){"
rep(a, FX46 + a)
# a coin dropped onto the board, a coin hitting another, coins over the front edge (C46 in sounds60.js)
rep("        sfx.land();", "        C46.land();")
rep("} else sfx.clink(Math.min(1, -b.vy / 3.5));", "} else C46.hit(b, Math.min(1, -b.vy / 3.5));")
rep("if(!b.boardTarget)recordedSfx.edge();", "if(!b.boardTarget)C46.edge(b);")
# the pusher is only the whoosh: the recorded pusher.mp3 no longer plays on the stroke
rep("  if(requested&&phase>=.08&&phase<.08+STEP/PUSH_PERIOD)recordedSfx.play('push');", "  // CP-46: no recorded pusher sound; the warm whoosh (sfx.slide) is the pusher")
# the module, with the audition's coin code and levels
ev = r / 'tickets/CP-46-evidence/audition'
gains = json.loads((ev / 'levels.json').read_text())['coinGroupGains']
w5 = [o for o in json.loads((ev / 'levels-round2.json').read_text())['options'] if o['file'] == 'pusher-w5-warm-whoosh.wav'][0]['gain']
mod = (p / 'sounds60.js').read_text(encoding='utf-8')
coins = (p / 'coins-from-audition.js').read_text(encoding='utf-8')
assert mod.count('/*COINS*/') == 1 and mod.count('/*GAINS*/') == 2 and mod.count('/*W5GAIN*/') == 1
mod = mod.replace('/*COINS*/', coins.rstrip()).replace('const GAIN=/*GAINS*/', 'const GAIN=' + json.dumps(gains)).replace('/*W5GAIN*/', repr(w5))
anchor = "Promise.all([RAPIER.init(), loadArt()])"
rep(anchor, mod.replace('\r\n', '\n').replace('\n', N) + N + anchor)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
