# CP-25 Playable loop v1

**Collections layout / “You got it!” revision: 2026.10.28 UAT 4 / APK4**, numeric **20261028164442**. Backup, local package and fresh cloud hash verified. Phone UAT/sign-off pending. Stage 1 signed off October 28; chosen future prizes remain sardine, crab and toy mouse.

## Current changes

- The **Collections tile beside the right edge of the table** opens a full-screen collection view. Water and Cheese have tabs; all three inventory items sit in a placeholder satchel anchored along the bottom. The frame and satchel are simple placeholder drawings for a later art ticket. Inventory's footer shortcut opens the same satchel view.
- **Drag and drop only.** Drag a treat from the satchel into its matching silhouette. A valid target highlights. A matching drop consumes one; a wrong, cancelled or uncompleted drag keeps it. Tap-tap placement is removed. Filled/future slots cannot consume items.
- Water rewards **100 coins once** for tuna + shrimp; Cheese rewards **50 once** for cheese. Existing placements, reward flags and inventory carry forward; extra copies remain in the satchel. Future sardine/crab/toy-mouse outline slots stay unfilled and do not block these rewards.
- Every front-edge treat win queues a **“You got it!”** card: large existing sprite, item name and a small animated ray flourish. Cards show individually for about **2 seconds** each, or dismiss with a tap. Dismissal consumes the touch and stops any held drop stream, so it never spends a coin. Automatic popup expiry lets an existing hold continue. Physics can run beneath the card; the winning board waits for queued cards, then clear feedback and its next-board transition.
- Purse, refill, 0.20-second tap/hold rate and Developer Empty purse remain as documented in the [previous Stage 2 report](stage2-report.md). No new physics/balance change in this revision.

## Validation and evidence

- [Gesture/payout checks](layout/checks.json): side tile opens without a coin drop; satchel below slots; taps cannot place; matching/wrong/cancelled/other-pointer drags; partial/full placement and once-only reward persistence; actual front payout credited exactly once; board running beneath a popup; dismissal never drops; 2-second individual queue timing; side loss gives no inventory/popup; both winning popups finish before clear feedback/automatic Board 2.
- Phone-size screenshots, visually inspected: [side tile](layout/side-collections-tile.png), [Water and satchel](layout/water-satchel.png), [drag in progress](layout/drag-tuna.png), [placed](layout/water-placed.png), [Cheese and satchel](layout/cheese-satchel.png), [You got it](layout/you-got-shrimp.png), [queue](layout/queued-treats.png), [short safe-area screen](layout/short-safe-area.png), [short side tile](layout/short-side-tile.png). Standard captures are 1080×2400; the shorter fixture is 1080×1944 with top/bottom insets.
- [New 18.6-second interaction clip](layout/satchel-and-awards.mp4), 540×1200, silent desktop capture: two queued awards, board advance, satchel drags and Cheese completion. The existing board prizes were moved through the real front-payout path to demonstrate UI timing; this is an explicit UI fixture, not a natural win. [Fixture details](layout/video-fixture.json). The [previous natural 1→2→3→1 hold loop](stage2/hold-loop-and-collections-5x.mp4) and its [results](stage2/natural-hold-loop.json) remain the full-loop evidence.
- Popups are transient presentation; closing during one retains already saved inventory without replaying the popup. Desktop checks do not establish phone receipt, touch feel, Android lifecycle behavior, perceived sound or device FPS. Existing wall-clock refill and interrupted-power save limits remain in the previous report.

## Jenny's UAT checks

1. Open Collections using the tile beside the table. Check the whole-screen frame and bottom satchel on your phone.
2. Drag a treat into its silhouette; try a wrong drop, lift back in the satchel, and tap-tap. Only the matching drag should place/spend it.
3. Win a treat: see the large “You got it!” card. Tap it and check the purse does not spend a coin. Let another expire on its own; quick successive wins should show one card at a time.
4. Reopen UAT: placed items, inventory and once-only rewards should remain.

## Publication and close-out

Baseline: CP-25 UAT 3 / APK4. Source: `work/cp25/layout/release.html`; builder: `build.py`, `collections.js`, `ui.js`, `awards.js`, reusing the prior future outlines. Backup: `uat/backups/before-CP-25-layout-20261028164442`. [Package verification](layout/package-verification.json), [publication](layout/publication.json), [cloud verification](layout/cloud-verification.json). Published JSON SHA-256: `b0b4b64e9db70c642d19b27d1b2be55b992dcdde2a57987e033db44e37fb1875`.

Commit/push close-out follows Jenny's ticket sign-off, as the brief specifies. Production remains outside this ticket's publication scope. CODEX_BRIEF.md remains untouched while the separate CP-22 promotion report is absent from the top of CP-22.md; this report is the current UAT checkpoint. Earlier history: [Stage 1 report](stage1-report.md), [previous Stage 2 report](stage2-report.md).
