"""UAT 108 = CP-86 Sonic meow face (Jenny, Nov 18: "Sonic meow is approved for UAT." v4: the Siamese's open-mouth yawn face
switched in on the meow, eyes closed then open on the last meow, whole-cat shake and active mitts, no fades; floating texts
wait for every power). Sets this folder up on a published base UAT and builds it.
Usage: python setup.py <base work folder>   e.g. python setup.py cp107   (prepared first on cp106-hug)
 - release-version.json: "2026.11.18 UAT 108", version = the base's + 1 (+2 while prepared on UAT 106, which UAT 107 follows)
 - art/ copied from the base (the render harness reads runtime art there)
 - build.py run (base + build name + cp86-meow.js)
 - the base's checks*.cjs made into -on108 ones: check 0 replaced (the build is the base + edits.json), output folder
   tickets/CP-86-evidence/uat108, JSON names; files the scripts read from their own folder are read from the base's folder
   (../<base>/...), and a reference made from an older UAT gets this ticket's block too"""
from pathlib import Path
import json,hashlib,re,shutil,subprocess,sys
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];B=W/base
m=json.loads((B/'publication-manifest.json').read_text());bh=hashlib.sha256((B/'release.html').read_bytes()).hexdigest()
assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
step=2 if base=='cp106-hug' else 1
v={'displayName':'2026.11.18 UAT 108','version':m['version']+step,'apkVersion':7,'base':base,'baseSHA256':bh}
(p/'release-version.json').write_text(json.dumps(v),encoding='utf-8')
if (p/'art').exists():shutil.rmtree(p/'art')
shutil.copytree(B/'art',p/'art')
(p/'build.py').write_text('''"""UAT 108 = CP-86 Sonic meow face (see setup.py). Build name + the block cp86-meow.js.
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp86-meow.js']
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
 "  check('0 the build is published %s + build name + cp86-meow.js (everything else unchanged)',S===B&&m.length===1);}\n")%(base,bh,m['displayName'])
bn=m['displayName']
made=[];hand=[]
for f in sorted(B.glob('checks*.cjs')):
    s=f.read_text(encoding='utf-8');mm=re.match(r'checks(\w+?)(?:-on\d+)?\.cjs$',f.name);o='checks%s-on108.cjs'%mm.group(1)
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    if n!=1:
        # a script that builds its own reference (UAT 98 + later blocks): add this ticket's block to the reference
        a="fs.writeFileSync(ref,B);}"
        if s.count(a)!=1:print('skipped (no check 0, no reference):',f.name);continue
        s=s.replace(a,"{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp86-meow.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} /* UAT 108: + cp86-meow.js */",1)
        hand.append(o)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat\d+'","'../../tickets/CP-86-evidence/uat108'",s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat'","'../../tickets/CP-86-evidence/uat'",s)
    s=s.replace(f.name.replace('.cjs','.json'),o.replace('.cjs','.json'))
    s=s.replace("base=E.base,","base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../%s/edits.json'),'utf8')).base,"%base)
    s=s.replace(".join(\"const BUILD = '%s';\")"%bn,".join(\"const BUILD = '%s';\")"%v['displayName']).replace('named'+bn.split()[-1]+'.html','named108.html')
    # files the base's script read from its own folder (blocks, edits.json, references) are read from the base's folder
    def own(mo):
        name=mo.group(1)
        if (p/name).exists() and name in ('edits.json','release.html','release-version.json','cp86-meow.js'):return mo.group(0)
        if (B/name).exists() and not (p/name).exists():return "path.join(__dirname,'../%s/%s')"%(base,name)
        return mo.group(0)
    s=re.sub(r"path\.join\(__dirname,'([\w.\-]+)'\)",own,s)
    assert 'CP-86-evidence' in s,f.name
    (p/o).write_bytes(s.replace('\r\n','\n').encode('utf-8'));made.append(o)
print('made',len(made),made);print('reference scripts given the block:',hand)
