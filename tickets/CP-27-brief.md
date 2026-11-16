# CP-27 Pickup moment

Name this conversation "CP-27 Pickup moment". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md and SPEC.md's "Locked layout (CP-21)" first. You are the engineer on this ticket; Claude PM reviews your report. AGENTS.md's mentions of Codex as engineer apply to you here.

**Why:** the moment a prize comes off the board should be a pleasure, and so far it isn't. CP-25 spent about 20 builds on it and Jenny rejected every result; the Paw style now in the build is a stopgap. Jenny's words: "beautiful", comes into view then fades out, background briefly blurred, "timing is everything." The one motion she approved was the soft spotlight (UAT 8, source `work/cp25/pickup-spotlight`, report `tickets/CP-25-evidence/pickup-spotlight-report.md`). It was never judged on a smooth build, because the lag wasn't fixed until UAT 21. Later reports in `tickets/CP-25-evidence/pickup-*-report.md` show what she turned down; read them so you don't repeat it.

**Baseline:** the latest published UAT, 2026.10.30 UAT 24 / APK7 unless a newer one exists. Source `work/cp25/installer-fix/release.html`, runtime in that build's APK assets. UAT 24's update file has an empty `files` object, so don't extract the runtime from it. Read the top sections of `tickets/CP-25.md` on update file shape before publishing: never carry the runtime twice, and never offer an APK without installer bytes.

## One design
Build this one design, as Jenny approved it on Nov 1. No options to compare, no stills.

**First time you get an item (the full moment), about 1.2 s in total:**
1. The board softens and dims over about 0.15 s.
2. The prize rises from where it fell, in a soft spotlight with no frame or decoration, growing to about 1.5x its size.
3. It settles and one chime plays. It holds for about 0.8 s.
4. It fades out and the board comes back.

**Repeats:** a much smaller version of the same idea, with no blur or dim over the board and a quieter presence. A pickup seen fifty times a session must not wear thin. You choose the details and say what you chose in one line.

**Rules for both:**
- The game keeps running and hold to drop is never interrupted. CP-25's Paw style could stop a hold (`pickup-paused`); that must be gone.
- No text. No tap to dismiss. Tapping keeps dropping coins.
- One at a time. Several prizes in quick succession must not pile up or delay the game; repeats may be skipped or merged if a queue would build, and say which.
- BOARD CLEAR! still follows the final pickup, then Rest, then the next board.
- Remove the Paw, ribbon and satchel bubble styles and the Pickup style setting.

## Tuning on her phone
Under Settings → Developer mode, add a preview button (plays the first-time and repeat versions) and simple controls for the timings: dim in, rise, hold, fade out, plus size and dim strength. Values persist, show on screen, and take effect without a new build. Jenny has no USB and shouldn't have to copy anything: include the current values in the existing Send performance log so you can read them from the synced file. Her chosen values become the defaults in the next build. Normal players see none of this.

## Performance
A full-screen blur over a moving board may bring lag back; CP-25's fix must not be undone. Measure held FPS with pickups firing against UAT 24 on the same scripted run. If live blur costs too much, use a dim plus a blur of a frozen frame of the board, and say so. Phone numbers come from the performance log; desktop numbers are not phone evidence.

## Rounds
Feedback reaches you through the PM, not from Jenny directly. Plan on two rounds. If two rounds don't get there, stop; the PM and Jenny will decide whether to keep a plain version.

## Done when, with evidence
1. A first-time pickup plays as described on a phone-size desktop run: short clip plus frames at each step.
2. A second pickup of the same item plays the repeat version; first-time status survives close and reopen, and existing UAT saves with items already held count those as seen.
3. A hold in progress keeps dropping through a full moment, with drops logged at the finger's position.
4. Five prizes in quick succession don't pile up or delay the game.
5. Tapping during a pickup drops a coin and doesn't dismiss it.
6. The clear order holds when the final prize is what clears the board.
7. The FPS comparison above, stating the blur method used.
8. The preview and controls work and are hidden when Developer mode is off; values appear in the log.
9. No Paw, ribbon, bubble or style setting code paths remain reachable.

## Don't touch
- Locked layout and approved art: cat, mitts, coins, Quake coin, treats, pusher. Use the treat art as is; no generated art.
- Coin physics, drop rate, balance, purse, boards and collections (CP-28, CP-29 and CP-30 cover those).
- Production: `phone/`, `backups/`, `CatCoinPusher.apk`. UAT only. The production promotion in `work/cp25/promotion` belongs to another chat; if it's still running, leave it and CODEX_BRIEF.md's production lines alone.

## Regression checks (report only if something fails)
- UAT saves and settings carry over; sound setting respected, including the chime.
- Quake and collections work; start board stays still until the first tap.
- Automatic UAT update still offered, with no native change unless you need one; if you do, say why.

## Publication and report
Back up to `uat/backups/` before publishing; next "2026.11.xx UAT n" name, version strictly increasing. Verify a fresh cloud download. Report at the top of `tickets/CP-27.md`: changes, evidence, limits, and a checklist of what Jenny should try and see. Then stop and wait for the PM. Close-out after Jenny's sign-off: commit and push to C:\Users\jenny\GitHub\cat-coin-pusher with a message naming CP-27. Never commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.
