# Makes checks90.cjs: the shared helpers from work/cp105/checks105.cjs (midRound etc.) + checks90-body.js. Usage: python make-checks90.py
from pathlib import Path
p=Path(__file__).parent
s=(p/'../cp105/checks105.cjs').read_text(encoding='utf-8')
head=s[s.index("const fs=require"):s.index("(async()=>{")]
head=head.replace("const DEV=process.env.DEV==='1',","const DEV=false,").replace("tickets/CP-72-evidence/uat105","tickets/CP-90-evidence/uat117")
assert "CP-90-evidence/uat117" in head and "pgPlay('orange')" in head
hdr=("// UAT 117 checks (CP-90 Zoomies painted kittens; Jenny Nov 19: \"I prefer the original Ginger Puff cat.\" / \"I need to see both.\n"
 "// I need to see them in action as well.\"): Developer choice Painted (default) / Original; the puff stays the original drawing.\n"
 "// Usage: node checks90.cjs -> tickets/CP-90-evidence/uat117/checks90.json + stills kittens-*.png\n")
(p/'checks90.cjs').write_text(hdr+head+(p/'checks90-body.js').read_text(encoding='utf-8'),encoding='utf-8');print('ok')
