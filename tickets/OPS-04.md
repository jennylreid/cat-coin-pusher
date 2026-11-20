# OPS-04 Package trim: report (engineer, Nov 19)

**Status: UAT 121 built and checked on the published UAT 117 (dev run); waiting for UAT 118-120 to publish, then rebase on
120, re-run the light set and ask the PM before publishing.** PM go (Nov 19): A+B+C plus the CP-90 removal; head-waiting.webp
dropped from the package (approved art, kept in source); UAT 121. Production, the APKs and the 60,000,000-byte guard are untouched.

## Build (work/ops04)
- `build.py`: base release.html minus the CP-90 block (asserted once, no CP90 left), drums path `.wav` to `.flac`, build name.
- `stage.py`: published base JSON pinned (JSON, APK and release.html hashes); every file byte for byte except: 5 removed (2 unused
  + 3 CP-90 art), PNGs over 100 KB re-saved with decoded pixels asserted identical, paw-dance.wav replaced by the FLAC with decoded
  PCM asserted identical (ffmpeg). Result: 76 runtime files. Gates on the checks below; size guard unchanged.
- `gen-checks.py`: UAT 117's suites made into -on121 ones; check 0 = base minus the CP-90 block + edits; the two reference
  builders (72s, 80) no longer add the CP-90 block, so Zoomies is compared with the original.

## Checks so far (dev run on UAT 117; evidence `tickets/OPS-04-evidence/uat121-dev/`)
- `checks121.cjs` 7/7: build recipe; no CP-90 code or "Zoomies kittens" choice; drums load the FLAC; on UAT 117 the build with
  name and drums path set back is UAT 116 byte for byte (Zoomies frame for frame as 116); removed files gone; every other file
  byte for byte except the 11 re-saved PNGs; no newly missing asset path (img/machine_source.webp is named in code but absent and
  never loaded since before UAT 116; noted, not touched).
- Real Chrome, drums (`audiocheck.cjs`): Web Audio decode identical (2,765,074 frames x 2, max difference 0); duration 62.700091 s
  both; playback clock rate 1.00003 vs 0.99999; played from 3 s before the end, ended after 3.061 vs 3.072 s (timer noise).
- Real Chrome boot (`probe121.py`): title shown, no new errors or missing files; requests differ only by the 3 CP-90 files and
  wav to flac.
- Suites on UAT 117 (`run-pre.sh`, logs `work/ops04/logs/`): checks121 7/7, checks64 (frozen pickup) 10/10, checks72 (Zoomies)
  5/5, checks94 (Zoomies) 4/4. checks72's first attempt failed while an orphaned copy of my first (stopped) run was running the
  same suite into the same files; the clean rerun passed. checks72s and checks80 not run: paused at the PM's request (two heavy
  runners on the PC). All these re-run on the UAT 120 base anyway, one runner only.

- checks72 check 1 first failed on UAT 121 exactly as on UAT 120 (Level 3 seed 1: "2 prizes in one Zoomies use"). It was the
  check, not the game: the music-note coin (`note`, now on the Orange board) was missing from its coin list. CP-94 fixed
  `work/cp120/checks72-on120.cjs`; my -on121 copy is regenerated from it. Nothing recorded as pre-existing.
- Confirmed (PM's note): checks72s check 2, which failed on UAT 117 and 118 because the painted kittens were the default,
  passes on UAT 121 (3/3): CP-90 is gone from both the build and checks72s's reference.

## Rebase on UAT 120 (when the PM says the channel is free)
Set `base`/`baseSHA256` in release-version.json to 120's folder; `python build.py`; check its pin to 120's publication manifest;
copy 120's runtime art into `work/ops04/art/` via `python stage.py --boot-only` + `cp boot121/img/art/* art/`;
`python gen-checks.py` from 120's -on120 suites (gen-checks reads `work/cp117`; point it at 120's folder and its added blocks);
`python probe121.py` (new baseline probe of 120 first); `audiocheck.cjs`; `sh run-pre.sh`; ask the PM; `python stage.py`; publish.

## Sizes (measured on the published UAT 117 package; the real base will be UAT 120)
| Step | What | JSON bytes | Saved |
|---|---|---|---|
| Now | UAT 117 as published, 81 runtime files | 59,884,525 | |
| A | remove the 2 provably unused files | 57,987,902 | 1.90 MB |
| B | A + lossless re-save of 11 big PNGs (same names, pixel-identical) | 56,521,742 | 1.47 MB more |
| C | B + paw-dance drums WAV to FLAC (sample-identical; one path in index.html) | 48,072,362 | 8.45 MB more |

UAT 118-120 add their own bytes on top of 117, so the final number moves by those. JSON = base64, so it's 4/3 of the raw bytes.

With the CP-90 removal below (another 0.42 MB): A 57,563,740 / B 56,097,580 / C 47,648,200.

## Intended change (not an unused-file removal): CP-90 painted kittens out
PM, Nov 19, relaying Jenny: "The original zoomies are far cuter... I prefer the original zoomies." UAT 121 removes the
CP-90 block (`work/cp117/cp90-kittens.js`, which holds the "Zoomies kittens" Engineer-tools choice) and its 3 art files
(img/art/cp90-ginger-run.webp 136,672, cp90-cream-run.webp 100,854, cp90-ginger-peek.webp 80,516 bytes).
- Proof it restores UAT 116 exactly: UAT 117's release.html with the block cut out (and the build name set back) is byte for
  byte UAT 116's release.html. The block appears once in UAT 118; nothing else in 118, CP-94 Orange dance, CP-92 Endless or
  work/cp121 refers to CP90. The build will assert one occurrence and zero CP90 references left on the real UAT 120 base.
- To verify after building: checks72 and checks94 (Zoomies) on the staged build.
- The saved choice key `catpusher.uat.cp90kittens.v1` is simply ignored on phones that have it.

## A. Unused files (remove)
| File | Raw bytes | Proof |
|---|---|---|
| img/art/uat18-soft-paw.png | 1,040,404 | 0 references to the name or stem in index.html (the "soft paw" in code loads uat18-small-paw.png); no check script names it; never requested in real Chrome |
| img/art/head-waiting.webp | 382,012 | 0 references; the code comment says "The original toothy Waiting face is saved for a future power"; the game loads head.webp, head-calm, head-sweet, head-wild only; never requested in real Chrome |

- Real-browser proof (`work/ops04/probe.cjs`, headless Chrome, phone size): full UAT 117 runtime and runtime minus both files
  boot identically: the same 78 files requested, no new errors. Every other runtime file is requested at boot (art and sounds load
  up front), so a file never requested is not used. The only file besides these two that's never requested is
  lib/RAPIER-LICENSE.txt (licence, kept). Logs `work/ops04/logs/probe-full.json`, `probe-trimA.json`.
- **PM decision needed on head-waiting.webp:** it's the approved Waiting face (frozen art), unused at runtime. Removing it from the
  package doesn't change or delete the art: copies stay in `work/cp100/art/` to `work/cp103/art/` and the backups. If a future
  power uses it, that build adds it back. SPEC.md line 110 says "active in UAT", which is stale; I'll correct it if you agree.
- Duplicates (cp62-yarn = cp62-yarn-a, etc., 4 pairs, ~66 KB) are each loaded by name in code; not worth a code change. Kept.

## B. Lossless PNG re-save (optional)
11 PNGs over 100 KB re-saved with PIL optimize: decoded RGBA pixels identical byte for byte (checked per file in
`work/ops04/analyse.py`; files in `work/ops04/reenc/`). Same file names, so no code change. What's removed: zlib slack and the
caBX content-credential metadata chunk (not drawn). None of these 11 has a colour chunk (sRGB/gAMA/iCCP), so colour rendering
can't shift. Includes approved coins (uat18-coin-faces, uat18-small-paw), tuna, brass pusher, head-calm: pixels unchanged.

## C. Dancing drums to FLAC (optional, biggest)
sounds/effects/paw-dance.wav (11.06 MB, 62.7 s stereo 16-bit) to FLAC 4.72 MB; decoded PCM identical (sha256 of samples).
Needs one change in index.html (`'sounds/effects/paw-dance.wav'` to `.flac`). Android WebView plays FLAC; still needs the phone
check that the drums play. Not part of the frozen pickup sounds.

## Found in passing (not fixed, out of scope)
- 24 voice clips `sounds/voice/*.mp3` are requested and 404 in every build (not in the package). Pre-existing; presumably the code
  falls back. Worth a backlog look.
- Numbering clash: `work/cp121/release-version.json` (CP-96 Minesweeper puzzles) already calls itself "2026.11.19 UAT 121",
  version 20261119000032, base cp116. This ticket is also UAT 121 per the brief. PM to settle.

## Plan once the PM picks
Copy UAT 120's published runtime, drop A's files (and apply B/C if chosen), stage with the usual guards (published-base pin,
byte-for-byte carry-over of everything else, pixel/sample identity asserted in stage.py), run the change-related checks plus the
real-Chrome probe on the staged runtime, publish UAT 121, then the full regression and `python work/checkpoint.py`.

## Phone test (to fill after publication)
1. Update arrives (Settings shows UAT 121); game boots.
2. Quick look at each cat's board and one power: everything looks as before.
3. Tuxedo Dance break: drums sound and beat exactly as before (the dance lasts the whole track and ends with it).
4. Zoomies: the original kittens (no painted ones); Engineer tools has no "Zoomies kittens" choice.
5. Coin sounds play.
```
OPS-04 UAT 121 signed off: update arrived, game boots, boards and a power look the same, Tuxedo Dance break drums sound and beat exactly as before, Zoomies is the original, sounds play.
```
