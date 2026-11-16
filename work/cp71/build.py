# CP-54 phase B (UAT 71; Jenny, Nov 16, via PM): the coin landing goes back to the recording.
# - Board: every landing of your coin plays coin-land.mp3 exactly as UAT 59 did (recordedSfx 'land': volume .25, cut .84 s,
#   cooldown .09 s, pool 3, the shared 6-recording cap). The 4 code-made CP-46 drop-on-pile sounds are out of the landing.
# - Filler: when the recording can't play (the 6-recording cap, its cooldown, or not loaded yet), one of 3 real
#   coin-on-pile takes (CP-54 candidate A, voicebosch) plays instead through Web Audio, so a landing is never silent.
#   Nothing code-made. Muted or in the background: nothing, as before.
# - Title screen: the word drop-in and the pile-up play the same (recording, A as filler) instead of the steelAt clink, at
#   the title's relative volume (.35 x v against the board's .8). The title has its own cooldown on a real clock,
#   because game time stands still on the title.
# Not touched: pickup sounds, bell, pusher, music, spills, cascades, clinks, mouth drop and every other sound.
# On the published UAT 70 (work/cp70/release.html, pinned by hash). Usage: python build.py   Output: release.html
from pathlib import Path
import json, hashlib, base64
p = Path(__file__).parent
BASE = p.parent / 'cp70/release.html'
PIN = '8cf3e466bb221d5481ad958380d924e767f9687d549dab0cd09c19135757c91f'  # UAT 70 release.html (publication-manifest)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be the published UAT 70'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("const BUILD = '2026.11.16 UAT 70';", "const BUILD = '%s';" % v['displayName'])
# sfx: decode and play a buffer on the effects master (for the filler takes)
rep("_pgSteel(t,v,p,st){steelAt(t,v,p,st);},",
    "_pgSteel(t,v,p,st){steelAt(t,v,p,st);},"
    "_dec(ab,cb){if(!ready())return false;try{const r=ac.decodeAudioData(ab,cb,()=>{});if(r&&r.catch)r.catch(()=>{});}catch(e){return false;}return true;},"
    "_playBuf(b,v,r){if(!this._w2ok()||!b||!(v>0))return false;const s=ac.createBufferSource(),g=ac.createGain();s.buffer=b;s.playbackRate.value=r||1;g.gain.value=v;s.connect(g);g.connect(master);s.start();return true;},")
# recordedSfx: play() that says what happened. Board: identical checks and order to play() (UAT 59's landing).
rep(" function edge(){edges=",
    " // CP-54: like play(), but returns what happened: 'played', 'cooldown', 'cap', 'unloaded' or 'off' (muted/background).\n"
    " // realClock (the title): its own cooldown on performance.now(), because game time stands still on the title.\n"
    " const lastReal={};\n"
    " function playWhy(name,scale=1,realClock=false){\n"
    "  if(S.muted||inBackground||document.visibilityState!=='visible')return 'off';\n"
    "  const d=definitions[name],list=pools[name];if(!d)return 'unloaded';\n"
    "  const now=realClock?performance.now()/1000:time,L=realClock?lastReal:last;if(now-(L[name]??-Infinity)<d.cooldown)return 'cooldown';\n"
    "  if(!list.some(a=>a._ready||a.readyState>=2))return 'unloaded';\n"
    "  if(Object.values(pools).flat().filter(a=>!a.paused).length>=6)return 'cap';\n"
    "  let a=list.find(a=>a.paused&&(a._ready||a.readyState>=2))||list[(cursor[name]++)%list.length];\n"
    "  if(!(a._ready||a.readyState>=2))return 'unloaded';\n"
    "  a.pause();a.currentTime=0;a.volume=Math.min(1,d.volume*scale*(!realClock&&board.status==='won'?.35:1));L[name]=now;\n"
    "  try{const p=a.play();if(p&&p.catch)p.catch(()=>{a._ready=false;});return 'played';}catch(e){a._ready=false;return 'unloaded';}\n"
    " }\n"
    " function edge(){edges=")
rep(" return {play,edge,reset,stopAll,duck};", " return {play,playWhy,edge,reset,stopAll,duck};")
# the board landing: the recording every time, A as filler (was: 1 of 5, the recording or a CP-46 drop on pile)
rep("play('pile',1,()=>sfx.land());", "CP54.coin(1,false);")
# the title clink (word drop-in and pile-up): the same, at the title's relative volume
rep("else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}",
    "else if(kind==='coin'){CP54.coin(.35*v/.8,true);}")
takes = [base64.b64encode((p / 'filler' / f'A{i}.mp3').read_bytes()).decode() for i in (1, 2, 3)]
A_GAIN = 1.385  # A's loudest take peaks at 0.55 out (matching the recording's loudness would clip); ~6 dB under the recording
block = ("\n// ---------- CP-54 (UAT 71; Jenny, Nov 16): the coin landing is the recording again, with real filler ----------\n"
 "// coin(scale, title): coin-land.mp3 through recordedSfx exactly as UAT 59; if it can't play (6-recording cap, cooldown,\n"
 "// not loaded), one of 3 real coin-on-pile takes (voicebosch, Pixabay; CP-54 candidate A) on the effects master, pitch +-6%,\n"
 "// never the same take twice in a row. Nothing code-made. Off (muted/background) plays nothing.\n"
 "const CP54=(()=>{const B64=" + json.dumps(takes) + ",A_GAIN=" + str(A_GAIN) + ";\n"
 " const bufs=[];let asked=false,lastI=-1;const stats={coins:0,E:0,A:0,silent:0,why:{}};\n"
 " function load(){if(asked)return;asked=true;B64.forEach((s,i)=>{try{const b=atob(s),u=new Uint8Array(b.length);for(let k=0;k<b.length;k++)u[k]=b.charCodeAt(k);\n"
 "  if(!sfx._dec(u.buffer,x=>{bufs[i]=x;}))asked=false;}catch(e){asked=false;}});}\n"
 " function filler(vol){load();const n=B64.length;let i=Math.floor(Math.random()*n);if(n>1&&i===lastI)i=(i+1)%n;if(!bufs[i]){i=bufs.findIndex((b,k)=>b&&k!==lastI);if(i<0)return false;}\n"
 "  lastI=i;return sfx._playBuf(bufs[i],vol*A_GAIN,.94+Math.random()*.12);}\n"
 " function coin(scale=1,title=false){load();stats.coins++;const why=recordedSfx.playWhy('land',scale,title);stats.why[why]=(stats.why[why]||0)+1;\n"
 "  if(why==='played'){stats.E++;return true;}if(why==='off')return false;\n"
 "  if(filler(scale*(!title&&board.status==='won'?.35:1))){stats.A++;return true;}stats.silent++;return false;}\n"
 " return {coin,filler,stats,bufs,load};})();\n")
rep("update=function(dt){__c46Update(dt);try{C46.drain();}catch(e){}};",
    "update=function(dt){__c46Update(dt);try{C46.drain();}catch(e){}};" + block)
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
