"""One-off: turns cp116's setup.py/stage/run scripts (copied here) into UAT 118's: the held beat (cp86-beat.js) + one edit."""
from pathlib import Path
import re
p=Path(__file__).parent
s=(p/'setup.py').read_text(encoding='utf-8')
i=s.index("# CP-86 mitts final (Jenny");j=s.index("for a,b in EDITS:",i)
s=s[:i]+'''# CP-86 held beat (Jenny, Nov 19: "the sound wave should stop, and then there should be a beat where the cat's still in the
# sonic meow pose, and then the cat comes out of the pose."): the block cp86-beat.js, and one edit in the CP-86 update hook
# so floating texts keep waiting through the pose's tail as they wait for the power.
EDITS+=[("for(const f of floats)if(!PGPX)f.cp86seen=1;",
  "for(const f of floats)if(!PGPX&&!CP86T)f.cp86seen=1; /* CP-86 held beat: texts wait through the tail */")]
'''+s[j:]
R=[("ADD=['cp86-final.js']","ADD=['cp86-beat.js']"),
   ("+ 4 CP-86 mitts final edits + cp86-final.js (everything else unchanged)","+ 1 CP-86 held beat edit + cp86-beat.js (everything else unchanged)"),
   ("'cp86-final.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} /* CP-86 mitts final: + this build's edits and block */",
    "'cp86-beat.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} /* CP-86 held beat: + this build's edits and block */"),
   ("mine=('edits.json','release.html','release-version.json','cp86-final.js')","mine=('edits.json','release.html','release-version.json','cp86-beat.js')"),
   ("'editmittsfinal'","'editbeat'")]
for a,b in R:
    assert s.count(a)==1,a;s=s.replace(a,b)
s=s.replace("(E final: quick return, choice removed)","(the held beat)")
(p/'setup.py').write_text(s,encoding='utf-8')
for f in ('run-pre.sh','run-post.sh'):
    t=(p/f).read_text(encoding='utf-8').replace('on116','on118').replace('UAT 116','UAT 118').replace('CP-86 mitts E final','CP-86 held beat')
    (p/f).write_text(t,encoding='utf-8')
v=(p/'verify-cloud.py').read_text(encoding='utf-8').replace('work/cp116','work/cp118').replace('cp116verify','cp118verify');(p/'verify-cloud.py').write_text(v,encoding='utf-8')
m=(p/'mittshot.cjs').read_text(encoding='utf-8').replace('/work/cp116/mittshot.html','/work/cp118/mittshot.html');(p/'mittshot.cjs').write_text(m,encoding='utf-8')
st=(p/'stage.py').read_text(encoding='utf-8')
R=[("# CP-86 Sonic meow mitts final UAT 116 staging (from work/cp115/stage.py)","# CP-86 held beat UAT 118 staging (from work/cp116/stage.py)"),
   ("glob('checks*-on116.json')","glob('checks*-on118.json')"),
   ("NEED=['checks86m.json','checks64-on116.json','checks88-on116.json','checks112-on116.json']","NEED=['checks86m.json','checks64-on118.json','checks88-on118.json','checks112-on118.json']")]
for a,b in R:
    assert st.count(a)==1,a;st=st.replace(a,b)
k=st.index("'authorization':f\"");m2=st.index("\"}",k)+1
st=st[:k]+"""'authorization':f"UAT {uat}: CP-86 Sonic meow held beat after the rings (PM, Nov 19, Jenny's words: \\"the sound wave should stop, and then there should be a beat where the cat's still in the sonic meow pose\\"; PM: \\"UAT number: 118, on 117\\"); UAT only\""""+st[m2:]
(p/'stage.py').write_text(st,encoding='utf-8')
mk=(p/'make-checks86m.py').read_text(encoding='utf-8').replace("'../cp115/release.html'","'../cp116/release.html'").replace('BASE=<UAT 115 release.html>','BASE=<UAT 116 or 117 release.html>').replace('UAT 116 final: E only, a longer hold and a quick return; the choice removed.','UAT 118: the held beat after the rings.')
(p/'make-checks86m.py').write_text(mk,encoding='utf-8')
print('ok')
