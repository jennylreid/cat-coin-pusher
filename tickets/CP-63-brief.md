# CP-63 Formal inspection (Tuxedo's power), step 1: prototype (Jenny, Nov 17)

Name this conversation "CP-63 Formal inspection prototype". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow
AGENTS.md (approved art and the frozen pickup) and CODEX_BRIEF.md; read tickets/BASE-1.md item 7 and tickets/CP-58.md
(how the Yawn prototype was built and shown). You are the engineer; Claude PM reviews. This step is a prototype for
Jenny to watch, not a release.

**Jenny:**
- Nov 15 (BASE-1 item 7): "The Tuxedo's power becomes Formal inspection (a monocle highlights the most valuable coins
  and prizes; the cane sweeps them forward)." The Yawn stops being a power.
- Nov 17: "we need to work on the Tuxedo Power ASAP", and asked for a prototype.

**What it is (PM's summary):** a monocle appears and highlights the most valuable coins and prizes on the board, then a
cane sweeps those highlighted pieces forward toward the front edge. It replaces the Tuxedo's YAWN power. The cane must
never leave a gap drops can't reach, and the bottom layer stays. It should feel like a good power: the player sees
valuable things move toward them.

## Do
- Build it from existing art and code: the Tuxedo head, mitts and paws, the game-drawn eyes, the power button flow, the
  push and sweep code. Simple stand-ins for the monocle and cane are fine; list them. The real art comes later (likely via
  Runway, one image at a time).
- Make it watchable on her PC, as with CP-58: a page or desktop build of the real game with a button that plays the power,
  a short video at 412x915, and key-beat stills. Include stills at 360x640.
- Timing, highlight look and sweep feel are your call within the summary. List choices for Jenny (how many pieces, how
  long, what counts as "most valuable").
- Rate the effort to ship.

## Don't
Don't publish or change the release game files or `uat/` / `phone/`. Work only in `work/cp63-formal/` and
`tickets/CP-63-evidence/`. The CP-58 engineer is publishing UAT 82 in this folder, and Codex may be working on art.

## Report
Top of `tickets/CP-63.md`; then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never
grep or print the 49 MB game JSON files. Don't hold files open in the OneDrive folder while waiting; write long logs to
your scratchpad.
