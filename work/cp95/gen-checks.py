# Makes the UAT 95 regression scripts from UAT 94's (work/cp94), changing only: check 0 (the build is now published UAT 94
# + the build name + the CP-75 block), the output folder (tickets/CP-75-evidence/uat95) and the JSON name.
from pathlib import Path
import re
p=Path(__file__).parent;S=p.parent/'cp94'
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp94/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='1378c839b4c8aaa5c84744c98e6a65e8d502d7d6024af790747891ed2dd36f48')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp75-yawn.js'),'utf8')+String.fromCharCode(10)+B.slice(i);\n"
 "  check('0 the build is published UAT 94 + the CP-75 block (everything else of UAT 94 unchanged)',S===B&&m.length===1);}\n")
for f in ('checks94.cjs','checks93-on94.cjs','checks92-on94.cjs','checks72-on94.cjs','checks71-on94.cjs','checks64-on94.cjs'):
    s=(S/f).read_text(encoding='utf-8');o=f.replace('94.cjs','94-on95.cjs') if f=='checks94.cjs' else f.replace('on94','on95')
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda m:C0,s,count=1,flags=re.S);assert n==1,f
    s=s.replace("'../../tickets/CP-72-evidence/uat94'","'../../tickets/CP-75-evidence/uat95'").replace("'../../tickets/CP-72-evidence/uat'","'../../tickets/CP-75-evidence/uat'")
    s=s.replace(f.replace('.cjs','.json'),o.replace('.cjs','.json'))
    assert 'CP-75-evidence' in s,f
    (p/o).write_text(s,encoding='utf-8');print(o)
