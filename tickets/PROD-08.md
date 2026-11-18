# PROD-08: production update to 2026.11.17 (UAT 89 scope), published Nov 17

**Published 2026.11.17 / APK17**, numeric **20261117200000** (was 2026.11.16.2, 20261116235000). Game-only update for the
installed production app; native unchanged, no new APK. Jenny's go (Nov 17): "CP-62 passes. Production update: go with
CP-54, 56, 57, 58, 61, 62, 63, 64, 69." **Phone receipt pending Jenny.**

## Scope check: passed
- **Chain:** UAT 70 (PROD-06's source) → 71 → … → 83 → 84 → 85 → 87 → 88 → 89. Each build pins the one before it by hash, and
  every release.html still matches its manifest. UAT 86 was never published; it is CP-64's source inside UAT 87.
- **By ticket:**
  - CP-54 (UAT 71): coin landing recording plus real filler.
  - CP-56 (72): five prize paintings.
  - CP-57 (74, 76): money and coin sounds, Dance music +10 dB.
  - CP-57 title (87, 88): UAT 88 removed UAT 87's switch and put production's title line back.
  - CP-61 (75, 77, 78): no slow-down, fewer rain coins, Yawn limit.
  - CP-58 (79, 82, 83, 85): Yawn with Runway face, eats food only, empty bottle.
  - CP-62 (80, 81): prize paintings and A/B/C colours.
  - CP-63 (84): Formal inspection.
  - CP-64 (87, 89): Jackpot cascade plus the Dance-meter add-on.
  - CP-69 (88): Formal inspection art.
  - CP-70 (88): Developer panel. It only runs with `S.dev`, so it is hidden with Developer off.
  - CP-59 (73): already in production.
  - Nothing else.
- **Proof:**
  - The new production index.html differs from production 2026.11.16.2 by exactly the UAT 70→89 changes, minus CP-59 and
    the build name. Diff: `PROD-08-evidence/scope-diff-uat70-uat89.txt`.
  - Runtime files: production's 39 other files are identical in UAT 89. The 30 added files are all CP-56/58/62/69 art.
  - Whitespace only: UAT 88 turned the file's CRLF line endings into LF, and 16 double-CR lines became blank lines. The
    code is unchanged.
- **Title sound:** production's own clink, one per letter. The title sound code (the `sfx.pg('coin')` line and the 5 KB
  around it) is byte-identical to production 2026.11.16.2.

## Build
- **Source:** `work/prod08/release.html`, made by `work/prod08/prepare.py` from `work/cp89/release.html`, pinned by
  `9f0ebf03…`. The build is reproducible.
- **Adaptations:** the same 17 as PROD-05/06:
  - release name `2026.11.17` and title CatCoin;
  - all `catpusher.uat.*` keys become `catpusher.*`;
  - Settings without the log-file buttons;
  - previews and the local performance log only with Developer on;
  - Developer starts off.
- **Hash:** index.html SHA-256 `098c51c9…2c96`.
- **Package:** `phone/CatCoinPusher-game.json`, 54,925,980 bytes, SHA-256 `05d080a2…dc44`.
  - Contents: 70 files (index.html, production's 39 others byte for byte, UAT 89's 30 art files byte for byte).
  - Envelope: `apk` empty, apkVersion 17, channel `catpusher`, com.jenny.catpusher. No UAT field.
  - The CP-57 sounds are embedded in index.html, as in UAT 89.

## Checks: 33 of 33 pass, plus the boot check
**`work/prod08/checks.cjs`** (17 of 17; output `PROD-08-evidence/checks-run.txt`):
- **Developer off:**
  - Settings shows only Sound effects and "Developer mode: off".
  - No MODES button or test tools on the title, Home, Kitchen, Porch, Album, Shop, cat picker, round, Pause or end card.
  - Pause works.
  - A fresh install stays Developer off and writes no performance log and no UAT, devdefault or diagnostics keys.
  - The footer reads 2026.11.17.
  - No frame errors.
  - Screens are in `PROD-08-evidence/devoff-*.png`.
- **Save carry-over:** a save made by production 2026.11.16.2 keeps Levels 1-4 and their stars, 1,234 coins, 7 Catnip,
  the pantry (treats, recipe, dish), Album (photos, stamp), two cats, rounds and sound (muted stays muted). The sound,
  pantry and music keys are byte-identical. No re-migration, and it plays Level 5.
- **Oct 31 path:** unchanged (201 → 276 coins, cheese capped at 9, Level 1, no second migration).
- **Parity:** the same scripted rounds on Levels 1, 4 and 6 end with identical boards in this build and UAT 89.

**`work/prod08/checks-uat89.cjs`** (16 of 16; output `PROD-08-evidence/checks-uat89-run.txt`):
- **CP-59:** the three lines are in. The cascade repro ends with the win at 27.5 s with 0 bonus drops, the same as UAT 89.
- **Dance breaks:** 4 Dance breaks and all 7 wheel slices (Quake, Dance again, 2× Yawn, 2× Prize you need, Jackpot) are
  identical to UAT 89 tick for tick.
- **Pickup:** seven simultaneous pickups give the same frame trace and sound calls as UAT 89, so the frozen pickup is
  identical.

**Real-browser boot** (`work/prod08/bootcheck.cjs`; output `PROD-08-evidence/bootcheck.json`):
- Headless Chrome loaded the full 70-file runtime folder: the title with art in 0.9 s, then a round in play in 4.3 s.
- No errors. BUILD reads 2026.11.17.
- The CP-62, Runway yawn, bottle art, Jackpot and meter add-on are present, the same state as UAT 89's own folder in the
  same run.

## Publication
- **Backup:** `backups/before-PROD-08-20261117200000` (production JSON and APK, CODEX_BRIEF.md, DEVELOPER.md). Hashes were
  verified before the in-place write.
- **Untouched:** the UAT JSON (UAT 89, `9ccb135f…`), the UAT APK and the production APK are byte-identical before and after.
- **Cloud:** a fresh anonymous download from the production share link (HTTP 200, 22:18) is byte-identical to what was
  published.
  - It is the same OneDrive item, ETag `{578FC2C8…},11` (was `,10`).
  - version 20261117200000, apkVersion 17 = installed, newer than 20261116235000, so the production app takes it as a game
    update.
  - All 70 files are present and the index.html hash matches.
  - Details: `PROD-08-evidence/cloud-verification.json`.
- **GitHub:** see the line at the end of this report.

## Limits
- Desktop checks don't prove phone receipt, sound or frame rate.
- The standalone `CatCoinPusher.apk` is still APK17 with the Oct 31 game. After a fresh install it offers this update.
- CODEX_BRIEF's UAT line still names UAT 88 as current. Only the production lines were updated.

## Jenny: production phone check (the CatCoin production app, not UAT)
1. Open it. It offers "Game update available: 2026.11.17 is ready". Tap Update; if it doesn't ask, go to Settings → Check
   for updates.
2. The footer reads **2026.11.17**. Your level, coins, Catnip and Album are as before.
3. Play a round:
   - Collect a prize: the cash register sound and the new prize paintings.
   - As Tuxedo, use the power button: Formal inspection, with the hat, tie, monocle and cane.
   - If the wheel lands on YAWN: the cat yawns and eats food.
4. Settings: only Sound effects and "Developer mode: off" (and Check for updates).

```
PROD-08 phone check: updated to 2026.11.17, progress kept, Formal inspection, Yawn and a prize look right, no test tools — pass
```
