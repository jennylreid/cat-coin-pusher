# CP-33 sound audition (Nov 11, 2026)

These are candidate sounds only. Nothing is in a build yet.

- **Ledge sound:** one bright sound as the prize drops over the ledge. Pick one of the five.
- **Landing thump:** a soft thump as it lands in the bag.

The sounds are generated in code with the game's own sound helpers. They're rendered through the same offline Web Audio stand-in as UAT 33, at the game's master level, so they should match what the phone plays. The levels are in `levels.json`.

| File | Sound | Peak | Loudness (RMS) |
|---|---|---|---|
| `ledge-1-jackpot.wav` | Coin jackpot chime: two bright coin clinks, then a rising run of three high bells over a warm tone | 0.27 | 0.049 |
| `ledge-2-sparkle.wav` | Sparkle run: a fast ten-note rising run with an airy shimmer, ending on a high glint | 0.51 | 0.040 |
| `ledge-3-bell.wav` | Bright bell: one big struck bell with a click and an octave shimmer | 0.54 | 0.079 |
| `ledge-4-dingding.wav` | Arcade "ding-ding": two bright pings, the second higher and longer | 0.62 | 0.040 |
| `ledge-5-harp.wav` | Harp sweep: a quick upward glissando of plucked strings that keep ringing | 0.54 | 0.046 |
| `landing-thump.wav` | Soft landing thump: a short, low, quiet thud (about 0.1 s) | 0.16 | 0.017 |

- **Compared with UAT 33's Sound 1:** that full-size sound had a peak of 0.17 and RMS of 0.020. The five ledge sounds are 2–4× louder by RMS.
- **No clipping:** every peak is well under 1.0.
- **Length:** each ledge sound rings for about 0.35–0.6 s.
- **Source:** the candidate code is in `work/cp33/audition.cjs`.
