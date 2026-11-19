# Makes the UAT 96 regression scripts from UAT 95's (work/cp95), changing only: check 0 (the build is now published UAT 95
# + the build name + the CP-72 hang edit and block), the output folder (tickets/CP-72-evidence/uat96) and JSON name, and in
# checks94 (CP-72 add-ons): the power may now run up to 1.05 s longer (it waits for the kittens to finish), and its check 3
# (leap identical to UAT 93 apart from the puff) is replaced by checks96 check 1 (the hang changes that leap on purpose).
from pathlib import Path
import re
p=Path(__file__).parent;S=p.parent/'cp95'
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp95/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='a522d3c21735550eaa1e779165fc75529ca1edcf69c4b69ef9b876837e51d209')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp72-hang.js'),'utf8')+String.fromCharCode(10)+B.slice(i);\n"
 "  check('0 the build is published UAT 95 + build name + the CP-72 hang edit and block (everything else of UAT 95 unchanged)',S===B&&m.length===1);}\n")
for f in ('checks75.cjs','checks94-on95.cjs','checks93-on95.cjs','checks92-on95.cjs','checks72-on95.cjs','checks71-on95.cjs','checks64-on95.cjs'):
    s=(S/f).read_text(encoding='utf-8');o=f.replace('75.cjs','75-on96.cjs') if f=='checks75.cjs' else f.replace('on95','on96')
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda m:C0,s,count=1,flags=re.S);assert n==1,f
    for ev in ('CP-75-evidence/uat95','CP-75-evidence/uat'):s=s.replace("'../../tickets/"+ev+"'","'../../tickets/"+ev.replace('CP-75','CP-72').replace('uat95','uat96')+"'")
    s=s.replace(f.replace('.cjs','.json'),o.replace('.cjs','.json'))
    if f=='checks94-on95.cjs':
        a="len:a.len>=b.len+LEAD-.1&&a.len<=b.len+LEAD+.1,";assert s.count(a)==1;s=s.replace(a,"len:a.len>=b.len+LEAD-.1&&a.len<=b.len+LEAD+1.05,")
        s,n=re.subn(r" // 3\. the kittens' paths are unchanged.*?check\('3 [^\n]*\n"," // 3 (leap identical to UAT 93 apart from the puff) replaced by checks96 check 1: the hang changes that leap on purpose\n",s,count=1,flags=re.S);assert n==1
    if f=='checks75.cjs':  # the reference is published UAT 94 under this build's name (the name is drawn on screen)
        x="const ref=path.join(__dirname,'ref-uat94-named95.html');{const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));let B=fs.readFileSync(base,'utf8');for(const [x,y] of E.edits)B=B.split(x).join(y);fs.writeFileSync(ref,B);}"
        assert s.count(x)==1;s=s.replace(x,"const ref=path.join(__dirname,'ref-uat94-named96.html');{let B=fs.readFileSync(base,'utf8');if(B.split(\"const BUILD = '2026.11.18 UAT 94';\").length!==2)throw new Error('UAT 94 build name');B=B.split(\"const BUILD = '2026.11.18 UAT 94';\").join(\"const BUILD = '2026.11.18 UAT 96';\");fs.writeFileSync(ref,B);}")
        s=s.replace("renamed to the UAT 95 build name (ref-uat94-named95.html)","renamed to the UAT 96 build name (ref-uat94-named96.html)")
    if f=='checks94-on95.cjs':  # the puff is read once it is full (the leap's rising part is now its own, shorter segment)
        x="if(k.u>=.15)r.minPuffAfter";assert s.count(x)==1;s=s.replace(x,"if(k.u>=.25)r.minPuffAfter")
    assert 'CP-72-evidence' in s,f
    (p/o).write_text(s,encoding='utf-8');print(o)
