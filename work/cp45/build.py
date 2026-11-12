# UAT 45 (CP-41): builds release.html from a pinned base. Adds game modes (modes45.js: registry, MODES picker, goal-card
# hooks), the Treat toss side game (toss45.js, toss-sounds.js) and the Treat toss mode (mode-treats45.js).
# Wild 1, Wild 2 and Boards 1-3 are unchanged.
# Base: published UAT 44 (work/cp44/release.html, pinned by hash). (Prototyped on UAT 42.)
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
BASES = {'uat44': ('cp44/release.html', '0048b96e965fcf545bdb56ed7cbe6875b040ca0515a2d393409c0968c46a9d81')}
v = json.loads((p / 'release-version.json').read_text())
base = v.get('base', 'uat42')
src, pin = BASES[base]
s = (p.parent / src).read_text(encoding='utf-8', newline='')
h = hashlib.sha256(s.encode('utf-8')).hexdigest()
assert pin == '0' * 64 or h == pin, ('base changed', base, h)
old_build = s[s.index("const BUILD = '") + 15:].split("'")[0]
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


def mod(name):
    return (p / name).read_text(encoding='utf-8').replace('\n', N)


rep("const BUILD = '%s';" % old_build, "const BUILD = '%s';" % v['displayName'])
rep('    fanfare() {', mod('toss-sounds.js') + '    fanfare() {')
# Mode hooks inside existing code: each gives Wild 1 / Wild 2's own value when no mode is on, so they play as before.
rep("function danceFill(n,x){", "function danceFill(n,x){if(!wildFeature('dance'))return; // CP-41: modes without the Dance break")
rep("if(!wildMissing().length&&((WILD.noteN===0", "if(wildFeature('dance')&&!wildMissing().length&&((WILD.noteN===0")
rep("drawWildHud=function(hud){" + N + " __danceHud(hud);" + N, "drawWildHud=function(hud){" + N + " __danceHud(hud);if(!wildFeature('dance'))return;" + N)
rep("(WILD.v2?'WILD 2':'WILD BOARD')", "(WILD.v2?wildModeName():'WILD BOARD')")
# the goal card (UAT 43's compact card, the last drawWild2Card): the mode's name, colours and lines
rep(" wildPanel(R,'#4b1f6e','#1d0f33');" + N + " wildText('WILD 2',200,R.y+28,36,'#a6ff6a','#10301a',7);",
    " wildPanel(R,...wildModePanel());" + N + " wildText(wildModeName(),200,R.y+28,36,wildModeColor(0),wildModeColor(1),7);")
rep("const [ic,a,b]=W2_CARD_LINES[i],", "const [ic,a,b]=wildCardLines()[i],")
a = s.index('// Local UAT diagnostics:')
s = s[:a] + mod('modes45.js') + mod('toss45.js') + mod('mode-treats45.js') + s[a:]
rep("danceTuning:{...DANCE},", "danceTuning:{...DANCE},tossTuning:{...TOSS},tossTuningDefaults:TOSS_DEFAULTS,tossLog:TOSS_LOG,pantry:{...PANTRY},")
rep("PICKUP_FX_DEFAULTS, PICKUP_FX_ORDER, ", "PICKUP_FX_DEFAULTS, PICKUP_FX_ORDER, TOSS, tossStartNow, tossTap, tossPos, wildModeEnter, modesButton, modesPickerRects, get MODES_UI(){return MODES_UI;}, get TOSS_LOG(){return TOSS_LOG;}, get PANTRY(){return PANTRY;}, ")
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], 'on', base, h[:12], len(s))
