# PROD-06 Promote CP-49 to CP-52 (UAT 70) to production

Name this conversation "PROD-06 Promote UAT 70". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md
(read "Channels and publication" closely) and CODEX_BRIEF.md. You are the engineer; Claude PM reviews.

**Sign-off:** Jenny, Nov 16, 2026: "promote CP-49, CP-50, CP-51, CP-52 to production." Each was signed off on its UAT:
- CP-49 Clean Home screen (UAT 66)
- CP-50 Simple first board and readable prizes (UAT 67)
- CP-51 Drop speed and Pause, with its fix (UAT 69/70)
- CP-52 Prize art: feather, ball, cushion (UAT 69)

**Scope:** exactly 2026.11.16 UAT 70 (20261116200000), which is those four on top of production's Baseline 1. Source:
`work/cp70/` (see tickets/CP-51.md). Production now: 2026.11.15 (20261115224800), APK17; see tickets/PROD-05.md for
how it was built.

## Do
1. **Back up production first** (`backups/`, as PROD-05 did). Never touch signing keystores in the shared project.
2. **Build production from UAT 70's game source** with production identity:
   - app ID com.jenny.catpusher, `phone/CatCoinPusher-game.json`, the production update URI, production save keys and
     settings;
   - don't copy the UAT JSON wholesale or carry any UAT channel identity across;
   - the game version must be strictly higher than production's;
   - game-only. If the native app would need to change, stop and tell the PM.
3. **Test tools off in production:** Developer never on, no "Test this build" panel, no MODES, no perf readouts.
   Verify with Developer off on every changed screen (Home, round with the goal row and Pause, end card, Album,
   Kitchen).
4. **Save continuity:** a copy of a production 2026.11.15 save upgrades cleanly. Level progress, coins, inventory,
   pantry and Album carry over.
5. **Cloud check:** verify a fresh cloud download of `phone/CatCoinPusher-game.json` matches what you published. UAT
   stays untouched.
6. **Close-out to GitHub** (C:\Users\jenny\GitHub\cat-coin-pusher):
   - `git switch main`, bring in the source, and commit with a message naming "CP-49, CP-50, CP-51, CP-52, PROD-06";
     then push;
   - never commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*`, keystores, APKs, WAVs, or anything
     .gitignore excludes;
   - switch the repo back to `wip/uat` afterwards.

## Report
Top of `tickets/PROD-06.md`:
- what was promoted, the production version and the backup path;
- the cloud check, the Developer-off check, the save-upgrade test and the commit hash;
- a short phone check for Jenny: what she should see in the production app.

Then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Don't start any other work.
