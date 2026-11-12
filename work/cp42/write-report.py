# One-off: prepends the UAT 42 section to tickets/CP-33.md and moves CODEX_BRIEF's UAT line.
from pathlib import Path
r = Path(__file__).resolve().parents[2]
text = """# CP-33 Prize feedback: UAT 42, Pop at 30%, from where each prize fell (November 12, 2026)

**Published 2026.11.12 UAT 42 / APK7**, numeric **20261112160038**, game-only, UAT only. Built on UAT 41, and nothing else changed.
- **Backup:** `uat/backups/before-UAT42-20261112160038` (UAT 41), verified.
- **Cloud:** a fresh download matches the staged file (HTTP 200, same shared item, ETag 78, 51,478,766 bytes).
- **Production:** byte-identical (hashes checked before and after).
- **Phone receipt:** pending.
- **Source:** `work/cp42/build.py` builds from UAT 41's pinned `work/cp41/release.html`. Evidence: `CP-33-evidence/uat42/`.

**Authorization:** Jenny, relayed by the PM on Nov 12: "Reduce the size of all the prizes to 30% screen size, and I want them all to pop up in different locations on the screen. Based on where they started from."

## Change (the new Pop default: every prize and rain coin, on every board)
- **Size:** Pop peaks at **30% of the screen width**, measured on the visible art. That's 120 of 400 units. The Pop peak size dial now runs from 15% to 120%, with a default of 30%.
- **Where it pops:**
  - It rises from the spot where it went over the ledge to a peak near the same x: within ±28 units, or about 7% of the screen. The peak is 150–240 units up the screen.
  - Each pop gets its own offset and height, and a tilt of 4–15° either way.
  - It is always kept fully on screen and below the header.
  - Then it shrinks and spins into the bag. The spin goes the way it tilts and unwinds the tilt.
- **Never stacked:** while other Pop pickups are on screen (taking turns or overlapping), each new one tries up to 8 spots, widening the search, and takes the one farthest from the others. Three prizes from the same ledge spot peak at least a prize-width apart.
- **Panel:** the striped panel is gone in Pop, replaced with **a small soft shadow** under each prize, slightly below it. I chose a shadow over nothing: at 30% over a board full of gold coins, the shadow lifts the prize off the board.
- **Kept:**
  - the ledge bell, the landing thump and the bag bounce;
  - taking turns;
  - the timings: 0.2 s rise, 0.25 s at peak and 0.45 s shrink, which still feel right at 30%;
  - the Pop dials and the Pop / Current toggle.
- **Quake coin:** unchanged (its own flight and panel).
- **Saved settings:** a phone that had saved Pop settings in UAT 36–41 (for example 100% or Current) starts once on the new Pop at 30%. Every other dial she set is kept. Saved settings move to key v7.
- **Board randomness:** the scatter uses its own random stream, so the board's physics draws exactly the same numbers as before.

## Validation (`CP-33-evidence/uat42/checks.json`: 20 pass, 0 fail)
- **Boards 1–3:**
  - With **Current**, they are identical to UAT 41 after 25 s.
  - With **Pop**, they are identical to UAT 41 until a board is won. After a win, the next board can start sooner, as in UAT 36.
- **Single pops:** cheese, shrimp, tuna, rain 10 and yarn each peak at 120 ± 2 units wide, within 30 units of where they fell, 150–250 up, tilted 4–15°, fully on screen. Each then lands on the bag.
- **Sounds and panel:** the bell, thump and bag bounce all fire, and there's no striped panel. The Quake coin isn't Pop and keeps its panel.
- **Spread:** 300 pops at random ledge spots are all fully on screen, with 63 different offsets, 75 different heights and 24 different tilts.
- **Same spot:** three prizes from the same spot peak at least 125 units apart and still take turns.
- **Current** is UAT 41's flight, point for point.
- **Settings:** the toggle and "Pop peak size: 30%" show in Developer mode. The move to the saved-settings key happens once, and changes after it are kept.
- **Frames** (`CP-33-evidence/uat42/`):
  - Three prizes, left, right and middle, taking turns: `a1-cheese-left-peak`, `a2-cheese-leaving-tuna-waits`, `a3-tuna-right-peak`, `a4-shrimp-middle-peak` and `a5-shrimp-into-bag`.
  - Two prizes from the same spot: `b1-same-spot-first`, `b2-same-spot-second-elsewhere`.
  - `c-edge-tuna-on-screen`: a prize at the screen edge stays on screen.

## Limits and notes
- **Not tested on the phone.** A 30% prize over the gold coins reads well in the desktop frames, but check it on the phone.
- **Over the cat:** a pop can rise over the bottom of the cat's paws when it starts high on the table. It never goes into the header.
- **Wild 2:** I didn't re-run the Wild 2 dance or music checks. This change only touches the pickup flight.

## What to try (sound on)
1. Accept the update. The footer shows **2026.11.12 UAT 42**.
2. Push prizes off at the left, middle and right. Each pops near where it fell, small and tilted, then spins into the bag.
3. Push several off together. They take turns at different spots.
4. Settings → Developer mode → Prize feedback: try **Pop peak size**, or switch **Pickup style** to compare.
5. Tell the PM how it feels.

---

"""
p = r / 'tickets/CP-33.md'; old = p.read_text(encoding='utf-8'); assert 'UAT 42' not in old.split('\n')[0]; p.write_text(text + old, encoding='utf-8')
b = r / 'CODEX_BRIEF.md'; lines = b.read_text(encoding='utf-8').split('\n')
i = next(k for k, l in enumerate(lines) if l.startswith('- UAT: **2026.11.12 UAT 41'))
j = next(k for k, l in enumerate(lines) if l.startswith('- Previous UAT:'))
old41 = lines[i]
lines[i] = ("- UAT: **2026.11.12 UAT 42 / APK7**, numeric 20261112160038 (on top of UAT 41: CP-33 Pop at 30% of the screen, peaking near where "
            "each prize fell with a small offset, tilt and height, never stacked; soft shadow instead of the striped panel; saved pickup settings "
            "key v7. Report at the top of `tickets/CP-33.md`). Game-only. Source `work/cp42/release.html` (`work/cp42/build.py` on pinned UAT 41); "
            "evidence `tickets/CP-33-evidence/uat42/`.")
lines[j] = old41.replace('- UAT:', '- Previous UAT:', 1)
b.write_text('\n'.join(lines), encoding='utf-8')
print('ok')
