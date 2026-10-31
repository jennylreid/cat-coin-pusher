# CP-25 Playable loop v1

**Stage 1 published: 2026.10.28 UAT 2 / APK4**, numeric **20261028152019**. Backup, local package and fresh cloud SHA-256 verified; existing OneDrive item/link retained. Stage 1 phone UAT and Jenny's OK pending. Stage 2 waits for that OK and future-prize choices.

## Stage 1 changes

- One shared purse: **220 starting coins, +1 every 20 seconds, refill cap 300**. The start matches Board 1's old allowance and gives room to learn; the rate gives a gentle recovery (3 coins/minute), while the cap banks 100 minutes of refill. Front-edge winnings can exceed 300; earned coins are never discarded. At or above 300, refill time does not accumulate.
- Per-board allowances and countdown losses are removed. An empty purse keeps the current board and shows “More coins in m:ss”; the next refill enables another tap. CP-22's 0.35-second ordinary-tap gate remains.
- Each clear uses the existing collection messages, sound and Rest reaction, waits two seconds after feedback finishes, then opens the next board. Boards 1 → 2 → 3 → 1 repeat. Advancing does not refill the purse.
- Inventory button above Settings opens counts of cheese, shrimp and tuna with the existing art. It pauses the board; Close returns to play. Front-edge treats count once; side losses do not count.
- UAT-only `catpusher.uat.loop.v1` storage retains purse, refill timestamp, inventory, selected board, collected targets and current board bodies/positions/velocities. Save occurs on drops, payouts, board advance, periodic checkpoints, page hide and backgrounding. Existing audio settings retain their key. The baseline had no active board-save hook.

## Validation and evidence

- [Focused checks](checks.json): close/reopen preserves purse, board number, spent coins and body positions; offline time refills only to cap; no banked time above cap; empty purse waits/resumes; front coins and all three treats count exactly once; side coins do not pay; won Board 3 advances to Board 1; inventory pauses motion.
- [Natural loop](natural-loop.json): all three boards clear without powers at 0.35-second taps, using 79 / 78 / 90 coins. Board 1 returns with 3 cheese, 3 shrimp, 1 tuna and 29 coins (28 at the third clear, then one refill during feedback). Headless and rendered runs agree.
- Phone-size 1080×2400 screenshots: [Inventory after loop](inventory.png), [empty inventory](inventory-empty.png), [empty-purse countdown](empty-purse.png), [Board 1 after loop](board-looped.png). Visually inspected. [Full 1→2→3→1 loop clip](full-loop-5x.mp4): 20.6 seconds, 540×1200, 5× speed, silent desktop capture. Gameplay screenshots/clip were captured before the final release-label change, so their footer says UAT 1; shipped footer/package say UAT 2.
- Desktop reopening uses the real game scripts and Rapier in separate runtime instances with the same storage. It is not evidence of phone receipt, Android lifecycle behavior, perceived sound or device FPS. Closing during a power preserves board bodies and spent charge, but does not resume the unfinished power animation. Refill uses the device wall clock; moving the clock backward restarts the current refill interval.

## Stage 2 choices for Jenny

Pick one or two future Water items and one Cheese item. These will be outline silhouettes only; full art is a later ticket. My suggested small first set is **sardine + crab** for Water and **toy mouse** for Cheese.

| Water prize | Why |
|---|---|
| Sardine | A small oily fish a cat would eagerly chase; a clear long silhouette. |
| Crab | A sideways scuttling catch with distinctive claws. |
| Squid | Dangling tentacles make a playful fishing prize. |
| Clam | A seafood treat with a simple shell outline. |
| Fishing float | A bobbing fishing toy a cat would bat at. |
| Fish skeleton | A cheeky leftover with an unmistakable outline. |

| Cheese prize | Why |
|---|---|
| Toy mouse | Connects cheese and cat play with a recognizable tail. |
| Milk bottle | Fits the kitchen theme and gives a tall contrasting outline. |
| Wooden spoon | A kitchen object with an easy silhouette. |
| Rolling pin | A playful kitchen shape distinct from the treats. |
| Cracker | A familiar cheese companion with a scalloped outline. |
| Mouse-sized cheese wheel | A round cheese prize that contrasts with the existing wedge. |

## Jenny's UAT checks

Play through boards and watch the purse carry over; open Inventory after winning treats; close/reopen UAT and check progress; return after a few minutes to see offline refill. An empty purse should preserve the board and show the next refill countdown. Confirm that the existing update offer delivers this release.

Stage 2 collection placement/rewards and collection screenshots are intentionally pending approval. Commit/push close-out follows Jenny's ticket sign-off as specified in the CP-25 brief. Production is outside this ticket's publication scope.

## Publication

Baseline: CP-22 2026.10.28 UAT 1, source work/cp22/release.html. Release: work/cp25/release.html. Only index.html changed in the game package; APK4 retained. [Package check](package-verification.json), [publication](publication.json), [cloud verification](cloud-verification.json). Backup: uat/backups/before-CP-25-stage1-20261028152019. Cloud SHA-256: cde427419bcab9c92bd97c4145a5cfe54c83d0cd15853677e73ef1a2b2b1f5a9. SPEC.md and DEVELOPER.md record the Stage 1 rules/source. CODEX_BRIEF.md left alone because the separate CP-22 promotion has not yet added its report at the top of CP-22.md; this ticket/report is the UAT source checkpoint meanwhile.


