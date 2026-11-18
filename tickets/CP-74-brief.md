# CP-74 Hug (the Ragdoll's power), step 1: layout prototype (Jenny, Nov 18)

Name this conversation "CP-74 Hug". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md ("Art and layout":
layout first, art second; approved art frozen) and CODEX_BRIEF.md. Read tickets/BASE-1.md item 11, DEVELOPER.md
"Powers" (Hug today adds two gutter colliders for 6 s), and tickets/CP-72.md for how the Zoomies prototype was built and
shown. You are the engineer; Claude PM reviews.

**Jenny:**
- Nov 15 (BASE-1 item 11): "the Ragdoll's actual paws/arms must come out over the board (not happening yet); hearts
  all over the place, lots of them; and purring while it lasts." Earlier: "terrible artwork, great concept".
- Nov 18: "We need to remove the paws and replace or maybe just move the mitts to the bottom of the screen and add thick
  furry arms and the shoulders of the cat. It will all kind of fill the screen around the board."
- Go (Nov 18): "CP-74 Hug: go as summarised. Layout prototype first, then Codex art."

**PM summary she approved:** during the Hug the cat's shoulders come forward at the top and thick furry arms run down
both sides of the board. The approved mitts move to the bottom of the screen and meet below the board, so the board is
held. The small paws Hug uses today go away. The arms are the gutter walls (today's invisible side walls, now visible).
Hearts everywhere and purring while it lasts.

## Step 1: layout prototype (now)
- In the real game (current UAT source), place simple **code-drawn stand-ins** for the shoulders and arms in the
  Ragdoll's colours, and move the approved mitts (same images, same size, never redrawn) to the bottom of the screen
  for the length of the power. The arms line up with today's gutter colliders, so what blocks the sides is what you see.
- Hearts and purring: use existing assets and sounds if they exist; list what's missing.
- Pick sensible timing for the arms coming in and letting go. Nothing may cover the board's play area.
- Watchable on her PC: a short video with sound at 412x915 on the Ragdoll's board, plus stills at 412x915 and 360x640.
  Also one still with the layout numbers (arm width, shoulder height, mitt position) for the art step.
- Rate the effort: code, and the art pieces Codex will need (shoulders, left arm, right arm), each on a fixed canvas.
- Work only in `work/cp74-hug/` and `tickets/CP-74-evidence/`. Don't touch `uat/`, `phone/` or the release files:
  another engineer is building UAT 92 in this folder.

## Step 2: art (only on the PM's go)
Codex paints the shoulders and arms over the locked layout, one piece at a time, on the same canvas. Then a UAT build.

## Report
Top of `tickets/CP-74.md`; then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never
grep or print the 49 MB game JSON files. Keep long logs in your scratchpad. Don't stall on background runs: run them in
the foreground or poll them.
