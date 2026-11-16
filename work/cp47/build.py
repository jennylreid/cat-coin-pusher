# UAT 47 (CP-43 Pet the cat, the Cozy mode): builds release.html from a pinned base by adding pet47.js (the mode and
# side game) and pet-sounds.js (sfx.pet, sfx.purr), and a few one-line hooks: the head drawing (ear flicks, whisker
# twitch, head lean, closed eyes), the pointer move/up handlers (strokes), the Cozy title, and the performance log.
# Prototype base: UAT 45 proto (work/cp45/release.html, on UAT 42; it has CP-41's mode registry, so Cozy is a mode in
# the MODES picker; on a base without the registry Cozy gets its own button and the title/label patches apply). For publication the base is published UAT 46.
from pathlib import Path
import json, hashlib, sys
p = Path(__file__).parent
BASES = {'uat45proto': ('cp45/release.html', None), 'uat46': ('cp47/base-uat46.html', None)}
v = json.loads((p / 'release-version.json').read_text())
base = v.get('base', 'uat45proto')
src, pin = BASES[base]
pin = v.get('pin', pin)
s = (p.parent / src).read_text(encoding='utf-8', newline='')
h = hashlib.sha256(s.encode('utf-8')).hexdigest()
assert not pin or h == pin, ('base changed', base, h)
old_build = s[s.index("const BUILD = '") + 15:].split("'")[0]
N = '\r\n' if '\r\n' in s else '\n'


def rep(old, new, count=1, optional=False):
    global s
    if optional and old not in s:
        print('skip (base already has mode names):', old[:60]); return
    assert s.count(old) == count, (old[:90], s.count(old))
    s = s.replace(old, new)


rep("const BUILD = '%s';" % old_build, "const BUILD = '%s';" % v['displayName'])
rep('    fanfare() {', (p / 'pet-sounds.js').read_text(encoding='utf-8').replace('\n', N) + '    fanfare() {')
a = s.index('// Local UAT diagnostics:')
s = s[:a] + (p / 'pet47.js').read_text(encoding='utf-8').replace('\n', N) + s[a:]
# the head: lean, shiver and hiss jolt; ear and whisker transforms; closed eyes from the approved Happy features
rep("if(isRestPose()&&pawDance){const g=pawGaze(),d=pawMotion();ctx.translate(200+d.x,110+d.y+(g?g.y*19:0));ctx.rotate(d.r+(g?-g.x*.048:0));ctx.translate(-200,-110);}",
    "if(isRestPose()&&pawDance){const g=pawGaze(),d=pawMotion();ctx.translate(200+d.x,110+d.y+(g?g.y*19:0));ctx.rotate(d.r+(g?-g.x*.048:0));ctx.translate(-200,-110);}petHeadXf();")
rep(" else ctx.drawImage(head,-10,-25,420,240);", " else petDrawHead(head);")
rep("drawTrackingPupils();if(tk&&tk.squint>0){ctx.save();ctx.globalAlpha=tk.squint;drawHappyFeatures();ctx.restore();}",
    "drawTrackingPupils();const __sq=Math.max(tk?tk.squint:0,petSquint());if(__sq>0){ctx.save();ctx.globalAlpha=__sq;drawHappyFeatures();ctx.restore();}")
# strokes: pointer moves and lifts go to the side game first while it's on
rep("cv.addEventListener('pointermove',e=>{", "cv.addEventListener('pointermove',e=>{if(petPointerMove(e))return;")
rep("cv.addEventListener(ev,e=>{", "cv.addEventListener(ev,e=>{petPointerUp(e);")
# the Cozy name on the goal card and the board label
rep("wildText('WILD 2',200,R.y+40,46,'#a6ff6a','#10301a',8);", "wildText(WILD.pet?'COZY':'WILD 2',200,R.y+40,46,WILD.pet?'#ff8ac8':'#a6ff6a',WILD.pet?'#3a0b2a':'#10301a',8);", optional=True)
# the win/lose card title (and, on a base without modes, the board label): COZY in Cozy, unchanged elsewhere
rep("WILD.v2?'WILD 2':'WILD BOARD'", "WILD.v2?(petMode()?'COZY':'WILD 2'):'WILD BOARD'", s.count("WILD.v2?'WILD 2':'WILD BOARD'"))
rep("danceTuning:{...DANCE},", "danceTuning:{...DANCE},petTuning:{...PET},petTuningDefaults:PET_DEFAULTS,petLog:PET_LOG,")
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], 'on', base, h[:12], len(s))
