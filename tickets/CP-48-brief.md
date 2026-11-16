# CP-48 Freeze fix and simple Level 1 (approved by Jenny, Nov 15)

Name this conversation "CP-48 Freeze fix and simple Level 1". Engineer: read AGENTS.md (the frozen pickup rule
especially), CODEX_BRIEF.md, the top of tickets/CP-47.md ("Freeze investigation") and tickets/BASE-1.md. You are the
engineer; Claude PM reviews. Base: UAT 62 (20261114235959). This is the last UAT build before production (PROD-05),
so keep the scope tight: only these three things.

**Jenny's go (Nov 15):** "one UAT build before production with the freeze fix (coin cap ~100 with a "Board full"
hint, better logging) and Level 1 back to the production layout (9 rows, no towers)."

## 1. Freeze fix
**What happened** (CP-47 report): on the phone the page stopped after she flooded the board from about 53 to about
130 coins in about 30 s; physics went from 3 ms to 45–60 ms a frame (about 14 fps). Seen in 3 logged sessions.
**New from Jenny (Nov 15):** the freeze showed up after she left the board for the main screen: the buttons there
stopped working. So check first:
- Does the board (130 coins) keep simulating or drawing behind the PLAY screen, Kitchen etc.? If so, pause or stop it
  off the board.
- Does anything on the PLAY screen get stuck after leaving a heavy board (an overlay left up, a tap handler lost, a
  long loop on screen change, save of a huge state)? Reproduce on desktop: flood to 130, tap "Main screen", then try
  every button.

**Fix:**
- **Coin cap about 100 on the board.** At the cap, holding or tapping doesn't drop more coins and a short "Board full"
  hint shows (in the existing board-message style). Coins already in the bank stay there. Coins from rain, prizes and
  powers: pick a sensible rule (e.g. rain pauses at the cap) and say what you chose.
- **Keep list:** the busy, crammed board stays; the frozen pickup (DEVELOPER.md "Pickup (frozen)") is untouched,
  including many prizes dropping at once. If the cap would change the pickup, stop and ask the PM.
- **Better logging** so the next freeze tells us the cause: a ring of the last 200 events, saved on the first error;
  long-frame events (over 100 ms) with screen name and coin count; the last 10 taps with their target; peak coins per
  session; screen changes. Saved where the existing UAT diagnostics go.
- Native crash/stall handling (onRenderProcessGone, watchdog) needs an APK: **not in this ticket**; note it for later.

## 2. Level 1 back to the production layout
Level 1 = production's Board 1 layout (Oct 31 build): **9 rows of coins** (5 at the back, then 8 rows of 6, about
53 coins), **no towers**. Jenny's screenshots: production 9 rows, UAT 62 Level 1 with 8 rows and two towers. Level 1's
goal, prizes and tag (Normal) stay as now unless the new layout breaks them. Other levels don't change; check none of
them lost or gained towers by accident.

## 3. Don't touch
Everything else in UAT 62: art, sounds, the pickup, powers, side games, screens. BASE-1's other fix items are later
tickets.

## Test
- Desktop: flood to the cap on Level 1 and Level 6 as the Ragdoll with Hug (her freeze path), then "Main screen" and
  every PLAY-screen button. Frame time at the cap. Level 1 screenshot beside production's.
- Usual build steps: backup to `uat/backups/before-UAT63-<numeric>`, version 20261115…, sound-on checks with strict
  fake audio, fresh cloud download verified, `python work/checkpoint.py`. Production untouched.

## Report
Top of `tickets/CP-48.md`: what you found about the main-screen freeze, the cap rule, logging added, Level 1
before/after, validation, limits. Then a short UAT test plan for Jenny (each item: what to try, what she should see).
Message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Don't start other work.

## 4. Added (Jenny, Nov 15): full coin grid on every level
"every level has the full coin grid (no open gaps), and towers stack straight up on top of grid coins without
moving the grid around them. Each level starts at about 80 coins or fewer; make towers shorter where needed."
Report a table: level, starting coins, tower heights before/after, plus a start screenshot of each level.

## 5. Decided (Jenny, Nov 15): cap = option A
Cap only the player's own dropped coins still on the board (about 45); at the cap, drops slow to 1 a second with
"Board full" (no hard stop). Rain past 100 lands as gold 5s. Full grid on every level, about 80 or fewer at the start
with shorter towers. Report win rate per level, UAT 62 vs UAT 63, and peak coins per level.
