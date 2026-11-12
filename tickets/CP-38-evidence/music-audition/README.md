# CP-38 music audition (files only; nothing in the game changed)

1. `music-1-lofi.wav`: Lo-fi cat café. 78 BPM swung, mellow electric-piano 7th chords, a soft muffled beat, vinyl hiss and a little meow at the end (37 s).
2. `music-2-chiptune.wav`: Bouncy arcade chiptune. 150 BPM square-wave tune with an echo, fast arpeggios, a bouncing bass and noise drums (32 s).
3. `music-3-disco.wav`: Funky disco. 116 BPM four-on-the-floor with claps, open hats, an octave bass, string swells and stabs, and a scratchy guitar (33 s).
4. `music-4-kawaii-pop.wav`: Kawaii bubbly pop. 144 BPM bright bell-topped lead, bubbly plucks and a sparkly chorus, with a meow at the chorus end (33 s).
5. `music-5-swing-jazz.wav`: Swing jazz. 150 BPM F blues, walking bass, piano comping and tune, brushes and ride (38 s).
6. `music-6-tropical.wav`: Tropical calypso. 120 BPM steel-drum tune (rolled on long notes), shaker, congas, clave and a strummed offbeat (36 s).

Each file loops seamlessly. All six are equally loud where a phone speaker plays (above 250 Hz): **6 dB over one coin landing**, and about **10 dB louder than the UAT 38 track at its 50% default**. Peaks are 0.14–0.36, well clear of clipping. They're made by `work/cp38-music-audition/make-music.cjs` with the game's own Web Audio calls; the numbers are in `levels.json`.
