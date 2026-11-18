# CP-54 Coin drop sound, phase A: listening page (Jenny, Nov 16)

Name this conversation "CP-54 Coin drop sound". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and
CODEX_BRIEF.md, and read SOUND_MAP.md and tickets/CP-46.md (the coin sounds added on Nov 14). You are the engineer;
Claude PM reviews.

**Jenny:**
- "the main clink when a coin drops sounds like a raindrop in a bucket, when it should sound like change hitting a pile
  of change."
- From Baseline 1, item 2: the title screen's coin pile-up uses the same "rain on a tin roof" sound. Whatever the title
  screen plays is the sound to replace everywhere.

## Phase A (now): find it and let Jenny listen. Don't change the game or UAT.
1. **Find the sound.** Identify exactly which sound(s) play when a dropped coin lands (on the board, and on the title
   screen's coin pile), with file names and where in the code. Say whether more than one sound rotates in.
2. **Listening page.** Build a small local HTML page (in `tickets/CP-54-evidence/`) that Jenny opens on her PC:
   - **Today's sound**, then 3-4 candidates: real "coin landing on a pile of change" sounds.
   - **Sources:** the coin recordings already in the project folder (e.g. the dragon-studio, sumaga123, freesound
     coin-spill, voicebosch, universfield files and the CP-46 set) or new ones with a licence that allows use in a
     game. Note each one's source and licence.
   - **Two buttons per candidate:** one plays a single coin; the other plays it at the game's real drop rates
     (holding: a coin every 0.40 s; fast tapping: up to 4 a second), with the game's own pitch and volume variation,
     so Jenny hears it as it would sound in play.
   - **Plain labels:** A, B, C, D, each with a few words on what it is.
3. **Report** in `tickets/CP-54.md` with the page's path, then message the PM and stop. Jenny picks.

## Phase B (only when the PM says go)
Put her pick in for the coin-landing sound everywhere it plays (board and title), build to UAT with the usual steps,
and add a test plan.

## Don't touch
The prize and coin **pickup** sounds (frozen), the bell, the pusher, the music, and other sounds. Production stays
untouched.

Message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) when phase A is ready. Don't start other work.
