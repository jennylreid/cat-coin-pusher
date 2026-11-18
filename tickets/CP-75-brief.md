# CP-75 Yawn faces for every cat (Jenny, Nov 18)

Name this conversation "CP-75 Yawn faces". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md ("Art and
layout": approved art frozen, one piece at a time, no full redraws) and CODEX_BRIEF.md. Read DEVELOPER.md "The wheel's
Yawn (CP-58...)" and tickets/CP-58.md for how the Yawn face and eyes are drawn. You are the engineer; Claude PM reviews.

**Jenny, verbatim:**
- Nov 18 (night): "yawn can happen with any cat but the art from tuxedo was reused on all other cats giving them black
  eyes and other oddities so each cat needs to go through yawn review and be updated."
- Nov 18: "We also need to fix all the cats art during Yawn because they reuse the black cat, the tuxedo cat art...
  Claude, you were the one who took the tuxedo cat art and did mock-ups for the other cats, which we've kind of just been
  sticking with. So you should be able to update the black cat art for just these components, the yawn and the, with the
  eyes. I think it's mainly the eyes that are the problem... Can you get that going with a Claude engineer, please?"

## Step 1: stills for Jenny (now)
- Find how the other cats' heads (Orange, Ragdoll, Siamese, Tortie, and any others) were made from the Tuxedo art, and
  make each cat's Yawn the same way: the approved Tuxedo yawn face (`img/art/cp58-yawn-face.webp`) and squinting eyes
  (`img/art/cp58-yawn-eyes.png`) adapted to that cat's own colours, markings and eyes, so it's clearly the same cat as its
  normal face. Mainly the eyes (no black Tuxedo eyes on other cats), plus any other Tuxedo-only oddities.
- Same canvas, size and placement as the Tuxedo yawn, so nothing moves. The Tuxedo's own yawn and every cat's normal
  faces are frozen: don't change them.
- Show each cat's yawn in the real game at 412x915 and 360x640: today's (wrong) next to the new one, plus one sheet of
  all cats. List anything you're unsure of.
- Work only in `work/cp75-yawn-faces/` and `tickets/CP-75-evidence/`. Don't touch `uat/`, `phone/` or the release files:
  another engineer is building UAT 94.

## Step 2: UAT (only on the PM's go)
Into the then-current UAT with the usual backup, checks, real-browser boot, cloud check, checkpoint (--message) and
GitHub commit on wip/uat. Only once the PM says no other engineer is building.

## Report
Top of `tickets/CP-75.md`; then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never
grep or print the 49 MB game JSON files. Keep long logs in your scratchpad. Don't stall on background runs: run them in
the foreground or poll them.
