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

## Jenny's input (Nov 16, before testing UAT 67)

- **Prize goals:** one or two per board at most. Other goals: knock over towers, clear all of a colour, or collect a
  number of one colour.
- **Count goals:** "Collect 5 mice" shown as one icon with a number on it. Never list 7–8 prizes during play: "TMI on
  this tiny board."
- **Star prize:** what is it for? Today it brings that round's visiting cat (Porch/Album). It's unclear in play.
- **Bonus prizes:** drop only for a set time after a special coin goes over the edge, with a ticking sound. This could be
  one board's special rule.
- **Process:** focus on gameplay one board at a time. Once there are enough approved boards, generate more by mixing
  actions, consequences and goals.

## Jenny's input (Nov 16, performance and big moments)
- **Never slow the game.** Mitigate instead (memory: never-slow-gameplay).
- **Hard levels:** "we shouldn't have a larger number of coins. We should have more large coins." The player stays in
  control at the same speed. PM: a big coin is a new piece (new art, bigger collider); pair it with the star coin.
  Medium.
- **Board-clearing moment:** an extra-long push (pusher twice as far) clears coins. The catch is the "big gaping hole",
  where drops then make no progress. Her answer: big coins (maybe star coins) drop in to take the place of the small
  ones. PM: Sonic meow already doubles the pusher's length, and refilling with a few big star coins solves the hole.
  Medium.
- **Star coin** replaces the star prize (decided Nov 16).
- **Brainstorm (Jenny, Nov 16, "not saying we should do it"):**
  - When the board gets too full, the cat eats some plain paw coins ("nothing completely"), and occasionally grabs a
    prize. PM: it turns the performance limit into character. Take a few at a time from the back or sides, make it
    visible and funny, and never leave a gap. Medium (reuses the Yawn grab).
  - A grabbed goal prize must always be replaced by a fresh one dropping in, so there's still a chance.
  - **Clock coin:** a power coin that adds time to the round. PM: simple (data plus new art), and a nice counter to the
    timer pressure. Or it's a cat power for a new cat (Jenny).

- **Coloured music notes (Jenny, Nov 17):** "room for various colors of musical notes". CP-62 made gold, purple and
  turquoise notes. PM: these could carry colour for colour goals ("clear the purple notes") without touching the frozen
  coins.

## Open questions (after the backbone)

- Which goal types do early levels use?
- What does each cat's power unlock?
- How often should a "wanted" prize drop, so it stays scarce but findable?
- Keep the busy multi-drop moments (they're frozen behaviour).

- **Empty milk bottles (Jenny, Nov 17):** the Yawn drinks the milk and throws the empty bottle onto the board (CP-58).
  "maybe the empty bottle is even needed at some point." PM: it could be a goal ("push off 3 empty bottles") or a
  recipe or Porch item. Simple once CP-58 ships the piece.

- **Shop (Jenny, Nov 17):** "special prizes to the shop that can only be purchased" (can't be won on a board), and "different currency than gold
  coins for the shop since it is too confusing." PM: agree. Coins are what you push; the shop should use Catnip, which
  already shows on the top bar. Shop-only prizes give Catnip a purpose (e.g. the peacock feather). Open: how Catnip is
  earned. Simple to medium.

- **Reference boards (Jenny, Nov 17):** private shot `Screenshots/ref-pusher-top-2026-11-17.webp`, a real high-limit
  machine (other people's footage; not for Git).
  1. "tokens/coins sit on the pusher": a pile rides on top of the pusher. As the pusher pulls back, the back wall
     scrapes pieces off onto the board. PM: a natural refill that also fixes the long-push "gaping hole". Medium (the
     pieces ride a moving body; check performance).
  2. A giant stack falls (`Screenshots/ref-stack-fall-{1,2,3}-2026-11-17.webp`): a huge tower of chips stands
     behind the pusher, tips over and floods the board with chips. PM: a big set-piece moment, a natural reward for a
     "knock over the tower" goal or a big win. The catch is performance: hundreds of pieces. It needs fewer, bigger
     pieces (the big coins idea) or a cap. Medium to complex.

- **Level complete screen (Jenny, Nov 17):** "I really like the level complete experience in Hole em all"
  (`Screenshots/ref-hole-level-complete-2026-11-17.webp`, private). It has a big bold "Level Complete!", three big
  glossy stars with sparkles, one big Continue button, and an "Up Next" bar (1/3) towards the next reward. PM: ours is
  a small end card with a plain-text stars line and two buttons. The "Up Next" bar could show progress to the next
  cat, recipe or chest. Medium (UI and art; the stars need new art).
  What she liked about the motion: "the words were spelled out like our cat coin title page... then stars splatted onto
  the screen." PM: reuse our title's letter-by-letter animation for the message, then the stars land one at a time with
  a squash and a thump. Simple to medium; the stars need art.

- **Unlock ladder (Jenny, Nov 17):** an "Up Next" bar on level complete counts boards towards the next unlock. "new
  cats, recipes, shop items,... we can use all these things. I like it. It will tie gameplay together." PM: this is
  the backbone that links boards, Porch, Kitchen and Shop. Decide the order and spacing (e.g. every 3 boards) in the
  design session. The bar ships with CP-66.

- **Home shows what's coming (Jenny, Nov 17, Hole em All):** `Screenshots/ref-hole-home-2026-11-17.webp` (private).
  "walking me through an introduction that includes a storyline and episodes... so far doesn't bug me. I can see future
  goals... something will unlock at level 12. There are chests that are going to open later. there are things that
  unlock at various levels." On screen: locked icons with their level (Lvl 6, 25, 36, 51), two chests filling (2/10,
  6/20), an "Unlock at Level 12" banner, one big "Level 03" button.
  PM: this is the unlock ladder made visible on Home. Locked doors with a level number are cheap and give a reason to
  keep going. The filling chests are our Keys and chests (#5). Keep any storyline light (the cats' visits), since
  episodes are a lot of content. Ties to CP-60 (Home) and CP-66 part 2.
  **Decided (Jenny, Nov 17):** "our storyline will just be cat visits." Blocker: "we just need great cat art and we
  struggle with that."

- **Spitballing (Jenny, Nov 17, not decided):** "maybe we should have fewer prizes on the board... I don't think we
  should have every prize on the board that we have to win the board. And maybe we shouldn't even have the concept of
  winning a board... a finite number of coins... levels... you can run out of coins and therefore have to stop
  playing. And maybe then you could sell your inventory for coins. Or... for catnip, or sell your catnip for
  inventory."
  PM opinion: yes to fewer prizes on the board (performance and scarcity). Keep levels with 1-2 goal prizes for a
  clear goal. A persistent coin wallet that can run out and refills over time is the standard pusher model. Exchanges
  go one way: extra prizes (beyond what recipes need) sell for Catnip, Catnip buys shop items. Two currencies, no
  back-and-forth.
