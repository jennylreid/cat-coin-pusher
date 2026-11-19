"""Makes checks86m.cjs: the CP-86 (UAT 108) check harness's setup (midRound etc.) + checks86m-body.js."""
from pathlib import Path
p=Path(__file__).parent
src=(p/'../cp108/checks86.cjs').read_text(encoding='utf-8')
head=src[src.index("const fs=require"):src.index("const STATE=")]
R=[("const src=path.resolve(process.env.SRC||path.join(__dirname,'dev.html')),base=path.resolve(process.env.BASE||path.join(__dirname,'../cp104/release.html'));",
    "const src=path.resolve(process.env.SRC||path.join(__dirname,'release.html')),base=path.resolve(process.env.BASE||path.join(__dirname,'../cp115/release.html'));"),
   ("const out=path.resolve(process.env.OUT||path.join(__dirname,'evidence-dev'))","const out=path.resolve(process.env.OUT||path.join(__dirname,'../../tickets/CP-86-evidence/mitts-dev'))"),
   ("const ref=path.join(path.dirname(src),'ref-base-named.html');","const ref=path.join(path.dirname(src),'ref-base-named-m.html');"),
   ("async function midRound(file,{cat,seed,level=3,secs=6,fps=60,render=false,w=400,h=889,pr=1}){",
    "async function midRound(file,{cat,seed,level=3,secs=6,fps=60,render=false,w=400,h=889,pr=1,pick=null}){const st={'catpusher.uat.devdefault.v1':'1'};if(pick)st['catpusher.uat.cp86mitts.v1']=pick;")]
for a,b in R:
    assert head.count(a)==1,a;head=head.replace(a,b)
assert head.count("storage:{'catpusher.uat.devdefault.v1':'1'}")==2;head=head.replace("storage:{'catpusher.uat.devdefault.v1':'1'}","storage:st")
top="// CP-86 Sonic meow mitts, UAT 116 final: E only, a longer hold and a quick return; the choice removed.\n// Usage: SRC=<build> BASE=<UAT 115 release.html> OUT=<dir> BUILD_DIR=<build folder> node checks86m.cjs\n"
(p/'checks86m.cjs').write_bytes((top+head+(p/'checks86m-body.js').read_text(encoding='utf-8')).replace('\r\n','\n').encode('utf-8'))
