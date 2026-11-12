# One-off: prepends the UAT 36 sections to tickets/CP-33.md and tickets/CP-35.md, and moves CODEX_BRIEF's UAT line.
from pathlib import Path
r = Path(__file__).resolve().parents[2]
pub = """**Published 2026.11.12 UAT 36 / APK7**, numeric **20261112073248**, game-only, UAT only. One build with the CP-35 win card change.
- **Backup:** `uat/backups/before-UAT36-20261112073248` (UAT 35), verified.
- **Cloud:** a fresh download matches the staged file (HTTP 200, same shared item, ETag 72, 51,377,162 bytes).
- **Production:** byte-identical (`phone/` JSON and `CatCoinPusher.apk` hashes checked before and after).
- **Phone receipt:** pending.
- **Source:** `work/cp36/build.py` builds from UAT 35's pinned `work/cp35/release.html`. Evidence: `tickets/UAT-36-evidence/`.
"""
cp33 = """# CP-33 Prize feedback: UAT 36, pickup style "Pop" (November 12, 2026)

""" + pub + """
**Authorization:** Jenny, relayed by the PM on Nov 12: "new pickup = pop to full screen, brief hold, shrink and spin into the bag, with dials and a toggle back to the current one to compare."

## Change
- **Pop (the new default):** a prize or rain coin that goes over the front pops straight to the middle.
  - **Rise:** its visible art fills the screen width in 0.2 s, with a tiny overshoot. This is measured on the art itself (the opaque part), so the tuna, cheese, shrimp, the new Wild prizes and the rain coins all reach the screen edges.
  - **Hold:** it stays at full size for 0.25 s.
  - **Leave:** it shrinks fast (most of the size goes early) and spins flat as it swoops down into the Inventory bag, over 0.45 s. The spin uses the existing **Spin** dial (1 turn).
  - Pop drops the long rest at medium size, the tilt and the off-centre position.
  - From going over the ledge to landing in the bag takes 0.9 s, against 1.35 s before.
- **Kept:** the ledge bell, the landing thump, the bag bounce and taking turns. The 3rd pickup onwards holds half as long.
- **Striped panel:** it grows and shrinks with the prize, around its art plus padding. At the peak it is full-width and stays inside the screen.
- **Quake coin:** it keeps its own flight (70% size, flies to the Quake button).
- **Developer → Prize feedback:**
  - **Pickup style: Pop / Current (UAT 34)**, a toggle at the top. It defaults to Pop. Current is UAT 34/35's flight, unchanged.
  - **Pop peak size:** 40-120% of screen width, default 100%.
  - **Pop time at peak:** 0-1.5 s, default 0.25 s.
  - **Pop shrink time:** 0.15-1.2 s, default 0.45 s.
  - All of these are saved on the phone. Reset tuning returns to Pop and the Pop defaults. The Preview pickup button shows whichever style is on.
- **Rain coins:** their visible disc is now counted as 95% of the drawn box (it was 100%), so "fills the screen" is true for them. This makes a rain coin about 5% bigger at the peak in Current style too.

## Validation (`UAT-36-evidence/checks.json`: 49 pass, 0 fail)
- **Rise, peak and leave:**
  - Cheese, shrimp, tuna, yarn and rain 5/10/25 each rise in 0.2 s and are 400 ± 2 units wide (the full screen) at the peak, centred.
  - Each holds 0.25 s, then is under 40% of peak size halfway through the shrink, spins, and ends exactly on the bag at the end size.
  - Each plays the ledge bell, the cheese also plays the thump, and the bag bounces.
- **Other checks:**
  - The Quake coin isn't Pop.
  - Pickups take turns.
  - The toggle and the three dials show in Developer mode and are saved across a restart.
  - **Current** matches UAT 35's flight point for point.
- **Boards 1-3:**
  - With **Current**, they are identical to UAT 35 after 25 s of play.
  - With **Pop**, they are identical until a board is won. After a win, the game waits for pickups to finish before moving on, so the next board comes about half a second sooner. That is the only gameplay difference.
- **Frames:**
  - Pop sequences: `pop-cheese-1-rising`, `-2-peak`, `-3-shrink-spin`, and the same for tuna and shrimp.
  - `pop-rain10-peak`, and `current-style-cheese-held` for comparison.

## Limits and notes
- **Sharpness:** at full screen the approved art is drawn bigger than ever before. It looks clean in the desktop frames, but check its sharpness on the phone.
- **Rain timing:** on the Wild board, rain starts when the rain coin is held up, which is now about 0.35 s after pickup instead of about 0.6 s.
- **Quake next to Pop:** the Quake coin's slower flight (0.35 s rise, 0.7 s held, 0.8 s flight, 70% size) may now feel slow and small beside Pop. This is the PM's call. A matching "Quake Pop" would be a small follow-up.
- **No phone evidence yet.**

## What to try (sound on)
1. Accept the update. The footer shows **2026.11.12 UAT 36**.
2. Push a cheese, shrimp or tuna off the front. It pops to fill the screen, holds a moment, then spins down into the bag with the bell and thump.
3. Settings → Developer mode → Prize feedback: tap **Pickup style** to switch to **Current (UAT 34)**, then **Preview pickup** to compare. Switch back.
4. Try **Pop peak size**, **Pop time at peak** and **Pop shrink time**.
5. Tell the PM which style to keep, with any dial values.

---

"""
cp35 = """# CP-35 UAT 36: smaller, lower win card so the dancing cat stays in view (November 12, 2026)

""" + pub + """
**Authorization:** Jenny, relayed by the PM on Nov 12: "win card smaller and lower so the cat dances in view".

## Change
- **Win, Time's up and Out of coins** now share a smaller card (340 x 262), placed at y 446, just below the cat. Over a full dance, the paws' lowest claw reaches about y 432. Before, the card started at about y 324 and covered the paws and the cat's chin.
- **The big word** (YOU WIN! / TIME'S UP! / OUT OF COINS!) now sits on the top edge of the card, slightly smaller, instead of across the cat's face. It still pops in first, and the card follows.
- **Card content is unchanged:** the prize count with the 7 icons ticked, the time to spare (or which ran out), the stats line, **PLAY AGAIN** and **Back to the game**.
- **Short screens** (H 720): the card still fits and covers the bottom HUD while it's up.

## Validation
- **Checks:** the card's top is at 446, PLAY AGAIN and Back sit inside the card, and the card fits the screen. The whole CP-35 suite re-ran on UAT 36: win, both lose cards, Play again, Back and EXIT all pass (49 pass in total).
- **Frames** (`tickets/UAT-36-evidence/`):
  - `win-card-1-word`, then `win-card-2-card` to `-5-dance`: the whole cat, face and paws, is visible while it dances.
  - `lose-card-times-up`, `lose-card-out-of-coins` and `short-screen-720-lose-card`.

## What to try
1. Win a Wild round. The cat dances fully in view above the card.
2. Lose once each way, and check the card reads well.
3. Use PLAY AGAIN and Back to the game.

---

"""
for name, text in (('tickets/CP-33.md', cp33), ('tickets/CP-35.md', cp35)):
    p = r / name; old = p.read_text(encoding='utf-8'); assert 'UAT 36' not in old.split('\n')[0]; p.write_text(text + old, encoding='utf-8')
b = r / 'CODEX_BRIEF.md'; lines = b.read_text(encoding='utf-8').split('\n')
i = next(k for k, l in enumerate(lines) if l.startswith('- UAT: **2026.11.11 UAT 35'))
j = next(k for k, l in enumerate(lines) if l.startswith('- Previous UAT: **2026.11.11 UAT 34'))
old35 = lines[i]
lines[i] = ("- UAT: **2026.11.12 UAT 36 / APK7**, numeric 20261112073248 (on top of UAT 35: CP-33 pickup style Pop (default) with Pop dials and a "
            "Pop/Current toggle; CP-35 win/lose card smaller and below the cat; reports at the top of `tickets/CP-33.md` and `tickets/CP-35.md`). "
            "Game-only, complete 37-file runtime. Source `work/cp36/release.html` (rebuild with `work/cp36/build.py` from pinned UAT 35); "
            "evidence `tickets/UAT-36-evidence/`.")
lines[j] = old35.replace('- UAT:', '- Previous UAT:', 1)
b.write_text('\n'.join(lines), encoding='utf-8')
print('ok')
