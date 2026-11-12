# CP-33 Prize feedback

Name this conversation "CP-33 Prize feedback". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md. Read CODEX_BRIEF.md and the "Locked layout (CP-21)" section of SPEC.md first. You are the engineer on this ticket and Claude PM reviews your report. Where AGENTS.md says Codex is the engineer, that means you on this ticket.

**Why:** when a prize comes off the board, the player should see at once that it's safely theirs and where it went. Jenny approved this design on Nov 9. It replaces CP-27, which was dropped. Pickup was a painful part of CP-25: about 20 builds, and Jenny rejected every result. The Paw style now in the build is a stopgap.
- Read `tickets/CP-25-evidence/pickup-*-report.md` to see what she turned down, and don't repeat it. She disliked text banners and anything that stopped play.
- Design came from Jenny on Nov 9. Build it to fit this game, an HTML canvas runtime in an Android WebView, not Jetpack Compose or SurfaceView.

**Baseline:** the latest UAT, 2026.10.30 UAT 24 / APK7, unless a newer one exists.
- Source is `work/cp25/installer-fix/release.html`. The runtime is in that build's APK assets.
- UAT 24's update file has an empty `files` object, so don't extract the runtime from it.
- Before publishing, read the top sections of `tickets/CP-25.md` on the update file's shape. Never carry the runtime twice (UAT 20 crashed the phone). Never offer an APK without installer bytes (UAT 23).

## Pickup: the vacuum arc (build this one design)
When a prize is collected:
1. The prize sprite travels from where it was collected to the **Inventory tile** in the HUD, along a curved arc (a quadratic Bézier with ease-in-out). It takes about 0.4 s.
2. While it travels, it shrinks from full size to about 0.2x and leaves a short trail of about 6 small gold sparkles that fade out.
3. When it arrives, the Inventory tile does a quick spring bounce, up to about 1.2x and back in about 0.15 s. The tile's count changes at that moment.
4. Sound stays as it is today unless a short pickup sound already exists to time with the arrival. Don't add new audio assets.

**Rules:**
- The game keeps running and hold to drop is never interrupted.
  - CP-25's Paw style can stop a hold (`pickup-paused`, `pickupBlocksPlay()`). That must be gone.
- No text banner, screen flash or tap to dismiss. Tapping keeps dropping coins.
- Several prizes in quick succession each fly on their own without delaying the game. Cap the sparkles so a burst can't cause a frame spike.
  - Reuse objects rather than allocating per frame. CP-29 tracks frame spikes, so don't add new ones.
- BOARD CLEAR! still follows the final pickup, then Rest, then the next board.
- Remove the Paw, ribbon and satchel bubble styles and the Pickup style setting.
- First-time prizes may keep any existing first-time cue, but no style shopping. If the current first-time behavior conflicts with this design, say so in the report rather than inventing a second design.

## Lost prize: grey, sink and ripple (conditional)
**First, find out whether a prize can actually be lost today**, for example by falling into a side gutter or off the board. The runtime has gutter code (`gutterOff`, and the board `lost` status is about running out of coins, not prizes). Answer with evidence: a scripted run or a code path.
- **If prizes can be lost:** when one crosses the loss boundary, desaturate it to grey, shrink it to nothing over about 0.3 s while fading it, and draw a small dark ripple ellipse that spreads at the spot. Same rules as above: no text, nothing blocks play.
- **If prizes can't be lost:** build nothing for this half. Say so in the report. It waits for CP-24 (prizes, stacks and gutters).

## Tuning on her phone
Under Settings → Developer mode, add:
- a preview button that plays the pickup (and the lost effect, if built)
- simple controls for flight time, end size, sparkle count, bounce size and bounce time (and sink time, if built)

Values persist, show on screen, and take effect without a new build. Jenny has no USB and shouldn't have to copy anything, so include the current values in the existing Send performance log. Her chosen values become the defaults in the next build. Normal players see none of this.

## Rounds
Feedback reaches you through the PM, not from Jenny directly. Plan on two rounds. If two rounds don't get there, stop. The PM and Jenny will decide whether to keep a plain version.

## Done when, with evidence
1. A pickup plays as described on a phone-size desktop run. Provide a short clip, plus frames at the start, middle, arrival and bounce.
2. The arc ends exactly on the Inventory tile on all three boards. The count changes on arrival.
3. A hold in progress keeps dropping through a pickup, with drops logged at the finger's position.
4. Five prizes in quick succession don't pile up or delay the game.
5. Tapping during a pickup drops a coin.
6. The clear order holds when the final prize is what clears the board.
7. Held FPS with pickups firing is no worse than UAT 24 on the same scripted run. Desktop numbers aren't phone evidence. Phone numbers come from the performance log.
8. The lost-prize answer, with evidence, and the effect if it was built.
9. The preview and controls work and are hidden when Developer mode is off. The values appear in the log.
10. No Paw, ribbon, bubble or style setting code paths remain reachable.

## Don't touch
- Locked layout and approved art: cat, mitts, coins, Quake coin, treats and pusher. Use the treat sprites as they are, with no generated art. The Inventory tile's look stays as it is apart from the bounce.
- Coin physics, drop rate, balance, purse, boards, gutters and collections (CP-24, CP-28, CP-29 and CP-30 cover those).
- Production: `phone/`, `backups/`, `CatCoinPusher.apk`. Work in UAT only.

## Regression checks (report only if something fails)
- UAT saves and settings carry over, and the sound setting is respected.
- Quake and collections work. The start board stays still until the first tap.
- The automatic UAT update is still offered, with no native change unless you need one. If you do need one, say why.

## Publication and report
- Back up to `uat/backups/` before publishing. Name the build "2026.11.xx UAT n", with the version strictly increasing.
- Verify a fresh cloud download.
- Report at the top of `tickets/CP-33.md`: changes, evidence, limits, and a short checklist of what Jenny should try and see. Then stop and wait for the PM.
- Close-out after Jenny's sign-off: commit and push to C:\Users\jenny\GitHub\cat-coin-pusher with a message naming CP-33. Never commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.
