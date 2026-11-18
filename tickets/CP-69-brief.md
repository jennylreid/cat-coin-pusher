# CP-69 Formal inspection art: top hat, bow tie, monocle, cane (Jenny, Nov 17)

Name this conversation "CP-69 Formal inspection art". Engineer (Codex): read AGENTS.md (the "Art and layout" rules and
the frozen pickup), CODEX_BRIEF.md, tickets/CP-63.md (how Formal inspection plays today; "Stand-ins" lists what the code
draws now) and tickets/CP-62-brief.md (how the prize art was made). Jenny reviews; the PM reads `tickets/CP-69.md`.

**Jenny:**
- Nov 15: "The Tuxedo's power becomes Formal inspection (a monocle highlights the most valuable coins and prizes; the
  cane sweeps them forward)."
- Nov 17, after UAT 84: "Formal inspection looks surprisingly good as it is. I envisioned the cat wearing a top hat
  and a bow tie." "The top hat and bow tie can cover the buttons or tiles... above the head, as well as the push board,
  because it won't be needed for the duration of the animation." "Let's just do all the art with Codex now."

## Phase A: art only. Don't touch the game or UAT.
- Four pieces, one at a time, 3 options each, as transparent PNGs:
  1. **Top hat** for the Tuxedo, drawn on the Tuxedo head's canvas (the head PNG, 1536x1024) so it lines up with the
     head. It may reach up over the goal tiles above the head.
  2. **Bow tie** for the Tuxedo, also on the head canvas, at the chin. It may cover the pusher area.
  3. **Monocle**, sized for the cat's left-of-screen eye on the head canvas (where the code draws it today).
  4. **Cane**, held in the right big mitt, at the size the code draws it today.
- **Style target:** the approved Tuxedo head, cheese, shrimp, tuna and the approved prize art (CP-52, CP-56, CP-62).
  What each piece looks like is your call. Use only Jenny's words above.
- **Contact sheets** in `tickets/CP-69-evidence/`, one per piece, in the CP-56 format. Also make one sheet of each
  option on the real Tuxedo head (hat, bow tie and monocle together) at 412x915, so Jenny sees it on the cat.
- Then write `tickets/CP-69.md` and **stop**. Jenny picks or asks for a redo.

## Phase B: only when the PM says go
Replace CP-63's code-drawn stand-ins with the picked art, and add the hat and bow tie for the length of the power. Build
UAT on the current UAT, with the usual backup, real-browser boot check, cloud check and checkpoint.

## Don't touch
The approved Tuxedo head and faces (the hat, tie and monocle sit on top; they're never redrawn), the mitts, the coins,
the other prizes, layout, physics, the pickup, sounds, levels, and how Formal inspection plays. Production stays
untouched.

## Report
Top of `tickets/CP-69.md`. Never use Claude or message anyone; the PM reads the report. Don't start other work.

## Round 2 (Jenny's picks, Nov 17)
- **Bow tie:** "I prefer the shape of bow tie A, but I want it black and I want it bigger." Bow tie A's shape, in
  black, bigger (wider).
- **Hat:** "I think I like C for the hat, but I want it wider"; "the hat bigger as well. So both should be wider."
  Hat C, bigger and wider.
- **Monocle:** "I actually prefer the silver." Monocle C, as it is.
- **Cane:** "we need the cane to be thicker." Show both handles: one option with a crook (a small rounded hook, not a shepherd's hook) and one with a knob top (Jenny: "I should look at both crook and knob"; the point is which is easier to see). Thicker, so
  it reads at phone size. Colour: keep cane A's black with the gold collar unless it doesn't read; say which.
- Make 2 options each for the bow tie and hat (sizes or proportions) and the 2 canes above, on the real Tuxedo at 412x915 as before
  (with the silver monocle), plus the cane on the board. Update the top of `tickets/CP-69.md` and **stop**. Phase B
  still waits for the PM's go.

## Phase B: GO (Jenny, Nov 17). One UAT build with three changes
Build UAT 88 on the published UAT 87 (2026.11.17 UAT 87, 20261117235958, source `work/cp87/release.html`).

**1. CP-69 art (Jenny's picks):**
- Hat: round 2 **B** (hat C, 40% wider).
- Bow tie: round 2 **A** (black, 30% wider), **moved lower so it doesn't overlap the tongue at all**. Overlapping
  the pusher is fine ("it's only temporary and there will be no playing on the board while it's showing").
- Monocle: Phase A **A** (gold).
- Cane: round 2 crook or knob, **your call** (Jenny: "we can let Codex decide on the handle"; she leaned crook).
  Choose the handle, angle and grip so the handle shows past the mitt during the sweep, and say which you chose.
- Replace CP-63's code-drawn monocle and cane. Show the hat and bow tie for the length of the power only. Formal
  inspection plays exactly as in UAT 87 otherwise.

**2. CP-57 title sound:** run `work/cp57-title/build-title-final.py` (production's title sound; removes the A/B/C/D
switch and "Replay title"). Its checks are `checks-title-restore` in the same folder.

**3. CP-70 Developer cleanup** (Jenny: "limit it to the ones I still find useful"). Settings → Developer shows only:
- Basics: Developer mode, Sound effects, Check for updates, Send performance log.
- Levels: Open every level, Pass the next level, Back to Level 1.
- Give: +1,000 coins, Give 3 of every prize + 300 coins, Give powers (3 each), Give all cats.
- Start now: Start dance break now, Wild 2: spin the wheel now, Wheel lands on (each slice), Start a Jackpot now, Cat
  visits now.
- Reset progression, last.
Everything else moves into a closed "Engineer tools" section, collapsed by default. Delete nothing: the harnesses press
some of these buttons by id. Drop exact duplicates from the main list. No game behaviour changes.

**Checks:** the art is drawn only during the power; the bow tie is clear of the tongue at 412x915 and 360x640; the
CP-63, CP-64 and title checks still pass; the pickup is identical; the Developer list is as above; the real-browser boot
check (`work/cp85/bootcheck.cjs` style). Then back up, publish to UAT only, run the cloud check (`work/cp87/verify-cloud.py`
style), `python work/checkpoint.py`, and a GitHub commit naming CP-69, CP-57 and CP-70.
Stills of the power at 412x915 and 360x640, and a short clip, go in `tickets/CP-69-evidence/uat88/`. Put the phone test
at the top of `tickets/CP-69.md` and **stop**.
