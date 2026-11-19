"""CP-72 add-ons (Jenny, Nov 18) on pinned published UAT 93 (which has the CP-73 cane fix):
1. "we have a similar problem to formal inspection with the words Zoomies getting in the way of the actual animation. So I'd
   like to have the announcement of what's coming, or the title, and then the animation without words over top of it."
   Big "ZOOMIES!" alone first; Zoomies starts 1.25 s later; no words over it (other callouts wait; no "2x PUSHER").
2. "CP-72 Zoomies: in the final leap toward the player, one kitten poofs again (fur straight out)." The first (ginger)
   kitten's final leap uses the spook jump's puffed look.
Edits below + the block z72-title.js. Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='60e61bdf9b715170f537cd7c3a73838f57ed84d0dd5089bbf886ba71e8bfddb0','base is not published UAT 93'
s=s.decode('utf-8')
EDITS=[("const BUILD = '2026.11.18 UAT 93';","const BUILD = '%s';"%v['displayName']),
 # the tap: the big title alone (the callout's two random draws kept); Zoomies itself starts after the lead
 ("callout(P.name+'!',{color:P.col,dur:1.4});try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}\n z72Start();PGPX={id:'zoomies72',t:0,dur:Z72.dur};};",
  "z72Big(P.name+'!',P.col,cp73Draws());try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}\n PGPX={id:'zoomies72',t:0,dur:Z72T.lead+Z72.dur};}; /* CP-72 add-on: title first */"),
 ("if(was){was.t+=dt;z72Tick(dt);if(was.t>=was.dur&&(Z72X.kits.every(k=>k.gone)||was.t>=was.dur+2))pgpEnd();",
  "if(was){was.t+=dt;if(was.t<Z72T.lead)return __z72PgpTick(0);if(!Z72X){z72Start();dt=was.t-Z72T.lead;}z72Tick(dt);if(was.t>=was.dur&&(Z72X.kits.every(k=>k.gone)||was.t>=was.dur+2))pgpEnd();"),
 # no words over the kittens
 ("if(a>0){ctx.globalAlpha=a;wildText('2× PUSHER',200,w43ChinY()+28,26,'#ffb03a','#3a1400',5);}","/* CP-72 add-on: no \"2× PUSHER\" over the kittens */"),
 # the first kitten poofs in its final leap (the spook jump's puffed look)
 ("grow:1+u*.9,fade:Math.max(0,1-u),dir:1,pose:'leap'})});","grow:1+u*.9,fade:Math.max(0,1-u),dir:1,pose:'leap',puff:k.id===0?Math.min(1,u/.12):0})}); /* CP-72 add-on: poof */")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
add=(p/'z72-title.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'edits':EDITS,'appendedBeforeLastScriptClose':['z72-title.js']},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
