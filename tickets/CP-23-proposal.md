# CP-23 Design proposal: goals, prizes and replay (PM draft, Nov 16)

This is for Jenny to react to. Nothing is decided until she says so. Once agreed, it goes to the top of
GAMEPLAY_DESIGN.md and becomes tickets.

## The problem (Jenny, Nov 15–16)

- Prizes come too fast and pile up ("9/1 everywhere"), so nobody hunts for a particular prize.
- Crammed boards are fun now and then, but not as the norm.
- A half-empty board goes nowhere and you just wait for the timer.

What we want: a board is enjoyable, never blocked and not too easy, with the simplest code we can manage.

## The idea in one line

Each board has two separate things:

1. **A goal.** This is what you must do to pass.
2. **A prize list.** This is what you can find there.

Passing moves you on. Prizes feed the Kitchen and Porch. To hunt a particular prize, you replay a board whose list has it.

## The pieces, with my opinion and how hard each is

How hard: **simple** = level data and counters only · **medium** = a new piece or screen, no new physics ·
**complex** = new physics or aiming.

| # | Idea | My opinion | How hard |
|---|---|---|---|
| 1 | **Goals separate from recipe prizes.** Goal types: collect named prizes (Level 1 shrimp and cheese stays like this), score coins, or clear colours (#2). Prizes drop more randomly, and a recipe's ingredients are marked "wanted" only once that recipe is unlocked. | Yes. It fixes the pile-up at the root. Goal prizes still go to the pantry as a bonus. | Simple |
| 2 | **Colour goals.** Clear the coloured pieces off the board. The colour sits on tokens or tower tops, because the approved coins are frozen. Ties in with patterns (a picture made of pieces). | Strong, and the clearest puzzle we have: you can see what's left. | Medium (a new token piece and a counter) |
| 3 | **Prize list per board, plus replay.** Each passed level shows "prizes on this board", and you can replay it from Home to hunt. | Yes. It gives old levels a use. Risk: the same replay over and over gets dull, so shuffle the prize spots each time. | Simple to medium (a level picker) |
| 4 | **Locked prizes.** Frozen in ice, caged, or behind a wall. A locked prize doesn't move until you use the named power or tool, then it plays like any prize. | Yes. It gives powers and replays a purpose. Rules: it must look locked, name what frees it, and never be a level's required goal. | Medium |
| 5 | **Keys and chests.** You already chose these on Oct 27 ("Key hunt", your favourite). Get the key off the board, then open a chest. A frozen key combines this with #4. | Yes. It's a two-step reward, and the chest screen is a payoff moment. | Medium (a chest screen) |
| 6 | **Claw grabber.** Already in the Oct 27 notes as a side game. Proposal: it's the cat's own paw reaching in. The simple version: you tap a prize and the paw grabs it, one grab per use, with no aiming. | Yes, as the tap version. An aiming claw is a game of its own; leave that for later. | Medium (tap version) · Complex (aiming) |
| 7 | **Lighter boards.** Fewer bonus prizes, fewer crammed boards (Level 4: 12 prizes; Level 9: 14), prizes further back. The starting coin grid stays as in CP-48. | Do it first. It's only numbers, and CP-51's slower drop already makes boards harder; measure that first. | Simple |
| 8 | **Big coins dropping in during play,** like rain coins: they hit harder and are worth more. They're not in the starting layout. | A good way to get the bigger-coin feel. It needs new art (a new coin; the approved coin isn't changed). | Medium |

Already on the way: Pause with Finish (CP-51), which handles the half-empty board.

## Suggested order

1. CP-50 → CP-51 → a **balance pass** (#7).
2. **Goals and prize lists** (#1, #3), with replay. This is the backbone; everything else hangs on it.
3. **Keys and chests, plus locked prizes** (#5, #4), with one power that frees one lock type.
4. **Colour goals** (#2).
5. Later: the paw grab (#6) and big drop-in coins (#8).

## Open questions (after the backbone)

- Which goal types do early levels use?
- What does each cat's power unlock?
- How often should a "wanted" prize drop, so it stays scarce but findable?
- Keep the busy multi-drop moments (they're frozen behaviour).
