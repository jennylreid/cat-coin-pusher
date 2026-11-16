# CP-49 (UAT 65): clean Home screen. On the published UAT 64 (work/cp63/release.html, pinned by hash), the Home screen
# (layout A main screen) loses the coin pyramid under PLAY, and its PLAY button is drawn at 2/3 size around the same
# centre (same style; tap area shrinks with it). Layout B's PLAY, the title screen and everything else unchanged.
# Usage: python build.py   Output: release.html
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
BASE = p.parent / 'cp63/release.html'
PIN = '230a9d7ee2b5259820cfe09678f0854524f6228970a4bc27585c66482238987d'  # UAT 64 release.html (publication-manifest)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be the published UAT 64'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("const BUILD = '2026.11.15 UAT 64';", "const BUILD = '%s';" % v['displayName'])
# 1. No coin pyramid: the pile functions and their one draw call go (nothing else was placed from them).
rep("function pgMainPile(rows=3){if(PGA.pile&&PGA.pile.rows===rows)return PGA.pile;const a=[];[[5,0],[3,1],[1,2]].slice(0,rows).forEach(([n,row])=>{for(let i=0;i<n;i++)a.push({x:200+(i-(n-1)/2)*62,y:-row*44,r:27});});a.rows=rows;return PGA.pile=a;}",
    "// CP-49 (Jenny, Nov 16): the coin pyramid under PLAY is removed; that area is clean background.")
rep("function pgMainPileRows(R){const room=(R.bot-28)-(R.play+78+12)-27;return Math.max(1,Math.min(3,Math.floor(room/44)+1));}" + N, "")
rep(" const py=R.bot-28;for(const c of pgMainPile(pgMainPileRows(R))){const hs=csp.half*c.r/COIN_R;ctx.drawImage(csp.cv,c.x-hs,py+c.y-hs,2*hs,2*hs);}" + N, "")
rep("// the coin rain (the board's own coin, as on the title) and a pile of coins under PLAY", "// the coin rain (the board's own coin, as on the title)")
# 2. PLAY at 2/3 size, same centre and style (244x78 -> about 163x52 game units, about 52 dp or more on a phone).
rep("PGA.L=pgCentre(R.name,t);PGA.L.play=pgPlayButton(R.play,t);",
    "PGA.L=pgCentre(R.name,t);PGA.L.play=pgMainPlay(R.play,t);")
rep("function pgDrawMain(dt){",
    "// CP-49: the Home screen's PLAY, drawn by pgPlayButton scaled to 2/3 about its centre; returns the scaled tap area" + N
    + "const PG_MAIN_PLAY=2/3;" + N
    + "function pgMainPlay(y,t){const k=PG_MAIN_PLAY,cy=y+39;ctx.save();ctx.translate(200,cy);ctx.scale(k,k);ctx.translate(-200,-cy);const r=pgPlayButton(y,t);ctx.restore();" + N
    + " return {x:200-r.w*k/2,y:cy-r.h*k/2,w:r.w*k,h:r.h*k};}" + N
    + "function pgDrawMain(dt){")
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
