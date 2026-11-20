"""CP-96 pupils fix, UAT 129 (from work/cp124/gen-checks.py): the combined full regression set on 129, covering everything since
UAT 124 (125 CP-99 meter, 126 CP-92 plow + HUD, 127 Home + CP-100, 128 CP-101 Ragdoll waltz), each suite's newest version:
 - from work/cp128: checks64/92e/93g/97s/99/100-on128 and checks101r (CP-101's own)
 - from work/cp124: the other suites (101-112, 71, 72, 72s, 75 with its Orange Dance meter baseline, 79, 80, 88, 92, 93, 94, 97)
 - check 0 everywhere: the build is published UAT 128 + build name + UAT 124's Daily puzzles block swapped for the
   pupils-fixed one (nothing else)
 - references built from older UATs (checks72s, checks80): + UAT 125, 126, 127 and 128's edits and blocks from their own
   folders, then this build's block swap
 - output tickets/CP-96-evidence/uat129
Usage (after python setup.py cp128 129): python gen-checks.py"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text());base=v['base'];B=W/base;N=int(v['displayName'].split()[-1])
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256']==v['baseSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1])
for f in p.glob('checks*-on*.cjs'):f.unlink()
NEWER=['cp125','cp92-plow','cp127','cp128']  # UAT 125-128 build folders, in order
for d in NEWER:assert (W/d/'edits.json').exists(),d
LAYERS=''.join("for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'../%s/edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit-%s '+a.slice(0,50));B=B.split(a).join(b);}"
  "for(const f of JSON.parse(fs.readFileSync(path.join(__dirname,'../%s/edits.json'),'utf8')).appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'../%s',f),'utf8')+String.fromCharCode(10)+B.slice(i);}"%(d,d,d,d) for d in NEWER)
SWAP=("{const N=fs.readFileSync(path.join(__dirname,'cp96-puzzles.js'),'utf8');for(const o of ['../cp107/cp87-puzzles.js','../cp124/cp96-puzzles.js']){const O=fs.readFileSync(path.resolve(__dirname,o),'utf8');"
      "const k=B.split(O).length;if(k>2)throw new Error('cp96 block');if(k===2)B=B.split(O).join(N);}}")
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "{const O=fs.readFileSync(path.resolve(__dirname,'../cp124/cp96-puzzles.js'),'utf8'),N=fs.readFileSync(path.join(__dirname,'cp96-puzzles.js'),'utf8');if(B.split(O).length!==2)m=[];B=B.split(O).join(N);}\n"
 "  check('0 the build is published %s + build name + the Daily puzzles block with the Sleepy Coins pupils fix (everything else unchanged)',S===B&&m.length===1);}\n")%(base,bh,bn)
EV="'../../tickets/CP-96-evidence/uat%d'"%N;made=[];hand=[];skipped=[]
mine=('edits.json','release.html','release-version.json','cp96-puzzles.js')
S128=sorted(B.glob('checks*-on%d.cjs'%bnum))+[B/'checks101r.cjs']
have={re.match(r'checks([\w]+?)(?:-on\d+)?\.cjs$',f.name).group(1) for f in S128}
S124=[f for f in sorted((W/'cp124').glob('checks*-on124.cjs')) if re.match(r'checks([\w]+?)-on124',f.name).group(1) not in have]
for f in S128+S124:
    F=f.parent;s=f.read_text(encoding='utf-8').replace('\r\n','\n')
    stem=re.match(r'checks([\w]+?)(?:-on\d+)?\.cjs$',f.name).group(1);o='checks%s-on%d.cjs'%(stem,N)
    n=0
    if "check('0 the build is its base + edits.json + its appended blocks" in s:  # checks100: reads edits.json's appended list
        i=s.index(" {const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json')");j=s.index("\n",s.index("check('0 ",i))+1
        s=s[:i]+C0+s[j:];n=1
    elif "check('0 " in s:
        s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    else:n=-1  # checks101r: no check 0 (compares with release-version.json's base)
    if n==0 and "fs.writeFileSync(ref,B);}" not in s:skipped.append(f.name);continue
    if "/* CP-96: + this build's block swap */" in s:  # a reference built from an older UAT (UAT 124 gave it the block swap)
        a="fs.writeFileSync(ref,B);}"
        if s.count(a)!=1:skipped.append(f.name);continue
        s=s.replace(a,LAYERS+SWAP+a+" /* CP-96 UAT 129: + UAT 125-128's edits and blocks, then this build's block */",1);hand.append(o)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat\d+'",EV,s)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/uat'","'../../tickets/CP-96-evidence/uat'",s)
    s=re.sub(r"'\.\./\.\./tickets/[A-Z]+-\d+-evidence/'\+\(DEV\?'dev':'uat\d+'\)",EV,s)
    s=re.sub(r"(?m)^(//.*)tickets/CP-\d+-evidence/",lambda q:q.group(1)+'tickets/CP-96-evidence/',s)
    s=s.replace(f.name.replace('.cjs','.json'),o.replace('.cjs','.json')).replace("'checks%s.json'"%stem,"'%s'"%o.replace('.cjs','.json'))
    s=s.replace("base=E.base,","base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../%s/edits.json'),'utf8')).base,"%base)
    for old in (bn,'2026.11.19 UAT 124'):s=s.replace(".join(\"const BUILD = '%s';\")"%old,".join(\"const BUILD = '%s';\")"%v['displayName'])
    s=re.sub(r'named1\d\d\.html','named%d.html'%N,s)
    def own(mo):
        name=mo.group(1)
        if name in mine:return mo.group(0)
        for d in (F,B):
            if (d/name).exists() and not (p/name).exists():return "path.join(__dirname,'../%s/%s')"%(d.name,name)
        return mo.group(0)
    s=re.sub(r"path\.join\(__dirname,'([\w.\-]+)'\)",own,s)
    def lst(mo):
        def one(q):
            name=q.group(1)
            if name in mine or name.startswith('../'):return q.group(0)
            for d in (F,B):
                if (d/name).exists() and not (p/name).exists():return "'../%s/%s'"%(d.name,name)
            return q.group(0)
        return re.sub(r"'([^']+)'",one,mo.group(0))
    s=re.sub(r"for\(const f of \[[^\]]*\]\)",lst,s)
    # CP-96 UAT 129 test upkeep (PM, Nov 19). Since UAT 127 (CP-100) Home's PLAY opens the Endless board and the Level boards list
    # also starts the Endless board on a layout; timed levels have no button. On a build with CP-100 these suites start the timed
    # level with exactly what PLAY did before CP-100 (UAT 126's pgMainTap: PGU.screen='board';PGU.fade=.25;pgStartRound()), so
    # their UAT 94 / UAT 92 references still apply; on the references themselves PLAY is tapped as before.
    OLDPLAY="g.run(\"PGU.screen='board';PGU.fade=.25;pgStartRound()\")"
    if stem=='75':
        a="if(pl)tap(pl.x+pl.w/2,pl.y+pl.h/2);";assert s.count(a)==1,o
        s=s.replace(a,"if(g.run(\"typeof cp100Play==='function'\"))"+OLDPLAY+";else if(pl)tap(pl.x+pl.w/2,pl.y+pl.h/2); /* CP-96 UAT 129: the timed level as PLAY started it before CP-100 */")
    if stem=='93':
        a="const pl=J(g,'PGA.L.play');tap(pl.x+pl.w/2,pl.y+pl.h/2);";assert s.count(a)==1,o
        s=s.replace(a,"if(g.run(\"typeof cp100Play==='function'\"))"+OLDPLAY+";else{const pl=J(g,'PGA.L.play');tap(pl.x+pl.w/2,pl.y+pl.h/2);} /* CP-96 UAT 129: the timed level as PLAY started it before CP-100 */")
    if stem=='97':  # the Ragdoll rows against UAT 128 (CP-101 gave the Ragdoll its waltz Dance break, which this play run reaches)
        a="const base106=path.resolve(__dirname,'../cp106-hug/release.html');";assert s.count(a)==1,o
        s=s.replace(a,"const base106=path.resolve(__dirname,'../cp128/release.html'); /* CP-96 UAT 129: Ragdoll rows against UAT 128 (CP-101 waltz); was UAT 106 (the new Hug) */")
        s=s.replace("UAT 96 (Ragdoll: to UAT 106, the new Hug)","UAT 96 (Ragdoll: to UAT 128, the CP-101 waltz)")
    if stem=='75':assert 'FR()' in s,'checks75 Orange Dance meter baseline missing'
    code='\n'.join(x for x in s.split('\n') if not x.startswith('//'))
    bad=[e for e in re.findall(r'CP-\d+-evidence',code) if e!='CP-96-evidence']
    assert 'CP-96-evidence' in code and not bad,(f.name,bad)
    (p/o).write_bytes(s.encode('utf-8'));made.append(o)
print('made',len(made),made);print('references given UAT 125-128 + the block:',hand);print('skipped:',skipped)
