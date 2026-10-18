Name this conversation "PROD-03 Promote UAT-08, 11, 12, 13". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: Promote the published UAT build 20261015195300 to production. I've signed off on everything in it: UAT-08 (timing-based landing with its rework and continuous-fall follow-up), UAT-11 (UAT-10's stretch backed out), UAT-12 (Board 1 has 220 coins) and UAT-13 (messages off the cat's face, readable over coins).

Don't change: anything about that build's play or look; production's own name, app identity, saves, settings and signing key; UAT. Testing tools stay behind Developer mode. Nothing published to UAT after 20261015195300.

Done when, with evidence:
1. Production plays and looks the same as UAT 20261015195300, apart from the usual production-only differences (list them).
2. Board test results match that UAT build's.
3. The production app offers the update by itself.

Regression checks (report only if something fails): saves and settings carry over; no drawing slowdown.

Back up first, then publish to production directly (no preview needed). Report in tickets\PROD-03.md, and tell me what to check on my phone.
