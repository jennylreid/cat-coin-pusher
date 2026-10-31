# CP-25 Playable loop v1

Name this conversation "CP-25 Playable loop v1". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md and SPEC.md's "Locked layout (CP-21)" first. Design background (read, don't build all of it): `tickets/CP-23-notes.md`.

**Baseline:** 2026.10.28 UAT 1 (source `work/cp22/release.html`), which is being promoted to production in a separate "CP-22 promotion" chat. If that promotion is still running, leave `phone/`, `backups/` and CODEX_BRIEF.md alone until its report is at the top of `tickets/CP-22.md`.

**Why:** Jenny, Oct 28: "right now I have a game I can't even really play." The board, cat and coins exist, but nothing carries over between boards and prizes go nowhere. This ticket builds the smallest real game loop from what's already decided, so she can play it and form opinions. Worlds, powers and side games come later.

## What to build
1. **Purse.** One coin purse that carries over between boards and app restarts. It refills on a timer up to a cap, and coins won off the front go into it. If it's empty, the board waits with a gentle "more coins in m:ss" message; nothing is lost. Propose the starting amount, refill rate and cap, with reasons; we tune after play. This replaces the per-board coin allowance; say what you did with it.
2. **Board to board.** Clearing a board gives a short reward moment (reuse existing cat reactions), then the next board starts. Boards 1–3 repeat in a loop for now.
3. **Inventory.** Every treat that falls off the front is added to an inventory (count per item). A button opens an inventory screen showing what you hold, using the existing treat art.
4. **Collections.** A collection screen with two collections:
   - Water: tuna, shrimp, plus one or two silhouette-only slots for future items.
   - Cheese: cheese, plus one silhouette-only slot.
   The player drags (or taps) an item from inventory into its matching silhouette to place it; it isn't placed automatically. **Pick the future items:** propose 4–6 new prizes for each theme (Water: sea and fishing things a cat would love; Cheese: kitchen and mouse things), each with a one-line reason. Jenny picks; the chosen ones become the silhouette slots (outline shapes only for now; their full art is a later art ticket, one piece at a time). Put the list in the Stage 1 report so she can pick before Stage 2. Filling a collection (all currently obtainable items) gives a reward (coins into the purse plus a celebration). Future-item slots stay as silhouettes.

**Art:** existing treat sprites for items; plain, clearly placeholder shapes for screens, buttons and silhouettes. No generated art, no new cat art.

## Stages (wait between them)
- **Stage 1:** purse, timer, board-to-board, inventory. Publish to UAT, report in `tickets/CP-25.md`, and wait for Jenny's OK.
- **Stage 2:** collection screens and placement, plus (added Oct 28 after Stage 1 UAT; Jenny finds dropping too slow):
  - **Hold to drop:** holding a finger down streams coins at a steady rate, following the finger left and right; lifting stops. Single taps still drop one.
  - **Faster drops:** propose a faster rate than the 0.35-second gap (both for taps and the stream). Keep CP-22's results: re-run its pass-through, flip and pile-up checks at the new rate and report them; if the faster rate breaks them, use the fastest rate that holds and say so.
  - **Developer mode "Empty purse" button** so the countdown can be tested without spending coins.
  - **Collections layout (Jenny, Oct 28):**
    - Open Collections from a tile or button in the free space left or right of the table. It must not move or resize the locked layout.
    - The collection screen takes up the whole screen.
    - The inventory sits along the bottom of that screen, adventure-game style: a decorative holder such as a satchel, with your items in it.
    - Drag and drop only: drag an item from the satchel into its silhouette to place it.
    - The satchel and screen frame are clearly placeholder drawings for now; their final art is a later art ticket.
  - **"You got it!" overlay (Jenny, Oct 28):** when a treat falls off the front, it pops up over the screen: the item shown large, its name, and a small flourish. It goes away by itself after about 2 seconds, or sooner with a tap. Tapping it never drops a coin. Several items in quick succession must queue or stack neatly, not pile up. The board can keep running underneath.
  Publish to UAT and report.

- **Stage 3 (Jenny's UAT 4 feedback, Oct 28):** the loop works, but the screens look like placeholders; they need character.
  1. **"You got it!" overlay:** no text. The backdrop is translucent so the board shows through; only the collected item is solid. Add a short, pleasing "item collected" sound. Keep the timing, tap-away and queue.
  2. **Collections tile:** replace the black square with a decorative tile that adds character (for example a little treasure box, a fish-and-cheese badge or a satchel with a paw clasp). Same spot beside the table; locked layout untouched.
  3. **Scene backgrounds:** each collection is a proper illustrated scene, not a black screen with square tiles. Water: e.g. a seaside or underwater scene; Cheese: e.g. a cosy kitchen or pantry. Each item's slot is an empty outline drawn into the scene where that item naturally belongs (tuna, shrimp, sardine, crab in Water; cheese, toy mouse in Cheese). Dragging an item into its outline fills it in place. The satchel stays along the bottom.
  4. **Completion payoff:** finishing a scene should feel like a game reward and look good: the scene comes alive (e.g. it animates, sparkles or plays a short sequence), a fanfare plays, coins pour into the purse, and the cat reacts when you return. Propose two or three payoff ideas in one line each and build the one Jenny picks.

  **Art process for Stage 3 (AGENTS.md "Art and layout"):** layout first: lock each scene's layout (slot positions, satchel, frame) before painting. Then paint one piece at a time on the same canvas: the tile, the Water scene, the Cheese scene. Show each piece as a phone-size still and wait for Jenny's OK before building it into the game. The approved treat art (cheese, shrimp, tuna) is frozen: use it as is inside the scenes; outlines for future prizes only. Don't touch the cat, coins, table or pusher.

  **Order:** do item 1 (overlay and sound) first and publish it to UAT straight away; then send the payoff ideas and the first art piece for OK.

- **Stage 4 (Jenny's UAT 15 review, Oct 30): lag first, then new pickups.**
  Jenny's results: board loop **passes**; collections **pass for now** (more iteration later, not in this ticket); **hold to drop can't pass until the lag is fixed**; none of the three pickup styles work for her.
  1. **Fix the lag (first, on its own build).** On Jenny's phone UAT 15 still feels laggy and coins seem slow to travel. Find and fix the cause so play is smooth at a steady frame rate on her phone (target 60 FPS, steady, not just a peak readout). Measure before and after with the in-game FPS readout and say what she should see. Make sure the on-screen readout shows a steady figure (e.g. average over the last few seconds) so she can report it. Don't change coin physics rules, drop rate or layout to get there; if coin travel speed itself is too slow (not lag), say so separately and don't change it without her OK. Publish this to UAT on its own so she can judge hold to drop and timing.
  2. **Drop the three pickup styles** (ribbon, satchel bubble, paw) and the cycle setting.
  3. **Three new pickup styles, after the lag build.** Each one must be beautiful: the prize comes into view, then fades out. While it shows, the background scene is briefly blurred. No text. One chime per pickup, no tap-to-dismiss, one at a time. Keep Settings → Pickup style with a preview so Jenny can try each; she'll judge timing once the lag is fixed. Show phone-size stills of the three first and wait for her OK before building them.
  4. Decided (Jenny, Oct 30): keep the "PRIZE LOST" rule as built: a required prize in the side gutter loses the board and the same board restarts; purse, inventory and collections are kept. No change needed.

  **Update, Jenny's UAT 16 result (Oct 30): failed.** About 13 FPS on her phone while holding, and coins don't follow her finger when she holds and slides: "not workable at all." This now comes before everything else in the ticket, including pickup work.
  - **Find the real cause of the slowdown.** Run one identical scripted test on production 2026.10.27, CP-22 2026.10.28 UAT 1 and UAT 16, and report whether this is a regression and which change caused it. Desktop already reproduces low FPS (about 27 FPS), so profile there.
  - **Add a phone readout** behind Developer mode: physics ms, drawing ms and coin count alongside FPS, so Jenny's phone can tell us where the time goes.
  - **Bigger options are now allowed.** The earlier savings weren't enough. Propose what would make a real difference (fewer physics steps, coins at rest doing no work, cheaper drawing of coins, limiting how many coins move at once). Say what each would change in how the game feels. Changes that don't alter the feel can go ahead; ask Jenny before any that do.
  - **Finger follow:** check whether it's caused by the low frame rate or is its own bug. Each coin must drop at the finger's current position, whatever the frame rate.
  - **Hold to drop stays for now.** If it still doesn't follow properly once play is smooth, say so, and Jenny will decide whether to remove it and go back to tap only.

  **Order:** lag build to UAT → three pickup stills → Jenny's OK → build pickups to UAT. Report each step at the top of `tickets/CP-25.md` with a short checklist of what to try and what she should see.

## Done when, with evidence
1. Purse and inventory survive closing and reopening the app (desktop test; phone receipt is Jenny's).
2. The timer refills while the app is closed (offline time counts), up to the cap.
3. Clearing a board leads to the next one; an empty purse pauses play with the countdown.
4. Every treat falling off the front lands in inventory exactly once.
5. Placing items fills silhouettes; completing a collection pays out once.
6. Phone-size screenshots of the inventory and collection screens, and a short clip of one full loop.

## Don't touch
- The locked layout, approved art (cat, mitts, coins, Quake coin, treats, pusher), coin physics from CP-22.
- Powers, Quake behaviour, prize placement, stacks and gutters (CP-24).
- Production (UAT only).

## Regression checks (report only if something fails)
- Existing UAT saves and settings carry over (sound, current board).
- The start board stays still until the first tap; Quake still works.
- Automatic UAT updates still offered; no drawing slowdown.

## Publication and report
Back up to `uat/backups/` before each publish; next "2026.10.xx UAT n" name. Report changes, evidence, proposed numbers, limits and what Jenny should try. Close-out after Jenny's sign-off: commit and push to C:\Users\jenny\GitHub\cat-coin-pusher with a message naming CP-25.
