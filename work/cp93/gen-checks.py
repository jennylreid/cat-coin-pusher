# Makes the UAT 93 regression scripts from UAT 92's (work/cp92), changing only: check 0 (the build is now published UAT 92
# + the CP-73 follow-up block), the output folder (tickets/CP-73-evidence/uat93) and JSON name, and (checks92) the cane's
# box in the SPLENDID. overlap check, which now follows the cane's new place (tip on the board to the crook above the mitt).
from pathlib import Path
import re
p=Path(__file__).parent;S=p.parent/'cp92'
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp92/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='520fa87fc67f14c4041b131b2c2be7bc1b2dea94b5eff7a55df95dec76f2ab0c')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cane-hold.js'),'utf8')+String.fromCharCode(10)+B.slice(i);\n"
 "  check('0 the build is published UAT 92 + the CP-73 follow-up cane block and build name (everything else of UAT 92 unchanged)',S===B&&m.length===1);}\n")
for f in ('checks92.cjs','checks72-on92.cjs','checks71-on92.cjs','checks64-on92.cjs'):
    s=(S/f).read_text(encoding='utf-8');o=f.replace('92.cjs','92-on93.cjs') if f=='checks92.cjs' else f.replace('on92','on93')
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda m:C0,s,count=1,flags=re.S);assert n==1,f
    s=s.replace("'../../tickets/CP-73-evidence/uat92'","'../../tickets/CP-73-evidence/uat93'")
    s=s.replace("path.resolve(__dirname,'release.html')","path.resolve(__dirname,'release.html')")
    s=s.replace(f.replace('.cjs','.json'),o.replace('.cjs','.json'))
    if f=='checks92.cjs':
        a="out.cane={x1:A.x,y1:A.y-6,x2:B.x+22*B.s,y2:B.y-44*B.s};"
        assert s.count(a)==1;s=s.replace(a,"const G=cp73Grip(t);out.cane={x1:A.x,y1:A.y-6,x2:G.x+14*B.s,y2:G.y-48*B.s};")
    assert 'uat93' in s or 'V.displayName' in s,f
    (p/o).write_text(s,encoding='utf-8');print(o)
