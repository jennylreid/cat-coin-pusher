# CP-79 Yawn sound (Jenny, Nov 18)

Name this conversation "CP-79 Yawn sound" (or continue in "CP-75 Yawn faces" if the PM sent it there). Work in
C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md (approved behaviour frozen: the pickup and its sounds) and
CODEX_BRIEF.md. Read DEVELOPER.md "The wheel's Yawn" for which sound plays today, and tickets/CP-46.md / CP-54.md for how
real recordings were found, licensed and compared before. You are the engineer; Claude PM reviews.

**Jenny, verbatim (Nov 18):** "We need a better yawn sound." Go: "CP-79 Yawn sound: current one sounds fake. Want a real
cat yawn, a bit cute, about as long as the yawn. 3 candidates as separate clips with the Yawn animation, then I pick,
then UAT."
Standing rules from her: real recordings beat code-made sounds; she can't rate a sound without seeing the animation; one
file per version, never several versions in one file; sounds are only approved in the game on her phone.

## Step 1: 3 candidates (now)
- Jenny: "I don't know if there's such a thing as a yawn sound from a cat." Many cats yawn silently; some make a
  breathy yawn with a little squeak at the end ("yawn squeak"). Look for real yawn squeaks first; if there aren't 3
  good ones, fill in with a real sleepy little mew. Say which each candidate is.
- Find real cat yawn recordings that we're allowed to use in the game (free licence such as CC0, or the same sources as
  CP-46/CP-54). Record source and licence for each.
- Pick the 3 best: real, a bit cute, trimmed and levelled to the length of the Yawn (the yawn part, not the eating).
- For each, a separate clip of the real game's Yawn at 412x915 with that sound, named `yawn-sound-A.mp4`, `-B`, `-C`, plus
  `yawn-sound-today.mp4` with today's sound for comparison. Also the plain audio files, one per candidate.
- Nothing else in the Yawn changes (chomps, NOM., crumbs, timing). Work only in `work/cp79-yawn-sound/` and
  `tickets/CP-79-evidence/`; don't touch `uat/`, `phone/` or release files.

## Step 2: UAT (only on the PM's go, with Jenny's pick)
Into the then-current UAT with the usual steps, once the PM says no other engineer is building.

## Report
Top of `tickets/CP-79.md` (candidates, sources, licences); then message the PM (session
`local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never grep or print the 49 MB game JSON files. Don't stall on
background runs.
