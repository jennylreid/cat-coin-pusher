"""CP-90 UAT 117: makes the base UAT's checks*.cjs into -on117 ones (from work/cp116/setup.py's generator): check 0 replaced
(the build is the base + edits.json), output folder tickets/CP-90-evidence/uat117, JSON names; files the scripts read from their
own folder are read from the base's folder; a reference made from an older UAT gets this ticket's block (cp90-kittens.js) too.
Usage (after python build.py): python gen-checks.py"""
from pathlib import Path
import json,hashlib,re,sys
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());base=v['base'];B=W/base
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256']==v['baseSHA256'];bn=m['displayName'];bnum=int(bn.split()[-1]);N=int(v['displayName'].split()[-1])
for f in p.glob('checks*-on*.cjs'):f.unlink()
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}\n"
 "  check('0 the build is published %s + build name + cp90-kittens.js (everything else unchanged)',S===B&&m.length===1);}\n")%(base,bh,bn)
EV="'../../tickets/CP-90-evidence/uat%d'"%N;made=[];hand=[];skipped=[]
for f in sorted(B.glob('checks*.cjs')):
    s=f.read_text(encoding='utf-8')
    if 'process.env.BUILD_DIR' in s:skipped.append(f.name+' (takes SRC/BASE/OUT/BUILD_DIR; run with them set)');continue
    mm=re.match(r'checks([\w-]+?)(?:-on\d+)?\.cjs$',f.name);o='checks%s-on%d.cjs'%(mm.group(1),N)
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    if n!=1:
        # the base's own edits step in its reference read edits.json from its folder: point it at the base's (the base's own edits step)
        s=re.sub(r"path\.join\(__dirname,'edits\.json'\)(\,'utf8'\)\)\.edits\.slice\(1\)\)\{if\(B\.split\(a\)\.length!==2\)throw new Error\('edit\w+'\))",lambda mo:"path.join(__dirname,'../%s/edits.json')"%base+mo.group(1),s)
        a="fs.writeFileSync(ref,B);}"
        if s.count(a)!=1:skipped.append(f.name);continue
        s=s.replace(a,"{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp90-kittens.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} // UAT 117: the reference also gets cp90-kittens.js")
        hand.append(o)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat\d+'",EV,s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat'","'../../tickets/CP-90-evidence/uat'",s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/'\+\(DEV\?'dev':'uat\d+'\)",EV,s)
    s=s.replace(f.name.replace('.cjs','.json'),o.replace('.cjs','.json'))
    s=s.replace("base=E.base,","base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../%s/edits.json'),'utf8')).base,"%base)
    s=s.replace(".join(\"const BUILD = '%s';\")"%bn,".join(\"const BUILD = '%s';\")"%v['displayName']).replace('named'+str(bnum)+'.html','named%d.html'%N)
    mine=('edits.json','release.html','release-version.json','cp90-kittens.js')
    def own(mo):
        name=mo.group(1)
        if name in mine:return mo.group(0)
        if (B/name).exists() and not (p/name).exists():return "path.join(__dirname,'../%s/%s')"%(base,name)
        return mo.group(0)
    s=re.sub(r"path\.join\(__dirname,'([\w.\-]+)'\)",own,s)
    # bare names in reference file lists, e.g. for(const f of ['../cp106-hug/cp74-hug.js','cp87-puzzles.js'])
    def lst(mo):
        def one(q):
            name=q.group(1)
            if name in mine or name.startswith('../'):return q.group(0)
            if (B/name).exists() and not (p/name).exists():return "'../%s/%s'"%(base,name)
            return q.group(0)
        return re.sub(r"'([^']+)'",one,mo.group(0))
    s=re.sub(r"for\(const f of \[[^\]]*\]\)",lst,s)
    assert 'CP-90-evidence' in s,f.name
    (p/o).write_bytes(s.replace('\r\n','\n').encode('utf-8'));made.append(o)
print('made',len(made),made);print('reference scripts given the block:',hand);print('skipped (no check 0, no reference; run separately):',skipped)
