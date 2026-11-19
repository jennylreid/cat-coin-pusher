# CP-83 Board lab (Jenny, Nov 18)

Name this conversation "CP-83 Board lab". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md (approved
art and the frozen pickup stay; real-game only) and CODEX_BRIEF.md. Read tickets/CP-23-core-loop.md (the gameplay plan,
especially the Nov 18 sections) and DEVELOPER.md on how levels and layouts are built (`PGL_LEVELS`, towers, walls,
`wildPrefill`). You are the engineer; Claude PM reviews.

**Why (Jenny, Nov 18):** "the main gameplay, which is the coin pusher... it's just not fully fleshed out. It's probably
not good enough. I'd like it to be as fun as Pixel Flow... there's always a new board and it's an enjoyable feeling to
solve one of the boards." Ideas she named: "collecting a certain number of mice off the board or color coding the coins
and saying you have to collect a certain number of the color, setting up pretty piles to spill in a fun way."
Go: "I love the idea of a board lab wherein the engineer uses its own ideas. As long as it's clear, there has to be
like a clear goal... CP-83 Board lab: 5-6 board setups (tower, edge pile, staircase, wall, mouse hunt, colour challenge
with stand-in coins) in the real game, chosen with a Developer picker. I play them and pick the fun ones."

## Do
- Build 5-6 board setups in the real game. Start from her list (tower, pile teetering at the edge, coin staircase,
  wall, mouse hunt, colour challenge) and use your own ideas too. Swap one in if you have something better, and say why.
- **Each board has one clear goal shown on screen** (e.g. "Get 5 mice", "Collect 10 red coins", "Topple the tower") and
  a trick where *where* you drop matters, so a good drop sets off a satisfying spill or cascade. Make each one
  achievable with a reasonable number of coins.
- Colour challenge: stand-in tinted coins drawn in code. The approved coin art is frozen; don't change it for normal coins.
- Existing art and prizes only; nothing about the pusher, physics feel or the frozen pickup changes.
- Developer picker: Settings → Developer → Engineer tools → "Board lab": choose a board; the round starts on it.
  Normal play is unchanged when no lab board is chosen.
- Before building: stills at 412x915 and 360x640 of each setup, and a short clip of the best spill, for the PM.

## UAT
Build into the UAT channel only after the PM says "UAT 102 is out" (another engineer is publishing it). Usual steps:
backup, the checks for your change, one frozen-pickup suite and the real-browser boot, then publish; then the rest of
the regression set on the published build, reporting any failure at once. Watch long runs with something that wakes you.

## Report
Top of `tickets/CP-83.md`: each board (goal, trick, why it might be fun), a phone test with one line per board for
Jenny to rate ("fun / meh / no"), and anything unsure. Message the PM (session
`local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never grep or print the 49 MB game JSON files.
