"""CP-73 rework (Jenny, Nov 18, on UAT 91: "CP-73 rework: big 'FORMAL INSPECTION!' first, action starts only after it's
gone; drop 'HMM.'; big 'SPLENDID.' after the sweep. UAT 92."). UAT 92 on pinned published UAT 91.
Formal inspection opens with the big centred "FORMAL INSPECTION!" (as in UAT 84-89); the monocle, beam, highlights, cane and
sweep start 1.25 s later, after it has gone (same timeline as before, shifted). "HMM." is dropped (its random draws kept).
"SPLENDID." shows big once the sweep has finished. Picks, art and sounds unchanged. Edits below + the block cp73-rework.js.
Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
s=(W/v['base']/'release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='9ea4cef276468b6c66c4339d9147d5e0cbbd6f98753d8703ba5920824ac1137b','base is not published UAT 91'
s=s.decode('utf-8')
EDITS=[("const BUILD = '2026.11.18 UAT 91';","const BUILD = '%s';"%v['displayName']),
 # the tap: the big words alone; the pieces are picked now, as before; the power lasts until SPLENDID. has gone
 ("cp73Say(P.name+'!',P.col,CP73.dur.intro);try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}\n cp63Start();PGPX={id:'inspect',t:0,dur:CP63.end};",
  "cp73Big(P.name+'!',P.col,CP73B.intro,0,cp73Draws());try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}\n cp63Start();PGPX={id:'inspect',t:0,dur:cp73Total()};"),
 # the action's own clock starts once the words have gone
 ("if(was)cp63Tick(was.t);};","if(was&&was.t>=CP73B.lead)cp63Tick(was.t-CP73B.lead);}; /* CP-73 rework */"),
 # the monocle's clink moves with the monocle (it played at the tap)
 ("pgSfx('clink',1);try{diagEvent('powers','cp63 inspect '","try{diagEvent('powers','cp63 inspect '"),
 ("function cp63Tick(t){const X=CP63X;if(!X)return;X.t=t;happyUntil=0;const fx=X.fx;",
  "function cp63Tick(t){const X=CP63X;if(!X)return;X.t=t;happyUntil=0;const fx=X.fx;if(!fx.go){fx.go=1;pgSfx('clink',1);}"),
 # HMM. dropped (its two random draws kept)
 ("if(t>=CP63.look0&&!fx.hmm){fx.hmm=1;cp73Say(CP63.words[0],'#ffe27a',CP73.dur.hmm);}",
  "if(t>=CP63.look0&&!fx.hmm){fx.hmm=1;cp73Draws(); /* CP-73 rework: HMM. dropped */}"),
 # SPLENDID.: draws at the same point as before; shown big once the sweep has finished
 ("if(t>=CP63.sweep0+.5&&!fx.word){fx.word=1;if(X.picks.length)cp73Say(CP63.words[1],'#ffe27a',CP73.dur.splendid);}",
  "if(t>=CP63.sweep0+.5&&!fx.word){fx.word=1;if(X.picks.length)CP73B.pend=cp73Draws();}\n if(t>=CP73B.splAt&&CP73B.pend&&!fx.spl){fx.spl=1;cp73Big(CP63.words[1],'#ffe27a',CP73B.splDur,PGPX.t,CP73B.pend);CP73B.pend=null;}")]
# Power text (Jenny, Nov 18: "the cat's screen still says that the tuxedo power is yawn"): the Tuxedo's power is named
# Formal inspection everywhere; the cat picker shows each power's one-line description (CP73D, in cp73-rework.js)
EDITS+=[("const PGL_CATINFO={tuxedo:{game:'Dance break',power:'Yawn'}","const PGL_CATINFO={tuxedo:{game:'Dance break',power:'Formal inspection'}"),
 ("ctx.fillText(open?C.name:'???',r.x+94,r.y+20,170);","ctx.fillText(open?C.name:'???',r.x+94,r.y+(open?15:20),170);"),
 ("if(open){ctx.fillText(I.game+' · power: '+I.power,r.x+94,r.y+42,250);ctx.fillText('Prizes:',r.x+94,r.y+63);const px=r.x+94+ctx.measureText('Prizes: ').width;C.own.forEach((id,i)=>pgPrizeIcon(id,px+14+i*30,r.y+60,24));",
  "if(open){ctx.fillText(I.game+' · power: '+I.power,r.x+94,r.y+33,250);ctx.font='italic 11px system-ui';ctx.fillStyle='#cbb8ee';ctx.fillText(CP73D[r.c]||'',r.x+94,r.y+49,250);ctx.font='12px system-ui';ctx.fillStyle='#e8dcff';ctx.fillText('Prizes:',r.x+94,r.y+67);const px=r.x+94+ctx.measureText('Prizes: ').width;C.own.forEach((id,i)=>pgPrizeIcon(id,px+14+i*30,r.y+65,22));"),
 ("ctx.fillText(I.power+' ×'+pw,r.x+r.w-14,r.y+63);","ctx.fillText(I.power+' ×'+pw,r.x+r.w-14,r.y+67);"),
 ("ctx.fillText(pglCatLine(M2.cat)+' · Cats, between rounds',200,y+100);","ctx.fillText(pglCatLine(M2.cat)+' · Cats, between rounds',200,y+100,384);")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
add=(p/'cp73-rework.js').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'edits.json').write_text(json.dumps({'edits':EDITS,'appendedBeforeLastScriptClose':['cp73-rework.js']},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
