# CP-96 Daily puzzle prototype: coin Minesweeper (Jenny, Nov 19)

Name this conversation "CP-96 Coin Minesweeper". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Read AGENTS.md and
tickets/CP-84.md (how the earlier puzzle prototypes were built and sent as phone pages). You are the engineer; Claude PM
reviews. This is a standalone side project: don't touch the game, `uat/`, `phone/` or release files.

**Jenny, verbatim (Nov 19):** "What about... Minefield or something? It usually works with numbers, but we could even do
it with colored coins, I think. Same concept." "It has that really satisfying feel. Minesweeper. That's it." "Minesweeper
should go to Claude." Earlier puzzle feedback (Codex's three): "too small to read properly... a single screen with a lot of
stuff in it... nothing satisfying happening."

## Do
- One standalone phone page (412x915 first, also fine at 360x640): classic Minesweeper rules on a grid of coins. No
  mines (nothing violent): the hidden things are sleeping cats you mustn't wake. Numbers show how many sleeping cats
  touch a coin; colour the numbers too. Tapping an empty spot opens the whole connected area at once: make that cascade
  satisfying (coins flip in a quick ripple, a coin-clink sound). Long-press (or a toggle) marks a suspected cat with a paw.
- Big, readable tiles; a small first grid (e.g. 8x8, ~10 cats) and the first tap is always safe. Win: all safe coins
  open, a happy cat moment. Lose: you wake a cat, it yawns and stretches (gentle, no explosion); one tap to retry.
- Placeholder art is fine (use the game's coin look if easy); keep it cute and simple.

## Report
Write `tickets/CP-96.md` (what it does, a screenshot at 412x915, how Jenny opens it on her phone) and stop. The PM sends
it to Jenny.
