# CP-61 No forced slowdown; fewer rain coins (Jenny, Nov 16)

Name this conversation "CP-61 No slowdown, fewer rain coins". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow
AGENTS.md (frozen pickup) and CODEX_BRIEF.md; read tickets/CP-51.md (the 120-piece "Board full" slow-down and its bot
numbers) and tickets/CP-48.md (rain past 100 lands as gold 5s; merging at 130). You are the engineer; Claude PM reviews.

**Jenny (Nov 16, Level 3, UAT 73):**
- "I'm getting slowed down ... You can't slow down gameplay. It's just not acceptable. ... from a player's
  perspective, it's a bug."
- "I saw an awful lot of rain coins."
- "We have to reduce the number of rain coins if the number of coins on the board is the problem."
- "If performance is an issue, we can talk about mitigation strategy, but you can't just slow down the game."
- No paying rain into the coin count: rain coins always fall on the board. There are just fewer of them.

## Do
1. **Remove the forced slow-down entirely.** There is no "Board full" throttle and no drop-rate cap, ever. Drops come at
   CP-51's normal speeds (hold 0.40 s, taps up to 4/s).
2. **Cut rain coins about in half overall:**
   - fewer coin rains per round;
   - smaller rains;
   - bonus drops that bring rain coins: fewer;
   - fewer still when the board is crowded.
   List every source of rain coins (coin rains, bonus drops, Dance break bank, wheel, powers) with old and new numbers.
3. **Backup mitigations,** only if needed to keep it smooth:
   - more gold 5s instead of many plain coins (CP-48's merge, earlier);
   - check that resting coins "sleep" in the physics engine, and tune it if not.
   Nothing that slows play.
4. **Measure per level, UAT 73 against the new build:**
   - peak pieces on the board;
   - physics ms per tick at the peak;
   - rain coins per round;
   - bot win rate and time left (hold and taps, as in CP-51).
   If a level still floods, propose options for the PM to take to Jenny; don't add a throttle.

## Don't touch
The pickup (frozen), CP-59's cascade fix, CP-57's sounds (being published as UAT 74), art, layouts and goals.

## Publishing
Build on the latest UAT. Wait until the PM confirms that CP-57's UAT 74 is out, then publish the next UAT with the usual
steps. Production stays untouched; it will be promoted with the next production update.

## Report
Top of `tickets/CP-61.md`: the sources list, the numbers, a short phone test plan for Jenny with a sign-off line. Then
message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Never grep or print the 49 MB game JSON files.
