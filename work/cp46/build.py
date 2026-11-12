# UAT 46 (CP-42 Laser mode with Laser chase): builds release.html from a pinned base by adding laser46.js (the mode and
# its side game) and laser-sounds.js (sfx.laser), plus small hooks: pointer move/up for the drag, the head leaning
# toward the dot, the HUD label, no happy meter in Laser mode, and the performance log. Wild, Wild 2, Boards 1-3 unchanged.
# Prototype base: UAT 42 (work/cp42/release.html). For publication the base is UAT 45 (set "base" in release-version.json).
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
# 'published' = index.html inside the published UAT JSON (uat/CatCoinPusher-UAT-game.json), pinned by "pin" (its sha256).
BASES = {'uat42': 'cp42/release.html', 'uat45proto': 'cp45/release.html', 'uat45': 'cp45/release.html', 'published': None}
v = json.loads((p / 'release-version.json').read_text())
base = v.get('base', 'uat42')
pin = v.get('pin')
if base == 'published':
    import base64
    s = base64.b64decode(json.loads((p.parents[1] / 'uat/CatCoinPusher-UAT-game.json').read_text(encoding='utf-8'))['files']['index.html']).decode('utf-8')
else:
    s = (p.parent / BASES[base]).read_text(encoding='utf-8', newline='')
h = hashlib.sha256(s.encode('utf-8')).hexdigest()
assert pin is None or h == pin, ('base changed', base, h)
assert base not in ('published', 'uat45') or pin, 'a publication build must pin its base'
old_build = s[s.index("const BUILD = '") + 15:].split("'")[0]
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


rep("const BUILD = '%s';" % old_build, "const BUILD = '%s';" % v['displayName'])
rep('    fanfare() {', (p / 'laser-sounds.js').read_text(encoding='utf-8').replace('\n', N) + '    fanfare() {')
a = s.index('// Local UAT diagnostics:')
s = s[:a] + (p / 'laser46.js').read_text(encoding='utf-8').replace('\n', N) + s[a:]
rep("danceTuning:{...DANCE},", "danceTuning:{...DANCE},laserTuning:{...LASER},laserTuningDefaults:LASER_DEFAULTS,laserLog:LASER_LOG,")
# the drag: pointer move and up reach the chase first
rep("cv.addEventListener('pointermove',e=>{if(inventoryOpen){", "cv.addEventListener('pointermove',e=>{if(typeof laserPointerMove==='function'&&laserPointerMove(e))return;if(inventoryOpen){")
rep("cv.addEventListener(ev,e=>{if(collectionDrag?.pointer===e.pointerId)", "cv.addEventListener(ev,e=>{if(typeof laserPointerUp==='function')laserPointerUp(e);if(collectionDrag?.pointer===e.pointerId)")
# the head leans toward the dot (transform only)
rep("ctx.translate(0,down);const tk=isRestPose()?tickleState():null;",
    "ctx.translate(0,down);{const lh=typeof laserHead==='function'?laserHead():null;if(lh){ctx.translate(200+lh.x,110+lh.y);ctx.rotate(lh.r);ctx.translate(-200,-110);}}const tk=isRestPose()?tickleState():null;")
if 'function registerWildMode(' not in s:
    # no CP-41 mode registry (UAT 42 prototype): the HUD label and the hidden happy meter are hooked here; with the
    # registry, the mode's name and wildFeature('dance') already do both
    rep("(WILD.v2?'WILD 2':'WILD BOARD')", "(WILD.laser?'LASER':WILD.v2?'WILD 2':'WILD BOARD')")
    rep("drawWildHud=function(hud){" + N + " __danceHud(hud);" + N, "drawWildHud=function(hud){" + N + " __danceHud(hud);if(WILD.laser)return;" + N)
if 'function paw40On(){' in s:
    # CP-40 Paw save: off while a chase runs (the mitts are busy chasing and every touch moves the dot)
    rep("function paw40On(){return !!(WILD&&WILD.on&&WILD.v2&&", "function paw40On(){return !!(WILD&&WILD.on&&WILD.v2&&!WILD.chase&&")
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], 'on', base, h[:12], len(s))
