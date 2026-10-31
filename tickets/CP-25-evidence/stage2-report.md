# CP-25 Playable loop v1

Stage 1 signed off by Jenny October 28. Prize picks: **sardine and crab for Water; toy mouse for Cheese**. **Stage 2 published: 2026.10.28 UAT 3 / APK4**, numeric **20261028161350**. Backup, local package and fresh cloud SHA-256 verified; same OneDrive item/link retained. Stage 2 phone UAT/sign-off pending; production is outside scope.

## Stage 2 changes

- Inventory, Water and Cheese share a screen with tabs. Tap an owned treat, then tap its matching silhouette. Placement spends one inventory item and persists. Extra copies stay in inventory; already placed slots cannot consume another item.
- Water completes with tuna + shrimp and pays **100 coins once**. Cheese completes with cheese and pays **50 coins once**. Both are 50 coins per obtainable item; rewards can exceed the refill cap. Completion shows a banner, plays the existing fanfare and uses the existing Rest reaction on return to the board. Reopening or gathering more copies does not pay again.
- Sardine, crab and toy mouse are plain outline placeholders marked “Future prize”. They are not obtainable and do not block today's completion rewards. No new prize art.
- **0.20-second gap** for both taps and holding (5 coins/second, versus 0.35 before). An eligible tap drops immediately; holding streams without a queue and follows the finger horizontally. Lift, cancellation, lost capture, backgrounding or opening a screen stops it. No catch-up burst after a pause. Powers still exclude ordinary drops.
- Settings → Developer mode → **Empty purse** empties and saves immediately, stops holding and starts a fresh 0:20 countdown. The button is hidden with Developer mode off. It preserves board and inventory.
- Stage 1 purse/refill and board loop remain: start 220, +1/20 seconds up to refill cap 300, front coin wins above cap allowed; no board allowance or time-limit loss. Existing `catpusher.uat.loop.v1` save gains placement and paid flags with no reset.

## Validation and evidence

- [Focused checks](stage2/checks.json): Stage 1 save migration; matching-slot UI taps; item consumption; reward once above cap; placement/reward persistence across reopening; future-slot rejection; single-tap and 5/second stream; horizontal follow; release/cancel/screen stop; real Developer Empty purse button and refill recovery.
- Faster-rate CP-22 checks: swept currency pass-through **0 confirmed crossings**, **0 flips**, **0 unauthorized flips**. Ledge contact **0 samples deeper than 0.5 game unit**, maximum 0.176. Mixed coin/treat contact checks at centre, left and sweeping aim: **0 contacts deeper than 0.5 unit**, worst 0.144 unit. Launch audit: **0 events** (maximum horizontal 1.493 m/s, upward 0.303 m/s; audit includes off-board falls). These retain the CP-22 checks at the faster rate; physics is unchanged. [Swept](stage2/swept.json), [flips](stage2/flips.json), [ledge](stage2/pusher.json), [pile centre](stage2/pile-centre.json), [pile left](stage2/pile-left.json), [pile sweep](stage2/pile-sweep.json), [launch](stage2/launch.json).
- Phone-size collection screenshots: [inventory](stage2/inventory.png), [Water silhouettes](stage2/water-empty.png), [selected item](stage2/water-selected.png), [Water complete](stage2/water-complete.png), [Cheese silhouettes](stage2/cheese-empty.png), [Cheese complete](stage2/cheese-complete.png), [short safe-area view](stage2/water-short-safe-area.png). Desktop-rendered at 1080×2400; short fixture 1080×1944 includes top/bottom insets. UI screenshot fixture seeds 2 cheese, 2 shrimp, 1 tuna; real placement handlers generate completion states. Visually inspected.
- [Natural hold loop](stage2/natural-hold-loop.json): Boards 1→2→3→1 without powers, **105 / 87 / 122 drops**, Cheese placed/rewarded after Board 1, Water after Board 3. Final inventory after placement: 2 cheese, 2 shrimp, 0 tuna; all three collection slots placed, both rewards paid, purse **110**. [Clip](stage2/hold-loop-and-collections-5x.mp4): 27.8 seconds, 540×1200, gameplay at 5× with readable UI pauses, silent desktop capture. Footer spacing was refined after capture: [current game HUD](stage2/board-current-hud.png), [Empty purse countdown](stage2/empty-purse.png). [Earned Water](stage2/earned-water-complete.png), [earned Cheese](stage2/earned-cheese-complete.png), [inventory after spending](stage2/earned-inventory-after-placement.png).
- [Persistence/refill checks re-run on Stage 2](stage2/persistence.json) pass. Earlier Stage 1 persistence/refill/loop evidence and proposals: [Stage 1 report](stage1-report.md). Desktop checks do not establish Android lifecycle behavior, phone receipt, perceived sound or device FPS. Interrupted powers retain saved bodies/spent charge but do not resume their unfinished animation. Wall-clock refill is not protected against changing the device clock.

## Jenny's UAT checks

1. Tap once; then hold and slide left/right. Lift and confirm dropping stops.
2. Win a treat, open Inventory/Collections above Settings, select it and tap its matching silhouette. Complete Cheese, then Water; see +50/+100 and celebration. Reopen UAT and confirm placed items and rewards remain without another payout.
3. Enable Developer mode in Settings, tap Empty purse, close Settings and check “More coins in 0:20”; wait for refill and resume.
4. Play through Boards 1–3 and back to 1, carrying purse/inventory over.

## Publication and close-out

Release **2026.10.28 UAT 3 / APK4**, numeric **20261028161350**. Backup: `uat/backups/before-CP-25-stage2-20261028161350`. [Package verification](stage2/package-verification.json), [publication](stage2/publication.json), [cloud verification](stage2/cloud-verification.json). SHA-256 `e1b754feb9dd71eb36095ace6198881ea75cde03c48e2470af44b15fd881e998`. Stage 2 source: `work/cp25/stage2/release.html`, builder `build.py` + `collections.js`, pinned to Stage 1 `work/cp25/release.html`. Commit/push close-out follows Jenny's Stage 2 sign-off per the brief. Production promotion needs separate approval of the specific scope. CODEX_BRIEF.md remains untouched while the separate CP-22 promotion report is absent from the top of CP-22.md; this report is the current UAT checkpoint meanwhile.


