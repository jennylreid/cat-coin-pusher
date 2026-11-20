"""CP-96 Sleepy Coins, UAT 124 (adapted from work/cp123/gen-checks.py): makes UAT 123's suites into -on124 ones here.
 - sources: work/cp123/checks*-on123.cjs + checks97s.cjs (newest versions: CP-94's checks72 fix, checks92e with the 4.4 s
   sweep waits, checks93g, checks97s). checks107-on123 is not carried: it expects the five CP-87 pages; checks124.cjs replaces it.
 - check 0: the build is published UAT 123 + build name + UAT 107's CP-87 block swapped for cp96-puzzles.js (nothing else)
 - references built from older UATs: UAT 122's and 123's layers read their own folders' edits.json (in UAT 123 both read
   the folder they ran from, so cp93-giant.js was missing and the CP-97 blocks went in twice), then this build's block swap.
 - output tickets/CP-96-evidence/uat124
Usage (after python setup.py cp123 124): python gen-checks.py"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());base=v['base'];B=W/base;N=int(v['displayName'].split()[-1])
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256']==v['baseSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1])
for f in p.glob('checks*-on*.cjs'):f.unlink()
SWAP=("{const O=fs.readFileSync(path.resolve(__dirname,'../cp107/cp87-puzzles.js'),'utf8'),N=fs.readFileSync(path.join(__dirname,'cp96-puzzles.js'),'utf8');"
      "const k=B.split(O).length;if(k>2)throw new Error('cp96 block');if(k===2)B=B.split(O).join(N);}")
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "{const O=fs.readFileSync(path.resolve(__dirname,'../cp107/cp87-puzzles.js'),'utf8'),N=fs.readFileSync(path.join(__dirname,'cp96-puzzles.js'),'utf8');if(B.split(O).length!==2)m=[];B=B.split(O).join(N);}\n"
 "  check('0 the build is published %s + build name + the CP-87 block swapped for cp96-puzzles.js (everything else unchanged)',S===B&&m.length===1);}\n")%(base,bh,bn)
EV="'../../tickets/CP-96-evidence/uat%d'"%N;made=[];hand=[];skipped=[]
mine=('edits.json','release.html','release-version.json','cp96-puzzles.js')
LAYER=(r"for\(const \[a,b\] of JSON\.parse\(fs\.readFileSync\(path\.join\(__dirname,'edits\.json'\),'utf8'\)\)\.edits\.slice\(1\)\)\{if\(B\.split\(a\)\.length!==2\)throw new Error\('(editcp9[37]) '\+a\.slice\(0,50\)\);B=B\.split\(a\)\.join\(b\);\}"
       r"for\(const f of JSON\.parse\(fs\.readFileSync\(path\.join\(__dirname,'edits\.json'\),'utf8'\)\)\.appendedBeforeLastScriptClose\)\{const i=B\.lastIndexOf\('</script>'\);B=B\.slice\(0,i\)\+fs\.readFileSync\(path\.join\(__dirname,f\),'utf8'\)")
FOLD={'editcp93':'../cp122-giant','editcp97':'../cp123'}
def fix_layer(mo):
    d=FOLD[mo.group(1)];return mo.group(0).replace("path.join(__dirname,'edits.json')","path.join(__dirname,'%s/edits.json')"%d).replace("path.join(__dirname,f)","path.join(__dirname,'%s',f)"%d)
srcs=sorted(x for x in B.glob('checks*-on%d.cjs'%bnum) if x.name!='checks107-on%d.cjs'%bnum)+[B/'checks97s.cjs']
for f in srcs:
    s=f.read_text(encoding='utf-8').replace('\r\n','\n')
    if 'process.env.BUILD_DIR' in s:skipped.append(f.name+' (takes SRC/BASE/OUT/BUILD_DIR)');continue
    mm=re.match(r'checks([\w-]+?)(?:-on\d+)?\.cjs$',f.name);o='checks%s-on%d.cjs'%(mm.group(1),N)
    s,nl=re.subn(LAYER,fix_layer,s)
    if f.name=='checks97s.cjs':
        i=s.index(" {const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json')");j=s.index("\n",s.index("check('0 ",i))+1
        s=s[:i]+C0+s[j:];n=1
        s=s.replace("out=path.resolve(__dirname,'../../tickets/CP-97-evidence/uat'+v.displayName.split(' ').pop())","out=path.resolve(__dirname,%s)"%EV)
        s=s.replace("'checks97s.json'","'checks97s-on%d.json'"%N)
    else:
        s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    if n!=1:
        a="fs.writeFileSync(ref,B);}"
        if s.count(a)!=1:skipped.append(f.name);continue
        s=s.replace(a,SWAP+a+" /* CP-96: + this build's block swap */",1);hand.append((o,nl))
    if o=='checks75-on%d.cjs'%N: # CP-96 (PM, Nov 19): inherited baseline update, not a game change. Since UAT 120 (CP-94) the Orange board shows the
        # Dance meter (top right, game 307-389 x 66-96); UAT 94 has none, so the Orange's before/after frames could never match. Blank that HUD box
        # in both builds for the Orange only, as checks90 does. The Orange's frames otherwise match UAT 94 (probe75.cjs: the only differing pixels).
        a="r.frames.before=H(png());";b="ticks(30);r.frames.after=H(png());"
        assert s.count(a)==1 and s.count(b)==1,o
        hm="const HM=()=>{g.c.draw();const cv=g.c.document.getElementById('cv'),k=cv.width/400,x0=Math.floor(300*k),y0=Math.floor(60*k),y1=Math.ceil(102*k),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height);for(let y=y0;y<y1;y++)d.data.fill(0,(y*cv.width+x0)*4,(y+1)*cv.width*4);return crypto.createHash('sha256').update(Buffer.from(d.data.buffer)).digest('hex');},FR=()=>cat==='orange'?HM():H(png()); /* CP-96: the Orange's Dance meter box (UAT 120+) blanked in both builds, as checks90 */"
        s=s.replace(a,hm+"r.frames.before=FR();").replace(b,"ticks(30);r.frames.after=FR();")
        s=s.replace("check('4 every cat: frames before and after the yawn are pixel-identical to UAT 94 (normal faces, per-cat mitts); other cats differ only during the yawn'","check('4 every cat: frames before and after the yawn are pixel-identical to UAT 94 (normal faces, per-cat mitts; the Orange with its UAT 120 Dance meter box blanked); other cats differ only during the yawn'")
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat\d+'",EV,s)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat'","'../../tickets/CP-96-evidence/uat'",s)
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
    s=re.sub(r"(?m)^(//.*)tickets/CP-\d+-evidence/",lambda q:q.group(1)+'tickets/CP-96-evidence/',s)
    assert 'CP-96-evidence' in s and 'CP-97-evidence' not in s and 'CP-93-evidence' not in s,f.name
    (p/o).write_bytes(s.encode('utf-8'));made.append(o)
print('made',len(made),made);print('reference scripts given the block swap (layers fixed):',hand);print('skipped:',skipped)
