"""CP-71 (Jenny, Nov 17: "Yawn: never eats coins. No food in reach = the mitt knocks a few top coins behind the table,
no chewing. Go, next UAT."). UAT 90 on pinned published UAT 89. Food in reach: unchanged. No food in reach: the mitt
rummages on the top coins it picked (same pick as before), then flicks them back over the rear edge; no carry to the
mouth, no chewing, no eating face; the Yawn ends early. Edits below + the block cp71-knock.js.
Also CP-73 (Jenny, Nov 17: "move 'FORMAL INSPECTION!' up out of the beam's path, smaller and brief. Add to UAT 90."):
Formal inspection's three words show small and brief in the band above the cat's head (block cp73-words.js).
Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='9f0ebf0383d6626f4a7fcdfc03477af4d9218b832358aade21888df79536fe69','base is not published UAT 89'
s=s.decode('utf-8')
EDITS=[("const BUILD = '2026.11.17 UAT 89';","const BUILD = '%s';"%v['displayName']),
 # at the hit: coins are never taken into the mitt; the mitt rummages, then knocks them (cp71Knock)
 ("if(g.b.dead){g.missed=true;return;}g.held=true;","if(g.b.dead){g.missed=true;return;}if(g.coins){if(!g.rummage)cp71Rummage(g);return;} /* CP-71: never eats coins */g.held=true;"),
 # the mitt for a coin grab: rummage and flick back to rest instead of carrying to the mouth
 ("if(!P&&t<T0.home){const fl=","if(!P&&g.coins&&t>=T0.hit)P=cp71Mitt(g,side,t,T0,C,R); /* CP-71 */\n   if(!P&&t<T0.home){const fl="),
 # no eating face on a coin run
 ("t>CP58.eat&&t<CP58.end-.15","t>CP58.eat&&t<CP58.end-.15&&!(Y.grabs[0]&&Y.grabs[0].coins)"),
 # a coin run ends early, once the coins are gone
 ("if(t>=CP58.end){W2_YAWN=null;","if(t>=(Y.knockEnd||CP58.end)){W2_YAWN=null;"),
 # CP-73: Formal inspection's words in the band above the head, small and brief (cp73Say)
 ("callout(P.name+'!',{color:P.col,dur:1.4});try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}\n cp63Start();",
  "cp73Say(P.name+'!',P.col,CP73.dur.intro);try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}\n cp63Start();"),
 ("callout(CP63.words[0],{color:'#ffe27a',dur:1});","cp73Say(CP63.words[0],'#ffe27a',CP73.dur.hmm);"),
 ("callout(CP63.words[1],{color:'#ffe27a',dur:1.1});","cp73Say(CP63.words[1],'#ffe27a',CP73.dur.splendid);")]
for a,b in EDITS:
    n=s.count(a);assert n==(4 if a.startswith('t>CP58.eat') else 1),(a[:60],n);s=s.replace(a,b)
add=(p/'cp71-knock.js').read_text(encoding='utf-8')+(p/'cp73-words.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'edits':EDITS,'appendedBeforeLastScriptClose':['cp71-knock.js','cp73-words.js']},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
