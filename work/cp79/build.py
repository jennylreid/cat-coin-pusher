"""CP-58 step 2 (Jenny, Nov 16: "CP-58: the round yawn (3) with Runway eyes is approved. Build it into UAT."), on pinned
published UAT 78. The prize wheel's YAWN slices (both wheels) play the CP-58 Yawn: big yawn with Runway's round-yawn face
(attempt1-2), stretch and shiver, side-eye, a mitt drapes down and grabs up to 2 prizes (nearest the front, goal prizes
first), eats them with Runway's squinting eyes, and each stolen goal prize drops back through the bonus drop. It never
touches coins. The Tuxedo's YAWN power keeps CP-61's limited sweep (unchanged).
The CP-58 code is the approved prototype (work/cp58-yawn/cp58-yawn.js + runway/runway-face.js, as in
tickets/CP-58-evidence/runway/yawn-runway-3.mp4) with only these edits, all asserted below:
- w2StartYawn is left as CP-61's; the prototype's start becomes cp58StartYawn, called only by the wheel;
- w2YawnTick hands a non-CP-58 Yawn (the power) to CP-61's tick (the prototype ignored it);
- the wheel waits for a running power Yawn to end before starting its own; powers can't be used during the CP-58 Yawn
  (so nothing can cut it short while a prize is in the mitt);
- the art paths point at the two new runtime files img/art/cp58-yawn-face.webp (lossless, pixel-identical to
  yawn-face-3.png) and img/art/cp58-yawn-eyes.png.
Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent
s=(W/'cp78/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='b224550f20855e7b37d346bfe6984fcf0a98ac0d45d253e3373179ccc7734c0d','base is not published UAT 78'
s=s.decode('utf-8');v=json.loads((p/'release-version.json').read_text())
y=(W/'cp58-yawn/cp58-yawn.js').read_text(encoding='utf-8');r=(W/'cp58-yawn/runway/runway-face.js').read_text(encoding='utf-8')
assert hashlib.sha256((W/'cp58-yawn/cp58-yawn.js').read_bytes()).hexdigest()=='a76df43bb27064a92d887aacd314e7854feb2ffbccb9e57d8134d0f222236444','prototype changed'
assert hashlib.sha256((W/'cp58-yawn/runway/runway-face.js').read_bytes()).hexdigest()=='f920512530b7855c7b693159e3c9932317a41cacffea006606ab2b3cafbdcb79','runway face changed'
YEDITS=[("// ---------- CP-58 PROTOTYPE (Jenny, Nov 16): the Yawn, stretch, side-eye and grab ----------",
  "// ---------- CP-58 (Jenny, Nov 16; UAT 79): the wheel's Yawn: yawn, stretch, side-eye, grab and eat ----------"),
 ("w2StartYawn=function(){","function cp58StartYawn(){ // the wheel's YAWN slices only; the Tuxedo's power keeps CP-61's w2StartYawn"),
 ("w2YawnTick=function(dt){\n const Y=W2_YAWN;if(!Y)return;if(!Y.cp58){return;}",
  "const __cp61YawnTick=w2YawnTick;\nw2YawnTick=function(dt){\n const Y=W2_YAWN;if(!Y)return;if(!Y.cp58)return __cp61YawnTick(dt);"),
 ("// ---------- end CP-58 prototype ----------",""),
 # a prize that goes into the tray (or is otherwise gone) before the mitt reaches it: the mitt grabs air, nothing is stolen
 # (the prototype read the prize's place after it was gone and stopped the Yawn with an error on a busy board)
 ("held:false,gone:false,bites:0});","held:false,gone:false,bites:0});cp58PrizeScreen(grabs[grabs.length-1]);"),
 ("if(t>=T0.hit&&!g.held){g.held=true;cp58PrizeScreen(g);g.s0=g.at.s;if(!g.b.dead)removeCoin(g.b);",
  "if(t>=T0.hit&&!g.held&&!g.missed){if(g.b.dead){g.missed=true;return;}g.held=true;cp58PrizeScreen(g);g.s0=g.at.s;removeCoin(g.b);"),
 ("if(Y.grabs.length){sfx.wild2('catch',1);","if(Y.grabs.some(g=>g.held)){sfx.wild2('catch',1);"),
 ("if(Y.grabs.length){pgSfx('plop',1);","if(Y.grabs.some(g=>g.held)){pgSfx('plop',1);")]
for a,b in YEDITS:
    assert y.count(a)==1,a;y=y.replace(a,b)
REDITS=[("(typeof __loadImage==='function'?__loadImage(src)","(typeof __loadImage==='function'?Promise.resolve().then(()=>__loadImage(src))")] # desktop renderer only: errors stay in the promise
for a,b in REDITS:
    assert r.count(a)==1,a;r=r.replace(a,b)
ADD=(y+"\nconst CP58_RUNWAY_SRC='img/art/cp58-yawn-face.webp',CP58_RUNWAY_EYES_SRC='img/art/cp58-yawn-eyes.png';\n"+r+
 "// No power while the CP-58 Yawn plays (a power Yawn would cut it short with a prize still in the mitt).\n"
 "const __cp58PgpReady=pgpReady;pgpReady=function(){return __cp58PgpReady()&&!(W2_YAWN&&W2_YAWN.cp58);};\n"
 "// ---------- end CP-58 ----------\n")
EDITS=[("const BUILD = '2026.11.16 UAT 78';","const BUILD = '%s';"%v['displayName']),
 ("if(D.stage==='yawn'){if(!D.yawnStarted){D.yawnStarted=true;w2StartYawn();}if(!W2_YAWN)w2Next(D,'done');return;}",
  "if(D.stage==='yawn'){if(!D.yawnStarted){if(W2_YAWN&&!W2_YAWN.cp58)return;D.yawnStarted=true;cp58StartYawn();}if(!W2_YAWN)w2Next(D,'done');return;} // CP-58: the wheel's Yawn")]
for a,b in EDITS:
    assert s.count(a)==1,a;s=s.replace(a,b)
i=s.rindex('</script>');s=s[:i]+ADD+s[i:]
out=s.encode('utf-8');(p/'release.html').write_bytes(out);(p/'edits.json').write_text(json.dumps(EDITS));(p/'proto-edits.json').write_text(json.dumps({'cp58-yawn.js':YEDITS,'runway-face.js':REDITS},indent=1));(p/'cp58-added.js').write_text(ADD,encoding='utf-8',newline='')
print(p/'release.html',hashlib.sha256(out).hexdigest())
