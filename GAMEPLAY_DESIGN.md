# Cat Coin Pusher: gameplay design

Living design doc from Jenny's gameplay sessions with the PM (started Oct 19, 2026, dictated). Decisions here become
CP-xx tickets on the CoinPusher Board. Open questions stay at the bottom until Jenny decides.

## Core concept: CatCoin (CP-23; updated Nov 12, 2026; DRAFT for Jenny's review)

Status marks: **Built** = in a UAT build now · **Decided** = Jenny agreed · **Proposed** = PM suggestion · **Open**.
Working notes with everything Jenny said: `tickets/CP-23-notes.md`.
**Jenny reviewed this section Nov 13 ("you caught the right vibe").** How the pieces fit (screens, chain, goals,
winning): `GAMEPLAY_MAP.md` (draft Nov 13).

### 1. Pitch
A busy, noisy coin pusher where every board is a short, wild round with a clear goal. Short side games break in
mid-round, and the prizes you win become food that attracts visiting cats to your porch. Their photos fill your cat
album, and a full album earns the big payoff: all the cats dancing together.

### 2. The shape of the game
```
Pick a game mode ──► play a round (about a minute) ──► win prizes and ingredients
      ▲                                                       │
      │                                                       ▼
 new modes open ◄── cats visit the porch ◄── cook a cat's food, set it out
      │
      └──► enough cats ──► the big cat dance (and later a very special cat)
```

### 3. A round (Built, in Wild 2)
- **Start:** a goal card states the goal, e.g. "Collect all 7 prizes", explains the round's features, and has a big
  TAP TO START. The timer starts only after 3-2-1-GO.
- **During:** a crammed board of prizes, rain coins (5/10/25), bonus drops from the sky, toppling coin towers, the
  Quake, and turbo pusher in the last 25 s. Music plays throughout, and the pusher has a beat.
- **End:** you win if you meet the goal, and the cat dances, then a visiting cat may appear. You lose if the time or
  the coins run out ("Time's up!" / "Out of coins!"), with Play again.
- **A star prize** (coming in UAT 43): one prize you specifically need, placed hard to get.

### 4. Game modes (Decided: modes, each with its own goal and featured side game)
Each mode shares the Wild 2 baseline and adds its own goal, its featured side game, and later its own cat.

| Mode | Goal | Featured side game | Cat (later) | Status |
|---|---|---|---|---|
| Wild 2 | Collect all the prizes | Dance break | Tuxedo | Built |
| Kitchen (working name) | Cook one recipe, e.g. 3 tuna + 3 carrots + 3 eggs | Treat toss | Orange cat | Building (CP-41) |
| Laser mode (name open) | Open | Laser chase | Open | Proposed |
| Cozy mode (name open) | Open | Pet the cat | Ragdoll? | Proposed |
| Normal boards 1–3 | Clear the board | none | Tuxedo | Built; their future is Open |

### 5. Side games (Decided: at least 3 more as good as the Dance break)
What makes one good: it's short (about 9 s), started by a coin on the board, uses one simple gesture, every tap gets
a hit or miss you can feel, and the reward pours back onto the board. The round timer pauses, and a win waits until
the side game ends.

| Side game | Started by | Gesture | Reward | Status |
|---|---|---|---|---|
| Dance break | Happy meter (each prize adds a notch) or the music-note coin | Tap on the beat | Banked coins pour down; perfect = tap to spin the wheel | Built |
| Treat toss | Fish coin | Tap treats in the air | Ingredients and prizes | Building |
| Laser chase | A coin (Open) | Drag a laser dot; the paw chases it and swats coins and prizes | What the paw knocks off | Proposed |
| Pet the cat | A coin (Open) | Stroke the head, tap the ears, stop at peak purr | Coins and a rare album pose | Proposed |
| Paw save | Any prize tipping off a side | Tap it while it glows | The paw flicks it back (3 a round) | Decided (CP-40) |
| Claw, Hug | Later, other modes | Claw: still board, calculated; Hug: the Ragdoll blocks the gutters | Rescues | Decided for later |

**The wheel** (perfect dance): tap to spin. Every slice is an event: Rain 25, Rain 10 + Quake, a prize you need,
Jackpot 50, Dance again, or Yawn (the cat stretches and swipes things off the sides). Jenny likes the Yawn.
Needs new art: the yawn face and stretched paws.

### 6. Cats, food and the porch
- **Porch (Decided):** set out food or toys, and cats visit during play and while you're away (a bonus, never a
  wall). You photograph them into the cat album. First version: 2 spots, 4 visitors, 2–3 photos each.
- **Recipes (Proposed):** prizes are ingredients. Collect a recipe, spend coins to cook it, and set it out to bring
  that cat. Kitchen mode is the first test.
- **The big payoff (Decided, idea):** enough cats, and they all dance together (Hamster Dance spirit, our own music
  and art); later, a very special cat.
- **Real-world prizes (Idea):** beautiful wallpaper art to save to your phone. It must be genuinely good art, not
  game screenshots.

| Visitor | Personality | Favorite treat | Favorite toy |
|---|---|---|---|
| Orange cat | Goofy, "orange cat energy" | Tuna | Yarn ball |
| Ragdoll | Calm, floppy, fluffy | Cheese | Cushion or blanket |
| Siamese | Loud, clever, wants attention | Shrimp | Cat bell |
| Tortoiseshell | Fiery, independent | Toy mouse | Rubber duck |

### 7. Design rules (Decided; 8-12 added Nov 14)
1. **Feel, not just look.** Every change is felt through sound, rhythm and motion. Text is the backup.
2. **Never cover the cat's face** for more than a moment: cards, the wheel and the visitor card go below the chin.
3. **Every tap has an outcome** you can see and hear, hit or miss.
4. **Once a side game starts, you finish it,** even if the round is won meanwhile.
5. **Busy is good:** a board crammed with prizes is fun. Cut plain coins, not prizes, when the phone needs it.
6. **Inspiration, never copies:** the coin pusher is the genre; ideas borrowed from other games are built our own way.
7. **Build fast, then react:** prototype boards first, polish what Jenny likes.
8. **One clear main action per screen.** Everything else visibly secondary but easy to find; never goal + start +
   navigation at equal weight. (Nov 14)
9. **You can always find your way.** The main places are one obvious tap away from any screen; buttons name their
   destination ("Board", "Kitchen"), never "Exit"; no dead ends. (Nov 14)
10. **Every element earns its place.** A meter, label or button that doesn't make its purpose clear through play gets
    clearer or goes. (Nov 14)
11. **Nothing overlaps.** UI pieces never sit on each other on any phone size; checked before publishing. (Nov 14)
12. **One word, one meaning.** E.g. "Level" means one thing only; each reward comes from an action that makes sense
    (cooking advances cooking or cats, not the board level). (Nov 14)
13. **Every sound comes from something you can see happen.** No sound without a matching action on screen. (Nov 14)

### 8. What brings players back (brainstorm; pick later)
Team wars (a team, a set time, comparing results; needs a server; kept as a concept), weekly events with set goals
that reset, real prizes such as wallpapers, and "a small commitment, but steady".

### 9. Open questions (superseded Nov 13: GAMEPLAY_MAP.md answers these; its section 10 holds the live questions)
1. Do recipes stay a step, or do prizes go straight onto the porch?
2. Does a cat's visit unlock a mode, a power, or both?
3. Which mode is home, and what happens to normal Boards 1–3?
4. Goals for the Laser and Cozy modes; trigger coins for their side games.
5. How the player picks a mode (a map, a menu, the porch).

## Goal

**Ship Cat Coin Pusher on the Google Play Store.** Recapture a coin pusher Jenny loved and lost (**Bear War Online**,
熊ちゃん戦争-オンライン, ~2011, found in her purchase history Oct 19; it had weapons, items, bosses and ratings,
updated from a server; store page gone: a wild creature with big wonky rectangular teeth, funky prizes dropping onto the
board, chaotic and fun). We can't copy it, so the test is her taste today: does a build make her want to keep playing?

### What Bear War Online looked like (developer's slide, Oct 19)

Four boards, each its own world: bamboo forest with a panda, ice with a polar bear, a cave with a brown bear, a
starry night with a king bear in a crown. A big bear sits behind each board, like our cat, and its paw reaches over
the board (the king bear's paw is slamming down). Deep piles of gold **paw-print coins**. Mixed in: colourful
character tokens (chip-like coins with faces), a big "10" coin, a watermelon slice, a blue spider creature walking on
the coins, a yellow bird in a party hat, and a small bear figure at the front edge. Lush, busy, colourful.
Our game already shares the core look: a big animal behind the board, paws, paw-print coins.

Also released as **Coin Push Pro - iBear Story** / **Bear Coin - iBearStory** (Unity3D, ~2011, developer claims 500k+
downloads and #1 Entertainment). Its cover art shows the bear with **big wonky teeth**: that's the creature Jenny
remembers. What sources say it had (a 2011 listing, the developer's slides, player comments; thin and partly
promotional):
- Prizes pushed into your hands: mushroom, melon, a bear, "mysterious gifts and surprises"; collect as many as possible.
- Collections and Game Center achievements.
- Coins and prizes pushed off the sides (or back down "the chimney") are lost.
- A **sliding bear ring** on the board that prizes can pass through or get stuck in.
- When you run out, more coins appear in a **New Year's (red) envelope**: the refill.
- Different scenes (boards); free coins for installing partner apps (its monetisation).
- Android version: **Bear Coin - Cooco Bear** by red-infinity, v1.1, Nov 16, 2011 (Android 2.1+, soft112.com listing):
  "awesome realistic physics", "high quality special effects", lots of collectible prizes, mystery gifts, refills.
- Cover art (Coin Push Pro): the bear with big wonky rectangular teeth (one gold), tongue out, crown askew, the blue
  spider on its head. Small print, partly legible: "Free coins every 30 seconds of play and every 5 minutes while
  away!": coins refill while you play and build up while you're away (matches pillar 2).
- Players called it "best coin push game on iPhone".
- **What the gameplay video shows** (Chinese title 小熊推币, "Little Bear Coin Push"; PM's frame-by-frame look, Oct 19):
  - HUD: big number top centre is probably your **coin purse** (42,039 to 42,302 in some clips; 00221 to 00285 in
    others, likely a different save). A **small number beside it** (seen 26, 25, 23, 22, 09, 08) changes between
    frames: likely the **countdown to the next free coin** (the cover promises a free coin every 30 s of play).
    So not endless coins: you spend from the purse, and it refills on a timer, likely also while you're away (every
    5 min per the cover) up to a cap. Matches our pillar 2 and "progression = a growing coin cap".
  - Also in the HUD: **Coin Shop** button top left; **Prize** button top right; help and settings icons.
  - **Four little coin slots on the bear's forehead**, just under the counter, on every board; some frames show them
    gold, some pale. PM guess: a 4-step meter that fills with special coins or events; when all four fill, something
    big triggers (the wheel or Coin Waves). An always-visible "almost there!" (unconfirmed).
  - A **vertical meter on the left** with a percentage (61% to 75%, seen up to 98.8%) and a **player level** below
    it (LV.022, LV.029): likely progress to the next level, filled by "+5"-style points from coins and prizes
    falling in. You level up as you play. The bar runs green at the bottom to red at the top, and the level icon
    above it glows red as you near 100% (ice world, LV.022 at 98.8%, with a big "+5" floating up at the front edge).
    Same frame: a striped drum-shaped prize in the pile.
  - **LEVEL UP!** moment: the whole board dims, and a golden starburst with the bear's winking face and "LEVEL UP!"
    fills the centre. A big pause-and-celebrate beat in the middle of play. Ours: the cat's face in a starburst, a
    happy chime, maybe the dance.
  - A **column of round bear-face icons down the right side**, some with red count badges: likely collections or
    stored power-ups.
  - A little green dinosaur/crocodile icon at the left: a helper or power.
  - The bear behind each board grips the board's edges with both paws (like our cat). Boards change scene: forest
    king bear, polar bear on ice, panda under a starry sky.
  - Special items in the pile: silver bear-face coins, a blue spider creature, big paw coins, candy-striped prizes.
  - A small bear peeking out of a hole at the front edge, with a big green **"GREAT"** pop-up when something lands:
    probably the "sliding bear ring" that catches prizes. A gameplay video exists: youtube.com/watch?v=stSgeJD2wUE

## Pillars

1. **Satisfying just to watch and hear** ("game feel"). Like Tetris or watching Windows defrag: it must look, sound
   and feel good. Every feature should add to this, never clutter it. Directions: clinks that scale with impact,
   cascades and chain reactions, a buzz when coins hit the tray, a beat on big drops. **The pile is never still**
   (Jenny, watching Bear War in slow motion with no sound: "it just looks magical"). Corrected: not every coin moves
   all the time, but **something on screen is always moving**: usually some coins, the ring sliding back and forth at
   the front, and an **animated background** (e.g. smoke or fire billowing around the edges of the board). Ours
   should feel alive even between taps: idle motion in the scenery (falling snow, flickering fire, drifting stars,
   swaying leaves), the front target moving, the cat blinking and breathing. **Every coin that falls over the edge
   has its own falling sound** (Jenny): a stream of drops becomes a satisfying patter of individual clinks, not one
   generic sound. (PM: vary pitch and timing slightly per coin so ten coins sound like ten coins, not a repeat.)
   **Every bonus or message has its own little music clip** (Jenny): a short jingle or sting for GREAT, PERFECT,
   BONUS EXP, NEW AWARD, LEVEL UP, FELL OFF, the wheel and so on, so you can hear what happened without looking.
   (Needs royalty-free or original audio cleared for a commercial Play Store app.) **Every tap makes a sound**
   (Jenny): instant feedback that the game picked up your tap (plus a tiny buzz on the phone). PM: different taps
   can sound different (dropping a coin vs. tapping a paw vs. aiming the claw).
2. **Play in sessions, come back to rewards.** Waiting is part of the fun: it gives a natural stopping point and a
   reason to come back. Coins refill slowly over time up to a cap, like classic coin dozers.
3. **Lots of boards, short bursts** (like Pixel Flow): win a few boards a day; new ideas introduced now and then;
   some boards are hard, and you keep coming back until you solve them.
4. **A world around the boards** (like Family Island): a home base, the current set of boards, a special place for
   rare rewards or one-off chances; side activities that feed the main game; goals at two speeds (timed events,
   long-term collections).
6. **Fun before understanding** (Jenny, Oct 19: "I never really figured out how to play the game, and yet I still
   enjoyed it"). Tapping and watching must be fun on its own; the deeper systems (levels, prize upgrades, powers,
   worlds) are there to discover, never required to enjoy it. No tutorials needed to have a good time. Depth unfolds
   over months (Family Island: Jenny had no idea what was going on for about a year, then learned the ins and outs,
   and that became part of the long-term pleasure).
5. **Chaos with clear payoffs** (from the lost game; Jenny: "that is what was so fun"). Several things happening at
   once (a NEW AWARD banner, COIN WAVES, GREAT!, floating +5s, coins flying) is the joy, not a problem to tidy up.
   With play you learn to spot what matters to you in the chaos; so each thing worth chasing needs its own
   unmistakable look and sound (the blue spider coin, the rainbow coin, the big 10).
   Original note: funky prizes drop onto the board at random; it can be hard to
   tell what caused what, but it's always clear when you've won something. The cat goes wild sometimes (Quake).

## Decisions

- **Board 3's towers are dropped for now** (Jenny, Oct 26): wrong coin style, never looked right, and never meant to
  be just two. Towers get rebuilt later as new stacks with the new coins. **Keep the topple physics** (the one part
  that was good: UAT-16's tipping impulse and split-into-real-coins). Board 3 starts with CP-21's straight rows.
- **Codex stays the engineer** (Jenny, Oct 26); Claude stepped in only when Codex's image mockups went wrong.

- **Flatter board, like Coin Push Pro** (Jenny, Oct 19, comparing our UAT 2026.10.17 UAT 3 with Bear War): ours looks
  too stretched, especially at the bottom of the screen. Ours has a steep perspective: the table narrows sharply
  toward the back, front coins look much bigger than back ones, and there's empty space beside the table. Bear War
  looks more top-down: coins nearly the same size front to back, the table fills the screen's width, many more coins
  on show. Direction: a flatter camera, a wider table filling the width, smaller coins so more fit. **Paws rest on
  armrests either way** (Jenny): a throne or a cat tree. Ticket: **CP-21** (mockups first).
  **Table shape** (Jenny's count, not sure yet if it matters): iBear's table is narrow at the back (about **4 coins**
  across beside the pusher) and widens to about **6 coins** at the front edge, a funnel opening toward the player.
  Ours is the same width all the way (**6 at the pusher, 6 at the front**). PM: a narrow back packs new coins tightly
  where they land (more pushing power, more tumbling); a wider front spreads the pile out so more coins teeter on
  the edge at once, and changes how much reaches the gutters. Worth trying in CP-21's mockups.
  **CP-21 first mockups (Oct 19), Jenny's verdict:** the paws shrank (the big mitts she worked hard to size must
  stay their approved size: fit the armrests to the paws), and the coins got too small to aim at with a tap (keep
  coins near today's size; fewer coins is fine). Kept: the flatter camera, a wider table, the teal-and-brass armrests
  with paw emblems and the sisal cat-tree posts (both liked), and the messier pile with a stack.
  **CP-21 second round (Oct 19), Jenny's notes so far:** empty sky beside the table is fine (room for buttons and
  side controls later). Front paws best in version 1 (armrests), then 3. **The table must reach right up to the
  cat's chin** (no gap between head and table); narrowing toward the top is fine. Version 3 is best on that.
  Hind feet: waiting for Codex's next pass.
  **Round 2 verdict:** the belly-up version is best overall. Front mitts stay exactly as they are. No visible belly or
  body fur (doesn't appeal). Mitts should sit further apart and maybe higher: either bring the arms back, or narrow
  the table under the chin to ~4 coins (iBear funnel) with something for the mitts to rest on. Hind feet are in the
  right place but don't look like the same cat: their soft, realistic toe beans clash with our exaggerated blocky
  claws and eyes; restyle them chunky and angular to match. Round 3 brief: tickets\CP-21-redo-3.md.
  **CP-21 parked (Oct 19):** rounds 3–4 (funnel table, small three-claw hind paws) made it worse: the funnel read as
  a long bowling lane and the hind paws kept landing on the table. Jenny: "I don't think any of it's an improvement."
  Nothing approved; the game is unchanged. If revisited (maybe with a Claude engineer), start from today's layout and
  change one thing at a time. (Overlaps the
  "Wider table at the back" idea; a camera/layout change, so mockup first and expect rebalancing.)
- **Players instinctively tap the paws** (Jenny, watching a Bear War player on YouTube): the player keeps tapping
  the bear's paws and nothing happens. The paws are so cute that tapping them is instinctive. Ours responds to that
  instinct: the tickle, the toe-beans combo, and later the
  head and ears ("Pet the cat"). Evidence that paw reactions are worth the effort.
- **Keep our treat art** (Jenny): the shrimp and cheese (and tuna) look great as they are. (PM: they're realistic,
  while Bear War's prizes are goofy characters with faces. Both can work: treats stay realistic as the board's
  targets, and the wacky-faced style goes to charms and special prizes. Decide in discussion.)
- **Keep our cat and its claws** (Jenny, Oct 19): they're cute; the pose just needs some refining (see "Cat on a
  throne"). Specifically the **Waiting pose's paw placement** (the toothy grin shown during play): the paws sit
  half off-screen at the edges, low beside the table, and don't look placed right. The bigger gap is that **the whole screen needs a lot more going on**: scenery motion, specials,
  messages, a moving target, the cat reacting.

- **No color matching or sorting mechanics.** It stays a physical coin pusher.
- **Progression = a growing coin cap.** Raising your cap is an achievement; a bigger cap makes harder boards doable.
- **Every board is solvable**, at a mix of difficulties. Some boards can't really be won until you have something
  from elsewhere (more cap, an item); the game hints at it ("it would be nice to have a flower..."). Play other
  boards meanwhile; it becomes a goal.
- **Coins can be lost** off the sides (gutters).
- **Gentle pacing is OK.** Family Island steers pace (everyone gets the same boards and events; rewards speed up or
  slow down). Knowing it bothers Jenny a little, but she keeps playing for years. We use a light, honest version:
  rotating boards so you can't burn through everything, and a gentle helping hand when you're stuck.

## Games Jenny loves (reference; full running list in OneDrive\work\GAMES_I_LOVE.md)

Pocket God (poke the little islanders and see what happens), Pixel Flow (many short boards), Family Island (islands, home base, side games, collections, timed events), the
original Facebook-era farming game, The Sims, an island game with puzzles, searching and building (name forgotten),
Tropico. Common thread: building up a place, exploring, activities and achievements over a long time.
**Decision:** building a place (farm, home, island) is *not* for Coin Pusher; that's a separate future game. Coin
Pusher focuses on what makes a coin pusher itself great. Jenny doesn't get into most coin pushers, so the open
question is what made the lost one special.
- **Purchases: optional, cheap, never in your face.** E.g. a coin refill. No clutter, no nagging. Not built yet, but
  the game is designed with a proper place for a shop so it can be added for the Play Store (future-proof).

## Ideas in discussion

- **A grabber that drops in like an arcade claw machine** (Jenny, Oct 19): in Bear War the blue spider drops down
  and grabs a prize. Ours: a robotic claw on a wire (PM alt: a cat toy on a string). **Decided: we want it.** It's
  a collectible power with a count badge (Bear War's spider icon shows "0"): earn them, tap to use. Then it grabs a
  prize, carries it forward and drops it into the tray. **Control (Jenny decided):** the claw sweeps left and right;
  **tap 1** stops it sideways and starts it moving forward (back toward the front); **tap 2** drops it. Two timing
  taps, like a real claw machine: a little tricky at first, mastered because you choose to use it. A short hint on
  first use (e.g. "tap… tap!" on the claw) keeps it from feeling broken.
  **How Bear War's spider actually worked** (Jenny, from a clearer video): the spider comes onto the board near the
  front; you **tap where you want it** and it moves there; **tap again** and it drops, grabs and rises; it then
  carries the prize **straight forward to the middle** and hovers; it only lets go when you **tap a third time**,
  so you can **aim the release at the ring**. (Open: keep Jenny's sweep-and-tap version, or this tap-to-aim one.
  The grab-then-aim-for-the-target step is the key idea either way.)
- **"GREAT!" pop-up** (Jenny likes): when a special coin falls into the tray (here a green coin with a bear face), a
  big green "GREAT" with a peeking bear pops up where it fell. Praise words for good drops. **Escalating tiers**:
  green "GREAT", then orange "PERFECT" moments later as more falls in (likely for bigger or consecutive drops).
  Ours could climb e.g. "Nice!" → "Great!" → "Purrfect!". Same frames: silver coins with swirl designs and silver
  face coins (polar bear) mixed in; the little bear at the front edge has big teeth too.
- **A very clean board at the start** (Jenny, early-game clip, LV.008): coins laid out in neat, even rows across
  the whole table, with just a couple of special coins in it. Order first, then you break it into chaos: the
  Tetris/defrag satisfaction in reverse. (Same frame: tree and spider powers each start with **2** in stock; the
  forehead slots show one filled and three empty, supporting the 4-slot-meter guess.) **The real start screen**: the
  board is dimmed and a little wooden **"TAP HERE"** sign hangs over the drop zone by the bear's mouth. Tapping it
  just **starts the game** (wakes the board up). It's purely a start button: it isn't where you tap during play and
  teaches nothing. Ours: a cute start sign (maybe held by a paw).
- **Always ~5 special items in play** (Jenny): at any moment there are about five special things on the board
  (prizes, coloured or silver coins), so there's always something worth chasing.
- **Every special drop gets a colourful message** (Jenny): e.g. a blue **"BONUS EXP"** (EXP = experience points,
  which fill the level meter) next to a green "GREAT". Ours: a message for each kind of special drop, so the player
  learns what each thing gives just by playing.
- **"NEW AWARD!"** (Bear War): a big banner over the bear's face, probably when you win a prize you've never had
  before (a first for your collection). Can stack with other announcements ("COIN WAVES" at the same time).
- **Floating "+5"** (Jenny likes): when things drop over the front edge, the points float up from where they fell.
- **Bear pound = a wave through the pile** (Jenny, at 0.25 speed): the forest bear pounded its paws and all the
  coins moved like a wave rolling across the board. That's our CatQuake's job: the slam should send a visible
  ripple through the whole pile, not just jiggle it. (Same frame: a blue ice-crystal prize in the pile, and the
  spider button now shows a green "1": one spider in stock.)
- **Paw drumming** (Jenny): the coins shake because the bear pounds its paws on the armrests/throne, and not always
  together: sometimes one paw, then the other. Very cute. Ours: the cat drums its paws (left, right, left) on the
  armrests now and then, nudging the pile with each thump (ties to the "cat on a throne" idea and the Dancing pose's
  paw pumps).
- **Coin waves** (Bear War): looks a bit like our Quake. Jenny loves its **announcement**: a big "COIN WAVES" title
  pops up with the laughing big-toothed bear's face beside it while coins fly everywhere. Do the same for CatQuake:
  a big "CATQUAKE!" banner with the cat's face.
- **Sideways push, seen** (panda board): the bear reaches its big paws right down onto the board and shoves coins
  sideways into the gutters, pulling a **grimace** (Jenny: "hilarious"). Ours: the cat's paws come down and sweep
  sideways with a guilty "oops" grimace (a cousin of our Paw Sweep, aimed at the gutters). The face sells it.
  Every world's bear has the same push pose and grimace (seen on the polar bear too): one shared move, redrawn per
  character. Ours: each cat gets its own version of the same sweep. The message isn't "fail": a grey, ghostly
  **"FALL OFF"** with a sad little ghost bear appears over the gutter side, and the big bear **cries** (tears in its
  wide eyes). Ours: a ghostly "Fell off!" with a sad ghost kitten, and the cat tearing up. **Triggered by the prize wheel** (Jenny saw it in
  the video): several wheel segments show this grimace face, so landing on one sets off the push into the gutter.
  That's the wheel's "oops" segment, confirmed. Two consecutive frames: the arrow stops on a **big-toothed grimace**
  segment, then the brown bear's paws come down and push. About 6 of the wheel's ~16 segments are that grimace face,
  so roughly a third of spins are an "oops": real risk. The other segments are character faces (panda, polar bear,
  spider, others), presumably rewards. (Jenny: the crooked teeth she remembers were mostly the **app icon/cover**
  bear; the grimace shares the big-teeth look.) Jenny thinks a "fail" message shows during it
  (watching for it).
- **Sideways push** (Jenny likes): like a push, but sideways, so everything goes into the gutter. A sad thing to get
  as bad luck, and also a tool: push an *unwanted* prize into the gutter on purpose. Implies some prizes are ones
  you don't want.
- **High-bouncing coins** (Jenny LOVES): coins fly high in the air, bounce sideways, flip and tumble on edge before
  landing; lively, every which way, not flat. (Ours mostly slide; a big pillar-1 item.)
- **Switchable worlds** (Jenny's read of Bear War): four boards, each a whole world with its own bear: a cave
  (brown/wood, rocky), a starry night (king bear), snow and ice (polar bear), green bamboo (panda). The round bear
  icons down the right side may switch between them: one on screen, three to choose from. Ours could be one cat
  per world, or the same cat in different settings; Jenny suggests a **lava/fire** world in place of the cave.
  **Jenny's direction: one cat per world**: the **tuxedo** (our current cat), a **ragdoll**, an **orange cat**, and
  a fourth: Jenny leans **Persian** (PM: silver/grey, so it doesn't look like the cream ragdoll; alternatives Siamese
  or calico). PM's proposed pairing: ragdoll = snow and ice; orange = lava and fire; tuxedo = green garden/bamboo
  (home); silver Persian = starry night, on the throne with a crown (the king, like Bear War's king bear).
  **Structure (Jenny, Oct 19): four cats = four worlds, each with its own set of prizes to collect.** In Bear War's
  forest scene, a forest/tree **side button** shows "0". Correction (starry-night frames): the same tree and spider
  buttons appear on every board, so they're **powers you carry everywhere**, not per-world counters. The three bear
  faces above them are likely the other worlds to switch to. Also: the "crown" over each bear is the frame of the
  coin counter, not a king. Bear War's four boards (names unknown): brown bear in a rocky forest, polar bear on
  ice, panda in bamboo, a bear under a starry night. (The leaf
  card's "duration of tree" suggests the tree is also a power; maybe each world's collection feeds its own power.
  Jenny's guess: the tree power runs on a timer, and each leaf level adds 4 s to it, up to 20 s.)
  **Solved (Jenny):** what looked like clouds moving up the sides are **logs rising to form side rails**, so
  nothing can fall into the gutters. That's almost certainly the **tree power**: temporary walls over the gutters
  for a few seconds (longer with the leaf charm). Ours: a cat-themed version, e.g. cushions, a row of sleeping
  kittens, or cat-tree posts that pop up along the sides.
  **Jenny's idea (leaning, not final): a collection for each cat's world** (Bear War seems to have one shared tree).
  PM: works well for us: each world gets its own themed charms (snow world: a mitten, a snowball with eyes; fire
  world: a toasted marshmallow), a reason to visit every world, and a natural home for the coloured world coins.
  **Accessories (Jenny):** Persian wears a crown or tiara; tuxedo wears a bow tie; orange cat = fire world for sure;
  ragdoll undecided (PM ideas: a knitted scarf and earmuffs for the snow world; orange cat could have flame-tipped
  ears/tail or a firefighter helmet).
- **Prize collection screen** (Bear War, PM's read): a garden-like screen showing every prize you've collected
  (watermelon, yellow bird, paw, mushroom, leaf creature...), each with a count of how many you hold and a coin value.
  Tapping one opens a card: e.g. **"LEAF, LV. 4: Increase the duration of tree. Additional 4 s per level, up to
  20 s"** and **"Sell for 5 coins"**. So prizes **level up** (more copies = higher level), each **upgrades a power**
  (the leaf makes the "tree" power last longer; the tree is one of the right-side icons), and spares can be **sold
  for coins**. This answers "what are prizes for": a collection that makes your powers stronger.
  A second card: **"WATERMELON, LV. 3: When a silver or bigger coin is earned, there is a chance to generate a prize
  at once. 5% per level, up to 25%."** So each prize is a **passive perk** (like a charm) with up to 5 levels: the
  leaf boosts a power's duration, the watermelon gives a chance of a bonus prize. It also confirms **coin tiers**
  (gold, then silver and bigger). A third: **"CHICK, LV. 6: Chance to get a coin when a special coin drops to
  gutter. 10% per level, up to 50%."**: a consolation charm that softens losses to the gutter. (Lv. 6 with a
  4-segment bar: the bar is probably progress to the next level, so levels go past 5.) A fourth: **"HONEY JAR,
  LV. 2: Less coins needed to generate a prize. 1 coin per level, until Level 5."** So **a new prize appears after
  every N coins you drop**, and this charm lowers N. That may also explain the small number beside the coin purse
  (26, 25, 23, 22...): a **countdown of coins until the next prize drops onto the board** (A fifth charm: **"CRYSTAL
  PAUL" (a one-eyed blue blob), LV. 2: "Chance to catch back the special coin and prize [that] drop to [the
  gutter]. 4% per level, up to 20%."**: a rescue charm. A sixth: **"BEAR"** (a teary bear sucking a lollipop), shown
at **LV. 0** even though the tree seems to show copies held (24, worth 120). So holding copies doesn't level a charm
by itself; something else has to (maybe spending coins or copies, which fits Jenny's "choose what to level up"). Also on the tree: a "Bear Story" book, maybe a story or
  album to unlock.) Rather than a free-coin
  timer (either reading fits). **Each prize on the tree shows two numbers** (Jenny spotted): how many you hold, and
  beside a paw coin, their total sell value: always held × 5 (17 → 85, 39 → 195, 13 → 65, 24 → 120, 10 → 50), since
  each sells for 5 coins. Keep copies to level the charm, or cash spares in when you're low. **Jenny's idea:** once
  you've earned enough coins, *you* choose what to spend them on: which charm or power to level up. That gives coins
  a second purpose beyond dropping them (open question answered: "what are coins for"), and a real choice: spend
  now to get stronger, or keep them to play. **Rule (Jenny): prizes are earned through play, never bought.** You
  only get a charm by winning it on the board (pushing it into the tray, the claw, the wheel, clearing a board);
  coins then level up charms you've already earned. Exactly which actions earn which prizes: open. The collection screen is a big tree with all the prize characters on it (a
  one-eyed blue creature, a bear hugging the trunk, a fish, the leaf...), each showing how many you hold and its
  coin value. Our version: a cat tree or scratching post holding the charms? **Tone (Jenny):** the tree scene is
  wonderfully *wacky*: a fish, a crying bear hugging the trunk, a mushroom with eyes, a one-eyed creature. Every
  prize is a goofy little character with a face and an expression, not just an object. Ours should be just as weird
  and funny (e.g. a startled sardine, a yarn ball with googly eyes, a cucumber with attitude). The **gold bear ring**
  seen in the pile earlier also sits on the tree, so it's one of the collectible prizes/charms too.
- **Picture coins** (Jenny): special coins with a picture on them that give you that thing when they land in the
  tray. E.g. a coin with a **grabber claw** picture earns a claw. (Like Bear War's face tokens and our planned Quake
  coin.)
- **Coin varieties** (Jenny loves): among the gold paw coins: a **rainbow paw coin**, a **blue coin with three paws**,
  a **blue spider-face coin** (likely earns a spider/claw), **silver coins with character faces**, and a big **gold
  ring with a face** (a ring-shaped prize, "the gold bear ring"). Variety in colour and shape makes the pile
  exciting to scan.
- **Powers column** (Bear War, tree-stump board): down the right side, character icons on top, then a **tree** power
  and a **spider** power, each with a red count badge (0 when you have none).
- **Coloured coins** (Jenny noticed): a blue coin marked something like "51" among the gold; at 0.25 speed it reads
  **"15 ICE"** (so likely the same coin). Theory: coloured coins belong to a world (blue = the ice world), earned on
  other boards and counting toward that world, e.g. unlocking it or its prizes. That would tie the four worlds
  together: playing one world earns you something for another (fits "a board you can't win until you get something
  from elsewhere").
- **Multi-coin drops** (Jenny likes): sometimes five coins fall at once instead of one.
- **Prize wheel** (Jenny loves it): a big wheel spins over the board with a STOP button in the middle; each segment is
  a character face (laughing bears with big teeth, polar bear, panda...). Tap STOP and the arrow picks the reward.
  Ours could use the cat's faces and poses on the segments (art we already have), each segment a reward: coins, a
  coin burst, a big 10 coin, Quake, a claw, Paw Sweep, and maybe one "oops" (sideways push). Trigger: open.
- **Bad prizes?** (PM question, unanswered): junk you don't want (a hairball, a cucumber) that the sideways push clears.
- **A built-in "cheat"** (Jenny, Oct 19): Bear War players shared a glitch: wedge a prize on the bear ring, set the
  phone to never lock, and it paid 5 coins at a time for hours. Ours is deliberate: a secret, discoverable trick
  that feels like a glitch (e.g. a prize balanced in one special spot keeps paying out). Players love finding and
  sharing these (pillar 6). PM: give it a gentle limit so it can't break the coin economy (e.g. pays only while the
  game is open, with a slowly shrinking payout or a daily cap). Our UAT-14 (keep the screen awake) makes leaving it
  running possible.
- **Belly-up pose, defined** (Jenny, Oct 19): reference `Screenshots\ref-cat-belly-up-4.png` is closest: use its paw
  shapes, not its angle; the cat is tilted to whatever angle holds the board right, head at the top facing the
  player, **not tilted**. Front paws = the big mitts, **just hanging over the board, moved up closer to the face**, like the Rest pose. Hind
  paws = relaxed bunny-like feet sticking out at the bottom of the screen, one in each corner, **pads facing the
  player and claws out**; maybe only the toes show. **No tail** (no room).
- **Cat on its back, table on its tummy** (Jenny, Oct 19, wants to use it): the cat lies on its back with the
  coin table resting on its belly; front paws up top as now, and **hind paws coming down at the bottom corners**,
  framing the front edge. A very playful cat pose, and the whole board becomes part of the cat. PM: the hind paws
  can show their toe beans (UAT-20) and be tappable (a bunny-kick reaction); "the tummy trap" is a classic cat joke.
  Mockup first (new art: hind legs, belly edge). **Jenny's direction:** first, the big front mitts back at their
  approved size. Then the **hind paws just sticking up** at the bottom (no full legs needed), shaped like a cat's
  hind feet really are: long and narrow, **like bunny feet**, as big and mitt-like as the front ones. **Subtle, not
  a feature:** they needn't stick out past the table; just a glimpse (toes peeking from behind or under the bottom
  corners) so you get the impression the cat is on its back. Jenny may find a reference photo. **Principle (Jenny):
  natural cat poses only.** Never wrap or bend the cat around the board in an unnatural way; emulate what a real
  cat naturally does (lying belly-up with a toy on its tummy, paws resting on a ledge). **Why the belly-up pose works
  (Jenny):** a cat on its back with all four paws up attacks whatever is on its belly. So the powers come naturally
  from the pose: **CatQuake** = bunny-kicking the table from underneath; **Paw Sweep / push** = front paws swatting
  across it; the **sideways push** = batting it off to the side. The game board is the cat's toy.
- **Cat on a throne** (idea, art pass): Bear War's bear sits on a throne, paws on the armrests beside the board,
  always visible and never in the way. Jenny isn't happy with the Waiting pose's claw position yet; an armchair or
  throne could fix it. Careful with the approved cat art: mockup first. Board idea card: "Cat on a throne".
- **Front-edge ring: IN** (Jenny changed her mind, Oct 19: "it's something to aim for on every play"). Bear War's
  little bear sits in a ring at the front edge, sliding side to side; things that fall into it pay a bonus (and a
  prize stuck on it paid out repeatedly). Ours: a cat-themed target at the front (e.g. a kitten in a basket or a cat
  bed) that gives every drop a goal: aim, push, and try to land coins and prizes in it for a bonus.
  **Jenny's idea: a dream catcher** (with a hole in the middle) instead of a ring, or a cat bed. Drop a special
  **dream coin** through it and it sets off a **dream sequence**: a bonus round. PM sketch: the cat dozes off
  ("Zzz"), the board turns soft and dreamy, coins and prizes drift down slowly like feathers, fish and mice rain in
  as prizes, then the cat wakes with a stretch. Cats sleep 16 hours a day; dreams fit.
  **Jenny: the dream is a little side quest**: still real gameplay, but everything a bit wonky, with an extra payoff
  for meeting goals during it. PM ideas for "wonky" (one per dream, rotating): low gravity (coins float and drift);
  jelly coins that bounce like rubber; the board tilts or slowly rotates; gutters pay instead of losing; the pusher
  runs backwards; everything is upside down. Goals (one per dream, shown at the start, short timer): catch 3 dream
  fish, land 5 coins in the dream catcher, don't lose a single coin. Payoff: something you can only get in dreams
  (a rare dream charm, a stack of big coins, a cat accessory). **First dream quest (Jenny):** catch 3 dream fish with
  the claw grabber and drop them into a **fishbowl at the bottom of the screen**. (Ties the claw, the dream and the
  front-edge target together: in dreams the target becomes a fishbowl.) **Dream pusher = the cat's tongue**
  (Jenny): in Bear War the red pusher sits right under the bear's teeth and reads like its tongue pushing the coins.
  We tried that look with the cat once; in dreams, the pusher can become the cat's big pink tongue. Silly and
  dreamlike, and it keeps the everyday board's approved brass pusher as is. (Jenny, later: in Bear War *every* bear's
  pusher is its tongue; that's where the idea came from. It didn't work for our cat on the normal board: it made the
  cat hard to read as a cat. Keep our pusher.)
- **Long push** (Jenny, from Bear War): sometimes the bear's tongue shoots way out across the board: the pusher
  reaches **2 to 3 times further** than normal for a while, shoving much more over the edge. Ours: a power where the
  brass pusher extends 2–3× its usual reach (in dreams, the tongue version).
- **Big "10" coin** (Jenny likes it): a double-sized coin worth 10. Big, heavy, satisfying when it tips over the edge.
  Jenny's read of the video: collecting it may make ~10 coins pour down from the top onto the board (a shower of new
  coins in play, not just +10 in your purse). Unclear whether the 10 coin causes Coin Waves or they just happened at
  the same time; either way, "the big coin pays out as a coin shower" is a good idea for ours.

## Open questions

PM's questions, held for the discussion after Jenny finishes gathering (Oct 19):
- Bad prizes: do we want junk you don't want (hairball, cucumber) that the sideways push clears, or is the sideways
  push only bad luck?
- Prize wheel: what sets it off (a wheel coin in the tray, levelling up, the claw, finishing a board)?
- Wheel segments: the cat's faces as the rewards, with one "oops" segment?
- Claw look: robotic claw or a cat toy on a string?
- Prizes: which actions earn which prizes (tray, claw, wheel, clearing a board, every N coins)?
- Charms: one collection per cat world, or one shared cat tree?
- Levelling charms: spend coins, trade in copies, or both? How many levels?
- Coin purse: refill rate while playing and while away; starting cap; how the cap grows.
- Coins, time, or both per board (now that the structure is clearer).
- What the four worlds unlock in: all open from the start, or earned (e.g. with coloured world coins)?
- Announcements: our words for GREAT / PERFECT / NEW AWARD / FELL OFF / CATQUAKE.
- Build order: what first? (PM view: game feel first: high-bouncing coins, +5s, praise pop-ups, CatQuake wave
  and banner; then prizes and the cat tree; then the claw and wheel; then worlds.)

- Coins, time, or both per board (Jenny: decide once the structure is clear).
- What prizes are, what they give, and what coins are *for* beyond playing.
- Which side activities, and what they feed.
- Collections, chests, keys: which ones we want.

## PM notes (what the Play Store goal implies)

- Today's app is a private install updated from OneDrive. A Play Store release needs a Play Console account, a
  signed app bundle, a privacy policy, store listing art, and Play's own updates.
- Progress must be saved: today boards reset on every launch (the save hook is a no-op).
- Purchases need Google Play Billing; licensed audio and art must allow commercial use.
