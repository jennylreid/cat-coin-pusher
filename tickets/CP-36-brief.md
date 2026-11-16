# CP-36 Dance break (Wild board prototype)

Name this conversation "CP-36 Dance break". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md. Read CODEX_BRIEF.md, then the top of `tickets/CP-35.md` and `tickets/CP-33.md` (UAT 35 and UAT 36), and the "Core concept" section at the top of GAMEPLAY_DESIGN.md. You are the engineer, and Claude PM reviews your report.

**Why:** Jenny's favorite part of the Wild board is the cat's dance at the end. She wants it to happen mid-game as an earned event with a goal behind it. She approved this on Nov 12: "Trigger: 1 happy meter (each prize fills it; full = dance break), plus a rare music-note coin that fills it at once." And on the dance break itself: "every tap that lands on the beat collects a gold coin for free and they rain down when the music stops. And it can include rain coins, maybe."

This is a **prototype on the Wild board only**, like CP-35. No art or sound approval stops. You make the design calls and publish to UAT when it plays well.

**Baseline:** 2026.11.12 UAT 36 (`work/cp36/`). Keep the UAT 36 behavior: Pop pickup, win card, Wild board.

## Build (Wild board only)
1. **Happy meter.** A visible meter in the HUD.
   - Each prize collected fills it one notch. Pick the notch count so a dance break happens about once per round.
   - When the meter is full, a Dance break starts.
2. **Music-note coin.** A rare coin with a music note on it, drawn in code like the rain coins. It shows up as a bonus drop, and about one per round is fine. Collecting it fills the meter at once.
3. **Dance break, about 8–10 s.**
   - The cat does **one** of its dances. Use the existing Dancing pose; keep the others for later.
   - Music plays with a clear, steady beat, generated in code. Show a beat indicator so on-beat taps are learnable.
   - A dance timer is visible, and the round timer pauses during the break. Tell me if you'd rather not pause it.
   - **Each tap on the beat banks a gold coin.** Show the bank counting up. Off-beat taps bank nothing and don't drop coins.
   - Now and then an on-beat tap banks a rain coin instead.
   - **When the music stops, everything banked rains down at once.** Make it feel big: a roar, a shake, coins pouring in thick. The rain coins land on the board to be pushed off.
4. **Developer dials:** prizes per meter, dance length, beat tempo, on-beat timing window, the rain-coin chance, and a "Start dance break now" button. Values are saved and appear in the performance log.

## Rules
- Approved art stays frozen. The music-note coin, the meter and the beat indicator are new pieces drawn in code.
- Normal boards 1–3 are unchanged. Save, purse and collections aren't touched.
- A big rain spreads its spawns over a short time so it doesn't spike frames. Report desktop frame cost.
- Sounds follow the sound setting and the Pickup volume dial.
- UAT only. Back up first, name it "2026.11.xx UAT n", and verify a fresh cloud download. Production stays untouched.

## Report
At the top of `tickets/CP-36.md`:
- what was built;
- frames of the meter filling, the dance break with the beat indicator, the bank counting, and the rain;
- the tuning;
- limits;
- a short "what to try" list.

Then stop and wait for the PM. Feedback and files go through the PM. Close-out after sign-off: commit and push to C:\Users\jenny\GitHub\cat-coin-pusher naming CP-36. Never commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.
