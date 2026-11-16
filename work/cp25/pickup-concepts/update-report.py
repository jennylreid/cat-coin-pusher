from pathlib import Path
p=Path(__file__).parent;r=p.parents[2];f=r/'tickets/CP-25.md';t=f.read_text(encoding='utf-8')
old=t[t.index('**2026.10.29 UAT 10'):t.index('\n\n## Translucent')]
new='''**Design review: three static popup directions, preview only.** Jenny rejected UAT10's visual treatment and agreed to compare stills before further animation/publication. **UAT10/APK4 remains current** (20261029110950); no new update published.

## Three popup directions — awaiting choice

[Side-by-side comparison](CP-25-evidence/pickup-concepts/three-directions.png):

- **A — Warm keepsake card:** cream paper, stitched gold detail and a teal ribbon/paw seal. [Full phone still](CP-25-evidence/pickup-concepts/A-warm-card-phone.png).
- **B — Teal paw medallion:** a large paw-shaped teal/brass medallion holding the prize. Strongest CatCoin character. [Full phone still](CP-25-evidence/pickup-concepts/B-paw-medallion-phone.png).
- **C — Scalloped reward badge:** cream scalloped edge, pale mint centre and coral ribbon. Most playful collectible/sticker direction. [Full phone still](CP-25-evidence/pickup-concepts/C-scalloped-badge-phone.png).

Real-game canvas screenshots at1080×2400; same Board3 state and original cheese sprite/scale across all three. Background dimmed consistently. Concepts are code-native UI drawing, not generated images or edits to approved art. No new text in the popup. No animation/sound changes or publication. `work/cp25/pickup-concepts/preview.cjs` overrides drawing in memory only. [Preview notes](CP-25-evidence/pickup-concepts/preview-notes.json) record identical UAT JSON hashes before/after. Choose a visual direction before implementing it.
'''
t=t.replace(old,new).replace('## Translucent modal pickup','## Current UAT10 modal — rejected visual draft');f.write_text(t,encoding='utf-8')
for name in ['SPEC.md','DEVELOPER.md']:
 f=r/name;t=f.read_text(encoding='utf-8');pos=t.index('\n\n')+2
 note='Design review only: Jenny rejected the UAT10 popup appearance. Three real-game static concepts (card, paw medallion, scalloped badge) are ready in tickets/CP-25-evidence/pickup-concepts/; drawing override in work/cp25/pickup-concepts/preview.cjs. No new publication or runtime change; choice pending. See tickets/CP-25.md.\n\n'
 f.write_text(t[:pos]+note+t[pos:],encoding='utf-8')
print('Three still concepts recorded; choice pending and UAT10 unchanged')
