from pathlib import Path
import json
r=Path.cwd();p=r/'work/cp25/promotion';e=r/'tickets/CP-25-evidence/promotion'
m=json.loads((p/'manifest.json').read_text());cloud=json.loads((e/'cloud-verification.json').read_text());assert cloud['freshCloudJSONAndInstallerMatchStage'] and cloud['version']==m['version']
m['publication']='published November 1, 2026; local backup and fresh cloud JSON/embedded APK verified';m['migrationApproval']='Jenny November 1: Yes, release with that migration';m['backup']='backups/before-CP-25-promotion-'+str(m['version']);(p/'manifest.json').write_text(json.dumps(m,indent=2))
publication=json.loads((e/'publication.json').read_text(encoding='utf-8-sig'));publication.update(publication=m['publication'],migrationApproval=m['migrationApproval']);(e/'publication.json').write_text(json.dumps(publication,indent=2))
f=r/'tickets/CP-25.md';s=f.read_text(encoding='utf8');old=s[:s.index('---\n\n')+5]
header=f'''# CP-25 — production promoted (November 1, 2026)

**Published 2026.10.31 / APK17**, numeric **{m['version']}**, promoting approved CP-22, CP-25 and CP-26 from UAT24. The validated October31 release label is retained. Jenny confirmed UAT24 phone installation on October30 and approved release; on November1 she explicitly approved the first-open migration below. **Production phone receipt remains pending Jenny.**

**Migration:** existing production never persisted board progress (`load()` reset the board; `save()` was a no-op). With Jenny's approval, first open starts Board1 with220 coins and preserves sound. Old per-board allowance is not carried over; the shared purse replaces it. Subsequent opens restore board, bodies, purse, inventory and collections through production's own `catpusher.loop.v1`; audio uses `catpusher.audio.v1`. UAT keys are never read.

**Production-only differences:** production title/release label and storage keys; testing controls and automatic local diagnostic entry points require Developer mode. Native OneDrive diagnostic connection/provider are omitted. All36 non-HTML runtime files match UAT24 byte-for-byte; no play/art/balance tuning. Production native baseline retains its app ID, private preferences, signing certificate and update URI. APK17 adds `BuildConfig.VERSION_CODE` instead of PackageManager's exception-to-zero fallback. Existing production update policy matches UAT24 apart from package name and is retained.

**Validation:** fresh offline signed build/lint, manifest/version/signature and DEX startup classes pass. **18/18 production clears exactly match UAT24** in coins used, clear timing and pickup order (3boards ×3seeds ×2cadences). Save/settings checks verify sound, first purse220, production/UAT isolation and new-save board restoration. Exact APK16 CloudUpdate source reads the complete staged package; policy checks cover automatic offer, decline/manual retry and no reoffer after APK17. Evidence: [board comparison](CP-25-evidence/promotion/board-comparison.json), [save checks](CP-25-evidence/promotion/save-checks.json), [package](CP-25-evidence/promotion/package-verification.json).

**Delivery:** APK-only envelope, JSON49,493,561 bytes; complete embedded APK37,120,058 bytes; empty `files`; full37-file runtime bundled once at the same game version. This avoids duplicated runtime and includes the installer APK16 requires. APK17 then sees the matching bundle and offers no empty-files game update. Source/desktop checks do not establish phone memory headroom or receipt.

**Publication:** backup `{m['backup']}` verified before exclusive in-place writes to `CatCoinPusher.apk` and `phone/CatCoinPusher-game.json`, preserving existing shared items. Fresh cloud HTTP200 JSON and its downloaded embedded installer match staged hashes. JSON SHA256 `{m['stagedJSONSHA256']}`; APK SHA256 `{m['stagedAPKSHA256']}`. [Publication](CP-25-evidence/promotion/publication.json), [cloud verification](CP-25-evidence/promotion/cloud-verification.json). Source/native/staging: `work/cp25/promotion`; runtime baseline is APK assets, never the empty JSON `files`.

**Jenny — production phone check:** open the production Cat Coin Pusher app; accept **2026.10.31** app update and Android's installation prompt. If previously declined, Settings → Check for updates. Do not uninstall. If the in-app route fails, install OneDrive/work/CoinPusher/**CatCoinPusher.apk** over the existing production app. Confirm footer **2026.10.31**, sound setting retained, Board1/220 coins on first open; then play and reopen to confirm board/purse persistence. Actual installation, sound and device performance require phone evidence. UAT remains separate. Prepared-source commit `f140e20`; publication close-out commit/push follows with this report and baseline docs.

---

'''
f.write_text(header+s[len(old):],encoding='utf8')
f=r/'CODEX_BRIEF.md';s=f.read_text(encoding='utf8').replace('Updated October 31, 2026.','Updated November 1, 2026.')
a=s.index('- CP-22, CP-25 and CP-26 production release approved');b=s.index('- Jenny explicitly signed off',a)
s=s[:a]+f'''- Production: **2026.10.31 / APK17**, numeric **{m['version']}**, published November1 from signed-off UAT24 (CP-22/CP-25/CP-26). Source/runtime/native: `work/cp25/promotion` and its APK assets; JSON `files` is intentionally empty. 18/18 board results exactly match UAT24. Backup and fresh cloud JSON/embedded installer hashes verified. Jenny approved first-open Board1/220 coins (old production had no board save); sound retained, subsequent progress saved under `catpusher.loop.v1`. Production phone receipt pending. See `tickets/CP-25.md`. Follow-ups CP-27 to CP-31 remain separate.
'''+s[b:]
s=s.replace('Current production source/payload are shared `work/cp21/promotion`; APK16 native source remains `work/prod04/android`. Previous production is retained in `work/prod04/hotfix16`.','Current production source/payload/native are shared `work/cp25/promotion`; full runtime is in APK17 assets. Previous production is retained in `work/cp21/promotion` (APK16 native `work/prod04/android`) and the verified CP-25 backup.')
f.write_text(s,encoding='utf8')
f=r/'DEVELOPER.md';s=f.read_text(encoding='utf8');note=f'''## CP-25 production baseline — November 1, 2026

Production **2026.10.31 / APK17**, numeric{m['version']}, promoted from UAT24 with Jenny's release and migration approvals. Source/native/staging `work/cp25/promotion`. Full37-file runtime is in APK assets, with an APK-only JSON envelope (`files:{{}}`); never extract a future baseline from that empty object. All36 non-HTML assets match UAT24; production changes are labels/keys, Developer gates and diagnostic omission. APK17 uses generated `BuildConfig.VERSION_CODE`; production update policy/identity/preferences/signing/URI retained. No native OneDrive diagnostic bridge/provider; local diagnostic entry points require Developer mode.

Old production never saved current board or per-board allowance. Approved first open is Board1/220 coins, preserving `catpusher.audio.v1`; subsequent full loop saves use `catpusher.loop.v1`. UAT storage stays separate. Fresh signed build/lint, DEX startup/signature, old-reader compatibility, save checks and18/18 exact UAT24 board comparisons pass. Verified backup `{m['backup']}`; fresh cloud JSON and embedded installer hashes match stage. Phone production installation/sound/progress/performance remain Jenny's checks. Report/evidence: tickets/CP-25.md and CP-25-evidence/promotion/.

''';f.write_text(note+s,encoding='utf8')
print('Production report, baseline and engineering docs updated from verified cloud evidence')
