from pathlib import Path
import hashlib
p=Path(__file__).parent;raw=(p/'uat12/release.html').read_bytes()
assert hashlib.sha256(raw).hexdigest()=='4cad192c4ad54572c0984c5c7c61374e1e40237fc23d782b7f87d742225d8085'
s=raw.decode()
s=s.replace('function step(){',(p/'impact13.js').read_text(encoding='utf-8')+'\nfunction step(){') if 'function step(){' in s else s.replace('function step() {',(p/'impact13.js').read_text(encoding='utf-8')+'\nfunction step() {')
assert 'function deliveryImpact()' in s
s=s.replace('    coinRotationContacts();','    deliveryImpact();\n    coinRotationContacts();')
s=s.replace('    solidCoinContacts(before);','    solidCoinContacts(before);\n    dampCoinImpacts();')
(p/'draft.html').write_text(s,encoding='utf-8')
