# CP-78 Board clean-up: only stars behind the cat, clean board edges (Jenny, Nov 18)

Name this conversation "CP-78 Board clean-up". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md ("Art
and layout": layout first, real-game screenshots, approved art frozen) and CODEX_BRIEF.md. Read SPEC.md (the locked
layout from CP-21) before changing anything visual. You are the engineer; Claude PM reviews.

**Jenny, verbatim (Nov 18):**
- "I don't think we ever really got the board solid. Like the board is kind of weird looking around the edges to begin
  with. And then the background behind the cats, I notice it a lot during the yawn and maybe some other animations that
  there's a weird ledge and something else behind the cat. And it should just be stars and background art."
- On the Hug art: "the art looks really messy around the edges of the board as well."
- Go: "CP-78 Board clean-up: behind and beside the cat only stars and background art: no gold band, gold rail or teal side
  blocks (see Screenshots/cp78-behind-cat-yawn-uat93-2026-11-18.webp). Board edges solid and clean. Pusher unchanged.
  Screenshots and a Yawn clip first, then UAT. Hug art waits for this."

**Her screenshot** (`Screenshots/cp78-behind-cat-yawn-uat93-2026-11-18.webp`, UAT 93, Level 9, Tuxedo, during the Yawn)
shows, behind and below the cat's chin: a wide gold band across the whole screen; a thin gold rail across the screen
under it; dark teal blocks on both sides that stick out past the board onto the starfield. The gold block in the middle
(behind "YAAAWN...") is the pusher: approved art, unchanged.

## Step 1: screenshots for Jenny (now)
- Find what draws the gold band, the gold rail and the teal side blocks, and make the area behind and beside the cat
  show only the stars and background art, on every cat and during every cat animation (Yawn, powers, dance, idle).
- Make the board's edges solid and clean (no ragged or see-through rim, nothing odd where the board meets the
  starfield). Keep the board's shape, size and position, the camera, coins and colliders exactly as they are: this is a
  drawing clean-up, not a layout change. Nothing about play may change.
- Pusher, cats, mitts, coins, prizes and the frozen pickup stay as they are.
- Show it in the real game: before/after stills at 412x915 and 360x640 (idle and mid-Yawn, at least two cats and two
  levels), and a short Yawn clip with sound at 412x915. List anything you removed or changed and anything unsure.
- Work only in `work/cp78-board/` and `tickets/CP-78-evidence/`. Don't touch `uat/`, `phone/` or the release files:
  another engineer is building UAT 94 and a third is working on CP-75 in this folder.

## Step 2: UAT (only on the PM's go)
Into the then-current UAT with the usual backup, checks, real-browser boot, cloud check, checkpoint (--message) and
GitHub commit on wip/uat, only once the PM says no other engineer is building.

## Report
Top of `tickets/CP-78.md`; then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never
grep or print the 49 MB game JSON files. Keep long logs in your scratchpad. Don't stall on background runs: run them in
the foreground or poll them.
