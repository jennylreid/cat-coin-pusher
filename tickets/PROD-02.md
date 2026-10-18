# PROD-02: Promote UAT to production

Published production **20261013160516 / APK14**, promoted only signed-off UAT **20261012220659 / APK2**. Jenny explicitly approved everything in that build in the PROD-02 request on October 13, 2026. Production phone acceptance remains pending.

## Scope and separation

Decoded the pinned published UAT JSON, never the mutable UAT working tree. All 23 runtime files included; all 22 non-HTML files byte-identical (14 art assets plus runtime/audio/license files). Rest/Waiting/Happy art, brass pusher, comet delivery, side-matte/cache optimizations and continuous payout/tipping are exactly that release. No UAT-08, cancelled UAT-04 or newer work.

HTML differences are enumerated and reversible in PROD-02-adaptations.json: production title/build label, existing production save key catpusher.board.prototype.v1 and audio key catpusher.audio.v1; retained production Developer mode gates for power grants/use, power buttons/hit routing, safe-area guides and Settings tools. Happy six-second preview is also Developer-only; ordinary board clear still uses approved Rest. Rendering/physics outside these explicit gates is unchanged.

Production retains com.jenny.catpusher, Cat Coin Pusher title, APK14 bytes/signature, private native preferences/update URI and existing save/settings schema. No reinstall, UAT APK or UAT update channel copied. Published only phone/CatCoinPusher-game.json; UAT JSON/APK and production APK hashes unchanged.

## Backup and update

Verified pre-publication backup: backups/before-PROD-02-20261013160516/ (previous production 20261012120202 JSON plus APK14). Independent local previous-production.json and approved-uat.json snapshots retained.

The new production JSON has a strictly greater game version and retains APK14. Existing native loadNewest reads the connected OneDrive file at app opening, compares against installed/bundled game, and offers Game update available; accepting activates the staged game while retaining local storage. Settings Check for updates bridge tested. No native updater changes. OneDrive sync/provider receipt and actual dialog on the phone are not observable here.

## Verification

- Complete payload inventory/decode and exact non-HTML equality; inverse adaptation audit reconstructs approved HTML exactly. APK payload equals both previous production APK and published APK.
- Real Rapier two-board strategy regressions: Board1 spends86/113; Board2 spends119/127 at0.4/0.22second cadence, all win, idle stable.
- Power regressions: Catquake spills15/45 and12/51; roar-before-impact, exclusion, no coin cost and reset pass.
- Developer off/on grants and Settings routing pass; guides, Happy, powers/restart hidden with Developer off; update/sound available normally.
- Native-canvas1080x2404 safe-area/HUD/hit-target and no-cutout fallback pass: extra top header50.6px, no extra board coverage. PROD-02-phone-dev-off.png and PROD-02-phone-guides.png are desktop renders, not phone captures. Test runner gained native Path2D support for the promoted cache renderer; no runtime change.

## Phone acceptance still required

Publication and desktop checks are complete. Jenny's sign-off of UAT is recorded; production phone120fps, same full-board play/visuals, continued production saves and real automatic-update offer still need confirmation after OneDrive sync. No ADB or USB used. The FPS shown on desktop evidence is the runner's initial value, not measured phone FPS. Keep ticket acceptance pending until this phone check.

Open **Cat Coin Pusher**, accept its offered game update once OneDrive syncs, and check production build 20261013160516, previous saves/settings and full-board120fps. If needed use Settings → Check for updates. Its file is phone/CatCoinPusher-game.json, never the UAT file.

Rollback: repackage saved production JSON with a fresh higher game version; older versions do not downgrade the updater. APK14 stays unchanged.

## Phone follow-up — October 13, 2026

Jenny reported ‘accepted’ after the production update instructions. Production update acceptance confirmed by the user. Production 120 fps, matching full-board play/visuals and existing save continuity have not yet been explicitly confirmed; these acceptance checks remain pending.

