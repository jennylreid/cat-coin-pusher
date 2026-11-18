"""CP-62: selected paintings and stable per-object A/B/C colours on pinned UAT 79.
Only art loading/rendering and art metadata change; gameplay and pickup motion/audio stay identical."""
from pathlib import Path
import json,hashlib,shutil
p=Path(__file__).parent;r=p.parents[1]
s=(p.parent/'cp79/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='6858c05ed7a6d7bc28687673d16e79355289aa9bc682676430ca24a3b0a3772a'
s=s.decode();v=json.loads((p/'release-version.json').read_text())
old="const BUILD = '2026.11.16 UAT 79';"
assert s.count(old)==1;s=s.replace(old,"const BUILD = '%s';"%v['displayName'])
anchor="async function image(src) { const im = new Image(); im.src = src; await im.decode(); return im; }"
assert s.count(anchor)==1
code="\n // CP-62: preload approved 128px prize canvases into the existing shared art cache.\n"
(p/'art').mkdir(exist_ok=True)
for id,option in [('milk','b'),('mouse','a'),('bell','a'),('bowtie','a'),('notes','c'),('yarn','a')]:
    name=f'cp62-{id}.png'
    shutil.copyfile(r/f'tickets/CP-62-evidence/{id}-{option}.png',p/'art'/name)
    code+=f" WILD_ART['{id}']=await image('img/art/{name}');WILD_ART['{id}'].pgl=1;\n"
for id,ticket in [('notes','62'),('yarn','62'),('cushion','52')]:
    for option in 'abc':
        name=f'cp62-{id}-{option}.png'
        shutil.copyfile(r/f'tickets/CP-{ticket}-evidence/{id}-{option}.png',p/'art'/name)
        code+=f" CP62_ART['{id}']=CP62_ART['{id}']||[];CP62_ART['{id}'].push(await image('img/art/{name}'));\n"
s=s.replace(anchor,anchor+code)
edits=[
 ("drawPrize(b.kind, b.id, c.x, c.y, c.s);","cp62DrawPrize(b.kind, b.id, c.x, c.y, c.s,b);"),
 ("drawPrize(f.kind, f.id, f.x, f.y, f.s);","cp62DrawPrize(f.kind, f.id, f.x, f.y, f.s,f);"),
 ("drawPrize('item',f.id,0,prizeCenterLift(f.id,q.s),q.s);","cp62DrawPrize('item',f.id,0,prizeCenterLift(f.id,q.s),q.s,f);"),
 ("drawPrize('item',f.id,f.x,f.y+prizeCenterLift(f.id,sc)+e*6*f.s,sc);","cp62DrawPrize('item',f.id,f.x,f.y+prizeCenterLift(f.id,sc)+e*6*f.s,sc,f);"),
 ("drawPrize('item',g.id,0,0,s);","cp62DrawPrize('item',g.id,0,0,s,g.b);")]
for a,b in edits:
    assert s.count(a)==1,a
    s=s.replace(a,b)
(p/'edits.json').write_text(json.dumps(edits,indent=2))
i=s.rindex('</script>');s=s[:i]+(p/'colours.js').read_text(encoding='utf-8')+'\n'+s[i:]
(p/'release.html').write_bytes(s.encode())
print(hashlib.sha256(s.encode()).hexdigest())


