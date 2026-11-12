# CP-23 Core game concept: working notes (draft)

Jenny's Oct 27 design talk, sorted by the PM. Not the concept page yet: it goes into GAMEPLAY_DESIGN.md once Jenny confirms it.
Status: **Built** = in the game today · **Decided** = Jenny said so · **Proposed** = PM suggestion awaiting Jenny · **Open** = not settled.

## Rules of the game
| Rule | Status |
|---|---|
| One board at a time, each with a start and an end; easy to clear. A board can be lost (out of coins and/or time). | Decided |
| A board ends on a coin count: you play with the coins you have; the purse refills on a timer (plus coins earned by play). No board timer. | Decided |
| A required prize lost in a side gutter loses the board ("PRIZE LOST"); the same board restarts, keeping purse, inventory and collections. | Decided (Oct 30; built in CP-25) |
| "Lose softly, never locked out": the coin purse refills on a timer and from play; a free home board is always open with smaller rewards; special boards unlock by merit, never by waiting or paying. | Decided |
| Always something going on: one constant side quest (collections) plus short pop-up side quests. | Decided |
| Each cat is a world with its own signature power. You switch worlds (between boards) to use another cat's power; the board comes with you. | Decided (switching between boards: PM default) |
| A world's prizes only drop in that world. | Decided |
| Ads: opt-in only, to earn coins or energy; never pushed. | Decided |
| Skins: cats and holiday themes swap in over the locked layout. | Decided |

## Catalog: everything and what it belongs to
| Thing | Kind | Belongs to | What it does | Status |
|---|---|---|---|---|
| Tuxedo cat (starry night) | Cat / world | — | Today's cat. Known for markings, highly intelligent. | Built (art); world Open |
| Orange cat | Cat / world | — | Outgoing, goofy, energetic: "orange cat energy". | Decided |
| Ragdoll | Cat / world | — | Calm, docile, goes limp when picked up; blue eyes, fluffy coat, large body. | Decided |
| Siamese | Cat / world | — | Highly vocal, very intelligent, pointed pattern, demands attention. | Decided |
| Tortoiseshell | Cat / world | — | Fiery and independent: "tortitude". | Decided |
| Formal inspection | Power | Tuxedo | Monocle highlights the highest-value coins and prizes; the cane sweeps them. | Decided |
| Zoomies | Power | Orange | Pusher double speed for a few seconds. The cat is bigger than the board, so little kittens zip across it instead (Jenny's idea). | Proposed |
| Wild tongue | Delight moment | Orange | Orange cat's look is the wild Waiting pose (claws, teeth, tongue out). Now and then the tongue snatches something off the board: a coin or a prize, which it either eats (cheeky theft) or tosses to you (a rescue); either outcome can happen to either. Giant prizes: Open. | Decided (Oct 28) |
| Cuddle gaze / Hypnotic purr | Power | Ragdoll | Cat goes limp over the board (the hug) and blocks the gutters. Paw combo (UAT-20) may trigger it. | Decided (name Open) |
| Sonic meow | Power | Siamese | A vibration that doubles the pusher's length, once or for a few seconds. | Decided |
| Tortitude! | Power | Tortoiseshell | Fiery burst that shoves a big group of coins forward. | Decided |
| Gold coin | Coin | All worlds | The coin you drop. | Built |
| Quake coin | Power coin | All worlds | A plain earthquake that shakes the board. Counts toward Power coins. | Built; "stays plain" Proposed |
| Bounce coin | Power coin | All worlds | Every coin hops once. Symbol: cat-toy spring (or ball, pogo stick). | Decided (symbol Open) |
| Giant "10" coin | Giant prize | Power coins collection | Over the edge, 10 coins fall at once; board shakes, cat reacts. | Decided |
| Cheese | Prize | Cheese collection | Collection item. | Built |
| Mouse | Prize | Cheese collection | Collection item. | Idea |
| Shrimp | Prize | Water collection | Collection item. | Built |
| Tuna | Prize | Water collection | Collection item. | Built |
| Double-size fish | Giant prize | Water collection | Drops once Water is complete; collecting it unlocks the next level. | Decided |
| Giant igloo | Giant prize | A snowy world (example) | Example of a world's giant prize. | Example |
| Key | Prize | Key hunt | Getting it off the board earns a key for a chest. | Decided |
| Water collection | Collection | World Open | Tuna, shrimp, more. | Decided (world Open) |
| Cheese collection | Collection | World Open | Cheese, mouse, more. | Decided (world Open) |
| Power coins collection | Collection | All worlds | Quake, Bounce and future power coins. | Decided |
| Collection screens | Screen | Collections | Silhouettes hint at items; you place items from your inventory yourself. Several of an item raises the level. | Decided |
| Inventory | Screen | — | See everything you hold. | Decided |
| Chest screen | Screen | Keys | Pick which pretty chest to open with your key; satisfying opening; reward shown. | Decided |
| Giant prize rules | Rule | Every collection | Drops from time to time after completion; only the claw or the hug lands it; after 5–10 failed tries it may fall off the front and count. | Decided (5 or 10 Open) |
| Claw | Side game | All worlds | Tap: slides right to left; tap: moves forward; tap: drops, grabs, lets go over the front edge. Rescues prizes. | Decided (how you earn it Open) |
| Prize wheel | Side game | All worlds | Mostly bad or empty slices, a few great ones (extra power, 10x coin). Bad = win nothing, or the cat's guilty sideways shove costing a few coins (like Bear Coin's grimace). | Decided; slice mix Proposed |
| Key hunt | Pop-up side quest | All worlds | A key rides on the board; get it off, then open a chest. | Decided (Jenny's favourite) |
| Treat rush | Pop-up side quest | — | Prizes drop faster for 60 s. | Proposed |
| Lucky paw | Pop-up side quest | — | Next 10 coins count double. | Proposed |
| Swat game | Pop-up side quest | — | Tap bouncing yarn balls for prizes (like Family Island's darts and balloons). | Proposed |
| Daily wish | Pop-up side quest | — | e.g. "collect 3 shrimp today" for a reward. | Proposed |
| Coloured-coin boards | Board goal | — | Clear the coloured coins (or the key, or a gold block) to win the board. | Idea |
| Big moments | Effect | All | Board shake plus a fun cat reaction (as in the Quake). Jenny wants many moments of delight. | Decided |
| Sideways push ("oops") | Delight moment | Prize wheel bad slice | The cat's paws shove coins sideways into the gutters with a guilty grimace; a ghostly "Fell off!" and the cat tears up (Bear Coin's, which Jenny finds really funny). | Decided |
| Dancing pose, Tickle | Cat animation | Tuxedo | Built and shipped; where they're used in play is Open. | Built |

## Open questions
1. Which world each collection belongs to (Water, Cheese), and each world's theme.
2. How you earn the claw and each cat's power.
3. Which prizes give powers and which go to collections.
4. Which pop-up side quests to keep.
5. Ragdoll's power name; the Bounce coin's symbol.
6. Giant prize: 5 or 10 failed tries.

## Nov 12: Wild board playtest (UAT 35), Jenny's notes
- **Best part:** the cat's dance at the end.
- **Fun:** the opening board full of a variety of items.
- **Coin rain:** a great concept, but you don't feel coins pouring onto the board. It needs to stand out more.
- **Rain coins:** the variety of coins looks good, "almost good enough to use".
- **New prizes** (yarn, duck, mouse, bell): they need to reach the standard of the fish, cheese and shrimp. Refine them.
- **Missing:** "some feeling that you're collecting something that you need for some other purpose."
- **PM read:** the board is busy, but the player makes few choices. Nothing builds anticipation, and nothing lasts after the round.
- **Purpose idea (Jenny):** she loves a cat game where you leave food out, and different foods attract different cats. You leave the game and come back to see which cats visited. Then you take their photo and save it to your collection. The mechanic is inspiration only: our own art, cats and screens.
- **Decided (Nov 12): the Porch.**
  - Prizes won on the board are set out on a porch.
  - They attract visiting cats, and different prizes bring different cats.
  - You snap the visitors' photos into a **cat album**, which is the long-term collection.
  - Visits happen both during play and while you're away, so they're a bonus rather than a time wall.
  - First version: 2 porch spots and 4 visiting cats.
- **Brainstorm (Jenny, Nov 12, not decided):**
  - **Recipes.** Prizes are ingredients, such as tuna, carrots, cheese and salmon. Collect a recipe's ingredients, then spend coins to cook that cat's food.
  - **Boards and cats.** The busy Wild-style boards are for general collecting. Attracting a cat may be what unlocks that cat's own board.
  - **Dance break.** Pick one of the cat's dances and use it to interrupt a game mid-board, with its music and a timer. While the cat dances, there's something special the player can do. Keep all the dances for later use.
    - **Decided (Nov 12), option 1:** each tap that lands on the beat banks a gold coin. When the music stops, the banked coins all rain down at once. It could sometimes bank a rain coin too.
  - **Jenny:** "we need more payoffs, but we have to have goals in order to have payoffs."
  - **Perfect dance → spinner (prize wheel), Nov 12.**
    - Good slices: big prizes.
    - Bad slice: the cat **stretches and yawns**. Its paws extend straight ahead and swipe things off the sides of the table.
    - Needs new art: a yawn face, and paws stretched forward.
  - **Cat's head (Nov 12):** the paws are in a good place, but the head should sit higher on the screen, or be rounder and fill more of the space above. This is a layout change, so it needs real-game screenshots to pick from.
  - **Other UAT 37 notes:**
    - The beat indicator is "just brilliant".
    - Coin rain doesn't fall from high enough.
    - Coins flicker and disappear behind other coins on a full board.
    - Some coins disappear under the cat's chin.
    - The pusher feels wrong (a shadow?).
    - The dance rain's payoff is unclear.
    - The game needs music throughout.
    - The cat is too static.

## Nov 12, UAT 40/41: "a super wild experience with the board crammed with prizes, and I liked it"
A board packed with prizes is a hit. Keep prize density high even if the coin count is capped for speed.
- **Cascade (Jenny, Nov 12):** "the board went crazy, prizes were falling all over the place... all the notifications were popping up at once... really kind of neat." She didn't know the cause; no log came through. Make it an intentional, rare "jackpot cascade" moment once the trigger is known (suspects: Quake on a crammed board, a Rain 25 or dance pour, turbo).
  - **Jenny:** during a cascade, coins pile high and many prizes topple off the sides. She wants a power or button to grab something or do something about it (a rescue). (She was imagining this; it didn't actually happen.)
  - **Decided (Nov 12):**
    - **Paw save** for cascades: a prize glows as it tips off a side; tap it and the paw flicks it back; a few saves per round.
    - **Claw:** later, for a still, calculated board (not a moving one).
    - **Hug** (Ragdoll): later. Both claw and hug are wanted for other games.

## Design principle (Jenny, Nov 12): feel, not just look
Every change in the game should be felt as well as seen: through sound, rhythm and motion, so it's intuitive. Example: the pusher has a rhythmic sound, and during turbo the beat speeds up, so you know without reading. "It's a vibe, it's a feel, not just a look."

## Game structure idea (Jenny, Nov 12)
- **Game modes:** different game modes like Wild 2, each with its own goals. You visit them to collect the ingredients for the food that attracts each cat.
- **Big payoff:** collect enough cats and there's a big payoff, such as a really special cat, or all the cats doing a big cat dance (in the spirit of the old Hamster Dance web page; our own music and art).
- **Side games:** she wants at least 3 more side games as good as the Dance break.
  - Order: Treat toss (CP-41, building), then Laser chase, then Pet the cat.
  - In the final game each mode will probably be run by a different cat. For now, the Tuxedo runs them all.

## Idea (Jenny, Nov 12): tower wall
Not just single stacks: 4–5 tall coin towers side by side, with prizes perched on top. They often topple sideways, so a prize up there is hard to get. Maybe you have to win it through another mechanic (her message was cut off; candidates: the claw, Laser chase, the Quake, the wheel).

## Design rule (Jenny, Nov 12): never cover the cat's face
Wheels, cards, banners and pop-ups sit over the board, below the chin. (The win card was moved for the same reason.) Nothing sits on the face for any length of time, **including the visiting cat card**. A brief flash, like a callout passing over, is fine.

## What brings Jenny back (brainstorm, Nov 12): capture all, pick later
Everything here is inspiration, never a copy. The core genre is the coin pusher; the other concepts are borrowed ideas, built our own way.

1. **Team wars.** She played one game for years because she was on a team. The team would declare war, she had to be available at a set time (a commitment), everyone played their own boards at once, then you saw who won what. Unlikely for CatCoin, but kept as a concept. It kept her engaged for 5+ years: "a small commitment, but steady." She can't remember the game's name. *Hooks: belonging, appointments, social comparison.*
   - **Teams:** create a team, join one, or request to join. Jenny doesn't want to troubleshoot the server side herself; Claude could probably handle it.
   - **Needs:** a way to join a team with strangers, since many players won't have friends playing, and a team chat or at least a message board. *Cost note: this needs a server, accounts and moderation, a big step up from today's offline game.*
2. **Weekly event with set goals** (example: Family Island). You get a week to reach a set of goals. When the week ends, it stops whether or not you finished, resets, and gives you a different board to play. *Hooks: deadline urgency, fresh content every week, a clean restart.* *Fit: a weekly Wild-style event board with its own prize list could suit CatCoin, and it needs no server beyond the update file.*
3. **Real prizes you take out of the game.** The only one that worked for Jenny: winning screens you could download and use as phone wallpaper. *Hooks: a reward with value outside the game.* *Fit: strong. Cat album photos or finished collections could unlock a wallpaper of that cat to save to the phone.*
   - **Jenny:** it has to be really nice artwork, not game-themed. Wallpaper you'd actually want. The game: **Neko Atsume: Kitty Collector**, the same game as the food-attracts-cats idea behind the Porch. So both the Porch and wallpapers come from one game she loved. Inspiration only: CatCoin's porch, cats and art must be our own, not a copy of its yard, cats or look.

## What Jenny enjoys and dislikes (reference)
- Enjoys: collecting (rubies; Family Island's shovels, picks and keys); keys and chests; small side games; the moment a collection fills in; looking at her inventory; solving a hard board and seeing something new.
- Doesn't care for: browsing finished collections, storylines, card collections with weak payoffs, games that wall you off by time, constant ads (Coin Dozer, Family Island).
