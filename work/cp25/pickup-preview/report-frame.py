from pathlib import Path
p=Path('tickets/CP-25.md');s=p.read_text(encoding='utf-8');note='''# CP-25 pickup preview revision — decorative frame (October 30)

Jenny rejected the three halo/orbit/bloom stills and requested “a nice frame of sorts.” [New phone-size still](CP-25-evidence/pickup-preview/frame-phone.png): teal frame with fine gold edging, corner scrolls and a small crest; approved cheese art centred within it, blurred game behind, no text. Proposed fade-in/hold/fade-out, one chime and queue remain. Preview only (`work/cp25/pickup-preview/frame.js`, `render-frame.cjs`); no game build or UAT publication. Await Jenny's visual approval before implementation. UAT16 lag candidate and its pending phone acceptance are unchanged.

---

''';p.write_text(note+s,encoding='utf-8')
