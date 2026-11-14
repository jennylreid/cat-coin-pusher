# UAT 50: builds release.html from UAT 48's source (work/cp48/release.html, pinned by hash) plus the CP-45 module
# (progress50.js). UAT 49 was the same recipe with progress49.js; UAT 50 is the CP-45 rework (Jenny, Nov 14): a CatCoin
# title screen, then the coin board is home (Kitchen, Porch, Album, Shop and Boards are buttons on the board). Usage: python build.py [other baseline release.html -> preview.html]
from pathlib import Path
import json, hashlib, sys, re
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
BASE = Path(sys.argv[1]) if len(sys.argv) > 1 else p.parent / 'cp48/release.html'
PIN = json.loads((p.parent / 'cp48/publication-manifest.json').read_text())['releaseHTMLSHA256']  # published UAT 48
s = BASE.read_text(encoding='utf-8', newline='')
if len(sys.argv) == 1: assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be UAT 48'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
old_build = re.findall(r"const BUILD = '[^']*';", s); assert len(old_build) == 1
rep(old_build[0], "const BUILD = '%s';" % v['displayName'])
# the round's prize list changes length (5-7), so the collection and its size become variables
rep("const WILD_COLLECTION=['cheese','shrimp','tuna','yarn','duck','mouse','bell'],WILD_GOAL=WILD_COLLECTION.length,",
    "var WILD_COLLECTION=['cheese','shrimp','tuna','yarn','duck','mouse','bell'];var WILD_GOAL=WILD_COLLECTION.length;const ")
# Wild's prefill puts the round's list on its seven prize spots
rep("const prizes=[['tuna',200,625],['cheese',108,595],['shrimp',292,600],['yarn',90,500],['duck',310,505],['mouse',96,670],['bell',304,672]];",
    "const prizes=pgRoundPrizes([['tuna',200,625],['cheese',108,595],['shrimp',292,600],['yarn',90,500],['duck',310,505],['mouse',96,670],['bell',304,672]]);")
# end card: stars and rewards in place of the stats lines
a = "   ctx.font='14px system-ui';ctx.fillStyle='#f0e0ff';ctx.fillText(WILD.win?wildClock()+' to spare'"
i = s.index(a); j = s.index("R.card.y+160);", i) + len("R.card.y+160);")
rep(s[i:j], "   if(!pgEndText(R)){" + s[i:j].strip() + "}")
# the star prize no longer brings a visitor: its card line stays the stars line (the old line only with Home off)
rep("if(WILD.star){const V=W2_VISITORS[W43_STAR_TREATS[WILD.star]];W2_CARD_LINES[3]=", "if(WILD.star&&(PG_HOME_OFF||!PG)){const V=W2_VISITORS[W43_STAR_TREATS[WILD.star]];W2_CARD_LINES[3]=", 2)
# the goal card's lower button is gone (the board is home); the end card's lower button shows the next goal card
rep(" uiRound(L.back.x,L.back.y,L.back.w,L.back.h,14,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Back to the game',200,L.back.y+L.back.h/2+1);",
    " if(PG_HOME_OFF||!PG){uiRound(L.back.x,L.back.y,L.back.w,L.back.h,14,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Back to the game',200,L.back.y+L.back.h/2+1);}")
rep("const L=w2CardLayout();if(contains(L.back,p)){wildExit();return true;}", "const L=w2CardLayout();if((PG_HOME_OFF||!PG)&&contains(L.back,p)){wildExit();return true;}")
rep("fillText('Back to the game'", "fillText(pgBackText()", 4)
# sound helpers for the new screens (the audio clock, the struck bell and the steel clink)
rep("    _w2ok(){return !(inBackground||document.hidden)&&ready();},",
    "    _w2ok(){return !(inBackground||document.hidden)&&ready();},\n    _pgT(){return ac.currentTime;},_pgBell(t,f,v,d){bell(t,f,v,d);},_pgSteel(t,v,p,st){steelAt(t,v,p,st);},")
# the board's pupils and resting mitts measure the original pictures (a cat's recoloured copy is smaller)
rep("const sx=420/ART.head.width,sy=240/ART.head.height;", "const sx=420/(ART.head.pgW||ART.head.width),sy=240/(ART.head.pgH||ART.head.height);")
rep("c.width=ART.paw.width;c.height=ART.paw.height;const g=c.getContext('2d');g.drawImage(ART.paw,0,0);",
    "const __pp=(PG_ORIG&&PG_ORIG.paw)||ART.paw;c.width=__pp.width;c.height=__pp.height;const g=c.getContext('2d');g.drawImage(__pp,0,0);")
rep("const h=w*ART.paw.height/ART.paw.width,sx=w/ART.paw.width,sy=h/ART.paw.height;",
    "const __pp=(PG_ORIG&&PG_ORIG.paw)||ART.paw,h=w*__pp.height/__pp.width,sx=w/__pp.width,sy=h/__pp.height;")
anchor = "Promise.all([RAPIER.init(), loadArt()])"
rep(anchor, (p / 'progress50.js').read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N) + N + anchor)
out = p / ('release.html' if len(sys.argv) == 1 else 'preview.html')
out.write_text(s, encoding='utf-8', newline=''); print(out, hashlib.sha256(s.encode('utf-8')).hexdigest())
