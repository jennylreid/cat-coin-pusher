# CP-85 Daily puzzles, Codex's own ideas (Jenny, Nov 18)

Name this conversation "CP-85 Codex daily puzzles". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md
and CODEX_BRIEF.md. This is a side project: do not change the game. You are the engineer and designer; Claude PM reviews.

**What it's for:** CatCoin (a cozy cat coin-pusher) will have three short daily challenges. Jenny wants the daily to be a
small colour puzzle with coins and cats, in the family of casual colour-sorting and colour-clearing games.

**Jenny, verbatim (Nov 18):**
- "That's the family of color sorting games I want" (she named Hole-style games, bus/traffic sorting games, colour
  shooters that clear colours from a target, yarn-pulling puzzles, and Pixel Flow).
- "one tap just to send one coin to one bowl is not going to be good... with all the games I'm talking about, one tap
  can give you up to 20 or 25 payoffs, anywhere from 1 to 25. And it's a much more satisfying feeling when you get a
  big one."
- "I want to do the shooting at something to clear colors away." "I don't really want to do the untangling."
- "Can we let Codex come up with 3 on its own?"

## Do
- Invent **3 original puzzle designs** of your own that use coins and cats. A Claude engineer is already prototyping
  two ideas ("Paw Swat": a cat bats coins into a hanging wall of colours; "Cat Café chain": tap a cat to pull in all
  connected coins of its colour), so make yours different from those.
- Each must have: one clear goal, a one-tap action that can pay off anywhere from 1 to 25+ at once, a little planning
  (an order or position that matters), and a satisfying big-chain moment with count-up, motion and sound.
- **Original designs only:** take the genre's feeling, not any specific game's rules, art or look.
- Build each as its own **standalone single-file web page** in `work/cp85-puzzles/` (phone portrait, touch-friendly,
  playable in a phone browser, all assets inline, under about 5 MB, no dependency on the game's code). Use code-drawn
  stand-in coins and simple cats. You may reuse cat head images from the game's `img/art/` as inline data, but don't
  change them. Include 3-5 hand-built puzzles each, easy to slightly tricky, 1-3 minutes.
- Test each in a real browser at 412x915 and 360x640 with touch emulation. Save stills and a short clip of each in
  `tickets/CP-85-evidence/`.
- Don't touch `uat/`, `phone/`, release files or the game source.

## Report
Write `tickets/CP-85.md`: for each design its name, how it plays in 3-4 lines, why one tap can pay off big, its file,
and what you'd improve. Add a line for Jenny to rate each ("fun / meh / no"). Then stop. The PM will publish the pages as
private links for Jenny's phone.
