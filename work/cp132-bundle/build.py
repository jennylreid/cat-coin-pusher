"""UAT 132 bundle (folder work/cp132-bundle) = published UAT 131 + build name + the edits below + the blocks listed in blocks.json
appended before the last </script>, in order (mine: pet-follow.js = a, b; chip-132.js = e, f; plus other engineers' blocks and
edits added to blocks.json). g = the edit undoing UAT 130's heart landing. Usage: python setup.py cp132-hug 132, then python build.py"""
from pathlib import Path
import json, hashlib, re
p = Path(__file__).parent; W = p.parent
v = json.loads((p / 'release-version.json').read_text())
base = W / v['base'] / 'release.html'; s = base.read_bytes()
assert hashlib.sha256(s).hexdigest() == v['baseSHA256'], ('base changed', base); s = s.decode('utf-8')
m = re.search(r"const BUILD = '([^']+)';", s)
EDITS = [(m.group(0), "const BUILD = '%s';" % v['displayName']),
 ("const PET_DEFAULTS=Object.freeze({len:9,peak:2.5,grace:1.2}); /* UAT 130: was 3.5 */", "const PET_DEFAULTS=Object.freeze({len:9,peak:3.5,grace:1.2}); /* Nov 20 follow-up: UAT 130's 2.5 reverted */"),
 ("try{if(PET.peak===3.5){PET.peak=2.5;}}catch(e){}", "/* Nov 20 follow-up: UAT 130's move to a 2.5 s peak is reverted */"),
 ("function petDoneRect(){return {x:302,y:PET_HUD_Y-19,w:76,h:38};}", "function petDoneRect(){return {x:302,y:petHudY()-19,w:76,h:38};} /* Nov 20 follow-up: beneath the board */"),
 ("D.fx.push({text:'PEAK PURR!',x:150,y:PET_HUD_Y-36", "D.fx.push({text:'PEAK PURR!',x:150,y:petHudY()-36"),
 ("D.fx.push({text:'grr…',x:200,y:PET_HUD_Y-36", "D.fx.push({text:'grr…',x:200,y:petHudY()-36"),
 ("const D=WILD.petGame,Y=PET_HUD_Y;ctx.save();", "const D=WILD.petGame,Y=petHudY();ctx.save(); /* Nov 20 follow-up */"),
 ((p / 'heart-old.txt').read_bytes().decode('utf-8'), '/* UAT 132: the Ragdoll heart coin lands as in UAT 129 again (UAT 130 front landing undone, Jenny Nov 20) */')]
EDITS += [tuple(e) for e in json.loads((p / 'blocks.json').read_text()).get('edits', [])]
for a, b in EDITS:
    n = s.count(a); assert n == 1, (a[:60], n); s = s.replace(a, b)
SW = json.loads((p / 'blocks.json').read_text()).get('swaps', [])
for o, n in SW:  # another engineer's block replacing one already in the base, byte for byte
    O = (W / o).read_bytes().decode('utf-8'); N = (W / n).read_bytes().decode('utf-8'); k = s.count(O); assert k == 1, (o, k); s = s.replace(O, N)
B = json.loads((p / 'blocks.json').read_text())['blocks']
blk = chr(10).join((W / f).read_bytes().decode('utf-8') for f in B)
i = s.rindex('</script>'); s = s[:i] + '\n' + blk + '\n' + s[i:]
(p / 'edits.json').write_text(json.dumps({'base': str(base), 'edits': EDITS, 'appended': B, 'swapped': SW}, indent=1), encoding='utf-8')
out = s.encode('utf-8'); (p / 'release.html').write_bytes(out)
print(p / 'release.html', len(out), hashlib.sha256(out).hexdigest())
