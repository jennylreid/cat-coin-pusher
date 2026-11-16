# CP-35 Wild board prototype

Name this conversation "CP-35 Wild board prototype". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md. Read CODEX_BRIEF.md and the "Locked layout (CP-21)" section of SPEC.md first. You are the engineer on this ticket, and Claude PM reviews your report.

**Why:** Jenny, Nov 11: "Right now, there's not enough happening." She wants momentum: one quick, playable prototype board that's wild, noisy and surprising, with a clear beginning and end, and a little hard to win. In her words: "Try to wow me. Try to deliver it quickly and just give me something to play with a beginning and an end. Something surprising and wild and noisy."

This is a **prototype, a hackathon-style build**. Jenny has said to skip the usual approval steps: no art pick, no sound audition, no preview stops. You make the design calls. Go for fun and speed over polish. What she likes gets built properly in later tickets.

**Baseline:** the latest UAT, 2026.11.11 UAT 34. Read the top of `tickets/CP-33.md` and `tickets/CP-25.md` for how the build and update file are made. CP-33 and CP-34 (pickup panel, spin, bell, Quake flight) are waiting on her UAT 34 sign-off, so keep their behavior.

## What to build: the Wild board
Add the Wild board as a new board she can reach easily, for example a "Wild board" button on the start or Settings screen, or Board 4 after Board 3. Your call. The existing three boards must still play as they do now.

1. **Start: state the goal.** A short, clear goal card before play starts. For example: "Clear all 6 prizes in 90 seconds." Pick the goal and limit you think play best. A timer or countdown is visible during play.
2. **Stuff it full:**
   - **Rain coin:** a big coin with a number on it (5, 10 or 25). When it's collected, it gets the CP-33 big moment, then that many free coins rain down onto the board from the top.
   - **More prizes:** the existing treats, plus any new prizes you draw in code (simple, cute and clearly placeholder is fine).
   - **Bonus drops:** every so often a rain coin, a Quake coin or a prize falls onto the board by itself.
   - **Stacks or towers of coins** that topple when pushed, if you can do it quickly.
   - Anything else surprising that fits. Tell us what you added.
3. **Noisy:** plenty of sounds, generated in code, such as coin clinks, rain, stacks toppling, a ticking clock near the end, and win and lose stingers. Respect the sound setting and the Pickup volume dial.
4. **A little hard to win:** tune it so a first try might fail. Report how you tuned it, with a few scripted runs.
5. **End: win or lose.**
   - **Win:** a celebration (cat Happy or Dancing pose, sounds, coins).
   - **Lose** (time runs out): a clear "Time's up" and a button to start the Wild board over.
   - Either way, a clean way back to the normal game.

## Rules
- Approved art stays frozen: cat faces and poses, mitts, coins, Quake coin, treats and pusher. Use them as they are. New things (the rain coin, new prizes, the goal card) are new pieces drawn around them. Don't redraw or restyle approved art.
- Play never pauses during pickups or rain. Hold to drop and taps keep working.
- Keep frame cost reasonable: a 25-coin rain should spread its spawns over time. Report desktop frame cost; the phone numbers come from her log.
- Don't break the normal three boards, saves, settings, Quake or collections.
- Production stays untouched: `phone/`, `backups/`, `CatCoinPusher.apk`. Publish to UAT only. Back up to `uat/backups/` first, name it "2026.11.xx UAT n" with the version strictly increasing, and verify a fresh cloud download.
- No PM stop before publishing. Publish to UAT when it plays well.

## Report
At the top of `tickets/CP-35.md`:
- what's on the Wild board and how to reach it;
- the goal and how you tuned the difficulty;
- the sounds;
- a few frames (goal card, mid-chaos, rain, win, lose) in `tickets/CP-35-evidence/`;
- limits;
- a short "what to try" list for Jenny.

Then stop and wait for the PM. Feedback reaches you through the PM, and files go to Jenny through the PM. Close-out after Jenny's sign-off is the usual commit and push to C:\Users\jenny\GitHub\cat-coin-pusher naming CP-35. Never commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.
