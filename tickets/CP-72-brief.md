# CP-72 Zoomies rework (Jenny, Nov 17): prototype first, then UAT

Name this conversation "CP-72 Zoomies". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md (approved art,
the frozen pickup) and CODEX_BRIEF.md. Read tickets/BASE-1.md item 8, and tickets/CP-63.md for how the Formal inspection
prototype was built and shown. You are the engineer; Claude PM reviews.

**Jenny:**
- Nov 15 (BASE-1 item 8): Zoomies looks cute but "nothing happens". "The kittens should enter at the back and run
  FORWARD (toward the player), not left-right, visibly shoving coins and prizes forward over the front edge (for the
  player), and the pusher's double speed must be obvious (sound and motion)." Every power needs a clear, felt result.
- Nov 17, UAT 78: "super broken", the kittens don't do anything, and the art doesn't work on the orange cat.
- Go (Nov 17): "CP-72 Zoomies: go as summarised. Prototype first, then UAT."

## Step 1: prototype (now)
- Find how Zoomies works today in the current UAT source (UAT 89, `work/cp89/` or the published UAT JSON's index.html,
  never printed) and say why "nothing happens" and why the art fails on the Orange cat.
- Rebuild the power so it does what Jenny describes: kittens enter at the back and run forward, visibly shoving coins
  and prizes over the front edge into the player's winnings; the pusher at double speed, obvious in sound and motion. No
  gaps drops can't reach; the bottom layer stays. Use existing art and code first; list any stand-ins.
- Make it watchable on her PC: a short video at 412x915 with sound, and key-beat stills at 412x915 and 360x640, on the
  Orange cat's board. Timing and feel are your call; list the choices.
- Rate the effort to ship.
- Work only in `work/cp72-zoomies/` and `tickets/CP-72-evidence/`. Don't touch `uat/`, `phone/` or the release files:
  the CP-58 engineer is building UAT 90 in this folder.

## Step 2: UAT (only when the PM says go)
Build into the then-current UAT with the usual backup, checks, real-browser boot, cloud check, checkpoint and GitHub
commit.

## Report
Top of `tickets/CP-72.md`; then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never
grep or print the 49 MB game JSON files. Keep long logs in your scratchpad, not the OneDrive folder.

## References (Jenny, Nov 17)
- Photos: Screenshots/ref-zoomies-1..5-2026-11-17.png (private): a sprint, flying leaps, a crouch with the rear up and
  the tail up, an arched sideways hop, and (5) a wide-eyed play-bow crouch, about to bolt, with the tail curled up in a hook.
- Video: https://youtu.be/U_blxJSRUhU (cat zoomies; the PM can't view video, so screenshots come from Jenny if needed).
- Her words: "running in circles... jumping, zigzagging... one or two... doing flips... jumping straight up in the air
  with their tail stuck out and their fur stuck out straight." At most 1 prize per use.
