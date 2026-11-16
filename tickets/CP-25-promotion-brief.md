# Promotion: CP-22, CP-25 and CP-26 to production

Name this conversation "CP-25 promotion". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md and the top of `tickets/CP-25.md`.

**Goal:** promote UAT 24 to production as one release. Jenny, Oct 30: "Release to production once UAT 24 installs." Her phone install of UAT 24 is confirmed before this brief is served. Production is a state, not a separate ticket: report at the top of `tickets/CP-25.md`.

**Source:** 2026.10.30 UAT 24 / APK7, numeric 20261030205840; `work/cp25/installer-fix/release.html`, native `work/cp25/installer-fix/android`. Current production: 2026.10.27 / APK16, numeric 20261027120233; `work/cp21/promotion`, native `work/prod04/android`.

**What goes out:** CP-22 coin action, CP-25 playable loop (purse, board to board, inventory, collections, hold to drop, lag fix), CP-26 Calm face. Jenny knows the Paw pickup and the changed coins per board ship as they are; CP-27 and CP-28 follow them up. No other changes: don't fix or tune anything here.

## Decide and say
- **Does this need a new production APK?** If it does, build a signed one with a higher version than APK16, using production's own signing key, and tell Jenny exactly what to do on her phone.
- **Does production need the native changes?** The `versionCode()` fix and the update policy matter here. Say what you carried over and why. The OneDrive log file connection is UAT tooling: leave it out of production or put it behind Developer mode, and say which.
- **Update file size and shape.** UAT 20 crashed Jenny's phone while offering an update because the file carried the runtime twice. UAT 23 showed a missing-installer error because an APK was offered with no installer bytes. Work out what production's currently installed APK16 can read, and make sure neither can happen. If a production update can't be delivered safely in-app, stop and tell Jenny before publishing.

## Done when, with evidence
1. Production plays the same as UAT 24, apart from the production-only differences, which you list.
2. Board results match UAT 24's (18/18 clears).
3. Production carries a date name newer than 2026.10.27 and shows it in the footer and on the update screens.
4. A fresh cloud download of the production file (and APK, if there is one) matches what you staged.
5. An existing production save opens on the new build: sound setting and current board carry over, and the player gets a sensible starting purse. Say what happens to the old per-board coin allowance. The loop save key must be production's own, never `catpusher.uat.*`.

## Don't touch
- UAT: its app, update file, saves and APK.
- Production's app ID (`com.jenny.catpusher`), signing key and update URI. Use `phone/` and `CatCoinPusher.apk`, never `uat/`.
- Anything about the play or look of the build. Testing tools stay behind Developer mode, and the automatic performance log stays out of normal player view.

## Regression checks (report only if something fails)
- Automatic update from the production file still works.
- No slowdown compared with UAT 24.

## Steps
Back up to `backups/` first, then publish to production directly. Phone receipt is Jenny's: say exactly what she should see.

**Close-out:** commit and push to C:\Users\jenny\GitHub\cat-coin-pusher with a message naming CP-25. The source through UAT 24 is already there (289aab5). Do not commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes. Update CODEX_BRIEF.md to the new production baseline.
