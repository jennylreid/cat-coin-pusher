# CP-45 A/B: main screen vs. board view (UAT 55)

Same CP-45 engineer, after UAT 54 (title polish) is published. Read GAMEPLAY_MAP.md sections 12 and 13 (the keep
list) and the private reference `Screenshots/ref-pixelflow-main-2026-11-14.webp` (for the *principle* only; never copy
its look, never commit it).

**Why:** Jenny, Nov 14: UAT 49's Home "looked like everything had equal weight when it really didn't". She wants one
clear thing to do, where you are and how hard it is, and everything else quiet at the edges. "CatCoin needs to have a
cat and coins right away." She wants to *experience* two versions and pick (A/B).

## Both variants share one hierarchy (between rounds)
1. **One dominant PLAY** (big, obvious; replaces TAP TO START between rounds).
2. **Level and difficulty on it:** "Level n" plus a difficulty tag (Normal / Hard / Super hard). Placeholder tags per
   board are fine for now (a Developer dial per board); say how you set them.
3. **The goal right there:** e.g. "Collect these 6" with the prize icons.
4. **Everything else small, at the edges:** Kitchen, Porch, Album, Shop, Boards as small buttons in side columns,
   each with a "!" badge when something waits there. They follow the existing unlock rules. They must look clearly
   secondary to PLAY.
5. **Top:** level/XP, coins, Catnip, Settings (as now).
6. Our own look: CatCoin's cat, coins, colours and code drawings. Nothing styled after the reference.

## The two variants (Developer switch "Home layout: A main screen / B board view", default A)
- **A, main screen:** after the title screen, a screen built around the cat and coins (e.g. the floating cat head
  and a pile or rain of coins), with the hierarchy above. PLAY goes onto the board and starts the round. After a
  round, the end card's next step returns here.
- **B, board view:** no extra screen. Between rounds you're on the coin board, which keeps moving behind, and the
  hierarchy sits in the goal card's area (cat's face stays clear). This replaces the current top bar's row of five
  equal buttons.
Switching the dial takes effect at once (or on the next round end), so Jenny can compare on the phone.

## Don't touch
- The keep list (GAMEPLAY_MAP.md section 13): the busy board, the frozen pickup, the Dance break, the side games,
  the Yawn, the title intro (as polished in UAT 54), board messages, the floating cat head, Quake.
- Rule 2: nothing over the cat's face. No buttons in the bottom strip. Developer off = production view.
- No flow or progression changes (unlock order, recipes, porch) beyond showing them in the new layout.

## Report
Top of `tickets/CP-45.md`: frames of A and B side by side (fresh save, a mid-progress save with "!" badges, Developer
off), how the difficulty tags are set, limits. Publish as UAT 55 the usual way, then message the PM.
