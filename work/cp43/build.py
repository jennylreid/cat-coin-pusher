# UAT 43: builds release.html from published UAT 42 (work/cp42/release.html, pinned by hash). Jenny approved (Nov 12):
# 1. Dance taps logged ('dance-taps' event: offsets from the beat, mean/median/spread, allowance, audio output delay),
#    and the player's tap offset learned automatically (Auto tap offset, default on). Defaults: window +-0.15 s (was
#    0.13), Tap delay allowance 0.08 s (was 0.05). The count-in invites taps ("TAP ALONG").
# 2. "Send performance log" shows Sending..., then "Log sent ✓ <time>" or the app's error (CP-39, all boards).
# 3. Wild 2 (wild43.js): a plain-coin budget of 130 on the Wild boards with gold "5" coins beyond it, CCD only while a
#    coin falls, one fewer starting row; a star prize per round (on the card and the board, re-dropped 12 s after it's
#    lost); lost prizes tumble over the edge with a rail flash, icon shake, sounds and "Lost the <prize>!"; a bigger
#    wheel with event slices (Rain 25 x2, Rain 10 + Quake, Prize you need, Jackpot 50, Dance again, Yawn).
# 4. Music: Classic (the UAT 38-40 loop, now at the same phone-band level as Kawaii pop) / Kawaii pop; Classic default.
# Usage: python build.py [other baseline release.html -> preview.html]
from pathlib import Path
import json, hashlib, sys, re
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
BASE = Path(sys.argv[1]) if len(sys.argv) > 1 else p.parent / 'cp42/release.html'
PIN = 'bddb98ab40f0a55dc44acb8c308486868d04f591d85ee794b0c6f4c71c705ad3'  # published UAT 42
s = BASE.read_text(encoding='utf-8', newline='')
if len(sys.argv) == 1: assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be UAT 42'
N = '\r\n'


def rep(old, new, count=1):
    global s
    old = old.replace('\n', N); new = new.replace('\n', N)
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)


def src(name):
    return (p / name).read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N)


s, n = re.subn(r"const BUILD = '[^']*';", "const BUILD = '%s';" % v['displayName'], s, count=1); assert n == 1
# 1. beat timing defaults and the count-in hint
rep("const DANCE_DEFAULTS=Object.freeze({notches:4,len:9,bpm:109,window:.13,latency:.05,rainChance:.12,move:1});",
    "const DANCE_DEFAULTS=Object.freeze({notches:4,len:9,bpm:109,window:.15,latency:.08,rainChance:.12,move:1,auto:1}); // UAT 43: window and allowance up; auto offset on")
rep("else{ctx.font='bold 11px system-ui';ctx.fillStyle='#ffe0f4';ctx.fillText('TAP ON THE BEAT',200,Y-24);}",
    "ctx.font='bold 11px system-ui';ctx.fillStyle='#ffe0f4';ctx.fillText(x<0?'TAP ALONG WITH THE COUNT':'TAP ON THE BEAT',200,Y-24); // UAT 43: count-in taps teach the offset")
# 4. music: Classic / Kawaii pop
rep("const W2_DEFAULTS=Object.freeze({music:1,pusher:.5}),", "const W2_DEFAULTS=Object.freeze({music:1,pusher:.5,track:'classic'}),")
rep("if(m&&Number.isFinite(+m.music))W2.music=Math.min(2,Math.max(0,+m.music));}catch(e){}",
    "if(m&&Number.isFinite(+m.music))W2.music=Math.min(2,Math.max(0,+m.music));if(m&&(m.track==='classic'||m.track==='kawaii'))W2.track=m.track;}catch(e){}")
rep("localStorage.setItem(W2_MUSIC_KEY,JSON.stringify({music:W2.music}));", "localStorage.setItem(W2_MUSIC_KEY,JSON.stringify({music:W2.music,track:W2.track}));")
rep("const want=bgmWanted(),now=danceNow();", "const want=bgmWanted(),now=danceNow();if(BGM.playing&&BGM.track!==W2.track){BGM.playing=false;sfx.bgmBus(0,.15);} // switched track: restart")
rep("if(want&&!BGM.playing){BGM.playing=true;BGM.i=0;BGM.t0=now+.1;BGM.level=-1;} // from the top of the loop",
    "if(want&&!BGM.playing){BGM.playing=true;BGM.track=W2.track;BGM.i=0;BGM.t0=now+.1;BGM.step=0;BGM.next=now+.1;BGM.level=-1;} // from the top of the loop")
rep(""" const E=KAWAII.ev;if(BGM.t0+(BGM.i<E.length?E[BGM.i].t:KAWAII.len)<now-.3){BGM.t0=now+.05;BGM.i=0;} // after a stall: from the top, no catch-up burst
 for(let n=0;n<400;n++){if(BGM.i>=E.length){BGM.i=0;BGM.t0+=KAWAII.len;continue;}const e=E[BGM.i],at=BGM.t0+e.t;if(at-now>=.25)break;if(at>=now-.05)sfx.mus(e,at-now);BGM.i++;}""",
""" if(BGM.track==='kawaii'){
 const E=KAWAII.ev;if(BGM.t0+(BGM.i<E.length?E[BGM.i].t:KAWAII.len)<now-.3){BGM.t0=now+.05;BGM.i=0;} // after a stall: from the top, no catch-up burst
 for(let n=0;n<400;n++){if(BGM.i>=E.length){BGM.i=0;BGM.t0+=KAWAII.len;continue;}const e=E[BGM.i],at=BGM.t0+e.t;if(at-now>=.25)break;if(at>=now-.05)sfx.mus(e,at-now);BGM.i++;}
 }else{ // UAT 43: Classic, the UAT 38-40 loop
 if(BGM.next<now-.3)BGM.next=now+.05;
 while(BGM.next-now<.2){bgmStep(BGM.step,BGM.next-now);BGM.step=(BGM.step+1)%BGM_STEPS;BGM.next+=BGM_STEP;}
 }""")
# Classic runs its bus 1.72x (+4.7 dB) to match Kawaii pop's level above 250 Hz, through a soft limiter (straight below
# the music's normal peaks; it only rounds off the loudest peaks at high Music volume, so 200% can't clip)
rep("if(BGM.level!==W2.music){BGM.level=W2.music;sfx.bgmBus(W2.music*MUSIC_BASE,.35);}", "if(BGM.level!==W2.music){BGM.level=W2.music;sfx.bgmBus(W2.music*MUSIC_BASE*(BGM.track==='kawaii'?1:CLASSIC_GAIN),.35);}")
rep("    _bus(){if(!this.__bus){this.__bus=ac.createGain();this.__bus.gain.value=0;this.__bus.connect(master);}return this.__bus;},",
    """    _bus(){if(!this.__bus){this.__bus=ac.createGain();this.__bus.gain.value=0;
      // UAT 43: soft limiter: bus -> x0.4 -> curve (straight up to 0.5, then rounds off towards 0.65) -> x2.5 -> master
      const pre=ac.createGain(),sh=ac.createWaveShaper(),post=ac.createGain(),n=1025,c=new Float32Array(n);
      for(let i=0;i<n;i++){const u=i/(n-1)*2-1,a=Math.abs(u);c[i]=Math.sign(u)*(a<=.5?a:.5+.15*Math.tanh((a-.5)/.15));}
      sh.curve=c;pre.gain.value=.4;post.gain.value=2.5;this.__bus.connect(pre);pre.connect(sh);sh.connect(post);post.connect(master);}return this.__bus;},""")
# nothing stays on the cat's face: the last-10-s count, the 3-2-1 and GO, PERFECT / +N COINS! (and their dimming),
# the yawn word and the Wild 1 goal card's dimming move below the chin line (w43ChinY, wild43.js)
rep("ctx.translate(200,H*.3);ctx.scale(k,k);wildText(String(s),0,0,110,", "ctx.translate(200,w43ChinY()+70);ctx.scale(k,k);wildText(String(s),0,0,110,")
rep("ctx.translate(200,H*.42);ctx.scale(k,k);ctx.globalAlpha=Math.min(1,(1-u)*3);", "ctx.translate(200,w43ChinY()+90);ctx.scale(k,k);ctx.globalAlpha=Math.min(1,(1-u)*3);")
rep("ctx.translate(200,H*.42);ctx.scale(1+u*.6,1+u*.6);wildText('GO!'", "ctx.translate(200,w43ChinY()+90);ctx.scale(1+u*.6,1+u*.6);wildText('GO!'")
rep("ctx.translate(200,H*.36)", "ctx.translate(200,w43ChinY()+80)", 2)
rep("ctx.fillStyle='rgba(12,6,24,'+(.35*k)+')';ctx.fillRect(0,0,W,H);", "ctx.fillStyle='rgba(12,6,24,'+(.35*k)+')';ctx.fillRect(0,w43ChinY(),W,H);")
rep("ctx.translate(200,150);ctx.rotate(-.06);wildText('YAAAWN", "ctx.translate(200,w43ChinY()+34);ctx.rotate(-.06);wildText('YAAAWN")
rep("""  ctx.fillStyle='rgba(12,6,24,'+(.62*pop)+')';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(200,H*.47);ctx.scale(k,k);ctx.translate(-200,-H*.47);""",
    """  ctx.fillStyle='rgba(12,6,24,'+(.62*pop)+')';ctx.fillRect(0,w43ChinY(),W,H);
  ctx.save();ctx.translate(200,R.card.y+175);ctx.scale(k,k);ctx.translate(-200,-(R.card.y+175));""")
rep("    fanfare() {", src('sounds43.js') + "    fanfare() {")
a = s.index('// Local UAT diagnostics:')
s = s[:a] + ''.join(src(f) for f in ('dance43.js', 'wild43.js', 'music43.js')) + s[a:]
# send43.js overrides diagnostics functions, so it goes after them
b = s.index("diagEvent('session-start');")
s = s[:b] + src('send43.js') + s[b:]
out = p / ('release.html' if len(sys.argv) == 1 else 'preview.html')
out.write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s), '->', out.name)
