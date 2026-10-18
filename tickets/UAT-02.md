# UAT-02 — Rest pose: no arms, paws lower and angled in

**Status:** Implemented, tested, comparison shown before publication, published to UAT. Phone acceptance/review pending.

**Release:** UAT game 20261012122558, APK 2 (unchanged APK). Previous UAT game: 20261012113759. Production remains 20261012120202 / APK14, untouched.

**Backup:** uat/backups/before-20261012122558.

## Request and scope

Remove black arms/cuffs from Rest only; lower and turn the mitts slightly inward, keep the Sweet face and extended claws, close the cyan chin/rail gap, and keep recovery into Rest smooth. Reference: ../Screenshots/rest-pose-board-clear-20261012.webp. No gameplay changes or changes to other established poses.

## Changes

- The original paw sprite is retained. A Rest-only canvas clipping contour is derived once from the white palm’s upper edge, hiding the black cuff without creating replacement art or clipping the extended claws.
- Rest paws move down 45 game-canvas pixels, retain their existing 182px width, and rotate inward by 0.12 radians (about 6.9 degrees). They use the same palm/claw artwork and mirror arrangement.
- Recovery blends toward that lower placement, inward angle and cuff clip using its existing recovery progress. Impact size, motion and timing are untouched. The final width, coordinates, angle and clip match Rest, avoiding an endpoint snap.
- Rest-only rail backing covers the cyan seam behind the chin. The head image/transform, physical pusher and table are unchanged. This backing blends in during the transition into Rest.

Sweet/head/paw/coin/table/audio/physics assets are unchanged. Waiting, Quake impact, Sweep and Happy rendering paths are retained; the only transition adjustment is recovery’s destination into the revised Rest. No native app changes or APK rebuild.

## Screenshots shown before publication

![Current phone screenshot beside proposed Rest](UAT-02-before-after.png)

- Left is Jenny’s actual 719×1600 phone screenshot; right is a 719×1600 real runtime render of the proposed change, not generated concept art. Desktop fonts/emoji and pusher phase differ from the phone capture; no font or pusher behavior code was changed.
- [Current phone reference](UAT-02-current.webp)
- [Proposed Rest](UAT-02-rest-after.png)
- Recovery frame checks: [transition 1](UAT-02-transition-1.png), [transition 2](UAT-02-transition-2.png), [Rest endpoint](UAT-02-transition-rest.png).

The comparison was displayed to Jenny before publication. Visual review found no black arms in Rest, the full Sweet face clear, lower/inward mitts with claws extended, and no cyan seam between chin and rail. Movement still needs phone-feel review; frames and endpoint continuity were checked on desktop.

## Verification

- Waiting before/after PNG hash identical: ee6402c4939adf0f33ba3dfb0385c36b801351d7361f09394f7b44114251fcba.
- Quake impact before/after PNG hash identical: b5db105dec734a85bbe2b0fe3162fa953e39c041868fc440981fef5c259dab4c.
- Sweep and Happy before/after runtime PNGs are also pixel-identical.
- Rest/clear/reset, Happy preview-only, and recovery endpoint tests pass.
- Power exclusion, no coin cost, growl-before-slam and reset tests pass. Quake spills remain 15/45 and 12/51.
- Board spends remain 86/140 and 113/140 on Board1, 119/160 and 127/160 on Board2 at the specified cadences; all win, matching SPEC.md.
- Payload retains catpusher-uat / com.jenny.catpusher.uat / apkVersion2. All non-HTML payload files and UAT APK hash match the prior release.
- Published JSON hash matches the staged JSON. Production APK/JSON hashes verified unchanged after deployment.

Tests: outputs/uat/game/tests/uat02-preview.cjs, uat02-regression.cjs, rest-clear-regression.cjs, two-powers-regression.cjs, two-board-validation.cjs. Source change: outputs/uat/game/index.html in the existing game workspace.

## Delivery and review

Refresh Cat Pusher UAT using its existing OneDrive update file after sync. Game-only update; no reinstall. No ADB or USB debugging used. Production was not promoted. Claude can review this report and adjacent screenshots here in tickets.

Future ticket reports must be written to OneDrive/work/CoinPusher/tickets/<ticket ID>.md with screenshots beside them, before reporting completion to Jenny.
