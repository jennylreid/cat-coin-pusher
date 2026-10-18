Name this conversation "UAT-18 Quake coin". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: a fun new coin on Board 3 (built in UAT-16).
- One Quake coin with a lightning bolt, which stands out among the gold coins at a glance.
- Getting it into the tray earns 1 Quake power, which the player can see and use with no instructions. This is the first power a normal player earns; today powers exist only in Developer mode.
- Using it sets off the existing CatQuake.

Don't change: Board 3's layout, stacks, Tuna and balance; Boards 1 and 2; the cat; existing coin art; the CatQuake effect itself; Developer-mode test tools; production (UAT only).

Done when, with evidence:
1. Phone-sized screenshot: the Quake coin stands out over a full board.
2. Clip: collecting it shows 1 Quake on screen; using it quakes the board, then it's used up.
3. Board 3 still wins without powers.

Regression checks (report only if something fails): Boards 1 and 2 still win as before; no drawing slowdown.

Show me the screenshot and clip, and wait for my OK before publishing to UAT. Report in tickets\UAT-18.md.
