# The UAT 38 dance-break freeze fix, applied to a release.html (python fix_crash.py <in> <out>).
# 1. Three Wild 2 sounds passed a slide-end pitch where the destination node goes: _mt(...,vol,392) -> connect(392)
#    threw "Failed to execute 'connect' on 'AudioNode'" (only with sound on) and the exception stopped the frame loop.
# 2. _mt/_mn fall back to the master if the destination isn't an audio node.
# 3. The frame loop survives any exception: it is logged to the performance log ('error' event) and the game goes on.
import sys
from pathlib import Path
s = Path(sys.argv[1]).read_text(encoding='utf-8', newline='')
N = '\r\n'
def rep(old, new, count=1):
    global s
    old = old.replace('\n', N); new = new.replace('\n', N)
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("this._mt(196,t,.5,'sawtooth',.05*v,392)", "this._mt(196,t,.5,'sawtooth',.05*v,master,392)")
rep("this._mt(600,t+.5,.25,'triangle',.06*v,900)", "this._mt(600,t+.5,.25,'triangle',.06*v,master,900)")
rep("this._mt(900,t+.68,.3,'triangle',.05*v,520)", "this._mt(900,t+.68,.3,'triangle',.05*v,master,520)")
rep("o.connect(g);g.connect(dest||master);o.start(t0);o.stop(t0+dur+.03);},", "o.connect(g);g.connect(dest&&dest.connect?dest:master);o.start(t0);o.stop(t0+dur+.03);},")
rep("s.connect(f);f.connect(g);g.connect(dest||master);s.start(t0);s.stop(t0+dur+.02);},", "s.connect(f);f.connect(g);g.connect(dest&&dest.connect?dest:master);s.start(t0);s.stop(t0+dur+.02);},")
rep("function frame(now){\n",
    "// UAT 39+: an exception in one frame must never stop the game. It is logged (performance log, 'error' event) and the\n"
    "// next frame runs as usual.\n"
    "let frameErrors=0,frameErrorLast='';\n"
    "function frameError(e){frameErrors++;const m=String(e&&e.message||e).slice(0,140),at=String(e&&e.stack||'').split(String.fromCharCode(10))[1]||'';\n"
    " if(m!==frameErrorLast||frameErrors%50===1){frameErrorLast=m;try{diagEvent('error',m+' '+at.trim().slice(0,100));}catch(x){}}try{console.error(e);}catch(x){}}\n"
    "function frame(now){try{frameBody(now);}catch(e){frameError(e);last=performance.now();acc=0;requestAnimationFrame(frame);}}\n"
    "function frameBody(now){\n")
Path(sys.argv[2]).write_text(s, encoding='utf-8', newline='')
print('fixed', sys.argv[2])
