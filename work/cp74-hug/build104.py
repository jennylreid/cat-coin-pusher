# CP-74 UAT 104 review pages (evidence only, not shipped): the UAT 104 release.html + demo.js -> game104/uat104.html,
# and UAT 103 (published) + demo.js -> game104/uat103.html, beside the UAT 104 runtime files (work/cp104/boot104 copy).
from pathlib import Path
p=Path(__file__).parent;demo=(p/'demo.js').read_text(encoding='utf-8')
for name,src in (('uat104.html','cp104'),('uat103.html','cp103')):
    s=(p.parent/src/'release.html').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+demo+'\n'+s[i:]
    (p/'game104'/name).write_text(s,encoding='utf-8',newline='');print(name,len(s))
