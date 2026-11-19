# Makes checks105.cjs: the shared helpers from work/cp102/checks102.cjs + checks105-body.js. Usage: python make-checks105.py
from pathlib import Path
p=Path(__file__).parent
s=(p/'../cp102/checks102.cjs').read_text(encoding='utf-8')
head=s[s.index("const fs=require"):s.index("(async()=>{")]
head=head.replace("tickets/CP-72-evidence/uat102","tickets/CP-72-evidence/uat105").replace("'57f3dad50eb6ef644183f27db5056bda96a3ac9f395e8a4249d3edf14c0d4618'","'8d9eee781044fceded19dd719a119cc3ae4c8ee498e8d667116705fe699beba6'")
hdr=("// UAT 105 checks (CP-72 Zoomies ending, final; Jenny Nov 18: \"only peek-a-boo. Kitten stays small: the puffed one hangs back\n"
 "// and peeks at normal size (at most a little bigger), no blow-up and no screen-sized cat. Remove the other ending choices.\")\n"
 "// + Zoomies sound choice removed + the stale \"UAT 62\" label. Usage: node checks105.cjs | DEV=1 node checks105.cjs (on UAT 103)\n"
 "// -> tickets/CP-72-evidence/uat105[-dev]/checks105.json + stills peek-*.png\n")
(p/'checks105.cjs').write_text(hdr+head+(p/'checks105-body.js').read_text(encoding='utf-8'),encoding='utf-8');print('ok')
