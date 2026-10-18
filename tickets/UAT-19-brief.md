Name this conversation "UAT-19 Tickle the paws (Claude)". You are the engineer on this one ticket (Codex is the usual engineer on Coin Pusher). Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md, then tickets\UAT-17.md (the paw dance just built on the same paws).

Goal: tickling the cat's paws should look and feel like tickling. Jenny: UAT-17's dance is cute and stays, but "not really what I envisioned for tickling the paws", and Codex's first motion was "way too subtle, barely noticeable". This must be big, obvious and funny.
- Ideas to start from (show Jenny 2 or 3, she picks):
  1. Ticklish paw: the tapped paw jerks back and the toes curl; the cat squirms with a squinty giggle face and a little "mrrp!", then settles.
  2. Tickle fight: a few quick taps and the cat swats playfully at the finger.
  3. Giggle wiggle: the cat wiggles side to side, giggling, like it can't take it.
- Paw taps at rest = tickle only. UAT-17 is renamed "Dancing pose": remove its paw-tap trigger, but keep the dance (motion and drums) on file, previewable from Settings in Developer mode only, like the Happy face preview.
- Only while the cat is resting after Board Clear, as in UAT-17.

Don't change: what taps do during play; the Board Clear flow and its buttons; the cat's approved art and other poses (new frames or transforms are fine, but stay on-model); the dance itself; boards and gameplay; production (UAT only).

Done when, with evidence:
1. Phone-sized clips of each idea, then of the chosen one in the real game.
2. The reaction is unmistakable at phone size: no "barely noticeable" motion.
3. Paw taps at rest never drop a coin or start or skip a board; play taps behave exactly as today.
4. The cat always ends in the approved rest pose, including after rapid taps.

5. The Developer-mode Settings preview plays the dance; with Developer mode off nothing triggers it.

Regression checks (report only if something fails): both boards still win without powers; no drawing slowdown.

Show Jenny the clips (save them in tickets\UAT-19-evidence\ and tell her the paths) and wait for her pick, then wait for her OK before publishing to UAT. Publish the way UAT-17 did (back up first, in-place write that keeps the OneDrive share link, strictly higher version, verify the cloud copy, readable name like "2026.10.16 UAT 2"). No USB/ADB. Report in tickets\UAT-19.md.
