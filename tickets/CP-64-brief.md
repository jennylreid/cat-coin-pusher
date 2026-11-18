# CP-64 Jackpot cascade (Jenny, Nov 17)

Name this conversation "CP-64 Jackpot cascade". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md (the
frozen pickup and approved art) and CODEX_BRIEF.md. Read tickets/CP-59.md: the cascade bug, its cause, and the
"Jackpot proposal" and "Simpler option" sections. Also read tickets/CP-61.md, which covers the wheel slices and
JACKPOT 25. You are the engineer; Claude PM reviews.

**Jenny:**
- Nov 16, on the cascade bug: "kind of interesting and fun", "goes absolutely bonkers". Use it "as functionality for
  some sort of major win", and "turn off at some point".
- Nov 17: "I want the jackpot on the spinner to result in the crazy screen that we found during the bug... something
  that the player rarely gets."
- Her go (Nov 17): "CP-64 Jackpot cascade: go. ~8-10 s of spilling prizes, ends cleanly, never freezes. JACKPOT slice
  ~2%, replaces 25 coins. Timer pauses during it."

## Do
- Landing on the wheel's JACKPOT slice starts the cascade: about 8-10 s of prize after prize spilling down, the
  "bonkers" look of her UAT 70 screenshots (`Screenshots/uat70-cascade-{1,2,3}-2026-11-16.webp`). Then it stops
  cleanly. This replaces the slice's 25 coins.
- **It must never freeze.** Build a timed state with its own end and caps, not the CP-59 bug. Keep the piece count in
  the range normal play reaches. Jenny doesn't want lots of rain coins, and never converts pieces already on the board.
  Measure a tick on Level 8 during a cascade.
- Mostly prizes, which is what made the bug fun. The mix and drop rate are your call; list them.
- **JACKPOT slice about 2%.** Rebalance the other slices sensibly and list the new table.
- **The round timer pauses** for the cascade and resumes afterwards. Goal prizes it drops count normally.
- Add a Developer button that starts a Jackpot now, so Jenny can test it without luck.
- The frozen pickup is used exactly as it is. The busy multi-drop is the point.

## Don't touch
The pickup (look, sizes, timing, sounds), approved art, the other wheel slices' behaviour, the Yawn (CP-58, UAT 85),
Formal inspection, layout, levels and production.

## Build and stop
- Build it as UAT 86 on UAT 85 (2026.11.17 UAT 85, 20261117235956). Run all checks: build diff, never-freezes, timer,
  pickup identical, Level 8 tick, and the real-browser boot (`work/cp85/bootcheck.cjs` style).
- **Don't publish yet.** Jenny tests UAT 85 first. When the build is ready, write the report and wait for the PM's
  "publish". Then back up, publish to UAT only, run the cloud check and `python work/checkpoint.py`.
- Add stills at 412x915 and 360x640 to `tickets/CP-64-evidence/`, and a short clip if easy.

## Report
At the top of `tickets/CP-64.md`: what changed, the slice table, the cascade mix, checks, a phone test with steps and a
sign-off line, and limits. Then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never
grep or print the 49 MB game JSON files. Keep long logs in your scratchpad, not the OneDrive folder.
