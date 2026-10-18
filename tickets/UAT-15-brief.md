Name this conversation "UAT-15 Automatic game updates". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: game updates reach the phone without my help.
- Both apps read their saved OneDrive file, but OneDrive on Android serves a stale copy until I refresh it there or re-pick the file. So a newer build shows "You're up to date" and nothing is offered on opening.
- Getting PROD-03 onto production showed many update screens in a row. One new build = one offer.
- The ↻ button (top right) shows only in Developer mode; Settings > Check for updates stays.

Don't change: gameplay, art, sounds; saves and settings; which file each app reads; production (UAT only).

Done when, with evidence:
1. Opening the UAT app offers a newly published build by itself, without OneDrive or picking a file, also after a phone restart.
2. Accepting shows no more update screens; declining doesn't loop.
3. Check for updates finds it the same way.
4. ↻ hidden unless Developer mode is on.
5. Saves and settings survive, including any reinstall.

Regression checks (report only if something fails): both boards still win without powers; no drawing slowdown.

First tell me your approach and whether it needs a one-time reinstall, and wait for my OK. No USB/ADB. Report in tickets\UAT-15.md.
