Name this conversation "UAT-14 Keep the screen awake". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: the phone shouldn't fall asleep while the game is open in front of me. Leaving the game lets the phone sleep as usual.
- Before building, tell me whether you'd let the screen sleep after a long idle spell (e.g. 5 minutes with no taps) to save battery, and whether this needs an app install or just a game update. Wait for my answer.

Don't change: gameplay, art, sounds; saves and settings; the update system; production (UAT only).

Done when, with evidence:
1. With the game in front, the screen stays on through a long board and between boards.
2. Leaving the game (home button, other app) lets the phone sleep normally.
3. The idle rule we agree on works.

Regression checks (report only if something fails): automatic updates still offered; no drawing slowdown.

Wait for my OK before publishing to UAT. Report in tickets\UAT-14.md.
