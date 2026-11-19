# CP-74 UAT 106 review page (evidence only, not shipped): the UAT 106 release.html + demo.js -> game106/uat106.html,
# beside the UAT 106 runtime files (a copy of work/cp106-hug/boot106, plus art/ for the headless harness).
from pathlib import Path
p=Path(__file__).parent;demo=(p/'demo.js').read_text(encoding='utf-8')
s=(p.parent/'cp106-hug'/'release.html').read_text(encoding='utf-8');i=s.rindex('</script>');s=s[:i]+demo+'\n'+s[i:]
(p/'game106'/'uat106.html').write_text(s,encoding='utf-8',newline='');print('uat106.html',len(s))
