Name this conversation "OPS-02 Readable build names". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: I can read which build I'm on at a glance.
- Builds show as "20261015195300", which I can't read, and the footer text is too small and faint to read on the phone.
- Name builds by date like FinTracker: UAT "2026.10.15 UAT 1", "2026.10.15 UAT 2"...; production "2026.10.15", then "2026.10.15.2" for a second release that day. Production releases carry no "UAT".
- Use the same names wherever builds are shown or reported: the in-game footer, update screens, and your reports.

Don't change: the hidden number the updater compares (updates must keep working); gameplay, art, layout otherwise; saves and settings; production (UAT only for now).

Done when, with evidence:
1. Phone-sized before/after of the footer: the name is easy to read over the background.
2. Update screens show the readable name.
3. Updates still install in order with the new names.

Regression checks (report only if something fails): both boards still win without powers; no drawing slowdown.

Show me the before/after and wait for my OK before publishing to UAT. Report in tickets\OPS-02.md.
