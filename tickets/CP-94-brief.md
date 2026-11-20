# CP-94 Dance break pilot: the Orange cat's own dance (Jenny, Nov 19)

Name this conversation "CP-94 Orange dance". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md
("Art and layout": approved art frozen; approved behaviour frozen) and CODEX_BRIEF.md. Read DEVELOPER.md's Dance break
section and tickets/CP-23-core-loop.md "Parked for later: More dances". You are the engineer; Claude PM reviews.

**Jenny, verbatim (Nov 18-19):**
- "the dance beat side game is the best side game so far... that game could switch it up."
- "Doing its own dance is a great idea because I find the dance so incredibly charming with the tuxedo. I would love to
  see more different dances."
- Go: "Okay, let's do the orange cat. And sure, let's let an engineer at it."
- On rhythms (Nov 18): a new dance "takes you off guard" and takes "3 to 5 tries" to learn; rhythms need "a real
  cadence": start from a steady beat, then "a steady beat with one outlier or one double speed beat... dun, dun,
  dun-dun-dun". Each dance has its own catchy music so "the player will get familiar with the song and know how to tap
  to it".

## Do (UAT only)
- The Orange cat gets the Dance break with **its own dance**: its own rhythm (a real cadence, a little different from the
  Tuxedo's steady beat, still forgiving) and its own moves, built from the Orange's approved poses and mitts (no new art;
  no redraws). Moves travel visibly; face swaps are instant; no fades.
- **Music:** its own track. Offer up to 3 candidates as a Developer choice ("Orange dance music"), only tracks we may use
  (CC0/public domain, or made by you), each with its source and licence in the report. Jenny approves sounds only in the
  game on her phone.
- A perfect Orange dance earns the wheel (Yawn, Jackpot) like the Tuxedo's.
- The Orange keeps its own side game (Treat toss) and power. Decide with the PM before building how the Dance break is
  triggered on the Orange's board (today's Tuxedo trigger, or another): propose it in one line first.
- The Tuxedo's Dance break, the pickup and all approved art stay exactly as they are.

## Coordination
UAT 117 (kittens), 118 (Sonic meow), CP-92 and CP-93 are queued. Build and run change checks freely; before publishing or
any heavy run, ask the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) for your UAT number. One heavy runner at a
time; long runs need a waking watcher.

## Report
Top of `tickets/CP-94.md`: the rhythm (beat pattern), the moves, the music candidates with licences, stills at 412x915 and
360x640, the phone test with a sign-off line. Then the full regression set and `python work/checkpoint.py`. Never grep or
print the 49 MB game JSON files.
