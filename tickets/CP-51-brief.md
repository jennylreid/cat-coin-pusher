# CP-51 Drop speed and Pause (approved by Jenny, Nov 16)

Name this conversation "CP-51 Drop speed and Pause". Engineer: read AGENTS.md (the frozen pickup and frozen-art rules),
CODEX_BRIEF.md, tickets/CP-48.md (coin limit) and tickets/BASE-1.md. You are the engineer; Claude PM reviews.
Base: the UAT build from CP-50 (start only after CP-50 is in UAT). Production untouched.

**Jenny (Nov 16):** "we need to slow down the drop speed of the coins. Not sure when we speeded those up but long
press coin drops should move more slowly. Maybe we allow slightly faster speed for very fast tapping since that would
indicate the user is trying to specifically control the coin drops." The 45-coin limit "destroyed gameplay" on Level 6.
"There needs to be a pause button also, since we have a timer ... once you hit pause, you can open up a whole pop-up
that has anything you need in it." Finish: "a good idea" (end the round instead of waiting out the timer on a
half-empty board).

## 1. Drop speed
- Find when and where the drop speed went up (which build/ticket) and give old vs current numbers for holding and tapping.
- **Holding:** a slower, steady stream. Propose the number with the reason.
- **Fast tapping:** may go a bit faster than holding, up to a ceiling.
- **45-coin limit:** remove it if a full-length hold can no longer flood the board on any level (show peak coins per
  level). Keep only the far-off freeze safety net (the 120-piece backstop) unless it is no longer needed.

## 2. Pause pop-up
- A **Pause** button on the board (in the top bar; small, out of the way). Tapping it stops the timer, physics and drops.
- Pop-up (existing card style): **Resume**, **Finish** (end the round now; keep what you won, normal end card),
  **Sound** on/off, **How to play**, **Home**.
- The game pauses on its own when the app goes to the background or the screen turns off, and shows the pop-up on return.

## 3. Add-ons (Jenny, Nov 16, after passing UAT 67)
- **Level 1 is the intro:** it starts with only gold coins, plus the cheese and shrimp. No Quake coin, no Rain 5, no
  Rain 10 on the board. Bonus drops on Level 1 are plain gold coins. A goal prize that fell off a side still comes back.
  Report the bot win rate and time left for Level 1 before and after; it should stay easy.
- **Prize-collect bell at about half volume.** Jenny: "far too loud". Change only that bell's volume. Everything else in
  the frozen pickup (look, sizes, timing, other sounds, multi-drop) stays exactly as it is.
- These two override the Don't-touch list below for Level 1's pieces and that one sound only.

## Don't touch
The pickup (frozen), approved art, level layouts and goals (CP-50's work), powers, Settings, sounds.

## Test
- Win rate and peak coins per level, UAT before vs after (the bot at the new hold and tap speeds).
- Pause: timer and board frozen while paused; each pop-up button works; background/return pauses.
- Screenshots of the Pause button and pop-up at 360x640, 360x780, 393x852 and 412x915 (Jenny has no small phone; PM
  sends these to her).
- Usual build steps: backup to `uat/backups/before-UAT<n>-<numeric>`, new version, fresh cloud download verified,
  `python work/checkpoint.py`.

## Report
Top of `tickets/CP-51.md`: speed history and new numbers, limit decision, Pause, validation, limits; then a short UAT
test plan for Jenny ending with a paste line. Message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`).
Don't start other work.
