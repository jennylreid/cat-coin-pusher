# CP-47 Levels and cats: builds release.html from a published UAT release (UAT 60, pinned by hash once published) plus
# levels47.js (levels, cats as characters, unlocks off levels) inserted after the CP-45 module, and a few text swaps in it.
# Usage: python build.py                -> release.html from ../cp60/release.html (must match the pin)
#        python build.py BASE.html OUT  -> any baseline (e.g. the UAT 59 copy while prototyping) to OUT
from pathlib import Path
import json, hashlib, sys, re
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
BASE = Path(sys.argv[1]) if len(sys.argv) > 1 else p.parent / 'cp60/release.html'
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else p / 'release.html'
s = BASE.read_text(encoding='utf-8', newline='')
if len(sys.argv) == 1:
    pin = (p / 'base-pin.txt').read_text().strip()
    assert hashlib.sha256(s.encode('utf-8')).hexdigest() == pin, 'baseline must be the pinned UAT 60'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
old_build = re.findall(r"const BUILD = '[^']*';", s); assert len(old_build) == 1
rep(old_build[0], "const BUILD = '%s';" % v['displayName'])
# the PLAY screen's goal line names the level ("Crammed: collect these 6")
rep("ctx.fillText('Collect these '+WILD_GOAL,200,y+72);", "ctx.fillText(pglGoalText(),200,y+72,300);")
# Level means the board level only (rule 12): recipes open after a level, not at an XP level
rep("'A new recipe at level '+r.level", "'A new recipe after Level '+r.level", 2)
# the end card's big button: NEXT LEVEL after a first pass, TRY AGAIN after a loss
rep("wildButtonDraw(R.again,'PLAY AGAIN'", "wildButtonDraw(R.again,pglAgainText()")
# a cat coin makes the cat playable (cats are characters, not boards)
rep("+\"'S BOARD\"", "")
rep("'IS OPEN!'", "'JOINS YOU!'")
rep("PG_CAT[M2.cat].board+(PG.level>=PG_SWITCH_LEVEL?' · pick it from Boards, up top':' · it plays from the next round')", "pglCatLine(M2.cat)+' · Cats, between rounds'")
rep("' · only here: '", "' · its prizes: '")
rep('Give all cat coins (open every board)', 'Give all cat coins (every cat playable)')
# no XP any more
rep("+row('xp','XP speed',PG_DEV.xp+'×')", "")
rep("Gameplay map (CP-45)</span><span>level '+(PG?PG.level:1)+'</span></h3>'", "Gameplay map (CP-45, CP-47)</span><span>Level '+(PG&&PG.lv?PG.lv.sel:1)+'</span></h3>'")
if v.get('powers'):
    # Sonic meow: the pusher's stroke times pglReach() (1 except during a Sonic meow, so every other frame is unchanged)
    rep("pusherY = PUSH_MIN + (PUSH_MAX - PUSH_MIN) * stroke;", "pusherY = PUSH_MIN + (PUSH_MAX - PUSH_MIN) * stroke * (typeof pglReach==='function'?pglReach():1);")
# UAT 62 (Jenny, Nov 14): the hiss in Pet the cat reads longer: the Sharp Grin face held about twice as long (1.1 s -> 2.2 s),
# the head's jolt eased out over 2 s instead of 1 (same quick start). Nothing else in Pet the cat changes.
rep("if(D.hissT>=0&&D.hissT<1.1)return ART.headWild||img;", "if(D.hissT>=0&&D.hissT<2.2)return ART.headWild||img;")
rep("if(D.hissT>=0&&D.hissT<1){const u=D.hissT;", "if(D.hissT>=0&&D.hissT<2){const u=D.hissT<.6?D.hissT:.6+(D.hissT-.6)*.4/1.4;")
anchor = "Promise.all([RAPIER.init(), loadArt()])"
mods = ['levels47.js'] + (['powers47.js'] if (p / 'powers47.js').exists() and v.get('powers') else [])
code = N.join((p / m).read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N) for m in mods)
rep(anchor, code + N + anchor)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
