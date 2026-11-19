# CP-90 Zoomies kitten art (Jenny, Nov 19)

Name this conversation "CP-90 Zoomies kitten art". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md
("Art and layout": the layout is locked, art fills it, one piece at a time on the same canvas, approved art frozen) and
CODEX_BRIEF.md. Read tickets/CP-72.md (how Zoomies works today) and DEVELOPER.md's Zoomies section. You paint; Claude PM
reviews; a Claude engineer puts the art in the game afterwards.

**Today:** the two Zoomies kittens (ginger and cream) are drawn in code as stand-ins, front view. The motion is approved
and locked (production 2026.11.18): kittens run, the ginger one does its final leap, puffs up and does the small
peek-a-boo at the bottom edge.

**Jenny, verbatim:**
- Nov 17: "Zoomies refers to a really like running in circles... one or two... flips... jumping straight up in the air
  with their tail stuck out and their fur stuck out straight."
- Nov 17: "I love how the kittens at the end jump toward the player on the screen. I also love how their fur stands
  straight out. It's super cute."
- Nov 18, on a code-drawn close-up: "It doesn't look like the kitten." On a side-view crouch: "It doesn't read as cute...
  We'll stick with the original front view."
- Nov 19: "Let's send real kitten art for Zoomies over to Codex."
- References (private, never commit): Screenshots/ref-zoomies-1..5-2026-11-17.png.

## Do
- Find the stand-ins' poses, sizes and canvases in the current UAT source (Zoomies block), and paint matching pieces at
  the same size and canvas so they drop in without moving anything:
  1. Running kitten (front view), ginger.
  2. The ginger kitten puffed (fur and tail straight out), for the final leap.
  3. The peek: top of the ginger kitten's head and eyes, at the size the peek-a-boo uses.
  4. The cream kitten's running pose (the same drawing recoloured is fine if it looks right).
- One piece at a time, in that order. Cute, on-model with the game's cats (same outline and fur style as the approved
  cats), clearly kittens. Transparent PNGs.
- Show each piece composited over a real game frame at 412x915, plus the stand-in beside it for comparison, in
  `tickets/CP-90-evidence/`. Pieces go in `work/cp90-kittens/`.
- Don't touch `uat/`, `phone/`, release files or the game source. Don't build a UAT.

## Report
Write `tickets/CP-90.md` (pieces, sizes, comparisons, anything unsure) and stop.
