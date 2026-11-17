# CP-58 Yawn, step 1: a prototype of the yawn, stretch and grab (Jenny, Nov 16)

Name this conversation "CP-58 Yawn prototype". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md (the
approved art and the frozen pickup) and CODEX_BRIEF.md. You are the engineer; Claude PM reviews. This step is a
**prototype for Jenny to look at**, not a release.

**Jenny's words (Nov 16):**
- "I think the cat should yawn, reach out, and grab some prize that you're about to win. It'll almost be like overly
  dramatic, like the cat's being a little obnoxious."
- The human joke: "yawn and stretch and put their arm around someone. Yawn and stretch and maybe grab something."
- "Have the cat yawn, stretch, and then maybe ... have its eyes look up to the right or to the left, and it'll just
  like grab a couple of things. It would actually be cool if it grabbed a piece of cheese and ate it or something like
  that, or a fish."
- "It could steal something that you need for the goal, but that prize can drop down again." A stolen goal prize must
  be replaced by a fresh one dropping in.
- The current Yawn swipes coins off the sides and leaves a gap drops can never reach. The new one must never leave a
  gap; it takes prizes, not the coin bed.
- "It's going to be difficult to do. Might take more time. I wouldn't mind seeing a prototype from Claude."

## Do
- **Build it from what exists.** Use the approved head, faces, mitts and paws, the Paw save reach, the game-drawn eyes
  and pupils (for the side-eye) and the current Yawn. Approved art isn't redrawn. If something truly needs new art
  (e.g. a chewing mouth), use a simple placeholder and list it.
- **Make it watchable for Jenny on her PC.** A local page or a desktop build of the real game (Level 3 or any board
  with a few prizes) with a button that plays the moment. Also record a short video or GIF, and take screenshots of the
  key beats at 412x915.
- **Timing and feel are your call,** within her description. Keep it short enough not to stall play.
- **Rate the work** to ship it properly (art needed, code, risk), and list any choices for Jenny.

## Don't
Don't publish to UAT or production, and don't change the game files the release uses. Another engineer (CP-61) is
building UAT 75 in this folder: work only in `work/cp58-yawn/` and `tickets/CP-58-evidence/`.

## Report
Top of `tickets/CP-58.md`: how to open the prototype, the beats, what's placeholder, and the effort to ship it. Then
message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never grep or print the 49 MB game JSON
files.

## Add-on (Jenny, Nov 17, after UAT 84): food only, and milk leaves an empty bottle
- "Yawn should only eat food items, not yarn, etc." It eats only food: cheese, shrimp, tuna, fish biscuit, sardine,
  egg, milk. Toys (yarn, feather, ball, cushion, sock, box, toy mouse, bell, bow tie, music notes, star) are never taken.
  With no food in reach it takes a few top coins as now; never nothing. Eaten food is lost, as today.
- Milk: the cat drinks it and throws the empty bottle back onto the board, where it's a real piece you push off
  ("I like the clutter on top of a nice sheet of coins... it's only performance we worry about. Let's shoot for 2").
  - Empty-bottle art comes from the milk bottle Jenny picked (CP-62 milk B) with the milk gone. Don't change milk B.
    It's the only new art. Keep the same size and collider as milk.
  - Pushed off, it plays a plain bottle clink, isn't a prize and isn't counted. It's never a goal item.
  - Performance: it's one extra piece. Keep at most 2 empty bottles on the board, and measure a tick on Level 8.
- Build into UAT 85 on UAT 84 (same rules as before: backup, real-browser boot check, cloud check, checkpoint). Add
  key-beat stills at 412x915 and 360x640 to tickets/CP-58-evidence/. Report at the top of tickets/CP-58.md, message
  the PM and stop.
