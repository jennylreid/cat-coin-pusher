"""CP-101 UAT 128: makes UAT 127's pre-publish suites (64, 92e, 93g, 97s, 99) into -on128 ones here, and checks100 (UAT 127's
change suite) into checks100-on128. Check 0 becomes: the build is published UAT 127 + build name + cp101-ragdoll-dance.js.
Output tickets/CP-101-evidence/uat128. Usage: python gen-checks.py"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());B=W/v['base'];N=128
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest();assert bh==m['releaseHTMLSHA256']==v['baseSHA256']
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp127/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}\n"
 "  check('0 the build is published 2026.11.19 UAT 127 + build name + cp101-ragdoll-dance.js (everything else unchanged)',S===B&&m.length===1);}\n")%bh
mine=('edits.json','release.html','release-version.json','cp101-ragdoll-dance.js')
def own(mo):
    nm=mo.group(1)
    if nm in mine:return mo.group(0)
    if (B/nm).exists() and not (p/nm).exists():return "path.join(__dirname,'../cp127/%s')"%nm
    return mo.group(0)
for name,srcname in [('checks64','checks64-on127'),('checks92e','checks92e-on127'),('checks93g','checks93g-on127'),('checks97s','checks97s-on127'),('checks99','checks99-on127'),('checks100','checks100')]:
    s=(B/(srcname+'.cjs')).read_text(encoding='utf-8').replace('\r\n','\n');o=name+'-on128.cjs'
    if name=='checks100':
        # its own check 0 reads this folder's edits.json and base (generic); only the label names CP-100
        s=s.replace("check('0 the build is its base + build name + the CP-100 edits + cp100-play.js (everything else unchanged)'","check('0 the build is its base + edits.json + its appended blocks (everything else unchanged)'")
    else:
        s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S);assert n==1,name
    s=re.sub(r"tickets/[A-Z]+-\d+-evidence/uat",'tickets/CP-101-evidence/uat',s)
    s=s.replace("uat127'","uat128'").replace(srcname+'.json',o.replace('.cjs','.json'))
    s=re.sub(r"path\.join\(__dirname,'([\w.\-]+)'\)",own,s)
    assert 'CP-101-evidence' in s,name
    (p/o).write_bytes(s.encode('utf-8'));print('made',o)
