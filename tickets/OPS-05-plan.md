# OPS-05 Split the update package: plan only (engineer, Nov 19)

## Why it's needed
Today every update is one JSON file holding all 81 runtime files as base64 (~60 MB). The app (APK7 UAT, APK17 production)
downloads it into memory, turns it into a string, parses it, then decodes each file (`CloudUpdate.read`,
`MainActivity.unpackGame`). That's several copies of the package in memory at once, which is why our own guard is 60 MB and the
app's hard cap is 128 MB. Every build re-sends ~45 MB of art and sound that hasn't changed, over OneDrive, to both phones.
OPS-04 buys headroom (to ~56.5 MB, or ~48 MB with FLAC); it doesn't fix the growth (~0.3-0.5 MB per feature build).

## Design
1. **Small game file** (the same OneDrive item and share link per channel, so the phones' update URI doesn't change):
   `version`, `displayName`, `apkVersion`, `channel`, `applicationId`, index.html and the small files inline as today, plus an
   `assets` list: `{path, sha256, bytes, url}` for each big file. Expected size: index.html (~2.7 MB) + small files, ~4 MB JSON.
2. **Asset files on OneDrive**, one per file, named by content hash (`assets/<sha256>.<ext>`) in a per-channel folder
   (`uat/assets/`, `phone/assets/`). A hash name never changes meaning, so an asset is uploaded once and reused by every later
   build; old builds stay valid. Each needs a direct-download share link (the same `download=1` style the game JSON uses today).
3. **Native updater (new APK: UAT APK8, production APK18):**
   - Read the small file as now (same channel/app ID checks).
   - For each asset: if `files/assets-cache/<sha256>` exists and its hash matches, reuse it; else stream the download straight to
     disk (no in-memory copy), check its sha256 and size, then keep it.
   - Build `game-stage/` from inline files plus copies (or hard links where allowed) of cached assets; keep today's
     stage/backup/rename swap, so a failed or partial update leaves the old game running.
   - Prune cached assets no longer listed by the current or previous version.
   - Old-format files (inline `files` only) still work, so the switch needs no flag day.
4. **Stage/publish scripts:** a shared `work/ops05/stage_split.py` writes the small file and uploads only new hashes;
   the 60 MB guard becomes a guard on the small file (e.g. 15 MB) plus a total-assets report.

## Rollout (both channels, both phones)
1. UAT first: APK8 built from `work/cp25/installer-fix/android` with the new updater, same signing identity, versionCode up.
   Shipped as a normal UAT update that advertises APK8 (the existing installer path), still in the old one-file format, so APK7
   phones can install it.
2. After APK8 is confirmed on the Pixel and the Nothing Phone, the next UAT build uses the split format.
3. Production: only after Jenny signs off, the same native change as APK18 through a promotion, then split-format production
   updates. The production and UAT asset folders, links and caches stay separate.

## What has to be true for the transition build
The old APK only understands the one-file format, so the build that delivers the new APK must still fit the old format and
size guard (OPS-04's headroom covers this). Don't carry the runtime twice in one file (the UAT 20 crash).

## Risks
- **OneDrive links:** each asset needs its own share link; generating them is the fiddliest part (Graph API or a manual step).
  Mitigation: hash names mean links are made once per new asset, not per build; the stage script refuses to publish without links.
- **Half-downloaded updates** (phone sleeps, bad signal): handled by hash checks and the staged swap; retried next launch.
- **Storage:** cache plus game folder roughly doubles on-phone use (~90 MB) unless game files are linked; acceptable, but noted.
- **Native change = new APK:** full install on both phones, signing must match, save continuity checked on device.
- **Two formats for a while:** the updater supports both; the scripts pick one per channel.

## Size and effort
- Per build after the split: ~4 MB to download (index.html + small files) instead of ~60 MB; new art adds only its own bytes.
- Work: native updater (~150-250 lines Java), the stage/upload script, two APK builds, the transition build, phone tests for
  each channel. About 2-3 engineer sessions plus Jenny's phone installs. Ticket it as OPS-05 with UAT then a production promotion.
