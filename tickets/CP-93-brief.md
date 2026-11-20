# CP-93 Giant tower board (Jenny, Nov 19)

Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md ("Art and layout": layout changes in the real game)
and CODEX_BRIEF.md; read tickets/CP-83.md (Board lab so far). You are the engineer; Claude PM reviews.

**Jenny, verbatim (Nov 19):** "I want to do a board where the pusher is twice as long and it has giant towers. I mean,
really tall towers of coins sitting on top of it. And then you're dropping coins onto the pusher itself, which then push
the coins forward, similar to that video screenshot... We don't have to have gold bars. But I've noticed, though, the
towers rarely spill in our game boards for some reason. They're very, very stable towers." And: "Maybe the coins need to
be stacked so that they're not so stable." Go: "Let's get... a giant tower board."
Reference (private, never commit): Screenshots/ref-pusher-top-2026-11-17.webp, plus ref-stack-fall-1..3-2026-11-17.

## Do (UAT only, a Board lab board)
- A new lab board in the Home "Board lab" list: the pusher deck about twice as long (front to back), very tall coin
  towers standing on the pusher deck, coins dropped onto the pusher so they shove the towers forward.
- Make the towers spill: stack them less neatly (offsets, slight lean, uneven heights) and tune whatever keeps them rigid
  today, so a tower scraped against the back wall or shoved off the deck edge topples and spills in a satisfying way.
  Change this for this board only; the other boards and the frozen pickup stay as they are.
- Normal extras on (prizes, powers, side games), as Jenny found boards boring without them.
- Approved art frozen; no fades. Show the layout in the real game (no generated images).

## Coordination
- Other engineers may be publishing (CP-90 = UAT 117; CP-92 endless board next). Before publishing or any heavy run, ask
  the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) for your UAT number and whether the channel is free. One
  heavy runner at a time. Long runs: waking watcher.

## Report
Top of `tickets/CP-93.md`: stills at 412x915 and 360x640 (start, mid-topple), a short note on what made the towers
spill, the phone test with a sign-off line. Then the full regression set and `python work/checkpoint.py`. Never grep or
print the 49 MB game JSON files.
