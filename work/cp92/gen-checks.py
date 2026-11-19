# Makes the CP-72, CP-71 and CP-64 check scripts for UAT 92 from UAT 91's (work/cp91), changing only:
# check 0 (the build is now UAT 91 + the CP-73 rework), the output folder/name, and (CP-71 file) dropping the old CP-73
# checks 6-7 (UAT 90's small band words), which the rework replaces (checks92.cjs covers the words now).
from pathlib import Path
import re
p=Path(__file__).parent;S=p.parent/'cp91'
C0=("{const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp91/release.html'),'utf8');"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));let m=[1];for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp73-rework.js'),'utf8')+String.fromCharCode(10)+B.slice(i);\n"
 "  check('0 the build is published UAT 91 + the CP-73 rework edits and block (everything else of UAT 91, including CP-72, CP-71 and CP-64, unchanged)',S===B&&m.length===1);}")
for f,o,name in (('checks91.cjs','checks72-on92.cjs','checks72-on92.json'),('checks90-on91.cjs','checks71-on92.cjs','checks71-on92.json'),('checks64-on91.cjs','checks64-on92.cjs','checks64-on92.json')):
    s=(S/f).read_text(encoding='utf-8')
    s,n=re.subn(r"\{const S=fs\.readFileSync\(src,'utf8'\);let B=.*?check\('0 [^\n]*?\);\}",lambda m:C0,s,count=1,flags=re.S);assert n==1,f
    s=s.replace("'../../tickets/CP-72-evidence/uat91'","'../../tickets/CP-73-evidence/uat92'").replace("'../../tickets/CP-72-evidence/uat'","'../../tickets/CP-73-evidence/uat'")
    s=re.sub(r"path\.join\(out,'[^']+\.json'\)","path.join(out,'%s')"%name,s)
    if f=='checks90-on91.cjs':
        s,n=re.subn(r" // 6\. CP-73: Formal inspection.*?check\('7 CP-73[^\n]*\n",' // 6-7 (UAT 90\'s small CP-73 words) replaced by the CP-73 rework: see checks92.cjs\n',s,count=1,flags=re.S);assert n==1
    assert 'CP-73-evidence/uat' in s,f
    (p/o).write_text(s,encoding='utf-8');print(o)
