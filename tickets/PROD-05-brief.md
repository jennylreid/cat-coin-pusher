# PROD-05 Promote Baseline 1 (UAT 64) to production

Name this conversation "PROD-05 Promote Baseline 1". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md
(read "Channels and publication" closely) and CODEX_BRIEF.md.

**Sign-off:** Jenny, Nov 15, 2026: "just push it all to production, and anything we perceive as a bug we'll fix
first." Her sign-off pass is in tickets/SIGNOFF-1.md. Then, after testing UAT 64: "Go: promote UAT 64 to production
as is." Scope: everything in 2026.11.15 UAT 64 (20261115190000): CP-24, CP-33 to CP-38, CP-40 to CP-48 (Baseline 1).
UAT 63 was never tested; don't use it. UAT 64's source: work/cp63/release.html (see tickets/CP-48.md).

## Do
1. **Back up production first** (`backups/`, as earlier PROD tickets did). Never touch signing keystores in the
   shared project.
2. **Build production from UAT 64's game source** with production identity: app ID com.jenny.catpusher,
   `phone/CatCoinPusher-game.json`, production update URI, production save keys and settings. Don't copy the UAT
   JSON wholesale; don't carry any UAT channel identity across. Game version strictly higher than production's.
   Game-only update if the native app doesn't need to change; if it does, say so and stop for the PM.
3. **Test tools off in production:** Developer never on (the UAT default-on must not apply), no "Test this build"
   panel, no MODES, no perf readouts. Verify with Developer off on every screen; this is DEVELOPER.md's
   "Developer off = production view" rule.
4. **Save continuity:** the production save (Oct 31 build, Boards 1–3) upgrades cleanly: coins and treats carry
   over (capped as in CP-45), progression starts at Level 1. Test an upgrade from a copy of an Oct 31 production save.
5. Verify a fresh cloud download of `phone/CatCoinPusher-game.json` matches what you published. UAT untouched.
6. **Close-out to GitHub** (C:\Users\jenny\GitHub\cat-coin-pusher): `git switch main` (the repo sits on
   `wip/uat`), bring in the Baseline 1 source, commit naming "Baseline 1 (UAT 64): CP-24, CP-33–38, CP-40–48,
   PROD-05", push. Never commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*`, keystores, APKs,
   WAVs or anything .gitignore excludes.

## Report
Top of `tickets/PROD-05.md`: what was promoted, the production version, backup path, cloud verification, the
Developer-off check, the save-upgrade test, the commit hash, and a short phone check for Jenny (what she should see
in the production app). Then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Don't start
any other work.
