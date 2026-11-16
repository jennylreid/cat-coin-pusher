from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];h=(p.parent/'water/release.html').read_text(encoding='utf-8')
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==(p.parent/'water/release.html').read_bytes()
def rep(a,b):
 global h
 assert a in h,a
 h=h.replace(a,b)
rep("const BUILD = '2026.10.29 UAT 1';","const BUILD = '2026.10.29 UAT 2';")
rep("future:['sardine','crab','clam','kelp']","future:['sardine','crab','clam','kelp','seahorse']")
rep("['kelp',.12,.64,.18,.19]", "['kelp',.12,.64,.18,.19],['seahorse',.73,.42,.18,.16]")
rep(" if(id==='clam')", """ if(id==='seahorse'){
 ctx.moveTo(9,-28);ctx.bezierCurveTo(6,-44,-17,-39,-18,-26);ctx.lineTo(-31,-20);ctx.lineTo(-31,-12);ctx.lineTo(-17,-14);
 ctx.bezierCurveTo(-16,-3,-5,0,-8,8);ctx.bezierCurveTo(-23,27,-2,43,13,31);ctx.bezierCurveTo(24,21,8,12,4,23);ctx.bezierCurveTo(3,28,11,29,13,25);
 ctx.bezierCurveTo(7,18,0,18,6,7);ctx.bezierCurveTo(17,-7,17,-15,9,-28);ctx.closePath();
 ctx.moveTo(13,-16);ctx.lineTo(24,-4);ctx.lineTo(13,5);ctx.moveTo(-11,-26);ctx.lineTo(-8,-26);
 }
 else if(id==='clam')""")
(p/'draft.html').write_text(h,encoding='utf-8');print('Built seahorse future outline')
