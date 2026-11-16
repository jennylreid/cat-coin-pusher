# PROD-06: CP-49, CP-50, CP-51, CP-52 (UAT 70) promoted to production (November 16, 2026)

**Published 2026.11.16 / APK17**, numeric **20261116171500** (was 2026.11.15, 20261115224800): exactly 2026.11.16 UAT 70
(20261116200000) = Baseline 1 + CP-49 Clean Home screen, CP-50 Simple first board and readable prizes, CP-51 Drop speed
and Pause (with its fix: END ROUND, Level 1 cheese/shrimp spots), CP-52 feather, ball and cushion art. Jenny's go (Nov 16):
"promote CP-49, CP-50, CP-51, CP-52 to production." **Phone receipt pending Jenny.**

**What changed for production (only these):** source is UAT 70's `work/cp70/release.html` (pinned by hash `8cf3e466…`),
built by `work/prod06/prepare.py` into `work/prod06/release.html` (reproducible): the same 17 production adaptations as
PROD-05, unchanged (release name `2026.11.16`, title CatCoin, the 33 `catpusher.uat.*` keys → `catpusher.*`, Settings
without the log-file buttons, previews and the local performance log only with Developer on; Developer starts off).
No play, art, balance, pickup or sound change from UAT 70. index.html SHA-256 `828684ac…88150e`.

**Delivery:** game-only update for the installed production app (APK17; native unchanged, no new APK).
`phone/CatCoinPusher-game.json` (52,054,919 bytes) holds the complete 40-file runtime in `files`, `apk` empty, channel
`catpusher`, com.jenny.catpusher, production update link unchanged: 36 files are APK17's own assets byte for byte (also
identical in UAT 70), the three CP-52 paintings `img/art/cp52-{feather,ball,cushion}.png` are UAT 70's byte for byte, plus
index.html. APK17's updater writes every file listed in `files` (checked in its `unpackGame`), so the new PNGs need no native
change. No UAT field carried over. JSON SHA-256 `7c39b1e194d88c5d017f1fc2d019fe18bf051dd1c60803a5005d0ecf028b9cc1`.

**Backup:** `backups/before-PROD-06-20261116171500` (production JSON and APK, CODEX_BRIEF.md, DEVELOPER.md), hashes verified
before the in-place write. Production APK, UAT JSON (UAT 70) and UAT APK byte-identical before and after.

**Cloud check:** a fresh anonymous download from the production share link (HTTP 200, 17:07) is byte-identical to what was
published (same SHA-256, 52,054,919 bytes, same OneDrive item: ETag `{578FC2C8-…},9`, was `,8`). Its contents pass the
production app's own checks: channel/app ID, apkVersion 17 = installed, version newer than 20261115224800 → offered as a game
update; index.html, lib/rapier.js and the three CP-52 PNGs present; index.html hash matches the build.
([cloud](PROD-06-evidence/cloud-verification.json), [publication](PROD-06-evidence/publication.json),
[package](PROD-06-evidence/package-verification.json))

**Developer off (desktop, real runtime):** Settings shows only Close, Sound effects and "Developer mode: off" (plus Check for
updates inside the app); no Test this build panel, previews, dials, log buttons or "UAT". No MODES button and no readouts on
the title, Home, Kitchen, Porch, Album, Shop, cat picker, a round with the goal row, the Pause pop-up (RESUME / END ROUND;
resume works) and the end card; footer 2026.11.16 ([screens](PROD-06-evidence/devoff-contact.png)). A fresh install stays
Developer off; a played round writes no performance log; only `catpusher.*` keys are saved. With Developer on the test tools
are still there. No frame errors.

**Save upgrade:** a save made by the published 2026.11.15 game (`work/prod05/release.html`) with Levels 1–4 passed and stars,
1,234 coins, 7 Catnip, treats in the pantry, a recipe and dish, Album photos and a stamp, two cats open, muted: opened on the
new build, every one of those is identical, no re-migration, sound stays muted, Developer off, and it plays Level 5. The sound,
pantry and music keys are byte-identical; the old-board key keeps its coins and treats exactly as the 2026.11.15 game itself
rewrites it on reopening. The Oct 31 save path still works as in PROD-05 (201 coins → 276, cheese capped at 9, Level 1).
**Parity:** the same scripted rounds on Levels 1, 4 and 6 end with identical boards in production and UAT 70.
[checks](PROD-06-evidence/checks.json): 17/17 pass.

**GitHub:** COMMIT_LINE

**Limits:** desktop checks don't prove phone receipt, sound or frame rate. The standalone `CatCoinPusher.apk` is still APK17
with the Oct 31 game bundled; a fresh install from it then offers this game update. UAT untouched.

**Jenny — production phone check (the CatCoin production app, not UAT):**
1. Open it. It offers "Game update available: 2026.11.16 is ready". Tap Update (if it doesn't ask, Settings → Check for updates).
2. Home: no coin pile under PLAY, a smaller PLAY button, footer **2026.11.16**. Your level, coins and Album are as before.
3. Play a round: the goal icons sit above the cat's head; the Pause button opens RESUME / END ROUND.
4. Look for the new feather, ball and cushion paintings on a board or in the Album.
5. Settings: only Sound effects and "Developer mode: off" (and Check for updates). No MODES, no test panel, no numbers in the corners.
6. Close and reopen the app: coins and level kept.

```
PROD-06 phone check: update to 2026.11.16 applied, clean Home, goal row and Pause, new prize art, no test tools, progress kept — pass
```

---

