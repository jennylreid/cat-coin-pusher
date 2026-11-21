# PROD-11: production update to 2026.11.20.2 (UAT 135 alone), published Nov 21

**Published 2026.11.20.2 / APK17, numeric 20261120230000** (was 2026.11.20, 20261120200000).
- Game-only update for the installed production app; native unchanged, no new APK. Source: published UAT 135
  (`work/cp135-bundle/release.html`, sha 8efe1830...ddf4). UAT 136 and later are not included.
- Jenny's sign-off (Nov 20, via the PM): "I'm going to say yes to 135 on production. And I can send that command on PC
  when you have it ready for me."
- Jenny ran `work/prod11/publish.ps1` herself (09:02, Nov 21).
  - Backup: `backups/before-PROD-11-20261120230000`.
  - Local publication verified (`PROD-11-evidence/publication.json`).
- Cloud copy verified (`PROD-11-evidence/cloud-verification.json`, 09:03):
  - fresh anonymous download, 47,830,436 bytes, sha256 34cff930...d23e (= the staged JSON);
  - channel catpusher, com.jenny.catpusher, apkVersion 17, 76 runtime files;
  - index.html = the production build (b6758163...2ffa).
- GitHub `main`: commit **5151911** (main + only the PROD-11 scope: production build as root index.html, work/prod11, work/cp135-bundle, UAT 135 and PROD-11 evidence, ROUND-135, CP-100, .gitignore).
- **Phone receipt pending Jenny** (check below).

## What production gets (ROUND-135, `tickets/ROUND-135.md`)
1. Prizes keep coming: when only a few prizes are left, new ones drop in through the existing drop-in, so a board never runs
   dry. The frozen pickup is unchanged.
2. Never the same board twice in a row (PLAY and NEW BOARD).
3. Level boards are UAT only, like Goal boards: off on this production-named build.
4. The board's own Home button is gone (the pause menu has Home); the top bar no longer overlaps settings or the Dance meter.

## Production adaptations (`work/prod11/prepare.py`, same set as PROD-10)
- Build name `2026.11.20.2` and title CatCoin.
- Storage keys `catpusher.uat.*` -> `catpusher.*`, so production saves stay production's.
- Settings without the log-file buttons; test previews and the local performance log only with Developer on.

## Channel identity (`work/prod11/stage.py`)
- Production's envelope is kept: channel `catpusher`, `com.jenny.catpusher`, apkVersion 17, `apk` empty, no UAT field. The
  version is strictly higher.
- Runtime: production's 76 files; only index.html changes (the other 75 match production byte for byte; none added or dropped).

## Checks
- **UAT 135 full regression:** 28 of 28 green after test-only updates for the intended changes
  (`tickets/CP-100-evidence/uat135/regression`).
- **Production checks** (`work/prod11/checks.cjs`, all pass; `tickets/PROD-11-evidence/checks.json`): Developer off; Settings
  without test tools or "UAT"; Oct 31 and 2026.11.20 saves carry over and play.
- **Real-browser boot check** (`tickets/PROD-11-evidence/bootcheck.json`): boots to the title and a round with no errors.

## Git
- `.gitignore`: Jenny's personal photos and art references (`photos-private/`, `art-moodboard/`) never go in Git.
- Main gets only this scope: root index.html = the production build, `work/prod11` (no game JSON or boot folder),
  `work/cp135-bundle` sources, the PROD-11 and UAT 135 evidence, ROUND-135, CP-100 and CP-92 as of the UAT 135 checkpoint,
  and the `.gitignore`/`checkpoint.py` change. No third-party art, photos-private or ignored files.

## Phone check (Jenny, production app)
Open the production CatCoin app and let it update.
1. The version in the corner reads **2026.11.20.2**.
2. Your levels, stars, coins, Catnip, pantry, Album and cats are all still there.
3. Play a board down to its last prizes: new prizes drop in.
4. NEW BOARD a few times: never the same board twice in a row.
5. No Level boards or Goal boards list; no Home button on the board (Home is in the pause menu); the top bar is clear.
```
PROD-11 production 2026.11.20.2 (device: Pixel / Nothing): 1 version pass / fail; 2 progress kept pass / fail; 3 prizes keep coming pass / fail; 4 no repeat board pass / fail; 5 no Level boards, no board Home button, top bar clear pass / fail.
```
