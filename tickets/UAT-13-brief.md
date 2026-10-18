Name this conversation "UAT-13 Messages off the cat's face". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

Goal: The on-screen messages must never cover the cat's face, and must be easy to read over the gold coins.
- "Board Clear!" currently sits over the cat's face. Show it lower, over the table.
- "Shrimp cleared" and "Cheese cleared" float upward onto the cat's face. Their rise must stop short of the face.
- Some messages use yellow text, which disappears against gold coins. Every message must stay readable over a full pile of coins.

Don't change: the messages' wording, sounds, timing and animation style (other than where the rise stops); the cat, its faces, paws and poses; the board, coins, ledge and layout; gameplay and balance; production.

Done when, with evidence:
1. Phone-sized before/after screenshots of each message (Board Clear!, Shrimp cleared, Cheese cleared, and any other message you changed), taken over a full board of coins.
2. None of them overlaps the cat's face at any point of its animation.
3. Each is clearly readable over the gold coins.

Regression checks (report only if something fails): both boards still win without powers; no drawing slowdown; the art and layout are otherwise unchanged.

Show me the before/after and wait for my OK before publishing to UAT. Report in tickets\UAT-13.md.
