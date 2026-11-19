# Makes the UAT 94 regression scripts from UAT 93's (work/cp93), changing only: check 0 (the build is now published UAT 93
# + the CP-72 add-on edits and block), the output folder (tickets/CP-72-evidence/uat94) and JSON name, and (CP-72 checks)
# waiting out the 1.25 s title before checking that Zoomies has started.
from pathlib import Path
import re
p=Path(__file__).parent;S=p.parent/'cp93'
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp93/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='60e61bdf9b715170f537cd7c3a73838f57ed84d0dd5089bbf886ba71e8bfddb0')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'z72-title.js'),'utf8')+String.fromCharCode(10)+B.slice(i);\n"
 "  check('0 the build is published UAT 93 + the CP-72 add-on edits and block (everything else of UAT 93 unchanged)',S===B&&m.length===1);}\n")
for f in ('checks93.cjs','checks92-on93.cjs','checks72-on93.cjs','checks71-on93.cjs','checks64-on93.cjs'):
    s=(S/f).read_text(encoding='utf-8');o=f.replace('93.cjs','93-on94.cjs') if f=='checks93.cjs' else f.replace('on93','on94')
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda m:C0,s,count=1,flags=re.S);assert n==1,f
    s=s.replace("'../../tickets/CP-73-evidence/uat93'","'../../tickets/CP-72-evidence/uat94'").replace("'../../tickets/CP-73-evidence/uat'","'../../tickets/CP-72-evidence/uat'")
    s=s.replace(f.replace('.cjs','.json'),o.replace('.cjs','.json'))
    if f=='checks93.cjs':s=s.replace("path.resolve(__dirname,'../cp92/release.html')","path.resolve(__dirname,'../cp92/release.html')")
    if f=='checks72-on93.cjs':
        a="g.run(TAP);const started=g.run('!!Z72X');"
        assert s.count(a)==1;s=s.replace(a,"g.run(TAP);const titleOnly=g.run('!Z72X&&z72BigT()>=0');for(let i=0;i<Math.round(1.3*fps);i++)tk();const started=titleOnly&&g.run('!!Z72X');")
        b=r"!/^(coin|silver|rain\d+|quake|gold5|smiley|clover|rainbow|bolt|shower|lucky)$/.test(id)"
        assert s.count(b)==1;s=s.replace(b,r"!/^(coin|silver|rain\d+|quake|gold5|smiley|clover|rainbow|bolt|shower|lucky|recipecoin)$/.test(id)") # recipe coins are coins, not prizes
    assert 'uat94' in s or 'V.displayName' in s,f
    (p/o).write_text(s,encoding='utf-8');print(o)
