# Baseline 1 = 2026.11.14 UAT 62 (signed off by Jenny, Nov 15, 2026)

Jenny: "just push it all to production, and anything we perceive as a bug we'll fix first." Sign-off pass:
tickets/SIGNOFF-1.md. Promotion: PROD-05.

**Closed into it:** CP-24 (prizes fall off the sides), CP-33/34 (pickup and sounds), CP-35 (Wild board, superseded),
CP-36 (Dance break), CP-37 (coins vanish, flicker), CP-38 (Wild 2), CP-40 (Paw save), CP-41 (Treat toss), CP-42
(Laser chase), CP-43 (Pet the cat), CP-44 (Tower wall), CP-45 (gameplay map: title, PLAY screen, Kitchen, Porch,
Album, Shop, cat coins), CP-46 (coin sounds added, w5 whoosh pusher), CP-47 (levels and cats, powers, Mouse pounce).
Still open: CP-23 (design, solo), CP-39 (log without file picker).

**Known issues, fixed first (fix tickets):**
1. Playability: level not shown on the board; no pause (timer); screen sleeps while playing (keep awake, with a
   limit); "Main screen" button → "Home"; "Collect these n" doesn't draw the eye.
2. Sound: "This should sound like money" (Jenny, Nov 16): real recordings of coins, piles of change and a cash register;
   no code-made plinks. CP-54 restores the pre-CP-46 coin landing; the cash register follows. Casino feel; the raindrop-like coin sound is far too frequent; more real coin sounds (cash register,
   sliding change); music a little lower. The title screen's coin pile-up uses the same rain-on-a-tin-roof sound
   (Jenny, Nov 15): it should sound like coins dropping. It is the only sound on the title screen, so whatever
   the title screen plays is the sound to replace everywhere.
3. Mouse pounce: the big cat's own mitts should pounce, not small paws from another cat.
4. Cats button: a pop-up to switch cats, greyed with one cat; keep hearts on tap.
5. PLAY-screen coins: remove the pyramid (no coin field for now) and make the PLAY button smaller (Jenny, Nov 16). In CP-49.
6. Developer cleanup (MODES and old test tools). Jenny, Nov 16: clean up the Settings screen so it has only useful
   controls; some settings there were meant to be tested and never were. Next after CP-50; start with a list of every
   setting for her to mark keep/remove.
7. Powers: the Yawn works against the player, so it is a wheel slice only, not a power. The Tuxedo's power becomes
   Formal inspection (a monocle highlights the most valuable coins and prizes; the cane sweeps them forward). (Jenny, Nov 15)
8. Zoomies looks cute but "nothing happens": the kittens should enter at the back and run FORWARD (toward the player),
   not left-right, visibly shoving coins and prizes forward over the front
   edge (for the player), and the pusher's double speed must be obvious (sound and motion). Check every power has a
   clear, felt result. (Jenny, Nov 15)
9. Tortitude: the function is good (Jenny likes it). Only the look: the flames don't read as flames on any board;
   make them obviously fire, and slow it down: it's over too fast to see; give it a wind-up beat (flames build) before
   the blast, then the surge. (Jenny, Nov 15)
10. Sonic meow: Jenny adores it; keep the sound-ring visuals as they are. Add a clear sound to match (a big meow plus a
    sonic "wub" that rises with the rings); check whether a meow already plays and is just too quiet. (Jenny, Nov 15)
11. Hug: the Ragdoll's actual paws/arms must come out over the board (not happening yet); hearts all over the place,
    lots of them; and purring while it lasts. (Art for the Ragdoll comes later; this is the effect.) (Jenny, Nov 15)
12. Level 1 layout: back to production's simple board: 9 rows of coins (5 at the back, then 6 per row; UAT 62 has
    8), no towers. Towers start on later levels. (Jenny, Nov 15, with production and UAT 62 screenshots)
    Every level: the full coin grid, no open gaps; towers stack straight up on grid coins; about 80 coins or
    fewer at the start. In CP-48.
    Level 1 prizes (Jenny, Nov 16): "we're collecting prizes too quickly"; the first board should be very simple with
    just two prizes, the original shrimp and cheese. Proposed for CP-50 with the coin limit.
    Crammed boards stay occasional, never the first board. Prize collection should be harder to achieve (Jenny,
    Nov 16). PM proposal: a balance pass after CP-50 (the slower drop already makes it harder; measure that first):
    fewer bonus prizes, prizes start further back, report win rates before/after. Jenny's idea: fill the space with
    other coins (rain coins, 10s etc.) or prizes that don't get used for much. PM opinion: value coins yes; filler
    prizes only if each pays out (turns into coins on pickup), otherwise they clutter.

**From UAT 64's test (Jenny, Nov 15; CP-48 passed with these for later):**
- The 45-coin limit: she never saw "Board full", only the slowdown; on Level 6 it hit early and "destroyed gameplay".
  Prevent the situation instead: e.g. slower drops on a long press. Next fix ticket after production.
  Jenny, Nov 16: "we need to slow down the drop speed of the coins. Not sure when we speeded those up but long press
  coin drops should move more slowly. Maybe we allow slightly faster speed for very fast tapping", since fast tapping
  shows the player is controlling the drops. PM proposal: CP-51 right after CP-50 (find when the speed changed; hold =
  slower steady stream; fast taps a bit faster; then retire the 45-coin limit if the board can't flood).
- Design talk: packed boards as a rarity; fewer coins, some bigger (reference: Screenshots/ref-other-pusher-fewer-bigger-coins-2026-11-15.webp,
  another game, private, never commit); fewer prizes and harder to collect (not 7 per board). Hard levels 3, 7, 10: later.
- Jenny, Nov 16: "we're going to have to reduce the number of pieces. Maybe increase the size" (like the other dozer
  game). Note: coin size is approved, frozen art (CP-21); bigger coins need Jenny to reopen the coin, and the table
  layout numbers in SPEC.md change with it. Design talk.
  Jenny, Nov 16 (brainstorm, nothing ruled out): "I'm not eager to relitigate the layout of coins on the board. Maybe
  we just need to lighten up on the crammed idea." The starting grid stays as in CP-48 for now. Bigger coins stay open,
  e.g. as big coins that drop onto the board during play (like rain coins), not in the starting layout. Balance pass:
  fewer and lighter crammed boards (Level 4 Crammed: 12 prizes, Level 9 Prize party: 14, towers, rain).
- Jenny, Nov 16: a half-empty board where throwing a few coins does nothing, and you wait for the timer. Maybe the round
  should end instead. PM: a thin board can't pass the push along (a coin pusher needs a carpet of coins), so fewer,
  bigger pieces help this too. Simplest fix: a "Finish" button (end now and keep what you won), or offer it after a
  stretch with no progress; auto-ending is riskier (may feel unfair). Proposed with CP-51 (drop speed changes how
  full the board gets).
  Jenny: yes to Finish, and a pause button since there's a timer (BASE-1 item 1). PM: one Pause button opening Resume /
  Finish / Home; also pause on its own when the app goes to the background. Proposed with CP-51.
- Design talk: patterns as part of the fun (Pixel Flow: a picture made of pieces that you clear; reference
  Screenshots/ref-pixelflow-pattern-2026-11-15.webp, private). Ties in with coloured towers and colour goals.

**Board bottom strip (Jenny, Nov 16, for after UAT 67):**
- Today the bottom right shows the cat name ("TUXEDO"), "Collect all 5!" and three white mitts (Paw saves left).
- The name duplicates the "Tuxedo" tag on the cat, and "Collect all 5!" probably isn't needed.
- Jenny: these "can be redistributed if needed" to make room for bigger goal prizes. She can't read the bottom-left
  collection icons or tell which level she's on. CP-50 moves them above the cat with the level name.
- The goal is visibility of the collection items. The ideas below are options to use only if space is needed, not
  required changes (Jenny).
- After she sees UAT 67, decide a small follow-up:
  - drop the duplicate name and "Collect all 5!";
  - show the Paw saves as a single mitt with a small number badge in its bottom-right corner, like the checks on
    prizes (Jenny's idea), instead of three mitts;
  - possibly a full-width bottom row of big prize icons.

**Old app can't update (Jenny, Nov 15, Nothing Phone/Pixel):** a production app on the Oct 27 build (APK16) shows
"Incomplete app update: The UAT file is missing its app installer" and is stuck. It says "UAT" in production and
gives no way out. Fix ticket: when the app is too old for an update, say so plainly and offer the installer (a link
or the installer in the update file), and never say UAT in production. Before Google Play: decide how app updates
work there (Play updates the app itself; check the in-game updater doesn't fight it).

**Keep, revise later (Jenny, Nov 15):** the Shop stays in the game. It opens after some play (since CP-47: after the
Kitchen, when a recipe needs something no board drops). When it opens and what it does get revised in the Shop design
talk; never drop it.

**Idea (Jenny, Nov 16, "just a thought, maybe not a good one"):** level goals not tied to cooking/recipe prizes at all,
so boards and the Kitchen are two separate games. PM view: clearer, but it cuts the reason boards feed the Kitchen and
leaves goal prizes with no use after the level; middle ground: goal prizes still land in the pantry as a bonus, and goals
never spend anything. For the Kitchen/economy design talk. CP-50's shrimp-and-cheese Level 1 is unaffected for now.
Jenny's follow-up: goal prizes that feed recipes pile up ("far too many", so you stop hunting for any one prize; the
Kitchen already shows 9/1 everywhere). Instead: board goals are things like clearing certain colours from the board;
prizes drop randomly; prizes for a recipe show (are wanted/visible) only once that recipe is unlocked. PM: strong
direction; ties in with coloured towers/colour goals and patterns. Open: what carries colour (the approved coins are
frozen, so coloured tower tops/chips/tokens rather than recoloured coins unless Jenny reopens them); drop rates so
wanted prizes stay scarce; keep the busy multi-drop moments. Design talk after CP-50/CP-51.
Counterpoint (Jenny): a prize list per board makes going back a level useful: players scroll completed levels to find
the prize they need. PM: keep both: each level has a goal (colours etc.) and a "prizes on this board" list; replaying a
passed level is how you hunt a prize. Watch that identical replays don't make farming dull.
Also (Jenny): some prizes impossible to collect early, until you earn powers or tools and come back. PM: good, gives
powers and replays purpose; the locked prize must look locked (cage, ice, behind a wall) and name the power that frees
it, so nobody wastes coins; never on a level's required goal.
Jenny: frozen keys, frozen chests, frozen prizes; or behind a wall, reachable only with a claw grabber (a new tool).
PM: keys + chests give a two-step reward (find the key, open the chest later); the claw grabber could be the cat's own
paw reaching in (ties to Paw save and the mitts), one grab per use.

**Design work next (talks first):** Kitchen as a super-cute merge game with recipe tiers; Porch; Album; Shop; one
kind of coin (economy) and a coin-earning side game; many attractable cats; side games paying into progress;
level variety (bowling-pin reset, smaller coins with more rows, coloured towers and colour goals, themed sets);
Family Island-style tiny goals; music synced to the pusher; art (cats, prizes, Ragdoll hiss, wheel, the Hug: "terrible
artwork, great concept", Nov 15).
Open: the wheel for every cat (not just after a perfect Dance break); switching cats mid-round; names for many boards; replaying old levels; difficulty labels; title hold-until-tap.
