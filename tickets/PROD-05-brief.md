# PROD-05 Promote UAT 8 to production

Jenny's sign-off, Oct 27, 2026: "Ship UAT 8 to production." Scope: the game in **2026.10.27 UAT 8** (numeric 20261027113731), which carries CP-21 (layout lock, pusher from the chin, still opening board, solid coins) plus UAT-16 to 19. Production is currently 2026.10.16 / APK16 (20261016005411).

## Goal
Production players get exactly the UAT 8 game and art, as a game-only update to the installed APK16. Change only what production identity requires.

## Inputs
- Approved game: `work/cp21/release.html` (= index.html in `uat/CatCoinPusher-UAT-game.json`, staged hash `144b731f…`). All assets come from that UAT JSON.
- Production payload: `phone/CatCoinPusher-game.json`. Previous promotion: `work/prod04/prepare.py` and `tickets/PROD-03-adaptations.json`.

## Required production adaptations (and nothing else)
- Storage keys: `catpusher.uat.board.v1` → `catpusher.board.prototype.v1`, `catpusher.uat.audio.v1` → `catpusher.audio.v1`.
- Title and Settings labels: no "UAT" wording; BUILD label `2026.10.27`.
- Powers, safe-area guides, the powers-preview HUD strip and the Dancing-pose preview stay developer-mode only, as in current production. PROD-03 adaptations no longer match the UAT 8 text one-for-one (several `from` strings are gone, and UAT already has partial `S.dev` gating). Re-derive them against UAT 8, and list each final adaptation in the report.
- Payload: keep the production envelope (`channel` catpusher, `applicationId` com.jenny.catpusher, `apkVersion` 16, the `apk` bytes unchanged). Replace `files` with the UAT 8 file set; production lacks tuna.png, the uat18-* art and the three new sounds. Version strictly above both channels.

## Checks before publishing
- **Save continuity.** A production save from 2026.10.16 loads into the new build without errors or lost wallet/collection progress, and a board in the old layout resets cleanly. Show how this was tested.
- **Updater compatibility.** APK16's `CloudUpdate` accepts the payload and installs the added files (check the code path that writes `files`; no APK rebuild expected).
- **Same game.** Diff the production html against UAT 8: only the listed adaptations differ.
- **Desktop smoke test.** All three boards start still and are winnable without powers. Powers are hidden with developer mode off.

## Publication
- Back up `phone/CatCoinPusher-game.json`, `CatCoinPusher.apk` and the docs under `backups/before-PROD-05-<version>` first, and verify the backup.
- Publish only `phone/CatCoinPusher-game.json`. UAT files and both APKs stay byte-identical.
- Verify a fresh OneDrive download of the production JSON against the staged hash.

## Close-out
- Update CODEX_BRIEF.md (production line) and DEVELOPER.md (promotion steps if they changed).
- Report in `tickets/PROD-05.md` with adaptations, checks and hashes.
- Commit and push to C:/Users/jenny/GitHub/cat-coin-pusher with a message naming PROD-05, with no reference images.
- Jenny then confirms on her phone: the update arrives, her save survives, and sound and FPS are fine.

## Don't touch
- Gameplay, art, balance or layout.
- UAT channel files.
- Native code, unless the updater check shows it can't take the payload. In that case stop and report; don't rebuild the APK.
