# UAT 38: builds release.html from published UAT 37 (work/cp37/release.html, pinned by hash).
# CP-38 Wild 2 prototype: a second Wild board with the dance payoff, the perfect-dance wheel, the yawn, coin rain from
# above and a visiting cat; background music and a pusher slide sound on every board. Inlines wild2.js (after the
# Wild and Dance break code) and wild2-sounds.js (sfx methods).
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
s = (p.parent / 'cp37/release.html').read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == '41bf5c5e7a657680b349a5ff16c4758a81f77e9ad52ec385c7010fffd24257a9', 'baseline must be UAT 37'
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


def src(name):
    return (p / name).read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N)


rep("const BUILD = '2026.11.12 UAT 37';", "const BUILD = '%s';" % v['displayName'])
rep('    fanfare() {', src('wild2-sounds.js') + '    fanfare() {')
# Wild 2 names
rep("WILD&&WILD.on?'WILD BOARD':", "WILD&&WILD.on?(WILD.v2?'WILD 2':'WILD BOARD'):")
rep("wildText('WILD BOARD',200,R.card.y+44,", "wildText(WILD.v2?'WILD 2':'WILD BOARD',200,R.card.y+44,")
# Wild 2's dance draws its own big bank counter (wild2.js); the banked coins fly into it. The beat lane is unchanged.
rep("if(!fin||D.finT<.3){ctx.globalAlpha=fin?1-D.finT/.3:1;", "if(!WILD.v2&&(!fin||D.finT<.3)){ctx.globalAlpha=fin?1-D.finT/.3:1;")
rep("const fx=200+(136-200)*u,fy=Y+(by-Y)*u-30*Math.sin(u*Math.PI);", "const tx=WILD.v2?200:136,ty=WILD.v2?Y+86:by,fx=200+(tx-200)*u,fy=Y+(ty-Y)*u-30*Math.sin(u*Math.PI);")
# The performance log carries the music and pusher sound dials.
rep("danceTuningDefaults:DANCE_DEFAULTS,", "danceTuningDefaults:DANCE_DEFAULTS,soundTuning:{...W2},")
a = s.index('// Local UAT diagnostics:')
s = s[:a] + src('wild2.js') + s[a:]
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
