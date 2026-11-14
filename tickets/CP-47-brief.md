# CP-47 Levels and cats (approved by Jenny, Nov 14)

Engineer: Read AGENTS.md, CODEX_BRIEF.md, GAMEPLAY_MAP.md (sections 12–14, and 13's keep list), GAMEPLAY_DESIGN.md
"Design rules" 1–12, and the top of tickets/CP-45.md (the newest UAT). You are the engineer; Claude PM reviews.

**Why:** Jenny, Nov 14. What levels and cats mean was muddled: cats were boards, "Level" was XP, and on the Tuxedo
board she didn't know what she was meant to do. The model she settled on:
- **Levels are the boards:** fixed layouts with a goal, in sequence. Pass one to open the next. Replays are the
  same layout, so a hard level is learnable ("after many plays I see where I get stuck").
- **Cats are who you play as.** A cat brings its **side game, its power and its prizes** to any level. Stuck on a
  level, or need shrimp for a recipe? Switch cats. Finding out which cat helps where is one of the slow-to-discover
  puzzles.
- Coin pushing is imprecise, so skill lives in the side games, and side games earn the powers that win levels.

## Build
1. **Levels.** About 10 fixed levels made from what exists (the Wild 2 board, Tower wall's towers, crammed prize
   layouts, prizes at the back or on towers), each with a goal (e.g. "Collect these 6") and an honest difficulty
   tag (Normal / Hard / Super hard). Difficulty does **not** climb steadily: a mix of easy levels, harder ones and
   now and then a really hard one you can be stuck on for days (Jenny, Nov 14). Same start every replay (fixed prize spots,
   towers and seed for the opening layout). Passing a level opens the next. "Level n" is this number everywhere.
   Boards 1–3 and the old modes stay under Developer.
2. **Cats as characters.** Tuxedo: Dance break, prizes bow tie and music notes, power Yawn. Orange: Treat toss,
   tuna and yarn, Zoomies. Ragdoll: Pet the cat, cheese and cushion, Hug. Siamese: Laser chase, shrimp and bell,
   Sonic meow. Tortoiseshell: Tortitude power and toy mouse and duck; its side game is open (Tower wall becomes a
   level type): propose and build one, as good as the others (short, one gesture, every tap a hit or miss). The level's layout stays; the cat's side game, prizes and power
   come with the cat. **A cat's prizes are never part of a level's preset layout:** they only fall during play (as
   drops from the sky), and only while you play that cat (Jenny, Nov 14). The level's own preset prizes stay the same
   whichever cat you bring. Shared on every level: Quake and other power coins, the wheel, Paw save.
3. **Getting cats:** the existing chain stays: recipe, Porch visit, photo, the cat coin. The cat coin now unlocks
   the cat as playable (not a board). A cat picker on the PLAY screen, usable between rounds once you have two cats.
   No level-5 gate.
4. **Powers** (new; none are built yet). Each cat's power is earned by doing its side game well (e.g. a perfect
   Dance break gives a Yawn, catching every treat gives Zoomies). Stored with a count on a button, like Quake; tap
   to use. Usable when playing as that cat, on any level. Quake stays a coin anyone wins on any level, usable by any
   cat. Make each power big, noisy and felt (rule 1).
   - Yawn: the cat stretches and its paws swipe things off the sides (art: reuse what the wheel slice does).
   - Zoomies: pusher double speed for a few seconds, kittens zip across the board.
   - Hug: the Ragdoll flops over the board and blocks the side gutters for a few seconds.
   - Sonic meow: a vibration doubles the pusher's reach for a few seconds.
   - Tortitude: a fiery burst shoves a big group of coins forward.
   Placeholder visuals drawn in code are fine; approved art stays frozen.
5. **Unlocks hang off levels.** Remove the XP bar and its "level" (the experience points that filled from playing and cooking since UAT 49). Screens appear only when a goal needs them (rule 8),
   e.g. the Kitchen after Level 2 together with the first recipe; the Shop when the recipe needs a bought
   ingredient; the Porch with the first dish. Cooking and cats have their own progress (recipe book, album).
6. **No help or rigging:** no free Quake after failures (Jenny, Nov 14); help is decided later after she plays the
   hard levels. No hidden rigging of results.
7. **Stars** (1–3) stay, per level.

## Don't touch
The keep list (GAMEPLAY_MAP.md section 13), including the frozen pickup and the Dance break beat sync; the title
screen; the PLAY screen layout Jenny liked (layout A; B stays behind its switch until she picks); board messages;
approved art; audio (CP-46). Rules 1–12. UAT only; production untouched.

## Report
Top of `tickets/CP-47.md`: the level list (layout, goal, tag), each cat's package, how powers are earned and used
(with frames of each power), the unlock order, limits, and a short "what to try" for Jenny. Publish to UAT the usual
way; split into two builds if that's faster (e.g. levels and cat picker first, powers second).
