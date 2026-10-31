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

## What Jenny enjoys and dislikes (reference)
- Enjoys: collecting (rubies; Family Island's shovels, picks and keys); keys and chests; small side games; the moment a collection fills in; looking at her inventory; solving a hard board and seeing something new.
- Doesn't care for: browsing finished collections, storylines, card collections with weak payoffs, games that wall you off by time, constant ads (Coin Dozer, Family Island).
