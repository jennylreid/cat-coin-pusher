"""One-off: turns this folder's D-only setup.py and checks86m-body.js into D, E, F (PM, Nov 19)."""
from pathlib import Path
p=Path(__file__).parent
s=(p/'setup.py').read_text(encoding='utf-8')
i=s.index("# CP-86 mitts D (Jenny");j=s.index("for a,b in EDITS:",i)
s=s[:i]+'''# CP-86 mitts D, E, F (Jenny, Nov 19: "another option where the mitts come out and in front of the face, a little bit like the
# pose after a board is won"; "What if they start at dancing pose and then move up to yawn pose as the animation? So when the
# eyes open, by the time the eyes open, the mitts are above the head... and vice versa"). D: the Dancing pose's place and turn
# (the centre of its bob: cp58Rest + 12 inward, 30 up, no turn of its own). E: Dancing pose, then travels up to Above the head
# between 3.0 s and the eyes opening (3.75 s); F: the reverse. All drawn in front of the head (as the Dancing pose and the Yawn
# are), so the layer changes only on the face's own switch frames. Above the head (default), B and C unchanged.
EDITS+=[("CHOICES=['head','B','C'],NAMES={head:'Above the head',B:'B: forward and out',C:'C: pointing forward'};",
  "CHOICES=['head','B','C','D','E','F'],NAMES={head:'Above the head',B:'B: forward and out',C:'C: pointing forward',D:'D: Dancing pose',E:'E: Dancing, then above the head',F:'F: Above the head, then Dancing'}; /* CP-86 mitts D E F */"),
 ("POSE:{head:{dx:48,dy:-185,a:.43},B:{dx:13,dy:163.4,a:.35},C:{dx:-85,dy:203.4,a:-.35}}",
  "POSE:{head:{dx:48,dy:-185,a:.43},B:{dx:13,dy:163.4,a:.35},C:{dx:-85,dy:203.4,a:-.35},D:{dx:-12,dy:-30,a:-.12},E:{seq:['D','head']},F:{seq:['head','D']}},swap:[3,3.75] /* CP-86 mitts D E F: E and F travel from the first pose to the second between swap[0] and swap[1] s (the eyes open at 3.75 s) */"),
 ("function cp86MTarget(side){const P=CP86M.POSE[cp86MPick()]||CP86M.POSE.head,R=cp58Rest(side);",
  "function cp86MTarget(side){let P=CP86M.POSE[cp86MPick()]||CP86M.POSE.head;if(P.seq){const A=CP86M.POSE[P.seq[0]],B=CP86M.POSE[P.seq[1]],t=PGPX?PGPX.t:0,k=cp58Ease((t-CP86M.swap[0])/(CP86M.swap[1]-CP86M.swap[0]));P={dx:A.dx+(B.dx-A.dx)*k,dy:A.dy+(B.dy-A.dy)*k,a:A.a+(B.a-A.a)*k};}const R=cp58Rest(side); /* CP-86 mitts D E F */"),
 ("function cp86MOnTop(){return cp86K()>0&&cp86MPick()==='head'&&",
  "function cp86MOnTop(){return cp86K()>0&&cp86MPick()!=='B'&&cp86MPick()!=='C' /* CP-86 mitts D E F: in front of the head for Above the head, D, E, F */&&")]
'''+s[j:]
s=s.replace("+ 3 CP-86 mitts D edits (everything else unchanged)","+ 4 CP-86 mitts D E F edits (everything else unchanged)").replace("(choice D)","(choices D, E, F)")
(p/'setup.py').write_text(s,encoding='utf-8')

b=(p/'checks86m-body.js').read_text(encoding='utf-8')
R=[("3 marked CP-86 mitts D edits (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===4&&E.edits.slice(1).every(e=>/CP-86 mitts D/.test(e[1]))",
    "4 marked CP-86 mitts D E F edits (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===5&&E.edits.slice(1).every(e=>/CP-86 mitts D E F/.test(e[1]))"),
   ("for(const pick of ['head','B','C','D'])for(const fps of [60,30])","for(const pick of ['head','B','C','D','E','F'])for(const fps of [60,30])"),
   ("(pick==='head'||pick==='D'?onTop>0:onTop===0)","(pick==='B'||pick==='C'?onTop===0:onTop>0)"),
   ("check('1 each option (above the head, B, C, D)","check('1 each option (above the head, B, C, D, E, F)"),
   ("drawn after the head only for above the head and D, only while","drawn after the head for all but B and C, only while"),
   ("let same=true,face=true,prev=null,maxStep=0,","let tStep=0,prevT=null,same=true,face=true,prev=null,maxStep=0,"),
   ("     if(prev)maxStep=Math.max(maxStep,...pa.map((p,k)=>dist(p,prev[k])));prev=pa;",
    "     const Tn=J(A.g,TARGET);if(prevT)tStep=Math.max(tStep,...Tn.map((p,k)=>dist(p,prevT[k])));prevT=Tn;T=Tn;\n     if(prev)maxStep=Math.max(maxStep,...pa.map((p,k)=>dist(p,prev[k])));prev=pa;"),
   ("stepLimit:+(2.5*D/fps*1.2+9).toFixed(2)","stepLimit:+(Math.max(2.5*D/fps*1.2,tStep*1.3)+9).toFixed(2),tStep:+tStep.toFixed(2)"),
   ("for(const [w,h] of [[412,915],[360,640]])for(const pick of ['head','B','C','D']){","for(const [w,h] of [[412,915],[360,640]])for(const pick of ['head','B','C','D','E','F']){"),
   ("pick:pick==='D'?'head':pick});","pick:'DEF'.includes(pick)?'head':pick});"),
   ("(pick==='D'?r.edgeMax<=16:r.edgeMax===0)&&(pick==='D'?r.actionChanged>0:r.actionChanged===0)","('DEF'.includes(pick)?r.edgeMax<=16:r.edgeMax===0)&&('DEF'.includes(pick)?r.actionChanged>0:r.actionChanged===0)"),
   ("D is identical to UAT 114 outside the meow","D, E and F are identical to UAT 114 outside the meow"),
]
for a,c in R:
    assert b.count(a)==1,a[:70];b=b.replace(a,c)
a=" // 3. the pick is read when a meow starts"
assert b.count(a)==1
b=b.replace(a,(p/'check2b.js').read_text(encoding='utf-8')+a,1)
(p/'checks86m-body.js').write_text(b,encoding='utf-8')
print('ok')
