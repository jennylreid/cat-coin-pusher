# UAT-15 Automatic game updates

Status: **phone UAT passed**, Jenny confirmed “yes, all good” on October 15, 2026. Ready for PM review. Current UAT: **20261015214424 / APK3**.

## Result

- Startup and Settings fetch the same UAT OneDrive JSON through Microsoft's direct HTTPS download route, bypassing the Android document cache. Saved file URI remains stored. ETag validation avoids unchanged full downloads; network work runs off the UI thread. Failed checks do not claim “up to date.”
- One offer per release, persisted across reopening/reboot. Later suppresses automatic repeats; Settings can explicitly retry. Native updates take precedence without a game/app dialog chain.
- The active Settings screen has Check for updates and Developer mode. The top ↻ is drawn and tappable only with Developer mode on.
- One in-place APK3 installation was required, retaining app identity, signing certificate, preference keys and WebView origins. Later test releases were game-only.

## Phone acceptance evidence

| Check | Jenny's result |
| --- | --- |
| Automatic discovery | New offer received after installing APK3 over existing UAT; accepted. |
| Discovery after actual phone reboot | New probe offered during the reboot test; actual-phone restart explicitly confirmed in final reply. |
| Accept/decline without loops | No offer after reopening following acceptance; Later closed the popup and reopening produced no repeat. |
| Manual discovery | Confirmed “works” for Later → Settings > Check for updates → offer again → accept. |
| Developer gate | Corrected Settings controls confirmed; ↻ on/off visibility explicitly confirmed. |
| Stored settings | Sound setting retained, explicitly confirmed. No obvious issues reported after the in-place APK installation. |

Save limitation: this approved two-board review baseline deliberately resets boards on load; its progress-save function is a no-op. No ongoing-board save feature was added or altered. The required installation was in-place; an actual uninstall/reinstall was not tested and is not claimed to preserve data. No USB/ADB used.

## Validation and review fix

Android compile, signed APK assembly and lint passed. APK identity/signature and all 23 runtime files verified. Ten release-offer policy cases passed. The actual Java client fetched cloud payloads and exercised ETag reuse/refetch; fresh full cloud hashes matched publication.

An initial Settings test incorrectly inspected disabled collection code. Jenny found the missing active-screen button; it was corrected in 20261015213629. The replacement executable test taps the actual Settings entry and verifies native update calls with Developer off/on/off, the toggle, existing save-hook calls, audio writes and Close. Phone confirmation followed.

Evidence folder: `UAT-15-evidence/`. Key files: `publication.json`, `cloud-verification.json`, `policy-checks.json`, `active-settings-checks.json`, `restart-probe-cloud.json`, `settings-fix-cloud.json`, `manual-probe-publication.json`, `manual-probe-cloud.json`, and `phone-uat.json`. Desktop refresh renders are identified as desktop evidence. Working notes are archived separately.

## Release and maintenance

Releases/backups: 20261015211014 (APK3 bootstrap), 20261015212221 (restart probe), 20261015213629 (Settings correction), 20261015214424 (manual probe). Each publication has its preserved predecessor under `uat/backups/before-<version>`; original APK backup is with the first release. Probe changes are version/BUILD labels only.

Latest game source: `work/uat15/manual-probe/release.html`. Native source: `work/uat15/android`. Native builds support `UAT15_BUILD_DIR` for generated outputs outside OneDrive. Keep signing keys outside the shared project.

Future UAT publication must preserve the existing OneDrive item/sharing link, strictly increase game versions, use exclusive in-place writes and verify fresh cloud bytes after sync. Game-only changes retain APK3; native changes require a higher matching signed APK. Production promotion requires separate explicit authorization.
