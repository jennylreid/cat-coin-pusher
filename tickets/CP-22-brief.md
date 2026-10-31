# CP-22 Coin action pass

Name this conversation "CP-22 Coin action pass". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md and SPEC.md's "Locked layout (CP-21)" first.

**Baseline:** production 2026.10.27 (same game as UAT 2026.10.27 UAT 8). Source: `work/cp21/promotion/release.html` (UAT: `work/cp21/release.html`).

**Why:** on her phone, Jenny says the coins' look, shape and start board are right, but the action is wrong:
- coins still pass through each other;
- coins flip and flicker for no reason;
- rapid taps drop coins too fast and build one big pile-up.

CP-21's UAT 8 made physics coins as thick as drawn, which cut overlaps sharply (Boards 1–3: 18 / 22 / 34 overlapping pairs in 40 s, from about 200). It also noted that "some fast landings still dip in briefly"; see `tickets/CP-21.md`, UAT 8.

## Done when, with evidence
1. **No pass-through.** Coins never pass through or sink into each other, including fast drops onto a pile. Show it with the same overlap measure as CP-21 UAT 8 (target: none that last), plus a short clip of rapid drops onto a pile.
2. **No flips or flicker without a cause.** Resting and pushed coins stay flat and steady. A flip only happens when a coin propped at a slant is hit from above. Show a clip and say how you measured flicker (for example, coins whose tilt changes frame to frame while resting).
3. **Drop rate limit.** Taps can't drop coins faster than a set rate, so rapid tapping no longer makes one big pile-up. Propose the rate and say why; Jenny judges the feel on her phone. Taps beyond the limit get gentle feedback, not silence.
4. **Boards stay easy to clear** with each board's starting coin count. Re-run the 18 no-power win checks (3 boards x 3 seeds x 0.22/0.4 s taps) and compare with UAT 8 (`tickets/CP-21-evidence/wins-solid-coins-test.log`). If the drop limit changes the 0.22 s case, use the new fastest rate and say so.

## Don't touch
- Coin art, coin size, the Quake coin's look.
- The locked layout (camera, table, cat, mitts, ledge, start rows).
- Cat poses and art, powers, prizes, UI.
- Prize placement, Board 3 stacks and gutter tuning: they're a separate follow-up ticket.

## Regression checks (report only if something fails)
- The start board stays still until the first tap (CP-21 UAT 7).
- Quake still shakes the board, and coins settle flat afterward.
- Treats and prizes still ride and fall as before.
- No drawing slowdown on the desktop phone-size test.

## Publication and report
- Back up to `uat/backups/` first, then publish to UAT only, as the next "2026.10.xx UAT n" name.
- Report in `tickets/CP-22.md`: changes, the evidence above, limits, and anything Jenny should try on her phone.
- Close-out after Jenny's UAT sign-off: commit and push to C:\Users\jenny\GitHub\cat-coin-pusher with a message naming CP-22.
