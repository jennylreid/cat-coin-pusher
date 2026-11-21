"""CP-93 Tower physics, UAT 136 (adapted from work/cp120/setup.py): makes the base UAT's checks*-on<base>.cjs into -on<n> ones here.
 - check 0: the build is the published base + edits.json (build name) + cp93-physics.js (everything else unchanged)
 - references built from an older UAT get this build's edits and block too
 - output tickets/CP-93-evidence/uat<n>; this ticket's own checks are checks136.cjs (-> checks136.json), not generated
Usage (after python setup.py <base> <n>): python gen-checks.py"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());base=v['base'];B=W/base;N=int(v['displayName'].split()[-1])
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256']==v['baseSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1])
for f in p.glob('checks*-on*.cjs'):f.unlink()
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}\n"
 "  check('0 the build is published %s + build name + cp93-physics.js (everything else unchanged)',S===B&&m.length===1);}\n")%(base,bh,bn)
EV="'../../tickets/CP-93-evidence/uat%d'"%N;made=[];hand=[];skipped=[]
mine=('edits.json','release.html','release-version.json','cp93-physics.js')
for f in [x for x in sorted(B.glob('checks*-on%d.cjs'%bnum))+[B/('checks%d.cjs'%bnum)] if x.exists()]:
    s=f.read_text(encoding='utf-8')
    if 'process.env.BUILD_DIR' in s:skipped.append(f.name+' (takes SRC/BASE/OUT/BUILD_DIR)');continue
    mm=re.match(r'checks([\w-]+?)(?:-on\d+)?\.cjs$',f.name);o='checks%s-on%d.cjs'%(mm.group(1),N)
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    if n!=1:
        a="fs.writeFileSync(ref,B);}"
        if s.count(a)!=1:skipped.append(f.name);continue
        s=s.replace(a,"for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('editcp93 '+a.slice(0,50));B=B.split(a).join(b);}for(const f of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} /* CP-93: + this build's edits and block */",1)
        hand.append(o)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat\d+'",EV,s)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat'","'../../tickets/CP-93-evidence/uat'",s)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/'\+\(DEV\?'dev':'uat\d+'\)",EV,s)
    s=s.replace(f.name.replace('.cjs','.json'),o.replace('.cjs','.json'))
    s=s.replace("base=E.base,","base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../%s/edits.json'),'utf8')).base,"%base)
    s=s.replace(".join(\"const BUILD = '%s';\")"%bn,".join(\"const BUILD = '%s';\")"%v['displayName']).replace('named'+str(bnum)+'.html','named%d.html'%N)
    def own(mo):
        name=mo.group(1)
        if name in mine:return mo.group(0)
        if (B/name).exists() and not (p/name).exists():return "path.join(__dirname,'../%s/%s')"%(base,name)
        return mo.group(0)
    s=re.sub(r"path\.join\(__dirname,'([\w.\-]+)'\)",own,s)
    def lst(mo):
        def one(q):
            name=q.group(1)
            if name in mine or name.startswith('../'):return q.group(0)
            if (B/name).exists() and not (p/name).exists():return "'../%s/%s'"%(base,name)
            return q.group(0)
        return re.sub(r"'([^']+)'",one,mo.group(0))
    s=re.sub(r"for\(const f of \[[^\]]*\]\)",lst,s)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat\d+/","'../../tickets/CP-93-evidence/uat%d/"%N,s)
    assert 'CP-93-evidence' in s,f.name
    (p/o).write_bytes(s.replace('\r\n','\n').encode('utf-8'));made.append(o)
print('made',len(made),made);print('reference scripts given the block:',hand);print('skipped:',skipped)
