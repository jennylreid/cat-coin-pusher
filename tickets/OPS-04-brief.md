# OPS-04 Trim the UAT update package (Jenny, Nov 19)

Name this conversation "OPS-04 Package trim". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md
("Channels and publication") and CODEX_BRIEF.md. You are the engineer; Claude PM reviews.

**Why:** the UAT game update file (uat/CatCoinPusher-UAT-game.json) is ~59.9 MB, against the 60,000,000-byte limit in our
own stage.py scripts. New builds no longer fit. Jenny (Nov 19): "Trimming unused files in theory is fine, but it sounds a
bit dangerous." She approved the PM's plan: trim now, carefully; plan a split of the package as a separate ticket (OPS-05).

## Do (UAT only; production untouched)
- List what is in the package by size. Find files that are provably unused by the current UAT runtime (never referenced
  in code, CSS or data; superseded art, old experiments, duplicates, uncompressed copies of shipped assets). Prove each one
  unused (reference search + a real-browser run with the file removed showing no missing-asset request or error).
- Lossless re-encoding of a shipped asset is allowed only if pixel- or sample-identical. Approved art must look exactly
  the same; no quality loss on anything shipped.
- Remove only proven-unused files. Report before/after size and each removed file with its proof.
- Don't change the 60 MB guard; don't touch production or the APKs.

## Queue
UAT 118 (Sonic meow), 119 (endless board) and 120 (Orange dance) publish first. You are **UAT 121**, on 120; Sleepy
Coins moves to 122. Do the analysis now with light runs; before publishing or any heavy run, ask the PM (session
`local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). One heavy runner at a time; waking watcher on long runs.

## Report
Top of `tickets/OPS-04.md`: sizes before/after, removed files with proof, the phone test (update arrives, game boots,
quick look at each cat's board and a power, sound plays) with a sign-off line. Then the full regression set and
`python work/checkpoint.py`. Never grep or print the 49 MB game JSON files (read them only with a script that parses them).

## After that: OPS-05 plan (write only, don't build)
Write `tickets/OPS-05-plan.md`: how to split the update into a small game file plus separately cached art/sound files
(OneDrive-based, both phones, both channels), what the native updater change and new APK involve, risks, and size.
