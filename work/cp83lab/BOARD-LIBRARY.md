# CP-83 board library (layouts for the future board reset)

Jenny, Nov 18: "You'll keep the boards as plain layouts for board reset to rotate through later." The layouts are plain data in
`LAB.B` in `work/cp83lab/cp83-lab.js` (the full CP-83 block; the published UAT 104/108 builds carry the round-2 version of it,
`work/cp104-lab/cp83-lab.js`, which has no round 3). Each layout has the same shape as a level in `PGL_LEVELS`
(`coins, secs, goal, star, p, towers, blocks, btop, wall, top, rain, quake`), plus optional extras that the block's code adds
when the layout is built.

| Key | Name | What's on the board | Extras used |
|---|---|---|---|
| tower | Tall tower | a 15-coin tower near the front, tuna on top | `blocks`, `btop`, `mark` |
| edge | Cliff edge | a two-layer coin ledge at the front; cheese on it, shrimp and tuna further back | `ledge`, `perch` |
| pins | Bowling pins | six 5-coin pins in a triangle near the front | `blocks`, `mark` |
| wall | Break the wall | the levels' 5-tower wall, yarn/bell/duck behind it | `wall`, `top:[]` (keeps prizes off the towers) |
| mice | Mouse hunt | 7 mice: 2 on short towers, 2 by the sides, 3 in the pile | `blocks`, `btop` |
| red | Red coins | 14 tinted coins in a band | `red` |
| lanes | Three lanes | two rails split the board into 3 lanes, tuna in the left one | `rails` |
| cup | Cup shot | a hole on the left; coins pushed over it drop in | `cup` |
| bumper | Bumper | a pinball post that kicks coins | `bumpers` |
| gate | Switch gate | a bar across the front that a switch opens for 3 s | `gate` |
| chain | Pusher chains | plain board, three hint coins; coloured drops and chains | `chain` |

Pusher towers (stacks on the pusher deck) was requested but never built; there is no layout for it.

**Loading one in a future reset:** the block already loads a layout by making `pglLevel()` return it while it is selected,
then calling `wildReset()`. The level path builds the layout (`wildPrefill`, `pglStandBlocks`, the grid), and the block's
wrappers add the extras (`ledge`, `perch`, `red`, `rails`/`cup`/`bumpers`/`gate` via `lab2Build`, `chain` colours). For a reset
that rotates layouts in normal play, key those wrappers on "the board's current layout" instead of `LAB.on()`. Drop the lab-only
parts: the goal row, goal kinds, drop budget and win rules. They don't belong in an open board.

**Developer switches left in (default off):** Tower fall: Today / Topple (`catpusher.uat.cp83tower.v1`, in UAT 104 onward);
Timing strip: Off / On (`catpusher.uat.cp83timing.v1`, only in the unshipped cp83lab/cp109-lab block).
