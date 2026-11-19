# UAT 105: checks72s / checks80 from UAT 104's (work/cp104-lab), whose reference is UAT 98 + this build's name + every later
# block except UAT 99's own changes. Adds UAT 105's ending edits (only Peek-a-boo, its box hidden, the stale label) and
# cp72-small.js to that reference. (UAT 105's two Zoomies-sound edits are not applied: UAT 99's sound choice is not in the
# reference.) Usage: python make-special.py
from pathlib import Path
p=Path(__file__).parent;S=p/'../cp104-lab'
ADD=("for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).edits.slice(3)){if(B.split(a).length!==2)throw new Error('edit105');B=B.split(a).join(b);}"
     "{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp72-small.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}")
for n in ['checks72s-on104.cjs','checks80-on104.cjs']:
    s=(S/n).read_text(encoding='utf-8')
    assert s.count("'cp83-lab.js'")==1,n;s=s.replace("'cp83-lab.js'","'../cp104-lab/cp83-lab.js'")
    assert s.count("fs.writeFileSync(ref,B);}")==1,n;s=s.replace("fs.writeFileSync(ref,B);}",ADD+"fs.writeFileSync(ref,B);}")
    s=s.replace('CP-83-evidence/uat','CP-72-evidence/uat').replace(n.replace('.cjs','.json'),n.replace('-on104','-on105').replace('.cjs','.json'))
    L=s.split('\n');L[0]='// UAT 105 (CP-72 final ending): copied from work/cp104-lab/'+n+'; the reference also gets UAT 105 ending edits and cp72-small.js.'
    s='\n'.join(L);assert 'CP-83-evidence' not in s,n
    o=n.replace('-on104','-on105');(p/o).write_text(s,encoding='utf-8');print(o)
