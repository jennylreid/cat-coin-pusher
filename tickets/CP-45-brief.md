# CP-45 Gameplay map prototype (screens and economy)

Name this conversation "CP-45 Gameplay map prototype". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow
AGENTS.md. Read CODEX_BRIEF.md, then **GAMEPLAY_MAP.md** (the whole thing; it is the spec) and the top of
`tickets/CP-44.md` (UAT 48, the baseline). You are the engineer; Claude PM reviews your report.

**Why:** Jenny, Nov 13: "I think we need to do some prototyping." She approved the gameplay map's direction and
its section 10 decisions. She wants to *feel* the sequence on her phone: play → ingredients → cook → porch →
catch the cat → photo → cat coin → that cat's board. Hackathon style, like CP-35 to CP-44: no art or sound
approval stops. You make the design calls and publish to UAT when it plays well.

**Baseline:** 2026.11.12 UAT 48 (`work/cp48/`). Everything in UAT 48 keeps working: Wild 2, the four modes, the
dance break, wheel, Paw save, Tower wall, the Developer controls.

## Build
1. **Home screen.** The first screen. The current cat lounges and reacts when tapped. Doors (big buttons) to
   Board, Kitchen, Porch, Album, Shop. A level bar with XP. A paw print on a door when something waits there
   (a cat on the porch, a recipe ready to cook). Coins and Catnip shown.
2. **Cat boards.** The four modes plus Wild 2 become cat boards, per the map's section 4 table: Tuxedo = Wild 2,
   Orange = Treat toss (Kitchen), Ragdoll = Cozy, Siamese = Laser chase, Tortoiseshell = Tower wall. A new save
   starts with only Tuxedo's board. A board opens when its cat coin is won. Switching between opened boards is
   free from level 5; before that the newest opened board plays, and the others show a lock with "Level 5".
   Keep the MODES picker under Developer so Jenny can still test any mode directly.
3. **Board goals and stars.** Collect goals use a 5–7 prize list that changes each round and leans toward what
   the current recipe still needs. 1 star = goal met, 2 = with time left (pick the threshold), 3 = plus a
   perfect side game. Rounds give XP; stars give more.
4. **Exclusive prizes.** Each cat board drops some prizes no other board drops (map section 4 "Only here"), and
   each recipe needs at least one prize from another cat's board, or one bought in the Shop.
5. **Kitchen.** Recipes unlock with levels (first at level 2: a Tuna dish for the Orange cat). Cooking: drag or
   tap ingredients into the pot, stir (circle gesture or taps on a beat), a big "ding" and steam. A recipe is used
   up when cooked; you hold only one copy; win it again from a recipe coin or prize on the board.
6. **Porch.** 2 food spots. Food set out → after a short wait a cat eats it ("Someone ate the tuna 🐾" message,
   also shown during a round, below the cat's chin) → the cat stays for a hidden window (20 min to 2 h real time,
   counting while the game is closed) → open the Porch while it's there and tap 📷 to photograph it: shutter
   sound, flash, the photo flies to the Album. Missed: it leaves paw prints and the food is gone.
   The visitor card is **removed from the board** for good (all modes).
7. **Album.** One page per cat (photo slots, several poses later) and a prize page. A full page stamps and gives
   Catnip.
8. **Shop.** Sell prizes for coins; buy ingredients you can't win (priced so coins matter). Coins clink into a jar.
9. **Cat coins.** After a cat's first photo, its coin drops now and then on any board. Pushing it off opens that
   cat's board with a big moment (the cat appears, a fanfare).
10. **Caps.** Every item stops at a cap (start at 9 per prize, a Developer dial). Anything over the cap turns into
    coins at once with a clink and a small "+n" so nothing grows forever.
11. **Placeholder cats.** Recolour a **copy** of the Tuxedo art in code for the Orange, Ragdoll, Siamese and
    Tortoiseshell (board and porch), plus a name tag. The Tuxedo's own art is not changed. Porch cats can be the
    same recoloured art, scaled down. No new generated art in this ticket.
12. **Dance break: one move per dance.** The Dancing pose has 4 moves. Each dance break (and the win dance) uses
    one move only, a different one from last time.
13. **Feel on every screen** (design rule 1): each screen has sound, motion and something to tap. Text is the
    backup. Follow the sound setting and the volume dials.
14. **Developer:** visit window (seconds, for testing), XP speed, item cap, "give all cat coins", "reset
    progression", "cat visits now".

## Rules
- Design rules 1–7 in GAMEPLAY_DESIGN.md apply. Nothing covers the cat's face for more than a moment.
- Approved art stays frozen (AGENTS.md). New pieces (doors, pot, porch, album, shop, cat coins) are drawn in code.
- Progression is a new UAT save section. A UAT 48 save upgrades cleanly: existing coins and prizes carry over,
  capped (excess becomes coins once).
- Performance: the new screens are not the coin board; the board's frame cost must not get worse. Report it.
- UAT only. Back up first, name it "2026.11.xx UAT n" with the version strictly increasing, verify a fresh cloud
  download, run checks with sound on and strict fake audio, then `python work/checkpoint.py`. Production untouched.
- Split it into more than one UAT build if that's faster to feel: e.g. Home + Kitchen + Porch + Album first,
  then the Shop, cat coins and board switching.

## Report
At the top of `tickets/CP-45.md`: what was built; frames of each screen and of the full chain (cook → porch →
photo → cat coin → new board); the tuning (XP curve, prices, caps, windows); limits; a short "what to try" list
written for Jenny. Then message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and wait.
Feedback and files go through the PM. Close-out after Jenny's sign-off: commit and push to
C:\Users\jenny\GitHub\cat-coin-pusher naming CP-45 (`git switch main` first; the repo sits on `wip/uat`). Never
commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.
