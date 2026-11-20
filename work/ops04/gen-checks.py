"""OPS-04 UAT 121: makes the base UAT's checks*-on<base>.cjs (from the base folder in release-version.json) into -on121 ones here.
- check 0 replaced: the build is the base release.html minus the CP-90 block (work/cp117/cp90-kittens.js) + edits.json
  (build name, paw-dance FLAC path), everything else unchanged;
- reference builders that add the CP-90 block no longer add it (Zoomies compared with the original, as in UAT 116) and get the
  FLAC path instead, so the build differs from them only where intended;
- output tickets/OPS-04-evidence/uat121, JSON names -on121. checks90 (CP-90's own) is not carried.
Usage (after python build.py): python gen-checks.py"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());B=W/v['base'];N=int(v['displayName'].split()[-1])
bm=json.loads((B/'publication-manifest.json').read_text());bn=bm['displayName'];bnum=int(bn.split()[-1])
bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest();assert bh==v['baseSHA256']==bm['releaseHTMLSHA256']
for f in p.glob('checks*-on*.cjs'):f.unlink()
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const K=fs.readFileSync(path.resolve(__dirname,'../cp117/cp90-kittens.js'),'utf8')+String.fromCharCode(10);if(B.split(K).length!==2)m=[];B=B.split(K).join('');"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}\n"
 "  check('0 the build is published %s minus the CP-90 block + build name + paw-dance FLAC path (everything else unchanged)',S===B&&m.length===1);}\n")%(v['base'],bh,bn)
ADDS=[re.escape("{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'")+r"(?:\.\./cp117/)?"+re.escape("cp90-kittens.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}")]
FLAC="B=B.split(\"new Audio('sounds/effects/paw-dance.wav')\").join(\"new Audio('sounds/effects/paw-dance.flac')\"); /* OPS-04: CP-90 block not added (removed in UAT 121); FLAC path */"
made=[]
for f in sorted(B.glob('checks*-on%d.cjs'%bnum)):
    if f.name.startswith('checks90-'):continue
    s=f.read_text(encoding='utf-8');o=f.name.replace('-on%d'%bnum,'-on%d'%N)
    s,k=re.subn(ADDS[0],lambda _:FLAC,s)
    if k:
        # the reference's "this build's edits and blocks" step read the base's own edits.json/blocks from its folder: keep them the base's
        a1="JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).edits.slice(1)"
        a2="JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')"
        assert s.count(a1)==1 and s.count(a2)==1,(f.name,s.count(a1),s.count(a2))
        s=s.replace(a1,a1.replace("__dirname,'edits.json'","__dirname,'../%s/edits.json'"%v['base'])).replace(a2,a2.replace("__dirname,'edits.json'","__dirname,'../%s/edits.json'"%v['base']).replace("path.join(__dirname,f)","path.join(__dirname,'../%s',f)"%v['base']))
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    if n==0:s,n=re.subn(r" \{const E=JSON\.parse\(fs\.readFileSync\(path\.join\(__dirname,'edits\.json'\),'utf8'\)\);let B=fs\.readFileSync\(E\.base,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    assert n==1 or k==1,(f.name,n,k)
    s=s.replace('// UAT 117: the reference also gets cp90-kittens.js','// UAT 117 added the CP-90 block here; UAT 121 does not')
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat%d'"%bnum,"'../../tickets/OPS-04-evidence/uat%d'"%N,s)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat'","'../../tickets/OPS-04-evidence/uat'",s)
    s=s.replace('-on%d.json'%bnum,'-on%d.json'%N).replace('named%d.html'%bnum,'named%d.html'%N).replace("const BUILD = '%s';"%bn,"const BUILD = '%s';"%v['displayName'])
    assert 'cp90-kittens' not in s.replace("../cp117/cp90-kittens.js'),'utf8')+String.fromCharCode(10);if(B.split(K)",''),f.name
    assert 'OPS-04-evidence' in s and not re.search(r"'\.\./\.\./tickets/(?!OPS-04)[A-Z]+-\d+-evidence/uat",s),f.name
    (p/o).write_bytes(s.replace('\r\n','\n').encode('utf-8'));made.append((o,'refFix' if k else 'check0'))
print(len(made),made)
