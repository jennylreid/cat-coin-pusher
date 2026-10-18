Name this conversation "PROD-04 Promote UAT-15, OPS-02". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: Promote the current UAT build (2026.10.15 UAT 1 / APK4) to production. I've signed off on everything in it: UAT-15 (automatic game updates; ↻ only in Developer mode) and OPS-02 (readable build names and footer).

Don't change: anything about that build's play or look; production's name, app identity, saves, settings and signing key; UAT. Testing tools stay behind Developer mode.

Done when, with evidence:
1. Production matches that UAT build, apart from the usual production-only differences (list them).
2. Board test results match UAT's.
3. Production carries a date name (PROD-03 was Oct 15's first production release) and shows it in the footer and update screens.
4. Production checks its own file (phone folder, never UAT) by the same direct route as UAT: verify from the cloud.

Regression checks (report only if something fails): sound setting carries over; no drawing slowdown.

Back up first, then publish to production directly. Report in tickets\PROD-04.md, and tell me exactly what to do on my phone for the one-time app install.
