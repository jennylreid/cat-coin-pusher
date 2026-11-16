# UAT-15 Automatic game updates

Status: **published to UAT 20261015214424 / APK3**. Fresh cloud download verified. **Phone UAT and sign-off pending.**

Phone evidence from Jenny: installed over the existing UAT app, received an update offer and accepted it. This confirms the first automatic offer and acceptance. Decline/manual retry, restart discovery, Developer gating and save/settings continuity remain unconfirmed.

Follow-up phone evidence: Jenny closed and reopened UAT and saw no update offer. Acceptance does not repeat on reopening. Jenny noticed no obvious issues; coins/settings continuity is not specifically confirmed, and she does not normally leave a board in progress.

Baseline: 20261015195300 / APK2. APK3 bundles 20261015210806; the published JSON is deliberately newer so its first launch can demonstrate one automatic game offer. Both contain the same ticket changes; only BUILD labels differ.

## Changes

- Startup and Settings check the same UAT JSON directly over HTTPS, bypassing Android OneDrive's stale document cache. The supplied Anyone link works through Microsoft's direct-download route. Existing selected URI remains stored; no re-pick is required. An unchanged ETag avoids downloading the full payload again. Network work runs off the UI thread; failures never claim “up to date.”
- One release offer: native updates take precedence, with no game-to-app dialog chain. Persisted offered-version state suppresses automatic repeats after Later, recreation or reboot. Settings can retry a declined release. Applying an update calls the existing save hook first; this review baseline's progress-save hook is a no-op.
- ↻ drawing and tap handling require Developer mode; Settings > Check for updates stays.
- APK3 retains the app identity, signing certificate, preferences and WebView file origins. Installer callbacks handle cold starts and validate their per-session token.

## Evidence

- Android compilation, APK assembly and lint passed. Ten release-offer policy cases passed, including decline/restart suppression, manual retry, acceptance and later releases: `UAT-15-evidence/policy-checks.json`.
- The actual Java download client fetched the release, matched every runtime file, reused unchanged metadata and fetched a changed ETag. A separate fresh HTTPS download matched the entire published JSON, including its APK. Same OneDrive item GUID; ETag advanced from 3 to 4: `UAT-15-evidence/cloud-verification.json`.
- APK ZIP/runtime round trip, application ID, versionCode3 and matching signing certificate verified; all 23 runtime files checked: `UAT-15-evidence/publication.json`.
- Refresh off → on → off drawing/tap checks passed. The initial Settings-presence assertion only inspected disabled collection-menu code and was insufficient; it is superseded by the executable active-Settings check below: `UAT-15-evidence/ui-checks.json`. Desktop renders: `desktop-developer-off.png` and `desktop-developer-on.png` in the same evidence folder. These are desktop evidence, not phone screenshots.

## Installation and phone UAT

1. Note current coins/progress and settings. In OneDrive, install **uat/CatCoinPusher-UAT.apk over the existing UAT app**. **Do not uninstall.** This one native installation is needed to replace the old updater.
2. Open UAT without refreshing OneDrive or selecting the JSON. Expect one offer for **20261015211014**. Choose Later; reopening should not repeat it. Settings > Check for updates should offer it again; accept, then confirm no further update screens and retained progress/settings.
3. Check ↻ off/on/off with Developer mode. Report the result of the first offer and installation. A subsequent version-only UAT publication will allow discovery of a genuinely new build after a phone restart, before that build has ever been offered. That device check remains pending.

Required installation is an in-place update. Preservation across an actual uninstall/reinstall is not established; the old app disables Android backup. Do not infer it from the matching-signature or desktop checks. Phone receipt, restart behavior and save/settings continuity require Jenny's evidence. No USB/ADB used.

## Release and maintenance

Backup: `uat/backups/before-20261015211014` (prior UAT APK/JSON, README, brief, engineering doc and ticket report). Existing OneDrive items were overwritten under exclusive file locks, preserving the cloud sharing link; fresh cloud bytes were then verified.

Current game source: `work/uat15/release.html`; native source: `work/uat15/android`. `UAT15_BUILD_DIR` supports local build outputs outside OneDrive to avoid generated-file locks. Future publications must preserve the existing cloud item/link, strictly increase the game version and verify cloud bytes after sync. Game-only changes retain APK3. Native changes need a higher, matching signed APK.

## Restart discovery probe

Phone follow-up: Jenny reported receiving the probe offer during the instructed phone-restart test, selecting Later and seeing the popup close. She then closed/reopened UAT and reported no new offer. Decline/reopen suppression is confirmed. The preceding messages do not explicitly confirm that the phone reboot completed; record reboot discovery as awaiting that confirmation. Manual retry/acceptance remains pending.

Published **20261015212221 / APK3** after Jenny confirmed accepting the first update and no offer on reopening. Changes: game version and BUILD label only, structurally verified against 20261015211014. No further APK installation. Fresh cloud hash verified: `UAT-15-evidence/restart-probe-cloud.json`; publication: `restart-probe-publication.json`. Backup: `uat/backups/before-20261015212221`. Latest game source: `work/uat15/probe/release.html`.

Phone check: keep UAT closed, restart the actual phone once, then open UAT without opening OneDrive or picking a file. Expect one new offer; choose Later, reopen to check no repeat, then Settings > Check for updates to retry and accept. Device results pending. This reboot is only an acceptance test; normal update discovery requires opening the app.

## Active Settings correction

Phone evidence: Jenny confirmed the corrected Settings controls appear. Manual discovery of a newer declined release and actual refresh visibility while toggling Developer mode remain to be explicitly confirmed.

Jenny reported that Settings had no Check for updates. Confirmed: the old collection panel containing it returns immediately, while the active Settings entry opens a different function. The initial test checked inactive code; that was an engineering verification error.

Published **20261015213629 / APK3**, game-only: the active Settings screen now includes Check for updates independently of Developer mode and an accessible Developer-mode toggle. Existing Settings controls are retained. Only that Settings function and BUILD label changed; payload normalization verified, APK3 retained. Source: `work/uat15/settings-fix/release.html`. Backup: `uat/backups/before-20261015213629`. Fresh cloud payload verified in `UAT-15-evidence/settings-fix-cloud.json`.

The new executable check taps the actual bottom-right Settings entry, reproduces the missing button on the prior release, then verifies native update calls off/on/off, the Developer toggle, existing save-hook calls, audio-settings writes and Close: `UAT-15-evidence/active-settings-checks.json`. Phone confirmation of the corrected screen and manual discovery remains pending. Accept this correction's automatic offer first; a later version-only publication can then test decline → Settings retry. No further reboot or reinstall is needed for this correction.

Save evidence limitation clarified: the approved two-board review baseline deliberately resets boards on load and its progress-save function is a no-op. Existing persisted audio settings and native update preferences retain their keys and locations. No progress-save feature was added or altered; do not claim ongoing-board continuity from these tests.

## Manual discovery probe

Phone result: Jenny replied “works” to the explicit Later → Settings > Check for updates → offer again → accept sequence. Manual discovery/retry and acceptance are confirmed. Remaining explicit phone confirmations: top ↻ visibility while toggling Developer mode, completion of the earlier actual-phone reboot, and stored audio-setting continuity. No further publication is required for these checks.

Jenny confirmed the corrected Settings controls appear. Published **20261015214424 / APK3**, changing only the game version and BUILD label from 20261015213629; structural payload equivalence checked. Backup: `uat/backups/before-20261015214424`. Latest source: `work/uat15/manual-probe/release.html`. Evidence: `UAT-15-evidence/manual-probe-publication.json` and `manual-probe-cloud.json` (fresh cloud hash matched).

Phone test: reopen UAT, choose Later on this new offer, then Settings > Check for updates should offer the same release again; accept it. No reinstall or reboot. Manual discovery and explicit Developer on/off visibility confirmation remain pending.
