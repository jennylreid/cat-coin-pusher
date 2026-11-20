"""CP-92 plow + HUD fix, UAT 126: makes UAT 125's pre-publish suites (64, 92e, 93g, 97s, and CP-99's checks99) into -on126 ones here.
Check 0: the build is published UAT 125 + build name + the 3 CP-92 HUD edits + cp92-plow.js. Output tickets/CP-92-evidence/uat126."""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());B=W/v['base'];N=126
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest();assert bh==m['releaseHTMLSHA256']==v['baseSHA256']
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp125/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}\n"
 "  check('0 the build is published 2026.11.19 UAT 125 + build name + the 3 CP-92 HUD edits + cp92-plow.js (everything else unchanged)',S===B&&m.length===1);}\n")%bh
mine=('edits.json','release.html','release-version.json','cp92-plow.js')
for name in ['checks64','checks92e','checks93g','checks97s','checks99']:
    f=B/(name+'-on125.cjs') if name!='checks99' else B/'checks99.cjs';s=f.read_text(encoding='utf-8').replace('\r\n','\n');o=name+'-on126.cjs'
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S);assert n==1,name
    s=re.sub(r"tickets/[A-Z]+-\d+-evidence/uat",'tickets/CP-92-evidence/uat',s)
    s=s.replace("uat125'","uat126'").replace(name+'-on125.json',o.replace('.cjs','.json'))
    if name=='checks99':s=s.replace("'checks99.json'","'"+o.replace('.cjs','.json')+"'")
    def own(mo):
        nm=mo.group(1)
        if nm in mine:return mo.group(0)
        if (B/nm).exists() and not (p/nm).exists():return "path.join(__dirname,'../cp125/%s')"%nm
        return mo.group(0)
    s=re.sub(r"path\.join\(__dirname,'([\w.\-]+)'\)",own,s)
    assert 'CP-96-evidence' not in s,name
    (p/o).write_bytes(s.encode('utf-8'));print('made',o)
