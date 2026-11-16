# CP-50 Simple first board (approved by Jenny, Nov 16)

Name this conversation "CP-50 Simple first board". Engineer: read AGENTS.md (the frozen pickup and frozen-art rules),
CODEX_BRIEF.md, tickets/CP-47.md (levels table) and tickets/CP-49.md. You are the engineer; Claude PM reviews.
Base: UAT 66 (20261116140000, CP-49: Home screen cleanup and "Home" button). One small change only.

**Jenny (Nov 16):** "we're collecting prizes too quickly and I want the first board to be very simple with just two
prizes, the original shrimp and cheese." "We'll have occasional boards that are crammed, but certainly not the first
screen." "Let's move slowly ... start with that first board being more simple."

## Change: Level 1 prizes
- Level 1 ("First push") has exactly **two prizes: the original shrimp and cheese** (the approved treat art, unchanged).
- Goal line: "First push: collect these 2", showing the shrimp and cheese icons. **No bonus prizes** on Level 1.
- Coins, layout (9 rows, no towers), time, Quake and tag stay as now. Place the two prizes where they need a few real
  pushes, not right on the front edge; say where you put them.
- Check: shrimp and cheese collected on Level 1 go where treats go now (inventory; over 9 turn into coins) and don't
  break the Kitchen/recipe chain or the Shop rule. If using treats as a level goal conflicts with something, stop and
  tell the PM.

## Added (Jenny, Nov 16): end-card prize line overlaps
On the end card ("TIME'S UP!" / passed), the "0 of 4 prizes" line overlaps the outlines of the prize icons under it
(see `tickets/CP-49-evidence/uat66/endcard-after-uat66.png`). Give the text and the icon row clear space so nothing
touches, at every prize count (2 on the new Level 1 up to 8). While there, check the big star doesn't sit on the
title or the count. Spacing only; same card, art and buttons. Before/after screenshots of the end card.

## Added (Jenny, Nov 16): prize icons are hard to see
"the prizes are difficult to see in this screen and in most screens" (her phone shot: `Screenshots/uat66-endcard-win-2026-11-16.png`,
end card and the "Collection 4/4" row). Make the prize **icons** in the goal/collection rows clearly bigger and easier to
read: the end card, the Home goal line and the in-round Collection row (about 1.5–2x, with the check mark and star
scaled to match and not covering the icon). Same icon art, only bigger, with room so rows don't overlap anything.
Not the prizes on the board (their size and the pickup are frozen). Before/after screenshots of all three.
Second example (Jenny: "every other place in the UI where we indicate what prizes you're looking for. You can barely
see them"): `Screenshots/uat66-home-goal-icons-2026-11-16.png`, Home goal line for Level 2. There the icons are also
**dimmed/greyed and dark on the dark sky** (egg, milk, box, sock barely show). So besides size: show goal icons at full
colour with enough contrast on dark backgrounds (e.g. a soft light round backing behind each). Mark collected ones with
the check, not by dimming the uncollected ones. Cover every place the UI lists goal prizes (find them all; list them
in the report). Board prizes are fine as they are (Jenny).
**Target look:** the Album and Kitchen already read well (`Screenshots/uat66-album-prizes-2026-11-16.png`,
`Screenshots/uat66-kitchen-2026-11-16.png`): full colour, a good size, on a light card. Make the goal rows match that
(e.g. a light rounded strip or light circles behind the icons on the dark screens). Their colour and backing are the
target, but Jenny (big phone): "it's hard to see them" there too. So the **Album and Kitchen icons get bigger as well**
(Kitchen ingredient icons about 1.5x, with their counts kept readable; Album prize icons as big as the grid allows), using the
space those screens already have. Layout of those screens otherwise unchanged.

## Added (Jenny, Nov 16): "Board" back button should say "Home"
The "‹ Board" button at the top of the Album and Kitchen screens takes you to the Home screen, so it should read
"‹ Home". Check every side screen (Kitchen, Porch, Album, Shop, Cats, Collections, Inventory, Settings, etc.): any back
button that goes to the Home screen reads "Home". Label only; same button, place and behaviour. List them in the report.

## Added (Jenny, Nov 16): goal row above the cat
Move the in-round goal row from the bottom left ("Collection n / N") to the band above the cat's head: the level name
(e.g. "Level 2 · Line up") plus the prizes to collect, big full-colour icons (as above), checks as they're collected.
It must not cover or move the cat, the paws or the board (locked layout, SPEC.md). Jenny's tall phone has a spare band
there; shorter phones may not. **Jenny has no small phone, so the engineer does the small-screen testing:** real-game
screenshots at 360x640, 360x780, 393x852 and 412x915 (dp, portrait), Developer off, at the start of a round and
with some prizes collected. If it can't fit on the short screens without covering the cat, say so and propose a
fallback (e.g. a slimmer row) before publishing.
**PM mockup (draw-only overlay on UAT 66, not shipped):** `tickets/CP-50-evidence/mock/` (`mock.cjs` + shots at all four
sizes). Level label plus ~34 px icons on cream circles, between the ears, fits on every size; on 360x640 the circles
touch the top of the head by 1–2 px, so give it a few px more room there (slightly smaller icons on short screens is fine).
Use it as the starting point, not a spec.

**Scope closed (Jenny, Nov 16): "that's enough feedback for the next UAT build."** Nothing else goes into CP-50.

## Don't touch
Every other level, the coin limit, the Home screen (CP-49), Settings, sounds, the pickup, approved art. Production untouched.

## Test
Desktop: Level 1 start screenshot and Home-screen goal line; win Level 1 and confirm "Level 2 is open"; bot win rate
and average time left for Level 1 before/after. Usual build steps: backup to `uat/backups/before-UAT67-<numeric>`,
version 20261116…, fresh cloud download verified, `python work/checkpoint.py`.

## Report
Top of `tickets/CP-50.md`: change, prize positions, validation, limits; then a short UAT test plan for Jenny ending
with a paste line. Message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Don't start other work.
