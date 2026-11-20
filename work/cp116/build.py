"""CP-86 Sonic meow mitts (see setup.py). Build name + three in-place edits to UAT 114's CP-86 mitts block (E final: quick return, choice removed).
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-86 mitts final (Jenny, Nov 19: "I agree with E, but I want an adjustment. I want the [paws] to stay above the head a little
# bit longer with no fade back to home, just quickly back to home."; PM: E the default, the Developer choice removed). E is the
# only behaviour (any saved choice gives E); the mitts hold above the head until 0.2 s before the face switches back, then go
# back to rest in a quick 0.2 s eased move (was 0.6 s), reaching rest as the face switches; the "Sonic meow mitts" choice is
# no longer shown in Settings. The other poses' numbers stay in the code, unused (E is made of D and Above the head).
EDITS+=[("let pick='head';try{const v=localStorage.getItem(KEY);if(CHOICES.includes(v))pick=v;}catch(e){}",
  "let pick='E';try{const v=localStorage.getItem(KEY);if(CHOICES.includes(v))pick=v;}catch(e){} /* CP-86 mitts final: E */"),
 ("CHOICES=['head','B','C','D','E','F'],",
  "CHOICES=['E'], /* CP-86 mitts final: Jenny picked E */"),
 ("up:.6,down:.6,",
  "up:.6,down:.2, /* CP-86 mitts final: a quick 0.2 s return, after a longer hold */"),
 ("if(!S.dev||!eng||eng.querySelector('#cp86-mitts'))return r;",
  "if(CP86M.CHOICES.length<2||!S.dev||!eng||eng.querySelector('#cp86-mitts'))return r; /* CP-86 mitts final: no choice to show */")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp86-final.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
