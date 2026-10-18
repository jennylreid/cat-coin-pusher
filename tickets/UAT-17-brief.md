Name this conversation "UAT-17 Tickle the paws". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: when the cat is resting (after Board Clear), tapping either paw makes it do a little happy dance: a small delight between boards.
- Short (about 1 to 2 seconds), cute and on-model, then back to the rest pose.
- Tapping again replays it; rapid taps never stack up or break it.

Don't change: what taps do during play; the Board Clear flow and its buttons; the cat's approved art and other poses; boards and gameplay; production (UAT only).

Done when, with evidence:
1. Phone-sized clip of the dance.
2. Paw taps at rest never drop a coin or start or skip a board.
3. During play, taps on the paw area behave exactly as today.
4. The cat always ends in the approved rest pose, including after rapid taps.

Regression checks (report only if something fails): both boards still win without powers; no drawing slowdown.

First show me 2 or 3 dance ideas as short clips and wait for my pick, then wait for my OK before publishing to UAT. Report in tickets\UAT-17.md.
