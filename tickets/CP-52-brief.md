# CP-52 Prize art refresh, batch 1: feather, toy ball, cushion (approved by Jenny, Nov 16)

Name this conversation "CP-52 Prize art refresh". Engineer (Codex): read AGENTS.md (the "Art and layout" rules and
the frozen pickup), CODEX_BRIEF.md and this brief. You are the engineer; Claude PM reviews.

**Jenny (Nov 16):**
- "I want the artwork to be more in line with what we did for cheese and shrimp. It just looks really basic right now."
- "Everything needs refinement."
- Batch 1 is the three worst.

## Phase A: art only (start now; it runs alongside CP-50, so don't touch the game or UAT)

Make new art for three prizes, one prize at a time. Today they're drawn in code as flat shapes (the `id==='feather'`,
`'ball'` and `'cushion'` branches near `wildPrizeArt` / `outlinePrize` in `work/cp66/release.html`).

**Style target:** the approved treats, cheese, shrimp and tuna. That means painted, full colour, soft shading and
highlights, and a clear dark outline that reads on the teal board. Match them; don't redraw them (they're frozen).

1. **Feather** (urgent). Jenny: "a feather can look really nice. Our feathers look like skis."
   - A soft, fluffy cat-toy feather: a gently curved shaft, wispy barbs that split and fan out, a fluffy base.
   - Soft colour. It must read as a feather at board size and at small icon size.
2. **Toy ball.** Today's red, white and blue bands with a star read as a flag.
   - Jenny: like "the old Foursquare balls, the rubber ones" with "a lot of texture".
   - A red rubber playground ball, pebbled all over, with seam lines and a slight shine.
3. **Cushion.** Jenny: "really bad. Cushion doesn't look like a cushion."
   - A plump square cat cushion: puffy corners, a button tuft in the middle, a soft fabric look, maybe piping on the edge.

**For each prize:**
- 3 options as transparent PNGs, on the same canvas as the current art.
- The same footprint, so the board size, collider and pickup stay exactly the same.
- Use image generation for painting only (AGENTS.md); never generate layouts.

**One contact sheet per prize** in `tickets/CP-52-evidence/`, showing:
- the 3 options next to today's version and next to the cheese, shrimp and tuna;
- each at board size on the teal table;
- each at icon size on a dark background and on a light card (Album/Kitchen style).

Then message the PM and **stop**. Jenny picks one per prize or says redo.

## Phase B: into the game (only when the PM says go)

This waits for Jenny's picks and for CP-50 to be in UAT (one engineer publishes at a time).
- Swap the chosen art in for those three prizes everywhere they show: board, Album, Kitchen, goal rows, end card.
- Same size and collider on the board; the pickup is frozen.
- Build to UAT with the usual steps: back up to `uat/backups/before-UAT<n>-<numeric>`, new version, verify a fresh cloud
  download, then `python work/checkpoint.py`.
- Screenshots at 360x640 and 412x915 showing the new prizes on the board and in the Album.

## Don't touch

- Every other prize, the cheese, shrimp and tuna, the coins and the Quake coin.
- Cat art, layout, physics, the pickup, sounds and the levels.
- In Phase A: the game files and UAT.
- Production stays untouched.

## Later batches (not this ticket)

- Next: milk, sardine, toy mouse, sock.
- Then: fish biscuit (Jenny: probably meant as a goldfish cracker), bell, egg, music notes, bow tie, box (a cardboard box
  cats love: open flaps, corrugated edges, tape).
- Rain 5 and Rain 10 coins: an experiment. Refine them to the Quake coin's finish, make the 5 easy to tell from the 10,
  and keep "as is" as an option.
- Recipe coin: make it a clearly big, nicer special coin.

## Report

At the top of `tickets/CP-52.md`:
- the contact sheets;
- what each option is;
- for Phase B: where it changed, validation and limits, then a short UAT test plan ending with a paste line.

Message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Don't start other work.
