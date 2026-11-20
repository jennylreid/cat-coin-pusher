# UAT 110 (CP-74): makes the UAT 109 regression scripts from the base UAT's (work/<base>/checks*.cjs, base from release-version.json), changing
# only: check 0 (the build is now the base + the edits and blocks in edits.json), the output folder
# (tickets/CP-74-evidence/uat110) and the JSON name (-on110). Usage (after `python build.py`): python gen-checks.py
from pathlib import Path
import re,json,hashlib
p=Path(__file__).parent;v=json.loads((p/'release-version.json').read_text());S=p.parent/v['base']
E=json.loads((p/'edits.json').read_text(encoding='utf-8'));base=Path(E['base']).resolve()
assert hashlib.sha256(base.read_bytes()).hexdigest()==v['baseSHA256']
rel=base.relative_to(p.parent).as_posix()
C0=(" {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../%s'),'utf8');let m=[1];"
 "if(require('crypto').createHash('sha256').update(B).digest('hex')!=='%s')m=[];"
 "const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}"
 "for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}\n"
 "  check('0 the build is published %s + build name + the Hug block swapped for try 8 (everything else unchanged)',S===B&&m.length===1);}\n")%(rel,v['baseSHA256'],v['base'])
made=[]
for f in sorted(S.glob('checks*.cjs')):
    s=f.read_text(encoding='utf-8');m=re.match(r'checks(\w+?)(?:-on\d+)?\.cjs$',f.name);o='checks%s-on110.cjs'%m.group(1)
    if f.name=='checks102.cjs':pass
    s,n=re.subn(r" \{const S=fs\.readFileSync\(src,'utf8'\);.*?check\('0 [^\n]*\n",lambda _:C0,s,count=1,flags=re.S)
    if n!=1:print('skipped (no check 0 to replace):',f.name);continue
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat\d+'","'../../tickets/CP-74-evidence/uat110'",s)
    s=re.sub(r"'\.\./\.\./tickets/CP-\d+-evidence/uat'","'../../tickets/CP-74-evidence/uat'",s)
    s=s.replace(f.name.replace('.cjs','.json'),o.replace('.cjs','.json'))
    # a script that takes its comparison base from edits.json keeps the one it was written for (the base UAT's own base)
    s=s.replace("base=E.base,","base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../%s/edits.json'),'utf8')).base,"%v['base'])
    # references renamed to the base UAT's name (the build name is drawn on screen) are renamed to this build's name
    bn=json.loads((S/'release-version.json').read_text())['displayName']
    s=s.replace(".join(\"const BUILD = '%s';\")"%bn,".join(\"const BUILD = '%s';\")"%v['displayName']).replace('named'+bn.split()[-1]+'.html','named'+v['displayName'].split()[-1]+'.html')
    assert 'CP-74-evidence' in s,f.name
    (p/o).write_bytes(s.replace('\r\n','\n').encode('utf-8'));made.append(o)
print('\n'.join(made))
