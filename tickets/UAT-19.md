# UAT-19 Tickle the paws

Status: Jenny picked idea 2 (tickle fight) with chirp A on each tickle and the mrrp on the swat. Jenny explicitly OK'd UAT publication. Published **2026.10.16 UAT 2**, numeric **20261016131018** (game-only update, APK4, no reinstall). Production untouched.

Changes (work/uat19/integrate.py applies them to the published UAT 1 payload; tickle code in work/uat19/tickle.js):
- Paw taps while the cat rests after Board Clear now only tickle. One tap: that paw flinches, the cat squints with the existing Happy-face overlay, "hehe!" pops up, chirp A plays. Three quick tickles (under 0.75 s apart): the other paw swats across at the finger twice ("bap! bap!") with a head lean, and the mrrp plays. Taps during a swat flinch but don't queue another. Everything eases back and the session clears to the exact rest pose.
- UAT-17 dance renamed Dancing pose: paw-tap trigger removed; motion and Let's Dance drums unchanged. Developer mode adds "Preview Dancing pose" in Settings (shows the rest pose while it plays, also during play). Any canvas tap, a power, board reset, mute or page hiding stops it.
- New files in the payload: sounds/effects/tickle.wav (chirp A), sounds/effects/tickle-swat.wav (mrrp). Both synthesized here (work/uat19/noises.cjs), no third-party audio. Muted = silent.
- Approved art untouched; motion is transforms of existing sprites. Play taps, Board Clear flow and buttons, boards unchanged.

Evidence (tickets/UAT-19-evidence; desktop renders of the real game canvas, not phone capture):
- Concepts: idea-1-ticklish-paw, idea-2-tickle-fight, idea-3-giggle-wiggle (.mp4/.gif), compare-all-three.mp4.
- Sound candidates: noise-*.wav, sound-demo-*.mp4, compare-chirps-x3.wav.
- Chosen in the integrated build with sound: integrated-tickle.mp4 (white finger dots are clip-only markers).
- work/uat19/validation.json: rest paw taps (200 rapid, both paws) never change board, coins used, remaining or drops; paws never start the dance; swat reaches 170 px; chirp per tickle, one mrrp per swat, silent when muted; Dancing pose button absent with Developer mode off, plays with it on; play taps match the UAT 1 baseline; pixel-identical rest pose after rapid tickles; tickle frame draw cost comparable to rest.
- Regression (work/uat19/regression-status.json): both boards win without powers; no desktop drawing slowdown.

Publication (done): work/uat19/publish.ps1 checked the UAT JSON still matches UAT 1 (bac0e8a1…), backed up to uat/backups/before-UAT-19-20261016131018 (verified), wrote the JSON in place keeping the OneDrive item and share link, verified the local hash and that production JSON/APK and the UAT APK hashes are unchanged (UAT-19-evidence/publication.json). Cloud: anonymous fresh download HTTP 200, SHA-256 c3235fc74186cc2a… matches, same shared OneDrive item (ETag {5FCB1BAF…},10) (UAT-19-evidence/cloud-verification.json).

Pending: phone UAT of feel, sound and smoothness. Sounds may need more tuning ("futz around").

## Fix: paw tap outlines hidden (built as UAT 3; shipped inside UAT 4)
Jenny's phone check: outlines around the paws showed whenever Developer mode was on, including the Dancing pose preview, with no way to hide them. Now they are off by default, even with Developer mode on. Developer mode adds a "Show tap areas" switch in Settings (off by default, not saved; resets on restart). Nothing else changed (diff: one gate in drawPawTouchGuides plus the Settings button). Staged from published UAT 2 by work/uat19-tapareas/fix.py as numeric 20261016142620.
Evidence (desktop render): UAT-19-evidence/dance-preview-dev-on.png (Dancing pose preview, Developer mode on, no outlines); dance-preview-tap-areas-on.png (switch on shows them); tickle-dev-on.png. work/uat19-tapareas/validation.json: frames with Developer mode on are pixel-identical to frames with outlines removed, during both the dance preview and a tickle; the switch only appears in Developer mode.

## Dancing pose: the table shakes (published in 2026.10.16 UAT 4)
Jenny wants the table to shake and the coins to bounce during the dance, between games only, and optional. Each paw stomp of the dance (paw coming down after a lift; bigger lift, harder stomp) jolts the table a few pixels and makes the coins hop (up to about 16 units) and slide a little. No CatQuake-size movement; in a 12 s test no coin left the table. The dance motion and drums are unchanged.
- Optional in code only (Jenny: no Settings toggle; it only needs to be optional in case it's ever used during play): the shake is on by default. Setting the code option danceShakesTable to false plays the dance without touching the board. It can only ever shake after Board Clear; a preview during play never moves anything.
- Counts for nothing: the hops run in a separate copy of the table, so the real game physics never moves between games. Any coin that would fall off just drops out of sight, with no score, collection or toast. Before the next board or a replay, the copy is thrown away and the coins go back in their real order.
- Built on the UAT 3 payload (tap-area fix) by work/uat19-danceshake/integrate.py, staged as numeric 20261016144422.
Evidence: UAT-19-evidence/dance-shake-on.mp4, dance-shake-off.mp4, dance-shake-on-vs-off.mp4 (desktop renders of the real build with drums, not phone capture). work/uat19-danceshake: nextboard.json (next board and replay start with identical coin poses, and play identically, with the shake on, off or no dance; the play run uses the same random inputs in each case, since the live game's randomness differs every play anyway); shakecheck.json (on by default, no Settings button, the code option off = no shake, board/coins/collections unchanged, a shaking tick costs about 0.4 ms vs about 1.0 ms for a play tick on desktop). Tickle, tap-area and regression checks re-run on this build: all pass.

## Publication: 2026.10.16 UAT 4
Jenny explicitly said to publish. UAT 4 (numeric 20261016144422, game-only, APK4) contains the tap-area fix and the table shake; UAT 3 was never published on its own. work/uat19-danceshake/publish.ps1 checked the UAT JSON still matched UAT 2 (c3235fc7…), backed up to uat/backups/before-UAT-19-UAT4-20261016144422 (verified), wrote the JSON in place keeping the OneDrive item and share link, and verified the production JSON/APK and UAT APK hashes were unchanged (UAT-19-evidence/publication-uat4.json). Cloud: fresh anonymous download HTTP 200, SHA-256 01c10884… matches, same shared OneDrive item (ETag {5FCB1BAF…},11) (UAT-19-evidence/cloud-verification-uat4.json). Phone UAT of the hidden outlines and the shake is pending.

## Phone UAT: 2026.10.16 UAT 4
October 16, 2026: Jenny checked UAT 4 on her phone after this report and replied "works". That covers the hidden paw outlines and the Dancing pose table shake. Earlier feedback on the tickle: cute, but not quite the moment of joy she wants; it stays as is for now. No production promotion is authorized; that needs separate sign-off.
