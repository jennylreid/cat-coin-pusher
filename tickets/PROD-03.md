# PROD-03 — Promote UAT-08, 11, 12, 13

Published production **20261015210000 / APK14** on October 15, 2026, from the exact published UAT **20261015195300 / APK2**. Jenny explicitly signed off everything in that payload and authorized direct production publication. Publication and desktop verification complete; automatic phone offer/receipt remains pending Jenny's evidence.

Promoted timing-based landing, its rework and continuous-fall follow-up, stretch rollback, Board 1's 220 allowance and approved message placement/contrast. No additional play or art edits. Pinned UAT SHA256: `95c80ce98ebdfbb57b95db44db81caecebd47c89f217a61f4ef15f5a90341726`.

## Production differences

- Production title Cat Coin Pusher and existing Board prototype 1 footer label.
- Production save key `catpusher.board.prototype.v1` and audio key `catpusher.audio.v1`.
- Existing production Developer-mode restrictions: power grants/use/buttons, safe-area guides, Happy preview and Settings testing/restart tools. Normal Settings retains sound, Developer-mode switch and native Check for updates.
- Production release version, existing production payload envelope/APK14, `com.jenny.catpusher`, existing native private preferences/update URI and signing identity.

All 23 runtime files accounted for; 22 non-HTML files byte-identical to pinned UAT. Inverting the explicit HTML adaptations reconstructs its HTML exactly. See `PROD-03-adaptations.json` and `PROD-03-release-verification.json`. Production APK bytes retained; only `phone/CatCoinPusher-game.json` published. UAT remains 20261015195300 with unchanged JSON/APK hashes.

## Board comparison

Same deterministic target-following bot, actual game script and Rapier, no powers; reran both exact payloads. Production and UAT match every recorded field, including clear times, targets and settled-idle results.

| Board | Cadence | Used / remaining | Clear time (both) |
|---|---|---|---|
| 1 (220) | 0.4 s | 118 / 102 | 46.9833 s |
| 1 (220) | 0.22 s | 99 / 121 | 21.5833 s |
| 2 (160) | 0.4 s | 88 / 72 | 34.8167 s |
| 2 (160) | 0.22 s | 113 / 47 | 24.7500 s |

All four win within timer. Evidence: `PROD-03-board-results.json`. Earlier `work/uat13/board-results-uat13.json` reflects the older pre-continuous-fall draft; these new comparisons execute the pinned published release. Developer off/on restrictions passed. Paired desktop renders: `PROD-03-production-desktop.png`, `PROD-03-uat-desktop.png` (not phone captures).

## Backup and update evidence

Verified backup before publication: `backups/before-PROD-03-20261015210000/`, containing prior production JSON, APK14 and technical docs. Published JSON SHA256: `eb470250ad8a26fb88691cd83f78c46340da4c238e5e4ab72089e1da53aeff4a`.

Existing native updater's onCreate calls loadNewest, reads the retained connected OneDrive URI and offers “Game update available” when payload version exceeds installed/bundled version. New version strictly exceeds previous production 20261013160516; no native change/reinstall needed. Source inspection establishes the automatic offer path, not OneDrive provider receipt or an actual phone dialog. Acceptance criterion 3 remains pending that device evidence.

Reproducible preparation, verification and publication: `work/prod03/{prepare,verify,publish}.cjs`. Rollback requires repackaging the backed-up production game with a fresh higher version; a lower version will not downgrade.

## Jenny's phone check

After OneDrive sync, fully close and reopen **Cat Coin Pusher**. Before using Settings → Check for updates, confirm that **Game update available** appears by itself; accept **20261015210000**. If no offer appears, report that first; manual checking is a fallback, not proof of automatic offering. Keep the existing production connection to `phone/CatCoinPusher-game.json`.

Compare landing/motion and messages with approved UAT; start/restart Board 1 for the 220 allowance. With Developer mode off, testing tools/powers should stay hidden. Report any save/settings regression or drawing slowdown during normal/full-board play. No separate phone receipt, sound or FPS claim is made from desktop evidence. Final phone acceptance remains open.
