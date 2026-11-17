"""CP-58 add-on (Jenny via PM, Nov 17, after UAT 84): the wheel's Yawn eats food only, and milk leaves an empty bottle.
On pinned published UAT 84 (CP-63 Formal inspection, unchanged). Only the CP-58 Yawn changes, plus one line keeping
empty bottles out of Formal inspection's picks (a bottle is never a prize):
1. The Yawn only takes food (cheese, shrimp, tuna, fish biscuit, sardine, egg, milk); toys are never taken. No food in
   reach -> a few top coins, as in UAT 83/84. Eaten food is lost, as before.
2. Milk is drunk (white drips instead of crumbs, the bottle isn't nibbled smaller), then the empty bottle is tossed onto
   the board: a real piece with milk's size and collider; pushed off it clinks and is gone, never a prize, never counted;
   at most 2 on the board. New art img/art/cp58-milk-empty.png (art-src/: milk B with the milk gone).
Usage: python build.py"""
from pathlib import Path
import json,hashlib,shutil
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='804947f1c261415000705f76e0cf33b2a61b76a9bcc73f1fb56134b680fbc682','base is not published UAT 84'
s=s.decode('utf-8')
EDITS=[("const BUILD = '2026.11.17 UAT 84';","const BUILD = '%s';"%v['displayName']),
 # 1. food only
 ("c=[];for(const b of bodies){if(b.dead||b.kind!=='item')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;\n  if(z<GUARD_END-40",
  "c=[];for(const b of bodies){if(b.dead||b.kind!=='item'||!CP58_FOOD.includes(b.id))continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M; // UAT 85: food only\n  if(z<GUARD_END-40"),
 # 2. milk: drunk, not nibbled; white drips; the empty bottle at the gulp
 ("const s=(g.s0+(1.05-g.s0)*k)*(1-.22*g.bites);","const s=(g.s0+(1.05-g.s0)*k)*(g.id==='milk'?1:1-.22*g.bites); /* UAT 85: milk is drunk, not nibbled */"),
 ("c:Math.random()<.5?'#f4c24a':'#e8a060'","c:Y.grabs.every(g=>!g.held||g.id==='milk')?(Math.random()<.5?'#ffffff':'#f1ece0'):Math.random()<.5?'#f4c24a':'#e8a060'"),
 ("for(const g of Y.grabs)if(g.held&&!g.coins)cp58Lost(g);}}","for(const g of Y.grabs)if(g.held&&!g.coins)cp58Lost(g);cp58BottleGulp(Y);}}"),
 # Formal inspection never picks an empty bottle (it isn't a prize)
 ("for(const b of bodies){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;\n  if(z<PUSH_MAX+20||z>T.FRONT-10",
  "for(const b of bodies){if(b.dead||b.kind==='stack'||b.bottle)continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;\n  if(z<PUSH_MAX+20||z>T.FRONT-10")]
for a,b in EDITS:
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
add=(p/'cp58-bottle.js').read_text(encoding='utf-8')
i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'edits':EDITS,'appendedBeforeLastScriptClose':'cp58-bottle.js'},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out)
# the runtime's new art file, beside the game's art for the desktop harness
shutil.copyfile(p/'art-src/cp58-milk-empty.png',p/'art/cp58-milk-empty.png')
print(p/'release.html',hashlib.sha256(out).hexdigest())
