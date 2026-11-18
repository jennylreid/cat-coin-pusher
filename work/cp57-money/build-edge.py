# CP-57 follow-up (Jenny, Nov 16: "there's no sound when coins fall over the ledge"): every plain coin going over the front
# edge is heard, with real recordings only. Applies on top of any build that already has CP-57 (UAT 74, or a later UAT built
# on it). Not touched: prizes, gold and power coins over the edge (they don't come through here), and every other sound.
# - Each plain coin (coin/silver) over the front edge: a real "coin into the tray" take through Web Audio (6 takes; tray1 is the
#   real coin hit inside coin-off.mp3, which the game stopped at 0.85 s, just before that hit, so it was ~37 dB down).
# - 3+ coins within 0.35 s add a coin-spill bed (CP-57's coin-spill slices), 10+ within 1 s a longer pour bed (CP-57's pours).
# - Inside a group the per-coin takes are softer (0.45-0.8), varied (rotating takes, pitch +-6%), jittered by up to 40 ms and
#   at most one per 50 ms, so a spill clatters into the tray rather than machine-gunning identical hits.
# - Levels: 8 dB under the coin landing (coin-land.mp3 at 0.25), tray and beds alike (coins/calibration.json). The game's own
#   coin-off level is 18 dB under the landing, too faint for Jenny.
# - The CP-46 code-made spills and cascades and the HTMLAudio coin-off/spill no longer play for plain coins over the edge
#   (frees recording slots for the coin landing). While the takes are still decoding, the old path plays.
# Usage: python build-edge.py <base release.html with CP-57> <its sha256> [out]   Output: release-edge.html (or out)
from pathlib import Path
import json, hashlib, base64, sys
p = Path(__file__).parent
BASE = Path(sys.argv[1]); PIN = sys.argv[2]; OUT = Path(sys.argv[3]) if len(sys.argv) > 3 else p / 'release-edge.html'
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline hash mismatch'
assert 'const CP57C=' in s and 'const CP57E=' not in s, 'base must have CP-57 and not this patch yet'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
import re
m = re.search(r"const BUILD = '([^']*)';", s); assert m
s = s.replace(m.group(0), "const BUILD = '%s';" % v['displayName'], 1)
cal = json.loads((p / 'coins' / 'calibration.json').read_text())['sets']
tray = [base64.b64encode((p / 'coins' / f'tray{k}.mp3').read_bytes()).decode() for k in range(1, 7)]
G = {'tray': cal['tray']['gain'], 'spill': cal['spillBed']['gain'], 'pour': cal['pourBed']['gain']}
block = ("// ---------- CP-57 follow-up (Jenny, Nov 16): every plain coin over the ledge is heard, real recordings only ----------\n"
 "// A real coin into the tray for each coin; 3+ in 0.35 s add a coin-spill bed, 10+ in 1 s a pour bed (CP-57's takes); inside a\n"
 "// group the per-coin takes are softer, varied, jittered (<=40 ms) and at most one per 50 ms, so a spill clatters.\n"
 "const CP57E=(()=>{const B64=" + json.dumps(tray) + ",G=" + json.dumps(G) + ";\n"
 " const bufs=[];let asked=false,last=-1,lastBed={},edges=[],block=-9,cascadeBlock=-9,lastCoin=-9;const stats={coins:0,take:0,spill:0,cascade:0,thinned:0,fallback:0};\n"
 " function load(){if(asked)return;asked=true;B64.forEach((s,i)=>{try{const b=atob(s),u=new Uint8Array(b.length);for(let k=0;k<b.length;k++)u[k]=b.charCodeAt(k);\n"
 "  if(!sfx._dec(u.buffer,x=>{bufs[i]=x;}))asked=false;}catch(e){asked=false;}});}\n"
 " function pick(L,key){const n=L.length;let i=Math.floor(Math.random()*n);if(n>1&&i===lastBed[key])i=(i+1)%n;if(!L[i]){i=L.findIndex((b,k)=>b&&k!==lastBed[key]);if(i<0)return null;}lastBed[key]=i;return L[i];}\n"
 " function bed(kind){const b=pick((CP57C.bufs[kind]||[]),kind);return !!b&&sfx._playBufAt(b,G[kind],0,.94+Math.random()*.12);}\n"
 " function coin(vol,delay){load();const n=B64.length;let i=Math.floor(Math.random()*n);if(n>1&&i===last)i=(i+1)%n;if(!bufs[i]){i=bufs.findIndex((b,k)=>b&&k!==last);if(i<0)return false;}last=i;\n"
 "  return sfx._playBufAt(bufs[i],vol*G.tray,delay,.94+Math.random()*.12);}\n"
 " function edge(b){const now=time;edges=edges.filter(t=>now-t<1&&t<=now);edges.push(now);stats.coins++;\n"
 "  if(edges.length>=10&&now>=cascadeBlock){if(bed('pour'))stats.cascade++;block=cascadeBlock=now+1.6;}\n"
 "  else if(now>=block&&edges.filter(t=>now-t<.35).length>=3){if(bed('spill'))stats.spill++;block=now+.6;}\n"
 "  const group=now<block;if(group&&now-lastCoin<.05&&now>=lastCoin){stats.thinned++;return true;}\n"
 "  if(coin(group?.45+Math.random()*.35:.85+Math.random()*.15,group?Math.random()*.04:0)){lastCoin=now;stats.take++;return true;}stats.fallback++;return false;}\n"
 " return {edge,load,stats,bufs};})();\n"
 "{const ce=C46.edge;C46.edge=function(b){if(b&&(b.kind==='coin'||b.kind==='silver')&&!S.muted){try{if(CP57E.edge(b))return;}catch(e){}}return ce.call(this,b);};}\n"
 "{const __cp57eUpdate=update;update=function(dt){__cp57eUpdate(dt);if(!S.muted)try{CP57E.load();}catch(e){}};}\n")
anchor = "// decode the takes early\n"
assert s.count(anchor) == 1
s = s.replace(anchor, anchor + block, 1)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
