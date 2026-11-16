from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
report=f'''# CP-25 Playable loop v1

**2026.10.29 UAT 15 / APK4 published**, numeric **{m['version']}**. Backup/package verified; fresh cloud evidence below. Jenny requested pickup options to try, rejected tap-to-dismiss in a tapping game, and approved the current Collections tile/Inventory. Latest speed clarification: coins seem slow to move; earlier “choppy” answer was corrected. Phone readout now reported60FPS, previously20FPS.

## Three pickup trials — no tap-to-dismiss

All styles have a protected timed display; tapping cannot shorten them. One-at-a-time queue and one pickup chime per displayed item. Actual front payout still credits/saves inventory once; presentation and preview never award items themselves.

- **Paw reward:** centred paw medallion,2 seconds; board paused and input blocked. Taps are consumed and do not dismiss or spend coins.
- **Reward ribbon:** cream/teal ribbon near bottom with prize/satchel,2.4 seconds; gameplay/input continues. Default first trial.
- **Satchel bubble:** small prize reveal above bottom Inventory satchel,2.2 seconds; gameplay/input continues.

**Settings → Pickup style** switches between **Cycle three styles**, Paw, Ribbon and Satchel. Cycle is the default and rotates Ribbon → Satchel → Paw, including previews. **Preview item** selects cheese/shrimp/tuna; **Preview pickup (no reward)** closes Settings and displays that trial without spending/granting anything. Style/next-cycle preference persists in separate UAT-only `catpusher.uat.pickup.v1`. Queue hides/pauses in Inventory or Settings so rewards aren't missed behind those screens.

## Preserved work / movement feedback

During implementation, CP-26 published UAT14 with the approved Calm head. This build was rebased onto the actual UAT14 payload and retains its head loader, asset and Settings description. All non-HTML package entries match UAT14 exactly. No reference art or generated assets added.

Approved doily Collections tile, compact Inventory/power counts, header controls, collection art/payoffs and UAT12 loss/retry/direct renderer remain. Coin/pusher speed, fixed physics timestep, contact rules and drop cadence are **unchanged** in this presentation comparison. Coin-motion pacing remains a separate tuning decision; do not claim this update fixes the latest slow-travel feedback or establishes smooth frame pacing from the60FPS readout alone.

## Validation and evidence

[Four checks](CP-25-evidence/pickup-options/checks.json):30 repeated taps cannot skip any style; modal freezes/no coin, nonmodal allows normal drops; cycle order/one sound per display; preference survives reopening; actual Settings handlers/preview produce no reward; opening Inventory pauses display; actual front treat credits once.

[Three trial comparison](CP-25-evidence/pickup-options/three-trials.png), individual full-phone stills: [Paw](CP-25-evidence/pickup-options/paw-phone.png), [Ribbon](CP-25-evidence/pickup-options/ribbon-phone.png), [Satchel](CP-25-evidence/pickup-options/satchel-phone.png). Actual-game renderer with existing cheese moved through front payout as a UI fixture; Calm art from the current published baseline. Stills are not phone timing/sound/FPS evidence. Phone readability, reward feel and comparative preference await Jenny's UAT.

## Publication and close-out

Baseline **UAT14 / CP-26**, numeric20261029191906; pinned HTML `work/cp25/pickup-options/observed-live.html`, matching `work/cp26/release.html`. Source `work/cp25/pickup-options/release.html`, builder `build.py` + `awards.js`. Backup `{m['backup']}`. [Package verification](CP-25-evidence/pickup-options/package-verification.json), [publication](CP-25-evidence/pickup-options/publication.json), [cloud verification](CP-25-evidence/pickup-options/cloud-verification.json). Only HTML changed, no APK/native change. APK4/channel/save key and existing OneDrive item/link retained. JSON SHA-256 `{m['stagedJSONSHA256']}`.

[Previous CP-25 report](CP-25-evidence/inventory-grid-report.md) links Inventory approval and loop recovery/performance evidence; [CP-26](CP-26.md) owns the Calm art. Ticket remains open for phone UAT/sign-off; close-out commit/push follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
'''
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
f=r/'tickets/CP-25-evidence/inventory-grid-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 15 / APK4** ({m['version']}).

CP-25 pickup trials: Settings→Pickup style (Cycle/Paw/Ribbon/Satchel), Preview item and Preview pickup (no reward). No tap-to-dismiss; Paw pauses, Ribbon/Satchel let play continue. Existing Collections/Inventory and UAT14 CP-26 Calm face retained. Coin/pusher pace unchanged.

Source: work/cp25/pickup-options/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
notes={'SPEC.md':f'''## CP-25 pickup trials (October 29, 2026)

Current UAT15/APK4 ({m['version']}) removes tap-to-dismiss and offers Settings Cycle/Paw/Ribbon/Satchel plus no-reward preview/item selector. Timed Paw2s is modal; Ribbon2.4s and Satchel2.2s are nonmodal. Queue/chime/credit-once retained; Inventory/Settings pause hidden presentations. Doily/Inventory approved; UAT14 CP-26 Calm face retained. Coin/pusher pace unchanged pending separate tuning of Jenny's latest slow-motion feedback;60FPS phone readout is reported, not proof of smooth pacing. Report: tickets/CP-25.md.

''','DEVELOPER.md':'''## CP-25 pickup trials (October 29, 2026)

Current UAT15 source work/cp25/pickup-options/release.html, pinned to actual published UAT14 (CP-26 Calm face). build.py/awards.js add style-specific pickupBlocksPlay and durations, never tap dismissal. Settings cycle/previews persist only preference/next style under catpusher.uat.pickup.v1; actual item ledger unchanged. Ribbon/Satchel continue input/physics; Paw stops hold and consumes input for full timed display. Presentation hides/pauses while Inventory or Settings is visible. Style is selected once per queue entry; chime once per visible head. Four checks and package/cloud/stills: tickets/CP-25-evidence/pickup-options/. All non-HTML payload fields/files retained from UAT14, including Calm asset. Fixed STEP/frame scheduler/coin/pusher pace unchanged. Report tickets/CP-25.md.

'''}
for name,note in notes.items():
 f=r/name;t=f.read_text(encoding='utf-8');f.write_text(note+t,encoding='utf-8')
print('Pickup trial instructions, preserved UAT14 baseline and coin-pace feedback recorded')
