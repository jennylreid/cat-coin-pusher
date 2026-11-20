"""CP-94 Orange dance + CP-98 each cat's own closed eyes, UAT 120 (adapted from work/cp119/setup.py). Sets this folder up on a
published base UAT and builds it. Usage: python setup.py <base work folder> <UAT number>   e.g. python setup.py cp119 120
 - release-version.json: "2026.11.19 UAT <n>", version = the base's + (n - the base's UAT number); art/ copied from the base
 - build.py: work/cp94-orange/build.py (build name + the CP-94 in-place edits) + cp94-orange-dance.js + cp98-orange-eyes.js
 - the base's checks*.cjs made into -on<n> ones (check 0: the build is the base + edits.json; output tickets/CP-94-evidence/uat<n>);
   references made from an older UAT get this build's edits and blocks too"""
from pathlib import Path
import json,hashlib,re,shutil,subprocess,sys
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];N=int(sys.argv[2]);B=W/base
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1]);assert N>bnum,(N,bn)
v={'displayName':'2026.11.19 UAT %d'%N,'version':m['version']+(N-bnum),'apkVersion':7,'base':base,'baseSHA256':bh}
(p/'release-version.json').write_text(json.dumps(v),encoding='utf-8')
shutil.copytree(B/'art',p/'art',dirs_exist_ok=True) # copied over (OneDrive can lock the folder against deletion)
(p/'build.py').write_bytes((W/'cp94-orange/build.py').read_bytes())
subprocess.run([sys.executable,str(p/'build.py')],check=True)
for f in p.glob('checks*-on*.cjs'):f.unlink()
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}\n"
 "  check('0 the build is published %s + build name + the CP-94 edits + cp94-orange-dance.js + cp98-orange-eyes.js (everything else unchanged)',S===B&&m.length===1);}\n")%(base,bh,bn)
EV="'../../tickets/CP-94-evidence/uat%d'"%N;made=[];hand=[];skipped=[]
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
        s=s.replace(a,"for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('editcp94 '+a.slice(0,50));B=B.split(a).join(b);}for(const f of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} /* CP-94: + this build's edits and blocks */",1)
        hand.append(o)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat\d+'",EV,s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat'","'../../tickets/CP-94-evidence/uat'",s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/'\+\(DEV\?'dev':'uat\d+'\)",EV,s)
    s=s.replace(f.name.replace('.cjs','.json'),o.replace('.cjs','.json'))
    s=s.replace("base=E.base,","base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../%s/edits.json'),'utf8')).base,"%base)
    s=s.replace(".join(\"const BUILD = '%s';\")"%bn,".join(\"const BUILD = '%s';\")"%v['displayName']).replace('named'+str(bnum)+'.html','named%d.html'%N)
    mine=('edits.json','release.html','release-version.json','cp94-orange-dance.js','cp98-orange-eyes.js')
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
    assert 'CP-94-evidence' in s,f.name
    (p/o).write_bytes(s.replace('\r\n','\n').encode('utf-8'));made.append(o)
print('made',len(made),made);print('reference scripts given the block:',hand);print('skipped (no check 0, no reference; run separately):',skipped)
