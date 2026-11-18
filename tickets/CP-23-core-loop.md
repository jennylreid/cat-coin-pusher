# CatCoin core loop (CP-23 proposal, Nov 17, 2026, for Jenny's review)

PM draft from today's conversation. Nothing here is decided until Jenny says so. Once agreed, it replaces the top of
GAMEPLAY_DESIGN.md and becomes tickets.

## The problem
The game has lots of good pieces (boards, prizes, Kitchen, Porch, powers, the wheel, the Jackpot) but no spine connecting
them. Prizes pile up in an inventory with no reason to fill it, and the Jackpot pays out with nowhere for the win to go.
Busy boards with lots of prizes and coins also strain the phone.

## The loop in one picture
```
 play a level (coins from your wallet)
        │  win prizes
        ▼
 recipes fill up (Tuna 2/3)  ──extras──►  sell for Catnip  ──►  Shop items
        │  recipe complete                                         │
        ▼                                                          ▼
 a cat visits the Porch  ◄──────── special recipes need shop items (mystery cats)
        │
        ▼
 "Up Next" bar: every few levels unlocks a cat, a recipe or a shop item
```

## The rules
1. **Levels, each with one clear goal:** collect 1–2 named prizes, or score coins. The goal shows as one icon with a
   count ("5 mice"). Never a list of 7 prizes.
2. **Fewer prizes on the board.** A level holds the goal prizes plus a few extras. That helps the phone, and each prize
   matters more.
3. **One coin wallet, no round timer.** Your coins carry from level to level. Every drop costs a coin, so you play
   carefully without a clock. When you run out, the wallet refills slowly over real time, or from selling extras. An
   occasional "rush" level can still have a timer as its special rule.
4. **Heavy levels use bigger coins, not more coins.** Hard boards get big coins (new art), so the board looks full
   and pushes hard without overloading the phone.
5. **Prizes go into recipes,** and you see it happen. Each recipe card has a meter per ingredient ("Tuna 2/3"). After a
   prize's pickup lands, a small "+1 Tuna 2/3" shows near the recipe chip. The pickup itself stays frozen.
6. **Recipes bring cats.** A finished recipe is set out on the Porch, and its cat visits. You take its photo for the
   Album. The visits are the storyline: the four visitors' favourite treats (Orange: tuna, Ragdoll: cheese, Siamese:
   shrimp, Tortie: toy mouse) become their recipes.
7. **Extras sell for Catnip.** Only prizes your recipes don't need can be sold. Catnip is the only shop currency, so
   gold coins are never spent in the shop. Exchanges go one way; there's no buying coins back with prizes.
8. **The Shop sells what boards can't give:** special items (a peacock feather, a top hat). Some recipes need a shop
   item, and those attract **mystery cats**.
9. **"Up Next" bar on level complete.** It counts levels towards the next unlock (a cat, a recipe, a shop item). It
   comes with the new level-complete moment (CP-66): the title, the spelled-out words, and stars that splat on.
10. **The Jackpot is the accelerator.** A perfect dance earns the wheel spin; the rare Jackpot pours prizes that
    visibly fill your recipes and give the Up Next bar a big push. Later, the player aims the cascade by tapping.

## What changes from today
| Today | Proposed |
|---|---|
| Round timer on every board | Coin wallet carried between levels; timer only on special levels |
| Win = collect all 5–7 prizes | Win = 1–2 goal prizes, or a coin score |
| Crammed boards with many prizes | Goal prizes plus a few extras; bigger coins on hard levels |
| Inventory is a number in a far-off screen | Recipe meters you see filling as prizes land |
| Shop uses gold coins | Shop uses Catnip; extras sell for Catnip |
| Jackpot pays out into nothing | Jackpot fills recipes and the Up Next bar |

## Build order (each step is a ticket, small enough to test the same day)
1. **Recipe meters** on the Kitchen cards plus the "+1 Tuna 2/3" after pickup. Small; you feel it at once.
2. **Fewer prizes per level** and goals of 1–2 prizes. Numbers only.
3. **Coin wallet without the round timer,** with a slow refill. Medium; it changes how a level ends.
4. **Sell extras for Catnip, and the Shop in Catnip.** Medium.
5. **Level complete and the Up Next bar** (CP-66), with a first unlock ladder.
6. **Jackpot hooked into recipes and the bar** (CP-64 rework).
7. **Big coins** for heavy levels (new art). **New cat art** (CP-67) runs alongside as the visitors become the payoff.

## Questions for Jenny
1. **Refill speed:** how long until an empty wallet is full again? My pick: about 1 coin a minute, full in 2 hours.
2. **Levels:** do we keep the current levels and trim them, or start a fresh list with the new goals? My pick: trim
   the current ones.
3. **Recipes:** start with the four visitors' recipes (3 of their favourite plus 2 others each)? My pick: yes.
4. **Losing a level:** with no timer, a level ends when you choose to stop or you run out of coins. Keep the prizes you
   won either way? My pick: yes, you always keep prizes.

## Jenny's input after the draft (Nov 17)
- **Cooking takes time** (from Family Island): "a timer on the cat food so that it takes time to make it." There, you
  make items in buildings, and upgrading a building lets you make more or make them faster. "I think we should follow
  that format for making recipes, and we'll have to have a way of grouping them... more of a variety to choose from."
  PM: this fits the loop. Recipes cook over real time in kitchen stations (e.g. stove, oven, fish grill), each holding a
  group of recipes. Upgrades (more slots, faster cooking) are a natural thing to spend Catnip on. Watch that the cooking
  timers and the coin-wallet refill together don't feel like too much waiting.
- Jenny: today's cooking "just wasn't fun at all... there's no payoff... why am I dragging all these things in if it's
  just going to be done? I think there needs to be time to wait, and then that's your investment of time that you come
  back and see that it's fully cooked. And maybe some recipes have to... go in an oven."

## Genre and tagline (Jenny: "save that for later", Nov 17)
Store category Casual. Genre line "a cozy coin pusher". Tagline "Push coins. Cook treats. Collect cats." Other options:
"Coin pusher meets cat café".

## Difficulty ramp (Jenny, Nov 17)
A side game straight after a Jackpot "will not be too much... for the really high-level player... it'd be totally
fun. But it's way too much for a beginner." PM: back-to-back events unlock with level. Early levels keep big moments
apart; later levels allow them to chain.

## Power balance (Jenny, Nov 17)
"We're making it too easy with all these powers." Zoomies capped at 1 prize per use (CP-72). PM: in the powers pass,
give each power one clear, felt result that helps but never wins a board by itself, and scale its strength with level.
