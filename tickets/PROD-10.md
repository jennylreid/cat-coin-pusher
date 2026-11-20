# PROD-10: production update to 2026.11.20 (UAT 134), published Nov 20

**Published 2026.11.20 / APK17, numeric 20261120200000** (was 2026.11.18, 20261118200000).
- Game-only update for the installed production app; native unchanged, no new APK. Source: published UAT 134
  (`work/cp134-bundle/release.html`).
- Jenny's sign-off (Nov 20, via the PM, on UAT 134): "Hug takes me to Ragdoll on the main board. Pass, we're ready."
- Jenny ran `work/prod10/publish.ps1` herself (the engineer session's permission check blocks production writes).
  - Backup: `backups/before-PROD-10-20261120200000`.
  - Local publication verified (`PROD-10-evidence/publication.json`).
- Cloud copy verified (`PROD-10-evidence/cloud-verification.json`):
  - 47,824,970 bytes, sha256 e24153c0...fe67;
  - channel catpusher, com.jenny.catpusher, apkVersion 17, 76 runtime files;
  - index.html = the production build (e6742b2c...33d5).
- GitHub `main`: commit **fdc28ad** (UAT checkpoint tree wip/uat 0b5d619 + the production build as root index.html + work/prod10).
- **Phone receipt pending Jenny** (check below).

## What production gets
- Everything signed off from UAT 106 to UAT 134 (CP-71, CP-74, CP-86, CP-88, CP-92, CP-94, CP-96, CP-97, CP-98, CP-100,
  CP-101, CP-102, OPS-04).
- Highlights: PLAY goes to the endless board with the coin wallet; cat chip and Home swipe to switch cats; side games and
  powers per cat; the Hug; dances per cat; Collections and Shop buttons; Pet the cat strip.
- **Goal boards are off** in production: they show only when the build name has "UAT" (UAT 134 item G). Level boards stay.
- **Developer is off by default:** the UAT Developer default is keyed on "UAT" in the build name. The Developer panel, MODES
  and the start-now buttons only appear when Developer mode is switched on.

## Production adaptations (`work/prod10/prepare.py`, same 17 as PROD-05/06/08/09)
- Build name `2026.11.20` and title CatCoin.
- Storage keys `catpusher.uat.*` -> `catpusher.*`, so production saves stay production's.
- Settings without the log-file buttons.
- Test previews and the local performance log only with Developer on.

## Channel identity (`work/prod10/stage.py`)
- Production's envelope is kept: channel `catpusher`, `com.jenny.catpusher`, apkVersion 17, `apk` empty, no UAT field. The
  version is strictly higher.
- Runtime is UAT 134's 76 files byte for byte, with index.html = the production build:
  - 11 shared art files are newer (approved art as it is in UAT);
  - 1 added: `paw-dance.flac`;
  - 3 dropped, unused by this build: `head-waiting.webp`, `uat18-soft-paw.png`, `paw-dance.wav`.
- Staged JSON: 47,824,970 bytes (`publication-manifest.json`).

## Checks
- **UAT 134 full regression:** 28 of 28 suites green after test-only updates for the intended changes
  (`tickets/CP-100-evidence/uat134/regression`).
- **Production checks** (`work/prod10/checks.cjs`, all pass; `tickets/PROD-10-evidence/checks.json`):
  - Developer off on every screen; no MODES;
  - Settings without test tools or "UAT";
  - fresh install with no UAT, devdefault or diagnostics keys;
  - Oct 31 and 2026.11.18 saves carry over unchanged and play;
  - same scripted rounds give identical boards to UAT 134;
  - Goal boards off (UAT 134 has them).
- **Real-browser boot check** (`tickets/PROD-10-evidence/bootcheck.json`): passes. Production boots to the title and a round
  with Developer off and no UAT keys, the same state as UAT 134.

## Phone check (Jenny, production app)
Open the production CatCoin app and let it update.
1. The version in the corner reads **2026.11.20**.
2. Your levels, stars, coins, Catnip, pantry, Album and cats are all still there.
3. PLAY goes to the board with your coin wallet; NEW BOARD works.
4. Home: swipe the cat's face to switch cats; tap it for hearts.
5. No "Goal boards" button and no Developer panel (Settings shows only Sound and the Developer switch).
6. The Ragdoll's Hug and Dance break look right (white chest; grey shoulders in the dance).
```
PROD-10 production 2026.11.20 (device: Pixel / Nothing): 1 version pass / fail; 2 progress kept pass / fail; 3 PLAY and NEW BOARD pass / fail; 4 swipe and hearts pass / fail; 5 no Goal boards or Developer pass / fail; 6 Ragdoll Hug and dance pass / fail.
```
