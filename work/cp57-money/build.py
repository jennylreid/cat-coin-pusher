# CP-57 Money sounds (Jenny, Nov 16, via PM; a trial for her phone):
# 1. Prizes and coin-rain coins (rain 5/10/25) going over the ledge: a real cash register (5 Pixabay takes, rotating, never
#    the same twice in a row) instead of the ledge bell. ONLY that sound changes: the bell's timing stays exactly (one per
#    piece, at least LEDGE_BELL_GAP apart, 2nd/3rd quieter, 4th+ in a burst skipped, CP51_BELL level), the rest of the
#    frozen pickup is untouched.
#    Bell split: power coins (Quake, music note, fish, laser, heart, mouse) and the Jingle bell prize keep the bell.
#    The bell's code (sfx.pickup('bell')) stays as it is.
# 2. The gold 5 rain coin over the edge: the register (same rotation, same bell-style spacing) instead of the code-made
#    ka-ching. Plain coins that fall in a coin rain keep coin-off (Jenny).
# 3. The Dance break music (danceSchedule's beat: count-in, kick, snare, clap, hats, bass, lead, crash, end chord) +10 dB
#    through its own bus with the UAT 43 soft limiter, so it can't clip. Hits/misses and other sounds unchanged.
# 4. (added, Jenny after UAT 71: "it's coins falling. It should sound like coins falling"; "prizes should plink", coins never)
#    Every code-made coin plink becomes a real coin recording, several takes each, never the same take twice in a row, each set
#    at the loudness of the sound it replaces (work/cp57-money/coins/calibration.json):
#    - a coin/rain coin/gold coin bumping on the pile (C46.hit for every piece except prizes) -> 8 coin-on-coin hits;
#    - a sky/rain coin landing (sfx.wild2('land')) and the rain 'drip' (sfx.wild('drip')) -> 6 coin-onto-pile takes (A and C);
#    - a tower of coins toppling (sfx.wild('topple')) -> 3 coin-spill slices; the Dance payoff pour (sfx.dance('pour')) -> 2.
#    Prizes keep their plink. While the takes are still decoding (the first moments) the old sound plays.
# Usage: python build.py [base release.html] [expected sha256]   (default: the published UAT 73)   Output: release.html
from pathlib import Path
import json, hashlib, base64, sys
p = Path(__file__).parent
BASE = Path(sys.argv[1]) if len(sys.argv) > 1 else p.parent / 'cp73/release.html'
PIN = sys.argv[2] if len(sys.argv) > 2 else '952a9c0574b2ebb0829b0fa2cb99eec3646f1e299c5c11f98ca14a8fcd0ac418'  # UAT 73 (CP-59 fix)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline hash mismatch'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
import re
m = re.search(r"const BUILD = '([^']*)';", s); assert m
s = s.replace(m.group(0), "const BUILD = '%s';" % v['displayName'], 1)
assert '_playBuf(b,v,r){' in s, 'needs CP-54 (UAT 71) helpers'
# sfx: a buffer player with a delay (for the register on the bell's schedule) and the Dance break music bus (+10 dB, limited)
rep("_w2ok(){return !(inBackground||document.hidden)&&ready();},",
    "_w2ok(){return !(inBackground||document.hidden)&&ready();},\n"
    "    // CP-57: play a decoded buffer delay s ahead on the effects master\n"
    "    _playBufAt(b,v,delay=0,r=1){if(!this._w2ok()||!b||!(v>0))return false;const s=ac.createBufferSource(),g=ac.createGain();s.buffer=b;s.playbackRate.value=r;g.gain.value=v;s.connect(g);g.connect(master);s.start(ac.currentTime+Math.max(0,delay));return true;},\n"
    "    // CP-57: the Dance break music bus: x DANCE_MUSIC_GAIN (+10 dB), then the UAT 43 soft limiter (x0.4 -> curve straight up to 0.5,\n"
    "    // rounding off towards 0.65 -> x2.5) into the effects master, so the louder beat can't clip\n"
    "    _dBus(){if(!this.__dbus){const g=ac.createGain(),pre=ac.createGain(),sh=ac.createWaveShaper(),post=ac.createGain(),n=1025,c=new Float32Array(n);\n"
    "      for(let i=0;i<n;i++){const u=i/(n-1)*2-1,a=Math.abs(u);c[i]=Math.sign(u)*(a<=.5?a:.5+.15*Math.tanh((a-.5)/.15));}\n"
    "      sh.curve=c;g.gain.value=DANCE_MUSIC_GAIN;pre.gain.value=.4;post.gain.value=2.5;g.connect(pre);pre.connect(sh);sh.connect(post);post.connect(master);this.__dbus=g;}return this.__dbus;},\n"
    "    danceLoud(kind,vol=1,delay=0,arg=0){if(inBackground||document.hidden||!ready())return;const m=master,b=this._dBus();master=b;try{this.dance(kind,vol,delay,arg);}finally{master=m;}},")
# the Dance break beat goes through the louder bus (every sfx.dance call inside danceSchedule's loop)
i = s.index('function danceSchedule(D){'); j = s.index('\n}', i)
body = s[i:j]; n = body.count("sfx.dance("); assert n >= 10, n
s = s[:i] + body.replace("sfx.dance(", "sfx.danceLoud(") + s[j:]
# the ledge bell's slot plays the register or the bell (bell split); timing unchanged
rep("ledgeBell(); // the collection moment: the prize has just dropped over the ledge",
    "ledgeBell(id); // the collection moment: the prize has just dropped over the ledge (CP-57: the register or the bell, by piece)")
rep("function ledgeBell(){const now=time*1000;", "function ledgeBell(id){const now=time*1000;")
rep("nextLedgeBell=now+wait+LEDGE_BELL_GAP;sfx.pickup('bell',pickupFx.volume*LEDGE_BELL_LEVEL[n]*CP51_BELL,wait/1000);return true;}",
    "nextLedgeBell=now+wait+LEDGE_BELL_GAP;const vol=pickupFx.volume*LEDGE_BELL_LEVEL[n]*CP51_BELL;\n"
    " if(CP57.isMoney(id)&&CP57.register(vol,wait/1000))return true; // CP-57: prizes and coin-rain coins ring the register\n"
    " sfx.pickup('bell',vol,wait/1000);return true;} // power coins and the Jingle bell prize keep the bell (also the fallback while the takes load)")
# the gold 5 rain coin: the register on the same schedule instead of the code-made ka-ching
rep("floats.push({text:'+5',x:p.x,y:p.y-10,t:0,big:true});try{sfx.kaching();}catch(e){}};",
    "floats.push({text:'+5',x:p.x,y:p.y-10,t:0,big:true});try{ledgeBell('gold5');}catch(e){}}; // CP-57: was sfx.kaching()")
takes = [base64.b64encode((p / 'register' / f'reg{k}.mp3').read_bytes()).decode() for k in (1, 2, 3, 4, 6)]
cal = json.loads((p / 'register' / 'calibration.json').read_text())
ccal = json.loads((p / 'coins' / 'calibration.json').read_text())['sets']
CSETS = {'bump': [f'bump{k}' for k in range(1, 9)], 'drop': ['A1', 'A2', 'A3', 'C1', 'C2', 'C3'], 'spill': ['B1', 'B2', 'B3'], 'pour': ['pour1', 'pour2']}
ctakes = {k: [base64.b64encode((p / 'coins' / f'{n}.mp3').read_bytes()).decode() for n in v] for k, v in CSETS.items()}
cgain = {k: ccal[k]['gain'] for k in CSETS}
block = ("\n// ---------- CP-57 (Jenny, Nov 16): money sounds ----------\n"
 "// The register: 5 real cash-register takes (Pixabay Content License; sources in tickets/CP-57.md), trimmed to ~1.0-1.25 s and\n"
 "// evened out, decoded once, played on the effects master at REG_GAIN x the bell's volume (REG_GAIN: the takes' average matches\n"
 "// the bell's loudness, loudest 100 ms above 250 Hz), never the same take twice in a row.\n"
 "// isMoney(id): prizes (anything that isn't a coin kind, except the Jingle bell prize), coin-rain coins and the gold 5.\n"
 "// Power coins (Quake, note, fish, laser, heart, mouse and any other special coin) keep the bell.\n"
 "const DANCE_MUSIC_GAIN=" + str(round(10 ** (10 / 20), 4)) + "; // +10 dB on the Dance break beat (Jenny: \"isn't loud enough\")\n"
 "const CP57=(()=>{const B64=" + json.dumps(takes) + ",REG_GAIN=" + str(cal['REG_GAIN']) + ",MONEY_COINS=['rain5','rain10','rain25','gold5'];\n"
 " const bufs=[];let asked=false,last=-1;const stats={register:0,bell:0,loading:0};\n"
 " function load(){if(asked)return;asked=true;B64.forEach((s,i)=>{try{const b=atob(s),u=new Uint8Array(b.length);for(let k=0;k<b.length;k++)u[k]=b.charCodeAt(k);\n"
 "  if(!sfx._dec(u.buffer,x=>{bufs[i]=x;}))asked=false;}catch(e){asked=false;}});}\n"
 " function isMoney(id){if(MONEY_COINS.includes(id))return true;if(id==='quake'||id==='bell'||!id)return false;return !(typeof RAIN!=='undefined'&&RAIN[id]);}\n"
 " function register(vol,delay=0){load();const n=B64.length;let i=Math.floor(Math.random()*n);if(n>1&&i===last)i=(i+1)%n;\n"
 "  if(!bufs[i]){i=bufs.findIndex((b,k)=>b&&k!==last);if(i<0){stats.loading++;return false;}}last=i;\n"
 "  if(sfx._playBufAt(bufs[i],vol*REG_GAIN,delay)){stats.register++;return true;}return false;}\n"
 " return {isMoney,register,load,stats,bufs};})();\n"
 "// Coins never plink (Jenny): real coin takes for every coin sound that was a code-made plink; prizes keep theirs.\n"
 "const CP57C=(()=>{const B64=" + json.dumps(ctakes) + ",GAIN=" + json.dumps(cgain) + ";\n"
 " const bufs={},last={};let asked=false,lastBump=-9;const stats={};\n"
 " function load(){if(asked)return;asked=true;for(const [set,L] of Object.entries(B64)){bufs[set]=bufs[set]||[];L.forEach((s,i)=>{try{const b=atob(s),u=new Uint8Array(b.length);for(let k=0;k<b.length;k++)u[k]=b.charCodeAt(k);\n"
 "  if(!sfx._dec(u.buffer,x=>{bufs[set][i]=x;}))asked=false;}catch(e){asked=false;}});}}\n"
 " function play(set,vol,delay=0){load();const L=bufs[set]||[],n=B64[set].length;if(!(vol>0))return true;let i=Math.floor(Math.random()*n);if(n>1&&i===last[set])i=(i+1)%n;\n"
 "  if(!L[i]){i=L.findIndex((b,k)=>b&&k!==last[set]);if(i<0)return false;}last[set]=i;\n"
 "  if(sfx._playBufAt(L[i],vol*GAIN[set],delay,.94+Math.random()*.12)){stats[set]=(stats[set]||0)+1;return true;}return false;}\n"
 " function bump(v){const t=sfx._pgT();if(t-lastBump<.035)return true;lastBump=t;return play('bump',Math.min(1,v));}\n"
 " return {play,bump,load,stats,bufs};})();\n"
 "{const h=C46.hit;C46.hit=function(b,v){if(b&&b.kind!=='item'&&v>0){try{if(!S.muted&&CP57C.bump(v))return;}catch(e){}}return h.call(this,b,v);};} // coins: real; prizes: their plink\n"
 "{const pv=()=>typeof pickupFx==='object'?pickupFx.volume:1;\n"
 " const w=sfx.wild;sfx.wild=function(kind,vol=1,...a){if(!S.muted&&(kind==='drip'||kind==='topple')){try{if(CP57C.play(kind==='drip'?'drop':'spill',(kind==='drip'?.875:1)*vol*pv()))return;}catch(e){}}return w.call(this,kind,vol,...a);};\n"
 " const w2=sfx.wild2;sfx.wild2=function(kind,vol=1,...a){if(!S.muted&&kind==='land'){try{if(CP57C.play('drop',vol*pv()))return;}catch(e){}}return w2.call(this,kind,vol,...a);};\n"
 " const dn=sfx.dance;sfx.dance=function(kind,vol=1,delay=0,...a){if(!S.muted&&kind==='pour'){try{if(CP57C.play('pour',vol*pv(),delay))return;}catch(e){}}return dn.call(this,kind,vol,delay,...a);};}\n"
 "{const __cp57Update=update;update=function(dt){__cp57Update(dt);if(!S.muted)try{CP57.load();CP57C.load();}catch(e){}};} // decode the takes early\n")
rep("return {coin,filler,stats,bufs,load};})();\n", "return {coin,filler,stats,bufs,load};})();\n" + block)
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
