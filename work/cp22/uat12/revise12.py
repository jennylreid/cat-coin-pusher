from pathlib import Path
import hashlib
p=Path(__file__).parent
raw=(p/'uat11/release.html').read_bytes()
assert hashlib.sha256(raw).hexdigest()=='4848cd7a0c751ea7ad98f024a585416024784279b1b254f2eebb558b46867dc5'
s=raw.decode()
s=s.replace("function coinSolid(b){", "function contactSolid(b){return coinSolid(b)||b.kind==='item';}\nfunction coinSolid(b){")
s=s.replace("if(kind==='coin'||kind==='silver'||kind==='quake')rb.enableCcd(true);", "if(kind==='coin'||kind==='silver'||kind==='quake'||kind==='item')rb.enableCcd(true);")
s=s.replace('enableCcd(coinSolid(b))','enableCcd(contactSolid(b))')
s=s.replace('bodies.filter(coinSolid)','bodies.filter(contactSolid)')
# Contact projection must preserve the swept path too, not just end positions.
a=s.index('function solidCoinContacts(before){');b=s.index('\nfunction ',a+10)
block=s[a:b];end=block.rfind('\n}')
block=block[:end]+(p/'sweep12.js').read_text(encoding='utf-8')+block[end:]
s=s[:a]+block+s[b:]
a=s.index('// Render a separate list,');b=s.index('function __drawBoardBodies(){',a)
s=s[:a]+(p/'occlusion12.js').read_text(encoding='utf-8')+'\n'+s[b:]
(p/'draft.html').write_text(s,encoding='utf-8')
