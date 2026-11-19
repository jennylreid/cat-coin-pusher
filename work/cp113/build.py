"""CP-88 hotfix (see setup.py): build name + three in-place fixes to the CP-88 block already in the base.
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-88 hotfix: the slot's pulse measured from the game clock, which restarts on a new board or round; a pulse from before
# that made a negative ring radius, and drawing threw every frame (the next board's countdown never finished)
EDITS+=[(" const pu=time-CP88.pulse,s=pu<2.5?1+.12*Math.abs(Math.sin(pu*7)):1;",
  " let pu=time-CP88.pulse;if(!(pu>=0))pu=9;const s=pu<2.5?1+.12*Math.abs(Math.sin(pu*7)):1; /* CP-88 hotfix: a pulse from before the game clock restarted is over */"),
 ("const __cp88Reset=wildReset;wildReset=function(){CP88.bank={laser:0,fish:0,mousecoin:0};",
  "const __cp88Reset=wildReset;wildReset=function(){CP88.bank={laser:0,fish:0,mousecoin:0};CP88.pulse=-9; /* CP-88 hotfix */"),
 ("const __cp88Exit=wildExit;wildExit=function(){CP88.bank={laser:0,fish:0,mousecoin:0};",
  "const __cp88Exit=wildExit;wildExit=function(){CP88.bank={laser:0,fish:0,mousecoin:0};CP88.pulse=-9; /* CP-88 hotfix */")]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=[]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
