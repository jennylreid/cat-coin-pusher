"""One-off: turns cp115's setup.py (copied here) into UAT 116's: E final, quick return, the Developer choice removed."""
from pathlib import Path
p=Path(__file__).parent
s=(p/'setup.py').read_text(encoding='utf-8')
i=s.index("# CP-86 mitts D, E, F (Jenny");j=s.index("for a,b in EDITS:",i)
s=s[:i]+'''# CP-86 mitts final (Jenny, Nov 19: "I agree with E, but I want an adjustment. I want the [paws] to stay above the head a little
# bit longer with no fade back to home, just quickly back to home."; PM: E the default, the Developer choice removed). E is the
# only behaviour (any saved choice gives E); the mitts hold above the head until 0.2 s before the face switches back, then go
# back to rest in a quick 0.2 s eased move (was 0.6 s), reaching rest as the face switches; the "Sonic meow mitts" choice is
# no longer shown in Settings. The other poses' numbers stay in the code, unused (E is made of D and Above the head).
EDITS+=[("let pick='head';try{const v=localStorage.getItem(KEY);if(CHOICES.includes(v))pick=v;}catch(e){}",
  "let pick='E';try{const v=localStorage.getItem(KEY);if(CHOICES.includes(v))pick=v;}catch(e){} /* CP-86 mitts final: E */"),
 ("CHOICES=['head','B','C','D','E','F'],",
  "CHOICES=['E'], /* CP-86 mitts final: Jenny picked E */"),
 ("up:.6,down:.6,",
  "up:.6,down:.2, /* CP-86 mitts final: a quick 0.2 s return, after a longer hold */"),
 ("if(!S.dev||!eng||eng.querySelector('#cp86-mitts'))return r;",
  "if(CP86M.CHOICES.length<2||!S.dev||!eng||eng.querySelector('#cp86-mitts'))return r; /* CP-86 mitts final: no choice to show */")]
'''+s[j:]
s=s.replace("+ 4 CP-86 mitts D E F edits (everything else unchanged)","+ 4 CP-86 mitts final edits (everything else unchanged)").replace("(choices D, E, F)","(E final: quick return, choice removed)")
assert "mitts final edits" in s
(p/'setup.py').write_text(s,encoding='utf-8')
st=(p/'stage.py').read_text(encoding='utf-8')
R=[("# CP-86 Sonic meow mitts D UAT 115 staging (from work/cp86-mitts/stage.py)","# CP-86 Sonic meow mitts final UAT 116 staging (from work/cp115/stage.py)"),
   ("glob('checks*-on115.json')","glob('checks*-on116.json')"),
   ("NEED=['checks86m.json','checks64-on115.json','checks88-on115.json','checks112-on115.json']","NEED=['checks86m.json','checks64-on116.json','checks88-on116.json','checks112-on116.json']"),
   ("for f in ['real-%s-%s.json'%(o,z) for o in ('head','B','C','D','E','F') for z in ('412x915','360x640')]+['real-panel.json']:","for f in ['real-E-%s.json'%z for z in ('412x915','360x640')]+['real-panel.json']:"),
   ("assert pn['before']=='head' and pn['after']['pick']=='B' and pn['after']['saved']=='B' and len(pn['found'])==6,'Developer choice check failed'",
    "assert pn['before']=='E' and pn['found'] is None,'the Developer choice is still shown, or E is not the pick'")]
for a,b in R:
    assert st.count(a)==1,a;st=st.replace(a,b)
k=st.index("'authorization':f\"");m=st.index("\"}",k)+1
st=st[:k]+"""'authorization':f"UAT {uat}: CP-86 mitts final, E with a longer hold and a quick return, the choice removed (PM, Nov 19, Jenny's words: \\"I agree with E, but I want an adjustment... just quickly back to home.\\"; PM: \\"Change for UAT 116, on UAT 115\\"); UAT only\""""+st[m:]
(p/'stage.py').write_text(st,encoding='utf-8')
print('ok')
