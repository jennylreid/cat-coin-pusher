# CP-92 Endless board, first UAT (Jenny, Nov 19)

Name this conversation "CP-92 Endless board". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md and
CODEX_BRIEF.md; read tickets/CP-23-core-loop.md (sections from "Jenny, Nov 18: timer and waiting" to the end) for the
decided model. You are the engineer; Claude PM reviews.

**Jenny, verbatim (Nov 18-19):**
- "I prefer the idea that the coins run out and you kind of have to go away and wait for coins to refresh to come back."
- "We'll have just an open board. You can just play endlessly as long as you have coins... on that endless board, you
  have the ability to reset it... a meter that has to fill before it enables the player to start a new board."
- "The reset should be a meter that fills first... They have to hang out on a board for a period of time." The sweep pays
  nothing; the meter fills by coins played; a reset is not a level.
- "The meter fills instantly if that board is empty for any reason" (after a power or anything else clears it).
- "The endless board is still going to have all those different board setups available as the starting board... after a
  reset. And we need to create a lot more of those."
- "Let's get an endless board in UAT."

## Do (UAT only; production untouched)
- **Entry:** a Home button "Endless board" (UAT only), next to Board lab, so today's levels stay playable for
  comparison. Pick the cat as today. Never trap the player: Home always works.
- **Coin wallet, no round timer:** coins come from a wallet that persists between sessions. It refills over real time
  (Jenny floated "1 coin a minute"; you pick a sensible start, refill rate and cap and state them). Coins pushed off the
  front go back into the wallet. When the wallet is empty you can't drop; show how long until the next coin.
- **Generosity:** aim for roughly 90 of every 100 coins coming back on an ordinary board (slow loss, lucky runs above).
  Measure it and report the number; Jenny will judge the feel on the phone.
- **Reset meter:** fills by coins played; when full, a reset button lights. Reset = the pusher/cane sweeps the board clear
  (no payout), then a new setup appears in front of the player. If the board is nearly empty for any reason, the meter
  fills at once.
- **Board order:** the existing 10 level boards (and the lab boards Jenny kept in the rotation) are the layouts. First
  pass in a set order from simple to busy; once all are seen, resets pick at random from seen boards. Newly added boards
  go to the end of the order.
- **Keep:** prizes, powers, side games, the wheel and their behaviour as today. No level goals, stars or "level
  complete" on the endless board. Recipes, visiting cats, prize odds and cat switching are later tickets: don't build them.
- Frozen: approved art, and the pickup (DEVELOPER.md "Pickup (frozen)"). No fades.

## Coordination
- Another engineer may be publishing (CP-90 kittens = UAT 117). Before publishing or any heavy run, ask the PM (session
  `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) for your UAT number and whether the channel is free. One heavy runner at a
  time. Long runs: waking watcher.

## Report
Top of `tickets/CP-92.md`: what you built, the numbers (wallet start, refill, cap, measured return per 100 coins, meter
size), small-screen stills (412x915, 360x640) of the wallet, meter and reset, the phone test with a sign-off line. Then
the full regression set and `python work/checkpoint.py`. Never grep or print the 49 MB game JSON files.
