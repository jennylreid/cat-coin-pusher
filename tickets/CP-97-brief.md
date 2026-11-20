# CP-97 Switch cats on the endless board (Jenny, Nov 19)

Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md and CODEX_BRIEF.md; read tickets/CP-92.md (the
endless board) and tickets/CP-23-core-loop.md (cat switching was decided Nov 18). You are the engineer; Claude PM reviews.

**Jenny, verbatim:**
- Nov 18: "the board and the cat choice are two totally different things. I get the same board regardless of which cat I
  choose. So it's weird to have to choose a cat before entering the board."
- Nov 19: "I can't switch between cats. Why don't we get that going?... that chip... It currently says orange, but if I
  open it, it could have little faces of each cat." "The chip has to be locked strategically for sure. And I do want to
  use the approved faces."

## Do (UAT only; endless board only)
- Tap the cat name chip on the endless board: a small row of the five cats' approved faces opens (as they are; no new
  art). Tap a face: that cat takes over on the same board; its side game, power, power button and side-game coin rule
  come with it. Board, coins, wallet, reset meter and banked laser coin stay as they are.
- Locked while a power (incl. its title and held beat), a side game, the Dance break or the wheel is running, and while a
  side-game coin is on the board or falling in; the chip shows it's locked (no words needed) and unlocks after.
- Instant switches, no fades. The timed levels are unchanged. Approved art and the frozen pickup untouched.

## Queue
UAT 120 (Orange dance), 121 (trim), 122 (giant towers), 123 (Sleepy Coins) are ahead. You are **UAT 124**. Build and run
light checks; before publishing or any heavy run, ask the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`).

## Report
Top of `tickets/CP-97.md`: stills at 412x915 and 360x640 (chip closed, open, locked), the phone test with a sign-off line.
Then the full regression set (waking watcher) and `python work/checkpoint.py`.
