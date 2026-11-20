# PROD-10 preparation: UAT 134 to production (prepared only, nothing published)

Nothing in `phone/` or `CatCoinPusher.apk` has been touched. This waits for Jenny's sign-off, passed on by the PM.

- **Source:** `work/cp134-bundle/release.html`, the published UAT 134, sha pinned in `prepare.py`.
- **`prepare.py` (done):**
  - Same 17 production adaptations as PROD-05/06/08/09:
    - build name `2026.11.20` and title CatCoin;
    - storage keys `catpusher.uat.*` -> `catpusher.*`;
    - Settings without the log-file buttons;
    - test previews and the local performance log only with Developer on.
  - All 17 apply cleanly. `release.html` sha e6742b2c...33d5.
  - **Goal boards are off** because the build name has no "UAT" (UAT 134 item G). The prepare script asserts the switch is present.
  - The UAT Developer default is also off by the build name (as before).
- **`release-version.json`:** 2026.11.20, version 20261120200000, apkVersion 17. Production today is 2026.11.18, 20261118200000.
- **Channel identity (checked):**
  - Production JSON is the published PROD-09: channel `catpusher`, `com.jenny.catpusher`, apkVersion 17, 78 runtime files, APK sha matches.
  - `stage.py` keeps production's envelope fields; no UAT field goes in.
- **Runtime files** (production takes UAT 134's set byte for byte; `stage.py` asserts this exact difference):
  - 11 shared files are newer art in UAT;
  - 1 added: `sounds/effects/paw-dance.flac`;
  - 3 dropped: `head-waiting.webp`, `uat18-soft-paw.png`, `paw-dance.wav`.
- **Backup:** `publish.ps1` (from PROD-09) backs up to `backups/before-PROD-10-20261120200000`. It refuses to overwrite an existing backup and writes in place, keeping the OneDrive item and its share link.
- **`stage.py`:** refuses to run until the authorization line carries Jenny's words.

To do after the sign-off:
1. Retarget PROD-09's production checks (`checks.cjs`: Developer off on every screen, save carry-over from a 2026.11.18 save, parity with UAT 134) and the boot check to prod10.
2. Fill in the authorization in `stage.py`, then run `stage.py`, `publish.ps1` and `verify-cloud.py`.
