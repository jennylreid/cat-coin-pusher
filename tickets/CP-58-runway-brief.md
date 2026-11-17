# CP-58 Yawn face: Runway trial (Jenny, Nov 16-17)

Name this conversation "CP-58 Runway yawn trial". Work in C:\Users\jenny\OneDrive\work\CoinPusher; read AGENTS.md
("Art and layout": approved faces are frozen, and new art is painted over the locked canvas), tickets/CP-58.md (the Yawn
prototype) and memory notes as given below. You are the engineer; Claude PM reviews.

**Context:** the Yawn prototype is "almost usable". Everything works except the yawning face, a code-drawn stand-in
("really poorly drawn ... the mouth is a perfect oval ... not in the location where the mouth belongs"). A yawn needs
the whole jaw to change: the chin drops, the muzzle stretches and the mouth opens. Codex has struggled to keep our cat
on-model. Jenny has used Runway's character tools to build her real cat as a consistent character, and wants a small
trial with our cartoon cat.

## Do (small: about 8 generated images at most; the credits are shared with another project)
1. Use **Claude in Chrome** (Jenny's own Chrome; she's signed in to Runway). Read the `anthropic-skills:chrome-browser`
   skill first. Work in a new tab. Don't change account settings, buy anything, or share anything.
2. **References:** our approved head as it looks in the game:
   - `work/cp33/assets/img/art/head-calm.png` (normal), `head-sweet.webp`, `head-wild.webp`;
   - the in-game sheet `tickets/CP-55-evidence/faces-in-game/faces-in-game.png` (crop the Calm, Happy and Sweet tiles if
     needed).
   Use Runway's character or reference feature so it keeps this exact cat.
3. **Ask for one expression:** the same tuxedo cat head, front view, same flat cartoon style, lines and colours, doing a
   big yawn. The jaw opens wide, the chin drops, the eyes squeeze shut, with a real open mouth and tongue. Plain
   background. About 8 images at most, in 2-3 attempts.
4. **Download only the generated images** into `tickets/CP-58-evidence/runway/` (each file's name says which attempt).
5. **Fit test:** cut out the best 2-3 on transparency and scale them onto the approved head's canvas, at the same size
   and position. Make previews:
   - side by side with the approved head;
   - over the board at 412x915.
   Say plainly how on-model each is (lines, colours, ears, eyes, outline), and whether it could become the yawn frame,
   or only the lower face as an overlay.

## Don't
Don't change the game, UAT or production, and don't touch other tickets' files. Don't spend more than about 8
generations.

## Report
Top of `tickets/CP-58-runway.md`: what you did in Runway, the images, the fit previews, your verdict, the credits used.
Then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop.
