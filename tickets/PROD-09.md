# PROD-09: production update to 2026.11.18 (UAT 105 scope), published Nov 18

**Published 2026.11.18 / APK17**, numeric **20261118200000** (was 2026.11.17, 20261117200000). Game-only update for the
installed production app; native unchanged, no new APK. Jenny's go (Nov 18): "Let's get this stuff to production before we
continue to update UAT." after the PM listed CP-71, 72, 73, 75, 78, 80, 82. Jenny ran the publish script herself (the
engineer session's permission check blocked it). **Phone receipt pending Jenny.**

**Phone check (Jenny):** open the production CatCoin app and let it update.
1. The version in the corner reads **2026.11.18**.
2. Your levels, stars, coins, Catnip, pantry, Album and cats are all still there.
3. Orange board, Zoomies: title first, then the kittens; the ginger one puffs, hangs back, peeks over the bottom edge and ducks away. No gold streaks.
4. The Yawn on a non-Tuxedo cat (e.g. Orange) shows that cat's own yawn face.
5. Tuxedo board, Formal inspection: the cane is held in the mitt.
6. Behind the cat only stars and background art; the board edge is a solid rim.
```
PROD-09 production 2026.11.18 (device: Pixel / Nothing): 1 version pass / fail; 2 progress kept pass / fail; 3 Zoomies pass / fail; 4 Yawn face pass / fail; 5 cane pass / fail; 6 clean board pass / fail.
```

## Scope check: passed
- **Chain:** UAT 89 (PROD-08's source) → 90 → 91 → … → 103 → 104 (`work/cp104-lab`, the published one; `work/cp104` is an unpublished
  staging) → 105. Every release.html matches its manifest, and every build rebuilds byte for byte from its base plus its
  recorded edits and blocks (UAT 90 applies one edit four times and appends its two blocks together, as its build.py does).
- **By ticket:**
  - CP-71 (UAT 90): Yawn knocks coins, never eats them.
  - CP-73 (90, 92, 93): Formal inspection's words big and first; cane held in the mitt.
  - CP-72 (91, 94, 96, 98, 99, 100, 101, 102, 105): Zoomies; title first; no gold streaks; the small peek-a-boo ending (the
    only one); Level 7 side guard; today's Zoomies sound. The UAT 98-100 close-up and choice code is dead (only Peek-a-boo
    and today's sound can be chosen; their Engineer tools boxes are skipped).
  - CP-75 (95): each cat's own Yawn face (8 new art files).
  - CP-78 (97): board clean-up.
  - CP-80 (99): Developer-only Siamese wheel fix.
  - CP-82 (101): Sonic meow and Tortitude show their name first.
  - Developer-only (hidden with Developer off): CP-79 yawn-sound choice (default Today), CP-83 board lab with Tower fall
    (default Today) and the timing strip (default Off; the lab board pick isn't saved), Engineer tools, and the "Test this
    build" header now showing the current build.
  - Nothing else. The title sound code is unchanged since UAT 89 (production's title line).
- **Proof:** diff of production's source and UAT 105: `PROD-09-evidence/scope-diff-uat89-uat105.txt` (+943 / -25 lines). Runtime
  files: production's 69 other files are byte-identical in UAT 105; the 8 added files are the CP-75 yawn faces and eyes.
- Line endings: the file is LF; two appended JS blocks (UAT 102's peek, UAT 103's lab) carry CRLF lines, left as they are.

## Build
- **Source:** `work/prod09/release.html`, made by `work/prod09/prepare.py` from `work/cp105/release.html`, pinned by `d08597d1…`.
  Reproducible.
- **Adaptations:** the same 17 as PROD-05/06/08: release name `2026.11.18` and title CatCoin; all `catpusher.uat.*` keys become
  `catpusher.*`; Settings without the log-file buttons; previews and the local performance log only with Developer on;
  Developer starts off.
- **Hash:** index.html SHA-256 `34b7db2b…a691`.
- **Package:** `phone/CatCoinPusher-game.json`, 58,803,924 bytes, SHA-256 `ae4564ad…1bb4`: 78 files (index.html, production's 69
  others byte for byte, UAT 105's 8 CP-75 art files byte for byte). Envelope: `apk` empty, apkVersion 17, channel `catpusher`,
  com.jenny.catpusher. No UAT field.

## Checks: 41 of 41 pass, plus the boot check
**`work/prod09/checks.cjs`** (18 of 18; `PROD-09-evidence/checks-run.txt`):
- Developer off: Settings shows only Check for updates, Sound effects and "Developer mode: off"; no MODES button or test tools on
  any screen; Pause works; a fresh install stays Developer off and writes no performance log and no UAT, devdefault or
  diagnostics keys; the footer reads 2026.11.18; no frame errors. Screens: `PROD-09-evidence/devoff-*.png`.
- Save carry-over: a save made by production 2026.11.17 keeps Levels 1-4 and stars, 1,234 coins, 7 Catnip, the pantry, Album,
  two cats, rounds and sound (muted stays muted); sound, pantry and music keys byte-identical; no re-migration; plays Level 5.
  The Oct 31 path is unchanged.
- Parity: the same scripted rounds on Levels 1, 4 and 6 end with identical boards in this build and UAT 105.

**`work/prod09/checks-uat105.cjs`** (23 of 23; `PROD-09-evidence/checks-uat105-run.txt`), Developer off, against UAT 105:
- CP-59 lines in; the cascade repro ends with the win, no bonus drops.
- Dance breaks and all wheel slices identical tick for tick.
- Frozen pickup: seven simultaneous pickups give the same frame trace and sound calls.
- Spot checks: Formal inspection (Tuxedo), Zoomies (Orange), Sonic meow (Siamese) and Tortitude (Tortie) identical tick for tick
  and end cleanly; the Yawn on the Orange and Ragdoll boards identical; the Tuxedo and Orange boards draw the same (top 85% of
  the screen; below it UAT 105 shows its Developer timing strip). `PROD-09-evidence/board-*-prod09.png`.

**Real-browser boot** (`work/prod09/bootcheck.cjs`; `PROD-09-evidence/bootcheck.json`): headless Chrome loaded the full 78-file
runtime folder: title with art, then a round in play; no errors; BUILD 2026.11.18; Developer off; all four CP-75 yawn faces
loaded; Zoomies ending peek only and today's sound; the lab off; no UAT keys. Same state as UAT 105's own folder in the same run.

## Publication
- **Backup:** `backups/before-PROD-09-20261118200000` (production JSON and APK, CODEX_BRIEF.md, DEVELOPER.md); the backup JSON is
  PROD-08's.
- **Untouched:** the UAT JSON (UAT 105, `4eb73334…`), the UAT APK and the production APK are byte-identical before and after.
- **Cloud:** a fresh anonymous download from the production share link (HTTP 200, 22:37) is byte-identical to what was
  published: the same OneDrive item, ETag `{578FC2C8…},12` (was `,11`); version 20261118200000, apkVersion 17 = installed, newer
  than 20261117200000, so the production app takes it as a game update; 78 files; index.html hash matches.
  `PROD-09-evidence/cloud-verification.json`.
- **GitHub:** committed to `main` and pushed: `5c60209` "CP-71, 72, 73, 75, 78, 80, 82, PROD-09: UAT 105 promoted to production".
  It contains the UAT 105 checkpoint tree for those tickets (work/cp90 to cp105 with cp104-lab, ticket recipes, CP-75 art), root
  index.html (the production build), `work/prod09`, CODEX_BRIEF/DEVELOPER, and this report and its evidence. Unpublished and later
  work (CP-74, CP-81, CP-84 to 86, work/cp104, cp106 onward) stays off main. WIP checkpoint: `d508788` on wip/uat.
