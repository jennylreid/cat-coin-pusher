# CP-84 Daily puzzle prototypes: Paw Swat and Cat Café chain (Jenny, Nov 18)

Name this conversation "CP-84 Daily puzzles". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md
(approved art frozen; the main game unchanged) and CODEX_BRIEF.md. Read tickets/CP-23-core-loop.md (the gameplay plan:
three timed daily challenges, possibly a different game from the pusher). You are the engineer; Claude PM reviews.

**Jenny, verbatim (Nov 18):**
- "Maybe the daily timed game has to be something totally different. A little more like pixel flow." "That's the
  family of color sorting games I want" (also named: Hole-style games, Bus Traffic Fever, colour shooters at a dragon,
  yarn-pulling puzzles).
- "one tap just to send one coin to one bowl is not going to be good... with all the games I'm talking about, one tap
  can give you up to 20 or 25 payoffs, anywhere from 1 to 25. And it's a much more satisfying feeling when you get a
  big one." "I want to do the shooting at something to clear colors away." "you can give me prototypes and I'll check
  them out, but I'm going to have to get them in a build so I can actually play them."
- Go: "Build all three, please." (Ideas 1 and 2 are this ticket; idea 3, pusher chains, goes to the board lab.)
- **Original designs only:** take the genre's feeling (clear colours, one tap, big chain payoffs), not any specific
  game's rules, art or look.

## The two prototypes
1. **Paw Swat (shoot to clear).** A wall of coloured coins hangs at the top. A cat at the bottom bats a coloured coin up
   into it (aim by dragging or tapping a direction). It clears every connected coin of the same colour (3 or more), and
   anything left with nothing holding it drops too: the big payoffs. Show the next coin or two. Clear the wall to win;
   a few rows creep down over time or per shot.
2. **Cat Café chain (tap a cat, chain-collect).** A heap or grid of coloured coins, with a queue of cats at the bottom,
   each holding a coloured bowl. Tapping a cat makes its bowl pull in every coin of its colour connected to the open
   edge, in one go (anywhere from 1 to 25+), then the cat leaves happy and the next steps up. The strategy is the order:
   serving the right cat first joins colour groups into big clumps for later cats. Limited cats or moves, so order
   matters.
- Make the payoff feel big: count-up, coins flying to the bowl or falling, a sound that rises with the chain size.
- A few hand-built puzzles each, easy to slightly tricky, playable in 1-3 minutes.
- Stand-in art: tinted coin shapes drawn in code (the approved coin art stays unchanged for the main game) and the
  existing cat heads or icons. Existing sounds.
- **A side project, not in the main game** (Jenny: "don't build it into the main game. Just make it a side project I
  can test"). Build each puzzle as its own small standalone web page in `work/cp84-puzzles/` (touch-friendly, phone
  portrait, no dependency on the game's code), playable in a phone browser. The PM will publish them as private
  claude.ai links Jenny opens on her phone. Nothing goes into `uat/`, `phone/` or the game.

## Steps
- First: stills and a short clip of each (starting from the untouched puzzle) to the PM.
- Then: hand the PM the two finished HTML files (single file each, assets inlined as data URIs, under ~5 MB) for
  publishing as private links. No UAT build. Test in a real browser at 412x915 and 360x640 with touch emulation.

## Report
Top of `tickets/CP-84.md`: how each plays, the puzzles, what felt good or weak in your own test, a phone test, and a line
for Jenny to rate each ("fun / meh / no", plus a comment). Message the PM (session
`local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never grep or print the 49 MB game JSON files.
