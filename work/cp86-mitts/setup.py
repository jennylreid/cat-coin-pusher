"""CP-86 Sonic meow mitts, three options (Jenny, Nov 19: "I would like to see B and C, and also above the head, like the yawn
pose."; PM's go: three mitt options in Sonic meow, a Developer choice, default above the head). Sets this folder up on a published
base UAT and builds it.
Usage: python setup.py <base work folder> <UAT number>   e.g. python setup.py cp109-lab 110
 - release-version.json: "2026.11.19 UAT <n>", version = the base's + (n - the base's UAT number)
 - art/ copied from the base (the render harness reads runtime art there)
 - build.py: base + build name + three hook edits in the CP-86 block (each mitt path passes its own resting place) + cp86-mitts.js
 - the base's checks*.cjs made into -on<n> ones: check 0 replaced (the build is the base + edits.json), output folder
   tickets/CP-86-evidence/uat<n>, JSON names; files the scripts read from their own folder (also in reference file lists) are
   read from the base's folder, and a reference made from an older UAT gets this ticket's block too"""
from pathlib import Path
import json,hashlib,re,shutil,subprocess,sys
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];N=int(sys.argv[2]);B=W/base
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1]);assert N>bnum,(N,bn)
v={'displayName':'2026.11.19 UAT %d'%N,'version':m['version']+(N-bnum),'apkVersion':7,'base':base,'baseSHA256':bh}
(p/'release-version.json').write_text(json.dumps(v),encoding='utf-8')
shutil.copytree(B/'art',p/'art',dirs_exist_ok=True) # copied over (OneDrive can lock the folder against deletion)
(p/'build.py').write_text('''"""CP-86 Sonic meow mitts (see setup.py). Build name + three hook edits in the CP-86 block + the block cp86-mitts.js.
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-86 mitts: the mitts are drawn two ways (the rest pose through pawMotion, the idle mitts through mittRest + drawMittArm);
# each hook now tells cp86MittOff which and its own resting place, so a pose lands on the same spot and turn either way
EDITS+=[("pawMotion=function(side=0){const m=__cp86Paw(side);if(!side)return m;const o=cp86MittOff(side);",
  "pawMotion=function(side=0){const m=__cp86Paw(side);if(!side)return m;const o=cp86MittOff(side,'rest',m); /* CP-86 mitts */"),
 ("mittRest=function(side){const r=__cp86MittRest(side);CP86.side=side;const o=cp86MittOff(side);",
  "mittRest=function(side){const r=__cp86MittRest(side);CP86.side=side;const o=cp86MittOff(side,'wait',r); /* CP-86 mitts */"),
 ("drawMittArm=function(w,h){const o=CP86.side?cp86MittOff(CP86.side):null;",
  "drawMittArm=function(w,h){const o=CP86.side?cp86MittOff(CP86.side,'wait',__cp86MittRest(CP86.side)):null; /* CP-86 mitts */"),
 # while the meow face shows, the idle mitts are drawn where the rest pose draws them (after the head, as in the wheel's Yawn),
 # so a mitt raised beside the head is in front of it; the change of layer happens on the face's own switch frames
 ("if(sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose()){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);drawPaws();ctx.restore();}",
  "if(sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose()&&!(typeof cp86MOnTop==='function'&&cp86MOnTop())){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);drawPaws();ctx.restore();} /* CP-86 mitts */"),
 ("if(sweepTime>0||catquakeTime>0||isRestPose())drawPaws();drawPawTouchGuides();",
  "if(sweepTime>0||catquakeTime>0||isRestPose()||(typeof cp86MOnTop==='function'&&cp86MOnTop()))drawPaws();drawPawTouchGuides(); /* CP-86 mitts */")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp86-mitts.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
''',encoding='utf-8')
subprocess.run([sys.executable,str(p/'build.py')],check=True)
for f in p.glob('checks*-on*.cjs'):f.unlink()
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s/release.html'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}\n"
 "  check('0 the build is published %s + build name + CP-86 hook edits + cp86-mitts.js (everything else unchanged)',S===B&&m.length===1);}\n")%(base,bh,bn)
EV="'../../tickets/CP-86-evidence/uat%d'"%N;made=[];hand=[];skipped=[]
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
        s=s.replace(a,"for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('editmitts');B=B.split(a).join(b);}{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp86-mitts.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} /* CP-86 mitts: + this build's edits and block */",1)
        hand.append(o)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat\d+'",EV,s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat'","'../../tickets/CP-86-evidence/uat'",s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/'\+\(DEV\?'dev':'uat\d+'\)",EV,s)
    s=s.replace(f.name.replace('.cjs','.json'),o.replace('.cjs','.json'))
    s=s.replace("base=E.base,","base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../%s/edits.json'),'utf8')).base,"%base)
    s=s.replace(".join(\"const BUILD = '%s';\")"%bn,".join(\"const BUILD = '%s';\")"%v['displayName']).replace('named'+str(bnum)+'.html','named%d.html'%N)
    mine=('edits.json','release.html','release-version.json','cp86-mitts.js')
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
    assert 'CP-86-evidence' in s,f.name
    (p/o).write_bytes(s.replace('\r\n','\n').encode('utf-8'));made.append(o)
print('made',len(made),made);print('reference scripts given the block:',hand);print('skipped (no check 0, no reference; run separately):',skipped)
