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

## Jenny, Nov 18: timer and waiting
"I don't think the timer on each board is particularly helpful. I think some timed boards would be great, but I don't
think every level should be timed. I think I prefer the idea that the coins run out and you kind of have to go away and
wait for coins to refresh to come back. But there are other things you can do, like work on the cat food, and all of
those also take time and you come back to them." Also: "we need to clear out the backlog. We need to get the gameplay in
place so that we can be working on the refinements within a framework... Right now, if someone were to pick up the
game, they'd be lost."
PM: this settles rule 3 (coin wallet, no round timer; timed boards only as a special rule) and confirms cooking over
real time. Questions 2-4 and the refill speed (question 1) are still open.

## Parked for later (good ideas, not until the core loop is set)
Jenny, Nov 18: "It's definitely a good idea. It's just not time to implement this." These come back when we plan the
level ladder and Up Next unlocks.

- **More dances (Dance break).** Jenny: Dance break works ("every time it pops up, I go through it"), but "in the long
  run, it's going to get old". Different beats for different levels, each with its own catchy music, so "the player will
  get familiar with the song and know how to tap to it". Like the first dance, a new one "takes you off guard" and takes
  "3 to 5 tries" to learn. Rhythms must have "a real cadence": start with today's steady beat, then "a steady beat with
  one outlier or one double speed beat... dun, dun, dun-dun-dun", and maybe "some really kind of unusual cadence" on
  really difficult levels.
  PM notes: a new dance is a natural Up Next unlock. Rhythms are small work (a new beat list); the music is the hard
  part (one catchy track per dance that we're allowed to use), so make one second dance first. Keep early dances
  forgiving (difficulty ramp).
- **Side games per cat, and the wheel (found Nov 18, CP-80).** Today the Tuxedo, Orange (Treat toss), Ragdoll (Pet the
  cat) and Tortie (Mouse pounce) have the Dance break plus their own side game; the Siamese's Laser chase *replaces* the
  Dance break. The wheel (Yawn, Jackpot) only comes after a perfect Dance break, so Siamese players never get the wheel.
  This grew piece by piece, not by design. Decide in the plan: does every cat get the Dance break plus its own side
  game, or does the side game replace it, and how is the wheel earned on each board?
  Jenny, Nov 18: Siamese replacing the Dance break "just makes no sense"; and "Tuxedo only has dance break. That's
  crazy." PM: the Tuxedo was the first cat, so the Dance break was its side game. In the plan: make the Dance break shared
  by every cat, and give the Tuxedo a side game of its own that suits its formal character.
  Jenny, Nov 18: "Maybe Tuxedo's side game is dance break, and all these other cats shouldn't have it." PM: clean if the
  wheel rule becomes "a perfect side game, whichever it is, earns the wheel spin" (one cat, one side game; fixes the
  Siamese too; "more dances" becomes the Tuxedo's). Cost: the Dance break, Jenny's favourite, only on the Tuxedo's board.
  Options to decide: (a) every cat: Dance break + own side game; (b) one side game per cat, Dance break = Tuxedo's, any
  perfect side game earns the wheel. CP-81 (Siamese gets the Dance break back) is on hold until this is decided.
  **Jenny's direction, Nov 18:** "perfect side game earns a wheel spin makes sense. The problem is the other games are not
  winnable... it's not really possible to win perfectly. I think our goal should be to make every side game as satisfying
  and delightful as Dance Break, rather than trying to make Dance Break appear everywhere." So option (b): one side game
  per cat (Dance break = Tuxedo's); every side game gets a clear, reachable "perfect" and is polished to the Dance break's
  bar; a perfect side game earns the wheel. Order: rework the other side games first, then take the Dance break off the
  other cats, so no cat loses the wheel in between. CP-81 is replaced by this.
  **Decided, Jenny, Nov 18: option A.** "Side games: option A. Every cat has the Dance break plus its own side game. Put
  the Dance break back on the Siamese (next UAT); the Tuxedo gets a new side game later (gameplay plan)." Her reason:
  the cats' own side games win prizes as you play; the Dance break wins nothing until the end (a perfect one earns the
  wheel). So each board has one steady-reward game and one skill game for the wheel. The goal of making every side game
  as delightful as the Dance break still stands. CP-81 brings the Dance break back to the Siamese. Still open for the
  plan: the Tuxedo's own side game.
  **Correction and final word, Nov 18.** The CP-81 engineer found that only the Tuxedo has the Dance break today (the
  PM had wrongly said all but the Siamese), so only the Tuxedo ever reaches the wheel. Jenny: "We should keep all these
  separate. You know, we can keep the yawn art on hand. We might need it for something else. Certainly the eyes will need
  at some point." So: one side game per cat (Tuxedo = Dance break, Orange = Treat toss, Ragdoll = Pet the cat, Siamese =
  Laser chase, Tortie = Mouse pounce), plus one power each. CP-81 not doing. Open for the plan: how the other four cats
  reach the wheel (e.g. a perfect side game, once each is winnable), and making each side game as good as the Dance break.
  The per-cat Yawn art stays in the game for later use.

## Jenny, Nov 18 (evening): prizes, and the core pusher isn't fun enough yet
- Prizes: "we have quite a lot of prizes... it's really easy to add prizes [Codex does them in one pass]... I suggest that
  we introduce them rather slowly, and that a lot of the stuff we have doesn't need to all be crammed into the early
  levels... it's a lot of material to work with to create this game flow."
- Core gameplay: "one problem we have is that the main gameplay, which is the coin pusher... it's just not fully fleshed
  out. It's probably not good enough. I'd like it to be as fun as Pixel Flow... basically only has the one game, but it's
  entertaining enough to keep playing virtually endlessly, because there's always a new board and it's an enjoyable
  feeling to solve one of the boards... I would almost say it's not my kind of game... But [Bear Coin] I definitely
  enjoyed it. I just don't know what about it I enjoyed."
- PM view (for discussion): make each board feel *solvable*, like a Pixel Flow puzzle: every level built around one
  clear goal and one "trick" (a tower to topple, a ledge to clear, a prize hanging on the edge), where *where* you drop
  matters and a good drop sets off a satisfying cascade. The coin wallet (no timer) makes each drop count. New prizes
  arrive a few at a time as unlocks, not all in the first levels. First step: Jenny replays Bear Coin for 10 minutes and
  notes the moments that feel good; we turn those into board rules.
- Jenny, Nov 18: confirms the loop: no timer, play as long as you have coins, run out and come back later; cooking takes
  real time ("maybe a half hour, maybe 40 minutes"). Timed boards as challenges: "maybe we have timed games every day, 3
  of them or something, and you can win for the day... That gives people a reason to come back every day. And it would be
  great if we could rank people." Asked whether a beta can go on the Play Store.
  PM: daily challenges first with personal goals (win the day, a streak, your best score), no server needed; rankings
  later via Google Play Games leaderboards, testable with testers in a Play testing track. Play Store needs: a developer
  account, an AAB build, Play signing, a privacy policy and data-safety form; new personal accounts must run a closed test
  (about 12 testers for 14 days, check current rule) before going public. Internal testing (up to 100 testers) is fast.
- **Board reset ("pinsetter"), Jenny, Nov 18.** "I like seeing the cane clear the board. We could have the pusher push
  all the way to the end of the board, clearing the entire thing and then resetting the board in front of the player's
  eyes with a new setup... a button that is generally disabled, but over time it fills up... purely based on time or
  maybe based on number of coins played... once it's full, it becomes enabled, and then the player can choose to reset
  the board at any time... they could just play endlessly on the same board if they want to, but they could also reset
  it and then they'll get some fun new setup... a bit like when you're bowling and the pins all get swiped off and
  cleared, and then new pins get set up." Also: beating your own best is the daily-challenge goal; no Play Store until
  "I'm pretty proud of it."
  PM: strong idea; gives the endless board a "new board" moment. Open: does the sweep pay out what it clears (risk: a
  jackpot button saved for loaded boards; PM leans no or a little, like swept pins); fill by coins played rather than
  time (the wallet already gates time); is a reset a new level or a new layout of the same level? Medium effort.
  **Decided, Jenny, Nov 18:** the sweep does not pay out; the meter fills by coins played; a reset is not a level ("you're
  not winning a previous board in order to start a new board. You're just getting sick of a board"). Bonus: it rescues a
  board with a big gap (e.g. after Sonic meow). Open for the plan: how resets and levels/goals fit together (e.g. does a
  reset keep the current level's goal with a new layout?).

## Jenny, Nov 18 (evening): no board goals; open board + daily challenges
"I'm not really sure we should have goals on the board because we're not trying to win a board anymore... the goal
[is] I want to make cat food... or I want to attract a certain cat... or I want to generate coins... I want to collect
prizes to sell for coins so I can get special ingredients. So I think we'll have 3 timed game challenges per day. And
then we'll have just an open board. You can just play endlessly as long as you have coins. And when you run out of
coins, you're forced to take a break. And on that endless board, you have the ability to reset it... a meter that has
to fill before it enables the player to start a new board."
PM: this replaces rule 1 (levels with goals) and changes rule 9 (Up Next on level complete). Goals come from the
player's own aims: recipes, cats, coins. Open questions are listed in the conversation and below once answered.
Answers (Jenny, Nov 18): timed boards have very clear goals. Prizes sell for Catnip; Catnip buys special ingredients
(keeps the two separate). Cats: switch cat while on the board, any board (endless or timed): "the board and the cat
choice are two totally different things. I get the same board regardless of which cat I choose. So it's weird to have
to choose a cat before entering the board... The only reason not to is... difficulty in fitting the controls in the
screen." PM: tap the cat's name chip on the board (already there) to swap; the cat's side game and power come with it;
no swap while a side game or power is running. Still open: what gives a sense of progress (PM pick: attracting cats
unlocks recipes and new prizes) and whether the 10 levels become board layouts for resets and challenges (PM pick: yes).
- **Visiting cats are not the playing cats (Jenny, Nov 18):** "Regarding the cats we attract to the yard or whatever, I
  don't want it to be the cats we're playing on the board with. I just want it to be really nice cat art." So: the five
  playing cats (Tuxedo, Orange, Ragdoll, Siamese, Tortie) are helpers with side games and powers; visitors attracted by
  recipes are a separate collection of beautiful cat illustrations (one image each, plus maybe a photo pose), shown on
  the Porch/yard and in the Album. PM note: this keeps visitor art cheap per cat (no pose sets). Open: do new playing
  cats ever unlock, or are the five fixed for now?
  Answer (Jenny, Nov 18): five playing cats is already ambitious ("5 side games, 5 special powers"); no new playing cats
  planned. Focus on bringing each of the five up to the Tuxedo's level.
- **Pusher sound (parked, Jenny, Nov 18):** the Zoomies-only coin sounds (P1-P3) "make no sense... we need a different
  pusher sound, but not specifically for zoomies... What we have today is fine with me as well... I just don't care at
  the moment." Zoomies keeps today's sound; the P1-P3 Developer choice is removed in a later build. A new general
  pusher sound is a later idea.
