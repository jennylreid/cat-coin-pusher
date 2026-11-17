# CP-59 Cascade freeze: investigation (Jenny, Nov 16)

Name this conversation "CP-59 Cascade freeze". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md (frozen
pickup) and CODEX_BRIEF.md. You are the engineer; Claude PM reviews.

**Jenny (Nov 16, UAT 70, Level 3 "At the back", Pixel):**
- "It's just spilling prize after prize over and over in total chaos."
- "It's a bug, but it goes absolutely bonkers. I was able to go to the home screen, and then that cleared it. But it was
  frozen in terms of gameplay."
- She finds it fun: "maybe we should actually use it as functionality for some sort of major win, but it will also have
  to turn off at some point."

**Evidence:**
- Screenshots: `Screenshots/uat70-cascade-{1,2,3}-2026-11-16.webp`.
  - The timer is stuck at 0:06 in all three.
  - Coins go 194 → 137 → 99, and the lightning power count 6 → 4 → 0.
  - Coins pour from the cat's mouth.
  - "COIN RAIN ×5", "BONUS PRIZE!", "BONUS QUAKE", "+12 COINS!" and "Just the fish biscuit!" overlap.
  - The board is flooded with rain coins, power coins and prizes.
  - 10 fps, physics 64 ms.
- Her performance log: `tickets/uat70-cascade-log-2026-11-16.json` (copy of `uat/CatCoin-UAT-performance.json`, sent
  15:48).
- Earlier sighting: Nov 12 ("the board went crazy, prizes falling all over"; tickets/CP-23-notes.md "Cascade").
- Production 2026.11.16 runs the same game as UAT 70, so it can happen there too.

## Do: investigation only (no game, UAT or production changes)
1. **Find what starts it and what keeps it going.** Read the log, then reproduce in the harness (`work/cp43/harness.cjs`;
   source `work/cp70/release.html`) on Level 3.
   - Which events chain into each other: bonus drops, coin rain, power coins, the Dance break bank, the end-of-round
     logic, auto-used powers?
   - Why do the timer and the round stop?
   - Why do coins and powers drain?
2. **Say whether production is affected,** and how likely it is in normal play.
3. **Propose the fix** that stops the chain and the freeze. Keep it simple and don't change the frozen pickup.
4. **Propose a "Jackpot" version** for Jenny to decide on separately:
   - a rare, deliberate trigger;
   - a fixed duration with a clean end;
   - a cap on pieces, so it doesn't drop to 10 fps on her phone.
   Rate how complex it is (simple / medium / complex).

## Report
Top of `tickets/CP-59.md`: cause, production impact, proposed fix, Jackpot proposal. Then message the PM (session
`local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never grep or print the 49 MB game JSON files.
