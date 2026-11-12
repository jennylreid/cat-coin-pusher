# UAT 45 (CP-41 Treat toss on Wild 2): builds release.html from a pinned base by adding toss45.js (the side game) and
# toss-sounds.js (sfx.toss). Wild 2 only; everything else passes straight through.
# Prototype base: UAT 42 (work/cp42/release.html). For publication the base becomes UAT 44 (set BASE below).
from pathlib import Path
import json, hashlib, sys
p = Path(__file__).parent
BASES = {'uat42': ('cp42/release.html', '0' * 64)}
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


rep("const BUILD = '%s';" % old_build, "const BUILD = '%s';" % v['displayName'])
rep('    fanfare() {', (p / 'toss-sounds.js').read_text(encoding='utf-8').replace('\n', N) + '    fanfare() {')
a = s.index('// Local UAT diagnostics:')
s = s[:a] + (p / 'toss45.js').read_text(encoding='utf-8').replace('\n', N) + s[a:]
rep("danceTuning:{...DANCE},", "danceTuning:{...DANCE},tossTuning:{...TOSS},tossTuningDefaults:TOSS_DEFAULTS,tossLog:TOSS_LOG,pantry:{...PANTRY},")
rep("PICKUP_FX_DEFAULTS, PICKUP_FX_ORDER, ", "PICKUP_FX_DEFAULTS, PICKUP_FX_ORDER, TOSS, tossStartNow, tossTap, tossPos, get TOSS_LOG(){return TOSS_LOG;}, get PANTRY(){return PANTRY;}, ")
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], 'on', base, h[:12], len(s))
