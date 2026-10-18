# PROD-04 Promote UAT-15, OPS-02

Status: **accepted by Jenny on October 16, 2026** for production **2026.10.16 / APK16**, following the startup repair. Jenny replied “accepted” after the repaired-install instructions. PROD-04 is complete.

## Startup hotfix — October 16, 2026

Current production: **2026.10.16 / APK16**, numeric 20261016005411. Jenny reported APK15 installed but would not open. APK15's only DEX contained resource classes; `MainActivity`, its WebView bridge, `CloudUpdate` and `UpdatePolicy` were absent. This explains failure to launch. The incremental rebuild after moving Java source paths produced an incomplete APK despite compile/lint passing; original verification omitted executable-class inspection.

Rebuilt into a fresh output directory with build cache disabled and every task rerun. Compile/lint and signature verification passed. Inspected **all DEX files** in the resulting APK and asserted startup, bridge, updater and policy classes exist. APK16 includes them in classes2.dex. Exact game retained except date footer; all non-HTML assets identical. Same package, preferences, signing identity and production HTTPS address. UAT unchanged. No new gameplay scope.

Backup: `C:\Users\jenny\OneDrive\work\CoinPusher\backups\before-PROD-04-hotfix16-20261016005411`; prior APK15/JSON and docs retained. Published in place, with increased APK and game versions. Fresh cloud HTTP 200 full-byte hash matches JSON including embedded APK16. Evidence: `PROD-04-evidence/hotfix16-publication.json`, `hotfix16-dex-classes.txt`, `hotfix16-cloud-verification.json`. JSON SHA256 `8b476702dbe611dec05641e03cbc9034fe5ac17a3900062e4c3652d32df47689`; APK SHA256 `2598c25d9d53bd2d144025b719cb8dfa33a2433b59bf34fc3d3256f6443c5d7f`.

Phone recovery: download **work → CoinPusher → CatCoinPusher.apk** again from OneDrive and choose **Update** over the installed app. Do not uninstall/clear data. Re-download rather than opening the prior cached APK15. Open Cat Coin Pusher, confirm **2026.10.16** footer, then Settings → Check for updates. Jenny accepted the repaired production release on October 16, 2026; no phone logs/ADB or desktop Android launch were used.

Initial publication (superseded): **2026.10.15.2 / APK15**, failed phone launch. Jenny explicitly signed off the entire current **2026.10.15 UAT 1 / APK4** and authorized direct production publication. Phone installation/receipt remains Jenny's check.

Promoted automatic direct-cloud game updates, Developer-only ↻, readable release names and footer. No play, art or physics changes. Date sequence .2 follows PROD-03, October 15's first production release. Numeric updater version: 20261015232124.

## Production-only differences

- Cat Coin Pusher title, launcher name/icon, application ID `com.jenny.catpusher`, production install-status action and existing signing certificate.
- Existing production save key `catpusher.board.prototype.v1`, audio key `catpusher.audio.v1`, private `catpusher` preferences, game paths and WebView file origins. The saved document URI remains stored.
- Existing production Developer gates for test powers/grants/buttons, safe-area guides, Happy preview and restart tools. Normal Settings exposes sound, Developer mode and Check for updates. ↻ and FPS remain Developer-only.
- Production release name **2026.10.15.2**, APK15, increasing numeric updater ID; production JSON envelope now explicitly identifies channel `catpusher` and application ID.
- Direct HTTPS address resolves the shared **phone/CatCoinPusher-game.json**, never UAT. Native picker/help text and update messages refer to production. Production resources retain their existing launcher appearance.

## Evidence

- `PROD-04-evidence/equivalence.json` and `adaptations.json`: explicit reversible HTML changes reconstruct approved UAT HTML, allowing line-ending normalization. All 22 non-HTML runtime files byte-identical to UAT. APK's bundled HTML, numeric ID and all runtime assets match production JSON. UAT JSON/APK hashes unchanged.
- `PROD-04-evidence/board-results.json`: reran actual shipped scripts/Rapier with the same deterministic no-power bot. Every recorded field matches UAT, including settled idle.

| Board | Cadence | Used / remaining, both | Clear seconds, both |
|---|---|---|---|
| 1 | 0.4 s | 118 / 102 | 46.9833 |
| 1 | 0.22 s | 99 / 121 | 21.5833 |
| 2 | 0.4 s | 88 / 72 | 34.8167 |
| 2 | 0.22 s | 113 / 47 | 24.7500 |

- Actual active Settings invocation checks native update calls with Developer off/on/off; test tools gated. Ten native release-offer policy cases passed. Android compile and lint passed. APK package/versionName verified; signing certificate matches APK14: `20ddef2a158095a45a176efa2ddffa60ecf0c074d569b7dcd9785b1cfa122dc2`.
- `PROD-04-evidence/production-desktop.png` and `uat-desktop.png` are actual desktop canvas renders, not phone captures. Footer visibly shows the date name. Native offers/manual success and cached metadata retain payload displayName using the approved OPS-02 bindings; APK versionName matches.
- `PROD-04-evidence/cloud-baseline.json` proves the supplied production sharing link served the prior exact production file. `cloud-verification.json` records HTTP 200 and fresh full-byte hash equality after publication, including embedded APK15. The same direct download.aspx route as UAT is used with production's distinct sharing token. `native-cloud-check.json`: the shipped Java downloader fetched production, matched all runtime files and displayName, reused unchanged ETag metadata, fetched again for a changed ETag and rejected the UAT cloud payload. A transient first download timeout cleared on the successful retry using Windows system proxies for the desktop harness; shipped Android code is unchanged from the approved UAT implementation.

## Backup and publication

Verified backup before publication: `backups/before-PROD-04-20261015232124` (prior JSON, APK14 and technical docs). Existing cloud items preserved with exclusive in-place writes. Published JSON SHA256 `c482f58f0f2ede7558081238c979f4f3da7ea4e1c6a9211877f3f30b53852ce3`; APK SHA256 `bcd150918daf9dfcee37564f358ffcdf4544c13091db40a57b1df5ac4d1c08c2`. Pins/staging/source under `work/prod04`; signing key remains outside the shared project.

## One-time phone installation

1. In OneDrive open **work → CoinPusher → CatCoinPusher.apk** (root folder, not uat). Wait for its new upload before downloading/opening it.
2. Tap **Install/Update** to replace the existing **Cat Coin Pusher** in place. Do **not** uninstall or clear app data. If Android asks, allow OneDrive/the app used to open the APK to install this update, then return and complete installation.
3. Open **Cat Coin Pusher**. Footer should read **2026.10.15.2**. Existing production app name/icon remain. UAT remains separate.
4. Open **Settings → Check for updates**. It should show **You're up to date**, **Checked the production file directly in OneDrive**, and **2026.10.15.2**. No file reselection is required. If a file picker is used later, select **phone/CatCoinPusher-game.json**.

APK15 is required once for the new updater; future game-only releases use the production JSON. APK14's old generic app-update prompt can also install APK15, but direct OneDrive installation above avoids relying on that older cached-document path. No USB/ADB used.

Phone receipt, update-screen appearance and device behavior require Jenny's evidence; desktop checks do not establish them. Approved review baseline resets boards on load and its progress-save hook remains a no-op; no save feature was added or removed.
